'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to an error reporting service when available
    console.error('[AEROVYN]', error)
  }, [error])

  return (
    <div
      className="grid-bg min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: 'rgba(255,77,79,0.08)', border: '1px solid rgba(255,77,79,0.3)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF4D4F" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p
        className="mb-3 text-xs font-semibold uppercase tracking-[0.35em]"
        style={{ fontFamily: 'var(--font-orbitron)', color: '#FF4D4F' }}
      >
        System Fault
      </p>
      <h1
        className="mb-4 text-3xl font-black tracking-wide text-white md:text-4xl"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        UNEXPECTED ERROR
      </h1>
      <p className="mb-10 max-w-md text-base text-[#6B7A8D] leading-relaxed">
        Something went wrong on our end. Our team has been notified. You can try again or return to the homepage.
      </p>
      {error.digest && (
        <p className="mb-8 font-mono text-xs text-[#6B7A8D]">
          Error ID: <span className="text-[#8A9BAE]">{error.digest}</span>
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] hover:scale-[1.02]"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Try Again →
        </button>
        <Link
          href="/"
          className="rounded-md border border-[rgba(255,255,255,0.15)] px-8 py-3.5 text-sm font-medium text-[#C4CDD8] transition-all duration-300 hover:border-[rgba(0,245,196,0.4)] hover:text-[#00F5C4]"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
