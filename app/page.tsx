"use client"

import { useState, useEffect, useLayoutEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { DashboardView } from "@/components/views/DinasHome"
import { DataPokjaView } from "@/components/dashboard/DataPokjaView"
import { SumberRujukanView } from "@/components/dashboard/SumberRujukanView"
import { KegiatanView } from "@/components/dashboard/KegiatanView"

import { SidebarPusat, PusatMenu } from "@/components/pusat/SidebarPusat"
import { HeaderPusat } from "@/components/pusat/HeaderPusat"

import { SekolahDashboard } from "@/components/sekolah/SekolahDashboard"

import type { PokjaItem, PokjaData } from "@/types/pokja"

type AdminRole = "dinas" | "pusat" | "sekolah"
type DinaMenu = "dashboard" | "data-pokja" | "sumber-rujukan" | "kegiatan"

const REGION = "Prov. Aceh"

function AdminPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasProcessedSubmit = useRef(false)

  const [role, setRole] = useState<AdminRole>("dinas")
  const [dinasMenu, setDinasMenu] = useState<DinaMenu>("dashboard")
  const [pokjaList, setPokjaList] = useState<PokjaItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useLayoutEffect(() => {
    try {
      const auth = sessionStorage.getItem("auth")
      if (!auth) {
        router.replace("/login")
        return
      }
      const parsed = JSON.parse(auth) as { role: AdminRole }
      if (parsed.role === "pusat") setRole("pusat")
      else if (parsed.role === "sekolah") setRole("sekolah")
      setAuthChecked(true)
    } catch {
      router.replace("/login")
    }
  }, [router])

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("pokjaList")
      if (stored) setPokjaList(JSON.parse(stored) as PokjaItem[])
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      sessionStorage.setItem("pokjaList", JSON.stringify(pokjaList))
    } catch {}
  }, [pokjaList, mounted])

  const [pusatMenu, setPusatMenu] = useState<PusatMenu>("dashboard")

  // Read ?menu= param so back-navigation from detail pages lands on the right view
  useEffect(() => {
    const menuParam = searchParams.get("menu") as DinaMenu | null
    if (menuParam && ["dashboard", "data-pokja", "sumber-rujukan", "kegiatan"].includes(menuParam)) {
      setDinasMenu(menuParam)
      router.replace("/")
    }
  }, [searchParams])

  useEffect(() => {
    if (hasProcessedSubmit.current) return
    if (searchParams.get("pokjaSubmitted") !== "1") return
    hasProcessedSubmit.current = true

    try {
      const raw = sessionStorage.getItem("newPokjaData")
      if (!raw) return

      const parsed = JSON.parse(raw) as Omit<PokjaData, "sk"> & {
        sk: Omit<PokjaData["sk"], "file"> & { file: string | null }
      }

      const newPokja: PokjaItem = {
        id: `pokja-${Date.now()}`,
        nama: `POKJA Budaya Sekolah – ${parsed.region}`,
        status: "masih-diverifikasi",
        data: {
          ...parsed,
          sk: { ...parsed.sk, file: null, periodeMultai: parsed.sk.periodeMultai ?? "" },
        },
      }

      // Read current list directly from sessionStorage to avoid stale React state
      let existingList: PokjaItem[] = []
      try {
        const existingRaw = sessionStorage.getItem("pokjaList")
        if (existingRaw) existingList = JSON.parse(existingRaw) as PokjaItem[]
      } catch {}
      const updatedList = [...existingList, newPokja]
      sessionStorage.removeItem("newPokjaData")
      sessionStorage.setItem("pokjaList", JSON.stringify(updatedList))
      setPokjaList(updatedList)
      setDinasMenu("data-pokja")
      router.replace("/")
    } catch {
      sessionStorage.removeItem("newPokjaData")
      router.replace("/")
    }
  }, [searchParams, router])

  const handleOpenForm = () => router.push("/buat-pokja")

  if (!authChecked) return null

  if (role === "sekolah") {
    return <SekolahDashboard />
  }

  if (role === "dinas") {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar activeMenu={dinasMenu} onMenuChange={setDinasMenu} />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="md:hidden h-14" aria-hidden="true" />
          <Header userName="Admin Dinas Aceh" />
          <main className="flex-1 px-4 md:px-6 py-6">
            {dinasMenu === "dashboard" && (
              <DashboardView
                region={REGION}
                pokjaList={pokjaList}
                targetPokja={10}
                onBuatPokja={handleOpenForm}
                onViewDataPokja={() => setDinasMenu("data-pokja")}
                onViewSumberRujukan={() => setDinasMenu("sumber-rujukan")}
                sumberRujukanStatus={{ total: 5, aktif: 3, menungguVerifikasi: 2, ditolak: 0 }}
                onViewKegiatan={() => setDinasMenu("kegiatan")}
                kegiatanStatus={{ total: 5, berlangsung: 1, menunggu: 2, selesai: 2 }}
              />
            )}
            {dinasMenu === "data-pokja" && (
              <DataPokjaView pokjaList={pokjaList} onBuatPokja={handleOpenForm} />
            )}
            {dinasMenu === "sumber-rujukan" && <SumberRujukanView />}
            {dinasMenu === "kegiatan" && <KegiatanView />}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarPusat activeMenu={pusatMenu} onMenuChange={setPusatMenu} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="md:hidden h-14" aria-hidden="true" />
        <HeaderPusat />
        <main className="flex-1 px-4 md:px-6 py-6">
          {pusatMenu === "dashboard" && (
            <DashboardView
              region="Nasional"
              pokjaList={pokjaList}
              targetPokja={34}
              onBuatPokja={() => {}}
              onViewDataPokja={() => setPusatMenu("data-pokja")}
              onViewSumberRujukan={() => setPusatMenu("sumber-rujukan")}
              sumberRujukanStatus={{ total: 20, aktif: 15, menungguVerifikasi: 3, ditolak: 2 }}
              onView Kegiatan={() => setPusatMenu("kegiatan")}
              kegiatanStatus={{ total: 12, berlangsung: 4, menunggu: 5, selesai: 3 }}
            />
          )}
          {pusatMenu === "data-pokja" && (
            <DataPokjaView pokjaList={pokjaList} onBuatPokja={() => {}} />
          )}
          {pusatMenu === "sumber-rujukan" && <SumberRujukanView />}
          {pusatMenu === "kegiatan" && < KegiatanView />}
        </main>
      </div>
    </div>
  )
}

function DashboardSuspenseFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">Memuat…</p>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <AdminPageInner />
    </Suspense>
  )
}
