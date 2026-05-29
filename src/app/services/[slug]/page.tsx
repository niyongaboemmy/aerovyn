import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle2, ArrowRight, ChevronRight, Cpu } from 'lucide-react'
import { services, getServiceBySlug } from '@/data/services'
import { PageHero } from '@/components/layout/PageHero'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: 'Not Found' }
  return { title: `${service.title} — AEROVYN`, description: service.summary }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const { icon: Icon, title, accent, image, description, features, useCases, deliverables, equipment } = service

  const otherServices = services.filter(s => s.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Hero */}
      <PageHero
        label="Our Services"
        title={title}
        description={service.summary}
        image={image}
      >
        <nav className="flex items-center gap-2 text-xs text-[#6B7A8D]" aria-label="Breadcrumb">
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <span>/</span>
          <span style={{ color: accent }}>{title}</span>
        </nav>
      </PageHero>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-18 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-14">

          {/* ── Left — main content ── */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                  style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                >
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <h2
                  className="text-xl font-black tracking-wide text-white sm:text-2xl"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  OVERVIEW
                </h2>
              </div>
              <div className="space-y-4">
                {description.map((para, i) => (
                  <p key={i} className="text-[#8A9BAE] leading-relaxed text-sm sm:text-base">
                    {para}
                  </p>
                ))}
              </div>
            </section>

            {/* Use cases */}
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accent, fontFamily: 'var(--font-orbitron)' }}>
                Applications
              </p>
              <h2
                className="mb-8 text-xl font-black tracking-wide text-white sm:text-2xl"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                USE CASES
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {useCases.map(({ title: ucTitle, desc }) => (
                  <div
                    key={ucTitle}
                    className="rounded-xl p-5"
                    style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}18` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accent }} />
                      <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        {ucTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6B7A8D] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-6">

            {/* Key capabilities */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}20` }}
            >
              <h3
                className="mb-5 text-sm font-black tracking-widest text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                CAPABILITIES
              </h3>
              <ul className="space-y-3">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#C4CDD8]">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: accent }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3
                className="mb-5 text-sm font-black tracking-widest text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                DELIVERABLES
              </h3>
              <ul className="space-y-2.5">
                {deliverables.map(d => (
                  <li key={d} className="flex items-start gap-2 text-xs text-[#8A9BAE]">
                    <ChevronRight size={12} className="shrink-0 mt-0.5" style={{ color: accent }} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h3
                className="mb-5 text-sm font-black tracking-widest text-white flex items-center gap-2"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                <Cpu size={14} style={{ color: accent }} />
                EQUIPMENT
              </h3>
              <ul className="space-y-2.5">
                {equipment.map(eq => (
                  <li key={eq} className="text-xs text-[#8A9BAE] flex items-center gap-2">
                    <span className="h-1 w-4 rounded-full shrink-0" style={{ background: `${accent}60` }} />
                    {eq}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: `${accent}08`, border: `1px solid ${accent}25` }}
            >
              <p className="text-xs text-[#6B7A8D] mb-4 leading-relaxed">
                Ready to deploy this service? Get a tailored quote within one business day.
              </p>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300 hover:opacity-90"
                style={{ background: accent, color: '#0A0B0D', fontFamily: 'var(--font-orbitron)' }}
              >
                Request a Quote <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Other services */}
      <section
        className="px-4 py-14 sm:px-6 sm:py-16"
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Explore More
          </p>
          <h2 className="mb-8 text-xl font-black tracking-wide text-white sm:text-2xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            OTHER SERVICES
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {otherServices.map(s => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:translate-x-1"
                style={{ background: 'var(--bg-elevated)', border: `1px solid ${s.accent}18` }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${s.accent}12`, border: `1px solid ${s.accent}30` }}
                >
                  <s.icon size={16} style={{ color: s.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{s.title}</p>
                  <p className="text-xs text-[#6B7A8D] mt-0.5 line-clamp-1">{s.summary}</p>
                </div>
                <ChevronRight size={14} className="shrink-0 text-[#3A4555] transition-colors group-hover:text-[#6B7A8D]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
