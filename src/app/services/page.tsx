'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { services } from '@/data/services'

const RW = {
  hero:     'https://images.unsplash.com/photo-1708772565588-33785e13aa46?w=1920&q=85&fit=crop&auto=format',
  wideView: 'https://images.unsplash.com/photo-1721402495451-41724ae641a4?w=1920&q=80&fit=crop&auto=format',
  hills:    'https://images.unsplash.com/photo-1682773083924-6f0f5a700d8b?w=1200&q=80&fit=crop&auto=format',
}

const stats = [
  { value: '200+', label: 'Missions Flown' },
  { value: '30+',  label: 'Districts Covered' },
  { value: '50k+', label: 'Hectares Surveyed' },
  { value: '<30',  label: 'Min Delivery Time' },
]

const process = [
  { step: '01', title: 'Request',  desc: 'Submit your project brief via our contact form or call our ops team directly.' },
  { step: '02', title: 'Assess',   desc: 'We review scope, airspace, weather windows, and permit requirements within 24 hours.' },
  { step: '03', title: 'Plan',     desc: 'A detailed operations plan, risk assessment, and equipment manifest is prepared for sign-off.' },
  { step: '04', title: 'Execute',  desc: 'Our certified crew deploys on schedule with primary and backup equipment systems.' },
  { step: '05', title: 'Deliver',  desc: 'Processed data, media, or reports delivered to your specification — typically within 5 business days.' },
]

