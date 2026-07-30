'use client'

interface Recommendation {
  priority: 'High' | 'Medium' | 'Low'; action: string; impact: string
  estimatedCost: 'Low' | 'Medium' | 'High'; timeline: string; tools: string[]
}
interface Business { name: string; sector: string; location: string }
interface Props { business: Business; recommendations: Recommendation[]; initialScore: number; onDownloadCertificate: () => void }

function getScoreInfo(s: number) {
  if (s >= 80) return { label: 'Digital Leader',     color: '#2563eb' }
  if (s >= 60) return { label: 'Digitally Active',   color: '#2563eb' }
  if (s >= 40) return { label: 'Digitally Emerging', color: '#2563eb' }
  return             { label: 'Digital Beginner',    color: '#2563eb' }
}

export default function RecommendationsView({ business, recommendations, initialScore, onDownloadCertificate }: Props) {
  const si = getScoreInfo(initialScore)
  return (
    <div className="space-y-5 animate-fade-in">

      {/* Summary */}
      <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-sans font-bold text-xl text-gray-900">{business.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{business.sector} · {business.location}</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: si.color }}>{initialScore}</div>
          <div className="text-xs text-gray-400">/100</div>
          <div className="text-sm font-bold mt-0.5" style={{ color: si.color }}>{si.label}</div>
        </div>
      </div>

      {/* Completion banner */}
      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-sans font-bold text-lg text-gray-900">Assessment Complete</h3>
          <p className="text-gray-600 text-sm mt-1">Your AI-powered digitalization roadmap is ready.</p>
        </div>
        <button onClick={onDownloadCertificate} className="btn-primary shrink-0">
          Get Certificate
        </button>
      </div>

      {/* Recommendations */}
      <div>
        <p className="label-upper mb-4">Your Digitalization Roadmap</p>
        <div className="space-y-0 divide-y divide-gray-100">
          {recommendations.map((rec, i) => (
            <div key={i} className="py-5">
              <div className="flex items-start gap-4">
                <span className="text-sm font-bold text-gray-400 shrink-0 w-5 pt-0.5">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{rec.action}</h4>
                  <p className="text-sm text-gray-500 mb-2 leading-relaxed">{rec.impact}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>{rec.priority} Priority</span>
                    <span>·</span>
                    <span>{rec.estimatedCost} Cost</span>
                    <span>·</span>
                    <span>{rec.timeline}</span>
                    {rec.tools?.length > 0 && (
                      <>
                        <span>·</span>
                        {rec.tools.map((tool) => (
                          <span key={tool} className="text-primary font-medium">{tool}</span>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-8 border-t border-gray-100">
        <p className="text-gray-500 text-sm mb-4">Save your results and share your digital transformation journey.</p>
        <button onClick={onDownloadCertificate} className="btn-primary px-8 py-4 text-base">
          Download Your Certificate
        </button>
      </div>
    </div>
  )
}

