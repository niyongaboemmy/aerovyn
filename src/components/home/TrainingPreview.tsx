'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, Award } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/hooks/useGSAP'

gsap.registerPlugin(ScrollTrigger)

const courses = [
  {
    level: 'BEGINNER',
    levelColor: '#00D68F',
    title: 'Drone Fundamentals & Safety Certification',
    duration: '3 Days Intensive',
    features: [
      'Hands-on Flight Training',
      'Safety & Regulatory Briefing',
      'Certificate Issued',
      'No prior experience required',
    ],
    prereq: 'None',
    price: '$299',
  },
  {
    level: 'INTERMEDIATE',
    levelColor: '#FFB800',
    title: 'Advanced Piloting & Aerial Operations',
    duration: '5 Days',
    features: [
      'Night Flying Techniques',
      'Commercial License Pathway',
      'Mapping & Survey Methods',
      'Basic drone maintenance',
    ],
    prereq: 'Beginner Course',
    price: '$549',
  },
  {
    level: 'ADVANCED',
    levelColor: '#00F5C4',
    title: 'Professional UAV Pilot Certification',
    duration: '2 Weeks',
    features: [
      'Regulatory Compliance (RURA)',
      'Industrial & Precision Ops',
      'Career Support & Networking',
      'Enterprise project exposure',
    ],
    prereq: 'Intermediate Course',
    price: '$999',
  },
]

export function TrainingPreview() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP((g) => {
    g.from('.course-card', {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-24" style={{ background: 'var(--bg-surface)' }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Training Programs
          </p>
          <h2
            className="text-[clamp(1.8rem,4vw,3rem)] font-black text-white"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            START YOUR DRONE JOURNEY
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6B7A8D]">
            Structured programs for every level — from first flight to professional certification.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.level}
              className="course-card flex flex-col rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${course.levelColor}25`,
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Badge + duration */}
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="rounded px-3 py-1 text-[10px] font-bold tracking-[0.15em]"
                  style={{
                    background: `${course.levelColor}15`,
                    color: course.levelColor,
                    border: `1px solid ${course.levelColor}30`,
                    fontFamily: 'var(--font-orbitron)',
                  }}
                >
                  {course.level}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#6B7A8D]">
                  <Clock size={12} />
                  {course.duration}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-4 text-base font-semibold leading-snug text-white">
                {course.title}
              </h3>

              {/* Separator */}
              <div
                className="mb-5 h-px w-full"
                style={{ background: `${course.levelColor}20` }}
              />

              {/* Features */}
              <ul className="mb-6 flex flex-col gap-2.5">
                {course.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#8A9BAE]">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: course.levelColor }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Prerequisites */}
              <p className="mb-6 text-xs text-[#6B7A8D]">
                <span className="text-[#8A9BAE]">Prerequisites:</span> {course.prereq}
              </p>

              {/* CTA */}
              <div className="mt-auto">
                <Link
                  href="/training"
                  className="flex w-full items-center justify-between rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300"
                  style={{
                    background: `${course.levelColor}12`,
                    border: `1px solid ${course.levelColor}30`,
                    color: course.levelColor,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.background = `${course.levelColor}20`
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.background = `${course.levelColor}12`
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Award size={15} />
                    Enroll Now
                  </span>
                  <span>{course.price}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-12 text-center">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7A8D] transition-colors hover:text-[#00F5C4]"
          >
            View all courses & schedules →
          </Link>
        </div>
      </div>
    </section>
  )
}
