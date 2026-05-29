import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description:
    'AEROVYN delivers drone intelligence across nine critical sectors driving Africa\'s development — from energy and agriculture to healthcare, mining, and government.',
  openGraph: {
    title: 'Industries — AEROVYN',
    description:
      'Aerial intelligence for Africa\'s most critical industries: energy, agriculture, construction, healthcare, government, mining, security, education, and events.',
    type: 'website',
  },
}

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
