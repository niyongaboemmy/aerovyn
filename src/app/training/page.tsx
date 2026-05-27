'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, Award, ChevronDown, ChevronUp, Users, Shield, Cpu } from 'lucide-react'

const courses = [
  {
    level: 'BEGINNER',
    levelColor: '#00D68F',
    title: 'Drone Fundamentals & Safety Certification',
    duration: '3 Days Intensive',
    price: '$299',
    prereq: 'None',
    summary: 'The complete foundation course for aspiring drone pilots. Covers theory, airspace law, safety protocols, and hands-on flight practice.',
    modules: [
      'UAV systems & components overview',
      'Rwanda CAA regulations & air law',
      'Pre-flight planning & weather assessment',
      'Hands-on flight training (10+ hours)',
      'Emergency procedures & risk management',
      'Post-flight documentation & logging',
    ],
    outcomes: ['RCAA Theory Exam preparation', 'AEROVYN Beginner Certificate', 'Eligibility for Tier 1 permit'],
  },
  {
    level: 'INTERMEDIATE',
    levelColor: '#FFB800',
    title: 'Advanced Piloting & Aerial Operations',
    duration: '5 Days',
    price: '$549',
    prereq: 'Beginner Course or equivalent',
    summary: 'Takes competent pilots into professional commercial territory — night operations, complex airspace, and real-world mission workflows.',
    modules: [
      'Night flying techniques & lighting setup',
      'Commercial licence pathway (KCAA/RCAA)',
      'Aerial mapping & photogrammetry basics',
      'Survey mission planning in DJI Pilot 2',
      'Basic drone maintenance & troubleshooting',
      'Client briefing & deliverable standards',
    ],
    outcomes: ['Commercial Pilot Certificate', 'RCAA Tier 2 permit eligibility', 'Mapping & survey competency badge'],
  },
  {
    level: 'ADVANCED',
    levelColor: '#00F5C4',
    title: 'Professional UAV Pilot Certification',
    duration: '2 Weeks',
    price: '$999',
    prereq: 'Intermediate Course',
    summary: 'The professional-grade programme leading to RCAA Remote Pilot Licence and industrial operational competency across multiple mission types.',
    modules: [
      'RCAA Remote Pilot Licence (RPL) exam prep',
      'BVLOS concepts & safety case principles',
      'Industrial inspections: towers, rooftops, pipelines',
      'Agricultural NDVI survey operations',
      'Safety Management System (SMS) documentation',
      'Career pathways, networking & job placement',
    ],
    outcomes: ['RCAA Remote Pilot Licence (RPL)', 'Industrial operations certificate', 'Career support + alumni network access'],
  },
  {
    level: 'CORPORATE',
    levelColor: '#C400F5',
    title: 'Custom Corporate Training Programme',
    duration: 'Tailored (2–10 days)',
    price: 'Custom',
    prereq: 'Assessed per team',
    summary: 'Bespoke training designed around your organisation\'s existing equipment, operational requirements, and regulatory obligations.',
    modules: [
      'Needs assessment & skills gap analysis',
      'Custom curriculum design',
      'On-site or at-facility delivery',
      'Equipment-specific flight training',
      'Safety management systems integration',
      'Team certification & ongoing support',
    ],
    outcomes: ['Organisation-specific certification', 'SOPs & safety documentation', 'Ongoing support retainer available'],
  },
]

const instructors = [
  { initials: 'EK', name: 'Emmanuel K.', role: 'Chief Operations Officer', exp: '8 years UAV operations', accent: '#00F5C4' },
  { initials: 'SK', name: 'Sarah K.', role: 'Head of Agricultural Services', exp: '5 years precision agriculture', accent: '#F5C400' },
  { initials: 'DO', name: 'David O.', role: 'Lead Aerial Cinematographer', exp: '6 years broadcast & events', accent: '#4D7CF5' },
]

const certifications = [
  { icon: Shield, label: 'RCAA Accredited', desc: 'Rwanda Civil Aviation Authority approved training centre' },
  { icon: Award, label: 'KCAA Recognised', desc: 'Kenya CAA endorsement for cross-border certification' },
  { icon: Cpu, label: 'DJI Authorised', desc: 'Official DJI training partner for East Africa' },
  { icon: Users, label: '500+ Graduates', desc: 'Alumni network across 10 African countries' },
]

