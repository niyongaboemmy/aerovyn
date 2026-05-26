import type { Metadata } from 'next'
import { Orbitron, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/ui/PageTransition'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['400', '700', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'AEROVYN — Elevating the Future of Airspace',
    template: '%s | AEROVYN',
  },
  description:
    'Professional drone projects and certified training programs. Aerial mapping, inspections, photography, and UAV pilot certification.',
  keywords: [
    'drone training',
    'drone services Africa',
    'UAV pilot certification',
    'drone mapping',
    'aerial photography',
  ],
  openGraph: {
    title: 'AEROVYN — Elevating the Future of Airspace',
    description: 'Professional Drone Projects & Certified Training Programs',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${dmSans.variable}`}
      style={{ backgroundColor: '#0A0B0D' }}
      suppressHydrationWarning
    >
      <body>
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[#00F5C4] focus:px-4 focus:py-2 focus:text-[#0A0B0D] focus:outline-none"
        >
          Skip to main content
        </a>
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          <main id="main-content">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
