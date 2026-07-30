const steps = [
  { icon: '🔍', title: 'Search Your Business',      desc: 'Search by name or location. We pull real data about your digital footprint.' },
  { icon: '🤖', title: 'AI Scores Your Business',   desc: 'Our AI analyzes your website, social media, payments, and online presence.' },
  { icon: '📱', title: 'Pay 100 RWF via MTN MoMo', desc: 'Secure mobile money payment to unlock your full assessment and certificate.' },
  { icon: '📋', title: 'Answer 12 Questions',       desc: 'Quick questions about your current tools, challenges, and goals.' },
  { icon: '💡', title: 'Get AI Recommendations',    desc: 'Receive 6 actionable steps tailored to your sector and budget.' },
  { icon: '🎓', title: 'Download Certificate',      desc: 'Get a PDF Digital Transformation Certificate you can share and display.' },
]

export default function HowItWorks() {
  return (
    <section className="bg-[#0a0a0a] border-t border-white/5 py-24 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-[#7c6ef7] text-xs font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl font-bold text-white mb-3">Six steps to your digital roadmap</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            From search to certified report — the whole journey takes under 10 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative p-6 rounded-2xl border border-white/8 bg-white/3 hover:border-[#7c6ef7]/40 hover:bg-white/5 transition-all group"
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#7c6ef7] text-white rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <div className="text-2xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1.5 group-hover:text-[#7c6ef7] transition-colors">{step.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm mb-5">Ready to find out where your business stands digitally?</p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="inline-block px-8 py-3 bg-[#7c6ef7] text-white font-semibold rounded-xl hover:bg-[#6a5ce8] transition-colors text-sm"
          >
            Get Started →
          </a>
          <p className="text-white/20 text-xs mt-3">No sign-up required · 100 RWF only</p>
        </div>
      </div>
    </section>
  )
}
