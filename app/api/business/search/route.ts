import { NextRequest, NextResponse } from 'next/server'
import { searchBusinessesWithGroq } from '@/lib/groq'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')?.trim() ?? ''

  if (query.length < 2) {
    return NextResponse.json({ places: [] })
  }

  try {
    const businesses = await searchBusinessesWithGroq(query)

    const places = businesses.map((b) => ({
      name:          b.name,
      sector:        b.sector,
      location:      b.location,
      address:       b.address,
      country:       b.country,
      website:       b.website ?? null,
      description:   b.description ?? null,
      googlePlaceId: null,
      rating:        null,
      reviewCount:   null,
    }))

    return NextResponse.json({ places })
  } catch (err: any) {
    console.error('Groq search error:', err?.message)
    return NextResponse.json(
      { places: [], error: 'Search failed. Please try again.' },
      { status: 500 }
    )
  }
}
