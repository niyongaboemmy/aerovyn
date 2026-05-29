'use client'

import Link from 'next/link'
import { PartnersSlider } from '@/components/home/PartnersSlider'
import { PageHero } from '@/components/layout/PageHero'

const team = [
  {
    initials: 'JT',
    name: 'Jean Claude Tuyisenge',
    role: 'Founder & Managing Director',
    bio: 'Entrepreneur, educator, and aviation innovator. Founder of New Generation Academy (NGA) — Rwanda\'s only NESA-accredited private coding academy. Board member of Edify International. Holds expertise in aviation technology, embedded systems, and African education.',
    accent: '#00F5C4',
  },
  {
    initials: 'PG',
    name: 'Pierre Gatama',
    role: 'Co-Founder & Director',
    bio: 'Seasoned professional and co-founder of AEROVYN, bringing operational expertise and strategic leadership to the company\'s pan-African expansion plans.',
    accent: '#4D7CF5',
  },
]

const timeline = [
  { year: '2026', event: 'AEROVYN LTD incorporated on 31 March 2026 under Rwanda Development Board (RDB). RCAA UAS Operator Certificate (UOC) obtained.' },
  { year: '2026', event: 'AEROVYN formally takes over the entire drone operations department of New Generation Academy (NGA) — including all equipment, ongoing contracts, active assignments, and trained personnel.' },
  { year: '2026', event: 'Flagship national engagements commence: MINISPORTS infrastructure mapping, Bridge2Rwanda precision agriculture across 8 districts, Rwanda TVET Board national schools survey, and Rwanda Energy Group infrastructure pilot.' },
  { year: '2026', event: 'Nigeria market entry in progress — AEROVYN\'s first pan-African expansion outside Rwanda.' },
]

const values = [
  { title: 'African Sovereignty', desc: 'We champion homegrown innovation, local capacity-building, and African ownership of digital infrastructure. Every service we deliver is a step toward continental self-determination.' },
  { title: 'Precision & Excellence', desc: 'We hold ourselves to the highest standards of accuracy, professionalism, and technical quality — because in our industry, precision is not optional, it is the mission.' },
  { title: 'Integrity Across Borders', desc: 'We operate transparently, ethically, and in full compliance with regulatory frameworks in every country we serve — earning trust one flight at a time.' },
  { title: 'Innovation at Altitude', desc: 'We relentlessly explore emerging technologies, push the frontiers of aerial intelligence, and adapt our solutions to the unique challenges of Africa\'s diverse landscapes and markets.' },
  { title: 'Partnership & Inclusion', desc: 'We build lasting partnerships with governments, development organizations, private enterprises, and local communities — because sustainable impact is always co-created.' },
  { title: 'Purpose-Driven Impact', desc: 'Every drone we fly, every dataset we deliver, and every training we conduct serves a greater purpose: a stronger, smarter, more connected Africa.' },
]

