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
import { DashboardPusatView } from "@/components/pusat/DashboardPusatView"
import { DetailPengajuan } from "@/components/pusat/DetailPengajuan"
import { ValidatePokjaDrawer } from "@/components/pusat/ValidatePokjaDrawer"

import { SekolahDashboard } from "@/components/sekolah/SekolahDashboard"

import { MOCK_PENGAJUAN, PengajuanPokja } from "@/data/mockPokja"
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
  const [pusatMenu, setPusatMenu] = useState<PusatMenu>("dashboard")
  const [pengajuan, setPengajuan] = useState<PengajuanPokja[]>(MOCK_PENGAJUAN)
  const [pokjaList, setPokjaList] = useState<PokjaItem[]>([])
  const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanPokja | null>(null)
  const [validatingPokja, setValidatingPokja] = useState<PokjaItem | null>(null)
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

  useEffect(() => {
    if (!mounted) return
    if (searchParams.get("pokjaCreated") !== "1" && searchParams.get("pokjaSubmitted") !== "1") return

    try {
      const raw = sessionStorage.getItem("newPokjaData")
      if (!raw) return

      const parsed = JSON.parse(raw) as Omit<PokjaData, "sk"> & {
        sk: Omit<PokjaData["sk"], "file"> & { file: string | null }
      }

      const isPusat = (() => {
        try {
          return JSON.parse(sessionStorage.getItem("auth") || "{}").role === "pusat"
        } catch { return false }
      })()

      const newPokja: PokjaItem = {
        id: `pokja-${Date.now()}`,
        nama: `POKJA Budaya Sekolah – ${parsed.region}`,
        status: isPusat ? "aktif" : "masih-diverifikasi",
        data: {
          ...parsed,
          sk: { ...parsed.sk, file: null, periodeMultai: parsed.sk.periodeMultai ?? "" },
        },
      }

      const updatedList = [...pokjaList, newPokja]
      sessionStorage.removeItem("newPokjaData")
      sessionStorage.setItem("pokjaList", JSON.stringify(updatedList))
      setPokjaList(updatedList)
    } catch {
      sessionStorage.removeItem("newPokjaData")
    }
  }, [searchParams, mounted, pokjaList])

  const navigateToBuatPokja = () => router.push("/buat-pokja")

  // For admin dinas - use navigateToBuatPokja (defined in component)
  const handleOpenForm = () => router.push("/buat-pokja")

  const handleSavePengajuan = (updated: PengajuanPokja) => {
    setPengajuan((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  const handleValidatePokja = (updated: PokjaItem) => {
    setPokjaList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setValidatingPokja(null)
  }

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
                onViewActivities={() => setDinasMenu("kegiatan")}
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
            <DashboardPusatView
              pokjaList={pokjaList}
              onValidatePusat={(pokja) => setValidatingPokja(pokja)}
            />
          )}
          {pusatMenu === "data-pokja" && (
            <DataPokjaView 
              pokjaList={pokjaList} 
              onBuatPokja={navigateToBuatPokja}
              isAdminPusat={role === "pusat"}
              onValidatePusat={(pokja) => setValidatingPokja(pokja)}
            />
          )}
          {pusatMenu === "sumber-rujukan" && <SumberRujukanView />}
          {pusatMenu === "kegiatan" && < KegiatanView />}
        </main>
      </div>
      {selectedPengajuan && (
        <DetailPengajuan
          item={selectedPengajuan}
          onClose={() => setSelectedPengajuan(null)}
          onSave={(updated) => {
            handleSavePengajuan(updated)
            setSelectedPengajuan(null)
          }}
        />
      )}
      {validatingPokja && (
        <ValidatePokjaDrawer
          pokja={validatingPokja}
          onClose={() => setValidatingPokja(null)}
          onSave={handleValidatePokja}
        />
      )}
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
