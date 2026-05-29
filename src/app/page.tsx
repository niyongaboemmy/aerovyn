import { Hero } from '@/components/home/Hero'
import { StatsStrip } from '@/components/home/StatsStrip'
import { ClientsStrip } from '@/components/home/ClientsStrip'
import { ServicesOverview } from '@/components/home/ServicesOverview'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { TrainingPreview } from '@/components/home/TrainingPreview'
import { WhyAerovyn } from '@/components/home/WhyAerovyn'
import { Testimonials } from '@/components/home/Testimonials'
import { CTABanner } from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ClientsStrip />
      <ServicesOverview />
      <FeaturedProjects />
      <TrainingPreview />
      <WhyAerovyn />
      <Testimonials />
      <CTABanner />
    </>
  )
}
