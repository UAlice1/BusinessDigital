'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AssessmentForm from '@/components/AssessmentForm'

interface Business { id?: string; name: string; sector: string; location: string }

export default function QuestionnairePage() {
  const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedBusiness')
    const aid = sessionStorage.getItem('assessmentId')
    const paymentRef = sessionStorage.getItem('paymentRef')
    if (!stored || !aid || !paymentRef) { router.push('/'); return }
    setBusiness(JSON.parse(stored) as Business); setAssessmentId(aid)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(answers: Record<string, string | string[]>, userName: string, userPhone: string) {
    sessionStorage.setItem('answers', JSON.stringify(answers))
    sessionStorage.setItem('userName', userName)
    sessionStorage.setItem('userPhone', userPhone)
    router.push('/results')
  }

  if (!business || !assessmentId) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-14">
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3 text-xs text-gray-500 font-medium">
            <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">Home</button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700">{business.name}</span>
            <span className="text-gray-300">/</span>
            <span className="text-primary font-semibold">Assessment</span>
            <span className="ml-auto border border-gray-200 rounded-md px-3 py-1 text-gray-500">Step 2 of 3</span>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <AssessmentForm business={business} assessmentId={assessmentId} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

