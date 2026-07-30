import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { requestToPay } from '@/lib/mtn'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      assessmentId: string
      phoneNumber: string
    }
    const { assessmentId, phoneNumber } = body

    if (!assessmentId || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Normalize: strip formatting, ensure starts with 250
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '')
    const normalized = cleanPhone.startsWith('+')
      ? cleanPhone.slice(1)
      : cleanPhone.startsWith('0')
      ? '250' + cleanPhone.slice(1)
      : cleanPhone

    // Verify assessment exists
    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } })
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const referenceId = uuidv4()

    await requestToPay(referenceId, {
      amount: '100',
      currency: 'RWF',        // lib overrides to EUR in sandbox automatically
      externalId: assessmentId,
      partyId: normalized,
      payerMessage: 'PryroDigital - Business Assessment',
      payeeNote: `Assessment ${assessmentId}`,
    })

    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        paymentRef: referenceId,
        paymentPhone: normalized,
        paymentStatus: 'pending',
      },
    })

    return NextResponse.json({ referenceId, status: 'pending' })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Payment initiate error:', message)
    return NextResponse.json(
      { error: 'Payment initiation failed', detail: message },
      { status: 500 }
    )
  }
}
