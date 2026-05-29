import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flight Simulator | AEROVYN',
  description: 'Interactive drone flight simulator — multi-mission gameplay, real-time HUD, and immersive audio.',
}

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
