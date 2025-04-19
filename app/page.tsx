import { Navigation } from "@/components/landing/Navigation"
import { HeroSection } from "@/components/landing/HeroSection"
import { StatsSection } from "@/components/landing/StatsSection"
import { BackgroundPattern } from "@/components/landing/BackgroundPattern"
import { SolutionsSection } from "@/components/landing/SolutionsSection"
import { FaqSection } from "@/components/landing/FaqSection"
import Testimonial from "@/components/landing/Testimonial"
import Footer from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-body">
      {/* Hero section with background */}
      <div className="flex-auto lg:flex-1 bg-gradient-to-br from-[#004d29] to-[#003d21] relative overflow-hidden">
        <Navigation />
        <BackgroundPattern />
        <HeroSection />
      </div>
      <StatsSection />
      <SolutionsSection />
      <Testimonial />
      <FaqSection />
      <Footer />
    </main>
  )
}
