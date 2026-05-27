import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects Portfolio',
  description:
    "Browse AEROVYN's aerial project portfolio: infrastructure mapping, agricultural surveys, urban cinematography, and industrial inspections.",
  openGraph: {
    title: 'Projects Portfolio | AEROVYN',
    description:
      'Aerial mapping, agricultural surveys, cinematography, and inspection projects across Africa.',
    type: 'website',
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
