'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Training', href: '/training' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[rgba(0,245,196,0.15)] bg-[rgba(10,11,13,0.85)] backdrop-blur-[20px]'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-widest text-white"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            <span className="text-[#00F5C4]">AERO</span>VYN
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-link text-sm font-medium tracking-wide text-[#C4CDD8] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="rounded-md border border-[rgba(0,245,196,0.5)] px-5 py-2 text-sm font-medium text-[#00F5C4] transition-all duration-300 hover:bg-[rgba(0,245,196,0.08)] hover:shadow-[0_0_20px_rgba(0,245,196,0.2)]"
            >
              Contact Us →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex items-center justify-center rounded-md p-2 text-[#C4CDD8] transition-colors hover:text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center px-8 transition-all duration-500 md:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'rgba(10, 11, 13, 0.97)' }}
      >
        <ul className="flex flex-col gap-8">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className="transition-all duration-300"
              style={{
                transform: menuOpen ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              <Link
                href={link.href}
                className="block font-display text-3xl font-bold tracking-wider text-white transition-colors hover:text-[#00F5C4]"
                style={{ fontFamily: 'var(--font-orbitron)' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            className="mt-4 transition-all duration-300"
            style={{
              transform: menuOpen ? 'translateX(0)' : 'translateX(40px)',
              transitionDelay: menuOpen ? `${navLinks.length * 60}ms` : '0ms',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            <Link
              href="/contact"
              className="inline-block rounded-md border border-[rgba(0,245,196,0.5)] px-6 py-3 text-sm font-medium text-[#00F5C4]"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us →
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
