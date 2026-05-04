"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { DataPublikContent } from "@/components/landing/DataPublikContent"

export default function KelompokKerjaPage() {
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
      <LandingNavbar />
      <DataPublikContent 
        heroTitle="Kelompok Kerja BSAN" 
        heroSubtitle="Lihat informasi pembentukan kelompok kerja BSAN di seluruh Indonesia"
        hideHeroPrefix={true}
      />
      <LandingFooter />
    </main>
  )
}