'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type GameState = 'menu' | 'briefing' | 'booting' | 'flying' | 'gameover' | 'complete'

interface WorldTarget {
  id: number
  worldX: number   // metres east of start
  worldY: number   // metres north of start
  label: string
  points: number
  locked: boolean
  locking: boolean
  lockProgress: number  // 0–100
  hidden: boolean       // reveals only at close range (rescue mission)
  revealed: boolean
}

interface Mission {
  id: number; codename: string; title: string
  brief: string; objective: string
  targets: { x: number; y: number }[]
  timeLimit: number; difficulty: 'ROOKIE' | 'PILOT' | 'ACE'
  color: string; startHeading: number
  hiddenTargets?: boolean
}

interface Phys {
  bank: number; pitch: number; nx: number; ny: number
  throttle: number; speed: number; vspeed: number
  altitude: number; agl: number; temp: number
  droneX: number; droneY: number; heading: number
  terrainX: number; terrainY: number
  distFlown: number   // total metres flown (always increases)
  crossX: number; crossY: number
  turbX: number; turbY: number; paused: boolean
  lowAltTimer: number  // seconds spent dangerously low
  keys: { w:boolean; a:boolean; s:boolean; d:boolean; q:boolean; e:boolean; shift:boolean }
}

interface ScreenTarget extends WorldTarget {
  sx: number; sy: number   // screen % position
  dist: number
  onScreen: boolean
  relBearing: number       // degrees left/right of drone nose
  apparent: number         // apparent size px
}

// ─── Orbitron shorthand ────────────────────────────────────────────────────────
const orb: React.CSSProperties = { fontFamily: 'var(--font-orbitron)' }

// ─── Canvas world renderer (runs at 60 Hz in RAF) ────────────────────────────
const STAR_DATA: [number,number,number,number][] = [
  [0.08,0.10,0.80,1.20],[0.22,0.06,1.00,0.90],[0.35,0.18,0.70,1.50],
  [0.55,0.08,0.90,1.10],[0.72,0.14,0.60,0.80],[0.85,0.04,0.85,1.30],
  [0.91,0.22,0.75,0.70],[0.15,0.28,0.90,1.00],[0.44,0.34,0.80,1.40],
  [0.68,0.24,0.70,0.90],[0.78,0.37,0.85,1.20],[0.92,0.12,0.90,0.80],
  [0.05,0.38,0.70,1.10],[0.62,0.40,0.80,1.00],[0.32,0.41,0.75,0.90],
  [0.48,0.14,0.90,1.30],[0.25,0.33,0.85,0.70],[0.58,0.30,0.70,1.00],
  [0.82,0.27,0.80,1.20],[0.12,0.22,0.90,0.80],[0.40,0.05,0.75,1.00],
  [0.70,0.05,0.85,1.10],[0.95,0.32,0.70,0.90],[0.02,0.08,0.90,1.30],
  [0.52,0.42,0.80,0.80],[0.18,0.15,0.65,1.00],[0.65,0.35,0.88,0.75],
]

function drawMtns(ctx: CanvasRenderingContext2D, W: number, hY: number, offset: number, fill: string, amp: number, pts: number[]) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.moveTo(-10, hY + 2)
  for(let rep = -1; rep <= 2; rep++) {
    for(let i = 0; i < pts.length; i += 2)
      ctx.lineTo(rep * W - offset + (pts[i] / 1100) * W, hY - pts[i+1] * amp)
  }
  ctx.lineTo(W + 10, hY + 2)
  ctx.closePath()
  ctx.fill()
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, alpha: number) {
  if(scale < 0.04 || alpha < 0.08) return
  const h = scale * 110, w = scale * 44
  ctx.globalAlpha = alpha
  // trunk
  ctx.fillStyle = `rgb(${Math.round(18+scale*12)},${Math.round(10+scale*6)},${Math.round(4+scale*4)})`
  ctx.fillRect(x - w*0.1, y - h*0.25, w*0.20, h*0.25)
  // foliage — progressively lighter toward top for depth
  const tiers: [number,number,number][] = [
    [0.72, 0.08, 0],   // bottom tier: widest, darkest
    [0.58, 0.28, 0.14],// mid tier
    [0.42, 0.50, 0.28],// upper-mid
    [0.26, 0.72, 0.40],// top
  ]
  for(const [hw, baseY, topOff] of tiers) {
    const brightness = 0.45 + hw * 0.55 + scale * 0.3  // brighter on sides
    const r = Math.round(8  + brightness * 18)
    const g = Math.round(52 + brightness * 55)
    const b = Math.round(8  + brightness * 16)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.beginPath()
    ctx.moveTo(x,        y - h*(baseY + topOff + 0.18))
    ctx.lineTo(x - w*hw, y - h*baseY)
    ctx.lineTo(x + w*hw, y - h*baseY)
    ctx.closePath()
    ctx.fill()
  }
  // rim highlight (moonlight edge)
  ctx.globalAlpha = alpha * 0.35
  ctx.fillStyle = 'rgba(0,245,196,0.5)'
  ctx.beginPath()
  ctx.moveTo(x,        y - h*0.98)
  ctx.lineTo(x - w*0.10, y - h*0.72)
  ctx.lineTo(x + w*0.10, y - h*0.72)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

function drawWorld(
  canvas: HTMLCanvasElement,
  terrainX: number, terrainY: number,
  distFlown: number, speed: number,
  dp: number, now: number
) {
  const W = canvas.offsetWidth, H = canvas.offsetHeight
  if(!W || !H) return
  if(canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H }
  const ctx = canvas.getContext('2d')
  if(!ctx) return

  const hY = H * (0.44 - dp * 0.009)   // horizon y (shifts with pitch)

  // Sky
  const sky = ctx.createLinearGradient(0,0,0,hY)
  sky.addColorStop(0,'#000205'); sky.addColorStop(0.45,'#000d1a')
  sky.addColorStop(0.8,'#001618'); sky.addColorStop(1,'#011c12')
  ctx.fillStyle = sky; ctx.fillRect(0,0,W,hY+2)

  // Stars
  for(const [sx,sy,bri,freq] of STAR_DATA) {
    const alpha = bri * (0.45 + 0.55 * Math.sin(now * freq * 0.00095))
    ctx.globalAlpha = alpha * 0.8
    ctx.fillStyle='#fff'; ctx.beginPath()
    ctx.arc(sx*W, sy*hY, sx>0.8?1.2:0.8, 0, Math.PI*2); ctx.fill()
  }
  ctx.globalAlpha = 1

  // Atmospheric haze
  const haze = ctx.createLinearGradient(0,hY-28,0,hY+18)
  haze.addColorStop(0,'transparent'); haze.addColorStop(0.5,'rgba(0,38,18,0.28)'); haze.addColorStop(1,'transparent')
  ctx.fillStyle=haze; ctx.fillRect(0,hY-28,W,46)

  // Mountains — two parallax layers
  const mOff1 = ((terrainX*0.09)%W+W)%W
  const mOff2 = ((terrainX*0.20)%W+W)%W
  drawMtns(ctx,W,hY,mOff1,'rgba(0,10,5,0.90)',0.44,[65,38,130,76,205,8,288,58,368,18,428,52,505,3,585,48,668,14,725,58,805,22,872,68,956,28,1040,62,1100,38])
  drawMtns(ctx,W,hY,mOff2,'rgba(0,18,9,0.75)',0.34,[82,48,155,78,235,34,315,64,402,23,482,58,554,18,636,53,712,28,792,68,862,38,944,73,1025,43,1100,68])

  // Ground — slightly lighter so trees/grid are readable
  const gnd = ctx.createLinearGradient(0,hY,0,H)
  gnd.addColorStop(0,'#091509'); gnd.addColorStop(0.25,'#112411')
  gnd.addColorStop(0.65,'#173217'); gnd.addColorStop(1,'#1f3e1c')
  ctx.fillStyle=gnd; ctx.fillRect(0,hY,W,H-hY)

  // Perspective grid — scrolls with distFlown (forward) and terrainX (lateral)
  const vpX = W/2 + (terrainX % 120)*0.18
  ctx.save(); ctx.beginPath(); ctx.rect(0,hY-1,W,H+10); ctx.clip()
  ctx.strokeStyle='rgba(0,245,196,0.06)'; ctx.lineWidth=1

  // Horizontal bands: perspective depth, forward scroll from distFlown
  const GRID_ROWS = 28
  const rowSpacing = 18  // virtual units between rows
  for(let i=0;i<GRID_ROWS;i++){
    // scroll phase: distFlown * scale factor, wraps per row spacing
    const phase = ((distFlown * 3.5) % rowSpacing) / rowSpacing
    const raw = (i/GRID_ROWS + phase/GRID_ROWS)%1
    const y = hY + (H-hY)*(raw*raw*raw)  // cubic for more depth feel
    ctx.globalAlpha = 0.04 + raw*0.07
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Radial lines from vanishing point (pan with heading via terrainX)
  const VLINES = 20
  const vLineSpacing = W / VLINES
  const vOff = ((terrainX * 0.22) % vLineSpacing + vLineSpacing) % vLineSpacing
  ctx.strokeStyle='rgba(0,245,196,0.045)'; ctx.lineWidth=1
  for(let i=-2;i<=VLINES+2;i++){
    const xB = i*vLineSpacing + vOff - W*0.08
    ctx.beginPath(); ctx.moveTo(vpX,hY); ctx.lineTo(xB,H+20); ctx.stroke()
  }
  ctx.restore()

  // Trees — 3 density lanes per side, scrolling with terrainY
  // treeBottom caps the near edge so giant trees don't dominate
  const treeBottom = H * 0.84
  const lanes=[
    // inner lane: moderate trees form a natural corridor
    {side:-1, lat:0.18, sp:95,  off:0,  maxSc:1.4},
    {side: 1, lat:0.18, sp:95,  off:0,  maxSc:1.4},
    // mid lane: sparser, slightly further out
    {side:-1, lat:0.32, sp:115, off:50, maxSc:1.8},
    {side: 1, lat:0.32, sp:115, off:50, maxSc:1.8},
    // outer lane: distant background fill
    {side:-1, lat:0.46, sp:130, off:25, maxSc:2.2},
    {side: 1, lat:0.46, sp:130, off:25, maxSc:2.2},
  ]
  // distFlown drives forward scroll; terrainX drives lateral pan
  // Tree corridor: each lane cycles TC trees with spacing ln.sp virtual metres
  const TC=16
  for(const ln of lanes){
    const MAXD = TC * ln.sp
    // forward scroll: distFlown in metres, scale 1.8 so at cruise (20 m/s) ~2 trees/sec pass
    const fwdScroll = (distFlown * 1.8) % MAXD
    for(let i=0;i<TC;i++){
      const vd = ((i*ln.sp + ln.off) - fwdScroll + MAXD*4) % MAXD
      const rel = vd / MAXD          // 0 = just ahead (near), 1 = far
      if(rel < 0.03 || rel > 0.96) continue
      const t = 1 - rel              // t=1 nearest, t=0 farthest
      const sY = hY + (treeBottom-hY)*(t*t)
      if(sY > treeBottom+10 || sY < hY+2) continue
      const sc = Math.min(ln.maxSc, t*t*2.5)
      const al = Math.min(1, t*2.8)
      // lateral position: converge toward center at distance, spread at sides when near
      const latW = ln.lat*(0.5 + t*0.5) + 0.03
      // pan with heading (terrainX) — trees shift across as drone turns
      const sX = W/2 + ln.side*(W*latW) - terrainX*0.14
      drawTree(ctx, sX, sY, sc, al)
    }
  }

  // Speed streaks — vertical motion lines intensify with speed
  if(speed > 4) {
    const streakAlpha = Math.min(0.22, (speed-4)/28)
    ctx.save()
    ctx.strokeStyle=`rgba(0,245,196,${streakAlpha})`
    ctx.lineWidth=1
    for(let i=0;i<18;i++){
      const sx = W*(0.08 + i*0.05) + (terrainX*0.08)%( W*0.05)
      const streak = Math.min(60, speed*2.5)
      const startY = treeBottom - streak*0.4
      const endY   = treeBottom + streak
      ctx.globalAlpha = streakAlpha * (0.3 + Math.random()*0.7)
      ctx.beginPath(); ctx.moveTo(sx, startY); ctx.lineTo(sx, endY); ctx.stroke()
    }
    ctx.globalAlpha=1; ctx.restore()
  }

  // Ground light patches (terrain variation)
  ctx.globalAlpha = 0.12
  for(let i=0;i<8;i++){
    const px=W*(0.15+i*0.12), py=hY+(treeBottom-hY)*(0.4+i*0.08)
    const r=(60+i*18)*(1-i*0.05)
    const ptch=ctx.createRadialGradient(px,py,0,px,py,r)
    ptch.addColorStop(0,'rgba(20,80,20,1)'); ptch.addColorStop(1,'transparent')
    ctx.fillStyle=ptch; ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fill()
  }
  ctx.globalAlpha=1

  // Horizon glow line
  const hl = ctx.createLinearGradient(0,0,W,0)
  hl.addColorStop(0,'transparent'); hl.addColorStop(0.15,'rgba(0,245,196,0.20)')
  hl.addColorStop(0.5,'rgba(0,245,196,0.42)'); hl.addColorStop(0.85,'rgba(0,245,196,0.20)'); hl.addColorStop(1,'transparent')
  ctx.strokeStyle=hl; ctx.lineWidth=1.5
  ctx.beginPath(); ctx.moveTo(0,hY); ctx.lineTo(W,hY); ctx.stroke()

  // Vignette
  const vig = ctx.createRadialGradient(W/2,H/2,H*0.18,W/2,H/2,H*0.74)
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,0.72)')
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H)
}

