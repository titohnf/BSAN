"use client"

import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { DataPublikContent } from "@/components/landing/DataPublikContent"

export default function DataPublikPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingNavbar />
      <DataPublikContent showBackButton={true} />
      <LandingFooter />
    </div>
  )
}