'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AssessmentForm from '@/components/AssessmentForm'

interface Business {
  id?: string; name: string; sector: string; location: string
  googlePlaceId?: string; website?: string; phoneNumber?: string
  rating?: number; reviewCount?: number; address?: string
}

export default function AssessPage() {
  const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedBusiness')
    const paymentRef = sessionStorage.getItem('paymentRef')
    const aid = sessionStorage.getItem('assessmentId')
    if (!stored || !paymentRef || !aid) { router.push('/'); return }
    setBusiness(JSON.parse(stored) as Business)
    setAssessmentId(aid)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleFormSubmit(answers: Record<string, string | string[]>, userName: string, userPhone: string) {
    sessionStorage.setItem('answers', JSON.stringify(answers))
    sessionStorage.setItem('userName', userName)
    sessionStorage.setItem('userPhone', userPhone)
    router.push('/results')
  }

  if (!business || !assessmentId) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">

        {/* Breadcrumb */}
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-3 text-xs text-gray-500 font-medium">
            <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">
              Home
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 truncate max-w-[160px]">{business.name}</span>
            <span className="text-gray-300">/</span>
            <span className="text-primary font-semibold">Assessment</span>
          </div>

        {/* Intro header */}
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-4 text-center">
          <p className="label-upper mb-2">Digital Readiness Assessment</p>
          <h1 className="font-sans font-bold text-2xl text-gray-900">{business.name}</h1>
          <p className="text-gray-400 text-sm mt-2">
            Answer the questions below honestly — your score and recommendations are based on your answers.
          </p>
        </div>

        {/* Assessment form */}
        <div className="max-w-2xl mx-auto px-4 pb-16">
          <AssessmentForm
            business={business}
            assessmentId={assessmentId}
            onSubmit={handleFormSubmit}
          />
        </div>

      </div>
    </div>
  )
}