const stats = [
  { value: '6,000+', label: 'Missions Completed' },
  { value: '2,000+', label: 'Flight Hours' },
  { value: '10+', label: 'Countries Reached' },
  { value: '1+', label: 'Years Operating' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <PageHero
        label="Our Story"
        title="ABOUT"
        description="AEROVYN was born from a conviction: that Africa should not merely consume technology — Africa should own it, build it, and export it to the world."
        image="/images/projects/kigali-aerial.jpg"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.15)' }}>
              <p className="text-2xl font-black text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>{value}</p>
              <p className="mt-1 text-[10px] text-[#6B7A8D] uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Mission + values */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            What Drives Us
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            OUR VALUES
          </h2>
          <p className="mb-10 max-w-2xl text-sm text-[#6B7A8D] leading-relaxed sm:mb-12">
            AEROVYN operates across multiple African countries, guided by values that transcend borders and unite teams, clients, and communities under a shared commitment to excellence.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
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
          <div className="space-y-0">
            {timeline.map(({ year, event }, i) => (
              <div key={i} className="flex gap-6 items-stretch">
                {/* Left column: circle + connector line */}
                <div className="flex shrink-0 flex-col items-center" style={{ width: '64px' }}>
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-[#0a0b0d] text-xs font-black"
                    style={{ borderColor: 'rgba(0,245,196,0.5)', color: '#00F5C4', fontFamily: 'var(--font-orbitron)', flexShrink: 0 }}
                  >
                    {year}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1" style={{ background: 'linear-gradient(to bottom, rgba(0,245,196,0.35) 0%, rgba(0,245,196,0.08) 100%)', minHeight: '32px' }} />
                  )}
                </div>

                {/* Right column: event text */}
                <div className={`flex-grow py-4 ${i < timeline.length - 1 ? 'pb-8' : ''}`}>
                  <div
                    className="rounded-xl p-5"
                    style={{ background: 'rgba(0,245,196,0.03)', border: '1px solid rgba(0,245,196,0.08)' }}
                  >
                    <p className="text-sm text-[#C4CDD8] leading-relaxed">{event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Clients */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Proven at National Scale
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            FLAGSHIP CLIENTS
          </h2>
          <p className="mb-10 max-w-2xl text-sm text-[#6B7A8D] leading-relaxed sm:mb-12">
            AEROVYN serves Rwanda&apos;s leading national institutions and development programmes — demonstrating capacity to deliver at national scale.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {[
              { short: 'RCAA', name: 'Rwanda Civil Aviation Authority', accent: '#00F5C4', desc: 'AEROVYN operates as a fully licensed and compliant UAS operator under RCAA oversight, ensuring every mission meets national aviation safety standards.' },
              { short: 'MINISPORTS', name: 'Rwanda Ministry of Sports', accent: '#4D7CF5', desc: 'National project to digitalize all sports infrastructure across Rwanda — aerial mapping and documentation of stadiums, courts, and sports facilities country-wide.' },
              { short: 'B2R', name: 'Bridge2Rwanda', accent: '#F5C400', desc: 'Aerial coverage of crops and harvests for supported farmers across 8 districts — bringing precision-agriculture intelligence directly to smallholder farming communities.' },
              { short: 'RTB', name: 'Rwanda TVET Board', accent: '#F54D4D', desc: 'Mapping of all Technical and Vocational Education and Training (TVET) schools across Rwanda — a comprehensive national geospatial inventory of skills-development infrastructure.' },
              { short: 'REG', name: 'Rwanda Energy Group', accent: '#00D68F', desc: 'Pilot project for the mapping and inspection of national energy infrastructure — applying aerial intelligence to power assets to improve maintenance, planning, and reliability.' },
            ].map(({ short, name, accent, desc }) => (
              <div key={short} className="rounded-2xl p-5 md:p-6" style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}25` }}>
                <span className="text-xs font-black tracking-widest mb-3 block" style={{ color: accent, fontFamily: 'var(--font-orbitron)' }}>{short}</span>
                <h3 className="text-sm font-bold text-white mb-3">{name}</h3>
                <p className="text-sm text-[#6B7A8D] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partners */}
      <PartnersSlider />

      {/* Where We Operate */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Pan-African by Design
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            WHERE WE OPERATE
          </h2>
          <p className="mb-10 max-w-2xl text-sm text-[#6B7A8D] leading-relaxed sm:mb-12">
            AEROVYN&apos;s operations are pan-African by design, with a clear expansion roadmap as we bring drone intelligence to more of the continent.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-2xl">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(0,245,196,0.05)', border: '1px solid rgba(0,245,196,0.3)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-black tracking-widest text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>RWANDA</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A0B0D]" style={{ background: '#00F5C4' }}>Active</span>
              </div>
              <p className="text-sm text-[#C4CDD8] leading-relaxed">Headquarters &amp; full operations — our home base and the foundation of our continental expansion.</p>
            </div>
            <div className="rounded-2xl p-6" style={{ background: 'rgba(245,196,0,0.04)', border: '1px solid rgba(245,196,0,0.25)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-black tracking-widest text-[#F5C400]" style={{ fontFamily: 'var(--font-orbitron)' }}>NIGERIA</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A0B0D]" style={{ background: '#F5C400' }}>Launching Soon</span>
              </div>
              <p className="text-sm text-[#C4CDD8] leading-relaxed">Market entry in progress — AEROVYN&apos;s first pan-African expansion outside Rwanda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20" style={{ background: 'var(--bg-surface)' }}>
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
