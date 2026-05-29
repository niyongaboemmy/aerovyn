'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, Cpu, Briefcase, Users } from 'lucide-react'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    icon: ShieldCheck,
    num: '01',
    title: 'Pan-African Reach',
    desc: 'Operating across multiple African countries with culturally aware, locally embedded teams.',
  },
  {
    icon: Cpu,
    num: '02',
    title: 'Fully Licensed & Certified',
    desc: 'RCAA-certified UAS operator with RDB registration — compliant, credible, and accountable.',
  },
  {
    icon: Briefcase,
    num: '03',
    title: 'End-to-End Solutions',
    desc: 'From flight to insight — we collect, process, and deliver actionable data, not just raw footage.',
  },
  {
    icon: Users,
    num: '04',
    title: 'Training & Capacity Building',
    desc: "We don't just fly — we educate. Building Africa's next generation of drone professionals.",
  },
]

export function WhyAerovyn() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP((g) => {
    g.from('.why-item', {
      opacity: 0,
      x: 40,
      duration: 0.7,
      stagger: 0.18,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">

        {/* Left — header (sticky on desktop) */}
        <div className="mb-14 lg:mb-0 lg:sticky lg:top-32">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Why Choose Us
          </p>
          <h2
            className="mb-6 text-[clamp(1.8rem,4vw,3rem)] font-black text-white"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            THE AEROVYN ADVANTAGE
          </h2>
          <p className="text-sm leading-relaxed text-[#6B7A8D] max-w-sm">
            Four pillars that set AEROVYN apart — from the first briefing to the final deliverable.
          </p>
        </div>

        {/* Right — stacked items with inline connector */}
        <div>
          {values.map(({ icon: Icon, num, title, desc }, i) => (
            <div key={title} className="why-item flex gap-6 items-stretch">

              {/* Left col: icon box + connector line */}
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background: 'rgba(0,245,196,0.07)',
                    border: '1px solid rgba(0,245,196,0.25)',
                  }}
                >
                  <Icon size={22} className="text-[#00F5C4]" />
                  {/* Number badge top-right */}
                  <span
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black"
                    style={{
                      background: '#0a0b0d',
                      border: '1px solid rgba(0,245,196,0.35)',
                      color: '#00F5C4',
                      fontFamily: 'var(--font-orbitron)',
                    }}
                  >
                    {num}
                  </span>
                </div>
                {/* Connector — only between items, not after last */}
                {i < values.length - 1 && (
                  <div
                    className="w-px flex-1 my-1"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,245,196,0.3) 0%, rgba(0,245,196,0.05) 100%)',
                      minHeight: '40px',
                    }}
                  />
                )}
              </div>

              {/* Right col: text */}
              <div className={`flex-grow ${i < values.length - 1 ? 'pb-10' : ''} pt-1`}>
                <h3
                  className="mb-2 text-lg font-bold text-white leading-snug"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6B7A8D]">{desc}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
