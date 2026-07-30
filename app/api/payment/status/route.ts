import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/mtn'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const referenceId = searchParams.get('referenceId')
  const assessmentId = searchParams.get('assessmentId')

  if (!referenceId || !assessmentId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const paymentStatus = await getPaymentStatus(referenceId)

    if (paymentStatus.status === 'SUCCESSFUL') {
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          paymentStatus: 'completed',
          paymentRef: referenceId,
        },
      })
    } else if (paymentStatus.status === 'FAILED') {
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: { paymentStatus: 'failed' },
      })
    }

    return NextResponse.json({ status: paymentStatus.status })
  } catch (err) {
    console.error('Payment status error:', err)
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 })
  }
}
