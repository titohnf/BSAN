"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { DataPublikContent } from "@/components/landing/DataPublikContent"

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
      <LandingNavbar />
      <DataPublikContent />
      <LandingFooter />
    </main>
  )
}