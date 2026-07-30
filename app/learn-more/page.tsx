import Link from 'next/link'

export const metadata = {
  title: 'Learn More — PryroDigital',
  description: 'Learn how PryroDigital helps businesses in Rwanda assess and improve their digital maturity with AI.',
}

export default function LearnMorePage() {
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
          What is PryroDigital?
        </h1>

        <p className="text-sm text-gray-700 leading-relaxed mb-10 max-w-2xl">
          PryroDigital is an AI-powered business digitalization assessment platform built for
          Rwanda and East Africa. We help any business — whether it is a small shop, a growing
          SME, or an established company — understand exactly where they stand digitally and
          what steps to take to grow online.
        </p>

        {/* What we do */}
        <h2 className="text-sm font-bold text-gray-900 mb-2">What We Do</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-10 max-w-2xl">
          A business owner searches for their business on our platform. We analyze their
          digital footprint — website, social media, online payments, Google visibility —
          and produce a personalized report with two sections: a digitalization roadmap
          (quick wins, medium-term goals, and long-term investments) and a growth strategy
          (SEO tips, social media plan, local marketing, and customer retention advice).
          The whole process takes under 10 minutes and costs 100 RWF paid via MTN Mobile Money.
        </p>

        {/* Why it matters */}
        <h2 className="text-sm font-bold text-gray-900 mb-2">Why It Matters</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-10 max-w-2xl">
          Most small and medium businesses in Rwanda do not have access to professional
          digital strategy consulting. Large agencies are expensive and often irrelevant
          to local market realities. PryroDigital bridges that gap — bringing the quality
          of a professional digital audit to any business owner, at a price anyone can
          afford, in a language and context that makes sense for the African market.
        </p>

        {/* How the report works */}
        <h2 className="text-sm font-bold text-gray-900 mb-4">What the Report Covers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8 mb-12">
          {[
            {
              title: 'Digital Maturity Score',
              desc: 'A score out of 100 showing how digitally advanced your business is across 5 key dimensions — website, social media, payments, customer engagement, and online visibility.',
            },
            {
              title: 'Quick Wins (0–3 months)',
              desc: 'Low-effort, low-cost actions you can take immediately to improve your digital presence — like setting up WhatsApp Business or claiming your Google My Business listing.',
            },
            {
              title: 'Medium-Term Goals (3–6 months)',
              desc: 'The next layer of digital growth — email marketing, basic inventory systems, social media consistency, and online payment integration.',
            },
            {
              title: 'Long-Term Investments (6–12 months)',
              desc: 'Bigger moves like building a website, implementing a CRM, or launching an e-commerce store — planned so you are ready when the time comes.',
            },
            {
              title: 'Visibility & Growth Strategy',
              desc: 'Specific actions to increase your online reach — SEO recommendations, a social media content plan, local marketing tactics, and customer retention strategies.',
            },
            {
              title: 'Digital Transformation Certificate',
              desc: 'A downloadable PDF certificate you can share on LinkedIn, display on your website, or present to partners and investors as proof of your digital assessment.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Who it is for */}
        <h2 className="text-sm font-bold text-gray-900 mb-2">Who It Is For</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-10 max-w-2xl">
          PryroDigital is for any business owner or manager in Rwanda and East Africa who
          wants to understand their digital position and take practical steps to grow online.
          It is especially valuable for small shops, restaurants, service providers, and
          growing SMEs who want professional guidance without the cost of a consultant.
        </p>

        {/* Built with */}
        <h2 className="text-sm font-bold text-gray-900 mb-2">Technology Behind It</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-12 max-w-2xl">
          The platform uses <strong className="text-gray-800">Google Gemini AI</strong> and{' '}
          <strong className="text-gray-800">Groq (LLaMA 3)</strong> to analyze businesses and
          generate recommendations, <strong className="text-gray-800">Google Places API</strong>{' '}
          to pull real business data, and <strong className="text-gray-800">MTN Mobile Money</strong>{' '}
          for secure local payments — all built on a <strong className="text-gray-800">Next.js</strong>{' '}
          platform with a PostgreSQL database.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/" className="btn-primary text-sm">
            Assess Your Business →
          </Link>
          <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-primary transition-colors font-medium">
            How It Works
          </Link>
        </div>

      </div>
    </main>
  )
}
