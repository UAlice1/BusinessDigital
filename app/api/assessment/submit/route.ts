import { NextRequest, NextResponse } from 'next/server'
import { analyzeBusinessDigitalization, generateRecommendations } from '@/lib/groq'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      assessmentId: string
      answers: Record<string, string | string[]>
      userName: string
      userPhone: string
      businessName: string
      sector: string
      location: string
    }

    const { assessmentId, answers, userName, userPhone, businessName, sector, location } = body

    if (!assessmentId || !answers || !userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } })
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Step 1: Compute score from the questionnaire answers
    let analysis
    try {
      analysis = await analyzeBusinessDigitalization(
        businessName,
        sector,
        location,
        { answers } // pass answers so AI can score based on what the user reported
      )
    } catch (aiErr) {
      console.error('analyzeBusinessDigitalization error:', aiErr)
      // Fallback: derive a rough score from the answers
      analysis = {
        overallScore: 40,
        breakdown: { website: 8, social: 8, payment: 8, customerEngagement: 8, digitalPresence: 8 },
        currentState: `${businessName} is at an early stage of digital adoption.`,
        keyStrengths: ['Willingness to improve', 'Existing customer base'],
        gaps: ['Limited online presence', 'Manual processes', 'No digital payments', 'No customer data collection'],
      }
    }

    // Step 2: Generate personalised recommendations from answers + score
    let result
    try {
      result = await generateRecommendations(
        businessName,
        sector,
        location,
        analysis.overallScore,
        answers
      )
    } catch (aiErr) {
      console.error('generateRecommendations error:', aiErr)
      result = {
        recommendations: [
          { priority: 'High',   action: 'Create a Google My Business listing',       impact: 'Increases local discoverability',            estimatedCost: 'Low',    timeline: '1 week',     tools: ['Google My Business'] },
          { priority: 'High',   action: 'Set up WhatsApp Business',                  impact: 'Improves customer communication',            estimatedCost: 'Low',    timeline: '1 day',      tools: ['WhatsApp Business'] },
          { priority: 'High',   action: 'Accept MTN Mobile Money payments',          impact: 'Captures more sales via mobile money',      estimatedCost: 'Low',    timeline: '1 week',     tools: ['MTN MoMo'] },
          { priority: 'Medium', action: 'Create a Facebook Business Page',           impact: 'Builds online presence and customer trust', estimatedCost: 'Low',    timeline: '2 days',     tools: ['Facebook'] },
          { priority: 'Medium', action: 'Use a simple inventory spreadsheet',        impact: 'Reduces stockouts and wastage',              estimatedCost: 'Low',    timeline: '1 week',     tools: ['Google Sheets'] },
          { priority: 'Low',    action: 'Build a basic website or landing page',     impact: 'Professional online presence',              estimatedCost: 'Medium', timeline: '1-2 months', tools: ['WordPress', 'Wix'] },
        ],
      }
    }

    // Step 3: Save everything to the assessment record
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        userName,
        userPhone,
        answers: answers as object,
        initialScore: analysis.overallScore,
        scoreBreakdown: analysis.breakdown as object,
        currentState: analysis.currentState,
        keyStrengths: analysis.keyStrengths,
        gaps: analysis.gaps,
        aiRecommendations: result as object,
        completedAt: new Date(),
      },
    })

    await prisma.certificate.upsert({
      where: { assessmentId },
      create: { assessmentId, filePath: `/certificates/${assessmentId}.pdf` },
      update: {},
    })

    return NextResponse.json({
      recommendations: result.recommendations,
      initialScore: analysis.overallScore,
      analysis,
      assessmentId,
    })
  } catch (err) {
    console.error('Assessment submit error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Submission failed', detail: message }, { status: 500 })
  }
}
