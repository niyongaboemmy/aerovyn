import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Founded in Kigali in 2020, AEROVYN brings professional-grade UAV operations and pilot training to Africa\'s most demanding environments.',
  openGraph: {
    title: 'About AEROVYN',
    description:
      'Founded in Kigali in 2020, AEROVYN combines precision drone operations with structured training programmes built for Africa.',
    type: 'profile',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
