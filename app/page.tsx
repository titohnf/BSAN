"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Construction, Shield, CheckCircle2, Users } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800">
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-emerald-700" />
            </div>
            <span className="text-white font-bold text-lg">BSAN</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-white/80 font-medium">Beranda</button>
            <button className="text-white/80 font-medium">Data Publik</button>
            <button onClick={() => router.push("/login")} className="px-4 py-2 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition">Login</button>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 mb-6">
          <Construction className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Under Construction</h1>
        <p className="text-lg text-emerald-100 mb-8">Sistem Informasi POKJA sekolah Aceh sedang dalam pengembangan</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-200">
          <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Perlindungan Anak Terintegrasi</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Verifikasi Resmi</span>
          <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Kolaborasi Dinas</span>
        </div>
      </div>
      <footer className="absolute bottom-0 w-full py-6 text-center text-white/60 text-sm">
        © 2025 BSAN - Badan Perlindungan Anak Aceh
      </footer>
    </div>
  )
}