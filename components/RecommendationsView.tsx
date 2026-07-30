'use client'

interface RoadmapItem {
  action: string; why: string; howTo: string
  effort: string; estimatedCost: string; timeline: string; tools: string[]
}
interface GrowthAction { action: string; detail: string; estimatedImpact: string }
interface FullReport {
  sectionA: { quickWins: RoadmapItem[]; mediumTerm: RoadmapItem[]; longTerm: RoadmapItem[] }
  sectionB: {
    visibilityScore: number; digitalizationScore: number
    currentReach: string; potentialReach: string; revenueIncreaseEstimate: string
    seoTips: GrowthAction[]; socialMediaStrategy: GrowthAction[]
    localMarketing: GrowthAction[]; customerRetention: GrowthAction[]
  }
  recommendations: Array<{ priority: string; action: string; impact: string; estimatedCost: string; timeline: string; tools: string[] }>
}
interface Business { name: string; sector: string; location: string }
interface Props {
  business: Business
  recommendations: FullReport['recommendations']
  report?: FullReport
  initialScore: number
  onDownloadCertificate: () => void
}

function getScoreInfo(s: number) {
  if (s >= 80) return { label: 'Digital Leader' }
  if (s >= 60) return { label: 'Digitally Active' }
  if (s >= 40) return { label: 'Digitally Emerging' }
  return { label: 'Digital Beginner' }
}

export default function RecommendationsView({ business, recommendations, report, initialScore, onDownloadCertificate }: Props) {
  const si = getScoreInfo(initialScore)
  const hasFullReport = !!report?.sectionA && !!report?.sectionB
  const qLen = report?.sectionA?.quickWins?.length ?? 0
  const mLen = report?.sectionA?.mediumTerm?.length ?? 0

  return (
    <div className="animate-fade-in" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Business header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-sm text-gray-400 mt-1">{business.sector} · {business.location}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-primary">{initialScore}</div>
          <div className="text-xs text-gray-400">/100</div>
          <div className="text-sm font-bold text-primary mt-0.5">{si.label}</div>
        </div>
      </div>

      {hasFullReport ? (
        <>
          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 pb-8 mb-8">
            {[
              { label: 'Visibility Score',      value: `${report.sectionB.visibilityScore}/10` },
              { label: 'Digitalization Score',  value: `${report.sectionB.digitalizationScore}/10` },
              { label: 'Current Reach',         value: report.sectionB.currentReach },
              { label: 'Revenue Potential',     value: report.sectionB.revenueIncreaseEstimate },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Two columns: Section A left, Section B right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">

            {/* LEFT — Section A */}
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Section A</p>
              <h2 className="text-lg font-bold text-gray-900 mb-8">Digitalization Roadmap</h2>

              {/* Quick Wins */}
              {report.sectionA.quickWins?.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Wins — 0 to 3 months</p>
                  <div className="space-y-6">
                    {report.sectionA.quickWins.map((item, i) => (
                      <div key={i}>
                        <p className="text-sm font-bold text-gray-900 mb-1">{i + 1}. {item.action}</p>
                        <p className="text-sm text-gray-500 mb-1 leading-relaxed">{item.why}</p>
                        {item.howTo && <p className="text-xs text-gray-400 italic mb-2">{item.howTo}</p>}
                        <p className="text-xs text-gray-400">{item.timeline} · Effort: {item.effort} · Cost: {item.estimatedCost}{item.tools?.length > 0 ? ` · ${item.tools.join(', ')}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Term */}
              {report.sectionA.mediumTerm?.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Medium Term — 3 to 6 months</p>
                  <div className="space-y-6">
                    {report.sectionA.mediumTerm.map((item, i) => (
                      <div key={i}>
                        <p className="text-sm font-bold text-gray-900 mb-1">{qLen + i + 1}. {item.action}</p>
                        <p className="text-sm text-gray-500 mb-1 leading-relaxed">{item.why}</p>
                        {item.howTo && <p className="text-xs text-gray-400 italic mb-2">{item.howTo}</p>}
                        <p className="text-xs text-gray-400">{item.timeline} · Effort: {item.effort} · Cost: {item.estimatedCost}{item.tools?.length > 0 ? ` · ${item.tools.join(', ')}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long Term */}
              {report.sectionA.longTerm?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Long Term — 6 to 12 months</p>
                  <div className="space-y-6">
                    {report.sectionA.longTerm.map((item, i) => (
                      <div key={i}>
                        <p className="text-sm font-bold text-gray-900 mb-1">{qLen + mLen + i + 1}. {item.action}</p>
                        <p className="text-sm text-gray-500 mb-1 leading-relaxed">{item.why}</p>
                        {item.howTo && <p className="text-xs text-gray-400 italic mb-2">{item.howTo}</p>}
                        <p className="text-xs text-gray-400">{item.timeline} · Effort: {item.effort} · Cost: {item.estimatedCost}{item.tools?.length > 0 ? ` · ${item.tools.join(', ')}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — Section B */}
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Section B</p>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Popularity & Growth Strategy</h2>
              {report.sectionB.potentialReach && (
                <p className="text-xs text-gray-400 mb-8">Potential reach: {report.sectionB.potentialReach}</p>
              )}

              {[
                { title: 'SEO & Online Visibility',  items: report.sectionB.seoTips },
                { title: 'Social Media Strategy',    items: report.sectionB.socialMediaStrategy },
                { title: 'Local Marketing',          items: report.sectionB.localMarketing },
                { title: 'Customer Retention',       items: report.sectionB.customerRetention },
              ].map(({ title, items }) => items?.length > 0 && (
                <div key={title} className="mb-8">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</p>
                  <div className="space-y-6">
                    {items.map((item, i) => (
                      <div key={i}>
                        <p className="text-sm font-bold text-gray-900 mb-1">{item.action}</p>
                        <p className="text-sm text-gray-500 mb-1 leading-relaxed">{item.detail}</p>
                        {item.estimatedImpact && (
                          <p className="text-xs text-primary font-medium">{item.estimatedImpact}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </>
      ) : (
        /* Fallback flat list */
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Your Digitalization Roadmap</p>
          <div className="space-y-6">
            {recommendations.map((rec, i) => (
              <div key={i}>
                <p className="text-sm font-bold text-gray-900 mb-1">{i + 1}. {rec.action}</p>
                <p className="text-sm text-gray-500 mb-1">{rec.impact}</p>
                <p className="text-xs text-gray-400">{rec.priority} Priority · {rec.estimatedCost} Cost · {rec.timeline}{rec.tools?.length > 0 ? ` · ${rec.tools.join(', ')}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom CTA ── */}
      <div className="pt-12 mt-8 text-center">
        <p className="text-sm text-gray-400 mb-4">Save your results and share your digital transformation journey.</p>
        <button onClick={onDownloadCertificate} className="btn-primary px-8 py-3 text-sm">
          Download Your Certificate
        </button>
      </div>

    </div>
  )
}
