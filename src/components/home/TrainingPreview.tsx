'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/hooks/useGSAP'
import { courses } from '@/data/courses'
import { CourseCard } from '@/components/training/CourseCard'

gsap.registerPlugin(ScrollTrigger)

// Show only the 3 main levels on the homepage (not Corporate)
const previewCourses = courses.filter((c) => c.level !== 'CORPORATE')

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
    <section ref={sectionRef} className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24" style={{ background: 'var(--bg-surface)' }}>
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
          {previewCourses.map((course) => (
            <div key={course.level} className="course-card">
              <CourseCard course={course} />
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
