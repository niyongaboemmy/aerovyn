'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

// ─── Types ────────────────────────────────────────────────────────────────────
interface SimTelemetry {
  alt: number; spd: number; hdg: number; lat: number; lon: number; agl: number; temp: number
}

interface Target { id: number; x: number; y: number; label: string; dist: number; locked: boolean; locking: boolean }

// ─── Constants ────────────────────────────────────────────────────────────────
const BOOT_LINES = [
  '> ESTABLISHING UPLINK TO DRONE-01...',
  '> SIGNAL ACQUIRED ............... 98.4%',
  '> LOADING FLIGHT TELEMETRY ...... OK',
  '> POV FEED ONLINE ............... ✓',
  '> ENTERING PILOT MODE',
]

const INIT_TELEM: SimTelemetry = { alt: 1247, spd: 12.4, hdg: 127, lat: -1.940621, lon: 30.061834, agl: 48, temp: 24 }

const INIT_TARGETS: Target[] = [
  { id: 0, x: 28, y: 62, label: 'TGT-01', dist: 420, locked: false, locking: false },
  { id: 1, x: 55, y: 58, label: 'TGT-02', dist: 315, locked: false, locking: false },
  { id: 2, x: 74, y: 65, label: 'TGT-03', dist: 580, locked: false, locking: false },
]

const WARNINGS = ['⚠  WIND SHEAR DETECTED', '⚠  TERRAIN PROXIMITY — 48m AGL', '⚠  SIGNAL INTERFERENCE', '⚠  AIRSPACE BOUNDARY ALERT']

const orb: React.CSSProperties = { fontFamily: 'var(--font-orbitron)' }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt2(n: number) { return String(Math.floor(n)).padStart(2, '0') }
function fmtTime(s: number) { return `${fmt2(s / 3600)}:${fmt2((s % 3600) / 60)}:${fmt2(s % 60)}` }

// ─── Sub-components ───────────────────────────────────────────────────────────

function BootScreen({ step }: { step: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      background: '#000205', display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'center',
      padding: '0 12vw',
    }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ ...orb, fontSize: 10, color: 'rgba(0,245,196,0.4)', letterSpacing: '0.3em' }}>AEROVYN SYSTEMS — DRONE CONTROL INTERFACE v4.2.1</span>
      </div>
      {BOOT_LINES.map((line, i) => (
        <div key={i} style={{
          marginBottom: 8, opacity: step > i ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ ...orb, fontSize: 13, color: i === BOOT_LINES.length - 1 ? '#00F5C4' : 'rgba(0,245,196,0.75)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            {line}
          </span>
          {step === i + 1 && i < BOOT_LINES.length - 1 && (
            <span style={{ ...orb, fontSize: 13, color: '#00F5C4', animation: 'boot-blink 0.8s step-end infinite' }}>█</span>
          )}
        </div>
      ))}
      {step >= BOOT_LINES.length && (
        <div style={{ marginTop: 32, width: 200, height: 2, background: 'rgba(0,245,196,0.15)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#00F5C4', animation: 'data-stream 0.8s linear forwards', transformOrigin: 'left' }} />
        </div>
      )}
    </div>
  )
}