// ─── Mission data ─────────────────────────────────────────────────────────────
// World coords: X = East metres, Y = North metres from start position
const MISSIONS: Mission[] = [
  {
    id: 1, codename: 'SURVEY-ALPHA', title: 'Aerial Survey',
    difficulty: 'ROOKIE', color: '#00F5C4', startHeading: 30, timeLimit: 210,
    brief: 'Conduct a systematic aerial survey of the Kigali eastern corridor. Lock all three survey markers to complete data capture for the AEROVYN mapping archive.',
    objective: 'Lock 3 survey markers. Fly toward each bracket — hold your crosshair steady on a target to initiate lock.',
    targets: [
      { x:  220, y:  580 },
      { x: -350, y:  820 },
      { x:  480, y: 1150 },
    ],
  },
  {
    id: 2, codename: 'PERIMETER-DELTA', title: 'Security Patrol',
    difficulty: 'PILOT', color: '#4D7CF5', startHeading: 60, timeLimit: 180,
    brief: 'An industrial perimeter in the Lake Kivu region shows five anomalous heat signatures. Identify and lock each target before the surveillance window closes.',
    objective: 'Lock 5 anomaly targets. Efficiency matters — build a lock streak for score multipliers.',
    targets: [
      { x:  300, y:  440 },
      { x:  680, y:  180 },
      { x:  520, y: -280 },
      { x: -180, y:  610 },
      { x:  80,  y: 1020 },
    ],
  },
  {
    id: 3, codename: 'SEARCH-RESCUE', title: 'Search & Rescue',
    difficulty: 'ACE', color: '#FF6B35', startHeading: 15, timeLimit: 150,
    hiddenTargets: true,
    brief: 'Four survivors are stranded in dense terrain near the Virunga ridge. Survivor beacons are weak — they only appear within 350m. Fly low and fast. Every second counts.',
    objective: 'Locate and lock 4 hidden survivors. Fly close to reveal them, then hold aim to lock.',
    targets: [
      { x:  150, y:  920 },
      { x: -520, y:  680 },
      { x:  740, y:  450 },
      { x: -80,  y: 1380 },
    ],
  },
]

const BOOT_LINES = [
  '> AEROVYN FLIGHT OS v4.2.1 — INITIALIZING...',
  '> ESTABLISHING UPLINK TO DRONE-01.......',
  '> SIGNAL ACQUIRED ............... 98.4%',
  '> LOADING FLIGHT TELEMETRY ...... OK',
  '> IMU CALIBRATION ............... COMPLETE',
  '> GPS LOCK ...................... ACQUIRED',
  '> POV FEED ONLINE ............... ✓',
  '> ENTERING PILOT MODE',
]

const WARNINGS  = [
  '⚠  WIND SHEAR DETECTED',
  '⚠  TERRAIN PROXIMITY — AGL LOW',
  '⚠  SIGNAL INTERFERENCE',
  '⚠  AIRSPACE BOUNDARY ALERT',
  '⚠  TURBULENCE ZONE AHEAD',
]
const WARN_VOICE = [
  'Wind shear detected. Hold heading.',
  'Terrain proximity warning. Increase altitude.',
  'Signal interference. Switching to backup frequency.',
  'Airspace boundary. Adjust heading immediately.',
  'Turbulence zone ahead. Reduce speed.',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt2   = (n: number) => String(Math.floor(n)).padStart(2, '0')
const fmtTime = (s: number) => `${fmt2(s/3600)}:${fmt2((s%3600)/60)}:${fmt2(s%60)}`

function normalise(deg: number) {
  let d = deg % 360
  if (d > 180)  d -= 360
  if (d < -180) d += 360
  return d
}

// 3-D projection of a ground target onto screen
function projectTarget(
  tx: number, ty: number,
  droneX: number, droneY: number,
  heading: number, alt: number, pitch: number,
): { sx: number; sy: number; dist: number; relBearing: number; onScreen: boolean } {
  const relX = tx - droneX
  const relY = ty - droneY
  const dist = Math.sqrt(relX * relX + relY * relY) || 1
  const bearingDeg = Math.atan2(relX, relY) * (180 / Math.PI)
  const relBearing = normalise(bearingDeg - heading)

  const HFOV = 55  // half horizontal FOV
  const sx = 50 + (relBearing / HFOV) * 50

  const elevDeg   = Math.atan2(-alt, dist) * (180 / Math.PI)
  const dispElev  = elevDeg - pitch * 0.45
  const sy = 46 - (dispElev / 32) * 40

  const onScreen = Math.abs(relBearing) < HFOV + 8 && sy > 8 && sy < 88

  return { sx, sy, dist, relBearing, onScreen }
}

// ─── BootScreen ───────────────────────────────────────────────────────────────
function BootScreen({ step, mission }: { step: number; mission: Mission }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #000205 0%, #000c18 60%, #000510 100%)', display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:'0 12vw' }}>
      <div style={{ marginBottom:36 }}>
        <div style={{ ...orb, fontSize:28, fontWeight:900, color:'#00F5C4', letterSpacing:'0.25em', marginBottom:4 }}>AEROVYN</div>
        <div style={{ ...orb, fontSize:9, color:'rgba(0,245,196,0.4)', letterSpacing:'0.35em' }}>DRONE FLIGHT OPERATIONS — SIMULATOR v4.2.1</div>
      </div>
      <div style={{ marginBottom:18, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ ...orb, fontSize:8, color:mission.color, letterSpacing:'0.3em' }}>MISSION // {mission.codename}</div>
        <div style={{ width:60, height:1, background:mission.color+'40' }} />
        <div style={{ ...orb, fontSize:8, color:mission.color+'80', letterSpacing:'0.2em' }}>{mission.difficulty}</div>
      </div>
      <div style={{ width:300, height:1, background:'rgba(0,245,196,0.08)', marginBottom:24 }} />
      {BOOT_LINES.map((line, i) => (
        <div key={i} style={{ marginBottom:10, opacity:step>i?1:0.12, transition:'opacity 0.35s ease', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ ...orb, fontSize:11, letterSpacing:'0.04em', whiteSpace:'nowrap', color:step>i?(i===BOOT_LINES.length-1?'#00F5C4':'rgba(0,245,196,0.8)'):'rgba(0,245,196,0.15)' }}>{line}</span>
          {step===i+1 && i<BOOT_LINES.length-1 && <span style={{ ...orb, fontSize:11, color:'#00F5C4', animation:'boot-blink 0.7s step-end infinite' }}>█</span>}
          {step>i && i<BOOT_LINES.length-1 && <span style={{ ...orb, fontSize:9, color:'rgba(0,245,196,0.5)' }}>✓</span>}
        </div>
      ))}
      {step>=BOOT_LINES.length && (
        <div style={{ marginTop:28 }}>
          <div style={{ width:300, height:2, background:'rgba(0,245,196,0.1)', borderRadius:1, overflow:'hidden' }}>
            <div style={{ height:'100%', background:'#00F5C4', animation:'sim-load-bar 0.85s linear forwards', transformOrigin:'left', transform:'scaleX(0)' }} />
          </div>
          <p style={{ ...orb, fontSize:9, color:'#00F5C4', marginTop:10, letterSpacing:'0.2em', animation:'boot-blink 1.2s ease-in-out infinite' }}>LAUNCHING SIMULATION...</p>
        </div>
      )}
    </div>
  )
}

// ─── ArtificialHorizon ────────────────────────────────────────────────────────
function ArtificialHorizon({ bank, pitch }: { bank: number; pitch: number }) {
  const cx=60, cy=60, r=54, pp=pitch*2.8
  return (
    <div style={{ position:'relative', width:120, height:120 }}>
      <div style={{ ...orb, position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', fontSize:8, color:'rgba(0,245,196,0.5)', letterSpacing:'0.2em' }}>ADI</div>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs><clipPath id="adi-clip"><circle cx={cx} cy={cy} r={r}/></clipPath></defs>
        <g clipPath="url(#adi-clip)">
          <g transform={`rotate(${-bank},${cx},${cy}) translate(0,${pp})`}>
            <rect x={cx-r-4} y={cy-r-60} width={(r+4)*2} height={r+64} fill="#001a3a"/>
            <rect x={cx-r-4} y={cy}       width={(r+4)*2} height={r+64} fill="#2a1a08"/>
            <line x1={cx-r-4} y1={cy} x2={cx+r+4} y2={cy} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
            {[-15,-10,-5,5,10,15].map(d=>{
              const yo=d*2.8, w=Math.abs(d)>=10?24:14
              return <g key={d}>
                <line x1={cx-w} y1={cy+yo} x2={cx+w} y2={cy+yo} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
                {Math.abs(d)>=10&&<text x={cx-w-8} y={cy+yo+3} textAnchor="end" style={{ fontFamily:'var(--font-orbitron)', fontSize:7, fill:'rgba(255,255,255,0.4)' }}>{Math.abs(d)}</text>}
              </g>
            })}
          </g>
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,245,196,0.4)" strokeWidth="1.5"/>
        <line x1={cx-22} y1={cy} x2={cx-8} y2={cy} stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1={cx+8}  y1={cy} x2={cx+22} y2={cy} stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r="3" fill="#fff"/>
        <g transform={`rotate(${-bank},${cx},${cy})`}>
          <path d={`M ${cx-28} ${cy-45} A 28 28 0 0 1 ${cx+28} ${cy-45}`} stroke="rgba(0,245,196,0.3)" strokeWidth="1" fill="none"/>
        </g>
        <polygon points={`${cx},${cy-44} ${cx-5},${cy-38} ${cx+5},${cy-38}`} fill="rgba(0,245,196,0.7)"/>
      </svg>
    </div>
  )
}

// ─── Tape ─────────────────────────────────────────────────────────────────────
function Tape({ value, label, unit, min, max, color='#00F5C4', warn=false }: {
  value:number; label:string; unit:string; min:number; max:number; color?:string; warn?:boolean
}) {
  const range=max-min, step=range/10
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <span style={{ ...orb, fontSize:8, color:'rgba(0,245,196,0.5)', letterSpacing:'0.18em' }}>{label}</span>
      <div style={{ position:'relative', width:52, height:100, overflow:'hidden', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(0,245,196,0.18)', borderRadius:2 }}>
        {Array.from({length:13},(_,i)=>{
          const tv=Math.round(value/step)*step-(5-i)*step
          const pct=((tv-value)/range)*100+50
          if(pct<-5||pct>105)return null
          const maj=Math.abs(tv%(step*2))<step*0.1
          return (
            <div key={i} style={{ position:'absolute', left:0, right:0, top:`${pct}%`, transform:'translateY(-50%)' }}>
              <div style={{ display:'flex', alignItems:'center', height:14 }}>
                <div style={{ width:maj?12:6, height:1, background:maj?'rgba(0,245,196,0.7)':'rgba(0,245,196,0.3)', marginLeft:4 }}/>
                {maj&&<span style={{ ...orb, fontSize:8, color:'rgba(0,245,196,0.7)', marginLeft:3 }}>{Math.round(tv)}</span>}
              </div>
            </div>
          )
        })}
        <div style={{ position:'absolute', top:'50%', left:0, right:0, transform:'translateY(-50%)', height:18, display:'flex', alignItems:'center', background:'rgba(0,245,196,0.07)', borderTop:`1px solid ${warn?'#ffb800':'rgba(0,245,196,0.5)'}`, borderBottom:`1px solid ${warn?'#ffb800':'rgba(0,245,196,0.5)'}` }}>
          <span style={{ ...orb, fontSize:9, color:warn?'#ffb800':color, marginLeft:6, fontWeight:700 }}>{value.toFixed(1)}</span>
        </div>
      </div>
      <span style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.4)' }}>{unit}</span>
    </div>
  )
}

// ─── HeadingStrip ─────────────────────────────────────────────────────────────
function HeadingStrip({ hdg, targets }: { hdg: number; targets: ScreenTarget[] }) {
  const ticks = Array.from({length:21},(_,i)=>{
    const deg=((Math.round(hdg/10)*10-100+i*10)%360+360)%360
    return { deg, off:i-10 }
  })
  const targetBearings = targets.filter(t=>!t.locked).map(t=>
    ((Math.round((hdg+t.relBearing)/10)*10)%360+360)%360
  )
  return (
    <div style={{ position:'absolute', top:28, left:'50%', transform:'translateX(-50%)', width:360, height:32, background:'rgba(0,3,8,0.8)', border:'1px solid rgba(0,245,196,0.14)', display:'flex', alignItems:'center', overflow:'hidden', borderRadius:2 }}>
      {ticks.map(({deg,off})=>{
        const isCur=deg===((Math.round(hdg/10)*10)%360+360)%360
        const isCard=deg%90===0
        const hasTgt=targetBearings.some(b=>Math.abs(b-deg)<10)
        return (
          <div key={off} style={{ flexShrink:0, width:36, display:'flex', flexDirection:'column', alignItems:'center' }}>
            {hasTgt && <div style={{ width:4, height:4, borderRadius:'50%', background:'#ffb800', marginBottom:1, boxShadow:'0 0 6px #ffb800' }}/>}
            <div style={{ width:1, height:isCard?8:5, background:isCur?'#00F5C4':'rgba(0,245,196,0.3)', marginBottom:2 }}/>
            <span style={{ ...orb, fontSize:8, color:isCur?'#00F5C4':isCard?'rgba(0,245,196,0.55)':'rgba(0,245,196,0.22)' }}>
              {deg===0?'N':deg===90?'E':deg===180?'S':deg===270?'W':`${deg}°`}
            </span>
          </div>
        )
      })}
      <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:1, height:8, background:'#00F5C4', boxShadow:'0 0 6px rgba(0,245,196,0.8)' }}/>
    </div>
  )
}

