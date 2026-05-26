import Link from 'next/link'
import type { Project } from '@/data/projects'

type Props = { project: Project; tall?: boolean }

export function PortfolioCard({ project, tall = false }: Props) {
  return (
    <div className="break-inside-avoid mb-6">
      <Link href={`/projects/${project.slug}`} className="group block relative overflow-hidden rounded-xl" style={{ background: project.gradient }}>
        {/* Variable height spacer */}
        <div style={{ paddingBottom: tall ? '90%' : '65%' }} />

        {/* Always-visible top content */}
        <div className="absolute inset-0 p-6 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-sm"
                style={{
                  background: `${project.accent}18`,
                  border: `1px solid ${project.accent}30`,
                  color: project.accent,
                  fontFamily: 'var(--font-orbitron)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hover overlay — slides up */}
          <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
            <p className="text-xs text-[#6B7A8D] uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {project.category}
            </p>
            <h3 className="text-lg font-bold text-white leading-snug mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-[#C4CDD8] leading-relaxed line-clamp-2">
              {project.summary}
            </p>
          </div>
        </div>

        {/* Bottom bar — always visible */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
        >
          <span className="text-sm font-medium text-white truncate pr-4">{project.title}</span>
          <span
            className="shrink-0 text-sm font-semibold translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            style={{ color: project.accent }}
          >
            →
          </span>
        </div>

        {/* Accent glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-xl"
          style={{ boxShadow: `inset 0 0 0 1px ${project.accent}40` }}
        />
      </Link>
    </div>
  )
}
