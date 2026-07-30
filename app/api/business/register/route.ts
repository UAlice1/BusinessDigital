import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string
      sector: string
      location: string
      googlePlaceId?: string
      website?: string
      phoneNumber?: string
      rating?: number
      reviewCount?: number
      address?: string
    }

    const { name, sector, location, googlePlaceId, website, phoneNumber, rating, reviewCount, address } = body

    if (!name || !sector || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find or create business
    let business
    if (googlePlaceId) {
      const existing = await prisma.business.findFirst({ where: { googlePlaceId } })
      if (existing) {
        business = existing
      } else {
        business = await prisma.business.create({
          data: { name, sector, location, googlePlaceId, website: website ?? null, phoneNumber: phoneNumber ?? null, rating: rating ?? null, reviewCount: reviewCount ?? null, address: address ?? null },
        })
      }
    } else {
      const existing = await prisma.business.findFirst({ where: { name, location } })
      business = existing ?? await prisma.business.create({
        data: { name, sector, location, website: website ?? null, phoneNumber: phoneNumber ?? null, address: address ?? null },
      })
    }

    // Create a pending assessment (no AI score yet — runs after payment)
    const assessment = await prisma.assessment.create({
      data: {
        businessId: business.id,
        userName: '',
        userPhone: '',
        initialScore: 0,
        scoreBreakdown: {},
        paymentStatus: 'pending',
      },
    })

    return NextResponse.json({ assessmentId: assessment.id, businessId: business.id })
  } catch (err) {
    console.error('Business register error:', err)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
