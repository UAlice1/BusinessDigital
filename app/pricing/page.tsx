import Link from 'next/link'

export const metadata = {
  title: 'Pricing — PryroDigital',
  description: 'Get your full AI-powered digital assessment and certificate for just 100 RWF via MTN MoMo.',
}

const steps = [
  {
    title: 'Step 1: Search for your business',
    desc: 'Go to the home page and type your business name in the search bar. Select your business from the results. This is free — no payment needed yet.',
  },
  {
    title: 'Step 2: A payment prompt will appear',
    desc: 'Once you select your business, a payment dialog will appear on screen. It will show the amount: 100 RWF. You do not need a bank account or credit card.',
  },
  {
    title: 'Step 3: Pay 100 RWF via MTN MoMo',
    desc: 'Enter your MTN Mobile Money phone number in the payment form and confirm. You will receive a push notification on your phone to approve the payment. The whole process takes under 30 seconds.',
  },
  {
    title: 'Step 4: Answer 12 quick questions',
    desc: 'After payment is confirmed, you will be taken to a short questionnaire. Answer 12 questions about your business — your tools, digital channels, and current challenges. This takes about 2–3 minutes.',
  },
  {
    title: 'Step 5: Receive your AI-powered report',
    desc: 'Our AI instantly generates your digital maturity score and 6 personalized recommendations. You will see exactly where your business stands and what to improve first.',
  },
  {
    title: 'Step 6: Download your certificate',
    desc: 'At the end, you can download your official Digital Transformation Certificate as a PDF. You can share it on LinkedIn, display it on your website, or present it to partners.',
  },
]

export default function PricingPage() {
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
          Pricing
        </h1>

        {/* Intro */}
        <p className="text-sm text-gray-700 leading-relaxed mb-2 max-w-2xl">
          The full assessment costs <strong className="text-gray-900">100 RWF</strong> — paid once via MTN Mobile Money.
          There are no subscriptions, no hidden fees, and no credit card required.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-10 max-w-2xl">
          Here is exactly how the payment works and what happens after you pay.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 mb-14">
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

        {/* Summary box — plain text style */}
        <div className="border-t border-gray-100 pt-10">
          <h2 className="text-sm font-bold text-gray-900 mb-4">What you get for 100 RWF</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-3">
            {[
              'Business digital footprint analysis',
              'AI-powered score across 6 dimensions',
              '12-question digital readiness assessment',
              '6 tailored AI recommendations',
              'Sector-specific action plan',
              'Digital Transformation Certificate (PDF)',
              'Shareable certificate link',
            ].map((item) => (
              <p key={item} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400 shrink-0">✓</span>
                {item}
              </p>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
