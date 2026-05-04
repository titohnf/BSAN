"use client"

import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { KegiatanContent } from "@/components/landing/KegiatanContent"

export default function KegiatanPage() {
  return (
    <main>
      <LandingNavbar />
      <KegiatanContent hideHeroPrefix={true} />
      <LandingFooter />
    </main>
  )
}
