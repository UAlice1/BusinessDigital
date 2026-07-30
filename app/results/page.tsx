'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import RecommendationsView from '@/components/RecommendationsView'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Recommendation {
  priority: 'High' | 'Medium' | 'Low'; action: string; impact: string
  estimatedCost: 'Low' | 'Medium' | 'High'; timeline: string; tools: string[]
}
interface Business { name: string; sector: string; location: string }

export default function ResultsPage() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [initialScore, setInitialScore] = useState(0)

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedBusiness')
    const aid = sessionStorage.getItem('assessmentId')
    const answers = sessionStorage.getItem('answers')
    const userName = sessionStorage.getItem('userName')
    const userPhone = sessionStorage.getItem('userPhone')
    if (!stored || !aid || !answers || !userName || !userPhone) { router.push('/'); return }
    const biz = JSON.parse(stored) as Business
    setBusiness(biz); setAssessmentId(aid)
    generateResults(biz, aid, JSON.parse(answers) as Record<string, string | string[]>, userName, userPhone)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateResults(biz: Business, aid: string, answers: Record<string, string | string[]>, userName: string, userPhone: string) {
    setIsLoading(true); setError(null)
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: aid, answers, userName, userPhone, businessName: biz.name, sector: biz.sector, location: biz.location }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json() as { recommendations: Recommendation[]; initialScore: number }
      setRecommendations(data.recommendations); setInitialScore(data.initialScore)
    } catch { setError('Failed to generate recommendations. Please try again.') }
    finally { setIsLoading(false) }
  }

  function handleDownloadCertificate() {
    if (assessmentId) router.push(`/certificate/${assessmentId}`)
  }

  if (!business) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-14">
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">Home</button>
              <span className="text-gray-300">/</span>
              <span className="text-gray-700">{business.name}</span>
              <span className="text-gray-300">/</span>
              <span className="text-primary font-semibold">Results</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 border border-gray-200 rounded-md px-3 py-1 font-medium">Step 3 of 3</span>
              {!isLoading && recommendations.length > 0 && (
                <button onClick={handleDownloadCertificate} className="btn-primary text-xs py-2 px-4">
                  Get Certificate
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {isLoading ? (
            <div className="text-center py-32">
              <LoadingSpinner size="lg" />
              <p className="mt-6 text-gray-600 font-medium">Generating your recommendations…</p>
              <p className="text-gray-400 text-sm mt-2">Crafting a personalized roadmap for {business.name}</p>
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-red-400 text-sm mb-5">{error}</p>
              <button onClick={() => router.push('/questionnaire')}
                className="px-6 py-2.5 bg-[#7c6ef7] text-white rounded-xl text-sm font-medium hover:bg-[#6a5ce8]">
                Try Again
              </button>
            </div>
          ) : (
            <RecommendationsView business={business} recommendations={recommendations}
              initialScore={initialScore} onDownloadCertificate={handleDownloadCertificate} />
          )}
        </div>
      </div>
    </div>
  )
}
