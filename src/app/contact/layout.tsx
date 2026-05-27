import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with AEROVYN for drone project enquiries, pilot training enrolment, or partnership opportunities. We respond within one business day.',
  openGraph: {
    title: 'Contact AEROVYN',
    description:
      'Enquire about drone services, training enrolment, or partnerships. Based in Kigali — operating across Africa.',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
