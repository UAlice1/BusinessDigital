'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import PaymentModal from '@/components/PaymentModal'

interface SelectedBusiness {
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

export default function HomePage() {
  const router = useRouter()
  const [pendingBusiness, setPendingBusiness] = useState<SelectedBusiness | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false)

  // Step 1: user selects a business from search → create pending assessment → show payment
  async function handleBusinessSelected(business: SelectedBusiness) {
    setIsCreatingAssessment(true)
    try {
      // Create a lightweight pending record (no AI yet — just store the business)
      const res = await fetch('/api/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(business),
      })
      if (!res.ok) throw new Error()
      const data = await res.json() as { assessmentId: string }
      sessionStorage.setItem('selectedBusiness', JSON.stringify(business))
      sessionStorage.setItem('assessmentId', data.assessmentId)
      setAssessmentId(data.assessmentId)
      setPendingBusiness(business)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsCreatingAssessment(false)
    }
  }

  // Step 2: payment success → go to assess (which now runs AI)
  function handlePaymentSuccess(ref: string) {
    sessionStorage.setItem('paymentRef', ref)
    router.push('/assess')
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 pt-0">
        <HeroSection onSelect={handleBusinessSelected} isLoading={isCreatingAssessment} />
      </div>

      {/* Footer links */}
      <div className="py-4 flex items-center justify-center gap-6">
        {[
          { label: 'How It Works', href: '/how-it-works' },
          { label: 'Pricing',      href: '/pricing'      },
          { label: 'About',        href: '/about'        },
        ].map(({ label, href }) => (
          <a key={label} href={href} className="text-xs text-gray-400 hover:text-primary transition-colors font-medium">
            {label}
          </a>
        ))}
      </div>

      {/* Payment modal appears immediately after business is selected */}
      {pendingBusiness && assessmentId && (
        <PaymentModal
          assessmentId={assessmentId}
          businessName={pendingBusiness.name}
          businessSector={pendingBusiness.sector}
          businessLocation={pendingBusiness.location}
          onSuccess={handlePaymentSuccess}
          onClose={() => { setPendingBusiness(null); setAssessmentId(null) }}
        />
      )}
    </main>
  )
}

