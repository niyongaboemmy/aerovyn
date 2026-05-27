'use client'

import Link from 'next/link'

const team = [
  {
    initials: 'EK',
    name: 'Emmanuel K.',
    role: 'Chief Operations Officer',
    bio: 'Former RCAA examiner with 8 years of commercial UAV operations across East Africa. Holds RCAA RPL and KCAA certification.',
    accent: '#00F5C4',
  },
  {
    initials: 'SK',
    name: 'Sarah K.',
    role: 'Head of Agricultural Services',
    bio: 'Agronomist-turned-UAV specialist. Designed AEROVYN\'s multispectral survey methodology now used across 12 cooperative programmes.',
    accent: '#F5C400',
  },
  {
    initials: 'DO',
    name: 'David O.',
    role: 'Lead Aerial Cinematographer',
    bio: 'Broadcast camera operator for 10 years before transitioning to aerial. Credits include regional television and international campaigns.',
    accent: '#4D7CF5',
  },
  {
    initials: 'AM',
    name: 'Alice M.',
    role: 'Head of Training',
    bio: 'Certified flight instructor and curriculum designer. Developed AEROVYN\'s three-tier training framework adopted by 500+ graduates.',
    accent: '#C400F5',
  },
]

const timeline = [
  { year: '2020', event: 'AEROVYN founded in Kigali by Emmanuel K. and Sarah K. with two drones and a vision for data-driven operations.' },
  { year: '2021', event: 'First government contract — aerial survey of 40km road corridor for Rwanda Infrastructure Authority.' },
  { year: '2022', event: 'Training programme launched. First cohort of 20 pilots certified under RCAA-approved curriculum.' },
  { year: '2023', event: 'Agricultural services division established. Bugesera cooperative project covers 2,400 hectares across one season.' },
  { year: '2024', event: 'Expanded to Kenya operations. Drone fleet grows to 12 platforms across 5 categories.' },
  { year: '2025', event: 'Regional expansion — Uganda operations commence. 500th pilot certified. Fleet includes LiDAR and thermal platforms.' },
  { year: '2026', event: 'BVLOS authorisation in active development. Corporate training programmes launched for enterprise clients.' },
]

const values = [
  { title: 'Precision First', desc: 'Every mission is planned and executed to the highest accuracy standard. We don\'t approximate.' },
  { title: 'Africa-Built', desc: 'Designed for African terrain, airspace, and operating conditions — not adapted from elsewhere.' },
  { title: 'Safety Above All', desc: 'Zero-incident operations record. Safety management runs through every layer of our organisation.' },
  { title: 'Knowledge Transfers', desc: 'Every project is also a training opportunity. We build local capacity, not dependency.' },
]

const stats = [
  { value: '500+', label: 'Missions Completed' },
  { value: '500+', label: 'Pilots Certified' },
  { value: '10+', label: 'Countries Reached' },
  { value: '6', label: 'Years Operating' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="grid-bg px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 md:pb-20 md:pt-28">
        <div className="mx-auto max-w-7xl grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Our Story
            </p>
            <h1 className="mb-6 text-4xl font-black tracking-widest text-white sm:text-5xl md:text-7xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
              ABOUT
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-[#6B7A8D] sm:text-lg">
              AEROVYN was built to answer a simple question: what happens when professional-grade drone capability meets Africa&apos;s most demanding operational environments?
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#6B7A8D]">
              We started in Kigali in 2020 with two drones and a conviction that precision aerial data could transform how infrastructure, agriculture, and media projects are delivered across the continent.
            </p>
          </div>
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl p-6 text-center" style={{ background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.15)' }}>
                <p className="text-4xl font-black text-[#00F5C4] mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>{value}</p>
                <p className="text-xs text-[#6B7A8D] uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission + values */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            What Drives Us
          </p>
          <h2 className="mb-10 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-12" style={{ fontFamily: 'var(--font-orbitron)' }}>
            OUR VALUES
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {values.map(({ title, desc }, i) => (
              <div key={title} className="rounded-2xl p-5 md:p-6" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-bold text-[#00F5C4] mb-3 opacity-60" style={{ fontFamily: 'var(--font-orbitron)' }}>0{i + 1}</p>
                <h3 className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'var(--font-orbitron)' }}>{title}</h3>
                <p className="text-sm text-[#6B7A8D] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            The People
          </p>
          <h2 className="mb-10 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-12" style={{ fontFamily: 'var(--font-orbitron)' }}>
            MEET THE TEAM
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {team.map(({ initials, name, role, bio, accent }) => (
              <div key={name} className="group flex flex-col rounded-2xl p-5 transition-[border-color] duration-300 md:p-7" style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}20` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}50` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}20` }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-black mb-5" style={{ background: `${accent}20`, color: accent, fontFamily: 'var(--font-orbitron)' }}>
                  {initials}
                </div>
                <h3 className="font-bold text-white mb-0.5">{name}</h3>
                <p className="text-xs mb-3" style={{ color: accent }}>{role}</p>
                <p className="text-sm text-[#6B7A8D] leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Milestones
          </p>
          <h2 className="mb-12 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-14" style={{ fontFamily: 'var(--font-orbitron)' }}>
            OUR JOURNEY
          </h2>
          <div className="relative">
            {/* Vertical line — only show when circle icons align (sm+) */}
            <div className="absolute bottom-0 top-0 w-px hidden sm:block" style={{ left: '31px', background: 'linear-gradient(to bottom, rgba(0,245,196,0.4), rgba(0,245,196,0.05))' }} />
            <div className="space-y-8">
              {timeline.map(({ year, event }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="shrink-0 flex flex-col items-center sm:items-center">
                    <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center text-xs font-black border-2 bg-[#0a0b0d] z-10" style={{ borderColor: 'rgba(0,245,196,0.4)', color: '#00F5C4', fontFamily: 'var(--font-orbitron)' }}>
                      {year}
                    </div>
                  </div>
                  <div className="flex-grow pt-4">
                    <p className="text-sm text-[#C4CDD8] leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>Join Us</p>
          <h2 className="mb-4 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>FLY WITH AEROVYN</h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-[#6B7A8D] sm:text-base">Whether you need a mission flown or a career launched — we&apos;re here.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/services" className="w-full rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] sm:w-auto" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Our Services →
            </Link>
            <Link href="/training" className="w-full rounded-md border border-[rgba(255,255,255,0.2)] px-8 py-3.5 text-center text-sm font-medium text-white transition-all duration-300 hover:border-[rgba(0,245,196,0.5)] hover:text-[#00F5C4] sm:w-auto">
              Training Programmes
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
