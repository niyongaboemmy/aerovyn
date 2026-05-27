'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip the animation on initial page load — just show content normally.
    // Only animate on subsequent client-side navigations.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Hide immediately (no transition), then fade+slide in next paint
    el.style.transition = 'none'
    el.style.opacity = '0'
    el.style.transform = 'translateY(10px)'

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.45s ease, transform 0.45s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    })

    return () => cancelAnimationFrame(id)
  }, [pathname])

  // No inline style here — server and client initial render are identical,
  // preventing the hydration attribute mismatch.
  return <div ref={ref}>{children}</div>
}
