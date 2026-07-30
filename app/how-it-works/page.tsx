import Link from 'next/link'

export const metadata = {
  title: 'How It Works — PryroDigital',
  description: 'Learn how PryroDigital assesses your business digital maturity in 6 simple steps.',
}

const steps = [
  {
    title: 'Step 1: Search Your Business',
    desc: 'Enter your business name and we find it on Google. We pull real data about your digital footprint — website, reviews, social presence, and more.',
  },
  {
    title: 'Step 2: AI Scores Your Business',
    desc: 'Our advanced AI analyzes your website, social media, mobile payments, and online presence. We generate a precise digital maturity score tailored specifically to your business.',
  },
  {
    title: 'Step 3: Pay 100 RWF via MTN MoMo',
    desc: 'Unlock your full report with a single secure mobile money payment. No credit card or bank account needed — just your MTN MoMo.',
  },
  {
    title: 'Step 4: Answer 12 Questions',
    desc: 'A quick questionnaire about your current tools, digital channels, and business challenges. It takes under 3 minutes and helps us tailor your recommendations.',
  },
  {
    title: 'Step 5: Get AI Recommendations',
    desc: "Receive 6 actionable steps tailored to your sector, score, and budget — powered by Gemini AI. Whether it's for payments, marketing, or operations, the advice is practical and easy to follow.",
  },
  {
    title: 'Step 6: Download Your Certificate',
    desc: 'Get a shareable PDF Digital Transformation Certificate you can display on your website, share on LinkedIn, or present to partners and investors.',
  },
]

export default function HowItWorksPage() {
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
          How It Works
        </h1>

        {/* Intro */}
        <p className="text-gray-700 text-sm leading-relaxed mb-10 max-w-2xl">
          Discover how PryroDigital works and how we help you unlock the digital potential
          of your business with AI-powered insights. From searching your business to receiving
          your certified report, it&apos;s easy to get started.
        </p>

        {/* 2-column steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
          {steps.map((step) => (
            <div key={step.title}>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}

