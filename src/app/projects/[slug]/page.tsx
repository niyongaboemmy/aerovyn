import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { projects, getProjectBySlug, getRelatedProjects } from '@/data/projects'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import { PageHero } from '@/components/layout/PageHero'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Not Found' }
  return { title: project.title, description: project.summary }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const related = getRelatedProjects(slug, project.category, 3)
  const descriptionParagraphs = project.description.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <PageHero
        label={project.category}
        title={project.title}
        description={project.summary}
        image={project.image}
      >
        <nav className="flex items-center gap-2 text-xs text-[#6B7A8D]" aria-label="Breadcrumb">
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-white">{project.title}</span>
        </nav>
      </PageHero>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              {descriptionParagraphs.map((para, i) => (
                <p key={i} className="text-[#C4CDD8] text-base leading-8 mb-5">
                  {para}
                </p>
              ))}
            </section>

            {/* Outcome */}
            <section>
              <h2
                className="text-lg font-bold text-white mb-4 tracking-wider"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                <span style={{ color: project.accent }}>//</span> OUTCOME
              </h2>
              <div
                className="rounded-xl p-5 border"
                style={{ background: `${project.accent}08`, borderColor: `${project.accent}20` }}
              >
                <p className="text-[#C4CDD8] leading-7">{project.outcome}</p>
              </div>
            </section>

            {/* Technologies */}
            <section>
              <h2
                className="text-lg font-bold text-white mb-4 tracking-wider"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                <span style={{ color: project.accent }}>//</span> TECHNOLOGIES
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#C4CDD8',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right — sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Project details */}
              <div
                className="rounded-xl p-6 border"
                style={{ background: '#111318', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-[0.3em] mb-5"
                  style={{ color: project.accent, fontFamily: 'var(--font-orbitron)' }}
                >
                  Project Details
                </h3>
                <dl className="space-y-4">
                  {[
                    { label: 'Client', value: project.client },
                    { label: 'Location', value: project.location },
                    { label: 'Duration', value: project.duration },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-xs text-[#6B7A8D] uppercase tracking-wider mb-1">{label}</dt>
                      <dd className="text-sm text-white font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-sm"
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

              {/* Testimonial */}
              {project.testimonial && (
                <div
                  className="rounded-xl p-6 border"
                  style={{
                    background: `${project.accent}06`,
                    borderColor: `${project.accent}25`,
                    borderLeftWidth: '3px',
                    borderLeftColor: project.accent,
                  }}
                >
                  <p className="text-[#C4CDD8] text-sm leading-7 italic mb-4">
                    &ldquo;{project.testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-white text-sm font-semibold">{project.testimonial.name}</p>
                    <p className="text-[#6B7A8D] text-xs">{project.testimonial.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-2xl font-black text-white tracking-wider"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                RELATED PROJECTS
              </h2>
              <Link
                href="/projects"
                className="text-sm text-[#00F5C4] hover:underline transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {related.map((p) => (
                <PortfolioCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div
          className="mt-20 rounded-2xl p-10 text-center border"
          style={{
            background: 'linear-gradient(135deg, rgba(0,245,196,0.06) 0%, rgba(0,245,196,0.02) 100%)',
            borderColor: 'rgba(0,245,196,0.2)',
          }}
        >
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Start Your Project
          </p>
          <h3
            className="text-3xl font-black text-white mb-4 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            READY TO FLY?
          </h3>
          <p className="text-[#6B7A8D] mb-8 max-w-md mx-auto">
            Tell us about your project and we&apos;ll put together the right team and equipment for the job.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] hover:scale-[1.02]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Get in Touch →
          </Link>
        </div>
      </div>
    </div>
  )
}