function ArtificialHorizon({ bank, pitch }: { bank: number; pitch: number }) {
  const r = 54   // circle radius
  const cx = 60; const cy = 60
  const pitchPx = pitch * 2.8  // pixels per degree

  return (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      {/* ADI label */}
      <div style={{ ...orb, position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'rgba(0,245,196,0.5)', letterSpacing: '0.2em' }}>ADI</div>

      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <clipPath id="adi-clip">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>

        {/* Rotating interior */}
        <g clipPath="url(#adi-clip)">
          <g transform={`rotate(${-bank}, ${cx}, ${cy}) translate(0, ${pitchPx})`}>
            {/* Sky */}
            <rect x={cx - r - 4} y={cy - r - 60} width={(r + 4) * 2} height={r + 64} fill="#001a3a" />
            {/* Ground */}
            <rect x={cx - r - 4} y={cy} width={(r + 4) * 2} height={r + 64} fill="#2a1a08" />
            {/* Horizon line */}
            <line x1={cx - r - 4} y1={cy} x2={cx + r + 4} y2={cy} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
            {/* Pitch ticks */}
            {[-15, -10, -5, 5, 10, 15].map(deg => {
              const yOff = deg * 2.8
              const w = Math.abs(deg) >= 10 ? 24 : 14
              return (
                <g key={deg}>
                  <line x1={cx - w} y1={cy + yOff} x2={cx + w} y2={cy + yOff}
                    stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                  {Math.abs(deg) >= 10 &&
                    <text x={cx - w - 8} y={cy + yOff + 3} textAnchor="end"
                      style={{ ...orb as React.CSSProperties, fontSize: 7, fill: 'rgba(255,255,255,0.4)' }}>{Math.abs(deg)}</text>}
                </g>
              )
            })}
          </g>
        </g>

        {/* Fixed frame */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,245,196,0.4)" strokeWidth="1.5" />

        {/* Fixed aircraft symbol (wings) */}
        <line x1={cx - 22} y1={cy} x2={cx - 8} y2={cy} stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <line x1={cx + 8}  y1={cy} x2={cx + 22} y2={cy} stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3" fill="#ffffff" />

        {/* Bank angle arc (top) */}
        <g transform={`rotate(${-bank}, ${cx}, ${cy})`}>
          <path d={`M ${cx - 28} ${cy - 45} A 28 28 0 0 1 ${cx + 28} ${cy - 45}`}
            stroke="rgba(0,245,196,0.35)" strokeWidth="1" fill="none" />
        </g>
        {/* Fixed bank pointer */}
        <polygon points={`${cx},${cy - 44} ${cx - 5},${cy - 38} ${cx + 5},${cy - 38}`}
          fill="rgba(0,245,196,0.7)" />

        {/* Corner brackets */}
        {([[cx - r + 4, cy - r + 4, 'tl'], [cx + r - 4, cy - r + 4, 'tr'], [cx - r + 4, cy + r - 4, 'bl'], [cx + r - 4, cy + r - 4, 'br']] as const).map(([bx, by, corner]) => {
          const s = 6
          const paths: Record<string, string> = {
            tl: `M ${bx + s} ${by} L ${bx} ${by} L ${bx} ${by + s}`,
            tr: `M ${bx - s} ${by} L ${bx} ${by} L ${bx} ${by + s}`,
            bl: `M ${bx + s} ${by} L ${bx} ${by} L ${bx} ${by - s}`,
            br: `M ${bx - s} ${by} L ${bx} ${by} L ${bx} ${by - s}`,
          }
          return <path key={corner} d={paths[corner]} stroke="rgba(0,245,196,0.4)" strokeWidth="1" fill="none" />
        })}
      </svg>
    </div>
  )
}

