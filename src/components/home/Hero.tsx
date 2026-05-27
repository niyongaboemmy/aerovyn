'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@/hooks/useGSAP'
import { splitToChars } from '@/lib/splitText'
import { PilotSimModal } from './PilotSimModal'

const HEADLINE = 'AEROVYN'
const chars = splitToChars(HEADLINE)

// Earth container 900×900; Earth 640×640 centred within
const CONTAINER  = 900
const EARTH_SIZE = 640
const EARTH_OFFSET = (CONTAINER - EARTH_SIZE) / 2   // 130
const HALF       = CONTAINER / 2                     // 450

// Orbit parameters (all in px, relative to container centre)
const ORBIT_A    = 370           // semi-major axis (1.16× Earth radius)
const ORBIT_B    = 138           // semi-minor  (B/A ≈ 0.37)
const ORBIT_TILT = -18 * (Math.PI / 180)

// ─── Star field ───────────────────────────────────────────────────────────────
type Star = {
  id: number; size: number; top: number; left: number; opacity: number
  color: string; twinkle: boolean; duration: number; delay: number
  drift: boolean; driftDur: number; driftDelay: number
}

function makeStarField(count = 260, animate = true): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const r = Math.random()
    return {
      id: i,
      size:       r < 0.07 ? 2.5 : r < 0.25 ? 1.5 : 1,
      top:        Math.random() * 100,
      left:       Math.random() * 100,
      opacity:    0.15 + Math.random() * 0.55,
      color:      r < 0.08 ? '#00F5C4' : r < 0.28 ? '#c0d8ff' : '#ffffff',
      // On mobile: static stars — zero CSS animations = zero compositor overhead
      twinkle:    animate && Math.random() < 0.22,
      duration:   2.5 + Math.random() * 5,
      delay:      Math.random() * 10,
      drift:      animate && Math.random() < 0.15,
      driftDur:   40 + Math.random() * 30,
      driftDelay: Math.random() * 20,
    }
  })
}

// ─── Nebula data ──────────────────────────────────────────────────────────────
const nebulae = [
  { style: { left: '-12%', top: '-8%', width: '62vw', height: '58vh' } as React.CSSProperties, color: 'radial-gradient(ellipse 55% 65% at 42% 48%, rgba(100,0,210,0.13) 0%, transparent 70%)', blur: 90,  breathe: '24s', drift: '40s', bDelay: '0s',  dDelay: '0s'  },
  { style: { right: '-8%', top: '-4%', width: '52vw', height: '52vh' } as React.CSSProperties, color: 'radial-gradient(ellipse 60% 55% at 52% 46%, rgba(0,50,200,0.11) 0%, transparent 68%)',   blur: 80,  breathe: '30s', drift: '48s', bDelay: '7s',  dDelay: '9s'  },
  { style: { left: '18%', top: '30%', width: '58vw', height: '42vh' } as React.CSSProperties, color: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,180,155,0.06) 0%, transparent 65%)',   blur: 100, breathe: '20s', drift: '52s', bDelay: '11s', dDelay: '6s'  },
  { style: { right: '2%', top: '40%', width: '42vw', height: '48vh' } as React.CSSProperties, color: 'radial-gradient(ellipse 52% 62% at 50% 50%, rgba(200,0,100,0.07) 0%, transparent 65%)',   blur: 85,  breathe: '27s', drift: '44s', bDelay: '15s', dDelay: '13s' },
  { style: { left: '-4%', bottom: '5%', width: '46vw', height: '40vh' } as React.CSSProperties, color: 'radial-gradient(ellipse 58% 52% at 48% 50%, rgba(185,100,0,0.06) 0%, transparent 62%)', blur: 95,  breathe: '22s', drift: '56s', bDelay: '19s', dDelay: '21s' },
]

const shootingStars = [
  { top: '9%',  left: '7%',   r: -38, dur: '14s', delay: '3s',  len: 140 },
  { top: '22%', left: '71%',  r: -42, dur: '18s', delay: '11s', len: 110 },
  { top: '5%',  left: '44%',  r: -35, dur: '12s', delay: '22s', len: 160 },
  { top: '48%', left: '18%',  r: -40, dur: '16s', delay: '31s', len: 125 },
  { top: '14%', left: '88%',  r: -36, dur: '10s', delay: '42s', len: 100 },
]

// ─── Nebula layer ─────────────────────────────────────────────────────────────
function NebulaLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {nebulae.map((n, i) => (
        <div key={i} className="absolute" style={{
          ...n.style, background: n.color, filter: `blur(${n.blur}px)`,
          animation: `nebula-breathe ${n.breathe} ease-in-out ${n.bDelay} infinite, nebula-drift ${n.drift} ease-in-out ${n.dDelay} infinite`,
          // No willChange: filter:blur + willChange on the same element creates a composited
          // layer that Safari handles poorly — causes frame drops even on desktop.
        }} />
      ))}
      {shootingStars.map((s, i) => (
        <div key={i} className="absolute overflow-hidden" style={{ top: s.top, left: s.left, transform: `rotate(${s.r}deg)`, transformOrigin: 'left center' }}>
          <div style={{
            width: s.len, height: 1.5, borderRadius: 2,
            background: 'linear-gradient(to right, transparent, rgba(200,235,255,0.9) 35%, #fff 55%, rgba(200,235,255,0.3) 80%, transparent)',
            boxShadow: '0 0 4px rgba(200,230,255,0.5)',
            animation: `shooting-star ${s.dur} linear ${s.delay} infinite`,
          }} />
        </div>
      ))}
    </div>
  )
}

// ─── Orbital arcs (background SVG) ───────────────────────────────────────────
function OrbitalArcs() {
  const dotRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    let t = 0
    const tick = () => {
      t += 0.0008
      if (t > 1) t = 0
      // Parametric quadratic bezier: P0=(−60,340) P1=(760,−60) P2=(1540,460)
      const mt = 1 - t
      const x = mt * mt * -60 + 2 * mt * t * 760 + t * t * 1540
      const y = mt * mt * 340 + 2 * mt * t * -60 + t * t * 460
      gsap.set(dot, { attr: { cx: x, cy: y } })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Three large orbital arc paths */}
        <path d="M -60 340 Q 760 -60 1540 460" stroke="rgba(0,245,196,0.035)" strokeWidth="1" />
        <path d="M -80 620 Q 500 200 1520 700" stroke="rgba(0,245,196,0.025)" strokeWidth="0.8" />
        <path d="M 200 -40 Q 900 320 1480 120" stroke="rgba(0,245,196,0.028)" strokeWidth="0.8" />
        {/* Animated dot traveling along first arc */}
        <circle ref={dotRef} cx="-60" cy="340" r="2.5" fill="rgba(0,245,196,0.55)"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,196,0.7))' }} />
        {/* Extra faint cross-arcs */}
        <path d="M 1540 200 Q 600 500 -60 800" stroke="rgba(0,245,196,0.018)" strokeWidth="0.6" strokeDasharray="6 14" />
        <path d="M 400 -20 Q 1100 450 300 920" stroke="rgba(0,245,196,0.016)" strokeWidth="0.6" strokeDasharray="4 18" />
      </svg>
    </div>
  )
}

