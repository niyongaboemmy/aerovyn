import Link from 'next/link'
import { Globe, Rss, Video, Youtube } from 'lucide-react'

const services = [
  { label: 'Aerial Mapping', href: '/services/drone-projects' },
  { label: 'Drone Inspections', href: '/services/drone-projects' },
  { label: 'Agricultural Surveys', href: '/services/drone-projects' },
  { label: 'Photography & Video', href: '/services/drone-projects' },
  { label: 'Custom UAV Deployments', href: '/services/drone-projects' },
]

const training = [
  { label: 'Beginner Course', href: '/training/courses' },
  { label: 'Intermediate Program', href: '/training/courses' },
  { label: 'Advanced Certification', href: '/training/certification' },
  { label: 'Corporate Training', href: '/training/courses' },
  { label: 'View All Courses', href: '/training' },
]

const socialLinks = [
  { icon: Globe,   href: '#', label: 'LinkedIn'  },
  { icon: Rss,     href: '#', label: 'Blog feed' },
  { icon: Video,   href: '#', label: 'YouTube'   },
  { icon: Youtube, href: '#', label: 'Subscribe' },
]

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: '#080A0C',
        borderColor: 'rgba(0, 245, 196, 0.2)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-mobile-nav pt-12 sm:px-6 sm:pt-16 md:pb-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-widest text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              <span className="text-[#00F5C4]">AERO</span>VYN
            </Link>
            <p className="text-sm leading-relaxed text-[#6B7A8D]">
              Elevating the future of airspace through precision drone operations
              and world-class pilot training programs.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[rgba(255,255,255,0.08)] text-[#6B7A8D] transition-all hover:border-[rgba(0,245,196,0.4)] hover:text-[#00F5C4]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Services */}
          <div>
            <h3
              className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#00F5C4]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7A8D] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Training */}
          <div>
            <h3
              className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#00F5C4]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Training
            </h3>
            <ul className="flex flex-col gap-3">
              {training.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7A8D] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3
              className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#00F5C4]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Contact
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[#6B7A8D]">
              <li>
                <a href="mailto:hello@aerovyn.com" className="transition-colors hover:text-white">
                  hello@aerovyn.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="transition-colors hover:text-white">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="leading-relaxed">
                Kigali, Rwanda<br />
                East Africa
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs text-[#6B7A8D]">
            © {new Date().getFullYear()} AEROVYN. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#6B7A8D]">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
