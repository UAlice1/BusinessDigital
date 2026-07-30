import { NextRequest, NextResponse } from 'next/server'
import { analyzeBusinessDigitalization, generateFullReport } from '@/lib/groq'
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
      description?: string
    }
    const { assessmentId, answers, userName, userPhone, businessName, sector, location, description } = body

    if (!assessmentId || !answers || !userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } })
    if (!assessment) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })

    // Step 1 — score the business
    let analysis
    try {
      analysis = await analyzeBusinessDigitalization(businessName, sector, location, { answers })
    } catch {
      analysis = {
        overallScore: 40,
        breakdown: { website: 8, social: 8, payment: 8, customerEngagement: 8, digitalPresence: 8 },
        currentState: `${businessName} is at an early stage of digital adoption.`,
        keyStrengths: ['Willingness to improve', 'Existing customer base'],
        gaps: ['Limited online presence', 'Manual processes', 'No digital payments'],
      }
    }

    // Step 2 — generate full two-section report
    let report
    try {
      report = await generateFullReport(businessName, sector, location, analysis.overallScore, answers, description)
    } catch {
      report = {
        sectionA: {
          quickWins: [
            { action: 'Create a Google My Business listing', why: 'Increases local discoverability', howTo: 'Go to business.google.com and follow the setup wizard', effort: 'Low' as const, estimatedCost: 'Low' as const, timeline: '0-3 months', tools: ['Google My Business'] },
            { action: 'Set up WhatsApp Business', why: 'Improves customer communication', howTo: 'Download WhatsApp Business app and set up your profile', effort: 'Low' as const, estimatedCost: 'Low' as const, timeline: '0-3 months', tools: ['WhatsApp Business'] },
            { action: 'Accept MTN Mobile Money payments', why: 'Captures more sales', howTo: 'Register as MTN MoMo merchant via *182#', effort: 'Low' as const, estimatedCost: 'Low' as const, timeline: '0-3 months', tools: ['MTN MoMo'] },
          ],
          mediumTerm: [
            { action: 'Create a Facebook Business Page', why: 'Builds online presence', howTo: 'Go to facebook.com/pages/create', effort: 'Low' as const, estimatedCost: 'Low' as const, timeline: '3-6 months', tools: ['Facebook'] },
            { action: 'Start email marketing', why: 'Retain customers', howTo: 'Use Mailchimp free plan to send monthly newsletters', effort: 'Medium' as const, estimatedCost: 'Low' as const, timeline: '3-6 months', tools: ['Mailchimp'] },
            { action: 'Set up basic inventory tracking', why: 'Reduce stockouts', howTo: 'Use Google Sheets to track stock weekly', effort: 'Low' as const, estimatedCost: 'Low' as const, timeline: '3-6 months', tools: ['Google Sheets'] },
          ],
          longTerm: [
            { action: 'Build a simple website', why: 'Professional online presence', howTo: 'Use WordPress or Wix for a 3-page site', effort: 'Medium' as const, estimatedCost: 'Medium' as const, timeline: '6-12 months', tools: ['WordPress', 'Wix'] },
            { action: 'Implement a CRM system', why: 'Manage customer relationships', howTo: 'Start with HubSpot free CRM', effort: 'High' as const, estimatedCost: 'Medium' as const, timeline: '6-12 months', tools: ['HubSpot'] },
          ],
        },
        sectionB: {
          visibilityScore: 4,
          digitalizationScore: 4,
          currentReach: 'Primarily local walk-in customers',
          potentialReach: 'City-wide and potentially national audience',
          revenueIncreaseEstimate: '20-40% increase in 12 months',
          seoTips: [
            { action: 'Optimize Google My Business', detail: 'Add photos, hours, and respond to reviews', estimatedImpact: '+30% local search visibility' },
            { action: 'Use local keywords on your website', detail: 'Include city name and sector in page titles', estimatedImpact: '+20% organic traffic' },
            { action: 'Get listed in local directories', detail: 'Add business to Rwanda Yellow Pages and Irembo', estimatedImpact: '+15% online presence' },
          ],
          socialMediaStrategy: [
            { action: 'Post 3x per week on Facebook', detail: 'Share products, behind-the-scenes, and promotions', estimatedImpact: '+40% follower growth in 3 months' },
            { action: 'Use Instagram Reels for product demos', detail: 'Short 15-30 second videos showing your products', estimatedImpact: '+60% reach vs static posts' },
            { action: 'Run a referral campaign on WhatsApp', detail: 'Ask customers to share your WhatsApp Business link', estimatedImpact: '+25% new customers' },
          ],
          localMarketing: [
            { action: 'Partner with complementary local businesses', detail: 'Cross-promote with businesses serving the same customers', estimatedImpact: '+20% new customer acquisition' },
            { action: 'Offer a loyalty program', detail: 'Simple stamp card or digital loyalty via WhatsApp', estimatedImpact: '+30% repeat purchase rate' },
          ],
          customerRetention: [
            { action: 'Send monthly SMS updates', detail: 'Use bulk SMS to notify customers of promotions', estimatedImpact: '+35% repeat visits' },
            { action: 'Collect customer feedback', detail: 'Use a Google Form after each purchase', estimatedImpact: 'Identifies top 3 improvement areas' },
          ],
        },
        recommendations: [
          { priority: 'High' as const, action: 'Create a Google My Business listing', impact: 'Increases local discoverability', estimatedCost: 'Low' as const, timeline: '1 week', tools: ['Google My Business'] },
          { priority: 'High' as const, action: 'Set up WhatsApp Business', impact: 'Improves customer communication', estimatedCost: 'Low' as const, timeline: '1 day', tools: ['WhatsApp Business'] },
          { priority: 'High' as const, action: 'Accept MTN Mobile Money payments', impact: 'Captures more mobile sales', estimatedCost: 'Low' as const, timeline: '1 week', tools: ['MTN MoMo'] },
          { priority: 'Medium' as const, action: 'Create a Facebook Business Page', impact: 'Builds online presence', estimatedCost: 'Low' as const, timeline: '2 days', tools: ['Facebook'] },
          { priority: 'Medium' as const, action: 'Use a simple inventory spreadsheet', impact: 'Reduces stockouts', estimatedCost: 'Low' as const, timeline: '1 week', tools: ['Google Sheets'] },
          { priority: 'Low' as const, action: 'Build a basic website', impact: 'Professional online presence', estimatedCost: 'Medium' as const, timeline: '1-2 months', tools: ['WordPress', 'Wix'] },
        ],
      }
    }

    // Step 3 — save to DB
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        userName, userPhone, answers: answers as object,
        initialScore: analysis.overallScore,
        scoreBreakdown: analysis.breakdown as object,
        currentState: analysis.currentState,
        keyStrengths: analysis.keyStrengths,
        gaps: analysis.gaps,
        aiRecommendations: report as object,
        completedAt: new Date(),
      },
    })

    await prisma.certificate.upsert({
      where: { assessmentId },
      create: { assessmentId, filePath: `/certificates/${assessmentId}.pdf` },
      update: {},
    })

    return NextResponse.json({
      recommendations: report.recommendations,
      report,
      initialScore: analysis.overallScore,
      analysis,
      assessmentId,
    })
  } catch (err) {
    console.error('Assessment submit error:', err)
    return NextResponse.json({ error: 'Submission failed', detail: err instanceof Error ? err.message : 'Unknown' }, { status: 500 })
  }
}
