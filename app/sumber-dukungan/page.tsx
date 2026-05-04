"use client"

import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { SumberDukunganContent } from "@/components/landing/SumberDukunganContent"

export default function SumberDukunganPage() {
  return (
    <main>
      <LandingNavbar />
      <SumberDukunganContent hideHeroPrefix={true} />
      <LandingFooter />
    </main>
  )
}
