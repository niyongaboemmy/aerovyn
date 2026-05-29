'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    slug: 'aerial-mapping-rwanda',
    title: 'Aerial Mapping — Infrastructure Corridor',
    subtitle: 'Infrastructure Corridor Survey — Rwanda',
    category: 'Mapping',
    tags: ['#MAPPING', '#INFRASTRUCTURE'],
    accent: '#00F5C4',
    image: '/images/projects/mapping-infrastructure.jpg',
    stat: '120 km surveyed',
  },
  {
    slug: 'agricultural-survey-bugesera',
    title: 'Crop Health Monitoring — Bugesera',
    subtitle: 'NDVI Survey — 2,400 Hectares',
    category: 'Agriculture',
    tags: ['#AGRICULTURE', '#NDVI'],
    accent: '#F5C400',
    image: '/images/projects/agriculture-drone.jpg',
    stat: '18% yield improvement',
  },
  {
    slug: 'kigali-urban-photography',
    title: 'Urban Photography — Kigali',
    subtitle: 'City Skyline & Real Estate — Kigali',
    category: 'Photography',
    tags: ['#PHOTOGRAPHY', '#URBAN'],
    accent: '#4D7CF5',
    image: '/images/projects/kigali-aerial.jpg',
    stat: 'City-scale coverage',
  },
]

const AUTOPLAY_MS = 4000

