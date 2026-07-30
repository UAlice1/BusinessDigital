import { NextRequest, NextResponse } from 'next/server'
import { analyzeBusinessDigitalization } from '@/lib/groq'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string
      sector: string
      location: string
      website?: string
      rating?: number
      reviewCount?: number
      googlePlaceId?: string
      address?: string
      phoneNumber?: string
    }

    const { name, sector, location, website, rating, reviewCount, googlePlaceId, address, phoneNumber } = body

    if (!name || !sector || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run AI analysis
    const analysis = await analyzeBusinessDigitalization(name, sector, location, {
      website,
      rating,
      reviewCount,
      googlePlaceId,
    })

    // Find or create business record
    let business
    if (googlePlaceId) {
      // For Google-sourced businesses, upsert by googlePlaceId
      const existing = await prisma.business.findFirst({ where: { googlePlaceId } })
      if (existing) {
        business = await prisma.business.update({
          where: { id: existing.id },
          data: {
            website: website ?? undefined,
            rating: rating ?? undefined,
            reviewCount: reviewCount ?? undefined,
          },
        })
      } else {
        business = await prisma.business.create({
          data: {
            name,
            sector,
            location,
            googleProfileUrl: `https://maps.google.com/?q=${encodeURIComponent(name)}`,
            googlePlaceId,
            website: website ?? null,
            phoneNumber: phoneNumber ?? null,
            rating: rating ?? null,
            reviewCount: reviewCount ?? null,
            address: address ?? null,
          },
        })
      }
    } else {
      // For manually entered businesses, find by name+location or create
      const existing = await prisma.business.findFirst({
        where: { name, location },
      })
      if (existing) {
        business = existing
      } else {
        business = await prisma.business.create({
          data: {
            name,
            sector,
            location,
            website: website ?? null,
            phoneNumber: phoneNumber ?? null,
            address: address ?? null,
          },
        })
      }
    }

    // Create a pending assessment
    const assessment = await prisma.assessment.create({
      data: {
        businessId: business.id,
        userName: '',
        userPhone: '',
        initialScore: analysis.overallScore,
        scoreBreakdown: analysis.breakdown as object,
        currentState: analysis.currentState,
        keyStrengths: analysis.keyStrengths,
        gaps: analysis.gaps,
        paymentStatus: 'pending',
      },
    })

    return NextResponse.json({
      analysis,
      businessId: business.id,
      assessmentId: assessment.id,
    })
  } catch (err) {
    console.error('Business analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