// ─── Space objects (asteroids, satellite, comet) ───────────────────────────
const ASTEROIDS = [
  { top: '8%',  left: '-3%',  size: 18, speed: '55s', delay: '0s',  tx: '108vw', ty: '12vh',  rot: '80deg'   },
  { top: '62%', left: '-2%',  size: 11, speed: '72s', delay: '18s', tx: '106vw', ty: '-8vh',  rot: '-120deg' },
  { top: '18%', left: '102%', size: 14, speed: '64s', delay: '9s',  tx: '-108vw',ty: '6vh',   rot: '140deg'  },
  { top: '75%', left: '88%',  size: 9,  speed: '48s', delay: '33s', tx: '-40vw', ty: '-18vh', rot: '-90deg'  },
  { top: '35%', left: '-4%',  size: 22, speed: '88s', delay: '42s', tx: '110vw', ty: '-5vh',  rot: '60deg'   },
  { top: '50%', left: '105%', size: 13, speed: '60s', delay: '25s', tx: '-110vw',ty: '10vh',  rot: '-150deg' },
]

function AsteroidSVG({ size }: { size: number }) {
  const s = size
  const pts = `${s*0.3},0 ${s*0.8},${s*0.15} ${s},${s*0.45} ${s*0.88},${s*0.82} ${s*0.6},${s} ${s*0.18},${s*0.92} 0,${s*0.62} ${s*0.08},${s*0.25}`
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <polygon points={pts} fill="rgba(155,135,110,0.55)" stroke="rgba(200,180,150,0.28)" strokeWidth="0.7" />
      <polygon points={`${s*0.35},${s*0.2} ${s*0.65},${s*0.18} ${s*0.72},${s*0.5} ${s*0.48},${s*0.62} ${s*0.28},${s*0.52}`}
        fill="rgba(80,65,50,0.4)" />
    </svg>
  )
}

function SpaceObjectField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {ASTEROIDS.map((a, i) => (
        <div key={i} className="absolute" style={{ top: a.top, left: a.left }}>
          <div data-ast={String(i)} style={{ animation: `asteroid-cross-${i} ${a.speed} linear ${a.delay} infinite` }}>
            <AsteroidSVG size={a.size} />
          </div>
        </div>
      ))}

      {/* Satellite */}
      <div className="absolute" style={{ top: '4%', left: '94%' }}>
        <div style={{ animation: 'satellite-cross 90s linear 30s infinite' }}>
          <svg width="36" height="14" viewBox="0 0 36 14" fill="none"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0,245,196,0.45))' }}>
            <rect x="12" y="4" width="12" height="6" rx="1" fill="rgba(160,200,220,0.7)" stroke="rgba(0,245,196,0.4)" strokeWidth="0.6" />
            <rect x="0"  y="5" width="10" height="4" rx="0.5" fill="rgba(0,120,180,0.6)" stroke="rgba(0,245,196,0.3)" strokeWidth="0.5" />
            <rect x="26" y="5" width="10" height="4" rx="0.5" fill="rgba(0,120,180,0.6)" stroke="rgba(0,245,196,0.3)" strokeWidth="0.5" />
            <line x1="18" y1="0" x2="18" y2="14" stroke="rgba(0,245,196,0.25)" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Comet */}
      <div className="absolute" style={{ top: '2%', left: '96%' }}>
        <div style={{ animation: 'comet-streak 12s linear 45s infinite' }}>
          <svg width="80" height="8" viewBox="0 0 80 8" fill="none">
            <defs>
              <linearGradient id="comet-tail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="70%" stopColor="rgba(200,235,255,0.6)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
              </linearGradient>
            </defs>
            <rect x="0" y="3" width="72" height="2" rx="1" fill="url(#comet-tail)" />
            <circle cx="76" cy="4" r="3.5" fill="rgba(255,255,255,0.9)"
              style={{ filter: 'blur(1px) drop-shadow(0 0 4px rgba(200,235,255,1))' }} />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── Data stream columns ──────────────────────────────────────────────────────
const DATA_CHARS = '0\n1\nA\nF\n3\n7\nE\nB\n2\n9\nC\nD\n0\n0\n1\n1\nF\nF\n3\n3\n8\n5\n4\nA\nC\n6\nE\n1\n0\nB\n'
const DATA_COLUMNS = [
  { left: '7%',  opacity: 0.048, dur: '22s', delay: '0s'   },
  { left: '21%', opacity: 0.038, dur: '28s', delay: '5s'   },
  { left: '37%', opacity: 0.042, dur: '20s', delay: '11s'  },
  { left: '55%', opacity: 0.044, dur: '26s', delay: '3s'   },
  { left: '71%', opacity: 0.036, dur: '32s', delay: '16s'  },
  { left: '87%', opacity: 0.050, dur: '24s', delay: '8s'   },
]

function DataStreamColumns() {
  const content = DATA_CHARS.repeat(2)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {DATA_COLUMNS.map((col, i) => (
        <div key={i} className="absolute top-0 bottom-0 overflow-hidden" style={{ left: col.left, width: 12, opacity: col.opacity }}>
          <pre style={{
            fontFamily: 'var(--font-orbitron), monospace',
            fontSize: 7, lineHeight: '13px', color: '#00F5C4',
            margin: 0, padding: 0, whiteSpace: 'pre',
            animation: `data-stream ${col.dur} linear ${col.delay} infinite`,
          }}>
            {content}
          </pre>
        </div>
      ))}
    </div>
  )
}

