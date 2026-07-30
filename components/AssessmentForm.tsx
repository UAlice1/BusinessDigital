'use client'

import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface Business { name: string; sector: string; location: string }
interface Props {
  business: Business; assessmentId: string
  onSubmit: (answers: Record<string, string | string[]>, userName: string, userPhone: string) => void
}
interface Question { id: string; question: string; type: 'single' | 'multiple' | 'text'; options?: string[] }

const BASE_QUESTIONS: Question[] = [
  { id: 'online_presence', question: 'Does your business have an online presence?', type: 'multiple',
    options: ['Own website','Facebook page','Instagram','WhatsApp Business','Google My Business','None'] },
  { id: 'payment_methods', question: 'What payment methods do you currently accept?', type: 'multiple',
    options: ['Cash only','MTN Mobile Money','Airtel Money','Bank card/POS','Online payment','Invoice/credit'] },
  { id: 'customer_contact', question: 'How do customers primarily contact you?', type: 'multiple',
    options: ['Walk-in','Phone call','WhatsApp','Email','Social media DMs','Website form'] },
  { id: 'inventory_tracking', question: 'How do you track your inventory or services?', type: 'single',
    options: ['Paper records','Excel/spreadsheet','Inventory software/app','No formal tracking','Not applicable'] },
  { id: 'accounting', question: 'How do you manage your business accounts/finances?', type: 'single',
    options: ['Paper/manual','Excel/spreadsheet','Accounting software','Accountant/bookkeeper','No formal system'] },
  { id: 'marketing', question: 'How do you market your business?', type: 'multiple',
    options: ['Word of mouth','Social media posts','Paid ads (Facebook/Google)','SMS/email marketing','Flyers/print','No marketing'] },
  { id: 'digital_sales', question: 'Can customers purchase from you online?', type: 'single',
    options: ['Yes, through our website','Yes, through WhatsApp/social media','No, in-person only','Planning to add soon'] },
  { id: 'customer_data', question: 'Do you collect and store customer data?', type: 'single',
    options: ['Yes, in a CRM/software','Yes, in a spreadsheet','Some, informally','No'] },
  { id: 'staff_digital', question: 'Do your staff use digital tools for their work?', type: 'multiple',
    options: ['Smartphones for work','Business apps','Email','Office software','POS systems','No digital tools'] },
  { id: 'delivery', question: 'Do you offer delivery or remote services?', type: 'single',
    options: ['Yes, with own delivery','Yes, via delivery partner','No, but planning to','No, not applicable'] },
  { id: 'biggest_challenge', question: "What's your biggest challenge in going digital?", type: 'single',
    options: ['Cost of digital tools','Lack of technical knowledge','Poor internet connectivity','Staff resistance',"Don't know where to start",'No challenges'] },
  { id: 'goal', question: 'What is your main digitalization goal in the next 6 months?', type: 'text' },
]

export default function AssessmentForm({ business, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const q = BASE_QUESTIONS[currentQ]
  const total = BASE_QUESTIONS.length
  const isLast = currentQ === total - 1
  const progress = (currentQ / total) * 100

  function handleSingle(val: string) { setAnswers({ ...answers, [q.id]: val }); setErrors({ ...errors, [q.id]: '' }) }
  function handleMultiple(val: string) {
    const cur = (answers[q.id] as string[]) ?? []
    setAnswers({ ...answers, [q.id]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] })
    setErrors({ ...errors, [q.id]: '' })
  }
  function validate() {
    if (q.type === 'text') return true
    const a = answers[q.id]
    if (!a || (Array.isArray(a) && a.length === 0)) { setErrors({ ...errors, [q.id]: 'Please select at least one option.' }); return false }
    return true
  }
  function next() { if (validate() && currentQ < total - 1) setCurrentQ(currentQ + 1) }
  function back() { if (currentQ > 0) setCurrentQ(currentQ - 1) }
  function handleSubmit() {
    if (!userName.trim()) { setErrors({ ...errors, userName: 'Required' }); return }
    if (!userPhone.trim()) { setErrors({ ...errors, userPhone: 'Required' }); return }
    setIsSubmitting(true)
    onSubmit(answers, userName.trim(), userPhone.trim())
  }

  const cur = answers[q.id]
  const hasAnswer = q.type === 'text' ? true : Array.isArray(cur) ? cur.length > 0 : !!cur

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Progress */}
      <div className="card p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
          <span>Question {currentQ + 1} <span className="text-gray-300">/ {total}</span></span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{business.name} · {business.sector}</p>
      </div>

      {/* Question */}
      <div className="card p-6 min-h-64">
        <p className="font-display font-bold text-gray-900 text-xl mb-5 leading-snug">{q.question}</p>

        {q.type === 'single' && q.options && (
          <div className="space-y-2">
            {q.options.map((opt) => (
              <button key={opt} onClick={() => handleSingle(opt)}
                className={`w-full text-left px-4 py-3 rounded-md border-2 transition-all text-sm flex items-center gap-3 font-medium ${
                  answers[q.id] === opt
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:bg-primary-light/50'
                }`}>
                <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  answers[q.id] === opt ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {answers[q.id] === opt && <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"/>}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === 'multiple' && q.options && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Select all that apply</p>
            {q.options.map((opt) => {
              const selected = ((answers[q.id] as string[]) ?? []).includes(opt)
              return (
                <button key={opt} onClick={() => handleMultiple(opt)}
                  className={`w-full text-left px-4 py-3 rounded-md border-2 transition-all text-sm flex items-center gap-3 font-medium ${
                    selected
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:bg-primary-light/50'
                  }`}>
                  <span className={`w-3.5 h-3.5 rounded-md border-2 shrink-0 flex items-center justify-center ${
                    selected ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {selected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {q.type === 'text' && (
          <textarea value={(answers[q.id] as string) ?? ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder="Type your answer here…" rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none text-sm"/>
        )}

        {errors[q.id] && <p className="text-red-500 text-xs mt-3 font-medium">{errors[q.id]}</p>}
      </div>

      {/* User info on last question */}
      {isLast && (
        <div className="card p-6 space-y-4">
          <p className="font-display font-bold text-gray-900 text-lg">
            Your Details <span className="text-gray-400 font-normal text-base">(for your certificate)</span>
          </p>
          {[
            { label: 'Full Name', key: 'userName', val: userName, set: setUserName, placeholder: 'Your full name', type: 'text' },
            { label: 'Phone Number', key: 'userPhone', val: userPhone, set: setUserPhone, placeholder: '07X XXX XXXX', type: 'tel' },
          ].map(({ label, key, val, set, placeholder, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label} *</label>
              <input type={type} value={val} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"/>
              {errors[key] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[key]}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {currentQ > 0 && (
          <button onClick={back}
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-md hover:border-gray-300 hover:text-gray-900 transition-colors text-sm font-medium">
            ← Back
          </button>
        )}
        {!isLast ? (
          <button onClick={next} disabled={!hasAnswer}
            className="flex-1 btn-primary py-3 disabled:opacity-30 disabled:cursor-not-allowed">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting}
            className="flex-1 btn-primary py-3 disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <LoadingSpinner size="sm"/> : null}
            {isSubmitting ? 'Generating results…' : '🚀 Submit & Get Results'}
          </button>
        )}
      </div>
    </div>
  )
}
