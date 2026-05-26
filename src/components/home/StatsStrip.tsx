'use client'

import { useCountUp } from '@/hooks/useCountUp'

const stats = [
  { target: 500, suffix: '+', label: 'Missions Completed' },
  { target: 50, suffix: '+', label: 'Courses Available' },
  { target: 98, suffix: '%', label: 'Success Rate' },
  { target: 10, suffix: '+', label: 'Countries Reached' },
]

function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useCountUp(target, suffix)
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span
        ref={ref}
        className="text-[clamp(2rem,5vw,3.5rem)] font-black text-[#00F5C4]"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        0{suffix}
      </span>
      <span className="text-sm font-medium uppercase tracking-widest text-[#6B7A8D]">
        {label}
      </span>
    </div>
  )
}

export function StatsStrip() {
  return (
    <section className="px-6 py-6">
      <div
        className="mx-auto max-w-7xl rounded-2xl px-8 py-10"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,245,196,0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