function Tape({ value, label, unit, min, max, color = '#00F5C4', warn }: {
  value: number; label: string; unit: string; min: number; max: number; color?: string; warn?: boolean
}) {
  const range = max - min
  const tickCount = 10
  const step = range / tickCount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ ...orb, fontSize: 8, color: 'rgba(0,245,196,0.5)', letterSpacing: '0.18em' }}>{label}</span>
      <div style={{ position: 'relative', width: 52, height: 100, overflow: 'hidden',
        background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(0,245,196,0.18)', borderRadius: 2 }}>
        {/* Scrolling tape */}
        {Array.from({ length: tickCount + 3 }, (_, i) => {
          const tickVal = Math.round(value / step) * step - (tickCount / 2 - i) * step
          const pct = ((tickVal - value) / range) * 100 + 50
          if (pct < -5 || pct > 105) return null
          const isMajor = tickVal % (step * 2) < step * 0.1
          return (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${pct}%`, transform: 'translateY(-50%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', height: 14 }}>
                <div style={{ width: isMajor ? 12 : 6, height: 1, background: isMajor ? 'rgba(0,245,196,0.7)' : 'rgba(0,245,196,0.3)', marginLeft: 4 }} />
                {isMajor && <span style={{ ...orb, fontSize: 8, color: 'rgba(0,245,196,0.7)', marginLeft: 3 }}>{Math.round(tickVal)}</span>}
              </div>
            </div>
          )
        })}
        {/* Center pointer */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)',
          height: 18, display: 'flex', alignItems: 'center',
          background: 'rgba(0,245,196,0.08)', borderTop: '1px solid rgba(0,245,196,0.5)', borderBottom: '1px solid rgba(0,245,196,0.5)',
        }}>
          <span style={{ ...orb, fontSize: 9, color: warn ? '#ffb800' : color, marginLeft: 6, fontWeight: 700 }}>{value.toFixed(1)}</span>
        </div>
      </div>
      <span style={{ ...orb, fontSize: 7, color: 'rgba(0,245,196,0.4)' }}>{unit}</span>
    </div>
  )
}

function HeadingStrip({ hdg }: { hdg: number }) {
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const deg = ((Math.round(hdg / 10) * 10 - 100 + i * 10) % 360 + 360) % 360
    return { deg, off: i - 10 }
  })

  return (
    <div style={{
      position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
      width: 320, height: 30,
      background: 'rgba(0,3,8,0.7)', border: '1px solid rgba(0,245,196,0.14)',
      display: 'flex', alignItems: 'center', overflow: 'hidden', borderRadius: 2,
    }}>
      {ticks.map(({ deg, off }) => {
        const isCurrent = deg === ((Math.round(hdg / 10) * 10) % 360 + 360) % 360
        const isCardinal = deg % 90 === 0
        return (
          <div key={off} style={{
            flexShrink: 0, width: 32, display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{ width: 1, height: isCardinal ? 8 : 5, background: isCurrent ? '#00F5C4' : 'rgba(0,245,196,0.3)', marginBottom: 2 }} />
            <span style={{ ...orb, fontSize: 8, color: isCurrent ? '#00F5C4' : isCardinal ? 'rgba(0,245,196,0.55)' : 'rgba(0,245,196,0.25)' }}>
              {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : deg === 270 ? 'W' : `${deg}°`}
            </span>
          </div>
        )
      })}
      {/* Center marker */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: 6, background: '#00F5C4', boxShadow: '0 0 6px rgba(0,245,196,0.8)' }} />
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function PilotSimModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const modalRef   = useRef<HTMLDivElement>(null)
  const sceneRef   = useRef<HTMLDivElement>(null)
  const terrainRef = useRef<HTMLDivElement>(null)
  const crossRef   = useRef<HTMLDivElement>(null)
  const horizonRef = useRef<HTMLDivElement>(null)
  const chSvgRef   = useRef<SVGGElement>(null)

  const [bootStep, setBootStep]     = useState(0)
  const [booting, setBooting]       = useState(true)
  const [povReady, setPovReady]     = useState(false)
  const [flightMode, setFlightMode] = useState<'AUTO' | 'MANUAL'>('AUTO')
  const [battery, setBattery]       = useState(87.4)
  const [signal, setSignal]         = useState(94)
  const [elapsed, setElapsed]       = useState(0)
  const [telem, setTelem]           = useState<SimTelemetry>(INIT_TELEM)
  const [targets, setTargets]       = useState<Target[]>(INIT_TARGETS)
  const [activeWarning, setActiveWarning] = useState('')
  const [bank, setBank]             = useState(0)
  const [pitch, setPitch]           = useState(0)
  const [audioOn, setAudioOn]       = useState(false)
  const [closing, setClosing]       = useState(false)
  const [lockingIdx, setLockingIdx] = useState<number | null>(null)
  const [ripples, setRipples]       = useState<{ id: number; x: number; y: number }[]>([])

  const audioCtxRef   = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef       = useRef<GainNode | null>(null)
  const lockTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningIdxRef = useRef(0)

  // ── Open/close animation ──────────────────────────────────────────────────
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    if (open && !closing) {
      // Expand from camera panel position (bottom-right)
      gsap.fromTo(modal,
        { clipPath: 'inset(calc(100% - 210px) 0% 0% calc(100% - 300px) round 3px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.65, ease: 'expo.out' }
      )
    }
  }, [open, closing])

  // ── Boot sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setBootStep(0); setBooting(true); setPovReady(false)
      setElapsed(0); setBattery(87.4); setTargets(INIT_TARGETS)
      setBank(0); setPitch(0); setActiveWarning('')
      return
    }
    const delays = [200, 550, 950, 1350, 1750, 2200]
    const timers = delays.map((d, i) =>
      setTimeout(() => setBootStep(i + 1), d)
    )
    const finishTimer = setTimeout(() => {
      setBooting(false)
      setTimeout(() => setPovReady(true), 100)
    }, 2700)
    return () => { timers.forEach(clearTimeout); clearTimeout(finishTimer) }
  }, [open])

  // ── Mouse + scene flight ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open || booting) return
    const scene   = sceneRef.current
    const terrain = terrainRef.current
    const cross   = crossRef.current
    const horizon = horizonRef.current
    if (!scene || !terrain || !cross || !horizon) return

    let nx = 0; let ny = 0
    let bankS = 0; let pitchS = 0
    let terrainY = 0
    let crossX = window.innerWidth / 2; let crossY = window.innerHeight / 2

    const onMove = (e: MouseEvent) => {
      nx = (e.clientX / window.innerWidth  - 0.5) * 2
      ny = (e.clientY / window.innerHeight - 0.5) * 2
      crossX = e.clientX - 24
      crossY = e.clientY - 24
    }

    const tick = () => {
      bankS  += (nx * 22  - bankS)  * 0.05
      pitchS += (ny * 10  - pitchS) * 0.05

      setBank(bankS)
      setPitch(pitchS)

      gsap.set(scene, { rotateZ: -bankS, rotateX: pitchS * 0.4 })
      gsap.set(horizon, { y: -pitchS * 14 })

      // Scroll terrain
      terrainY -= 0.22 + Math.abs(ny) * 0.12
      gsap.set(terrain, { backgroundPositionY: `${terrainY}px` })

      // Move crosshair
      gsap.set(cross, { x: crossX, y: crossY })

      // Telemetry drift
      setTelem(prev => ({
        alt:  Math.max(800, Math.min(1500, prev.alt  + (Math.random() * 4 - 2))),
        spd:  Math.max(8,   Math.min(22,   prev.spd  + (Math.random() * 0.3 - 0.15))),
        hdg:  (prev.hdg + bankS * 0.05 + 360) % 360,
        lat:  prev.lat  + 0.0000018,
        lon:  prev.lon  + 0.0000022,
        agl:  Math.max(20, Math.min(80,   prev.agl  + (Math.random() * 3 - 1.5))),
        temp: prev.temp + (Math.random() * 0.04 - 0.02),
      }))
    }

    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(tick)
    return () => { window.removeEventListener('mousemove', onMove); gsap.ticker.remove(tick) }
  }, [open, booting])

  // ── Flight timers ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || booting) return
    const t = setInterval(() => {
      setElapsed(p => p + 1)
      setBattery(p => Math.max(0, p - 0.018))
      setSignal(p => Math.max(60, Math.min(99, p + (Math.random() * 2 - 1))))
    }, 1000)
    return () => clearInterval(t)
  }, [open, booting])

  // ── Random warnings ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || booting) return
    const scheduleNext = () => {
      const delay = 14000 + Math.random() * 18000
      return setTimeout(() => {
        const w = WARNINGS[warningIdxRef.current % WARNINGS.length]
        warningIdxRef.current++
        setActiveWarning(w)
        setTimeout(() => setActiveWarning(''), 4500)
        scheduleNext()
      }, delay)
    }
    const t = scheduleNext()
    return () => clearTimeout(t)
  }, [open, booting])

  // ── Target proximity / lock ───────────────────────────────────────────────
  useEffect(() => {
    if (!open || booting) return
    const interval = setInterval(() => {
      setTargets(prev => prev.map((tgt, i) => {
        if (tgt.locked) return tgt
        // Simple random drift of distance to simulate approach
        const newDist = Math.max(10, tgt.dist - (Math.random() * 8))
        if (!tgt.locking && newDist < 120 && lockingIdx === null) {
          setLockingIdx(i)
          if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
          lockTimerRef.current = setTimeout(() => {
            setTargets(pp => pp.map((t2, j) => j === i ? { ...t2, locked: true, locking: false } : t2))
            setLockingIdx(null)
            // Add ripple
            setRipples(rp => [...rp, { id: Date.now(), x: tgt.x, y: tgt.y }])
            setTimeout(() => setRipples(rp => rp.slice(1)), 1200)
          }, 1800)
          return { ...tgt, dist: newDist, locking: true }
        }
        return { ...tgt, dist: newDist }
      }))
    }, 1200)
    return () => clearInterval(interval)
  }, [open, booting, lockingIdx])

  // ── Audio ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!audioOn) {
      oscillatorRef.current?.stop()
      oscillatorRef.current = null
      audioCtxRef.current?.close()
      audioCtxRef.current = null
      return
    }
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = 185
      gain.gain.value = 0.04
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start()
      audioCtxRef.current = ctx
      oscillatorRef.current = osc
      gainRef.current = gain
    } catch { /* ignore */ }
    return () => {
      oscillatorRef.current?.stop()
      audioCtxRef.current?.close()
    }
  }, [audioOn])

  // Audio frequency modulation with bank
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = 185 + Math.abs(bank) * 1.8
    }
  }, [bank])

  // ── ESC key ───────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setAudioOn(false)
    const modal = modalRef.current
    if (modal) {
      gsap.to(modal, {
        clipPath: 'inset(calc(100% - 210px) 0% 0% calc(100% - 300px) round 3px)',
        duration: 0.5, ease: 'expo.in',
        onComplete: () => { setClosing(false); onClose() }
      })
    } else { setClosing(false); onClose() }
  }, [closing, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  // ── Glitch interval ───────────────────────────────────────────────────────
  const [glitching, setGlitching] = useState(false)
  useEffect(() => {
    if (!open || booting) return
    const scheduleGlitch = () => {
      const delay = 8000 + Math.random() * 12000
      return setTimeout(() => {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 350)
        scheduleGlitch()
      }, delay)
    }
    const t = scheduleGlitch()
    return () => clearTimeout(t)
  }, [open, booting])

  if (!open) return null

  const batteryBars = Math.round(battery / 20)
  const sigBars     = Math.round(signal / 20)

  return (
    <div
      ref={modalRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000205',
        overflow: 'hidden',
        clipPath: 'inset(0% 0% 0% 0%)',
      }}
    >
      {/* ── Boot screen ── */}
      {booting && <BootScreen step={bootStep} />}

      {/* ── POV Scene ── */}
      <div
        ref={sceneRef}
        style={{
          position: 'absolute', inset: '-8%',
          opacity: povReady ? 1 : 0,
          filter: povReady ? 'saturate(1)' : 'saturate(0)',
          transition: 'opacity 0.9s ease, filter 0.9s ease',
          transformStyle: 'preserve-3d',
          animation: glitching ? 'glitch-shift 0.35s ease forwards' : undefined,
        }}
      >
        {/* Sky gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #000205 0%, #000c1a 28%, #001428 44%, #012a1a 54%, #0a2208 66%, #1a1a06 78%, #1a1200 88%, #120a00 100%)',
        }} />

        {/* Stars */}
        {Array.from({ length: 38 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 7 === 0 ? 2 : 1,
            height: i % 7 === 0 ? 2 : 1,
            borderRadius: '50%',
            background: i % 9 === 0 ? '#00F5C4' : '#ffffff',
            top: `${(i * 13 + 7) % 45}%`,
            left: `${(i * 17 + 3) % 95}%`,
            opacity: 0.15 + (i % 5) * 0.07,
          }} />
        ))}

        {/* Far clouds */}
        {[
          { l: '5%', t: '30%', w: 380, h: 120, op: 0.08, blur: 40 },
          { l: '55%', t: '25%', w: 320, h: 100, op: 0.06, blur: 50 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', left: c.l, top: c.t, width: c.w, height: c.h,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(60,90,120,0.9) 0%, transparent 70%)',
            filter: `blur(${c.blur}px)`,
            opacity: c.op,
          }} />
        ))}

        {/* Near clouds */}
        {[
          { l: '-5%', t: '36%', w: 280, h: 80, op: 0.13, blur: 28 },
          { l: '40%', t: '38%', w: 220, h: 70, op: 0.10, blur: 24 },
          { l: '72%', t: '33%', w: 300, h: 90, op: 0.11, blur: 32 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', left: c.l, top: c.t, width: c.w, height: c.h,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(80,110,90,0.8) 0%, transparent 65%)',
            filter: `blur(${c.blur}px)`,
            opacity: c.op,
          }} />
        ))}

        {/* Horizon line */}
        <div ref={horizonRef} style={{
          position: 'absolute', left: 0, right: 0, top: '46%', height: 2,
          background: 'linear-gradient(to right, transparent 0%, rgba(0,245,196,0.25) 20%, rgba(0,245,196,0.45) 50%, rgba(0,245,196,0.25) 80%, transparent 100%)',
          boxShadow: '0 0 12px rgba(0,245,196,0.18)',
        }} />

        {/* Terrain grid */}
        <div
          ref={terrainRef}
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '58%',
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,245,196,0.09) 28px, rgba(0,245,196,0.09) 29px),
              repeating-linear-gradient(90deg, transparent, transparent 36px, rgba(0,245,196,0.06) 36px, rgba(0,245,196,0.06) 37px)
            `,
            backgroundSize: '37px 29px',
            transform: 'perspective(420px) rotateX(52deg) scaleX(1.6) translateY(12px)',
            transformOrigin: '50% 100%',
            opacity: 0.75,
          }}
        />

        {/* Vegetation blobs */}
        {[
          { l: '10%', w: 180, h: 80, op: 0.22 },
          { l: '32%', w: 140, h: 60, op: 0.18 },
          { l: '55%', w: 200, h: 90, op: 0.20 },
          { l: '76%', w: 160, h: 70, op: 0.16 },
        ].map((v, i) => (
          <div key={i} style={{
            position: 'absolute', left: v.l, bottom: '5%', width: v.w, height: v.h,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(30,80,20,0.9) 0%, transparent 70%)',
            filter: 'blur(18px)',
            opacity: v.op,
          }} />
        ))}

        {/* Targets on terrain */}
        {targets.map(tgt => (
          <div key={tgt.id} style={{
            position: 'absolute', left: `${tgt.x}%`, top: `${tgt.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}>
            {/* Bracket frame */}
            <svg width={tgt.locking ? 36 : 48} height={tgt.locking ? 36 : 48}
              style={{ transition: 'width 0.4s ease, height 0.4s ease' }}>
              <rect x={tgt.locking ? 3 : 2} y={tgt.locking ? 3 : 2}
                width={tgt.locking ? 30 : 44} height={tgt.locking ? 30 : 44}
                rx="2" fill="none"
                stroke={tgt.locked ? '#00d68f' : 'rgba(0,245,196,0.7)'}
                strokeWidth={tgt.locked ? 2 : 1.5}
                strokeDasharray={tgt.locking ? '5 3' : undefined}
              />
              {tgt.locked && (
                <path d="M 10 24 L 20 32 L 38 14" stroke="#00d68f" strokeWidth="2" fill="none" />
              )}
            </svg>
            <div style={{ ...orb, position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 2, fontSize: 8, color: tgt.locked ? '#00d68f' : 'rgba(0,245,196,0.75)', whiteSpace: 'nowrap' }}>
              {tgt.locked ? `${tgt.label} ✓ LOCKED` : tgt.locking ? 'LOCKING...' : `${tgt.label}  ${Math.round(tgt.dist)}m`}
            </div>
          </div>
        ))}

        {/* Lock ripples */}
        {ripples.map(r => (
          <div key={r.id} style={{
            position: 'absolute', left: `${r.x}%`, top: `${r.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 40, height: 40, borderRadius: '50%',
            border: '2px solid #00d68f',
            animation: 'lock-ripple 1.0s ease-out forwards',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.72) 100%)',
        }} />
      </div>

      {/* ── HUD (shown after boot) ── */}
      {!booting && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: povReady ? 1 : 0, transition: 'opacity 0.6s ease 0.3s' }}>

          {/* Heading strip */}
          <HeadingStrip hdg={telem.hdg} />

          {/* ADI — left center */}
          <div style={{ position: 'absolute', left: 40, top: '50%', transform: 'translateY(-55%)' }}>
            <ArtificialHorizon bank={bank} pitch={pitch} />
          </div>

          {/* Speed tape — left of ADI */}
          <div style={{ position: 'absolute', left: 170, top: '50%', transform: 'translateY(-60%)' }}>
            <Tape value={telem.spd} label="SPD" unit="m/s" min={0} max={40} />
          </div>

          {/* Altitude tape — right side */}
          <div style={{ position: 'absolute', right: 340, top: '50%', transform: 'translateY(-60%)' }}>
            <Tape value={telem.alt} label="ALT" unit="m" min={900} max={1600} warn={telem.agl < 30} />
          </div>

          {/* Radar altimeter */}
          <div style={{ position: 'absolute', right: 340, top: '50%', transform: 'translateY(62px)' }}>
            <div style={{ ...orb, fontSize: 8, color: telem.agl < 30 ? '#ff4d4f' : telem.agl < 50 ? '#ffb800' : 'rgba(0,245,196,0.65)', letterSpacing: '0.1em', textAlign: 'center' }}>
              RADAR ALT<br />
              <span style={{ fontSize: 11, color: telem.agl < 30 ? '#ff4d4f' : '#00F5C4' }}>{Math.round(telem.agl)}m</span>
            </div>
          </div>

          {/* G-force — below ADI */}
          <div style={{ position: 'absolute', left: 40, top: '50%', transform: 'translateY(80px)', width: 120, textAlign: 'center' }}>
            <span style={{ ...orb, fontSize: 9, color: 'rgba(0,245,196,0.55)', letterSpacing: '0.12em' }}>
              G  <span style={{ color: '#00F5C4' }}>{(1 + Math.abs(bank) * 0.012).toFixed(2)}</span>
            </span>
          </div>

          {/* Flight mode badge — top left */}
          <div style={{ position: 'absolute', top: 68, left: 24, pointerEvents: 'auto', cursor: 'pointer' }}
            onClick={() => setFlightMode(m => m === 'AUTO' ? 'MANUAL' : 'AUTO')}>
            <div style={{
              ...orb, fontSize: 9, letterSpacing: '0.18em', padding: '4px 10px',
              border: `1px solid ${flightMode === 'AUTO' ? 'rgba(0,245,196,0.4)' : 'rgba(255,77,79,0.5)'}`,
              color: flightMode === 'AUTO' ? '#00F5C4' : '#ff4d4f',
              background: flightMode === 'AUTO' ? 'rgba(0,245,196,0.06)' : 'rgba(255,77,79,0.08)',
              borderRadius: 2,
            }}>
              {flightMode === 'AUTO' ? '⬡ AUTO PILOT' : '⬡ MANUAL'}
            </div>
          </div>

          {/* Battery & Signal — top right */}
          <div style={{ position: 'absolute', top: 68, right: 80, textAlign: 'right' }}>
            <div style={{ ...orb, fontSize: 9, color: battery < 20 ? '#ff4d4f' : 'rgba(0,245,196,0.7)', letterSpacing: '0.12em', marginBottom: 4 }}>
              {'◼'.repeat(batteryBars) + '◻'.repeat(5 - batteryBars)}  {battery.toFixed(1)}%  BATT
            </div>
            <div style={{ ...orb, fontSize: 9, color: 'rgba(0,245,196,0.65)', letterSpacing: '0.12em' }}>
              {'▌'.repeat(sigBars) + '░'.repeat(5 - sigBars)}  {Math.round(signal)}%  SIG
            </div>
          </div>

          {/* Corner brackets — full screen */}
          {(['tl', 'tr', 'bl', 'br'] as const).map(corner => {
            const size = 32
            const pMap = { tl: { top: 16, left: 16 }, tr: { top: 16, right: 16 }, bl: { bottom: 16, left: 16 }, br: { bottom: 16, right: 16 } }
            const dMap: Record<string, string> = {
              tl: `M ${size} 0 L 0 0 L 0 ${size}`,
              tr: `M 0 0 L ${size} 0 L ${size} ${size}`,
              bl: `M ${size} ${size} L 0 ${size} L 0 0`,
              br: `M 0 ${size} L ${size} ${size} L ${size} 0`,
            }
            return (
              <div key={corner} style={{ position: 'absolute', ...pMap[corner] }}>
                <svg width={size} height={size} fill="none">
                  <path d={dMap[corner]} stroke="rgba(0,245,196,0.3)" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </div>
            )
          })}

          {/* Crosshair (follows mouse) */}
          <div ref={crossRef} style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 48, pointerEvents: 'none' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="16" stroke="rgba(0,245,196,0.55)" strokeWidth="1"
                strokeDasharray="4 3" style={{ animation: 'ring-rotate 4s linear infinite', transformOrigin: '24px 24px' }} />
              <line x1="4"  y1="24" x2="15" y2="24" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2" />
              <line x1="33" y1="24" x2="44" y2="24" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2" />
              <line x1="24" y1="4"  x2="24" y2="15" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2" />
              <line x1="24" y1="33" x2="24" y2="44" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2" />
              <circle cx="24" cy="24" r="2.5" fill="#00F5C4" />
            </svg>
          </div>

          {/* Warning */}
          {activeWarning && (
            <div style={{
              position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)',
              ...orb, fontSize: 11, color: '#ffb800', letterSpacing: '0.1em',
              padding: '5px 14px', border: '1px solid rgba(255,184,0,0.35)',
              background: 'rgba(255,184,0,0.06)',
              animation: 'warning-in 0.3s ease',
              borderRadius: 2,
            }}>
              {activeWarning}
            </div>
          )}

          {/* Bottom status bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
            background: 'rgba(0,3,8,0.85)', borderTop: '1px solid rgba(0,245,196,0.1)',
            display: 'flex', alignItems: 'center', paddingInline: 16, gap: 0,
            overflow: 'hidden',
          }}>
            {[
              `⌂ DRONE-01`,
              `MISSION: AEROVYN-SURVEY-01`,
              `TIME: ${fmtTime(elapsed)}`,
              `ALT: ${Math.round(telem.alt)}m`,
              `SPD: ${telem.spd.toFixed(1)} m/s`,
              `HDG: ${Math.round(telem.hdg)}°`,
              `TEMP: ${telem.temp.toFixed(1)}°C`,
              `GPS: LOCKED`,
            ].map((item, i) => (
              <span key={i} style={{
                ...orb, fontSize: 8, letterSpacing: '0.1em', whiteSpace: 'nowrap',
                color: i === 0 ? '#00F5C4' : 'rgba(0,245,196,0.55)',
                padding: '0 14px',
                borderLeft: i > 0 ? '1px solid rgba(0,245,196,0.1)' : undefined,
              }}>{item}</span>
            ))}
          </div>

          {/* Audio toggle */}
          <button
            style={{
              position: 'absolute', bottom: 40, right: 24, pointerEvents: 'auto',
              ...orb, fontSize: 8, color: audioOn ? '#00F5C4' : 'rgba(0,245,196,0.4)',
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,245,196,0.2)',
              padding: '4px 10px', borderRadius: 2, cursor: 'pointer', letterSpacing: '0.12em',
            }}
            onClick={() => setAudioOn(a => !a)}
          >
            {audioOn ? '🔊 AUDIO ON' : '🔇 AUDIO OFF'}
          </button>

        </div>
      )}

      {/* ── Exit button (always shown after boot starts) ── */}
      <button
        style={{
          position: 'absolute', top: 14, right: 24, zIndex: 100,
          pointerEvents: 'auto', cursor: 'pointer',
          ...orb, fontSize: 9, color: 'rgba(0,245,196,0.7)', letterSpacing: '0.18em',
          background: 'rgba(0,3,8,0.8)', border: '1px solid rgba(0,245,196,0.22)',
          padding: '6px 14px', borderRadius: 2,
          transition: 'color 0.2s, border-color 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#00F5C4'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 14px rgba(0,245,196,0.2)' }}
        onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = 'rgba(0,245,196,0.7)'; (e.target as HTMLButtonElement).style.boxShadow = 'none' }}
        onClick={handleClose}
      >
        ✕ EXIT SIMULATION
      </button>

      {/* Scanline overlay (subtle) */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
        zIndex: 5,
      }} />
    </div>
  )
}
