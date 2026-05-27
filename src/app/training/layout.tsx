import type { Metadata } from 'next'
import { CourseListSchema } from '@/components/seo/CourseListSchema'

export const metadata: Metadata = {
  title: 'Drone Training Programmes',
  description:
    'Beginner to advanced UAV pilot certification programmes with hands-on flight sessions. RCAA-approved curriculum. Enrol today.',
  keywords: ['drone training', 'UAV pilot certification', 'drone courses Africa', 'RCAA certification'],
  openGraph: {
    title: 'Drone Training Programmes | AEROVYN',
    description:
      'Beginner to advanced UAV pilot certification. Hands-on flight sessions, RCAA-approved curriculum, certifications issued.',
    type: 'website',
  },
}

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CourseListSchema />
      {children}
    </>
  )
}
