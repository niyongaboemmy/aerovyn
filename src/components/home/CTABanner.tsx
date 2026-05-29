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
    <section ref={sectionRef} className="overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-2xl px-5 py-10 text-center sm:px-8 sm:py-14 md:flex-row md:px-10 md:py-16 md:text-left"
        style={{ background: 'linear-gradient(135deg, #00f5c4 0%, #00b8a9 50%, #007a6e 100%)' }}
      >
        <div className="cta-content">
          <h2
            className="text-[clamp(1.5rem,4vw,2.8rem)] font-black leading-tight text-[#0A0B0D]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Ready to Elevate Your Operations?
          </h2>
          <p className="mt-2 text-base font-medium text-[#0A0B0D] opacity-70">
            Request a free consultation — we&apos;ll scope your mission within 24 hours.
          </p>
        </div>

        <div className="cta-content flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/contact"
            className="w-full rounded-xl bg-[#0A0B0D] px-8 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:bg-[#111318] hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:w-auto"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Request a Free Consultation →
          </Link>
          <Link
            href="/training"
            className="w-full rounded-xl border-2 border-[rgba(10,11,13,0.3)] px-8 py-3.5 text-center text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:border-[#0A0B0D] hover:bg-[rgba(10,11,13,0.08)] sm:w-auto"
          >
            Enroll in Training
          </Link>
        </div>
      </div>
    </section>
  )
}