export function FeaturedProjects() {
  const [active, setActive] = useState(0)
  const prevActive = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])
  const captionRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPausedRef = useRef(false)
  // Progress for the active dot timer bar
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef(Date.now())

  const goTo = (idx: number) => {
    setActive(idx)
  }

  const startProgress = () => {
    startTimeRef.current = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min(elapsed / AUTOPLAY_MS, 1)
      progressRef.current = pct
      setProgress(pct)
      if (pct < 1) rafRef.current = requestAnimationFrame(tick)
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    startProgress()
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setActive((prev) => (prev + 1) % projects.length)
        startProgress()
      }
    }, AUTOPLAY_MS)
  }

  // Boot autoplay once
  useEffect(() => {
    startAutoPlay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Section entrance animation
  useGSAP((g) => {
    g.from('.fp-header', {
      opacity: 0, y: 28, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
    })
    g.from('.fp-list-item', {
      opacity: 0, x: -40, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
    g.from('.fp-photo-wrap', {
      opacity: 0, scale: 1.03, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
  }, [])

  // Crossfade animation when active changes (no slide — avoids loop feel)
  useEffect(() => {
    const prev = prevActive.current
    const next = active
    if (prev === next) return

    const outEl = photoRefs.current[prev]
    const inEl = photoRefs.current[next]
    if (!outEl || !inEl) return

    gsap.killTweensOf([outEl, inEl])

    // Fade + subtle scale out
    gsap.to(outEl, {
      opacity: 0, scale: 0.97, duration: 0.45, ease: 'power2.in',
      onComplete: () => gsap.set(outEl, { pointerEvents: 'none' }),
    })

    // Fade + subtle scale in
    gsap.fromTo(
      inEl,
      { opacity: 0, scale: 1.025 },
      {
        opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.06,
        onStart: () => gsap.set(inEl, { pointerEvents: 'auto' }),
      }
    )

    // Caption crossfade
    if (captionRef.current) {
      gsap.fromTo(
        captionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.2 }
      )
    }

    prevActive.current = next
  }, [active])

  const cur = projects[active]

  return (
    <section ref={sectionRef} className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="fp-header mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Featured Work
            </p>
            <h2 className="text-[clamp(1.7rem,3.5vw,2.8rem)] font-black leading-tight text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              SELECTED<br />
              <span style={{ color: 'rgba(0,245,196,0.45)' }}>PROJECTS</span>
            </h2>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A6A7E] transition-colors duration-300 hover:text-[#00F5C4]">
            View all projects <ArrowRight size={14} />
          </Link>
        </div>

        {/* Desktop: list + photo */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:items-stretch">

          {/* ── List ── */}
          <div className="flex flex-col">
            {projects.map((p, i) => (
              <div
                key={p.slug}
                className="fp-list-item group cursor-pointer border-b py-6 pl-4 transition-all duration-300"
                style={{
                  borderColor: 'rgba(255,255,255,0.06)',
                  borderLeft: `2px solid ${active === i ? p.accent : 'transparent'}`,
                  transition: 'border-left-color 0.3s',
                }}
                onMouseEnter={() => { isPausedRef.current = true; goTo(i) }}
                onMouseLeave={() => { isPausedRef.current = false; startAutoPlay() }}
              >
                {/* Step row */}
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className="text-[10px] font-black tracking-[0.3em] transition-opacity duration-300"
                    style={{ color: p.accent, fontFamily: 'var(--font-orbitron)', opacity: active === i ? 1 : 0.3 }}
                  >
                    0{i + 1}
                  </span>
                  <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: '#3D4A58', fontFamily: 'var(--font-orbitron)' }}>
                    {p.category}
                  </span>
                </div>

                {/* Title — always left-aligned, no transform shift */}
                <h3
                  className="mb-1 font-black text-white transition-opacity duration-300"
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                    opacity: active === i ? 1 : 0.4,
                  }}
                >
                  {p.title}
                </h3>

                <p
                  className="text-xs transition-colors duration-300"
                  style={{ color: active === i ? '#5A6A7E' : '#2D3540' }}
                >
                  {p.stat}
                </p>

                {/* Tags + CTA — reveal on active */}
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: active === i ? '56px' : '0px', opacity: active === i ? 1 : 0 }}
                >
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded px-2.5 py-0.5 text-[10px] font-semibold tracking-wider"
                          style={{ color: p.accent, background: `${p.accent}10`, border: `1px solid ${p.accent}25`, fontFamily: 'var(--font-orbitron)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="flex items-center gap-1.5 text-xs font-bold hover:gap-2.5 transition-[gap] duration-200"
                      style={{ color: p.accent }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View project <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom CTA */}
            <div className="mt-auto pt-8">
              <Link
                href="/projects"
                className="group/all inline-flex items-center gap-3 text-sm font-semibold text-[#5A6A7E] transition-colors duration-300 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] transition-all duration-300 group-hover/all:border-[rgba(255,255,255,0.3)]">
                  <ArrowRight size={13} />
                </span>
                Browse all {projects.length}+ projects
              </Link>
            </div>
          </div>

          {/* ── Photo panel ── */}
          <div
            className="fp-photo-wrap relative overflow-hidden rounded-3xl"
            style={{ minHeight: '500px' }}
          >
            {/* Stacked photos — GSAP animates y+opacity directly */}
            {projects.map((p, i) => (
              <div
                key={p.slug}
                ref={(el) => { photoRefs.current[i] = el }}
                className="absolute inset-0"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  pointerEvents: i === 0 ? 'auto' : 'none',
                  willChange: 'transform, opacity',
                }}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="55vw"
                  priority={i === 0}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,11,13,0.9) 0%, rgba(10,11,13,0.2) 50%, transparent 100%)' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at top right, ${p.accent}14 0%, transparent 55%)` }}
                />
              </div>
            ))}

            {/* Caption — animated by GSAP on change */}
            <div ref={captionRef} className="absolute inset-x-0 bottom-0 p-8">
              <p
                className="mb-1 text-[10px] font-black uppercase tracking-[0.35em]"
                style={{ color: cur.accent, fontFamily: 'var(--font-orbitron)' }}
              >
                {cur.category}
              </p>
              <p className="text-lg font-black leading-snug text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                {cur.title}
              </p>
              <p className="mt-1 text-sm text-[#6B7A8D]">{cur.subtitle}</p>
            </div>

            {/* Dot nav with progress */}
            <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-2.5">
              {projects.map((p, i) => (
                <button
                  key={i}
                  onClick={() => { isPausedRef.current = false; goTo(i); startAutoPlay() }}
                  className="relative overflow-hidden rounded-full transition-all duration-400"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    height: '5px',
                    width: active === i ? '28px' : '5px',
                  }}
                  aria-label={`Show project ${i + 1}`}
                >
                  {/* Progress fill */}
                  {active === i && (
                    <span
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ background: p.accent, width: `${progress * 100}%`, transition: 'none' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Link button */}
            <Link
              href={`/projects/${cur.slug}`}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
              style={{ background: `${cur.accent}20`, border: `1px solid ${cur.accent}45` }}
            >
              <ArrowUpRight size={16} style={{ color: cur.accent }} />
            </Link>
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-5 lg:hidden">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group relative overflow-hidden rounded-2xl"
              style={{ height: '260px' }}
            >
              <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="100vw" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,11,13,0.92) 0%, rgba(10,11,13,0.3) 55%, transparent 100%)' }} />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span key={tag} className="rounded px-2 py-0.5 text-[10px] font-semibold" style={{ color: p.accent, background: `${p.accent}15`, border: `1px solid ${p.accent}30`, fontFamily: 'var(--font-orbitron)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>{p.title}</h3>
                <p className="mt-0.5 text-sm text-[#6B7A8D]">{p.stat}</p>
              </div>
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ background: p.accent }}>
                <ArrowUpRight size={14} className="text-black" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