// ─── RadarMap ─────────────────────────────────────────────────────────────────
function RadarMap({ targets, droneX, droneY, heading }: { targets: ScreenTarget[]; droneX: number; droneY: number; heading: number }) {
  const SCALE = 2000  // metres → fills 100px radius
  const cx = 60, cy = 60, r = 56
  return (
    <div style={{ position:'relative', width:120, height:120 }}>
      <div style={{ ...orb, position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', fontSize:7, color:'rgba(0,245,196,0.5)', letterSpacing:'0.22em' }}>RADAR</div>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <clipPath id="radar-clip"><circle cx={cx} cy={cy} r={r}/></clipPath>
          <radialGradient id="sweep-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F5C4" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#00F5C4" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="rgba(0,5,12,0.9)" stroke="rgba(0,245,196,0.22)" strokeWidth="1"/>
        {[r*0.33,r*0.66,r].map((rv,i)=><circle key={i} cx={cx} cy={cy} r={rv} fill="none" stroke="rgba(0,245,196,0.08)" strokeWidth="0.5"/>)}
        <line x1="4" y1={cy} x2="116" y2={cy} stroke="rgba(0,245,196,0.08)" strokeWidth="0.5"/>
        <line x1={cx} y1="4" x2={cx} y2="116" stroke="rgba(0,245,196,0.08)" strokeWidth="0.5"/>
        <g clipPath="url(#radar-clip)" style={{ animation:'ring-rotate 3.5s linear infinite', transformOrigin:`${cx}px ${cy}px` }}>
          <path d={`M ${cx} ${cy} L ${cx} ${cy-r} A ${r} ${r} 0 0 1 ${cx+r} ${cy} Z`} fill="url(#sweep-g)" opacity="0.3"/>
        </g>
        {targets.filter(t=>t.revealed||!t.hidden).map(t=>{
          const relX = t.worldX - droneX
          const relY = t.worldY - droneY
          const mapX = cx + (relX / SCALE) * r * 1.8
          const mapY = cy - (relY / SCALE) * r * 1.8
          const inMap = Math.sqrt((mapX-cx)**2+(mapY-cy)**2) < r
          if(!inMap)return null
          return (
            <g key={t.id}>
              <circle cx={mapX} cy={mapY} r="3.5" fill={t.locked?'#00d68f':t.locking?'#ffb800':'rgba(0,245,196,0.85)'}/>
              {t.locking&&!t.locked&&<circle cx={mapX} cy={mapY} r="7" fill="none" stroke="#ffb800" strokeWidth="0.8" style={{ animation:'lock-ripple 1s ease-out infinite' }}/>}
            </g>
          )
        })}
        {/* Drone */}
        <circle cx={cx} cy={cy} r="3.5" fill="#00F5C4"/>
        <line x1={cx} y1={cy}
          x2={cx + Math.sin(heading*Math.PI/180)*24}
          y2={cy - Math.cos(heading*Math.PI/180)*24}
          stroke="#00F5C4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ─── ThrottleGauge ────────────────────────────────────────────────────────────
function ThrottleGauge({ value }: { value: number }) {
  const col = value>0.85?'#ff4d4f':value>0.55?'#ffb800':'#00F5C4'
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <span style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.5)', letterSpacing:'0.16em' }}>THR</span>
      <div style={{ width:14, height:90, background:'rgba(0,0,0,0.55)', border:'1px solid rgba(0,245,196,0.18)', borderRadius:2, overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'15%', background:'rgba(255,77,79,0.08)', borderBottom:'1px solid rgba(255,77,79,0.2)' }}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:`${value*100}%`, background:col, transition:'height 0.08s linear, background 0.2s ease' }}/>
        {[25,50,75].map(p=><div key={p} style={{ position:'absolute', left:0, right:0, bottom:`${p}%`, height:1, background:'rgba(0,245,196,0.18)' }}/>)}
      </div>
      <span style={{ ...orb, fontSize:7, color:col }}>{Math.round(value*100)}%</span>
    </div>
  )
}

