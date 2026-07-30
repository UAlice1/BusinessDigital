'use client'

interface RoadmapItem {
  action: string; why: string; howTo: string
  effort: string; estimatedCost: string; timeline: string; tools: string[]
}
interface GrowthAction { action: string; detail: string; estimatedImpact: string }
interface FullReport {
  sectionA: {
    quickWins: RoadmapItem[]
    mediumTerm: RoadmapItem[]
    longTerm: RoadmapItem[]
  }
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
  if (s >= 80) return { label: 'Digital Leader',     color: '#2563eb' }
  if (s >= 60) return { label: 'Digitally Active',   color: '#2563eb' }
  if (s >= 40) return { label: 'Digitally Emerging', color: '#2563eb' }
  return             { label: 'Digital Beginner',    color: '#2563eb' }
}

function RoadmapSection({ title, items, index }: { title: string; items: RoadmapItem[]; index: number }) {
  if (!items?.length) return null
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
      <div className="space-y-0 divide-y divide-gray-100">
        {items.map((item, i) => (
          <div key={i} className="py-5">
            <div className="flex items-start gap-4">
              <span className="text-sm font-bold text-gray-300 shrink-0 w-5 pt-0.5">{index + i + 1}.</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.action}</h4>
                <p className="text-sm text-gray-500 mb-1 leading-relaxed">{item.why}</p>
                {item.howTo && (
                  <p className="text-xs text-gray-400 mb-2 leading-relaxed italic">{item.howTo}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>{item.timeline}</span>
                  <span>·</span>
                  <span>Effort: {item.effort}</span>
                  <span>·</span>
                  <span>Cost: {item.estimatedCost}</span>
                  {item.tools?.length > 0 && (
                    <>
                      <span>·</span>
                      {item.tools.map(t => (
                        <span key={t} className="text-primary font-medium">{t}</span>
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
  )
}

function GrowthSection({ title, items }: { title: string; items: GrowthAction[] }) {
  if (!items?.length) return null
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
      <div className="space-y-0 divide-y divide-gray-100">
        {items.map((item, i) => (
          <div key={i} className="py-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.action}</h4>
            <p className="text-sm text-gray-500 mb-1 leading-relaxed">{item.detail}</p>
            {item.estimatedImpact && (
              <p className="text-xs text-primary font-medium">{item.estimatedImpact}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RecommendationsView({ business, recommendations, report, initialScore, onDownloadCertificate }: Props) {
  const si = getScoreInfo(initialScore)
  const hasFullReport = !!report?.sectionA && !!report?.sectionB

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Score summary */}
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

      {hasFullReport ? (
        <>
          {/* ── SECTION A: Digitalization Roadmap ── */}
          <div>
            <p className="label-upper mb-1">Section A</p>
            <h2 className="font-sans font-bold text-gray-900 text-lg mb-6">Digitalization Roadmap</h2>
            <div className="space-y-8">
              <RoadmapSection title="Quick Wins — 0 to 3 months" items={report.sectionA.quickWins} index={1} />
              <RoadmapSection title="Medium Term — 3 to 6 months" items={report.sectionA.mediumTerm} index={(report.sectionA.quickWins?.length ?? 0) + 1} />
              <RoadmapSection title="Long Term — 6 to 12 months" items={report.sectionA.longTerm} index={(report.sectionA.quickWins?.length ?? 0) + (report.sectionA.mediumTerm?.length ?? 0) + 1} />
            </div>
          </div>

          {/* ── SECTION B: Growth & Visibility ── */}
          <div className="pt-4 border-t border-gray-100">
            <p className="label-upper mb-1">Section B</p>
            <h2 className="font-sans font-bold text-gray-900 text-lg mb-2">Popularity & Growth Strategy</h2>

            {/* Scores + reach */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              {[
                { label: 'Visibility Score',       value: `${report.sectionB.visibilityScore}/10` },
                { label: 'Digitalization Score',   value: `${report.sectionB.digitalizationScore}/10` },
                { label: 'Current Reach',          value: report.sectionB.currentReach },
                { label: 'Revenue Potential',      value: report.sectionB.revenueIncreaseEstimate },
              ].map(({ label, value }) => (
                <div key={label} className="card p-4">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug">{value}</p>
                </div>
              ))}
            </div>
            {report.sectionB.potentialReach && (
              <p className="text-sm text-gray-500 mb-6">
                <strong className="text-gray-700">Potential reach:</strong> {report.sectionB.potentialReach}
              </p>
            )}

            <div className="space-y-8">
              <GrowthSection title="SEO & Online Visibility" items={report.sectionB.seoTips} />
              <GrowthSection title="Social Media Strategy" items={report.sectionB.socialMediaStrategy} />
              <GrowthSection title="Local Marketing" items={report.sectionB.localMarketing} />
              <GrowthSection title="Customer Retention" items={report.sectionB.customerRetention} />
            </div>
          </div>
        </>
      ) : (
        /* Fallback — flat list if full report unavailable */
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
                          {rec.tools.map(t => <span key={t} className="text-primary font-medium">{t}</span>)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
