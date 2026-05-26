'use client'

import { useState, useCallback, useRef } from 'react'
import { projects } from '@/data/projects'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import { useGSAP } from '@/hooks/useGSAP'

type Category = 'All' | 'Mapping' | 'Photography' | 'Agriculture' | 'Industrial' | 'Events'
const CATEGORIES: Category[] = ['All', 'Mapping', 'Photography', 'Agriculture', 'Industrial', 'Events']

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [query, setQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 200)
  }, [])

  const filtered = projects.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    if (!matchCategory) return false
    if (!debouncedQuery) return true
    const q = debouncedQuery.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.summary.toLowerCase().includes(q)
    )
  })

  useGSAP((g) => {
    g.from('.portfolio-card', {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero bar */}
      <div className="grid-bg pt-28 pb-14 px-6">
        <div className="mx-auto max-w-6xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Our Work
          </p>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1
              className="text-5xl font-black tracking-widest text-white md:text-7xl"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              PROJECTS
            </h1>
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A8D]"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search projects…"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111318] pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#6B7A8D] focus:border-[rgba(0,245,196,0.4)] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-16 z-20 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,11,13,0.9)] backdrop-blur-xl px-6">
        <div className="mx-auto max-w-6xl flex gap-1 overflow-x-auto py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
              style={
                activeCategory === cat
                  ? {
                      background: 'rgba(0,245,196,0.12)',
                      border: '1px solid rgba(0,245,196,0.4)',
                      color: '#00F5C4',
                      fontFamily: 'var(--font-orbitron)',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#6B7A8D',
                      fontFamily: 'var(--font-orbitron)',
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[#6B7A8D] text-lg">No projects match your search.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {filtered.map((project, i) => (
              <div key={project.slug} className="portfolio-card">
                <PortfolioCard project={project} tall={i % 3 === 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
