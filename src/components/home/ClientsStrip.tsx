'use client'

const clients = [
  {
    name: 'Rwanda Civil Aviation Authority',
    short: 'RCAA',
    role: 'Regulatory Partner',
    accent: '#00F5C4',
  },
  {
    name: 'Rwanda Ministry of Sports',
    short: 'MINISPORTS',
    role: 'National Infrastructure Mapping',
    accent: '#4D7CF5',
  },
  {
    name: 'Bridge2Rwanda',
    short: 'B2R',
    role: 'Precision Agriculture, 8 Districts',
    accent: '#F5C400',
  },
  {
    name: 'Rwanda TVET Board',
    short: 'RTB',
    role: 'National Schools Mapping',
    accent: '#F54D4D',
  },
  {
    name: 'Rwanda Energy Group',
    short: 'REG',
    role: 'Energy Infrastructure Pilot',
    accent: '#00D68F',
  },
]

export function ClientsStrip() {
  return (
    <section className="px-4 py-4 sm:px-6 sm:py-6">
      <div
        className="mx-auto max-w-7xl rounded-2xl px-4 py-6 sm:px-8 sm:py-8"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(0,245,196,0.1)',
        }}
      >
        <p
          className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.35em] text-[#6B7A8D]"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Trusted By Rwanda&apos;s Leading Institutions
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map(({ name, short, role, accent }) => (
            <div
              key={short}
              className="flex flex-col items-center gap-2 rounded-xl p-4 text-center"
              style={{
                background: `${accent}08`,
                border: `1px solid ${accent}20`,
              }}
            >
              <span
                className="text-xs font-black tracking-widest"
                style={{ color: accent, fontFamily: 'var(--font-orbitron)' }}
              >
                {short}
              </span>
              <span className="text-xs font-medium text-white leading-snug">{name}</span>
              <span className="text-[10px] text-[#6B7A8D] leading-snug">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
