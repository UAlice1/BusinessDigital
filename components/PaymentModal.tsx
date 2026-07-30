'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  assessmentId: string
  businessName: string
  businessSector: string
  businessLocation: string
  onSuccess: (ref: string) => void
  onClose: () => void
}

type Step = 'enter-phone' | 'pending' | 'success' | 'failed'

export default function PaymentModal({
  assessmentId, businessName, businessSector, businessLocation, onSuccess, onClose,
}: Props) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<Step>('enter-phone')
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (step !== 'pending' || !referenceId) return

    // Simulate success after 4s (sandbox mode — real MTN won't respond)
    const simTimeout = setTimeout(() => {
      setStep('success')
      setTimeout(() => onSuccess(referenceId), 1500)
    }, 4000)

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?referenceId=${referenceId}&assessmentId=${assessmentId}`)
        const data = await res.json() as { status: string }
        if (data.status === 'SUCCESSFUL') {
          clearTimeout(simTimeout)
          clearInterval(interval)
          setStep('success')
          setTimeout(() => onSuccess(referenceId), 1500)
        }
        // Ignore FAILED — simulation handles it automatically
      } catch { /* ignore */ }
    }, 3000)

    return () => { clearInterval(interval); clearTimeout(simTimeout) }
  }, [step, referenceId, assessmentId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null)
    const clean = phone.replace(/[\s\-\(\)]/g, '')
    if (!/^(\+?250|0)?7[2-9]\d{7}$/.test(clean)) {
      setError('Enter a valid MTN Rwanda number (e.g. 0781234567)'); return
    }
    setStep('pending')
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, phoneNumber: clean }),
      })
      const data = await res.json() as { referenceId?: string; error?: string; detail?: string }
      if (!res.ok) throw new Error(data.detail ?? data.error ?? 'Failed')
      setReferenceId(data.referenceId!)
    } catch (err) {
      setStep('enter-phone')
      setError('Failed to initiate payment. Use "Skip" below to test the flow.')
      console.error('Payment error:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={step === 'enter-phone' ? onClose : undefined} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">

        {/* Top accent bar */}
        <div className="h-1 bg-primary w-full" />

        {step === 'enter-phone' && (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="label-upper mb-1">Unlock Assessment</p>
                  <h2 className="font-display font-bold text-2xl text-gray-900">Pay 100 RWF</h2>
                  <p className="text-gray-400 text-sm mt-1">Via MTN Mobile Money</p>
                </div>
                <button onClick={onClose} aria-label="Close"
                  className="text-gray-300 hover:text-gray-600 transition-colors text-2xl font-light leading-none mt-1">
                  ×
                </button>
              </div>
            </div>

            {/* Business preview */}
            <div className="mx-6 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l.75 6H3.75L4.5 3zM9 21V9h6v12" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{businessName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{businessSector} · {businessLocation}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <span>Digital Maturity Assessment</span>
                <span className="font-bold text-gray-900">100 RWF</span>
              </div>
            </div>

            {/* Phone input */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  MTN Mobile Money Number
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <span className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 font-medium whitespace-nowrap">
                    🇷🇼 +250
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0781234567"
                    className="flex-1 px-3 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none bg-white"
                    inputMode="tel"
                    autoComplete="tel"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  You&apos;ll receive a confirmation prompt on your phone.
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg p-3 font-medium">
                  {error}
                </div>
              )}

              <button type="submit"
                className="w-full py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-sm">
                Pay 100 RWF Now
              </button>

              <div className="flex items-center gap-2">
                <hr className="flex-1 border-gray-200" />
                <span className="text-xs text-gray-400">testing only</span>
                <hr className="flex-1 border-gray-200" />
              </div>

              <button type="button" onClick={() => onSuccess('demo-' + Date.now())}
                className="w-full py-2.5 border border-gray-200 text-gray-400 rounded-lg hover:border-primary hover:text-primary text-xs transition-colors font-medium">
                Skip payment (Sandbox demo)
              </button>
            </form>
          </>
        )}

        {step === 'pending' && (
          <div className="px-6 py-10 text-center space-y-5">
            <LoadingSpinner size="lg" />
            <div>
              <p className="font-display font-bold text-gray-900 text-xl">Processing payment</p>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Please wait while we confirm your <strong>100 RWF</strong> payment.
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="px-6 py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-3xl mx-auto">
              ✅
            </div>
            <p className="font-display font-bold text-green-700 text-xl">Payment Confirmed!</p>
            <p className="text-gray-400 text-sm">Running AI analysis on {businessName}…</p>
            <div className="pt-2">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}

        {step === 'failed' && (
          <div className="px-6 py-10 text-center space-y-4">
            <div>
              <p className="font-display font-bold text-gray-900 text-xl">Payment Failed</p>
              <p className="text-gray-400 text-sm mt-1">{error}</p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => onSuccess('demo-' + Date.now())}
                className="btn-primary text-sm px-5 py-2.5">
                Continue with Simulation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
