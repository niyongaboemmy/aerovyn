'use client'

import { useState } from 'react'
import { CheckCircle2, Mail, Phone, MapPin, ChevronRight } from 'lucide-react'

type Intent = 'project' | 'training' | 'partnership' | null

const STEPS = ['Intent', 'Details', 'Contact', 'Done'] as const

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={
                i < current
                  ? { background: '#00F5C4', color: '#0A0B0D' }
                  : i === current
                  ? { background: 'rgba(0,245,196,0.15)', border: '2px solid #00F5C4', color: '#00F5C4', fontFamily: 'var(--font-orbitron)' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#6B7A8D', fontFamily: 'var(--font-orbitron)' }
              }
            >
              {i < current ? <CheckCircle2 size={14} /> : <span style={{ fontFamily: 'var(--font-orbitron)' }}>{i + 1}</span>}
            </div>
            <span className="text-[10px] uppercase tracking-wider hidden sm:block" style={{ color: i === current ? '#00F5C4' : '#6B7A8D', fontFamily: 'var(--font-orbitron)' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-12 sm:w-16 h-px mx-1 mb-4 transition-all duration-500" style={{ background: i < current ? '#00F5C4' : 'rgba(255,255,255,0.1)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ContactPage() {
  const [step, setStep] = useState(0)
  const [intent, setIntent] = useState<Intent>(null)
  const [details, setDetails] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })
  const [submitted, setSubmitted] = useState(false)

  const intentOptions = [
    { id: 'project' as Intent, label: 'Drone Project', desc: 'Mapping, inspection, photography, or events', accent: '#00F5C4' },
    { id: 'training' as Intent, label: 'Pilot Training', desc: 'Individual or corporate course enrolment', accent: '#F5C400' },
    { id: 'partnership' as Intent, label: 'Partnership', desc: 'Collaboration, reseller, or integration enquiry', accent: '#4D7CF5' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="grid-bg pt-28 pb-16 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Get in Touch
          </p>
          <h1 className="text-5xl font-black tracking-widest text-white md:text-7xl mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>
            CONTACT
          </h1>
          <p className="text-lg text-[#6B7A8D] max-w-xl">
            Tell us what you need. We respond within one business day.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4] mb-5" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Reach Us
              </p>
              {[
                { icon: Mail, label: 'Email', value: 'hello@aerovyn.com' },
                { icon: Phone, label: 'Phone', value: '+1 (234) 567-890' },
                { icon: MapPin, label: 'Address', value: 'Kigali, Rwanda\nEast Africa' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 mb-5">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.2)' }}>
                    <Icon size={16} className="text-[#00F5C4]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7A8D] uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm text-white whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-5" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-semibold text-[#00F5C4] uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-orbitron)' }}>Response Time</p>
              <p className="text-sm text-[#6B7A8D] leading-relaxed">All enquiries are reviewed by our operations team. Expect a reply within <span className="text-white font-medium">1 business day</span>.</p>
            </div>

            <div className="rounded-xl p-5" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-semibold text-[#00F5C4] uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-orbitron)' }}>Operating Hours</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-[#6B7A8D]">Mon – Fri</span><span className="text-white">8:00 – 18:00 EAT</span></div>
                <div className="flex justify-between"><span className="text-[#6B7A8D]">Saturday</span><span className="text-white">9:00 – 14:00 EAT</span></div>
                <div className="flex justify-between"><span className="text-[#6B7A8D]">Sunday</span><span className="text-[#6B7A8D]">Closed</span></div>
              </div>
            </div>
          </div>

          {/* Multi-step form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-8 md:p-10" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <StepIndicator current={step} />

              {/* Step 0 — Intent */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">What are you looking for?</h2>
                  <p className="text-sm text-[#6B7A8D] mb-8">Choose the option that best describes your enquiry.</p>
                  <div className="space-y-3">
                    {intentOptions.map(({ id, label, desc, accent }) => (
                      <button
                        key={id}
                        onClick={() => { setIntent(id); setStep(1) }}
                        className="w-full flex items-center justify-between rounded-xl px-6 py-4 text-left transition-all duration-200"
                        style={{
                          background: intent === id ? `${accent}10` : 'rgba(255,255,255,0.03)',
                          border: intent === id ? `2px solid ${accent}50` : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{label}</p>
                          <p className="text-xs text-[#6B7A8D] mt-0.5">{desc}</p>
                        </div>
                        <ChevronRight size={18} style={{ color: accent, flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 — Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Tell us more</h2>
                  <p className="text-sm text-[#6B7A8D] mb-8">Describe your requirements, timeline, and location.</p>
                  <textarea
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    rows={6}
                    placeholder="E.g. We need a 3-day aerial survey of a 50km road corridor in Northern Rwanda, starting in July 2026..."
                    className="w-full rounded-xl px-5 py-4 text-sm text-white placeholder-[#6B7A8D] resize-none focus:outline-none transition-colors"
                    style={{ background: '#0a0b0d', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,245,196,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  />
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setStep(0)} className="text-sm text-[#6B7A8D] hover:text-white transition-colors">← Back</button>
                    <button
                      onClick={() => setStep(2)}
                      disabled={details.trim().length < 10}
                      className="rounded-md px-6 py-2.5 text-sm font-semibold transition-all duration-300 disabled:opacity-40"
                      style={{ background: '#00F5C4', color: '#0A0B0D', fontFamily: 'var(--font-orbitron)' }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Contact info */}
              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-bold text-white mb-2">Your details</h2>
                  <p className="text-sm text-[#6B7A8D] mb-8">We&apos;ll use these to send your quote or course confirmation.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { key: 'name', label: 'Full Name', placeholder: 'John Doe', required: true },
                      { key: 'email', label: 'Email', placeholder: 'you@example.com', required: true, type: 'email' },
                      { key: 'phone', label: 'Phone', placeholder: '+250 700 000 000', required: false },
                      { key: 'company', label: 'Organisation (optional)', placeholder: 'Company or institution', required: false },
                    ].map(({ key, label, placeholder, required, type }) => (
                      <div key={key}>
                        <label className="block text-xs text-[#6B7A8D] uppercase tracking-wider mb-2">{label}</label>
                        <input
                          type={type ?? 'text'}
                          required={required}
                          placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[#6B7A8D] focus:outline-none transition-colors"
                          style={{ background: '#0a0b0d', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,245,196,0.4)' }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-[#6B7A8D] hover:text-white transition-colors">← Back</button>
                    <button
                      type="submit"
                      className="rounded-md px-7 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)]"
                      style={{ background: '#00F5C4', color: '#0A0B0D', fontFamily: 'var(--font-orbitron)' }}
                    >
                      Send Enquiry →
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 — Confirmation */}
              {step === 3 && submitted && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0,245,196,0.12)', border: '2px solid rgba(0,245,196,0.4)' }}>
                    <CheckCircle2 size={28} className="text-[#00F5C4]" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    ENQUIRY SENT
                  </h2>
                  <p className="text-[#6B7A8D] mb-2">Thank you, <span className="text-white font-medium">{form.name}</span>.</p>
                  <p className="text-sm text-[#6B7A8D] max-w-sm mx-auto mb-8">
                    We&apos;ve received your enquiry and will respond to <span className="text-white">{form.email}</span> within one business day.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="/" className="rounded-md border border-[rgba(0,245,196,0.4)] px-6 py-2.5 text-sm font-semibold text-[#00F5C4] transition-all duration-300 hover:bg-[rgba(0,245,196,0.08)]" style={{ fontFamily: 'var(--font-orbitron)' }}>
                      Back to Home
                    </a>
                    <a href="/projects" className="rounded-md border border-[rgba(255,255,255,0.1)] px-6 py-2.5 text-sm font-medium text-[#C4CDD8] transition-all duration-300 hover:border-[rgba(255,255,255,0.2)]">
                      Browse Our Work
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
