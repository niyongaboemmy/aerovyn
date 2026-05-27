import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
}

export default function NotFound() {
  return (
    <div
      className="grid-bg min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* HUD-style 404 glyph */}
      <div className="relative mb-10 select-none">
        <p
          className="text-[160px] font-black leading-none tracking-tighter text-transparent md:text-[220px]"
          style={{
            fontFamily: 'var(--font-orbitron)',
            WebkitTextStroke: '1px rgba(0,245,196,0.25)',
          }}
        >
          404
        </p>
        <p
          className="absolute inset-0 flex items-center justify-center text-[160px] font-black leading-none tracking-tighter md:text-[220px]"
          style={{
            fontFamily: 'var(--font-orbitron)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(0,245,196,0.08)',
            transform: 'translate(3px, 3px)',
          }}
        >
          404
        </p>
      </div>

      <p
        className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4]"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        Signal Lost
      </p>
      <h1
        className="mb-4 text-3xl font-black tracking-wide text-white md:text-4xl"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        PAGE NOT FOUND
      </h1>
      <p className="mb-10 max-w-md text-base text-[#6B7A8D] leading-relaxed">
        The coordinates you requested are outside our operational airspace. The page may have moved or no longer exists.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] hover:scale-[1.02]"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Return Home →
        </Link>
        <Link
          href="/contact"
          className="rounded-md border border-[rgba(255,255,255,0.15)] px-8 py-3.5 text-sm font-medium text-[#C4CDD8] transition-all duration-300 hover:border-[rgba(0,245,196,0.4)] hover:text-[#00F5C4]"
        >
          Contact Us
        </Link>
      </div>

      {/* Decorative corner marks */}
      <div className="pointer-events-none fixed inset-8 hidden lg:block">
        {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((pos, i) => (
          <div key={i} className={`absolute w-8 h-8 ${pos} border-[rgba(0,245,196,0.2)]`} />
        ))}
      </div>
    </div>
  )
}
