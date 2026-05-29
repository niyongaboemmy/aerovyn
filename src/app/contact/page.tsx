'use client'

import { useState } from 'react'
import { z } from 'zod'
import { CheckCircle2, Mail, Phone, MapPin, ChevronRight, AlertCircle } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'

type Intent = 'project' | 'training' | 'partnership' | null

const STEPS = ['Intent', 'Details', 'Contact', 'Done'] as const

const contactSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
})

type ContactFields = z.infer<typeof contactSchema>
type FieldErrors = Partial<Record<keyof ContactFields, string>>

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
  const [form, setForm] = useState<ContactFields>({ name: '', email: '', phone: '', company: '' })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const intentOptions = [
    { id: 'project' as Intent, label: 'Drone Project', desc: 'Mapping, inspection, photography, or events', accent: '#00F5C4' },
    { id: 'training' as Intent, label: 'Pilot Training', desc: 'Individual or corporate course enrolment', accent: '#F5C400' },
    { id: 'partnership' as Intent, label: 'Partnership', desc: 'Collaboration, reseller, or integration enquiry', accent: '#4D7CF5' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const result = contactSchema.safeParse(form)
    if (!result.success) {
      const errs: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactFields
        errs[key] = issue.message
      })
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, details, ...result.data }),
      })
      if (!res.ok) throw new Error('Server error')
      setStep(3)
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong. Please try again or email us directly at info@aerovyn.com.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = (hasError: boolean) => ({
    background: '#0a0b0d',
    border: `1px solid ${hasError ? 'rgba(255,77,79,0.6)' : 'rgba(255,255,255,0.1)'}`,
  })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <PageHero
        label="Get in Touch"
        title="CONTACT"
        description="Tell us what you need. We respond within one business day."
      />

      {/* Content */}
      <div className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Contact info sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4] mb-5" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Reach Us
              </p>
              {[
                { icon: Mail, label: 'Email', value: 'info@aerovyn.com' },
                { icon: Phone, label: 'Phone', value: '+250 788 301 945' },
                { icon: MapPin, label: 'Address', value: 'Amahoro, Kimihurura, Gasabo\nKigali, Rwanda' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 mb-5">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.2)' }}>
                    <Icon size={16} className="text-[#00F5C4]" aria-hidden="true" />
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
            <div className="rounded-2xl p-4 sm:p-8 md:p-10" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <StepIndicator current={step} />

              {/* Step 0 — Intent */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">What are you looking for?</h2>
                  <p className="text-sm text-[#6B7A8D] mb-8">Choose the option that best describes your enquiry.</p>
                  <div className="space-y-3" role="group" aria-label="Enquiry type">
                    {intentOptions.map(({ id, label, desc, accent }) => (
                      <button
                        key={id}
                        onClick={() => { setIntent(id); setStep(1) }}
                        aria-pressed={intent === id}
                        className="w-full flex items-center justify-between rounded-xl px-4 py-4 text-left transition-all duration-200 sm:px-6"
                        style={{
                          background: intent === id ? `${accent}10` : 'rgba(255,255,255,0.03)',
                          border: intent === id ? `2px solid ${accent}50` : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{label}</p>
                          <p className="text-xs text-[#6B7A8D] mt-0.5">{desc}</p>
                        </div>
                        <ChevronRight size={18} style={{ color: accent, flexShrink: 0 }} aria-hidden="true" />
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
                  <label htmlFor="enquiry-details" className="sr-only">Enquiry details</label>
                  <textarea
                    id="enquiry-details"
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    rows={6}
                    placeholder="E.g. We need a 3-day aerial survey of a 50km road corridor in Northern Rwanda, starting in July 2026..."
                    className="w-full rounded-xl px-4 py-4 text-sm text-white placeholder-[#6B7A8D] resize-none focus:outline-none transition-colors sm:px-5 sm:text-base"
                    style={{ background: '#0a0b0d', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,245,196,0.4)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  />
                  {details.trim().length > 0 && details.trim().length < 10 && (
                    <p className="mt-2 text-xs text-[#FF4D4F]">Please provide at least 10 characters of detail.</p>
                  )}
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setStep(0)} className="text-sm text-[#6B7A8D] hover:text-white transition-colors">← Back</button>
                    <button
                      onClick={() => setStep(2)}
                      disabled={details.trim().length < 10}
                      className="rounded-md px-6 py-2.5 text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: '#00F5C4', color: '#0A0B0D', fontFamily: 'var(--font-orbitron)' }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Contact info */}
              {step === 2 && (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="text-xl font-bold text-white mb-2">Your details</h2>
                  <p className="text-sm text-[#6B7A8D] mb-8">We&apos;ll use these to send your quote or course confirmation.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {([
                      { key: 'name' as const, label: 'Full Name', placeholder: 'John Doe', type: 'text', required: true },
                      { key: 'email' as const, label: 'Email', placeholder: 'you@example.com', type: 'email', required: true },
                      { key: 'phone' as const, label: 'Phone', placeholder: '+250 700 000 000', type: 'tel', required: false },
                      { key: 'company' as const, label: 'Organisation (optional)', placeholder: 'Company or institution', type: 'text', required: false },
                    ]).map(({ key, label, placeholder, required, type }) => (
                      <div key={key}>
                        <label htmlFor={`field-${key}`} className="block text-xs text-[#6B7A8D] uppercase tracking-wider mb-2">
                          {label}
                        </label>
                        <input
                          id={`field-${key}`}
                          type={type}
                          required={required}
                          placeholder={placeholder}
                          value={form[key] ?? ''}
                          aria-invalid={!!fieldErrors[key]}
                          aria-describedby={fieldErrors[key] ? `error-${key}` : undefined}
                          onChange={e => {
                            setForm(prev => ({ ...prev, [key]: e.target.value }))
                            if (fieldErrors[key]) setFieldErrors(prev => ({ ...prev, [key]: undefined }))
                          }}
                          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[#6B7A8D] focus:outline-none transition-colors"
                          style={fieldStyle(!!fieldErrors[key])}
                          onFocus={e => { if (!fieldErrors[key]) e.currentTarget.style.borderColor = 'rgba(0,245,196,0.4)' }}
                          onBlur={e => { e.currentTarget.style.borderColor = fieldErrors[key] ? 'rgba(255,77,79,0.6)' : 'rgba(255,255,255,0.1)' }}
                        />
                        {fieldErrors[key] && (
                          <p id={`error-${key}`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-[#FF4D4F]">
                            <AlertCircle size={11} aria-hidden="true" />
                            {fieldErrors[key]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {submitError && (
                    <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm text-[#FF4D4F]" style={{ background: 'rgba(255,77,79,0.08)', border: '1px solid rgba(255,77,79,0.25)' }}>
                      <AlertCircle size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
                      {submitError}
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-[#6B7A8D] hover:text-white transition-colors">← Back</button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 rounded-md px-7 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: '#00F5C4', color: '#0A0B0D', fontFamily: 'var(--font-orbitron)' }}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : 'Send Enquiry →'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 — Confirmation */}
              {step === 3 && submitted && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0,245,196,0.12)', border: '2px solid rgba(0,245,196,0.4)' }}>
                    <CheckCircle2 size={28} className="text-[#00F5C4]" aria-hidden="true" />
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
