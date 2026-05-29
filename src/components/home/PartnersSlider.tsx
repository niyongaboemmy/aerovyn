'use client'

const partners = [
  {
    short: 'MINICT',
    name: 'Ministry of ICT & Innovation',
    category: 'Government',
    logo: '/images/partners/minict-logo.svg',
    accent: '#00F5C4',
    website: 'https://www.minict.gov.rw/',
  },
  {
    short: 'LUXAID',
    name: 'Luxembourg Development Cooperation',
    category: 'Development',
    logo: '/images/partners/luxdev-logo.png',
    accent: '#4D7CF5',
    website: 'https://luxdev.lu/en',
  },
  {
    short: 'GIZ',
    name: 'GIZ Germany',
    category: 'Development',
    logo: '/images/partners/giz-logo.png',
    accent: '#F5C400',
    website: 'https://www.giz.de/en/html/index.html',
  },
  {
    short: 'UR',
    name: 'University of Rwanda',
    category: 'Education',
    logo: '/images/partners/ur-logo.png',
    accent: '#00F5C4',
    website: 'https://www.ur.ac.rw/',
  },
  {
    short: 'KIGALI',
    name: 'The City of Kigali',
    category: 'Government',
    logo: '/images/partners/kigali-logo.jpg',
    accent: '#4D7CF5',
    website: 'https://www.kigalicity.gov.rw/',
  },
  {
    short: 'RSA',
    name: 'Rwanda Space Agency',
    category: 'Space & Tech',
    logo: '/images/partners/rsa-logo.png',
    accent: '#C400F5',
    website: 'https://space.gov.rw/',
  },
  {
    short: 'NLA',
    name: 'National Land Authority',
    category: 'Mapping',
    logo: '/images/partners/nla-logo.png',
    accent: '#00B8F5',
    website: 'https://www.lands.rw/',
  },
  {
    short: 'MINALOC',
    name: 'Ministry of Local Government',
    category: 'Government',
    logo: '/images/partners/minaloc-logo.svg',
    accent: '#F54D4D',
    website: 'https://www.minaloc.gov.rw/',
  },
]

const track = [...partners, ...partners, ...partners]

export function PartnersSlider() {
  return (
    <section
      className="overflow-hidden py-16 sm:py-20"
      style={{ background: 'var(--bg-surface)' }}
    >
      {/* ── Header ── */}
      <div className="mb-10 px-4 text-center sm:px-6">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Our Ecosystem
        </p>
        <h2
          className="text-[clamp(1.6rem,3.5vw,2.6rem)] font-black text-white"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          TRUSTED PARTNERS
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#5A6A7E]">
          Collaborating with government bodies, development agencies, and research institutions
          to advance drone innovation across Africa.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="mb-12 flex justify-center gap-10 px-4">
        {[
          { val: `${partners.length}`, label: 'Partners' },
          { val: '5+', label: 'Countries' },
          { val: '3', label: 'Sectors' },
        ].map(({ val, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>{val}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[#3D4A58]" style={{ fontFamily: 'var(--font-orbitron)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Two-row marquee with edge fades ── */}
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {/* Row 1 scrolls left */}
        <div className="group/track1 mb-4">
          <div className="flex animate-marquee-left py-2 group-hover/track1:[animation-play-state:paused]">
            {track.map((p, i) => (
              <a
                key={i}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group/card relative mx-4 flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                style={{
                  background: 'linear-gradient(145deg, #13151c 0%, #0d0e14 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = `${p.accent}40`
                  el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${p.accent}20, inset 0 1px 0 ${p.accent}15`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Accent top-edge glow line */}
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{ background: `linear-gradient(to right, transparent, ${p.accent}, transparent)` }}
                />

                {/* Logo area */}
                <div
                  className="relative flex h-[130px] w-full items-center justify-center overflow-hidden p-6"
                  style={{ background: '#0a0b0d' }}
                >
                  {/* Accent radial glow behind logo on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{ background: `radial-gradient(ellipse at center, ${p.accent}12 0%, transparent 70%)` }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="relative z-10 max-h-[80px] w-full object-contain opacity-75 transition-all duration-500 group-hover/card:opacity-100 group-hover/card:scale-105"
                    style={{ maxWidth: '180px' }}
                  />
                </div>

                {/* Divider with accent fade */}
                <div
                  className="h-px w-full transition-all duration-500"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />

                {/* Info */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="min-w-0 flex-1 pr-3">
                    <p
                      className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: p.accent, fontFamily: 'var(--font-orbitron)' }}
                    >
                      {p.category}
                    </p>
                    <p className="truncate text-sm font-semibold text-white/70 transition-colors duration-300 group-hover/card:text-white">
                      {p.name}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider"
                    style={{
                      background: `${p.accent}12`,
                      color: p.accent,
                      border: `1px solid ${p.accent}30`,
                      fontFamily: 'var(--font-orbitron)',
                    }}
                  >
                    {p.short}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Row 2 scrolls right */}
        <div className="group/track2">
          <div className="flex animate-marquee-right py-2 group-hover/track2:[animation-play-state:paused]">
            {[...track].reverse().map((p, i) => (
              <a
                key={`r2-${i}`}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group/card relative mx-4 flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                style={{
                  background: 'linear-gradient(145deg, #13151c 0%, #0d0e14 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = `${p.accent}40`
                  el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${p.accent}20, inset 0 1px 0 ${p.accent}15`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{ background: `linear-gradient(to right, transparent, ${p.accent}, transparent)` }} />
                <div className="relative flex h-[130px] w-full items-center justify-center overflow-hidden p-6" style={{ background: '#0a0b0d' }}>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{ background: `radial-gradient(ellipse at center, ${p.accent}12 0%, transparent 70%)` }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={p.name}
                    className="relative z-10 max-h-[80px] w-full object-contain opacity-75 transition-all duration-500 group-hover/card:opacity-100 group-hover/card:scale-105"
                    style={{ maxWidth: '180px' }} />
                </div>
                <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: p.accent, fontFamily: 'var(--font-orbitron)' }}>{p.category}</p>
                    <p className="truncate text-sm font-semibold text-white/70 transition-colors duration-300 group-hover/card:text-white">{p.name}</p>
                  </div>
                  <span className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider"
                    style={{ background: `${p.accent}12`, color: p.accent, border: `1px solid ${p.accent}30`, fontFamily: 'var(--font-orbitron)' }}>
                    {p.short}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
