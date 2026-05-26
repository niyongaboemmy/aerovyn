'use client'

import Link from 'next/link'
import { Camera, Map, Wrench, Sprout, Star, ChevronRight, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Map,
    title: 'Aerial Mapping & Surveying',
    slug: 'mapping',
    accent: '#00F5C4',
    summary: 'High-resolution orthomosaics, 3D models, LiDAR point clouds, and elevation data for infrastructure, construction, and land management.',
    features: ['2cm GSD photogrammetry', 'LiDAR fusion surveys', '3D point clouds & DEMs', 'QGIS / AutoCAD deliverables', 'GCP-controlled accuracy'],
  },
  {
    icon: Camera,
    title: 'Aerial Photography & Video',
    slug: 'photography',
    accent: '#4D7CF5',
    summary: 'Cinematic 4K/6K aerial imagery for real estate, broadcast, events, and brand campaigns — delivered colour-graded and edit-ready.',
    features: ['Full-frame 8K sensor systems', 'Golden hour & twilight shoots', 'Live broadcast streaming', 'DaVinci colour grade', 'Same-day social cuts'],
  },
  {
    icon: Wrench,
    title: 'Industrial Inspections',
    slug: 'inspection',
    accent: '#F54D4D',
    summary: 'Close-proximity structural and thermal inspection of towers, pipelines, rooftops, and solar arrays — zero worker-at-height risk.',
    features: ['4K close-proximity imaging', 'Thermal / IR camera options', 'GPS-tagged defect reports', '24-hour report turnaround', 'NDT methodology'],
  },
  {
    icon: Sprout,
    title: 'Agricultural Surveys',
    slug: 'agriculture',
    accent: '#F5C400',
    summary: 'Multispectral NDVI mapping, crop stress detection, and variable-rate prescription maps for smallholder cooperatives and commercial farms.',
    features: ['Multispectral NDVI imaging', 'Irrigation stress mapping', 'Prescription PDF + KMZ', 'Cooperative group pricing', 'Same-season results'],
  },
  {
    icon: Star,
    title: 'Events & Sports Coverage',
    slug: 'events',
    accent: '#C400F5',
    summary: 'End-to-end aerial production for marathons, concerts, ceremonies, and live broadcasts — from permit filing to highlight reel delivery.',
    features: ['5-drone operational crews', 'Live TV stream integration', 'CAA permit management', '6K RAW post-production', '48h highlight delivery'],
  },
]

const process = [
  { step: '01', title: 'Request', desc: 'Submit your project brief via our contact form or call our ops team directly.' },
  { step: '02', title: 'Assessment', desc: 'We review scope, airspace, weather windows, and permit requirements within 24 hours.' },
  { step: '03', title: 'Mission Plan', desc: 'A detailed operations plan, risk assessment, and equipment manifest is shared for sign-off.' },
  { step: '04', title: 'Execution', desc: 'Our certified crew deploys on schedule with primary and backup equipment systems.' },
  { step: '05', title: 'Delivery', desc: 'Processed data, edited media, or reports delivered to your specification. Typically within 5 business days.' },
]

const equipment = [
  { model: 'DJI Matrice 350 RTK', role: 'LiDAR & precision mapping', accent: '#00F5C4' },
  { model: 'DJI Inspire 3', role: 'Cinema & broadcast', accent: '#4D7CF5' },
  { model: 'DJI Phantom 4 Multispectral', role: 'Agricultural NDVI', accent: '#F5C400' },
  { model: 'DJI Matrice 300 RTK + H20T', role: 'Industrial inspection', accent: '#F54D4D' },
  { model: 'DJI Agras T40', role: 'Precision agriculture', accent: '#00D68F' },
  { model: 'DJI Avata 2', role: 'FPV & events', accent: '#C400F5' },
]

