'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only activate on pointer-capable devices (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const follower = followerRef.current
    if (!dot || !follower) return

    // Show cursor elements
    dot.style.opacity = '1'
    follower.style.opacity = '1'

    // Hide the native cursor on the entire document
    document.documentElement.style.cursor = 'none'

    const moveDot = (e: MouseEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power2.out' })
    }

    const expand = () => {
      gsap.to(follower, { scale: 2.2, borderColor: 'rgba(0,245,196,0.8)', duration: 0.25, ease: 'power2.out' })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }

    const collapse = () => {
      gsap.to(follower, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', duration: 0.25, ease: 'power2.out' })
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', moveDot)

    // Expand on interactive elements
    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', collapse)
    })

    // Re-attach for dynamically added elements via MutationObserver
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.removeEventListener('mouseenter', expand)
        el.removeEventListener('mouseleave', collapse)
        el.addEventListener('mouseenter', expand)
        el.addEventListener('mouseleave', collapse)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', moveDot)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', expand)
        el.removeEventListener('mouseleave', collapse)
      })
      observer.disconnect()
      document.documentElement.style.cursor = ''
    }
  }, [])

  return (
    <>
      {/* Dot — instant position */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0"
        style={{
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: '50%',
          background: '#00F5C4',
        }}
      />
      {/* Follower — lagged position */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.5)',
          background: 'rgba(0,245,196,0.04)',
        }}
      />
    </>
  )
}
