import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "AEROVYN LTD — incorporated in Kigali, Rwanda in 2026, delivering intelligent drone technology and aerial intelligence across Africa.",
  openGraph: {
    title: 'About AEROVYN',
    description:
      "Founded by Jean Claude Tuyisenge, AEROVYN is Africa's sovereign drone technology company — operating across Rwanda and expanding continent-wide.",
    type: 'profile',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
