import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? "Africa's Skies. Africa's Data. Africa's Future."
  const sub = searchParams.get('sub') ?? 'Intelligent drone technology across Africa — precision, speed, and sovereignty.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '64px 72px',
          background: '#0A0B0D',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,245,196,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,196,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow blob */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,196,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Corner marks */}
        {[
          { top: 24, left: 24 },
          { top: 24, right: 24 },
          { bottom: 24, left: 24 },
          { bottom: 24, right: 24 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 20,
              height: 20,
              borderTop: i < 2 ? '1px solid rgba(0,245,196,0.35)' : undefined,
              borderBottom: i >= 2 ? '1px solid rgba(0,245,196,0.35)' : undefined,
              borderLeft: i % 2 === 0 ? '1px solid rgba(0,245,196,0.35)' : undefined,
              borderRight: i % 2 === 1 ? '1px solid rgba(0,245,196,0.35)' : undefined,
              ...pos,
            }}
          />
        ))}

        {/* Brand mark */}
        <div style={{ display: 'flex', marginBottom: 32 }}>
          <span style={{ fontSize: 18, letterSpacing: '0.25em', color: '#00F5C4', fontWeight: 700 }}>
            AERO
          </span>
          <span style={{ fontSize: 18, letterSpacing: '0.25em', color: '#FFFFFF', fontWeight: 700 }}>
            VYN
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: 860,
            marginBottom: 20,
          }}
        >
          {title}
        </div>

        {/* Sub */}
        <div style={{ fontSize: 22, color: '#6B7A8D', fontWeight: 400, maxWidth: 680 }}>
          {sub}
        </div>

        {/* Bottom brand bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #00F5C4, #00B8A9)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
