'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'

interface CertificateData {
  businessName: string; sector: string; location: string; userName: string
  initialScore: number; scoreBreakdown: Record<string, number>
  aiRecommendations: {
    recommendations: Array<{
      priority: string; action: string; impact: string
      estimatedCost: string; timeline: string; tools: string[]
    }>
  }
  createdAt: string; certificateId: string
}

export default function CertificatePage() {
  const params = useParams(); const router = useRouter()
  const id = params.id as string
  const [certData, setCertData] = useState<CertificateData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchCertificate() }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchCertificate() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/certificate/${id}`)
      if (!res.ok) throw new Error()
      setCertData(await res.json() as CertificateData)
    } catch { setError('Certificate not found.') }
    finally { setIsLoading(false) }
  }

  async function handleDownload() {
    setIsDownloading(true)
    try {
      const res = await fetch(`/api/certificate/${id}/download`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `PryroDigital-Certificate-${id}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch { alert('Download failed. Please try again.') }
    finally { setIsDownloading(false) }
  }

  const getColor = (s: number) => s >= 70 ? '#16a34a' : s >= 40 ? '#ca8a04' : '#dc2626'
  const getLabel = (s: number) =>
    s >= 80 ? 'Digital Leader' : s >= 60 ? 'Digitally Active' : s >= 40 ? 'Digitally Emerging' : 'Digital Beginner'

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400 text-sm">Loading certificate…</p>
      </div>
    </div>
  )

  if (error || !certData) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-[#7c6ef7] text-white rounded-xl text-sm font-medium hover:bg-[#6a5ce8]">
          Start New Assessment
        </button>
      </div>
    </div>
  )

  const top3 = certData.aiRecommendations?.recommendations?.slice(0, 3) ?? []
  const date = new Date(certData.createdAt).toLocaleDateString('en-RW', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const color = getColor(certData.initialScore)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-14">
        <div className="max-w-3xl mx-auto px-4 py-10">

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => router.push('/')}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              ← New Assessment
            </button>
            <button onClick={handleDownload} disabled={isDownloading}
              className="px-5 py-2.5 bg-[#7c6ef7] text-white rounded-xl font-semibold text-sm hover:bg-[#6a5ce8] transition-colors disabled:opacity-50 flex items-center gap-2">
              {isDownloading ? <LoadingSpinner size="sm" /> : '⬇️'} Download PDF
            </button>
          </div>

          {/* Certificate card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

            {/* Header */}
            <div className="border-b border-gray-100 px-8 py-7 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">PryroDigital</p>
              <h1 className="text-2xl font-bold text-gray-900">Digital Transformation Certificate</h1>
              <p className="text-gray-400 text-sm mt-1">Business Digitalization Assessment</p>
            </div>

            {/* Score banner */}
            <div className="border-b border-gray-100 px-8 py-6 flex items-center justify-between gap-4 bg-gray-50">
              <div>
                <p className="text-xs text-gray-400 mb-1">This certifies that</p>
                <h2 className="text-2xl font-bold text-gray-900">{certData.businessName}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{certData.sector} · {certData.location}</p>
              </div>
              <div className="text-center shrink-0">
                <div className="text-5xl font-black" style={{ color }}>{certData.initialScore}</div>
                <div className="text-xs text-gray-400">/ 100</div>
                <div className="text-sm font-semibold mt-1" style={{ color }}>{getLabel(certData.initialScore)}</div>
              </div>
            </div>

            <div className="px-8 py-7 space-y-7">

              {/* Issued to */}
              <div className="flex justify-between text-sm text-gray-500 pb-5 border-b border-gray-100">
                <span>Issued to: <strong className="text-gray-800">{certData.userName}</strong></span>
                <span>Date: <strong className="text-gray-800">{date}</strong></span>
              </div>

              {/* Score breakdown */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Score Breakdown</p>
                <div className="space-y-3">
                  {Object.entries(certData.scoreBreakdown).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      website: 'Website Quality', social: 'Social Media',
                      payment: 'Online Payments', customerEngagement: 'Customer Engagement',
                      digitalPresence: 'Digital Presence',
                    }
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-40 shrink-0">{labels[key] ?? key}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-[#7c6ef7] h-1.5 rounded-full" style={{ width: `${(value / 20) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-10 text-right font-medium">{value}/20</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top recommendations */}
              {top3.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Top 3 Recommendations</p>
                  <div className="space-y-3">
                    {top3.map((rec, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-[#7c6ef7] font-bold text-sm shrink-0">{i + 1}.</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{rec.action}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{rec.timeline} · Cost: {rec.estimatedCost}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 pt-5 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-300">Certificate ID: {certData.certificateId}</p>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Verify at: pryrodigital.rw/verify/{certData.certificateId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-500">PryroDigital</p>
                  <p className="text-xs text-gray-400">Powered by AI</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-300 mt-6">
            Share your achievement and inspire others to digitalize their businesses.
          </p>
        </div>
      </div>
    </div>
  )
}
