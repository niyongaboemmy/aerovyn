'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // ── Lenis instance (created once, lives for the whole session) ─────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(refreshId)
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
    }
  }, [])

  // ── Kill stale ScrollTriggers on every navigation ──────────────────────────
  // Page components clean up their own ScrollTriggers in their useEffect
  // cleanup, but that runs *after* React has already started committing DOM
  // changes. Killing here — synchronously when the pathname flips — ensures
  // no pinned elements or scrub animations are alive when React reconciles.
  useEffect(() => {
    return () => {
      // kill(true) reverts pin spacers so React's removeChild finds nodes
      // in their original DOM positions during unmount.
      ScrollTrigger.getAll().forEach((st) => st.kill(true))
      gsap.killTweensOf('*')
    }
  }, [pathname])

  return <>{children}</>
}
