'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    num: '01',
    label: 'Operations',
    title: ['DRONE', 'PROJECTS'],
    desc: 'Infrastructure inspection, geospatial mapping, precision agriculture, medical logistics, aerial photography, and private security solutions across Africa.',
    tags: ['Mapping', 'Inspection', 'Agriculture', 'Logistics'],
    href: '/services',
    cta: 'Explore Services',
    image: '/images/home/svc-operations.jpg',
    video: '/videos/drone-operations.webm',
    accent: '#00F5C4',
    photoRight: true,
  },
  {
    num: '02',
    label: 'Education',
    title: ['DRONE', 'TRAINING'],
    desc: 'RCAA-certified pilot training from beginner to advanced, plus drone maintenance, regulatory coaching, and corporate capacity building programmes.',
    tags: ['RCAA Certified', 'Beginner → Pro', 'Corporate', 'Field Practice'],
    href: '/training',
    cta: 'View Courses',
    image: '/images/home/svc-training.jpg',
    video: '/videos/drone-training.webm',
    accent: '#4D7CF5',
    photoRight: false,
  },
]

export function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP((g) => {
    g.from('.svc-eyebrow', {
      opacity: 0, y: 28, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 84%' },
    })

    services.forEach((svc, i) => {
      g.from(`.svc-text-${i}`, {
        opacity: 0,
        x: svc.photoRight ? -64 : 64,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.svc-row-${i}`, start: 'top 78%' },
      })
      g.from(`.svc-img-${i}`, {
        opacity: 0,
        x: svc.photoRight ? 64 : -64,
        scale: 1.04,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: `.svc-row-${i}`, start: 'top 78%' },
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="px-4 sm:px-6" style={{ background: 'var(--bg-surface)' }}>
      <div className="mx-auto max-w-7xl">

        {/* ── Eyebrow ── */}
        <div className="svc-eyebrow flex flex-col gap-3 pt-16 pb-14 sm:flex-row sm:items-end sm:justify-between sm:pt-20 lg:pt-24">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
              What We Do
            </p>
            <h2 className="text-[clamp(1.7rem,3.5vw,2.8rem)] font-black leading-tight text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              TWO PILLARS OF<br />
              <span style={{ color: 'rgba(0,245,196,0.45)' }}>AERIAL EXCELLENCE</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#5A6A7E] sm:text-right">
            From precision aerial operations to structured pilot training — end-to-end drone excellence across Africa.
          </p>
        </div>

        {/* ── Rows ── */}
        <div className="pb-16 sm:pb-20 lg:pb-24">
          {services.map((svc, i) => (
            <div key={svc.num}>

              {/* Row */}
              <div
                className={`svc-row-${i} flex flex-col gap-10 py-12 lg:items-center lg:gap-16 lg:py-16 ${svc.photoRight ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* ── Text column ── */}
                <div className={`svc-text-${i} lg:w-[42%] flex flex-col`}>

                  {/* Step label */}
                  <div className="mb-6 flex items-center gap-4">
                    <span
                      className="text-[11px] font-black uppercase tracking-[0.35em]"
                      style={{ color: svc.accent, fontFamily: 'var(--font-orbitron)' }}
                    >
                      {svc.num}
                    </span>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${svc.accent}60, transparent)` }} />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: svc.accent + '80', fontFamily: 'var(--font-orbitron)' }}
                    >
                      {svc.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="mb-6 font-black leading-none text-white"
                    style={{
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                    }}
                  >
                    {svc.title[0]}<br />
                    <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)', color: 'transparent' }}>
                      {svc.title[1]}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="mb-8 text-sm leading-[1.8] text-[#5A6A7E] max-w-sm">
                    {svc.desc}
                  </p>

                  {/* Tags */}
                  <div className="mb-10 flex flex-wrap gap-2">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-wide text-white"
                        style={{ background: `${svc.accent}0e`, border: `1px solid ${svc.accent}28` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={svc.href}
                    className="group/cta mt-auto inline-flex items-center gap-2.5 text-sm font-bold transition-gap duration-300 hover:gap-4"
                    style={{ color: svc.accent }}
                  >
                    {svc.cta}
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover/cta:scale-110"
                      style={{ background: `${svc.accent}18`, border: `1px solid ${svc.accent}35` }}
                    >
                      <ArrowUpRight size={14} />
                    </span>
                  </Link>
                </div>

                {/* ── Media column ── */}
                <div
                  className={`svc-img-${i} group relative lg:w-[58%] overflow-hidden rounded-3xl`}
                  style={{ height: 'clamp(300px, 50vh, 520px)' }}
                >
                  {/* Video or static image background */}
                  {svc.video ? (
                    <video
                      src={svc.video}
                      poster={svc.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ objectPosition: svc.num === '01' ? 'center 55%' : 'center 35%' }}
                    />
                  ) : (
                    <Image
                      src={svc.image}
                      alt={svc.title.join(' ')}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ objectPosition: 'center 35%' }}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  )}

                  {/* Dark base overlay for legibility */}
                  <div className="absolute inset-0" style={{ background: 'rgba(10,11,13,0.30)' }} />

                  {/* Accent corner glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: svc.photoRight
                        ? `radial-gradient(ellipse at bottom left, ${svc.accent}20 0%, transparent 55%)`
                        : `radial-gradient(ellipse at bottom right, ${svc.accent}20 0%, transparent 55%)`,
                    }}
                  />

                  {/* Bottom vignette */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/4"
                    style={{ background: 'linear-gradient(to top, rgba(13,14,18,0.7), transparent)' }}
                  />

                  {/* Floating number badge */}
                  <div
                    className="absolute top-5 left-5 px-3 py-1.5 rounded-lg text-xs font-black backdrop-blur-md"
                    style={{
                      background: 'rgba(10,11,13,0.65)',
                      border: `1px solid ${svc.accent}30`,
                      color: svc.accent,
                      fontFamily: 'var(--font-orbitron)',
                    }}
                  >
                    {svc.num} / {svc.label.toUpperCase()}
                  </div>

                  {/* LIVE badge — only shown when video is active */}
                  {svc.video && <div
                    className="absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md"
                    style={{
                      background: 'rgba(10,11,13,0.65)',
                      border: `1px solid ${svc.accent}25`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ background: svc.accent }}
                    />
                    <span
                      className="text-[9px] font-black tracking-[0.2em]"
                      style={{ color: svc.accent, fontFamily: 'var(--font-orbitron)' }}
                    >
                      LIVE
                    </span>
                  </div>}
                </div>
              </div>

              {/* Separator */}
              {i < services.length - 1 && (
                <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)' }} />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
