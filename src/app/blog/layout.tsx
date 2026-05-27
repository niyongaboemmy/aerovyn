import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights, guides, and news from the AEROVYN team — covering drone operations, pilot training, and the African UAV industry.',
  openGraph: {
    title: 'AEROVYN Blog',
    description:
      'Drone operations insights, pilot training guides, and UAV industry news from the AEROVYN team.',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
