'use client'

interface DigitalAnalysis {
  overallScore: number
  breakdown: { website: number; social: number; payment: number; customerEngagement: number; digitalPresence: number }
  currentState: string; keyStrengths: string[]; gaps: string[]
}
interface Business { name: string; sector: string; location: string }
interface Props { business: Business; analysis: DigitalAnalysis; onStartAssessment: () => void }

const dimensionLabels: Record<string, string> = {
  website: 'Website', social: 'Social Media', payment: 'Payments',
  customerEngagement: 'Engagement', digitalPresence: 'Visibility',
}
const dimensionIcons: Record<string, string> = {
  website: '🌐', social: '📱', payment: '💳', customerEngagement: '🤝', digitalPresence: '📍',
}

function ScoreGauge({ score }: { score: number }) {
  const color  = '#4F6EF7'
  const label  = score >= 80 ? 'Digital Leader' : score >= 60 ? 'Digitally Active' : score >= 40 ? 'Digitally Emerging' : 'Digital Beginner'
  const radius = 54, circ = Math.PI * radius
  const progress = (score / 100) * circ
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <svg width="140" height="80" viewBox="0 0 140 80" aria-hidden="true">
          <path d="M 16 72 A 54 54 0 0 1 124 72" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round"/>
          <path d="M 16 72 A 54 54 0 0 1 124 72" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${progress} ${circ}`} style={{ transition: 'stroke-dasharray 1s ease' }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <div className="mt-1 text-sm font-bold" style={{ color }}>{label}</div>
    </div>
  )
}

export default function ScoreCard({ business, analysis, onStartAssessment }: Props) {
  return (
    <div className="space-y-4">

      {/* Score card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h2 className="font-sans font-bold text-xl text-gray-900">{business.name}</h2>
            <p className="text-sm text-gray-500">{business.sector} · {business.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScoreGauge score={analysis.overallScore}/>
          <div className="space-y-3">
            {Object.entries(analysis.breakdown).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{dimensionLabels[key]}</span>
                <span className="text-gray-700 font-semibold">{val}/20</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current state */}
      <div className="card p-5">
        <p className="label-upper mb-2">Current Digital State</p>
        <p className="text-gray-600 text-sm leading-relaxed">{analysis.currentState}</p>
      </div>

      {/* Strengths & gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/> Key Strengths
          </p>
          <ul className="space-y-2">
            {analysis.keyStrengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 shrink-0 mt-0.5 text-xs font-bold">✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"/> Digital Gaps
          </p>
          <ul className="space-y-2">
            {analysis.gaps.map((g, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5 text-xs">•</span>{g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA — payment already done, just continue */}
      <div className="card p-8 text-center border-2 border-primary">
        <h3 className="font-sans font-bold text-2xl text-gray-900 mb-2">
          Ready to get your full report?
        </h3>
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          Answer 12 quick questions and our AI will generate your personalised
          digitalization roadmap and certificate.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {['12 Questions', 'AI Recommendations', 'PDF Certificate'].map((item) => (
            <span key={item} className="text-xs text-gray-500 border border-gray-200 rounded-md px-3 py-1.5">{item}</span>
          ))}
        </div>
        <button onClick={onStartAssessment} className="btn-primary text-base px-8 py-4">
          Continue to Assessment →
        </button>
      </div>
    </div>
  )
}