// ─── Earth Globe (CSS image sphere) ──────────────────────────────────────────
function EarthGlobe({ textureRef }: { textureRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div style={{ width: EARTH_SIZE, height: EARTH_SIZE, position: 'relative' }}>
      <div className="earth-atmo" />
      <div style={{ width: EARTH_SIZE, height: EARTH_SIZE, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
        <div
          ref={textureRef}
          className="earth-surface-img"
          style={{
            width: '200%', height: '100%',
            backgroundImage: 'url(/earth-texture.jpg)',
            backgroundSize: '50% 100%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: '0% 50%',
          }}
        />
        <div style={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 68% 50%, transparent 35%, rgba(0,0,5,0.72) 80%, rgba(0,0,5,0.92) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 42% 38% at 30% 28%, rgba(220,240,255,0.13) 0%, transparent 60%)' }} />
      </div>
    </div>
  )
}

// ─── Drone SVG ────────────────────────────────────────────────────────────────
function DroneSVG({ size = 160, glowColor = 'rgba(0,245,196,0.65)' }: { size?: number; glowColor?: string }) {
  const scale = size / 160
  const motors = [
    { cx: 34,  cy: 34,  spin: 'rotor-cw',  led: true  },
    { cx: 126, cy: 34,  spin: 'rotor-ccw', led: false },
    { cx: 34,  cy: 126, spin: 'rotor-ccw', led: false },
    { cx: 126, cy: 126, spin: 'rotor-cw',  led: true  },
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none"
      style={{ filter: `drop-shadow(0 0 ${12 * scale}px ${glowColor})` }}>
      <defs>
        <filter id={`dg-glow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`dg-rotor-${size}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>
      <g filter={`url(#dg-glow-${size})`}>
        {motors.map(({ cx, cy }) => (
          <line key={`a${cx}${cy}`} x1={80} y1={80} x2={cx} y2={cy}
            stroke="#00F5C4" strokeWidth="2" strokeOpacity="0.72" strokeLinecap="round" />
        ))}
        <line x1="20"  y1="132" x2="48"  y2="132" stroke="#00F5C4" strokeWidth="1.2" strokeOpacity="0.3" />
        <line x1="112" y1="132" x2="140" y2="132" stroke="#00F5C4" strokeWidth="1.2" strokeOpacity="0.3" />
        <line x1="34"  y1="126" x2="34"  y2="132" stroke="#00F5C4" strokeWidth="1.2" strokeOpacity="0.3" />
        <line x1="126" y1="126" x2="126" y2="132" stroke="#00F5C4" strokeWidth="1.2" strokeOpacity="0.3" />
        {motors.map(({ cx, cy, spin, led }) => (
          <g key={`m${cx}${cy}`}>
            <ellipse cx={cx} cy={cy} rx={18} ry={18} fill="rgba(0,245,196,0.05)"
              stroke="rgba(0,245,196,0.18)" strokeWidth="6" filter={`url(#dg-rotor-${size})`} />
            <g className={spin}>
              <line x1={cx-16} y1={cy} x2={cx+16} y2={cy} stroke="#00F5C4" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.88" />
              <line x1={cx} y1={cy-16} x2={cx} y2={cy+16} stroke="#00F5C4" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.88" />
            </g>
            <circle cx={cx} cy={cy} r="3.5" fill="rgba(0,245,196,0.9)" />
            {led && <circle cx={cx} cy={cy} r="2" fill="#00F5C4" style={{ animation: 'led-blink 2.4s ease-in-out infinite' }} />}
          </g>
        ))}
        <rect x="66" y="66" width="28" height="28" rx="5" fill="rgba(0,245,196,0.07)" stroke="rgba(0,245,196,0.5)" strokeWidth="1.2" />
        <line x1="80" y1="68" x2="80" y2="92" stroke="rgba(0,245,196,0.22)" strokeWidth="0.8" />
        <line x1="68" y1="80" x2="92" y2="80" stroke="rgba(0,245,196,0.22)" strokeWidth="0.8" />
        <circle cx="80" cy="80" r="4" fill="rgba(0,245,196,0.4)" stroke="#00F5C4" strokeWidth="0.8" />
        <circle cx="80" cy="96" r="5" fill="rgba(0,245,196,0.12)" stroke="rgba(0,245,196,0.45)" strokeWidth="1" />
        <circle cx="80" cy="96" r="2.2" fill="rgba(0,245,196,0.5)" />
      </g>
    </svg>
  )
}

// ─── Orbiting Drone (pure orbit — no cursor follow) ──────────────────────────
function OrbitDrone() {
  const droneRef   = useRef<HTMLDivElement>(null)
  const svgWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drone   = droneRef.current
    const svgWrap = svgWrapRef.current
    if (!drone) return

    const fadeIn = gsap.fromTo(drone, { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1, duration: 1.6, delay: 1.4, ease: 'back.out(1.2)' })

    let t = 0
    let prevX = ORBIT_A

    const tick = () => {
      t += 0.0052
      const lx = ORBIT_A * Math.cos(t)
      const ly = ORBIT_B * Math.sin(t)
      const x  = lx * Math.cos(ORBIT_TILT) - ly * Math.sin(ORBIT_TILT)
      const y  = lx * Math.sin(ORBIT_TILT) + ly * Math.cos(ORBIT_TILT)
      const dx = x - prevX; prevX = x
      gsap.set(drone, {
        x: HALF - 80 + x, y: HALF - 80 + y,
        zIndex:  ly > 0 ? 3 : 8,
        opacity: ly > 0 ? 0.18 : 1,
        scale:   ly > 0 ? 0.88 : 1,
      })
      if (svgWrap) gsap.to(svgWrap, { rotationY: Math.max(-22, Math.min(22, -dx * 22)), duration: 0.35, overwrite: 'auto' })
    }

    gsap.ticker.add(tick)
    return () => {
      fadeIn.kill()
      gsap.killTweensOf(svgWrap)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div ref={droneRef} className="pointer-events-none absolute"
      style={{ top: 0, left: 0, width: 160, height: 160, perspective: '600px' }}>
      <div ref={svgWrapRef} style={{ transformStyle: 'preserve-3d' }}>
        <DroneSVG />
      </div>
    </div>
  )
}

// ─── Surface Drone (stays on Earth face, follows cursor very slowly) ─────────
function SurfaceDrone({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const droneRef   = useRef<HTMLDivElement>(null)
  const svgWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drone   = droneRef.current
    const svgWrap = svgWrapRef.current
    const hero    = heroRef.current
    if (!drone || !hero) return

    if (window.matchMedia('(pointer: coarse)').matches) return

    gsap.set(drone, { x: HALF - 80, y: HALF - 80, scale: 0.72, opacity: 0 })
    const fadeIn = gsap.to(drone, { opacity: 1, duration: 2, delay: 2.2, ease: 'power2.out' })

    const MAX_R = (EARTH_SIZE / 2) * 0.82

    let targetX  = HALF - 80
    let targetY  = HALF - 80
    let prevCurX = HALF - 80

    const quickX  = gsap.quickTo(drone,    'x',       { duration: 6.0, ease: 'power1.out' })
    const quickY  = gsap.quickTo(drone,    'y',       { duration: 6.0, ease: 'power1.out' })
    const quickRY = gsap.quickTo(svgWrap!, 'rotationY', { duration: 1.2, ease: 'power1.out' })

    const onMove = (e: MouseEvent) => {
      const rect  = hero.getBoundingClientRect()
      const cLeft = rect.left + rect.width  / 2 - CONTAINER / 2
      const cTop  = rect.top  + rect.height / 2 - CONTAINER * 0.52
      let dx = e.clientX - cLeft - HALF
      let dy = e.clientY - cTop  - HALF
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > MAX_R) { dx = (dx / dist) * MAX_R; dy = (dy / dist) * MAX_R }
      targetX = HALF - 80 + dx
      targetY = HALF - 80 + dy
    }

    hero.addEventListener('mousemove', onMove)

    const tick = () => {
      const dxCur = targetX - prevCurX; prevCurX = targetX
      quickX(targetX); quickY(targetY)
      if (svgWrap) quickRY(Math.max(-20, Math.min(20, -dxCur * 12)))
    }

    gsap.ticker.add(tick)
    return () => {
      fadeIn.kill()
      gsap.killTweensOf(drone)
      gsap.killTweensOf(svgWrap)
      gsap.ticker.remove(tick)
      hero.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div ref={droneRef} className="pointer-events-none absolute"
      style={{ top: 0, left: 0, width: 160, height: 160, perspective: '600px', zIndex: 6 }}>
      <div ref={svgWrapRef} style={{ transformStyle: 'preserve-3d' }}>
        <DroneSVG />
      </div>
    </div>
  )
}

// ─── Sky Drone Field (4 ambient drones across entire hero) ───────────────────
const SKY_DRONE_SEEDS = [
  { id: 0, sx: 0.06, sy: 0.14, scale: 0.42, opacity: 0.35, speed: 0.7 },
  { id: 1, sx: 0.87, sy: 0.09, scale: 0.55, opacity: 0.45, speed: 0.5 },
  { id: 2, sx: 0.11, sy: 0.73, scale: 0.38, opacity: 0.28, speed: 0.9 },
  { id: 3, sx: 0.76, sy: 0.64, scale: 0.50, opacity: 0.40, speed: 0.6 },
]

function SkyDrone({ seed, heroRef }: { seed: typeof SKY_DRONE_SEEDS[0]; heroRef: React.RefObject<HTMLElement | null> }) {
  const droneRef   = useRef<HTMLDivElement>(null)
  const svgWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drone   = droneRef.current
    const svgWrap = svgWrapRef.current
    const hero    = heroRef.current
    if (!drone || !hero) return

    const W = hero.offsetWidth
    const H = hero.offsetHeight

    gsap.set(drone, { x: seed.sx * W, y: seed.sy * H, scale: seed.scale, opacity: 0 })
    const fadeIn = gsap.to(drone, { opacity: seed.opacity, duration: 2.5, delay: 1 + seed.id * 0.9, ease: 'power2.out' })

    // Generate 6 waypoints client-side
    const waypoints = Array.from({ length: 6 }, () => ({
      x: W * (0.05 + Math.random() * 0.9),
      y: H * (0.05 + Math.random() * 0.9),
    }))

    const tl = gsap.timeline({ repeat: -1 })
    let prevX = seed.sx * W
    waypoints.forEach((wp) => {
      const dur = 9 + seed.speed * 8 + Math.random() * 4
      const bankY = wp.x > prevX ? -12 : 12
      prevX = wp.x
      tl.to(drone, { x: wp.x, y: wp.y, duration: dur, ease: 'sine.inOut' }, '<0.2')
      if (svgWrap) tl.to(svgWrap, { rotationY: bankY, duration: dur * 0.3, ease: 'power1.inOut' }, '<')
    })
    tl.to(drone, { x: seed.sx * W, y: seed.sy * H, duration: 12, ease: 'sine.inOut' })

    return () => { fadeIn.kill(); tl.kill() }
  }, [])

  return (
    <div ref={droneRef} className="pointer-events-none absolute"
      style={{ top: 0, left: 0, width: 100, height: 100, perspective: '500px', zIndex: 9 }}>
      <div ref={svgWrapRef} style={{ transformStyle: 'preserve-3d' }}>
        <DroneSVG size={100} glowColor="rgba(0,245,196,0.5)" />
      </div>
    </div>
  )
}

function SkyDroneField({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  return (
    <>
      {SKY_DRONE_SEEDS.map((seed) => (
        <SkyDrone key={seed.id} seed={seed} heroRef={heroRef} />
      ))}
    </>
  )
}

// ─── HUD overlay ─────────────────────────────────────────────────────────────
const altitudeBands = [
  { top: '8%',  label: 'FL 350', opacity: 0.04 },
  { top: '17%', label: 'FL 280', opacity: 0.055 },
  { top: '27%', label: 'FL 200', opacity: 0.07  },
  { top: '38%', label: 'FL 150', opacity: 0.08  },
  { top: '49%', label: 'FL 100', opacity: 0.08  },
  { top: '60%', label: 'FL 050', opacity: 0.065 },
  { top: '71%', label: 'FL 020', opacity: 0.05  },
  { top: '82%', label: 'SFC',    opacity: 0.04  },
]
const headingTicks = ['000°','030°','060°','090°','120°','150°','180°','210°','240°','270°','300°','330°']

function HudBracket({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 24
  const paths: Record<string, string> = {
    tl: `M ${size} 0 L 0 0 L 0 ${size}`, tr: `M 0 0 L ${size} 0 L ${size} ${size}`,
    bl: `M ${size} ${size} L 0 ${size} L 0 0`, br: `M 0 ${size} L ${size} ${size} L ${size} 0`,
  }
  const pos: Record<string, string> = { tl: 'top-5 left-5', tr: 'top-5 right-5', bl: 'bottom-5 left-5', br: 'bottom-5 right-5' }
  return (
    <div className={`absolute ${pos[corner]} pointer-events-none`}>
      <svg width={size} height={size} fill="none">
        <path d={paths[corner]} stroke="rgba(0,245,196,0.22)" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </div>
  )
}

function HudOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {altitudeBands.map(({ top, label, opacity }, i) => (
        <div key={label} className="absolute left-0 right-0 flex items-center" style={{ top, height: 1 }}>
          <div className="flex-grow h-px" style={{ background: `rgba(0,245,196,${opacity})`, animation: `alt-shimmer ${7 + i * 1.3}s ease-in-out ${i * 0.7}s infinite` }} />
          <span className="ml-3 mr-4 shrink-0 select-none" style={{ fontFamily: 'var(--font-orbitron)', fontSize: 9, color: `rgba(0,245,196,${opacity + 0.03})`, letterSpacing: '0.15em' }}>{label}</span>
        </div>
      ))}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden"
        style={{ height: 28, borderBottom: '1px solid rgba(0,245,196,0.06)', background: 'rgba(0,2,6,0.55)' }}>
        <span className="mr-4 shrink-0" style={{ fontFamily: 'var(--font-orbitron)', fontSize: 9, color: '#00F5C4', letterSpacing: '0.25em', opacity: 0.45 }}>HDG</span>
        {headingTicks.map((tick, i) => (
          <span key={tick} className="flex-1 text-center select-none" style={{ fontFamily: 'var(--font-orbitron)', fontSize: 8, color: i === 1 ? '#00F5C4' : 'rgba(0,245,196,0.18)', letterSpacing: '0.1em' }}>{tick}</span>
        ))}
        <div className="absolute bottom-0" style={{ left: `calc(${(1 / 12) * 100}% + 2.5rem)`, width: 1, height: 6, background: '#00F5C4', boxShadow: '0 0 6px rgba(0,245,196,0.8)' }} />
      </div>
      {[0, 1.4, 2.8].map((delay) => (
        <div key={delay} className="absolute rounded-full border" style={{ inset: 0, margin: 'auto', width: 180, height: 180, borderColor: 'rgba(0,245,196,0.09)', animation: `radar-pulse 5.5s ease-out ${delay}s infinite` }} />
      ))}
      <HudBracket corner="tl" /><HudBracket corner="tr" />
      <HudBracket corner="bl" /><HudBracket corner="br" />
      {[20, 40, 60, 80].map((left) => (
        <div key={left} className="absolute top-0 bottom-0 w-px" style={{ left: `${left}%`, background: 'rgba(0,245,196,0.013)' }} />
      ))}
    </div>
  )
}

// ─── Planet Field ─────────────────────────────────────────────────────────────
const PLANETS = [
  { top: '7%',  left: '5%',  size: 54, c1: '#c8a060', c2: '#7a3c14', ring: true,  ringColor: 'rgba(200,160,80,0.32)',  glowColor: 'rgba(200,140,60,0.13)', dur: '80s', del: '0s'  },
  { top: '5%',  left: '81%', size: 30, c1: '#c04428', c2: '#6a1a08', ring: false, ringColor: '',                        glowColor: 'rgba(200,70,28,0.14)',  dur: '62s', del: '8s'  },
  { top: '57%', left: '1%',  size: 24, c1: '#2468b8', c2: '#0a1e6a', ring: false, ringColor: '',                        glowColor: 'rgba(36,110,220,0.13)', dur: '72s', del: '14s' },
  { top: '50%', left: '90%', size: 36, c1: '#6840a8', c2: '#200844', ring: true,  ringColor: 'rgba(130,70,200,0.26)',   glowColor: 'rgba(100,52,180,0.13)', dur: '92s', del: '22s' },
]

function PlanetField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {PLANETS.map((p, i) => (
        <div key={i} style={{ position: 'absolute', top: p.top, left: p.left, width: p.size, height: p.size }}>
          {/* Atmosphere glow */}
          <div style={{
            position: 'absolute',
            inset: -p.size * 0.5,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${p.glowColor} 0%, transparent 65%)`,
            filter: `blur(${p.size * 0.55}px)`,
          }} />
          {/* Sphere with rotating banded surface */}
          <div style={{
            position: 'relative', width: p.size, height: p.size,
            borderRadius: '50%', overflow: 'hidden',
            boxShadow: `inset -${p.size*0.22}px -${p.size*0.1}px ${p.size*0.32}px rgba(0,0,0,0.75), inset ${p.size*0.08}px ${p.size*0.06}px ${p.size*0.18}px rgba(255,255,255,0.07)`,
          }}>
            <div style={{
              width: '200%', height: '100%',
              background: `repeating-linear-gradient(0deg, ${p.c1} 0%, ${p.c2} 16%, ${p.c1} 32%)`,
              animation: `planet-surface ${p.dur} linear ${p.del} infinite`,
              opacity: 0.88,
            }} />
          </div>
          {/* Ring */}
          {p.ring && (
            <div style={{
              position: 'absolute',
              top: '36%', left: '-38%',
              width: '176%', height: '28%',
              border: `${p.size > 40 ? 2 : 1.5}px solid ${p.ringColor}`,
              borderRadius: '50%',
              transform: 'rotateX(70deg)',
              pointerEvents: 'none',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Live Drone Message Feeds ─────────────────────────────────────────────────
type DroneMsgEntry = { id: number; time: string; text: string; age: number }

const LEFT_MSGS = [
  'WAYPOINT_04 REACHED',   'ALT STABLE 1247m',
  'SPD 12.4 m/s OK',       'GPS LOCK CONFIRMED',
  'HEADING 127° ON TRACK', 'CAMERA FEED: LIVE',
  'SECTOR SCAN COMPLETE',  'BATTERY 87% OK',
  'SIGNAL STRENGTH 98%',   'RTK FIX ACQUIRED',
  'TARGET AREA ENTERED',   'HOVER MODE: ACTIVE',
  'OBSTACLE CLEAR: FWD',   'WIND 3KT NE, STABLE',
  'TELEMETRY TX OK',       'LOG ENTRY #4821 SAVED',
]
const RIGHT_MSGS = [
  'ACK WAYPOINT_04',       'SECTOR BOUNDARY CLEAR',
  'ORBIT-02 ON SCHEDULE',  'DRONE-02 NOMINAL',
  'WIND +3KTS NE',         'AIRSPACE CLASS-D CLEAR',
  'RELAY LINK STABLE',     'NO TRAFFIC DETECTED',
  'FLIGHT PLAN APPROVED',  'WEATHER: VFR OK',
  'ZONE ALPHA CLEAR',      'DRONE-03 HOLDING',
  'UPDATE RECEIVED',       'GROUND CONTROL ACTIVE',
  'BACKUP LINK READY',     'MISSION TIMER: 04:23',
]

function nowHMS() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2,'0')
  const m = String(d.getMinutes()).padStart(2,'0')
  const s = String(d.getSeconds()).padStart(2,'0')
  return `${h}:${m}:${s}`
}

function DroneMessageFeed({ side }: { side: 'left' | 'right' }) {
  const [msgs, setMsgs] = useState<DroneMsgEntry[]>([])
  const [typing, setTyping] = useState(false)
  const poolIdx = useRef(side === 'left' ? 0 : 4)

  useEffect(() => {
    const pool = side === 'left' ? LEFT_MSGS : RIGHT_MSGS
    const scheduleNext = () => {
      const delay = 2800 + Math.random() * 1400
      return setTimeout(() => {
        setTyping(false)
        const entry: DroneMsgEntry = {
          id: Date.now(),
          time: nowHMS(),
          text: pool[poolIdx.current % pool.length],
          age: 0,
        }
        poolIdx.current++
        setMsgs(prev => {
          const updated = prev.map(m => ({ ...m, age: m.age + 1 }))
          return [entry, ...updated].slice(0, 7)
        })
        setTimeout(() => setTyping(true), 400)
        scheduleNext()
      }, delay)
    }
    setTimeout(() => setTyping(true), side === 'left' ? 800 : 1400)
    const t = scheduleNext()
    return () => clearTimeout(t)
  }, [side])

  const orb: React.CSSProperties = { fontFamily: 'var(--font-orbitron)' }
  const isLeft = side === 'left'
  const msgColors = ['rgba(0,245,196,0.92)', 'rgba(0,245,196,0.62)', 'rgba(0,245,196,0.45)', 'rgba(0,245,196,0.32)', 'rgba(0,245,196,0.22)', 'rgba(0,245,196,0.15)', 'rgba(0,245,196,0.1)']

  return (
    <div className="pointer-events-none absolute hidden md:flex flex-col" style={{
      top: '10%',
      [isLeft ? 'left' : 'right']: 0,
      width: 218,
      maxHeight: '72%',
      zIndex: 11,
      background: 'rgba(0,2,6,0.7)',
      backdropFilter: 'blur(8px)',
      [isLeft ? 'borderRight' : 'borderLeft']: '1px solid rgba(0,245,196,0.1)',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 88%, transparent 100%)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '6px 10px 5px',
        borderBottom: '1px solid rgba(0,245,196,0.08)',
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(0,245,196,0.03)',
      }}>
        <span style={{ fontSize: 8, color: '#00F5C4', animation: 'live-pulse 1.4s ease-in-out infinite' }}>◉</span>
        <span style={{ ...orb, fontSize: 8, color: 'rgba(0,245,196,0.75)', letterSpacing: '0.18em' }}>
          {isLeft ? 'DRONE-01 · OUTBOUND' : 'BASE-CTRL · INBOUND'}
        </span>
      </div>

      {/* Messages */}
      <div style={{ padding: '6px 0', flex: 1, overflow: 'hidden' }}>
        {msgs.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex', gap: 0, padding: '2.5px 10px',
            animation: `${isLeft ? 'msg-slide-in-left' : 'msg-slide-in-right'} 0.28s ease`,
          }}>
            <span style={{ ...orb, fontSize: 7, color: 'rgba(0,245,196,0.32)', letterSpacing: '0.04em', minWidth: 50, flexShrink: 0 }}>{msg.time}</span>
            <span style={{ ...orb, fontSize: 7.5, color: msgColors[Math.min(msg.age, 6)], letterSpacing: '0.06em', lineHeight: '1.55' }}>{msg.text}</span>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ padding: '3px 10px', display: 'flex', gap: 3, alignItems: 'center' }}>
            {[0, 0.25, 0.5].map((d, i) => (
              <span key={i} style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'rgba(0,245,196,0.4)',
                display: 'inline-block',
                animation: `typing-dot 1.1s ease-in-out ${d}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Airspace Audio ───────────────────────────────────────────────────────────
function useAirspaceAudio(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    let ctx: AudioContext
    try { ctx = new AudioContext() } catch { return }

    // Ambient rotor hum
    const rotorOsc = ctx.createOscillator()
    const rotorGain = ctx.createGain()
    rotorOsc.type = 'triangle'
    rotorOsc.frequency.value = 52
    rotorGain.gain.value = 0.016
    rotorOsc.connect(rotorGain)
    rotorGain.connect(ctx.destination)
    rotorOsc.start()

    // Plane flyby
    let flyDir = 1
    function playFlyby() {
      const now = ctx.currentTime
      const dur = 4.2
      const dir = flyDir; flyDir *= -1

      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        const panner = ctx.createStereoPanner()
        const gain = ctx.createGain()

        osc.type = 'sawtooth'
        osc.frequency.value = 160 + i * 28
        filter.type = 'bandpass'
        filter.frequency.value = 880 + i * 120
        filter.Q.value = 0.7

        panner.pan.setValueAtTime(dir * -1, now + i * 0.08)
        panner.pan.linearRampToValueAtTime(dir * 1, now + dur + i * 0.08)

        gain.gain.setValueAtTime(0, now + i * 0.08)
        gain.gain.linearRampToValueAtTime(0.055 - i * 0.012, now + dur * 0.35 + i * 0.08)
        gain.gain.linearRampToValueAtTime(0, now + dur + i * 0.08)

        osc.connect(filter)
        filter.connect(panner)
        panner.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.08)
        osc.stop(now + dur + 0.3 + i * 0.08)
      }
    }

    // Radio crackle
    function playcrackle() {
      const bufLen = Math.floor(ctx.sampleRate * 0.18)
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let j = 0; j < bufLen; j++) data[j] = (Math.random() * 2 - 1)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1800
      filter.Q.value = 1.2
      const gain = ctx.createGain()
      gain.gain.value = 0.032
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
      src.start()
    }

    // Schedule first flyby soon, then repeat
    const scheduleFlyby = (): ReturnType<typeof setTimeout> => {
      const delay = (5 + Math.random() * 15) * 1000
      return setTimeout(() => { playFlyby(); flybyTimer = scheduleFlyby() }, delay)
    }
    let flybyTimer = scheduleFlyby()

    const crackleTimer = setInterval(playcrackle, 28000 + Math.random() * 8000)

    return () => {
      clearTimeout(flybyTimer)
      clearInterval(crackleTimer)
      try { ctx.close() } catch { /* ignore */ }
    }
  }, [enabled])
}

