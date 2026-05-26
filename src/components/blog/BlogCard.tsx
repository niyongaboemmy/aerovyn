import Link from 'next/link'
import type { Post } from '@/data/posts'

const CATEGORY_COLORS: Record<string, string> = {
  Regulations: '#F54D4D',
  Agriculture: '#F5C400',
  Equipment: '#4D7CF5',
  Training: '#00F5C4',
  Industry: '#C400F5',
}

type Props = { post: Post; featured?: boolean }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function BlogCard({ post, featured = false }: Props) {
  const accent = CATEGORY_COLORS[post.category] ?? '#00F5C4'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border transition-all duration-300 hover:border-[rgba(0,245,196,0.3)] hover:shadow-[0_0_30px_rgba(0,245,196,0.06)]"
      style={{ background: '#111318', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className={`p-6 flex flex-col h-full ${featured ? 'md:p-8' : ''}`}>
        {/* Category badge */}
        <span
          className="mb-4 inline-block self-start text-[10px] font-semibold uppercase tracking-[0.25em] px-2.5 py-1 rounded-sm"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            color: accent,
            fontFamily: 'var(--font-orbitron)',
          }}
        >
          {post.category}
        </span>

        {/* Title */}
        <h3
          className={`font-bold text-white leading-snug mb-3 group-hover:text-[#00F5C4] transition-colors duration-200 ${
            featured ? 'text-2xl md:text-3xl line-clamp-3' : 'text-lg line-clamp-2'
          }`}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          className={`text-[#6B7A8D] leading-relaxed mb-6 flex-grow ${
            featured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
          }`}
        >
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          {/* Author avatar */}
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: `${accent}20`, color: accent, fontFamily: 'var(--font-orbitron)' }}
          >
            {post.author.initials}
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-xs font-medium text-white truncate">{post.author.name}</p>
            <p className="text-xs text-[#6B7A8D]">{post.author.role}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-[#6B7A8D]">{formatDate(post.publishedAt)}</p>
            <p className="text-xs text-[#6B7A8D]">{post.readTime}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
