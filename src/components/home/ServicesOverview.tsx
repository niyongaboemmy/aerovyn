'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { Plane, GraduationCap, ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Plane,
    title: 'DRONE PROJECTS',
    desc: 'Infrastructure inspection, geospatial mapping, precision agriculture, medical logistics, aerial photography, and private security solutions across Africa.',
    href: '/services',
    cta: 'Explore →',
  },
  {
    icon: GraduationCap,
    title: 'DRONE TRAINING',
    desc: 'RCAA-certified pilot training from beginner to advanced, plus drone maintenance, regulatory coaching, and corporate capacity building programmes.',
    href: '/training',
    cta: 'View Courses →',
  },
]

export function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP((g) => {
    g.from('.services-card', {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })
    g.from('.services-title-text', {
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left — large label */}
          <div className="services-title-text select-none">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              What We Do
            </p>
            <h2
              className="mt-4 leading-none text-[clamp(3rem,8vw,6rem)] font-black text-white opacity-90"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              WHAT
              <br />
              <span className="text-[rgba(0,245,196,0.25)]">WE DO</span>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-[#6B7A8D]">
              From precision aerial operations to structured pilot training — AEROVYN delivers
              end-to-end drone excellence across Africa and beyond.
            </p>
          </div>

          {/* Right — service cards */}
          <div className="flex flex-col gap-5">
            {services.map(({ icon: Icon, title, desc, href, cta }) => (
              <div
                key={title}
                className="services-card group rounded-2xl p-5 transition-[border-color,box-shadow] duration-300 md:p-6"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(0,245,196,0.2)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(0,245,196,0.6)'
                  el.style.boxShadow = '0 0 40px rgba(0,245,196,0.1)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(0,245,196,0.2)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(0,245,196,0.08)]">
                  <Icon size={22} className="text-[#00F5C4]" />
                </div>
                <h3
                  className="mb-2 text-sm font-bold tracking-widest text-white"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-[#6B7A8D]">{desc}</p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00F5C4] transition-gap hover:gap-2.5"
                >
                  {cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
