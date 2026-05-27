'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote } from 'lucide-react'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote:
      'AEROVYN transformed our agricultural monitoring program. The precision and professionalism of their team exceeded every expectation — we now map 800 hectares in a single day.',
    name: 'John M.',
    role: 'CTO, AgriTech Rwanda',
    initials: 'JM',
  },
  {
    quote:
      'The best drone pilot training I have encountered on the continent. The instructors are world-class, the hardware is professional-grade, and the curriculum is genuinely industry-relevant.',
    name: 'Sarah K.',
    role: 'Aerial Photographer & Pilot',
    initials: 'SK',
  },
  {
    quote:
      'Professional, precise, and cutting-edge. AEROVYN delivered a complete infrastructure inspection survey in 3 days that would have taken our team 3 weeks on the ground.',
    name: 'David O.',
    role: 'Infrastructure Engineer, Kenya',
    initials: 'DO',
  },
]

export function Testimonials() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  useGSAP((g) => {
    g.from('.testimonials-inner', {
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!quoteRef.current || animating) return
      setAnimating(true)
      gsap.to(quoteRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setActive((prev) => (prev + 1) % testimonials.length)
          gsap.fromTo(
            quoteRef.current,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: 'power2.out',
              onComplete: () => setAnimating(false),
            }
          )
        },
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [animating])

  const t = testimonials[active]

  return (
    <section
      ref={sectionRef}
      className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p
          className="mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Testimonials
        </p>

        <div className="testimonials-inner">
          {/* Quote icon */}
          <div className="mb-8 flex justify-center">
            <Quote size={40} className="text-[rgba(0,245,196,0.25)]" />
          </div>

          {/* Quote text */}
          <div ref={quoteRef}>
            <blockquote className="mb-10 text-lg font-light leading-relaxed text-[#C4CDD8] sm:text-xl md:text-2xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-[#0A0B0D]"
                style={{ background: 'var(--gradient-brand)' }}
              >
                {t.initials}
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-[#6B7A8D]">{t.role}</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-10 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!animating && i !== active) {
                    setActive(i)
                  }
                }}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center"
                style={{ background: 'transparent', border: 'none' }}
                aria-label={`Go to testimonial ${i + 1}`}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 24 : 6,
                    height: 6,
                    background: i === active ? '#00F5C4' : 'rgba(255,255,255,0.2)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
