import { BottomNav } from '@/components/landing/BottomNav'
import { CopyrightBar } from '@/components/landing/CopyrightBar'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { MarqueeSection } from '@/components/landing/MarqueeSection'
import { PartnerSection } from '@/components/landing/PartnerSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { ProjectsSection } from '@/components/landing/ProjectsSection'
import { StatesSection } from '@/components/landing/StatesSection'
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel'
import { TestimonialSection } from '@/components/landing/TestimonialSection'

export function HomeLanding() {
  return (
    <div className="min-h-screen bg-surface pb-28 font-montreal text-primary">
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <StatesSection />
      <TestimonialSection />
      <PricingSection />
      <TestimonialCarousel />
      <ProjectsSection />
      <PartnerSection />
      <LandingFooter />
      <CopyrightBar />
      <BottomNav />
    </div>
  )
}
