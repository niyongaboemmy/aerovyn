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
    title: 'Certified Instructors',
    desc: 'All trainers hold internationally recognized UAV certifications with 5+ years of field experience.',
  },
  {
    icon: Cpu,
    title: 'Real Hardware & Simulators',
    desc: 'Train on industry-grade drones and professional flight simulators for maximum readiness.',
  },
  {
    icon: Briefcase,
    title: 'Industry-Grade Projects',
    desc: 'Hands-on exposure to real commercial projects — mapping, agriculture, inspections, and more.',
  },
  {
    icon: Users,
    title: 'Career Support & Networking',
    desc: 'Graduate into a thriving alumni network with job placement assistance and industry connections.',
  },
]

export function WhyAerovyn() {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useGSAP((g) => {
    const path = pathRef.current
    if (!path) return

    const len = path.getTotalLength()
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })

    g.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1,
      },
    })

    g.from('.why-node', {
      opacity: 0,
      scale: 0,
      duration: 0.4,
      stagger: 0.3,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      },
    })

    g.from('.why-item', {
      opacity: 0,
      x: 30,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Why Choose Us
          </p>
          <h2
            className="text-[clamp(1.8rem,4vw,3rem)] font-black text-white"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            THE AEROVYN ADVANTAGE
          </h2>
        </div>

        {/* Path + items layout */}
        <div className="relative">
          {/* Animated SVG vertical line (desktop only) */}
          <div className="pointer-events-none absolute left-[27px] top-0 hidden h-full lg:block" style={{ width: 2 }}>
            <svg width="2" height="100%" viewBox="0 0 2 500" preserveAspectRatio="none" className="h-full w-full">
              <path
                ref={pathRef}
                d="M1 0 L1 500"
                stroke="#00F5C4"
                strokeWidth="2"
                fill="none"
                strokeOpacity="0.5"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-12">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="why-item flex items-start gap-8 lg:ml-0">
                {/* Node dot + icon */}
                <div className="why-node relative shrink-0">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{
                      background: 'rgba(0,245,196,0.08)',
                      border: '1px solid rgba(0,245,196,0.3)',
                      zIndex: 1,
                      position: 'relative',
                    }}
                  >
                    <Icon size={22} className="text-[#00F5C4]" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <div className="mb-1 flex items-center gap-3">
                    <span
                      className="text-xs font-semibold tracking-widest text-[#00F5C4] opacity-60"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      0{i + 1}
                    </span>
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {title}
                    </h3>
                  </div>
                  <p className="max-w-lg text-sm leading-relaxed text-[#6B7A8D]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
