import Link from 'next/link'
import { Zap, Sprout, Building2, HeartPulse, Landmark, Mountain, Shield, GraduationCap, Star } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'

const industries = [
  {
    icon: Zap,
    title: 'Energy & Utilities',
    accent: '#F5C400',
    summary: 'Power line inspection, oil & gas infrastructure monitoring, and solar farm surveys — keeping Africa\'s energy infrastructure reliable, safe, and efficiently maintained.',
    useCases: ['Power transmission line inspection', 'Oil & gas pipeline monitoring', 'Solar farm thermal analysis', 'Wind turbine blade inspection', 'Substation mapping'],
  },
  {
    icon: Sprout,
    title: 'Agriculture & Food Security',
    accent: '#00D68F',
    summary: 'Crop monitoring, precision spraying, and irrigation mapping — giving African farmers the data intelligence they need to increase yield, reduce waste, and feed the continent.',
    useCases: ['Multispectral NDVI crop health', 'Precision fertilizer & pesticide spraying', 'Irrigation stress detection', 'Harvest yield estimation', 'Smallholder cooperative programmes'],
  },
  {
    icon: Building2,
    title: 'Construction & Real Estate',
    accent: '#00F5C4',
    summary: 'Topographic surveys, 3D terrain models, volumetric calculations, and construction progress documentation — precision geospatial intelligence for developers, engineers, and urban planners.',
    useCases: ['Topographic & cadastral surveys', '3D terrain modelling', 'Volumetric stockpile calculations', 'Construction progress tracking', 'Real estate aerial marketing'],
  },
  {
    icon: HeartPulse,
    title: 'Healthcare & Humanitarian',
    accent: '#F54D4D',
    summary: 'Emergency delivery of blood products, vaccines, and medicines to hospitals, clinics, and remote communities — reducing delivery times from hours to minutes and saving lives where it matters most.',
    useCases: ['Blood & vaccine emergency delivery', 'Remote community medical supply', 'Disaster relief cargo delivery', 'Field hospital resupply', 'Health facility mapping & surveys'],
  },
  {
    icon: Landmark,
    title: 'Government & Public Sector',
    accent: '#4D7CF5',
    summary: 'National mapping programmes, disaster response support, border surveillance, and infrastructure documentation — empowering governments with sovereign aerial intelligence at scale.',
    useCases: ['National infrastructure mapping', 'Disaster response & damage assessment', 'Border & perimeter surveillance', 'Urban planning & land management', 'Public sector facilities documentation'],
  },
  {
    icon: Mountain,
    title: 'Mining & Natural Resources',
    accent: '#C400F5',
    summary: 'Pit surveys, stockpile volumetrics, environmental compliance monitoring, and site safety inspections — delivering precision data across Africa\'s mineral-rich territories.',
    useCases: ['Open-pit mine surveys', 'Stockpile volume calculations', 'Environmental compliance monitoring', 'Tailings dam inspection', 'Site access & safety monitoring'],
  },
  {
    icon: Shield,
    title: 'Security & Defence',
    accent: '#F54D4D',
    summary: 'Perimeter surveillance, asset protection, crowd monitoring, and rapid incident response — providing 24/7 aerial intelligence for critical infrastructure, commercial sites, and protected zones.',
    useCases: ['24/7 perimeter surveillance', 'Critical asset protection', 'Crowd monitoring & event security', 'Industrial site monitoring', 'Rapid incident response support'],
  },
  {
    icon: GraduationCap,
    title: 'Education & Research',
    accent: '#F5C400',
    summary: 'Drone training academies, STEM programmes, academic research support, and institutional capacity building — cultivating the next generation of African drone professionals and researchers.',
    useCases: ['Certified pilot training programmes', 'STEM & youth engagement', 'Academic aerial research support', 'Institutional capacity building', 'Regulatory compliance coaching'],
  },
  {
    icon: Star,
    title: 'Events & Entertainment',
    accent: '#4D7CF5',
    summary: 'Spectacular drone light shows, live aerial broadcasts, and cinematic event coverage for national ceremonies, corporate launches, cultural celebrations, and international broadcasts.',
    useCases: ['Drone light shows', 'Live event aerial broadcast', 'Marathon & sports aerial coverage', 'Corporate ceremony coverage', 'Cultural & national event production'],
  },
]

export default function IndustriesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <PageHero
        label="Sectors We Power"
        title="INDUSTRIES"
        description="AEROVYN's solutions span nine critical sectors driving Africa's development agenda — from the fields that feed the continent to the infrastructure that powers its future."
        image="/images/projects/mapping-infrastructure.jpg"
      />

      {/* Industries Grid */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {industries.map(({ icon: Icon, title, accent, summary, useCases }, i) => (
              <div
                key={title}
                className="rounded-2xl p-5 md:p-6"
                style={{ background: 'var(--bg-elevated)', border: `1px solid ${accent}20` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold opacity-50 mb-1" style={{ color: accent, fontFamily: 'var(--font-orbitron)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h2 className="text-sm font-bold text-white leading-snug" style={{ fontFamily: 'var(--font-orbitron)' }}>
                      {title}
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-[#6B7A8D] leading-relaxed mb-4">{summary}</p>
                <ul className="space-y-1.5">
                  {useCases.map((uc) => (
                    <li key={uc} className="flex items-start gap-2 text-xs text-[#8A9AAD]">
                      <span className="mt-1 shrink-0 w-1 h-1 rounded-full" style={{ background: accent }} />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#00F5C4]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Your Sector, Our Expertise
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-wide text-white sm:text-3xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            READY TO GET STARTED?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-[#6B7A8D] sm:text-base">
            Tell us about your sector and project goals — we&apos;ll design a drone solution that delivers results.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="w-full rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] sm:w-auto"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Request a Free Consultation →
            </Link>
            <Link
              href="/services"
              className="w-full rounded-md border border-[rgba(255,255,255,0.2)] px-8 py-3.5 text-center text-sm font-medium text-white transition-all duration-300 hover:border-[rgba(0,245,196,0.5)] hover:text-[#00F5C4] sm:w-auto"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