const pricing = [
  {
    tier: 'Standard',
    desc: 'Single-day missions, straightforward scope.',
    price: 'From $350',
    accent: '#00F5C4',
    items: ['Up to 8 hours on-site', '1 certified pilot', 'Basic processing included', 'Report within 5 days'],
  },
  {
    tier: 'Professional',
    desc: 'Multi-day or technically complex operations.',
    price: 'From $950',
    accent: '#4D7CF5',
    featured: true,
    items: ['Multi-day scheduling', '2-pilot crew', 'Advanced processing & QC', 'Priority 48h turnaround', 'CAA permit filing'],
  },
  {
    tier: 'Enterprise',
    desc: 'Long-term contracts and national-scale programmes.',
    price: 'Custom',
    accent: '#F5C400',
    items: ['Dedicated flight crew', 'SLA-backed delivery', 'Monthly reporting suite', 'Compliance management', 'Training included'],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="grid-bg pt-28 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            What We Offer
          </p>
          <h1 className="text-5xl font-black tracking-widest text-white md:text-7xl mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
            SERVICES
          </h1>
          <p className="text-lg text-[#6B7A8D] max-w-2xl leading-relaxed">
            From centimetre-accurate survey data to broadcast-quality aerial cinema — AEROVYN deploys the right platform, crew, and workflow for every mission.
          </p>
        </div>
      </div>

      {/* Service categories */}
      <section className="px-6 py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Capabilities
          </p>
          <h2 className="text-3xl font-black text-white mb-12 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
            WHAT WE FLY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, accent, summary, features }) => (
              <div
                key={title}
                className="group rounded-2xl p-7 flex flex-col transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]"
                style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}20` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}50` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}20` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}>
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <h3 className="text-base font-bold text-white mb-3 leading-snug" style={{ fontFamily: 'var(--font-orbitron)' }}>{title}</h3>
                <p className="text-sm text-[#6B7A8D] leading-relaxed mb-5 flex-grow">{summary}</p>
                <ul className="space-y-2">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#8A9BAE]">
                      <CheckCircle2 size={12} style={{ color: accent, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            How It Works
          </p>
          <h2 className="text-3xl font-black text-white mb-14 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
            THE PROCESS
          </h2>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-6 left-6 right-6 h-px hidden lg:block" style={{ background: 'linear-gradient(to right, rgba(0,245,196,0.4), rgba(0,245,196,0.1))' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {process.map(({ step, title, desc }) => (
                <div key={step} className="relative flex flex-col">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[#0a0b0d]" style={{ borderColor: 'rgba(0,245,196,0.5)' }}>
                    <span className="text-xs font-bold text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>{step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 tracking-wider" style={{ fontFamily: 'var(--font-orbitron)' }}>{title}</h3>
                  <p className="text-xs text-[#6B7A8D] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="px-6 py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Fleet
          </p>
          <h2 className="text-3xl font-black text-white mb-12 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
            OUR EQUIPMENT
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map(({ model, role, accent }) => (
              <div
                key={model}
                className="rounded-xl px-5 py-4 flex items-center gap-4"
                style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}20` }}
              >
                <div className="shrink-0 w-2 h-10 rounded-full" style={{ background: accent }} />
                <div>
                  <p className="text-sm font-semibold text-white">{model}</p>
                  <p className="text-xs text-[#6B7A8D] mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Investment
          </p>
          <h2 className="text-3xl font-black text-white mb-4 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
            PRICING
          </h2>
          <p className="text-[#6B7A8D] mb-12 max-w-xl">Every project is scoped individually. These tiers give a starting point — contact us for an accurate quote.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map(({ tier, desc, price, accent, featured, items }) => (
              <div
                key={tier}
                className="rounded-2xl p-8 flex flex-col"
                style={{
                  background: featured ? `${accent}08` : 'var(--bg-elevated)',
                  border: `${featured ? '2px' : '1px'} solid ${featured ? `${accent}50` : `${accent}20`}`,
                }}
              >
                {featured && (
                  <span className="mb-4 self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm" style={{ background: `${accent}20`, color: accent, fontFamily: 'var(--font-orbitron)' }}>
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-black text-white tracking-wider mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>{tier}</h3>
                <p className="text-xs text-[#6B7A8D] mb-5">{desc}</p>
                <p className="text-3xl font-black mb-6" style={{ color: accent, fontFamily: 'var(--font-orbitron)' }}>{price}</p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-[#C4CDD8]">
                      <ChevronRight size={14} style={{ color: accent, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="block text-center rounded-xl py-3 text-sm font-semibold transition-all duration-300"
                  style={featured
                    ? { background: accent, color: '#0A0B0D' }
                    : { border: `1px solid ${accent}40`, color: accent }
                  }
                >
                  Request Quote →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-2xl px-10 py-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(0,245,196,0.08), rgba(0,245,196,0.02))', border: '1px solid rgba(0,245,196,0.2)' }}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>Ready to Start</p>
          <h2 className="text-3xl font-black text-white mb-4 tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>PLAN YOUR MISSION</h2>
          <p className="text-[#6B7A8D] mb-8 max-w-md mx-auto">Tell us your requirements and we&apos;ll respond with a quote and timeline within one business day.</p>
          <Link href="/contact" className="inline-block rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] hover:scale-[1.02]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Get a Quote →
          </Link>
        </div>
      </section>
    </div>
  )
}
