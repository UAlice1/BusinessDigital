import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        business: true,
        certificate: true,
      },
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    return NextResponse.json({
      businessName: assessment.business.name,
      sector: assessment.business.sector,
      location: assessment.business.location,
      userName: assessment.userName,
      initialScore: assessment.initialScore,
      scoreBreakdown: assessment.scoreBreakdown,
      aiRecommendations: assessment.aiRecommendations,
      createdAt: assessment.createdAt.toISOString(),
      certificateId: assessment.certificate?.id ?? id,
    })
  } catch (err) {
    console.error('Certificate fetch error:', err)
    return NextResponse.json({ error: 'Failed to load certificate' }, { status: 500 })
  }
}
