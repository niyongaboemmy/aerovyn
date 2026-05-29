import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Clock, Award } from 'lucide-react'
import type { Course } from '@/data/courses'

type Props = { course: Course; href?: string }

export function CourseCard({ course, href = '/training' }: Props) {
  const { level, levelColor, title, duration, image, features, prereq } = course

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
      style={{ background: '#111318', border: `1px solid ${levelColor}20` }}
    >
      {/* Photo */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Gradient fade to card */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(10,11,13,0.15) 0%, rgba(10,11,13,0.6) 70%, #111318 100%)`,
          }}
        />
        {/* Level badge — bottom-left of image */}
        <div className="absolute bottom-4 left-5 flex items-center gap-3">
          <span
            className="rounded px-3 py-1 text-[10px] font-bold tracking-[0.15em]"
            style={{
              background: `${levelColor}22`,
              color: levelColor,
              border: `1px solid ${levelColor}50`,
              fontFamily: 'var(--font-orbitron)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {level}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-white/70">
            <Clock size={11} />
            {duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          className="mb-4 text-base font-bold leading-snug text-white"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {title}
        </h3>

        {/* Separator */}
        <div className="mb-4 h-px w-full" style={{ background: `${levelColor}18` }} />

        {/* Features */}
        <ul className="mb-5 flex flex-1 flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-[#8A9BAE]">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: levelColor }} />
              {f}
            </li>
          ))}
        </ul>

        {/* Prerequisites */}
        <p className="mb-5 text-xs text-[#6B7A8D]">
          <span className="text-[#8A9BAE]">Prerequisites:</span> {prereq}
        </p>

        {/* CTA */}
        <Link
          href={href}
          className="flex w-full items-center justify-between rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300"
          style={{
            background: `${levelColor}10`,
            border: `1px solid ${levelColor}30`,
            color: levelColor,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = `${levelColor}1e` }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = `${levelColor}10` }}
        >
          <span className="flex items-center gap-2">
            <Award size={15} />
            Enroll Now
          </span>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
