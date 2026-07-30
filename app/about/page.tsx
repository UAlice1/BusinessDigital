import Link from 'next/link'

export const metadata = {
  title: 'About — PryroDigital',
  description: 'PryroDigital helps Rwandan businesses understand and improve their digital maturity with AI-powered assessments.',
}

const dimensions = [
  {
    title: 'Website Presence',
    desc: 'Do you have a functional, discoverable website? We check if your business is visible and accessible online.',
  },
  {
    title: 'Social Media Activity',
    desc: 'Are you active on the platforms your customers use? We assess your social media footprint across key networks.',
  },
  {
    title: 'Online Payments',
    desc: 'Can customers pay you digitally — via MoMo, card, or online checkout? We evaluate your payment options.',
  },
  {
    title: 'Google Visibility',
    desc: 'Can people find you on Google Maps and Search? We check your Google Business presence and review scores.',
  },
  {
    title: 'Digital Tools',
    desc: 'Are you using software to manage operations, customers, or inventory? We look at your internal tech stack.',
  },
  {
    title: 'Data & Analytics',
    desc: 'Do you track performance and make data-driven decisions? We assess whether you measure what matters.',
  },
]

export default function AboutPage() {
  return (
    <main
      className="min-h-screen bg-white"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          About PryroDigital
        </h1>

        {/* Intro */}
        <p className="text-sm text-gray-700 leading-relaxed mb-10 max-w-2xl">
          PryroDigital is an AI-powered platform that helps businesses in Rwanda understand
          where they stand digitally — and gives them a clear, affordable roadmap to grow.
          From small shops to growing SMEs, we make professional digital strategy accessible to everyone.
        </p>

        {/* Mission */}
        <h2 className="text-sm font-bold text-gray-900 mb-2">Our Mission</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-10 max-w-2xl">
          Most small and medium businesses in Rwanda don&apos;t have access to the kind of digital
          strategy advice that larger companies take for granted. PryroDigital changes that —
          by making a professional-grade digital assessment available to any business,
          in under 10 minutes, for just 100 RWF.
        </p>

        {/* What we assess */}
        <h2 className="text-sm font-bold text-gray-900 mb-6">What We Assess</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8 mb-12">
          {dimensions.map((d) => (
            <div key={d.title}>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{d.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>

        {/* Built with */}
        <h2 className="text-sm font-bold text-gray-900 mb-2">Built With</h2>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          PryroDigital uses <strong className="text-gray-800">Google Gemini AI</strong> and{' '}
          <strong className="text-gray-800">Groq</strong> for analysis and recommendations,{' '}
          <strong className="text-gray-800">Google Places API</strong> for real business data,
          and <strong className="text-gray-800">MTN MoMo</strong> for seamless local payments —
          all built on a <strong className="text-gray-800">Next.js</strong> platform.
        </p>

      </div>
    </main>
  )
}
