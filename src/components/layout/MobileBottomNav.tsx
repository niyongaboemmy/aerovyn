'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, GraduationCap, FolderOpen, Mail } from 'lucide-react'

const tabs = [
  { label: 'Home',     href: '/',         icon: Home          },
  { label: 'Services', href: '/services', icon: Briefcase     },
  { label: 'Training', href: '/training', icon: GraduationCap },
  { label: 'Projects', href: '/projects', icon: FolderOpen    },
  { label: 'Contact',  href: '/contact',  icon: Mail          },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(10, 11, 13, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(0, 245, 196, 0.12)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        animation: 'nav-slide-up 0.4s ease-out both',
      }}
    >
      <ul className="flex items-stretch justify-around">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href} className="relative flex-1">
              {/* Active indicator bar at top */}
              {active && (
                <div
                  className="absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 rounded-full"
                  style={{
                    background: '#00F5C4',
                    boxShadow: '0 0 10px rgba(0, 245, 196, 0.7)',
                  }}
                />
              )}
              <Link
                href={href}
                className="flex min-h-[56px] flex-col items-center justify-center gap-[3px] px-1 transition-all duration-200"
                style={{
                  color:      active ? '#00F5C4' : '#6B7A8D',
                  fontFamily: 'var(--font-orbitron)',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2 : 1.5}
                  style={{
                    filter: active ? 'drop-shadow(0 0 6px rgba(0,245,196,0.5))' : 'none',
                    transition: 'filter 0.2s ease',
                  }}
                />
                <span
                  className="text-[9px] font-medium uppercase tracking-widest"
                  style={{ letterSpacing: '0.08em' }}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
