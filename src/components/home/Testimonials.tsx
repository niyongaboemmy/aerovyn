'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

const INTERVAL_MS = 5000

const testimonials = [
  {
    quote:
      'AEROVYN transformed our agricultural monitoring program. The precision and professionalism of their team exceeded every expectation — we now map 800 hectares in a single day.',
    name: 'John M.',
    role: 'CTO, AgriTech Rwanda',
    initials: 'JM',
    metric: '800 ha / day',
  },
  {
    quote:
      'The best drone pilot training I have encountered on the continent. The instructors are world-class, the hardware is professional-grade, and the curriculum is genuinely industry-relevant.',
    name: 'Sarah K.',
    role: 'Aerial Photographer & Pilot',
    initials: 'SK',
    metric: 'World-class instructors',
  },
  {
    quote:
      'Professional, precise, and cutting-edge. AEROVYN delivered a complete infrastructure inspection survey in 3 days that would have taken our team 3 weeks on the ground.',
    name: 'David O.',
    role: 'Infrastructure Engineer, Kenya',
    initials: 'DO',
    metric: '10× faster delivery',
  },
]

const RING_R = 22
const RING_CIRC = 2 * Math.PI * RING_R

function ProgressRing({ progress }: { progress: number }) {
  return (
    <svg
      className="absolute inset-0"
      width="56"
      height="56"
      viewBox="0 0 56 56"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Track */}
      <circle
        cx="28"
        cy="28"
        r={RING_R}
        fill="none"
        stroke="rgba(0,245,196,0.12)"
        strokeWidth="2.5"
      />
      {/* Fill */}
      <circle
        cx="28"
        cy="28"
        r={RING_R}
        fill="none"
        stroke="#00F5C4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={RING_CIRC}
        strokeDashoffset={RING_CIRC * (1 - progress)}
        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
      />
    </svg>
  )
}

function StarRow() {
  return (
    <div className="mb-4 flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#00F5C4">
          <path d="M7 1l1.55 3.14L12 4.74l-2.5 2.43.59 3.43L7 9l-3.09 1.6.59-3.43L2 4.74l3.45-.6z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)
  const animatingRef = useRef(false)

  const advance = useCallback((next: number) => {
    if (animatingRef.current) return
    animatingRef.current = true
    setActive(next)
    setProgress(0)
    startRef.current = performance.now()
    setTimeout(() => { animatingRef.current = false }, 400)
  }, [])

  // Progress ticker
  useEffect(() => {
    startRef.current = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const p = Math.min(elapsed / INTERVAL_MS, 1)
      setProgress(p)
      if (p >= 1) {
        advance((active + 1) % testimonials.length)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, advance])

  // Card active/inactive animation
  useEffect(() => {
    cardsRef.current.forEach((el, i) => {
      if (!el) return
      if (i === active) {
        gsap.to(el, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        })
        // shimmer sweep
        const shimmer = el.querySelector<HTMLElement>('.card-shimmer')
        if (shimmer) {
          gsap.fromTo(
            shimmer,
            { x: '-110%' },
            { x: '110%', duration: 0.8, ease: 'power1.inOut', delay: 0.15 }
          )
        }
      } else {
        gsap.to(el, {
          scale: 0.97,
          opacity: 0.45,
          y: 8,
          duration: 0.5,
          ease: 'power3.out',
        })
      }
    })
  }, [active])

  // Section entrance
  useGSAP(() => {
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 48,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 78%',
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28"
      style={{ background: 'var(--bg-surface)' }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(0,245,196,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Label */}
        <p
          className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Testimonials
        </p>

        {/* Heading */}
        <h2
          className="mb-14 text-center text-2xl font-light tracking-tight text-white sm:text-3xl"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Trusted by operators &amp; pilots
          <br />
          <span className="text-[#00F5C4]">across Africa</span>
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el }}
              onClick={() => advance(i)}
              className="relative cursor-pointer overflow-hidden rounded-2xl p-7 transition-shadow"
              style={{
                background:
                  i === active
                    ? 'linear-gradient(145deg, rgba(0,245,196,0.07) 0%, rgba(10,11,13,0.9) 100%)'
                    : 'rgba(255,255,255,0.03)',
                border: i === active
                  ? '1px solid rgba(0,245,196,0.35)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: i === active
                  ? '0 0 40px rgba(0,245,196,0.08), inset 0 1px 0 rgba(0,245,196,0.15)'
                  : 'none',
                willChange: 'transform, opacity',
              }}
            >
              {/* Shimmer sweep — only visible on active */}
              <div
                className="card-shimmer pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(0,245,196,0.06), transparent)',
                }}
              />

              {/* Top accent line */}
              {i === active && (
                <div
                  className="mb-6 h-px w-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, #00F5C4, transparent)',
                  }}
                />
              )}

              <StarRow />

              {/* Quote */}
              <blockquote className="mb-7 text-sm font-light leading-relaxed text-[#C4CDD8] sm:text-base">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Metric chip */}
              <div
                className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: 'rgba(0,245,196,0.08)',
                  border: '1px solid rgba(0,245,196,0.2)',
                  color: '#00F5C4',
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: '#00F5C4' }}
                />
                {t.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar with progress ring */}
                <div className="relative h-14 w-14 flex-shrink-0">
                  {i === active && <ProgressRing progress={progress} />}
                  <div
                    className="absolute inset-[5px] flex items-center justify-center rounded-full text-xs font-bold text-[#0A0B0D]"
                    style={{ background: 'var(--gradient-brand)' }}
                  >
                    {t.initials}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#6B7A8D]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot nav */}
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => advance(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="flex h-8 w-8 items-center justify-center"
              style={{ background: 'transparent', border: 'none' }}
            >
              <span
                className="block rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 28 : 6,
                  height: 4,
                  background:
                    i === active ? '#00F5C4' : 'rgba(255,255,255,0.15)',
                  boxShadow: i === active ? '0 0 8px rgba(0,245,196,0.6)' : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
