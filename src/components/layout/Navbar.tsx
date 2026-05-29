"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Rss, Video } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Training", href: "/training" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const socialLinks = [
  { icon: Globe, href: "#", label: "LinkedIn" },
  { icon: Video, href: "#", label: "YouTube" },
  { icon: Rss, href: "#", label: "Blog feed" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-[rgba(0,245,196,0.15)] bg-[rgba(10,11,13,0.85)] backdrop-blur-[20px]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-0 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-widest text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <span className="text-[#00F5C4]">AERO</span>VYN
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link text-sm font-medium tracking-wide transition-colors ${
                    pathname === link.href
                      ? "text-[#00F5C4]"
                      : "text-[#C4CDD8] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/simulator"
              className="flex items-center gap-1.5 rounded-md border border-[rgba(0,245,196,0.22)] px-4 py-2 text-xs font-semibold text-[#00F5C4] transition-all duration-300 hover:border-[rgba(0,245,196,0.5)] hover:bg-[rgba(0,245,196,0.06)] hover:shadow-[0_0_16px_rgba(0,245,196,0.15)]"
              style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.08em" }}
            >
              <span className="text-[10px]">◈</span> SIMULATOR
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-[rgba(0,245,196,0.5)] px-5 py-2 text-sm font-medium text-[#00F5C4] transition-all duration-300 hover:bg-[rgba(0,245,196,0.08)] hover:shadow-[0_0_20px_rgba(0,245,196,0.2)]"
            >
              Contact Us →
            </Link>
          </div>

          {/* Mobile hamburger — 44px touch target */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-md text-[#C4CDD8] transition-colors hover:text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay ─────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 flex flex-col grid-bg md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          background: "rgba(10, 11, 13, 0.97)",
          transition: "opacity 0.35s ease",
        }}
      >
        {/* Top accent gradient line */}
        <div
          className="absolute left-0 right-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #00F5C4 50%, transparent 100%)",
          }}
        />

        {/* Scrollable nav content — leaves room for bottom nav bar (64px) */}
        <div className="flex flex-1 flex-col justify-center overflow-y-auto px-8 pb-20 pt-24">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                className="transition-all duration-300"
                style={{
                  transform: menuOpen ? "translateX(0)" : "translateX(40px)",
                  transitionDelay: menuOpen ? `${i * 55}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                }}
              >
                <Link
                  href={link.href}
                  className={`group flex items-center gap-3 font-display text-3xl font-bold tracking-wider transition-colors ${
                    pathname === link.href
                      ? "text-[#00F5C4]"
                      : "text-white hover:text-[#00F5C4]"
                  }`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {/* Active dot */}
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300"
                    style={{
                      background:
                        pathname === link.href ? "#00F5C4" : "transparent",
                      boxShadow:
                        pathname === link.href
                          ? "0 0 8px rgba(0,245,196,0.8)"
                          : "none",
                      border:
                        pathname === link.href
                          ? "none"
                          : "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Simulator CTA */}
            <li
              className="mt-4 transition-all duration-300"
              style={{
                transform: menuOpen ? "translateX(0)" : "translateX(40px)",
                transitionDelay: menuOpen ? `${navLinks.length * 55}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
              }}
            >
              <Link
                href="/simulator"
                className="inline-flex items-center gap-2 rounded-md border border-[rgba(0,245,196,0.22)] px-6 py-3 text-xs font-semibold text-[#00F5C4] transition-all duration-300 hover:bg-[rgba(0,245,196,0.06)]"
                style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.1em" }}
                onClick={() => setMenuOpen(false)}
              >
                ◈ FLIGHT SIMULATOR
              </Link>
            </li>

            {/* Contact CTA */}
            <li
              className="mt-2 transition-all duration-300"
              style={{
                transform: menuOpen ? "translateX(0)" : "translateX(40px)",
                transitionDelay: menuOpen ? `${(navLinks.length + 1) * 55}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
              }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-[rgba(0,245,196,0.5)] px-6 py-3 text-sm font-medium text-[#00F5C4] transition-all duration-300 hover:bg-[rgba(0,245,196,0.08)]"
                onClick={() => setMenuOpen(false)}
              >
                Start a Project →
              </Link>
            </li>
          </ul>

          {/* Social links */}
          <div
            className="mt-10 flex items-center gap-4 transition-all duration-300"
            style={{
              transform: menuOpen ? "translateX(0)" : "translateX(40px)",
              transitionDelay: menuOpen
                ? `${(navLinks.length + 2) * 55}ms`
                : "0ms",
              opacity: menuOpen ? 1 : 0,
            }}
          >
            <span
              className="text-xs uppercase tracking-widest text-[#6B7A8D]"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              Follow
            </span>
            <div className="h-px flex-1 bg-[rgba(255,255,255,0.06)]" />
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[rgba(255,255,255,0.08)] text-[#6B7A8D] transition-colors hover:border-[rgba(0,245,196,0.3)] hover:text-[#00F5C4]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
