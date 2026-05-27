import type { Metadata, Viewport } from 'next'
import { Orbitron, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/ui/PageTransition'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { PlausibleAnalytics } from '@/components/seo/PlausibleAnalytics'

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // enables env(safe-area-inset-*) on notched iOS devices
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aerovyn.com'),
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
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'AEROVYN — Elevating the Future of Airspace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEROVYN — Elevating the Future of Airspace',
    description: 'Professional Drone Projects & Certified Training Programs',
    images: ['/api/og'],
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
        <OrganizationSchema />
        <PlausibleAnalytics />
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
          <MobileBottomNav />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
