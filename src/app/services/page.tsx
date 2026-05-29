'use client'

import Link from 'next/link'
import { Map, Wrench, Sprout, Shield, Truck, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Wrench,
    title: 'Infrastructure Inspection',
    slug: 'inspection',
    accent: '#F54D4D',
    summary: 'Rapid, non-intrusive aerial inspection of power transmission lines, telecom towers, bridges, roads, pipelines, and large-scale industrial facilities — delivering high-resolution imagery, thermal analysis, and actionable maintenance reports.',
    features: ['Power line & telecom tower inspection', 'Thermal / IR analysis', 'GPS-tagged defect reports', '24-hour report turnaround', 'Zero worker-at-height risk'],
  },
  {
    icon: Sprout,
    title: 'Precision Agriculture & Crop Protection',
    slug: 'agriculture',
    accent: '#F5C400',
    summary: 'From crop health monitoring using multispectral imaging to precision spraying of fertilizers and pesticides — empowering African farmers with data-driven agriculture that reduces waste and increases yield.',
    features: ['Multispectral NDVI imaging', 'Precision spraying (fertilizers & pesticides)', 'Early disease & drought detection', 'Variable-rate prescription maps', 'Large-area coverage at speed'],
  },
  {
    icon: Map,
    title: 'Geospatial Mapping & Surveys',
    slug: 'mapping',
    accent: '#00F5C4',
    summary: 'Centimeter-accurate topographic surveys, 3D terrain models, volumetric calculations, and construction progress documentation for architects, engineers, developers, and urban planners.',
    features: ['2cm GSD photogrammetry', 'LiDAR fusion surveys', '3D point clouds & DEMs', 'QGIS / AutoCAD deliverables', 'GCP-controlled accuracy'],
  },
  {
    icon: Truck,
    title: 'Medical Logistics & Emergency Delivery',
    slug: 'medical',
    accent: '#4D7CF5',
    summary: 'Time-critical delivery of blood products, vaccines, medicines, and medical supplies to hospitals, clinics, and remote communities — shortening delivery times from hours to minutes and saving lives where it matters most.',
    features: ['Blood, vaccines & medicine delivery', 'Remote community access', 'Real-time flight tracking', 'Cold-chain compatible payloads', 'Sub-30-minute delivery windows'],
  },
  {
    icon: Shield,
    title: 'Private Security & Asset Monitoring',
    slug: 'security',
    accent: '#C400F5',
    summary: '24/7 aerial surveillance and asset monitoring for critical infrastructure, commercial properties, industrial sites, and protected zones — providing real-time visual intelligence and rapid incident response.',
    features: ['24/7 perimeter surveillance', 'Real-time visual intelligence', 'Industrial & commercial site monitoring', 'Rapid incident response support', 'Complements ground security forces'],
  },
  {
    icon: GraduationCap,
    title: 'Training, Maintenance & Value-Add',
    slug: 'training-services',
    accent: '#00D68F',
    summary: "Africa's drone knowledge hub — offering certified pilot training (beginner to advanced), drone maintenance services, regulatory compliance coaching, career development, and spectacular drone shows for national events and corporate ceremonies.",
    features: ['Certified pilot training programmes', 'Drone maintenance services', 'Regulatory compliance coaching', 'Career development pathways', 'Drone shows for events & celebrations'],
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
    accent: '#00F5C4',
    items: ['Up to 8 hours on-site', '1 certified pilot', 'Basic processing included', 'Report within 5 days'],
  },
  {
    tier: 'Professional',
    desc: 'Multi-day or technically complex operations.',
    accent: '#4D7CF5',
    featured: true,
    items: ['Multi-day scheduling', '2-pilot crew', 'Advanced processing & QC', 'Priority 48h turnaround', 'CAA permit filing'],
  },
  {
    tier: 'Enterprise',
    desc: 'Long-term contracts and national-scale programmes.',
    accent: '#F5C400',
    items: ['Dedicated flight crew', 'SLA-backed delivery', 'Monthly reporting suite', 'Compliance management', 'Training included'],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="grid-bg px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 md:pb-20 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            What We Offer
          </p>
          <h1 className="mb-6 text-4xl font-black tracking-widest text-white sm:text-5xl md:text-7xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            SERVICES
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#6B7A8D] sm:text-lg">
            From centimetre-accurate survey data to broadcast-quality aerial cinema — AEROVYN deploys the right platform, crew, and workflow for every mission.
          </p>
        </div>
      </div>

      {/* Service categories */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Capabilities
          </p>
          <h2 className="mb-10 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-12" style={{ fontFamily: 'var(--font-orbitron)' }}>
            WHAT WE FLY
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, accent, summary, features }) => (
              <div
                key={title}
                className="group flex flex-col rounded-2xl p-5 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_40px_rgba(0,0,0,0.4)] md:p-7"
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
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            How It Works
          </p>
          <h2 className="mb-12 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-14" style={{ fontFamily: 'var(--font-orbitron)' }}>
            THE PROCESS
          </h2>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-6 hidden h-px lg:block" style={{ background: 'linear-gradient(to right, rgba(0,245,196,0.4), rgba(0,245,196,0.1))' }} />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Fleet
          </p>
          <h2 className="mb-10 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-12" style={{ fontFamily: 'var(--font-orbitron)' }}>
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
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Investment
          </p>
          <h2 className="mb-3 text-2xl font-black tracking-wide text-white sm:text-3xl sm:mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>
            PRICING
          </h2>
          <p className="mb-10 max-w-xl text-sm text-[#6B7A8D] sm:text-base sm:mb-12">Every project is scoped individually. These tiers give a starting point — contact us for an accurate quote.</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricing.map(({ tier, desc, accent, featured, items }) => (
              <div
                key={tier}
                className="flex flex-col rounded-2xl p-5 sm:p-7 md:p-8"
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
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-7xl rounded-2xl px-5 py-10 text-center sm:px-10 sm:py-14 md:py-16" style={{ background: 'linear-gradient(135deg, rgba(0,245,196,0.08), rgba(0,245,196,0.02))', border: '1px solid rgba(0,245,196,0.2)' }}>
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
