'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { projects } from '@/data/projects'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import { Search } from 'lucide-react'

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

  const featuredProject = projects[0]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
        {/* Background photo from first project */}
        {featuredProject.image && (
          <Image
            src={featuredProject.image}
            alt="Projects"
            fill
            className="object-cover"
            style={{ opacity: 0.12 }}
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Our Work
          </p>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-widest text-white sm:text-5xl md:text-7xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
                PROJECTS
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#5A6A7E] sm:text-base">
                Real deployments, real outcomes — from infrastructure surveys across Rwanda to precision agriculture and urban photography.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex gap-6 shrink-0">
              {[
                { val: `${projects.length}+`, label: 'Projects' },
                { val: '5', label: 'Categories' },
                { val: '10+', label: 'Countries' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>{val}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#3D4A58]" style={{ fontFamily: 'var(--font-orbitron)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter + Search bar ── */}
      <div className="sticky top-16 z-20 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,11,13,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Categories */}
          <div className="flex shrink-0 gap-1.5">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className="shrink-0 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                  style={
                    activeCategory === cat
                      ? { background: 'rgba(0,245,196,0.12)', border: '1px solid rgba(0,245,196,0.4)', color: '#00F5C4', fontFamily: 'var(--font-orbitron)' }
                      : { background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#5A6A7E', fontFamily: 'var(--font-orbitron)' }
                  }
                >
                  {cat} <span className="ml-1 opacity-50">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="h-5 w-px shrink-0 bg-[rgba(255,255,255,0.08)]" />

          {/* Search */}
          <div className="relative min-w-[180px] max-w-xs flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D4A58]" />
            <label htmlFor="projects-search" className="sr-only">Search projects</label>
            <input
              id="projects-search"
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-full border bg-transparent py-1.5 pl-8 pr-4 text-xs text-white placeholder-[#3D4A58] focus:outline-none transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.1)', caretColor: '#00F5C4' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,245,196,0.35)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[#5A6A7E] text-base">No projects match your search.</p>
            <button
              onClick={() => { setActiveCategory('All'); setQuery(''); setDebouncedQuery('') }}
              className="mt-4 text-sm text-[#00F5C4] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filtered.map((project, i) => (
              <div
                key={project.slug}
                style={{ animation: `card-enter 0.5s ease-out ${i * 70}ms both` }}
              >
                <PortfolioCard project={project} tall={i % 3 === 1} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