function CourseCard({ course, expanded, onToggle }: { course: typeof courses[0]; expanded: boolean; onToggle: () => void }) {
  const { level, levelColor, title, duration, price, prereq, summary, modules, outcomes } = course
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-elevated)', border: `1px solid ${levelColor}25` }}>
      {/* Header */}
      <button
        className="w-full px-7 py-6 flex items-start justify-between gap-4 text-left transition-colors duration-200"
        style={{ background: expanded ? `${levelColor}06` : 'transparent' }}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`course-details-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-sm" style={{ background: `${levelColor}15`, color: levelColor, border: `1px solid ${levelColor}30`, fontFamily: 'var(--font-orbitron)' }}>
              {level}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#6B7A8D]"><Clock size={12} />{duration}</span>
            <span className="text-sm font-bold ml-auto" style={{ color: levelColor, fontFamily: 'var(--font-orbitron)' }}>{price}</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
          {!expanded && <p className="mt-2 text-sm text-[#6B7A8D] line-clamp-1">{summary}</p>}
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? <ChevronUp size={18} style={{ color: levelColor }} /> : <ChevronDown size={18} className="text-[#6B7A8D]" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          id={`course-details-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="px-7 pb-7 border-t"
          style={{ borderColor: `${levelColor}15` }}
        >
          <p className="text-[#6B7A8D] text-sm leading-relaxed mt-5 mb-6">{summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modules */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: levelColor, fontFamily: 'var(--font-orbitron)' }}>Curriculum</p>
              <ul className="space-y-2">
                {modules.map(m => (
                  <li key={m} className="flex items-start gap-2.5 text-sm text-[#C4CDD8]">
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: levelColor }} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {/* Outcomes + enroll */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: levelColor, fontFamily: 'var(--font-orbitron)' }}>Outcomes</p>
              <ul className="space-y-2 mb-6">
                {outcomes.map(o => (
                  <li key={o} className="flex items-start gap-2.5 text-sm text-[#C4CDD8]">
                    <Award size={13} className="mt-0.5 shrink-0" style={{ color: levelColor }} />
                    {o}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#6B7A8D] mb-4">Prerequisites: <span className="text-[#8A9BAE]">{prereq}</span></p>
              <Link
                href="/contact"
                className="flex items-center justify-between rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300"
                style={{ background: `${levelColor}12`, border: `1px solid ${levelColor}30`, color: levelColor }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${levelColor}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${levelColor}12` }}
              >
                <span className="flex items-center gap-2"><Award size={15} />Enroll Now</span>
                <span>{price}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrainingPage() {
  const [expanded, setExpanded] = useState<number | null>(0)

  const toggle = (i: number) => setExpanded(prev => prev === i ? null : i)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="grid-bg pt-28 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Training Programs
          </p>
          <h1 className="text-5xl font-black tracking-widest text-white md:text-7xl mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
            TRAINING
          </h1>
          <p className="text-lg text-[#6B7A8D] max-w-2xl leading-relaxed">
            From zero experience to RCAA Remote Pilot Licence — structured programmes taught by working professionals on real commercial equipment.
          </p>
        </div>
      </div>

      {/* Certifications strip */}
      <div className="px-6 py-10" style={{ background: 'var(--bg-surface)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.2)' }}>
                <Icon size={16} className="text-[#00F5C4]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>{label}</p>
                <p className="text-xs text-[#6B7A8D] mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course accordion */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Curriculum
          </p>
          <h2 className="text-3xl font-black text-white mb-12 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
            COURSE CATALOGUE
          </h2>
          <div className="space-y-4">
            {courses.map((course, i) => (
              <CourseCard key={course.level} course={course} expanded={expanded === i} onToggle={() => toggle(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="px-6 py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Who Teaches
          </p>
          <h2 className="text-3xl font-black text-white mb-12 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
            INSTRUCTORS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {instructors.map(({ initials, name, role, exp, accent }) => (
              <div key={name} className="rounded-2xl p-7 flex flex-col items-center text-center" style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}20` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black mb-4" style={{ background: `${accent}20`, color: accent, fontFamily: 'var(--font-orbitron)' }}>
                  {initials}
                </div>
                <h3 className="font-bold text-white mb-0.5">{name}</h3>
                <p className="text-xs text-[#6B7A8D] mb-2">{role}</p>
                <p className="text-xs font-medium" style={{ color: accent }}>{exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-2xl px-10 py-16 text-center" style={{ background: 'linear-gradient(135deg, #00f5c4 0%, #00b8a9 50%, #007a6e 100%)' }}>
          <h2 className="text-3xl font-black text-[#0A0B0D] mb-3 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
            START YOUR JOURNEY TODAY
          </h2>
          <p className="text-[#0A0B0D] opacity-70 mb-8 max-w-md mx-auto">
            Next cohort intake is open. Secure your spot before it fills.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="rounded-xl bg-[#0A0B0D] px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#111318]" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Enroll Now →
            </Link>
            <Link href="/contact" className="rounded-xl border-2 border-[rgba(10,11,13,0.3)] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:border-[#0A0B0D]">
              Request Group Booking
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
