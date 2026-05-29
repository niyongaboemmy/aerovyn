import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'

type Props = { project: Project; tall?: boolean; index?: number }

export function PortfolioCard({ project, tall = false, index = 0 }: Props) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <div className="break-inside-avoid mb-5">
      <Link
        href={`/projects/${project.slug}`}
        className="group relative block overflow-hidden rounded-2xl"
        style={{
          paddingBottom: tall ? '90%' : '65%',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Photo — full opacity, let gradient handle readability */}
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}

        {/* Persistent dark gradient — heavier at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,11,13,0.94) 0%, rgba(10,11,13,0.4) 50%, rgba(10,11,13,0.1) 100%)' }}
        />

        {/* Accent glow — appears on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse at bottom left, ${project.accent}18 0%, transparent 60%)` }}
        />

        {/* Top row */}
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-5">
          <span
            className="text-[10px] font-black tracking-[0.3em]"
            style={{ color: project.accent, fontFamily: 'var(--font-orbitron)', opacity: 0.55 }}
          >
            {num}
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md"
            style={{
              background: 'rgba(10,11,13,0.6)',
              border: `1px solid ${project.accent}30`,
              color: project.accent,
              fontFamily: 'var(--font-orbitron)',
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Arrow badge — fades in on hover */}
        <div
          className="absolute right-4 top-11 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ background: project.accent }}
        >
          <ArrowUpRight size={15} className="text-black" />
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          {/* Tags */}
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded px-2.5 py-0.5 text-[9px] font-semibold tracking-wider"
                style={{
                  background: `${project.accent}12`,
                  border: `1px solid ${project.accent}28`,
                  color: project.accent,
                  fontFamily: 'var(--font-orbitron)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title always visible */}
          <h3
            className="font-black leading-snug text-white transition-all duration-300 group-hover:translate-y-0"
            style={{ fontFamily: 'var(--font-orbitron)', fontSize: 'clamp(0.9rem, 1.1vw, 1rem)' }}
          >
            {project.title}
          </h3>

          {/* Summary — slides up on hover */}
          <p
            className="overflow-hidden text-xs leading-relaxed text-[#6B7A8D] line-clamp-2 transition-all duration-500"
            style={{ maxHeight: '0px', opacity: 0 }}
          >
            {project.summary}
          </p>
        </div>

        {/* Inset accent border on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${project.accent}45` }}
        />
      </Link>
    </div>
  )
}