const fleet = [
  { model: 'DJI Matrice 350 RTK',       role: 'LiDAR & precision mapping', accent: '#00F5C4' },
  { model: 'DJI Inspire 3',             role: 'Cinema & broadcast',        accent: '#4D7CF5' },
  { model: 'DJI Phantom 4 Multispectral', role: 'Agricultural NDVI',       accent: '#F5C400' },
  { model: 'DJI Matrice 300 RTK + H20T', role: 'Industrial inspection',    accent: '#F54D4D' },
  { model: 'DJI Agras T40',             role: 'Precision agriculture',     accent: '#00D68F' },
  { model: 'DJI Avata 2',               role: 'FPV & events',              accent: '#C400F5' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* ── HERO ── */}
      <PageHero
        label="What We Offer"
        title="SERVICES"
        description="From centimetre-accurate survey data to broadcast-quality aerial cinema — AEROVYN deploys the right platform, crew, and workflow for every mission across Rwanda and beyond."
        image={RW.hero}
      />

      {/* ── STATS BAR ── */}
      <div className="border-y border-white/5" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 divide-x divide-white/5 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-7 px-4 text-center">
                <span className="text-3xl font-black text-[#00F5C4] sm:text-4xl" style={{ fontFamily: 'var(--font-orbitron)' }}>{value}</span>
                <span className="mt-1 text-xs uppercase tracking-widest text-[#6B7A8D]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICE GRID ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#00F5C4]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>Capabilities</p>
          </div>
          <h2 className="mb-12 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            WHAT WE <span style={{ color: '#00F5C4' }}>FLY</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-[320px]">
            {services.map(({ icon: Icon, title, slug, accent, image, summary, span }) => (
              <Link
                key={slug}
                href={`/services/${slug}`}
                className={`group relative overflow-hidden rounded-2xl ${span ?? ''}`}
                style={{ border: `1px solid ${accent}20` }}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, rgba(10,11,13,0.95) 0%, rgba(10,11,13,0.70) 50%, rgba(10,11,13,0.35) 100%)` }}
                  />
                </div>

                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${accent}55` }}
                />

                {/* Content — always readable, no animation */}
                <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
                  {/* Icon */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}35` }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>

                  {/* Title + summary + link */}
                  <div>
                    <h3
                      className="text-lg font-black text-white mb-2 leading-snug sm:text-xl"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {title}
                    </h3>
                    <p className="text-sm text-[#8A9BAE] leading-relaxed mb-4 line-clamp-2">
                      {summary}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                      style={{ color: accent }}
                    >
                      Learn more <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RWANDA FROM ABOVE ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={RW.wideView}
            alt="Rwanda aerial"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,11,13,0.95) 0%, rgba(10,11,13,0.75) 50%, rgba(10,11,13,0.85) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,245,196,0.07) 0%, transparent 55%)' }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:py-28">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
              The Land of a Thousand Hills
            </p>
            <h2 className="mb-6 text-2xl font-black tracking-wide text-white sm:text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-orbitron)', lineHeight: '1.1' }}>
              AEROVYN FLIES<br /><span style={{ color: '#00F5C4' }}>ACROSS RWANDA</span>
            </h2>
            <p className="mb-8 text-sm text-[#8A9BAE] leading-relaxed sm:text-base">
              From Musanze to Lake Kivu, from Kigali&apos;s skyline to the Eastern Province tea plantations — our drones cover every corner of Rwanda.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Provinces served', value: '5/5' },
                { label: 'CAA certified',    value: 'Yes' },
                { label: 'Avg. response',    value: '< 24h' },
                { label: 'BVLOS capable',    value: 'Yes' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-4 py-3 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-lg font-black text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>{value}</p>
                  <p className="mt-0.5 text-[10px] text-[#6B7A8D] uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#00F5C4]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>How It Works</p>
          </div>
          <h2 className="mb-14 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            THE PROCESS
          </h2>
          <div className="relative">
            <div className="absolute left-[3.5rem] right-[3.5rem] top-5 hidden h-px lg:block" style={{ background: 'linear-gradient(to right, rgba(0,245,196,0.5), rgba(0,245,196,0.05))' }} />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {process.map(({ step, title, desc }, i) => (
                <div key={step} className="relative flex flex-col">
                  <div className="relative mb-5 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--bg-elevated)', border: '1.5px solid rgba(0,245,196,0.45)' }}>
                    <span className="text-[10px] font-bold text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>{step}</span>
                    {i === 0 && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(0,245,196,0.15)' }} />}
                  </div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>{title}</h3>
                  <p className="text-xs text-[#6B7A8D] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FLEET ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#00F5C4]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>Fleet</p>
          </div>
          <h2 className="mb-10 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            OUR EQUIPMENT
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map(({ model, role, accent }) => (
              <div
                key={model}
                className="group flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-300 hover:translate-x-1"
                style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}18` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}40` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}18` }}
              >
                <div className="shrink-0 w-1 h-10 rounded-full" style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}40)` }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{model}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: accent }}>{role}</p>
                </div>
                <ChevronRight size={14} className="shrink-0 text-[#3A4555] transition-colors duration-300 group-hover:text-[#6B7A8D]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden mx-4 mb-8 rounded-3xl sm:mx-6">
        <div className="absolute inset-0">
          <Image src={RW.hills} alt="Rwanda green hills" fill className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,11,13,0.92) 0%, rgba(10,11,13,0.80) 60%, rgba(0,245,196,0.06) 100%)' }} />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,245,196,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,196,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="relative z-10 px-6 py-16 text-center sm:px-10 sm:py-20 md:py-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>Ready to Start</p>
          <h2 className="mb-5 text-3xl font-black tracking-wide text-white sm:text-4xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            PLAN YOUR<br /><span style={{ color: '#00F5C4' }}>MISSION</span>
          </h2>
          <p className="mx-auto mb-10 max-w-md text-sm text-[#8A9BAE] leading-relaxed">
            Tell us your requirements and we&apos;ll respond with a tailored quote and timeline within one business day.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-bold text-[#0A0B0D] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,245,196,0.5)] hover:scale-[1.03]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Get a Free Quote <ArrowRight size={14} />
            </Link>
            <Link
              href="/training"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-8 py-3.5 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-[#00F5C4]/40 hover:text-[#00F5C4]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Explore Training
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
