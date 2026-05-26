'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    // Tell ScrollTrigger about Lenis's virtual scroll position on every frame
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's ticker so both share the same rAF loop
    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    // Re-evaluate all trigger positions once the DOM has settled
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(refreshId)
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
