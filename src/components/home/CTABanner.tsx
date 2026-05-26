'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP((g) => {
    g.from('.cta-content', {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="overflow-hidden px-6 py-6">
      <div
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-2xl px-10 py-16 text-center md:flex-row md:text-left"
        style={{ background: 'linear-gradient(135deg, #00f5c4 0%, #00b8a9 50%, #007a6e 100%)' }}
      >
        <div className="cta-content">
          <h2
            className="text-[clamp(1.5rem,4vw,2.8rem)] font-black leading-tight text-[#0A0B0D]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Ready to Elevate Your Skills?
          </h2>
          <p className="mt-2 text-base font-medium text-[#0A0B0D] opacity-70">
            Start your drone journey today.
          </p>
        </div>

        <div className="cta-content flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href="/training"
            className="rounded-xl bg-[#0A0B0D] px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#111318] hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Get Started →
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border-2 border-[rgba(10,11,13,0.3)] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:border-[#0A0B0D] hover:bg-[rgba(10,11,13,0.08)]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