// ─── Drone Camera Panel ───────────────────────────────────────────────────────
type Telemetry = { alt: number; spd: number; hdg: number; lat: number; lon: number; status: string }

const STATUS_CYCLE = ['TRACKING TARGET', 'ACQUIRING...', 'SIGNAL LOCK']

function CamBracket({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 10
  const paths: Record<string, string> = {
    tl: `M ${size} 0 L 0 0 L 0 ${size}`, tr: `M 0 0 L ${size} 0 L ${size} ${size}`,
    bl: `M ${size} ${size} L 0 ${size} L 0 0`, br: `M 0 ${size} L ${size} ${size} L ${size} 0`,
  }
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 3, left: 3 }, tr: { top: 3, right: 3 },
    bl: { bottom: 3, left: 3 }, br: { bottom: 3, right: 3 },
  }
  return (
    <div style={{ position: 'absolute', ...pos[corner] }}>
      <svg width={size} height={size} fill="none">
        <path d={paths[corner]} stroke="rgba(0,245,196,0.6)" strokeWidth="1.2" strokeLinecap="square" />
      </svg>
    </div>
  )
}

function DroneCameraPanel({ onOpen }: { onOpen: () => void }) {
  const crosshairRef = useRef<SVGGElement>(null)
  const [telem, setTelem] = useState<Telemetry>({
    alt: 1247, spd: 12.4, hdg: 127, lat: -1.940621, lon: 30.061834, status: 'TRACKING TARGET',
  })
  const statusIdxRef = useRef(0)

  useEffect(() => {
    const ch = crosshairRef.current
    const chAnim = ch
      ? gsap.to(ch, { x: 22, y: -18, duration: 3.8, ease: 'sine.inOut', repeat: -1, yoyo: true })
      : null

    const interval = setInterval(() => {
      setTelem(prev => {
        const newAlt = Math.min(1300, Math.max(1200, prev.alt + Math.floor(Math.random() * 9) - 4))
        const newSpd = parseFloat(Math.min(15, Math.max(10, prev.spd + (Math.random() * 0.8 - 0.4))).toFixed(1))
        const newHdg = (prev.hdg + Math.floor(Math.random() * 5) - 2 + 360) % 360
        const newLat = parseFloat((prev.lat + (Math.random() * 0.000024 - 0.000012)).toFixed(6))
        const newLon = parseFloat((prev.lon + (Math.random() * 0.000024 - 0.000012)).toFixed(6))
        return { alt: newAlt, spd: newSpd, hdg: newHdg, lat: newLat, lon: newLon, status: prev.status }
      })
    }, 1400)

    const statusInterval = setInterval(() => {
      statusIdxRef.current = (statusIdxRef.current + 1) % STATUS_CYCLE.length
      setTelem(prev => ({ ...prev, status: STATUS_CYCLE[statusIdxRef.current] }))
    }, 7000)

    return () => { chAnim?.kill(); clearInterval(interval); clearInterval(statusInterval) }
  }, [])

  const orbitron = { fontFamily: 'var(--font-orbitron)' }

  return (
    <div className="absolute hidden md:block"
      onClick={onOpen}
      title="Click to enter pilot simulation"
      style={{
        bottom: 32, right: 32, width: 282, zIndex: 20,
        background: 'rgba(0,3,8,0.92)',
        border: '1px solid rgba(0,245,196,0.22)',
        backdropFilter: 'blur(6px)',
        borderRadius: 3,
        boxShadow: '0 0 30px rgba(0,245,196,0.07), inset 0 0 20px rgba(0,245,196,0.03)',
        cursor: 'pointer',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 0 40px rgba(0,245,196,0.18), inset 0 0 20px rgba(0,245,196,0.06)'
        el.style.borderColor = 'rgba(0,245,196,0.45)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 0 30px rgba(0,245,196,0.07), inset 0 0 20px rgba(0,245,196,0.03)'
        el.style.borderColor = 'rgba(0,245,196,0.22)'
      }}
    >

      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5px 10px', borderBottom: '1px solid rgba(0,245,196,0.12)',
        background: 'rgba(0,245,196,0.04)',
      }}>
        <span style={{ ...orbitron, fontSize: 8, color: 'rgba(0,245,196,0.8)', letterSpacing: '0.2em' }}>DRONE-01 · CAM-A</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ ...orbitron, fontSize: 7, color: 'rgba(0,245,196,0.55)', letterSpacing: '0.15em' }}>REC</span>
          <span style={{ fontSize: 9, color: '#00F5C4', animation: 'live-pulse 1.2s ease-in-out infinite' }}>◉</span>
          <span style={{ ...orbitron, fontSize: 7, color: '#00F5C4', letterSpacing: '0.18em' }}>LIVE</span>
        </div>
      </div>

      {/* POV view */}
      <div style={{ position: 'relative', height: 130, overflow: 'hidden', background: '#000a06' }}>
        {/* Perspective terrain grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(0,245,196,0.06) 11px, rgba(0,245,196,0.06) 12px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,245,196,0.04) 19px, rgba(0,245,196,0.04) 20px)
          `,
          transform: 'perspective(180px) rotateX(38deg) translateY(18px) scaleX(1.4)',
          transformOrigin: '50% 100%',
          opacity: 0.7,
        }} />

        {/* Horizon glow */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: '42%', height: 24,
          background: 'linear-gradient(to bottom, transparent, rgba(0,245,196,0.08) 40%, transparent)',
        }} />

        {/* Terrain blob (target area) */}
        <div style={{
          position: 'absolute', width: 80, height: 50,
          top: '38%', left: '38%',
          background: 'radial-gradient(ellipse, rgba(0,245,196,0.12) 0%, transparent 70%)',
          filter: 'blur(8px)',
          borderRadius: '50%',
        }} />

        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(to right, transparent, rgba(0,245,196,0.3) 20%, rgba(0,245,196,0.45) 50%, rgba(0,245,196,0.3) 80%, transparent)',
          boxShadow: '0 0 8px rgba(0,245,196,0.25)',
          animation: 'scan-line 2.8s linear infinite',
        }} />

        {/* Crosshair SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <g ref={crosshairRef} transform="translate(110,62)">
            {/* Outer ring */}
            <circle cx="0" cy="0" r="14" stroke="rgba(0,245,196,0.35)" strokeWidth="1" fill="none"
              style={{ animation: 'target-lock 2.2s ease-in-out infinite' }} />
            {/* Cross lines */}
            <line x1="-22" y1="0" x2="-17" y2="0" stroke="rgba(0,245,196,0.7)" strokeWidth="1.2" />
            <line x1="17"  y1="0" x2="22"  y2="0" stroke="rgba(0,245,196,0.7)" strokeWidth="1.2" />
            <line x1="0" y1="-22" x2="0" y2="-17" stroke="rgba(0,245,196,0.7)" strokeWidth="1.2" />
            <line x1="0" y1="17"  x2="0" y2="22"  stroke="rgba(0,245,196,0.7)" strokeWidth="1.2" />
            {/* Center dot */}
            <circle cx="0" cy="0" r="2" fill="#00F5C4" opacity="0.8" />
            {/* Corner ticks */}
            <path d="M -9 -9 L -14 -9 L -14 -14" stroke="rgba(0,245,196,0.5)" strokeWidth="1" fill="none" />
            <path d="M 9  -9 L 14  -9 L 14  -14" stroke="rgba(0,245,196,0.5)" strokeWidth="1" fill="none" />
            <path d="M -9  9 L -14  9 L -14  14" stroke="rgba(0,245,196,0.5)" strokeWidth="1" fill="none" />
            <path d="M 9   9 L 14   9 L 14   14" stroke="rgba(0,245,196,0.5)" strokeWidth="1" fill="none" />
          </g>
          {/* Distance markers */}
          <text x="8" y="14" style={{ ...orbitron as React.CSSProperties, fontSize: 6, fill: 'rgba(0,245,196,0.35)' }}>ALT VIEW</text>
          <text x="220" y="124" style={{ ...orbitron as React.CSSProperties, fontSize: 6, fill: 'rgba(0,245,196,0.3)' }}>2.4KM</text>
          {/* Scan range arcs */}
          <path d="M 20 130 Q 141 60 262 130" stroke="rgba(0,245,196,0.07)" strokeWidth="0.8" fill="none" />
          <path d="M 40 130 Q 141 80 242 130" stroke="rgba(0,245,196,0.05)" strokeWidth="0.6" fill="none" />
        </svg>

        {/* Corner brackets inside POV */}
        <CamBracket corner="tl" />
        <CamBracket corner="tr" />
        <CamBracket corner="bl" />
        <CamBracket corner="br" />
      </div>

      {/* Telemetry rows */}
      <div style={{ padding: '6px 10px 7px', borderTop: '1px solid rgba(0,245,196,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px', marginBottom: 4 }}>
          {[
            { label: 'ALT',  value: `${telem.alt}m`          },
            { label: 'SPD',  value: `${telem.spd}m/s`        },
            { label: 'HDG',  value: `${telem.hdg}°`          },
            { label: 'LAT',  value: `${telem.lat.toFixed(6)}°` },
            { label: 'LON',  value: `${telem.lon.toFixed(6)}°` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
              <span style={{ ...orbitron, fontSize: 7, color: 'rgba(0,245,196,0.5)', letterSpacing: '0.15em', minWidth: 22 }}>{label}</span>
              <span style={{ ...orbitron, fontSize: 8.5, color: '#00F5C4', letterSpacing: '0.05em' }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid rgba(0,245,196,0.07)', paddingTop: 4 }}>
          <span style={{ ...orbitron, fontSize: 7, color: 'rgba(0,245,196,0.45)', letterSpacing: '0.12em' }}>STATUS</span>
          <span style={{ ...orbitron, fontSize: 8, color: telem.status === 'SIGNAL LOCK' ? '#00d68f' : '#00F5C4', letterSpacing: '0.1em' }}>{telem.status}</span>
          <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: telem.status === 'ACQUIRING...' ? '#ffb800' : '#00F5C4', boxShadow: `0 0 6px ${telem.status === 'ACQUIRING...' ? '#ffb800' : '#00F5C4'}`, animation: 'live-pulse 1.5s ease-in-out infinite', flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const sectionRef     = useRef<HTMLElement>(null)
  const earthTextureRef = useRef<HTMLDivElement>(null)
  const [stars, setStars]   = useState<Star[]>([])
  const [simOpen, setSimOpen] = useState(false)
  const [audioOn, setAudioOn] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Stars count + mobile flag — both driven from one resize listener
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setIsMobile(w < 768)
      setStars((prev) => {
        // Mobile: 40 static stars (no animations) — eliminates ~30+ CSS animation slots
        // Desktop: 260 animated stars
        const wanted  = w < 640 ? 40 : 260
        const animate = w >= 640
        if (prev.length !== wanted) return makeStarField(wanted, animate)
        return prev
      })
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])
  useAirspaceAudio(audioOn)

  // Earth auto-rotation + mouse influence
  useEffect(() => {
    const texture = earthTextureRef.current
    const hero    = sectionRef.current
    if (!texture || !hero) return

    // Mobile: pure CSS animation — eliminates one GSAP ticker.add() call per frame.
    // Touch devices can't use mouse-parallax anyway, so no feature loss.
    if (window.innerWidth < 768) {
      texture.style.animation = 'earth-img-spin 22s linear infinite'
      return () => { texture.style.animation = '' }
    }

    let posX        = 0
    let mouseExtra  = 0
    let smoothExtra = 0

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      mouseExtra = (0.5 - nx) * 12
    }

    const tick = () => {
      posX -= 0.0278
      if (posX < -50) posX += 50
      smoothExtra += (mouseExtra - smoothExtra) * 0.04
      gsap.set(texture, { backgroundPositionX: `${posX + smoothExtra}%` })
    }

    hero.addEventListener('mousemove', onMove)
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      hero.removeEventListener('mousemove', onMove)
    }
  }, [])

  useGSAP((g) => {
    const tl = g.timeline({ defaults: { ease: 'power3.out' } })
    tl
      .from('.hero-char',  { opacity: 0, y: 60, rotationX: -90, transformOrigin: '50% 50% -30px', stagger: 0.025, duration: 0.7, ease: 'back.out(1.5)', delay: 1.1 })
      .from('.hero-badge', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2')
      .from('.hero-sub',   { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
      .from('.hero-ctas',  { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
  }, [])

  return (
    <section
      ref={sectionRef}
      className="space-bg grid-bg relative flex min-h-screen flex-col overflow-hidden px-4 sm:px-6 md:items-center md:justify-center"
    >
      {/* Layer 0 — planets + orbital arc lines (desktop only — heavy GPU) */}
      {!isMobile && <PlanetField />}
      {!isMobile && <OrbitalArcs />}

      {/* Layer 1 — nebulae + shooting stars + space objects + data streams (desktop only) */}
      {/* Nebulae: 5× filter:blur + willChange + dual animations = Safari killer on mobile */}
      {!isMobile && <NebulaLayer />}
      {!isMobile && <SpaceObjectField />}
      {!isMobile && <DataStreamColumns />}

      {/* Layer 2 — Earth globe + drones (visible on ALL screen sizes) */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: isMobile ? '32%' : '50%',
          transform: isMobile
            ? `translate(-50%, -50%) scale(0.38)`
            : 'translate(-50%, -52%)',
          transformOrigin: 'center center',
          width: CONTAINER, height: CONTAINER,
          opacity: isMobile ? 0.95 : 0.88,
          zIndex: 2,
          transition: 'top 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Earth (z-index 5) */}
        <div style={{ position: 'absolute', top: EARTH_OFFSET, left: EARTH_OFFSET, zIndex: 5 }}>
          <EarthGlobe textureRef={earthTextureRef} />
        </div>

        {/* Orbit track ellipse */}
        <div style={{
          position: 'absolute',
          top: HALF - ORBIT_B - 1, left: HALF - ORBIT_A - 1,
          width: ORBIT_A * 2, height: ORBIT_B * 2,
          borderRadius: '50%',
          border: '1px dashed rgba(0,245,196,0.07)',
          transform: `rotate(${-18}deg)`,
          transformOrigin: 'center center',
          zIndex: 4,
        }} />

        {/* OrbitDrone adds a GSAP ticker.add() call — skip on mobile */}
        {!isMobile && <OrbitDrone />}
        <SurfaceDrone heroRef={sectionRef} />
      </div>

      {/* Layer 3 — HUD overlay (desktop only — 11 simultaneous CSS animations) */}
      {!isMobile && <HudOverlay />}

      {/* Layer 4 — star field */}
      {stars.map((s) => (
        <span key={s.id} className="pointer-events-none absolute rounded-full" style={{
          width: s.size, height: s.size, top: `${s.top}%`, left: `${s.left}%`,
          background: s.color, opacity: s.opacity,
          animation: [
            s.twinkle ? `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` : '',
            s.drift   ? `star-drift ${s.driftDur}s ease-in-out ${s.driftDelay}s infinite` : '',
          ].filter(Boolean).join(', ') || undefined,
        }} />
      ))}

      {/* Layer 5 — sky drones (desktop only — 4 GSAP repeat:-1 timelines) */}
      {!isMobile && <SkyDroneField heroRef={sectionRef} />}

      {/* Layer 6 — drone camera panel */}
      <DroneCameraPanel onOpen={() => setSimOpen(true)} />

      {/* Layer 7 — live message feeds */}
      <DroneMessageFeed side="left" />
      <DroneMessageFeed side="right" />

      {/* Audio toggle */}
      <button
        className="hidden md:flex items-center gap-2 absolute"
        style={{
          bottom: 36, left: 28, zIndex: 15,
          fontFamily: 'var(--font-orbitron)', fontSize: 8, letterSpacing: '0.16em',
          color: audioOn ? '#00F5C4' : 'rgba(0,245,196,0.42)',
          background: 'rgba(0,3,8,0.82)', border: '1px solid rgba(0,245,196,0.18)',
          padding: '5px 12px', borderRadius: 2, cursor: 'pointer',
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onClick={() => setAudioOn(a => !a)}
      >
        {audioOn
          ? <><span style={{ animation: 'live-pulse 1.2s ease-in-out infinite' }}>◉</span> AIRSPACE AUDIO</>
          : <>◎ AIRSPACE AUDIO</>
        }
      </button>

      {/* Layer 8 — pilot simulation modal */}
      <PilotSimModal open={simOpen} onClose={() => setSimOpen(false)} />

      {/* Layer 7 — hero text
           Mobile:  stacks below the globe via pt-[50vh]; reduced to headline + tagline + CTAs
           Desktop: centered over the globe (md:pt-0 restores original layout) */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-2 pb-24 pt-[50vh] text-center md:pb-0 md:pt-0">
        {/* Badge — desktop only */}
        <p className="hero-badge mb-4 hidden text-xs font-semibold uppercase tracking-[0.35em] text-[#00F5C4] md:inline-block"
          style={{ fontFamily: 'var(--font-orbitron)' }}>
          Professional Drone Operations &amp; Training
        </p>

        {/* Main headline — always visible */}
        <h1 className="mb-5 flex flex-wrap justify-center gap-0 text-[clamp(2.2rem,9vw,8rem)] font-black leading-none tracking-widest md:mb-6"
          style={{ fontFamily: 'var(--font-orbitron)', perspective: '600px' }} aria-label={HEADLINE}>
          {chars.map((char, i) =>
            char === ' ' ? <span key={i} className="inline-block w-4" aria-hidden="true" /> : (
              <span key={i} className="hero-char inline-block" style={{ color: i < 4 ? '#00F5C4' : '#ffffff' }} aria-hidden="true">{char}</span>
            )
          )}
        </h1>

        {/* Tagline — always visible */}
        <p className="hero-sub mb-6 text-base font-light text-white sm:text-xl md:mb-4 md:text-2xl">
          Elevating the Future of Airspace
        </p>

        {/* Subtitle — desktop only */}
        <p className="hero-sub mb-10 hidden text-sm text-[#6B7A8D] sm:text-base md:block md:text-lg">
          Professional Drone Projects &amp; Certified Training Programs
        </p>

        {/* CTA buttons */}
        <div className="hero-ctas flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/services"
            className="w-full rounded-md bg-[#00F5C4] px-8 py-3.5 text-sm font-semibold text-[#0A0B0D] transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] sm:w-auto"
            style={{ fontFamily: 'var(--font-orbitron)' }}>
            Explore Services →
          </Link>
          <Link href="/training"
            className="w-full rounded-md border border-[rgba(255,255,255,0.2)] px-8 py-3.5 text-sm font-medium text-white transition-[border-color,color] duration-300 hover:border-[rgba(0,245,196,0.5)] hover:text-[#00F5C4] sm:w-auto">
            View Training Courses
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0B0D)' }} />
    </section>
  )
}
