import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCertificatePDF } from '@/lib/certificate'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { business: true, certificate: true },
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const pdfBuffer = await generateCertificatePDF({
      businessName: assessment.business.name,
      sector: assessment.business.sector,
      location: assessment.business.location,
      userName: assessment.userName,
      initialScore: assessment.initialScore,
      scoreBreakdown: assessment.scoreBreakdown as Record<string, number>,
      aiRecommendations: assessment.aiRecommendations as {
        recommendations: Array<{
          priority: string
          action: string
          impact: string
          estimatedCost: string
          timeline: string
          tools: string[]
        }>
      },
      createdAt: assessment.createdAt.toISOString(),
      certificateId: assessment.certificate?.id ?? id,
    })

    // Increment download count
    if (assessment.certificate) {
      await prisma.certificate.update({
        where: { assessmentId: id },
        data: {
          downloadCount: { increment: 1 },
        },
      })
    }

    await prisma.assessment.update({
      where: { id },
      data: { downloadedAt: new Date() },
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="PryroDigital-Certificate-${id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (err) {
    console.error('Certificate download error:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
