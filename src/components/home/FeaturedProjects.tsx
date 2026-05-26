'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'Aerial Mapping',
    subtitle: 'Infrastructure Corridor Survey — Rwanda',
    tags: ['#MAPPING', '#INFRASTRUCTURE'],
    gradient: 'linear-gradient(135deg, #0d2b1a 0%, #051510 40%, #00f5c410 100%)',
    accent: '#00F5C4',
  },
  {
    title: 'Agricultural Survey',
    subtitle: 'Crop Health Monitoring — 2,400 Hectares',
    tags: ['#AGRICULTURE', '#UAV'],
    gradient: 'linear-gradient(135deg, #1a1a0d 0%, #110f05 40%, #f5c40010 100%)',
    accent: '#F5C400',
  },
  {
    title: 'Urban Photography',
    subtitle: 'City Skyline & Real Estate — Kigali',
    tags: ['#PHOTOGRAPHY', '#URBAN'],
    gradient: 'linear-gradient(135deg, #0d1120 0%, #050a18 40%, #4d7cf510 100%)',
    accent: '#4D7CF5',
  },
]

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    // Only enable horizontal scroll on desktop
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 96),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.5,
          end: () => '+=' + (track.scrollWidth - window.innerWidth + 96),
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={sectionRef} className="projects-section overflow-hidden">
      <div className="px-6 pb-4 pt-24">
        <div className="mx-auto max-w-7xl">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Featured Work
          </p>
          <h2
            className="text-[clamp(1.8rem,4vw,3rem)] font-black text-white"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            PROJECTS
          </h2>
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="px-6 pb-24 lg:hidden">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>

      {/* Desktop: horizontal track */}
      <div
        ref={trackRef}
        className="projects-track hidden lg:flex lg:gap-6 lg:px-12 lg:pb-24 lg:pt-8"
        style={{ width: 'max-content' }}
      >
        {projects.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({
  title,
  subtitle,
  tags,
  gradient,
  accent,
}: (typeof projects)[number]) {
  return (
    <div
      className="group relative flex h-72 w-full flex-shrink-0 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-7 lg:h-80 lg:w-[480px]"
      style={{ background: gradient, border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Corner arrow */}
      <div
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: accent }}
      >
        <ArrowUpRight size={16} className="text-[#0A0B0D]" />
      </div>

      {/* Content */}
      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded px-2.5 py-0.5 text-[10px] font-semibold tracking-wider"
              style={{
                background: `${accent}18`,
                color: accent,
                border: `1px solid ${accent}30`,
                fontFamily: 'var(--font-orbitron)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3
          className="text-xl font-bold text-white"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {title}
        </h3>
        <p className="mt-1 text-sm text-[#8A9BAE]">{subtitle}</p>
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(to top, rgba(10,11,13,0.7) 0%, transparent 50%)',
        }}
      />
    </div>
  )
}