// ─── Off-screen target arrow ──────────────────────────────────────────────────
function OffScreenArrow({ relBearing, dist, label, color }: { relBearing:number; dist:number; label:string; color:string }) {
  const right = relBearing > 0
  const absB  = Math.abs(relBearing)
  if (absB < 50) return null  // on screen

  const edgeY = 50  // vertical centre for simplicity
  const arrowX = right ? 97 : 3
  const rotate = right ? 90 : -90
  return (
    <div style={{ position:'absolute', top:`${edgeY}%`, left:`${arrowX}%`, transform:`translateY(-50%)`, pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform:`rotate(${rotate}deg)` }}>
        <path d="M 10 2 L 18 14 L 10 11 L 2 14 Z" fill={color} opacity="0.85"/>
      </svg>
      <div style={{ ...orb, fontSize:7, color, textAlign:'center', lineHeight:1.3 }}>
        {label}<br/>{Math.round(dist)}m
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SimulatorPage() {
  const sceneRef   = useRef<HTMLDivElement>(null)
  const terrainRef = useRef<HTMLDivElement>(null)
  const crossRef   = useRef<HTMLDivElement>(null)
  const horizonRef = useRef<HTMLDivElement>(null)
  const droneRef   = useRef<HTMLDivElement>(null)
  const droneSvgRef= useRef<SVGSVGElement>(null)
  const worldRef   = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const frameRef   = useRef(0)
  const flashRef   = useRef<HTMLDivElement>(null)

  const physRef = useRef<Phys>({
    bank:0, pitch:0, nx:0, ny:0,
    throttle:0.38, speed:0, vspeed:0,
    altitude:320, agl:120, temp:24.2,
    droneX:0, droneY:0, heading:30,
    terrainX:0, terrainY:0, distFlown:0,
    crossX:720, crossY:450,
    turbX:0, turbY:0, paused:false, lowAltTimer:0,
    keys:{ w:false, a:false, s:false, d:false, q:false, e:false, shift:false },
  })

  // React state (UI)
  const [gameState, setGameState]     = useState<GameState>('menu')
  const [mission, setMission]         = useState<Mission>(MISSIONS[0])
  const [bootStep, setBootStep]       = useState(0)
  const [booting, setBooting]         = useState(false)
  const [povReady, setPovReady]       = useState(false)
  const [bank, setBank]               = useState(0)
  const [pitch, setPitch]             = useState(0)
  const [telem, setTelem]             = useState({ alt:320, spd:0, hdg:30, agl:120, temp:24.2, throttle:0.38, vspeed:0 })
  const [battery, setBattery]         = useState(100)
  const [signal, setSignal]           = useState(97)
  const [elapsed, setElapsed]         = useState(0)
  const [score, setScore]             = useState(0)
  const [targets, setTargets]         = useState<WorldTarget[]>([])
  const [screenTargets, setScreenTargets] = useState<ScreenTarget[]>([])
  const [lockedCount, setLockedCount] = useState(0)
  const [streak, setStreak]           = useState(0)
  const [audioOn, setAudioOn]         = useState(false)
  const [paused, setPaused]           = useState(false)
  const [activeWarning, setActiveWarning] = useState('')
  const [activeVoice, setActiveVoice]     = useState('')
  const [glitching, setGlitching]     = useState(false)
  const [ripples, setRipples]         = useState<{id:number;sx:number;sy:number}[]>([])
  const [windStr, setWindStr]         = useState(0.15)
  const [showPause, setShowPause]     = useState(false)
  const [crashWarning, setCrashWarning] = useState(false)
  const [lockFlash, setLockFlash]     = useState<string|null>(null)  // color of flash

  // Mutable tracking refs
  const audioCtxRef   = useRef<AudioContext|null>(null)
  const motorOscsRef  = useRef<OscillatorNode[]>([])
  const masterGainRef = useRef<GainNode|null>(null)
  const voiceCoolRef  = useRef(0)
  const elapsedRef    = useRef(0)
  const batteryRef    = useRef(100)
  const scoreRef      = useRef(0)
  const lockedRef     = useRef(0)
  const streakRef     = useRef(0)
  const windRef       = useRef(0.15)
  const rippleIdRef   = useRef(0)
  const lockTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  // Per-target lock tracking: how long crosshair has been on each target
  const aimingAtRef   = useRef<number|null>(null)  // id of target currently being aimed at
  const aimStartRef   = useRef<number>(0)           // timestamp when aiming started

  useEffect(() => { physRef.current.paused = paused; setShowPause(paused) }, [paused])

  // ── Audio utilities ─────────────────────────────────────────────────────────
  const getCtx = useCallback(()=> audioCtxRef.current, [])

  const playTone = useCallback((freq:number, dur:number, vol=0.25, type:OscillatorType='sine', delay=0) => {
    const ctx = getCtx(); if(!ctx) return
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type = type; osc.frequency.value = freq
    g.gain.setValueAtTime(0, ctx.currentTime+delay)
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime+delay+0.01)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+delay+dur)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(ctx.currentTime+delay); osc.stop(ctx.currentTime+delay+dur+0.05)
  }, [getCtx])

  const playLockConfirm = useCallback(() => {
    playTone(523, 0.12, 0.35, 'sine', 0)
    playTone(659, 0.12, 0.35, 'sine', 0.12)
    playTone(784, 0.22, 0.4,  'sine', 0.24)
    playTone(1047,0.3,  0.35, 'sine', 0.46)
  }, [playTone])

  const playWarningBeep = useCallback(()=>{
    playTone(380, 0.08, 0.3, 'square', 0)
    playTone(380, 0.08, 0.3, 'square', 0.15)
  }, [playTone])

  const playProximityBeep = useCallback((speed: number) => {
    // speed 0-1; faster = closer to lock
    playTone(800+speed*400, 0.04+speed*0.02, 0.12+speed*0.1)
  }, [playTone])

  const speak = useCallback((text:string, force=false)=>{
    if(!force && Date.now()<voiceCoolRef.current) return
    voiceCoolRef.current = Date.now()+5000
    setActiveVoice(text)
    if(typeof window!=='undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(text)
      utt.rate=0.86; utt.pitch=0.65; utt.volume=audioOn?0.82:0
      const voices = window.speechSynthesis.getVoices()
      const v = voices.find(v=>v.lang.startsWith('en')&&/male/i.test(v.name))
             || voices.find(v=>v.lang.startsWith('en-US'))
             || voices.find(v=>v.lang.startsWith('en'))
      if(v) utt.voice=v
      utt.onend=()=>setActiveVoice('')
      window.speechSynthesis.speak(utt)
    }
    setTimeout(()=>setActiveVoice(''), 6000)
  }, [audioOn])

  // Flash screen color briefly
  const flash = useCallback((color: string) => {
    setLockFlash(color)
    setTimeout(()=>setLockFlash(null), 280)
  }, [])

  // ── Generate targets ─────────────────────────────────────────────────────────
  const genTargets = (m: Mission): WorldTarget[] =>
    m.targets.map((t,i)=>({
      id:i, worldX:t.x, worldY:t.y, label:`TGT-0${i+1}`,
      points: m.difficulty==='ROOKIE'?120:m.difficulty==='PILOT'?200:350,
      locked:false, locking:false, lockProgress:0,
      hidden: m.hiddenTargets===true, revealed: !m.hiddenTargets,
    }))

  // ── Start mission ────────────────────────────────────────────────────────────
  const startMission = useCallback((m: Mission) => {
    setMission(m)
    setGameState('booting')
    setBootStep(0); setBooting(true); setPovReady(false)
    setBattery(100); batteryRef.current=100
    setElapsed(0);   elapsedRef.current=0
    setScore(0);     scoreRef.current=0
    setLockedCount(0); lockedRef.current=0
    setStreak(0);    streakRef.current=0
    const tgts = genTargets(m)
    setTargets(tgts)
    setScreenTargets([])
    const w = m.difficulty==='ACE'?0.7:m.difficulty==='PILOT'?0.38:0.15
    setWindStr(w); windRef.current=w
    const p = physRef.current
    p.bank=0; p.pitch=0; p.altitude=320; p.speed=0
    p.heading=m.startHeading; p.vspeed=0; p.throttle=0.38
    p.droneX=0; p.droneY=0; p.terrainX=0; p.terrainY=0; p.distFlown=0
    p.agl=120; p.lowAltTimer=0; p.turbX=0; p.turbY=0
    aimingAtRef.current=null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Boot sequence ────────────────────────────────────────────────────────────
  useEffect(()=>{
    if(gameState!=='booting') return
    const delays=[350,800,1250,1700,2100,2500,2900,3300]
    const timers = delays.map((d,i)=>setTimeout(()=>setBootStep(i+1),d))
    const done   = setTimeout(()=>{
      setBooting(false)
      setTimeout(()=>{ setPovReady(true); setGameState('flying') }, 500)
    }, 3900)
    return ()=>{ timers.forEach(clearTimeout); clearTimeout(done) }
  }, [gameState])

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  useEffect(()=>{
    if(gameState!=='flying') return
    const k = physRef.current.keys
    const dn=(e:KeyboardEvent)=>{
      if(e.key==='w'||e.key==='ArrowUp')    { k.w=true;  e.preventDefault() }
      if(e.key==='s'||e.key==='ArrowDown')  { k.s=true;  e.preventDefault() }
      if(e.key==='a'||e.key==='ArrowLeft')  { k.a=true;  e.preventDefault() }
      if(e.key==='d'||e.key==='ArrowRight') { k.d=true;  e.preventDefault() }
      if(e.key==='q') { k.q=true; e.preventDefault() }
      if(e.key==='e') { k.e=true; e.preventDefault() }
      if(e.key==='Shift')  k.shift=true
      if(e.key==='p'||e.key==='P') setPaused(prev=>!prev)
      if(e.key==='Escape') setGameState('menu')
    }
    const up=(e:KeyboardEvent)=>{
      if(e.key==='w'||e.key==='ArrowUp')    k.w=false
      if(e.key==='s'||e.key==='ArrowDown')  k.s=false
      if(e.key==='a'||e.key==='ArrowLeft')  k.a=false
      if(e.key==='d'||e.key==='ArrowRight') k.d=false
      if(e.key==='q')     k.q=false
      if(e.key==='e')     k.e=false
      if(e.key==='Shift') k.shift=false
    }
    window.addEventListener('keydown',dn)
    window.addEventListener('keyup',up)
    return ()=>{ window.removeEventListener('keydown',dn); window.removeEventListener('keyup',up) }
  }, [gameState])

  // ── Mouse ────────────────────────────────────────────────────────────────────
  useEffect(()=>{
    if(gameState!=='flying') return
    const mv=(e:MouseEvent)=>{
      const p=physRef.current
      p.nx=(e.clientX/window.innerWidth-0.5)*2
      p.ny=(e.clientY/window.innerHeight-0.5)*2
      p.crossX=e.clientX-24
      p.crossY=e.clientY-24
    }
    window.addEventListener('mousemove',mv)
    return ()=>window.removeEventListener('mousemove',mv)
  }, [gameState])

  // ── Main RAF game loop ────────────────────────────────────────────────────────
  useEffect(()=>{
    if(gameState!=='flying'||booting) return
    let lastTime = performance.now()
    frameRef.current = 0

    const tick=(now:number)=>{
      const dt=Math.min((now-lastTime)/1000, 0.05)
      lastTime=now
      frameRef.current++

      const p = physRef.current
      if(!p.paused) {
        const k=p.keys, boost=k.shift?1.85:1, wind=windRef.current

        // ── Throttle ──
        if(k.e) p.throttle=Math.min(1, p.throttle+dt*0.55*boost)
        if(k.q) p.throttle=Math.max(0, p.throttle-dt*0.48)

        // ── Control inputs ──
        const tgtBank  = (k.a?-28:k.d?28:0) + p.nx*20
        const tgtPitch = (k.w?-14:k.s?12:0) + p.ny*8
        p.bank  +=(tgtBank -p.bank) *dt*4.2
        p.pitch +=(tgtPitch-p.pitch)*dt*4.2

        // ── Wind turbulence ──
        p.turbX+=(Math.random()-0.5)*wind*dt*55
        p.turbY+=(Math.random()-0.5)*wind*dt*38
        p.turbX*=0.86; p.turbY*=0.86

        const db=p.bank+p.turbX, dp=p.pitch+p.turbY

        // ── Physics ── (drone moves through world based on heading+speed)
        const thrustSpd=(p.throttle*(boost===1.85?32:22))
        p.speed+=(thrustSpd-p.speed)*dt*0.7
        p.vspeed=(p.throttle-0.48)*5.5+dp*-0.2
        p.altitude=Math.max(30, Math.min(2000, p.altitude+p.vspeed*dt*70))
        p.agl=Math.max(10, p.altitude-200+Math.sin(now*0.0007)*8)
        p.heading=(p.heading+db*0.048+360)%360
        p.temp+=Math.random()*0.08-0.04

        // World position (heading-based movement)
        const headRad=p.heading*Math.PI/180
        p.droneX+=Math.sin(headRad)*p.speed*dt
        p.droneY+=Math.cos(headRad)*p.speed*dt

        // Terrain scroll (matches world movement direction)
        p.terrainX+=Math.sin(headRad)*p.speed*dt*3.5
        p.terrainY-=Math.cos(headRad)*p.speed*dt*4.2
        p.distFlown+=p.speed*dt  // always accumulates regardless of heading

        // Crash detection
        if(p.agl<22) {
          p.lowAltTimer+=dt
          if(p.lowAltTimer>3.5) {
            setGameState('gameover')
            return
          }
        } else {
          p.lowAltTimer=Math.max(0, p.lowAltTimer-dt*0.8)
        }

        // ── Direct DOM (60Hz) ──
        if(sceneRef.current)
          sceneRef.current.style.transform=`rotateZ(${-db}deg) rotateX(${dp*0.38}deg)`
        if(worldRef.current)
          drawWorld(worldRef.current, p.terrainX, p.terrainY, p.distFlown, p.speed, dp, now)
        if(crossRef.current)
          crossRef.current.style.transform=`translate(${p.crossX}px,${p.crossY}px)`
        if(droneRef.current) {
          const lateralPx = -db * 1.6
          const vertPx    = p.turbY * 0.65 + dp * 3.5 + (p.speed/36)*4
          droneRef.current.style.transform =
            `translateX(calc(-50% + ${lateralPx}px)) translateY(calc(-50% + ${vertPx}px)) rotate(${db*0.42}deg)`
          droneRef.current.style.filter =
            `drop-shadow(0 0 ${(6+p.throttle*14).toFixed(1)}px rgba(0,245,196,${(0.18+p.throttle*0.22).toFixed(2)}))`
        }
        if(droneSvgRef.current)
          droneSvgRef.current.style.transform=`perspective(500px) rotateX(${(-dp*0.2).toFixed(2)}deg)`

        // ── React state (20Hz) ──
        if(frameRef.current%3===0) {
          setBank(db); setPitch(dp)
          setTelem({ alt:p.altitude, spd:p.speed, hdg:p.heading, agl:p.agl, temp:p.temp, throttle:p.throttle, vspeed:p.vspeed })

          // Motor audio frequency modulation
          if(motorOscsRef.current.length) {
            const base=[181,186,191,196]
            motorOscsRef.current.forEach((o,i)=>{
              o.frequency.value=base[i]+p.throttle*92+Math.abs(p.bank)*0.55
            })
            if(masterGainRef.current)
              masterGainRef.current.gain.value=0.022+p.throttle*0.055
          }

          setCrashWarning(p.agl<22)
        }

        // ── Target projection (every frame, direct state update) ──
        if(frameRef.current%2===0) {
          setTargets(prev=>{
            const crossPxX=p.crossX+24, crossPxY=p.crossY+24
            const W=window.innerWidth, H=window.innerHeight
            const LOCK_DURATION=2400  // ms to hold aim
            let anyBeep = false
            let beepIntensity = 0

            const updated = prev.map(tgt=>{
              if(tgt.locked) return tgt

              // Reveal hidden targets at close range
              const distToTgt=Math.sqrt((tgt.worldX-p.droneX)**2+(tgt.worldY-p.droneY)**2)
              const revealed = tgt.revealed || (tgt.hidden && distToTgt < 380)

              const proj=projectTarget(tgt.worldX,tgt.worldY,p.droneX,p.droneY,p.heading,p.altitude,dp)

              if(!revealed) return { ...tgt, revealed }

              // Apparent size (px) based on distance
              const apparent=Math.max(22, Math.min(88, 1400/proj.dist))
              // Target screen pixel position
              const tgtPxX=(proj.sx/100)*W
              const tgtPxY=(proj.sy/100)*H

              // Crosshair distance to target
              const dxPx=crossPxX-tgtPxX, dyPx=crossPxY-tgtPxY
              const crossDist=Math.sqrt(dxPx*dxPx+dyPx*dyPx)
              const aimZone=apparent/2+8  // px radius to start lock
              const aimed=proj.onScreen && crossDist<aimZone

              // Proximity beep (acquisition zone = 2× aim zone)
              if(proj.onScreen && crossDist<aimZone*2.5 && !tgt.locking) {
                anyBeep=true
                beepIntensity=Math.max(beepIntensity, 1-(crossDist/(aimZone*2.5)))
              }

              // Lock logic
              if(aimed) {
                if(aimingAtRef.current!==tgt.id) {
                  aimingAtRef.current=tgt.id
                  aimStartRef.current=now
                }
                const aimMs=now-aimStartRef.current
                const lockProgress=Math.min(100, (aimMs/LOCK_DURATION)*100)

                if(lockProgress>=100 && !tgt.locked) {
                  // LOCK ACQUIRED
                  const timeBonus=Math.max(0,(mission.timeLimit-elapsedRef.current-10)*3)
                  const streakMult=1+streakRef.current*0.25
                  const pts=Math.round((tgt.points+timeBonus)*streakMult)
                  scoreRef.current+=pts
                  lockedRef.current++
                  streakRef.current++
                  setScore(scoreRef.current)
                  setLockedCount(lockedRef.current)
                  setStreak(streakRef.current)
                  setRipples(r=>[...r,{ id:++rippleIdRef.current, sx:proj.sx, sy:proj.sy }])
                  setTimeout(()=>setRipples(r=>r.slice(1)),1300)
                  speak(`Target 0${tgt.id+1} locked. ${pts} points.`)
                  if(audioOn) { playLockConfirm() }
                  flash('#00d68f')
                  aimingAtRef.current=null
                  if(lockedRef.current>=mission.targets.length) {
                    setTimeout(()=>setGameState('complete'),2000)
                    speak('All targets secured. Mission complete. Outstanding.',true)
                  }
                  return { ...tgt, revealed, locked:true, locking:false, lockProgress:100 }
                }
                return { ...tgt, revealed, locking:true, lockProgress }
              } else {
                // Not aimed — reset if we were aiming at this target
                if(aimingAtRef.current===tgt.id) {
                  aimingAtRef.current=null
                }
                return { ...tgt, revealed, locking:false, lockProgress:Math.max(0, tgt.lockProgress-2) }
              }
            })

            // Beep control
            if(anyBeep && audioOn && frameRef.current%8===0) {
              playProximityBeep(beepIntensity)
            }

            // Sync screen targets for rendering
            const st: ScreenTarget[] = updated.filter(t=>t.revealed||!t.hidden).map(t=>{
              const proj=projectTarget(t.worldX,t.worldY,p.droneX,p.droneY,p.heading,p.altitude,dp)
              return {
                ...t,
                sx:proj.sx, sy:proj.sy,
                dist:proj.dist,
                onScreen:proj.onScreen,
                relBearing:proj.relBearing,
                apparent:Math.max(22,Math.min(88,1400/proj.dist)),
              }
            })
            setScreenTargets(st)

            return updated
          })
        }
      }
      rafRef.current=requestAnimationFrame(tick)
    }
    rafRef.current=requestAnimationFrame(tick)
    return ()=>cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, booting, mission, audioOn, playLockConfirm, playProximityBeep, speak, flash])

  // ── 1-second interval ────────────────────────────────────────────────────────
  useEffect(()=>{
    if(gameState!=='flying'||booting) return
    const t=setInterval(()=>{
      if(physRef.current.paused) return
      elapsedRef.current++
      setElapsed(elapsedRef.current)
      const drain=0.018+physRef.current.throttle*0.02
      batteryRef.current=Math.max(0, batteryRef.current-drain)
      setBattery(batteryRef.current)
      if(batteryRef.current<=0){ setGameState('gameover'); return }
      if(batteryRef.current<20 && batteryRef.current>19.6)
        speak('Warning: battery critical. Return to base immediately.',true)
      setSignal(s=>Math.max(60,Math.min(99,s+(Math.random()*2-1))))
      if(elapsedRef.current>=mission.timeLimit) setGameState('gameover')
    },1000)
    return ()=>clearInterval(t)
  }, [gameState, booting, mission.timeLimit, speak])

  // ── Random warnings ──────────────────────────────────────────────────────────
  useEffect(()=>{
    if(gameState!=='flying'||booting) return
    let idx=0
    const sched=():ReturnType<typeof setTimeout>=>setTimeout(()=>{
      if(!physRef.current.paused){
        const i=idx%WARNINGS.length; idx++
        setActiveWarning(WARNINGS[i])
        speak(WARN_VOICE[i])
        if(audioOn) playWarningBeep()
        setTimeout(()=>setActiveWarning(''), 4500)
      }
      sched()
    }, 14000+Math.random()*18000)
    const t=sched()
    return ()=>clearTimeout(t)
  }, [gameState, booting, audioOn, speak, playWarningBeep])

  // ── Glitch ───────────────────────────────────────────────────────────────────
  useEffect(()=>{
    if(gameState!=='flying'||booting) return
    const sched=():ReturnType<typeof setTimeout>=>setTimeout(()=>{
      setGlitching(true); setTimeout(()=>setGlitching(false),280); sched()
    }, 9000+Math.random()*16000)
    const t=sched(); return ()=>clearTimeout(t)
  }, [gameState, booting])

  // ── Motor audio ──────────────────────────────────────────────────────────────
  useEffect(()=>{
    motorOscsRef.current.forEach(o=>{try{o.stop()}catch{}})
    motorOscsRef.current=[]; audioCtxRef.current?.close().catch(()=>{})
    audioCtxRef.current=null; masterGainRef.current=null
    if(!audioOn||gameState!=='flying') return
    try{
      const ctx=new AudioContext()
      const master=ctx.createGain(); master.gain.value=0.045
      const filt=ctx.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=680
      filt.connect(master); master.connect(ctx.destination)
      const oscs=[181,186,191,196].map(freq=>{
        const osc=ctx.createOscillator(), g=ctx.createGain()
        osc.type='sawtooth'; osc.frequency.value=freq+physRef.current.throttle*80
        g.gain.value=0.25; osc.connect(g); g.connect(filt); osc.start(); return osc
      })
      audioCtxRef.current=ctx; masterGainRef.current=master; motorOscsRef.current=oscs
    }catch{}
    return ()=>{ motorOscsRef.current.forEach(o=>{try{o.stop()}catch{}}); audioCtxRef.current?.close().catch(()=>{}) }
  }, [audioOn, gameState])

  // Boot on voices ready
  useEffect(()=>{
    if(typeof window==='undefined'||!('speechSynthesis' in window)) return
    const load=()=>window.speechSynthesis.getVoices()
    load(); window.speechSynthesis.addEventListener('voiceschanged',load)
    return ()=>window.speechSynthesis.removeEventListener('voiceschanged',load)
  }, [])

  // Body overflow lock
  useEffect(()=>{ document.body.style.overflow='hidden'; return()=>{ document.body.style.overflow='' } }, [])

  // Derived
  const timeLeft    = Math.max(0, mission.timeLimit-elapsed)
  const batteryBars = Math.round(battery/20)
  const sigBars     = Math.round(signal/20)
  const timeWarning = timeLeft<30

  // ── MENU ─────────────────────────────────────────────────────────────────────
  if(gameState==='menu') return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, #000205 0%, #000c18 50%, #000510 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', zIndex:9999 }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(0,245,196,0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(0,245,196,0.03) 1px, transparent 1px)`, backgroundSize:'60px 60px' }}/>
      <div style={{ position:'absolute', top:'28%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:450, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(0,245,196,0.04) 0%, transparent 70%)', pointerEvents:'none' }}/>
      {Array.from({length:28},(_,i)=><div key={i} style={{ position:'absolute', width:i%5===0?2:1, height:i%5===0?2:1, borderRadius:'50%', background:i%7===0?'#00F5C4':'#fff', top:`${(i*19+5)%90}%`, left:`${(i*23+8)%95}%`, opacity:0.06+(i%4)*0.04 }}/>)}
      <div style={{ textAlign:'center', marginBottom:44, position:'relative', zIndex:1 }}>
        <div style={{ ...orb, fontSize:10, color:'rgba(0,245,196,0.45)', letterSpacing:'0.5em', marginBottom:14 }}>AEROVYN SYSTEMS</div>
        <h1 style={{ ...orb, fontSize:54, fontWeight:900, color:'#fff', letterSpacing:'0.08em', lineHeight:1.05, margin:0 }}>
          FLIGHT<br/><span style={{ color:'#00F5C4' }}>SIMULATOR</span>
        </h1>
        <div style={{ ...orb, fontSize:9, color:'rgba(0,245,196,0.32)', letterSpacing:'0.3em', marginTop:12 }}>DRONE OPERATIONS TRAINING — v4.2.1</div>
      </div>
      <div style={{ ...orb, fontSize:8, color:'rgba(0,245,196,0.4)', letterSpacing:'0.45em', marginBottom:18 }}>SELECT MISSION</div>
      <div style={{ display:'flex', gap:18, marginBottom:38, flexWrap:'wrap', justifyContent:'center', padding:'0 24px', maxWidth:860 }}>
        {MISSIONS.map(m=>(
          <button key={m.id} onClick={()=>{ setMission(m); setGameState('briefing') }} style={{ background:'rgba(0,0,0,0.55)', border:`1px solid ${m.color}28`, borderRadius:10, padding:'20px 22px', width:240, textAlign:'left', cursor:'pointer', transition:'all 0.28s ease', position:'relative', overflow:'hidden' }}
            onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor=m.color+'65'; el.style.background='rgba(0,0,0,0.78)'; el.style.boxShadow=`0 0 32px ${m.color}12`; el.style.transform='translateY(-4px)' }}
            onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor=m.color+'28'; el.style.background='rgba(0,0,0,0.55)'; el.style.boxShadow='none'; el.style.transform='translateY(0)' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${m.color}60, transparent)` }}/>
            <div style={{ ...orb, fontSize:7, color:m.color, letterSpacing:'0.3em', marginBottom:7 }}>{m.difficulty} · {m.codename}</div>
            <div style={{ ...orb, fontSize:14, fontWeight:700, color:'#fff', marginBottom:8 }}>{m.title}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.55, marginBottom:12 }}>{m.brief.slice(0,110)}…</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ ...orb, fontSize:7, color:'rgba(255,255,255,0.28)' }}>⏱ {Math.floor(m.timeLimit/60)}:{String(m.timeLimit%60).padStart(2,'0')}</span>
              <span style={{ ...orb, fontSize:8, color:m.color }}>{m.targets.length} targets →</span>
            </div>
          </button>
        ))}
      </div>
      <div style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.22)', letterSpacing:'0.16em', textAlign:'center', lineHeight:2 }}>
        WASD / ↑↓←→  FLY  ·  Q/E  ALTITUDE  ·  SHIFT  BOOST  ·  MOUSE  AIM  ·  P  PAUSE
      </div>
    </div>
  )

  // ── BRIEFING ─────────────────────────────────────────────────────────────────
  if(gameState==='briefing') return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, #000205 0%, #000c18 60%, #000a05 100%)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(0,245,196,0.025) 1px, transparent 1px),linear-gradient(90deg, rgba(0,245,196,0.025) 1px, transparent 1px)`, backgroundSize:'60px 60px' }}/>
      <div style={{ position:'relative', zIndex:1, maxWidth:680, width:'90%' }}>
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ ...orb, fontSize:8, color:'rgba(0,245,196,0.4)', letterSpacing:'0.45em', marginBottom:10 }}>MISSION BRIEFING</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:6 }}>
            <h2 style={{ ...orb, fontSize:28, fontWeight:900, color:'#fff', margin:0 }}>{mission.title}</h2>
            <span style={{ ...orb, fontSize:9, color:mission.color, letterSpacing:'0.3em' }}>{mission.codename}</span>
          </div>
          <div style={{ ...orb, fontSize:8, color:mission.color, letterSpacing:'0.25em' }}>{mission.difficulty} CLASSIFICATION</div>
        </div>

        {/* Brief */}
        <div style={{ background:'rgba(0,0,0,0.5)', border:`1px solid ${mission.color}20`, borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
          <div style={{ ...orb, fontSize:7, color:mission.color, letterSpacing:'0.3em', marginBottom:10 }}>SITUATION</div>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.7, margin:0 }}>{mission.brief}</p>
        </div>

        {/* Objective */}
        <div style={{ background:'rgba(0,0,0,0.4)', border:`1px solid rgba(0,245,196,0.14)`, borderRadius:8, padding:'16px 24px', marginBottom:24 }}>
          <div style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.5)', letterSpacing:'0.3em', marginBottom:8 }}>OBJECTIVE</div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.6, margin:0 }}>{mission.objective}</p>
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap:16, marginBottom:32 }}>
          {[
            { label:'TARGETS',   value: String(mission.targets.length) },
            { label:'TIME LIMIT', value:`${Math.floor(mission.timeLimit/60)}:${String(mission.timeLimit%60).padStart(2,'0')}` },
            { label:'DIFFICULTY', value: mission.difficulty },
            { label:'WIND',       value: mission.difficulty==='ACE'?'HIGH':mission.difficulty==='PILOT'?'MODERATE':'LOW' },
          ].map(({label,value})=>(
            <div key={label} style={{ flex:1, background:'rgba(0,0,0,0.45)', border:'1px solid rgba(0,245,196,0.1)', borderRadius:6, padding:'12px 14px', textAlign:'center' }}>
              <div style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.45)', letterSpacing:'0.22em', marginBottom:5 }}>{label}</div>
              <div style={{ ...orb, fontSize:13, fontWeight:700, color:label==='DIFFICULTY'?mission.color:'#fff' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={()=>startMission(mission)} style={{ ...orb, flex:1, fontSize:11, fontWeight:700, letterSpacing:'0.2em', background:mission.color, color:'#000', border:'none', padding:'16px 32px', borderRadius:8, cursor:'pointer', transition:'box-shadow 0.2s' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.boxShadow=`0 0 32px ${mission.color}60`}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.boxShadow='none'}>
            ▶  LAUNCH MISSION
          </button>
          <button onClick={()=>setGameState('menu')} style={{ ...orb, fontSize:10, letterSpacing:'0.18em', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.4)', padding:'16px 24px', borderRadius:8, cursor:'pointer' }}>
            ← BACK
          </button>
        </div>
      </div>
    </div>
  )

  // ── BOOT ─────────────────────────────────────────────────────────────────────
  if(booting||gameState==='booting') return (
    <div style={{ position:'fixed', inset:0, zIndex:9999 }}>
      <BootScreen step={bootStep} mission={mission}/>
    </div>
  )

  // ── GAME OVER ────────────────────────────────────────────────────────────────
  if(gameState==='gameover') {
    const reason = physRef.current.agl<22&&physRef.current.lowAltTimer>3 ? 'TERRAIN COLLISION'
      : batteryRef.current<=0 ? 'BATTERY DEPLETED' : 'TIME EXPIRED'
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, #0a0000 0%, #1a0005 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
        <div style={{ ...orb, fontSize:9, color:'rgba(255,77,79,0.5)', letterSpacing:'0.5em', marginBottom:14 }}>AEROVYN — MISSION STATUS</div>
        <div style={{ ...orb, fontSize:50, fontWeight:900, color:'#ff4d4f', letterSpacing:'0.15em', marginBottom:10, textShadow:'0 0 60px rgba(255,77,79,0.4)' }}>MISSION FAILED</div>
        <div style={{ ...orb, fontSize:10, color:'rgba(255,77,79,0.55)', letterSpacing:'0.28em', marginBottom:40 }}>
          {reason} · LOCKED: {lockedCount}/{mission.targets.length}
        </div>
        {lockedCount>0&&(
          <div style={{ ...orb, fontSize:26, color:'#fff', marginBottom:6 }}>
            SCORE: <span style={{ color:'#ffb800' }}>{scoreRef.current.toLocaleString()}</span>
          </div>
        )}
        <div style={{ display:'flex', gap:14, marginTop:40 }}>
          <button onClick={()=>startMission(mission)} style={{ ...orb, fontSize:10, letterSpacing:'0.2em', background:'rgba(255,77,79,0.1)', border:'1px solid rgba(255,77,79,0.38)', color:'#ff4d4f', padding:'14px 32px', borderRadius:8, cursor:'pointer' }}>
            RETRY MISSION
          </button>
          <button onClick={()=>setGameState('menu')} style={{ ...orb, fontSize:10, letterSpacing:'0.2em', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.4)', padding:'14px 24px', borderRadius:8, cursor:'pointer' }}>
            MAIN MENU
          </button>
        </div>
      </div>
    )
  }

  // ── COMPLETE ──────────────────────────────────────────────────────────────────
  if(gameState==='complete') {
    const timeBonus    = Math.max(0, timeLeft*15)
    const batteryBonus = Math.round(batteryRef.current*5)
    const streakBonus  = streakRef.current>=mission.targets.length ? 500 : 0
    const total        = scoreRef.current+timeBonus+batteryBonus+streakBonus
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, #000a05 0%, #001a10 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:9999, overflow:'hidden' }}>
        {/* Success radial glow */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(0,245,196,0.07) 0%, transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ ...orb, fontSize:9, color:'rgba(0,245,196,0.45)', letterSpacing:'0.5em', marginBottom:14 }}>AEROVYN — MISSION STATUS</div>
        <div style={{ ...orb, fontSize:48, fontWeight:900, color:'#00F5C4', letterSpacing:'0.15em', marginBottom:8, textShadow:'0 0 60px rgba(0,245,196,0.5)' }}>MISSION COMPLETE</div>
        <div style={{ ...orb, fontSize:10, color:'rgba(0,245,196,0.45)', letterSpacing:'0.3em', marginBottom:44 }}>{mission.codename} · {mission.difficulty}</div>
        <div style={{ display:'flex', gap:28, marginBottom:28, flexWrap:'wrap', justifyContent:'center' }}>
          {[
            { label:'TARGET SCORE',   value:scoreRef.current,  col:'#fff' },
            { label:'TIME BONUS',     value:timeBonus,          col:'#00F5C4' },
            { label:'BATTERY BONUS',  value:batteryBonus,       col:'#00F5C4' },
            ...(streakBonus>0?[{ label:'PERFECT STREAK', value:streakBonus, col:'#ffb800' }]:[]),
          ].map(({label,value,col})=>(
            <div key={label} style={{ textAlign:'center', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(0,245,196,0.12)', borderRadius:8, padding:'16px 22px', minWidth:130 }}>
              <div style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.45)', letterSpacing:'0.22em', marginBottom:5 }}>{label}</div>
              <div style={{ ...orb, fontSize:22, color:col }}>{value.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div style={{ width:340, height:1, background:'rgba(0,245,196,0.14)', marginBottom:20 }}/>
        <div style={{ ...orb, fontSize:36, color:'#00F5C4', marginBottom:36, textShadow:'0 0 30px rgba(0,245,196,0.4)' }}>TOTAL: {total.toLocaleString()}</div>
        <div style={{ display:'flex', gap:14 }}>
          <button onClick={()=>startMission(mission)} style={{ ...orb, fontSize:10, letterSpacing:'0.2em', background:'rgba(0,245,196,0.1)', border:'1px solid rgba(0,245,196,0.38)', color:'#00F5C4', padding:'14px 32px', borderRadius:8, cursor:'pointer' }}>
            PLAY AGAIN
          </button>
          <button onClick={()=>setGameState('menu')} style={{ ...orb, fontSize:10, letterSpacing:'0.2em', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.4)', padding:'14px 24px', borderRadius:8, cursor:'pointer' }}>
            MAIN MENU
          </button>
        </div>
      </div>
    )
  }

  // ── FLYING ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'#000205', overflow:'hidden', cursor:'none', zIndex:9999 }}>

      {/* ── Screen flash (lock / danger) ── */}
      {lockFlash&&<div ref={flashRef} style={{ position:'absolute', inset:0, background:lockFlash, opacity:0.18, zIndex:50, pointerEvents:'none', animation:'boot-blink 0.28s ease forwards' }}/>}

      {/* ── Crash danger vignette ── */}
      {crashWarning&&<div style={{ position:'absolute', inset:0, border:'3px solid rgba(255,77,79,0.7)', boxShadow:'inset 0 0 60px rgba(255,77,79,0.25)', zIndex:40, pointerEvents:'none', animation:'boot-blink 0.6s ease-in-out infinite' }}/>}

      {/* ── POV Scene ── */}
      <div ref={sceneRef} style={{ position:'absolute', inset:'-8%', animation:glitching?'glitch-shift 0.28s ease forwards':undefined, opacity:povReady?1:0, transition:'opacity 0.9s ease' }}>
        <canvas ref={worldRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }}/>
      </div>

      {/* ── Drone body (3rd-person chase view) ── */}
      {povReady&&(
        <div ref={droneRef} style={{
          position:'absolute', left:'50%', top:'64%',
          transform:'translateX(-50%) translateY(-50%)',
          pointerEvents:'none', zIndex:10,
          opacity: povReady ? 1 : 0,
          transition:'opacity 0.6s ease',
        }}>
          {/* Ground shadow */}
          <div style={{
            position:'absolute', left:'50%', bottom:-14,
            transform:'translateX(-50%)',
            width:220, height:18, borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(0,245,196,0.12) 0%, transparent 70%)',
            filter:'blur(4px)',
          }}/>
          <svg ref={droneSvgRef} width="300" height="190" viewBox="0 0 300 190" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ display:'block' }}>

            {/* ── Arms (rear pair drawn first, below front pair) ── */}
            {/* Rear-left arm */}
            <line x1="143" y1="104" x2="56" y2="162" stroke="rgba(0,245,196,0.55)" strokeWidth="5.5" strokeLinecap="round"/>
            {/* Rear-right arm */}
            <line x1="157" y1="104" x2="244" y2="162" stroke="rgba(0,245,196,0.55)" strokeWidth="5.5" strokeLinecap="round"/>
            {/* Front-left arm */}
            <line x1="143" y1="96" x2="72" y2="44" stroke="rgba(0,245,196,0.38)" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Front-right arm */}
            <line x1="157" y1="96" x2="228" y2="44" stroke="rgba(0,245,196,0.38)" strokeWidth="3.5" strokeLinecap="round"/>

            {/* ── Rear rotors (larger, closer to viewer) ── */}
            {/* Rear-left */}
            <g transform="translate(56,162)">
              <ellipse cx="0" cy="0" rx="50" ry="14" fill="rgba(0,245,196,0.07)" stroke="rgba(0,245,196,0.28)" strokeWidth="1.5"/>
              <g className="rotor-ccw" style={{ animationDuration:`${Math.max(0.05,0.38-telem.throttle*0.33)}s` }}>
                <rect x="-47" y="-2.5" width="94" height="5" rx="2.5" fill="rgba(180,225,205,0.65)"/>
                <rect x="-2.5" y="-13" width="5" height="26" rx="2.5" fill="rgba(180,225,205,0.5)"/>
              </g>
              <circle cx="0" cy="0" r="5.5" fill="rgba(8,20,14,1)" stroke="rgba(0,245,196,0.65)" strokeWidth="1.5"/>
              {/* Red navigation LED */}
              <ellipse cx="-48" cy="0" rx="3.5" ry="2.5" fill="#ff4d4f" opacity="0.9"/>
              <ellipse cx="-48" cy="0" rx="6" ry="4" fill="rgba(255,77,79,0.25)"/>
            </g>
            {/* Rear-right */}
            <g transform="translate(244,162)">
              <ellipse cx="0" cy="0" rx="50" ry="14" fill="rgba(0,245,196,0.07)" stroke="rgba(0,245,196,0.28)" strokeWidth="1.5"/>
              <g className="rotor-cw" style={{ animationDuration:`${Math.max(0.05,0.38-telem.throttle*0.33)}s` }}>
                <rect x="-47" y="-2.5" width="94" height="5" rx="2.5" fill="rgba(180,225,205,0.65)"/>
                <rect x="-2.5" y="-13" width="5" height="26" rx="2.5" fill="rgba(180,225,205,0.5)"/>
              </g>
              <circle cx="0" cy="0" r="5.5" fill="rgba(8,20,14,1)" stroke="rgba(0,245,196,0.65)" strokeWidth="1.5"/>
              {/* Green navigation LED */}
              <ellipse cx="48" cy="0" rx="3.5" ry="2.5" fill="#00d68f" opacity="0.9"/>
              <ellipse cx="48" cy="0" rx="6" ry="4" fill="rgba(0,214,143,0.25)"/>
            </g>

            {/* ── Front rotors (smaller, receding perspective) ── */}
            {/* Front-left */}
            <g transform="translate(72,44)">
              <ellipse cx="0" cy="0" rx="37" ry="10" fill="rgba(0,245,196,0.06)" stroke="rgba(0,245,196,0.2)" strokeWidth="1"/>
              <g className="rotor-cw" style={{ animationDuration:`${Math.max(0.05,0.38-telem.throttle*0.33)}s` }}>
                <rect x="-34" y="-2" width="68" height="4" rx="2" fill="rgba(180,225,205,0.55)"/>
                <rect x="-2" y="-9" width="4" height="18" rx="2" fill="rgba(180,225,205,0.45)"/>
              </g>
              <circle cx="0" cy="0" r="4" fill="rgba(8,20,14,1)" stroke="rgba(0,245,196,0.45)" strokeWidth="1"/>
            </g>
            {/* Front-right */}
            <g transform="translate(228,44)">
              <ellipse cx="0" cy="0" rx="37" ry="10" fill="rgba(0,245,196,0.06)" stroke="rgba(0,245,196,0.2)" strokeWidth="1"/>
              <g className="rotor-ccw" style={{ animationDuration:`${Math.max(0.05,0.38-telem.throttle*0.33)}s` }}>
                <rect x="-34" y="-2" width="68" height="4" rx="2" fill="rgba(180,225,205,0.55)"/>
                <rect x="-2" y="-9" width="4" height="18" rx="2" fill="rgba(180,225,205,0.45)"/>
              </g>
              <circle cx="0" cy="0" r="4" fill="rgba(8,20,14,1)" stroke="rgba(0,245,196,0.45)" strokeWidth="1"/>
            </g>

            {/* ── Central body ── */}
            {/* Outer shell */}
            <polygon points="150,74 169,81 177,100 169,119 150,126 131,119 123,100 131,81"
              fill="rgba(6,18,12,0.96)" stroke="rgba(0,245,196,0.6)" strokeWidth="2"/>
            {/* Inner panel */}
            <polygon points="150,82 164,87 169,100 164,113 150,118 136,113 131,100 136,87"
              fill="rgba(0,245,196,0.04)" stroke="rgba(0,245,196,0.22)" strokeWidth="1"/>
            {/* Cross detail lines */}
            <line x1="150" y1="76" x2="150" y2="124" stroke="rgba(0,245,196,0.1)" strokeWidth="1"/>
            <line x1="125" y1="100" x2="175" y2="100" stroke="rgba(0,245,196,0.1)" strokeWidth="1"/>
            {/* Center core */}
            <circle cx="150" cy="100" r="8" fill="rgba(0,0,0,0.9)" stroke="rgba(0,245,196,0.5)" strokeWidth="1.5"/>
            <circle cx="150" cy="100" r="3.5" fill="rgba(0,245,196,0.8)"/>
            {/* Top status LED strip */}
            <rect x="140" y="80" width="20" height="3" rx="1.5" fill="rgba(0,245,196,0.15)" stroke="rgba(0,245,196,0.3)" strokeWidth="0.5"/>
            <rect x="143" y="80" width={`${7*telem.throttle+1}`} height="3" rx="1.5" fill="rgba(0,245,196,0.7)"/>

            {/* ── Camera gimbal ── */}
            <line x1="150" y1="126" x2="150" y2="139" stroke="rgba(0,245,196,0.22)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="150" cy="145" r="10" fill="rgba(4,12,8,0.95)" stroke="rgba(0,245,196,0.38)" strokeWidth="1.5"/>
            <circle cx="150" cy="145" r="5.5" fill="rgba(0,0,0,0.95)" stroke="rgba(0,245,196,0.55)" strokeWidth="1"/>
            <circle cx="150" cy="145" r="2" fill="rgba(0,180,245,0.85)"/>

            {/* ── Landing skids ── */}
            <line x1="134" y1="122" x2="125" y2="145" stroke="rgba(0,245,196,0.18)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="166" y1="122" x2="175" y2="145" stroke="rgba(0,245,196,0.18)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="118" y1="145" x2="132" y2="145" stroke="rgba(0,245,196,0.25)" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="168" y1="145" x2="182" y2="145" stroke="rgba(0,245,196,0.25)" strokeWidth="2.5" strokeLinecap="round"/>

            {/* ── Rotor tip glow halos ── */}
            <ellipse cx="56" cy="162" rx="54" ry="16" fill={`rgba(0,245,196,${telem.throttle*0.06})`} style={{filter:'blur(4px)'}}/>
            <ellipse cx="244" cy="162" rx="54" ry="16" fill={`rgba(0,245,196,${telem.throttle*0.06})`} style={{filter:'blur(4px)'}}/>
            <ellipse cx="72" cy="44" rx="40" ry="12" fill={`rgba(0,245,196,${telem.throttle*0.04})`} style={{filter:'blur(3px)'}}/>
            <ellipse cx="228" cy="44" rx="40" ry="12" fill={`rgba(0,245,196,${telem.throttle*0.04})`} style={{filter:'blur(3px)'}}/>
          </svg>
        </div>
      )}

      {/* ── World-projected targets (HUD layer, no rotation) ── */}
      {povReady && screenTargets.map(tgt=>{
        if(!tgt.onScreen||tgt.locked) return null
        const sz  = tgt.apparent
        const col = tgt.locking ? '#ffb800' : 'rgba(0,245,196,0.75)'
        const pct = `${2*Math.PI*(sz/2)}px`
        const off = `${2*Math.PI*(sz/2)*(1-tgt.lockProgress/100)}px`
        // Subtle tilt with bank for parallax feel
        const tiltDeg = bank * 0.28
        return (
          <div key={tgt.id} style={{ position:'absolute', left:`${tgt.sx}%`, top:`${tgt.sy}%`, transform:`translate(-50%,-50%) rotate(${tiltDeg}deg)`, pointerEvents:'none' }}>
            {/* Lock progress ring */}
            {tgt.lockProgress>0&&(
              <svg width={sz+16} height={sz+16} style={{ position:'absolute', top:-(sz+16)/2+sz/2, left:-(sz+16)/2+sz/2, overflow:'visible' }}>
                <circle cx={(sz+16)/2} cy={(sz+16)/2} r={sz/2+4} fill="none" stroke="rgba(255,184,0,0.2)" strokeWidth="2.5"/>
                <circle cx={(sz+16)/2} cy={(sz+16)/2} r={sz/2+4} fill="none" stroke="#ffb800" strokeWidth="2.5"
                  strokeDasharray={pct} strokeDashoffset={off} strokeLinecap="round"
                  style={{ transform:`rotate(-90deg)`, transformOrigin:`${(sz+16)/2}px ${(sz+16)/2}px`, transition:'stroke-dashoffset 0.15s linear' }}/>
              </svg>
            )}
            {/* Target bracket */}
            <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ display:'block' }}>
              {/* Corner brackets only */}
              {[['tl','tr','bl','br'] as const].flat().map(c=>{
                const bsize=sz*0.28, stroke=sz*0.04
                const x1=c.includes('r')?sz-bsize:0
                const y1=c.includes('b')?sz-bsize:0
                const paths: Record<string,string> = {
                  tl:`M ${x1+bsize} ${y1} L ${x1} ${y1} L ${x1} ${y1+bsize}`,
                  tr:`M ${x1} ${y1} L ${x1+bsize} ${y1} L ${x1+bsize} ${y1+bsize}`,
                  bl:`M ${x1+bsize} ${y1+bsize} L ${x1} ${y1+bsize} L ${x1} ${y1}`,
                  br:`M ${x1} ${y1+bsize} L ${x1+bsize} ${y1+bsize} L ${x1+bsize} ${y1}`,
                }
                return <path key={c} d={paths[c]} stroke={col} strokeWidth={stroke} fill="none" strokeLinecap="square"/>
              })}
              {/* Centre dot */}
              <circle cx={sz/2} cy={sz/2} r={sz*0.05} fill={col} opacity="0.8"/>
            </svg>
            {/* Label */}
            <div style={{ ...orb, position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', marginTop:4, fontSize:8, whiteSpace:'nowrap', color:tgt.locking?'#ffb800':'rgba(0,245,196,0.72)', letterSpacing:'0.08em' }}>
              {tgt.locking?`ACQUIRING ${Math.round(tgt.lockProgress)}%`:`${tgt.label}  ${Math.round(tgt.dist)}m`}
            </div>
            {/* Acquisition glow */}
            {tgt.locking&&<div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:sz*2, height:sz*2, borderRadius:'50%', background:`radial-gradient(ellipse, rgba(255,184,0,0.12) 0%, transparent 70%)`, pointerEvents:'none' }}/>}
          </div>
        )
      })}

      {/* ── Locked confirmation (ripples) ── */}
      {povReady && ripples.map(r=>(
        <div key={r.id} style={{ position:'absolute', left:`${r.sx}%`, top:`${r.sy}%`, transform:'translate(-50%,-50%)', width:60, height:60, borderRadius:'50%', border:'2px solid #00d68f', animation:'lock-ripple 1.1s ease-out forwards', pointerEvents:'none' }}/>
      ))}

      {/* ── Off-screen target arrows ── */}
      {povReady && screenTargets.filter(t=>!t.locked&&!t.onScreen&&(t.revealed||!t.hidden)).map(t=>(
        <OffScreenArrow key={t.id} relBearing={t.relBearing} dist={t.dist} label={t.label} color={mission.color}/>
      ))}

      {/* ── HUD ── */}
      {povReady&&(
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:povReady?1:0, transition:'opacity 0.6s ease 0.4s' }}>

          {/* Heading strip with target bearing dots */}
          <HeadingStrip hdg={telem.hdg} targets={screenTargets}/>

          {/* Corner brackets */}
          {(['tl','tr','bl','br'] as const).map(c=>{
            const s=36, pm={tl:{top:16,left:16},tr:{top:16,right:16},bl:{bottom:36,left:16},br:{bottom:36,right:16}}
            const dm: Record<string,string>={ tl:`M ${s} 0 L 0 0 L 0 ${s}`, tr:`M 0 0 L ${s} 0 L ${s} ${s}`, bl:`M ${s} ${s} L 0 ${s} L 0 0`, br:`M 0 ${s} L ${s} ${s} L ${s} 0` }
            return <div key={c} style={{ position:'absolute', ...pm[c] }}><svg width={s} height={s} fill="none"><path d={dm[c]} stroke="rgba(0,245,196,0.28)" strokeWidth="2" strokeLinecap="square"/></svg></div>
          })}

          {/* Left instruments */}
          <div style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-55%)', display:'flex', alignItems:'center', gap:10 }}>
            <ArtificialHorizon bank={bank} pitch={pitch}/>
            <ThrottleGauge value={telem.throttle}/>
            <Tape value={telem.spd} label="SPD" unit="m/s" min={0} max={36}/>
          </div>
          <div style={{ position:'absolute', left:18, top:'50%', transform:'translateY(88px)', width:130, textAlign:'center' }}>
            <span style={{ ...orb, fontSize:9, color:'rgba(0,245,196,0.5)', letterSpacing:'0.12em' }}>G  <span style={{ color:'#00F5C4' }}>{(1+Math.abs(bank)*0.013).toFixed(2)}</span></span>
          </div>

          {/* Right instruments */}
          <div style={{ position:'absolute', right:160, top:'50%', transform:'translateY(-60%)', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:14 }}>
            <Tape value={telem.alt} label="ALT" unit="m" min={50} max={800} warn={telem.agl<30}/>
            <div style={{ ...orb, fontSize:8, textAlign:'center', letterSpacing:'0.1em', color:telem.agl<22?'#ff4d4f':telem.agl<50?'#ffb800':'rgba(0,245,196,0.6)' }}>
              AGL<br/><span style={{ fontSize:13, color:telem.agl<22?'#ff4d4f':telem.agl<45?'#ffb800':'#00F5C4' }}>{Math.round(telem.agl)}m</span>
            </div>
            <div style={{ ...orb, fontSize:9, textAlign:'right', letterSpacing:'0.1em', color:telem.vspeed>0?'#00F5C4':'#ff6b6b' }}>
              V/S {telem.vspeed>0?'+':''}{telem.vspeed.toFixed(1)}<br/><span style={{ fontSize:7, color:'rgba(0,245,196,0.4)' }}>m/s</span>
            </div>
          </div>

          {/* Wind gauge */}
          {windStr>0.1&&(
            <div style={{ position:'absolute', right:116, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <span style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.38)', letterSpacing:'0.14em' }}>WIND</span>
              <div style={{ width:10, height:60, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(0,245,196,0.14)', borderRadius:2, overflow:'hidden', position:'relative' }}>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:`${windStr*100}%`, background:windStr>0.65?'#ff4d4f':windStr>0.35?'#ffb800':'#00F5C4' }}/>
              </div>
              <span style={{ ...orb, fontSize:7, color:windStr>0.5?'#ff4d4f':'rgba(0,245,196,0.4)' }}>{Math.round(windStr*30)}kn</span>
            </div>
          )}

          {/* Radar / minimap */}
          <div style={{ position:'absolute', left:18, bottom:40 }}>
            <RadarMap targets={screenTargets} droneX={telem.throttle?physRef.current.droneX:0} droneY={physRef.current.droneY} heading={telem.hdg}/>
          </div>

          {/* Mission panel */}
          <div style={{ position:'absolute', right:18, bottom:40, background:'rgba(0,3,8,0.82)', border:'1px solid rgba(0,245,196,0.13)', borderRadius:6, padding:'10px 14px', minWidth:195 }}>
            <div style={{ ...orb, fontSize:7, color:mission.color, letterSpacing:'0.25em', marginBottom:7 }}>{mission.codename}</div>
            <div style={{ ...orb, fontSize:9, color:'rgba(255,255,255,0.65)', marginBottom:9 }}>
              TARGETS: <span style={{ color:'#00F5C4', fontWeight:700 }}>{lockedCount}</span>/{mission.targets.length}
            </div>
            {screenTargets.map((tgt,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                <div style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.45)', width:38 }}>{tgt.label}</div>
                <div style={{ flex:1, height:3, background:'rgba(0,245,196,0.09)', borderRadius:2 }}>
                  <div style={{ height:'100%', borderRadius:2, width:tgt.locked?'100%':tgt.locking?`${tgt.lockProgress}%`:'0%', background:tgt.locked?'#00d68f':'#ffb800', transition:'width 0.15s linear' }}/>
                </div>
                <div style={{ fontSize:9, color:tgt.locked?'#00d68f':tgt.locking?'#ffb800':'rgba(0,245,196,0.3)' }}>{tgt.locked?'✓':tgt.locking?'◉':'○'}</div>
              </div>
            ))}
            {streak>1&&(
              <div style={{ ...orb, fontSize:7, color:'#ffb800', letterSpacing:'0.18em', marginTop:8 }}>🔥 STREAK ×{(1+streak*0.25).toFixed(2)}</div>
            )}
            <div style={{ ...orb, fontSize:9, color:'#fff', marginTop:8, textAlign:'right' }}>
              <span style={{ color:'rgba(0,245,196,0.4)' }}>SCORE </span>
              <span style={{ color:'#ffb800', fontWeight:700 }}>{scoreRef.current.toLocaleString()}</span>
            </div>
          </div>

          {/* Timer */}
          <div style={{ position:'absolute', top:6, left:'50%', transform:'translateX(-50%)', ...orb, fontSize:8, letterSpacing:'0.22em', color:timeWarning?'#ff4d4f':'rgba(0,245,196,0.55)', animation:timeWarning?'boot-blink 0.85s ease-in-out infinite':undefined }}>
            TIME {fmtTime(timeLeft)}
          </div>

          {/* Battery & signal */}
          <div style={{ position:'absolute', top:68, right:70, textAlign:'right', pointerEvents:'auto' }}>
            <div style={{ ...orb, fontSize:9, letterSpacing:'0.12em', marginBottom:5, color:battery<20?'#ff4d4f':'rgba(0,245,196,0.65)', animation:battery<20?'boot-blink 0.8s step-end infinite':undefined }}>
              {'◼'.repeat(batteryBars)}{'◻'.repeat(5-batteryBars)}  {battery.toFixed(1)}%  BATT
            </div>
            <div style={{ ...orb, fontSize:9, color:'rgba(0,245,196,0.6)', letterSpacing:'0.12em' }}>
              {'▌'.repeat(sigBars)}{'░'.repeat(5-sigBars)}  {Math.round(signal)}%  SIG
            </div>
          </div>

          {/* Warning banner */}
          {activeWarning&&(
            <div style={{ position:'absolute', top:68, left:'50%', transform:'translateX(-50%)', ...orb, fontSize:11, color:'#ffb800', letterSpacing:'0.1em', padding:'5px 16px', border:'1px solid rgba(255,184,0,0.32)', background:'rgba(255,184,0,0.055)', borderRadius:2, animation:'warning-in 0.3s ease', whiteSpace:'nowrap' }}>
              {activeWarning}
            </div>
          )}

          {/* Crash warning */}
          {crashWarning&&(
            <div style={{ position:'absolute', top:68, left:'50%', transform:'translateX(-50%)', ...orb, fontSize:12, color:'#ff4d4f', letterSpacing:'0.12em', padding:'5px 18px', border:'1px solid rgba(255,77,79,0.5)', background:'rgba(255,77,79,0.08)', borderRadius:2, animation:'boot-blink 0.4s step-end infinite', whiteSpace:'nowrap' }}>
              ⚠  TERRAIN COLLISION IMMINENT — PULL UP
            </div>
          )}

          {/* Voice readout */}
          {activeVoice&&(
            <div style={{ position:'absolute', top:crashWarning?106:68, left:'50%', transform:'translateX(-50%)', ...orb, fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'0.07em', padding:'4px 14px', border:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.5)', borderRadius:2, whiteSpace:'nowrap', maxWidth:'55vw', overflow:'hidden', textOverflow:'ellipsis', marginTop: crashWarning?4:0 }}>
              🎙 {activeVoice}
            </div>
          )}

          {/* Crosshair */}
          <div ref={crossRef} style={{ position:'absolute', top:0, left:0, width:48, height:48, pointerEvents:'none' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="16" stroke="rgba(0,245,196,0.45)" strokeWidth="1" strokeDasharray="4 3" style={{ animation:'ring-rotate 4s linear infinite', transformOrigin:'24px 24px' }}/>
              <line x1="4"  y1="24" x2="14" y2="24" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2"/>
              <line x1="34" y1="24" x2="44" y2="24" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2"/>
              <line x1="24" y1="4"  x2="24" y2="14" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2"/>
              <line x1="24" y1="34" x2="24" y2="44" stroke="rgba(0,245,196,0.85)" strokeWidth="1.2"/>
              <circle cx="24" cy="24" r="2.5" fill="#00F5C4"/>
            </svg>
          </div>

          {/* Bottom status bar */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:28, background:'rgba(0,3,8,0.92)', borderTop:'1px solid rgba(0,245,196,0.09)', display:'flex', alignItems:'center', paddingInline:14, overflow:'hidden' }}>
            {[`⌂ DRONE-01`,`MISSION: ${mission.codename}`,`TIME: ${fmtTime(elapsed)}`,`ALT: ${Math.round(telem.alt)}m`,`SPD: ${telem.spd.toFixed(1)} m/s`,`HDG: ${Math.round(telem.hdg)}°`,`AGL: ${Math.round(telem.agl)}m`,`TEMP: ${telem.temp.toFixed(1)}°C`,`GPS: LOCKED`]
              .map((item,i)=><span key={i} style={{ ...orb, fontSize:8, letterSpacing:'0.09em', whiteSpace:'nowrap', color:i===0?'#00F5C4':'rgba(0,245,196,0.48)', padding:'0 12px', borderLeft:i>0?'1px solid rgba(0,245,196,0.07)':undefined }}>{item}</span>)}
          </div>

          {/* Controls */}
          <div style={{ position:'absolute', bottom:38, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, pointerEvents:'auto' }}>
            {[
              { label:audioOn?'🔊 AUDIO':'🔇 AUDIO', onClick:()=>setAudioOn(a=>!a), active:audioOn, danger:false },
              { label:paused?'▶ RESUME [P]':'⏸ PAUSE [P]', onClick:()=>setPaused(p=>!p), active:paused, danger:false },
              { label:'✕ ABORT', onClick:()=>setGameState('menu'), active:false, danger:true },
            ].map(btn=>(
              <button key={btn.label} onClick={btn.onClick} style={{ ...orb, fontSize:8, cursor:'pointer', letterSpacing:'0.12em', color:btn.danger?'rgba(255,77,79,0.55)':btn.active?'#00F5C4':'rgba(0,245,196,0.38)', background:'rgba(0,0,0,0.62)', border:`1px solid ${btn.danger?'rgba(255,77,79,0.18)':'rgba(0,245,196,0.16)'}`, padding:'4px 11px', borderRadius:2 }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Pause overlay ── */}
      {showPause&&(
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'auto', zIndex:20 }}>
          <div style={{ ...orb, fontSize:42, fontWeight:900, color:'#00F5C4', letterSpacing:'0.3em', marginBottom:14 }}>PAUSED</div>
          <div style={{ ...orb, fontSize:9, color:'rgba(0,245,196,0.38)', letterSpacing:'0.25em', marginBottom:32 }}>PRESS P TO RESUME</div>
          <div style={{ background:'rgba(0,5,12,0.94)', border:'1px solid rgba(0,245,196,0.18)', borderRadius:8, padding:'24px 36px', width:360 }}>
            <div style={{ ...orb, fontSize:8, color:'#00F5C4', letterSpacing:'0.3em', marginBottom:18, textAlign:'center' }}>FLIGHT CONTROLS</div>
            {[['W / ↑','Pitch nose forward (speed up)'],['S / ↓','Pitch nose back (slow down)'],['A / ←','Bank left (turn left)'],['D / →','Bank right (turn right)'],['Q','Reduce throttle (descend)'],['E','Increase throttle (climb)'],['SHIFT','Boost speed (2×)'],['MOUSE','Aim — hold crosshair on target'],['P','Pause / Resume'],['ESC','Exit to menu']].map(([k,a])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', gap:24, marginBottom:8 }}>
                <span style={{ ...orb, fontSize:8, color:'#00F5C4', minWidth:64 }}>{k}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.42)' }}>{a}</span>
              </div>
            ))}
            <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(0,245,196,0.04)', border:'1px solid rgba(0,245,196,0.12)', borderRadius:4 }}>
              <div style={{ ...orb, fontSize:7, color:'rgba(0,245,196,0.5)', letterSpacing:'0.2em', marginBottom:4 }}>HOW TO LOCK A TARGET</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>Fly close to a target until it appears on screen, then move your mouse so the crosshair sits inside the target bracket. Hold it steady for 2.5 seconds.</div>
            </div>
          </div>
        </div>
      )}

      {/* Scanlines */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:4, backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.028) 3px, rgba(0,0,0,0.028) 4px)'}}/>

      {/* Exit */}
      <button style={{ position:'absolute', top:14, right:18, zIndex:100, cursor:'pointer', ...orb, fontSize:9, color:'rgba(0,245,196,0.65)', letterSpacing:'0.18em', background:'rgba(0,3,8,0.9)', border:'1px solid rgba(0,245,196,0.2)', padding:'6px 14px', borderRadius:2, transition:'all 0.2s ease' }}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#00F5C4';(e.currentTarget as HTMLElement).style.boxShadow='0 0 12px rgba(0,245,196,0.18)'}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(0,245,196,0.65)';(e.currentTarget as HTMLElement).style.boxShadow='none'}}
        onClick={()=>setGameState('menu')}>
        ✕ EXIT SIMULATION
      </button>
    </div>
  )
}
