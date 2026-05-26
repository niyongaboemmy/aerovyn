import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { posts, getPostBySlug, getRelatedPosts } from '@/data/posts'
import { BlogCard } from '@/components/blog/BlogCard'

type Props = { params: Promise<{ slug: string }> }

const CATEGORY_COLORS: Record<string, string> = {
  Regulations: '#F54D4D',
  Agriculture: '#F5C400',
  Equipment: '#4D7CF5',
  Training: '#00F5C4',
  Industry: '#C400F5',
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return { title: post.title, description: post.excerpt }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, 2)
  const accent = CATEGORY_COLORS[post.category] ?? '#00F5C4'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Article hero */}
      <div className="grid-bg pt-28 pb-14 px-6 border-b border-[rgba(255,255,255,0.06)]">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#6B7A8D]" aria-label="Breadcrumb">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white truncate">{post.title}</span>
          </nav>

          {/* Category */}
          <span
            className="mb-5 inline-block text-[10px] font-semibold uppercase tracking-[0.3em] px-3 py-1 rounded-sm"
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
          <h1 className="text-3xl font-black text-white leading-tight mb-5 md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7A8D]">
            {/* Author avatar */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${accent}20`, color: accent, fontFamily: 'var(--font-orbitron)' }}
              >
                {post.author.initials}
              </div>
              <div>
                <span className="text-white font-medium">{post.author.name}</span>
                <span className="mx-1.5 text-[#6B7A8D]">·</span>
                <span>{post.author.role}</span>
              </div>
            </div>
            <span className="hidden sm:block text-[#3a4555]">|</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span className="text-[#3a4555]">|</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="mx-auto max-w-3xl px-6 py-14">
        <article className="space-y-6">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-[#C4CDD8] text-lg leading-8">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#C4CDD8',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author card */}
        <div
          className="mt-10 rounded-xl p-6 flex gap-5 items-start border"
          style={{ background: '#111318', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${accent}20`, color: accent, fontFamily: 'var(--font-orbitron)' }}
          >
            {post.author.initials}
          </div>
          <div>
            <p className="text-white font-semibold mb-0.5">{post.author.name}</p>
            <p className="text-xs text-[#6B7A8D] mb-2">{post.author.role}</p>
            <p className="text-sm text-[#6B7A8D] leading-relaxed">
              A member of the AEROVYN team sharing expertise from the field.
            </p>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-black text-white tracking-wider"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                RELATED ARTICLES
              </h2>
              <Link href="/blog" className="text-sm text-[#00F5C4] hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div
          className="mt-16 rounded-2xl p-10 text-center border"
          style={{
            background: 'linear-gradient(135deg, rgba(0,245,196,0.06) 0%, rgba(0,245,196,0.02) 100%)',
            borderColor: 'rgba(0,245,196,0.2)',
          }}
        >
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Stay Informed
          </p>
          <h3
            className="text-2xl font-black text-white mb-3 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            MORE FROM AEROVYN
          </h3>
          <p className="text-[#6B7A8D] mb-7 max-w-sm mx-auto text-sm">
            Regulations, technology, and operations — straight from the team flying the missions.
          </p>
          <Link
            href="/blog"
            className="inline-block rounded-md border border-[rgba(0,245,196,0.4)] px-7 py-3 text-sm font-semibold text-[#00F5C4] transition-all duration-300 hover:bg-[rgba(0,245,196,0.08)]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </div>
  )
}
