import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Drone Services',
  description:
    'Professional aerial mapping, inspections, photography, agricultural surveys, and custom UAV deployments across Africa.',
  openGraph: {
    title: 'Drone Services | AEROVYN',
    description:
      'Professional aerial mapping, inspections, photography, agricultural surveys, and custom UAV deployments across Africa.',
    type: 'website',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
