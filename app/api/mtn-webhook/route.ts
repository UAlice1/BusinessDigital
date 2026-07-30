import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// MTN MoMo webhook for payment callbacks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      externalId?: string
      status?: string
      financialTransactionId?: string
    }

    const { externalId, status, financialTransactionId } = body

    if (!externalId) {
      return NextResponse.json({ received: true })
    }

    if (status === 'SUCCESSFUL') {
      await prisma.assessment.updateMany({
        where: {
          id: externalId,
          paymentStatus: { not: 'completed' },
        },
        data: {
          paymentStatus: 'completed',
          paymentRef: financialTransactionId ?? externalId,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('MTN webhook error:', err)
    return NextResponse.json({ received: true })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook active' })
}
