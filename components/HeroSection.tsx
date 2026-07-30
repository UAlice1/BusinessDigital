'use client'

import BusinessSearch from './BusinessSearch'

interface BusinessResult {
  id?: string
  googlePlaceId?: string
  name: string
  sector: string
  location: string
  address?: string
  rating?: number
  reviewCount?: number
  website?: string
  description?: string
}

interface Props {
  onSelect: (business: BusinessResult) => void
  isLoading?: boolean
}

export default function HeroSection({ onSelect, isLoading }: Props) {
  return (
    <section className="bg-white min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-16">

      {/* Headline */}
      <h1
        className="font-sans font-bold text-gray-900 leading-tight text-center mb-10"
        style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
      >
        Is Your Business<br />Digitally Ready?
      </h1>

      {/* Search bar */}
      <div className="w-full max-w-2xl">
        <BusinessSearch
          onSelect={onSelect}
          isLoading={isLoading}
          placeholder="Search your business name..."
        />
        <p className="text-center text-gray-300 text-xs mt-4">
          The business must be registered on Google to be assessed
        </p>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {[
            { label: 'How It Works', href: '/how-it-works' },
            { label: 'Pricing',      href: '/pricing'      },
            { label: 'About',        href: '/about'        },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-gray-400 hover:text-primary transition-colors font-medium"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

    </section>
  )
}

