"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DevBanner } from "@/components/landing/DevBanner"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { UrgencySection } from "@/components/landing/UrgencySection"
import { AboutSection } from "@/components/landing/AboutSection"
import { RegulationSection } from "@/components/landing/RegulationSection"
import { CampaignSection } from "@/components/landing/CampaignSection"
import { FaqSection } from "@/components/landing/FaqSection"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("auth")
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed.role === "pusat" || parsed.role === "dinas" || parsed.role === "sekolah") {
          router.replace("/dashboard")
          return
        }
      } catch {}
    }
  }, [router])

  return (
    <main>
      <DevBanner />
      <LandingNavbar />
      <HeroSection />
      <UrgencySection />
      <AboutSection />
      <RegulationSection />
      <CampaignSection />
      <FaqSection />
      <LandingFooter />
    </main>
  )
}
