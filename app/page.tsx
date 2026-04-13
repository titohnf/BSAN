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
import { DaftarPengajuanView } from "@/components/pusat/DaftarPengajuanView"
import { ValidatePokjaDrawer } from "@/components/pusat/ValidatePokjaDrawer"

import { SekolahDashboard } from "@/components/sekolah/SekolahDashboard"

import { MOCK_PENGAJUAN, PengajuanPokja } from "@/data/mockPokja"
import type { PokjaItem, PokjaData } from "@/types/pokja"

type AdminRole = "dinas" | "pusat" | "sekolah"
type DinaMenu = "dashboard" | "data-pokja" | "sumber-rujukan" | "kActivities"

const REGION = "Prov. Aceh"

const emptyMember = () => ({ nama: "", email: "", jenisKelamin: "" as "", noWhatsapp: "", instansi: "", jabatan: "" })

const E = emptyMember
const SK0 = { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" }
const B = (id: string, nama: string): PokjaItem => ({
  id, nama, status: "belum-dibentuk",
  data: { region: nama, nomorKanal: "", members: { catatan: E() }, sk: SK0 }
})

const MOCK_POKJA_LIST: PokjaItem[] = [
  // Provinsi dengan data lengkap — berbagai status
  {
    id: "p1", nama: "Prov. Jawa Timur", status: "aktif", tanggalDiverifikasi: "2024-03-15",
    validasiLog: [{ tanggal: "2024-03-15", aksi: "terima", aktor: "admin_pusat" }],
    data: {
      region: "Prov. Jawa Timur", nomorKanal: "0812xxx",
      members: {
        ketua:       { nama: "Dr. Budi Santoso, M.Si",      email: "budi@jatim.go.id",   jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08121234567", instansi: "Dinas Pendidikan Prov. Jawa Timur",  jabatan: "Ketua" },
        wakil:       { nama: "Ibu Siti Rahayu, M.Pd",       email: "siti@jatim.go.id",   jenisKelamin: "Perempuan" as const,  noWhatsapp: "08121234568", instansi: "Dinas Pendidikan Prov. Jawa Timur",  jabatan: "Wakil Ketua" },
        koordinator: { nama: "Bpk. Ahmad Wijaya, S.H",      email: "ahmad@jatim.go.id",  jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08121234569", instansi: "Sekretariat Daerah Prov. Jawa Timur", jabatan: "Koordinator" },
        pendidikan:  { nama: "Ibu Devi Kusuma, S.Pd",       email: "devi@jatim.go.id",   jenisKelamin: "Perempuan" as const,  noWhatsapp: "08121234570", instansi: "Dinas Pendidikan Prov. Jawa Timur",  jabatan: "Anggota" },
        pppa:        { nama: "Bpk. Hadi Prasetyo, M.H",     email: "hadi@jatim.go.id",   jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08121234571", instansi: "DP3A Prov. Jawa Timur",              jabatan: "Anggota" },
        sosial:      { nama: "Ibu Wati Susilowati, S.Sos",  email: "wati@jatim.go.id",   jenisKelamin: "Perempuan" as const,  noWhatsapp: "08121234572", instansi: "Dinas Sosial Prov. Jawa Timur",      jabatan: "Anggota" },
        kesehatan:   { nama: "Dr. Nugroho, Sp.A",           email: "nugroho@jatim.go.id",jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08121234573", instansi: "Dinas Kesehatan Prov. Jawa Timur",   jabatan: "Anggota" },
        kominfo:     { nama: "Bpk. Firman Hermawan, S.Kom", email: "firman@jatim.go.id", jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08121234574", instansi: "Dinas Kominfo Prov. Jawa Timur",     jabatan: "Anggota" },
        dukbangga:   { nama: "Ibu Rina Hartati, M.Acc",     email: "rina@jatim.go.id",   jenisKelamin: "Perempuan" as const,  noWhatsapp: "08121234575", instansi: "BPKAD Prov. Jawa Timur",             jabatan: "Anggota" },
      },
      sk: { file: null, nomorSK: "420/001/2024", tanggalSK: "2024-01-15", periodeMultai: "2024-01-15", periodeSelesai: "2027-01-14" }
    }
  },
  {
    id: "p2", nama: "Prov. DKI Jakarta", status: "butuh-perbaikan", tanggalDiverifikasi: "2024-02-20",
    validasiLog: [
      { tanggal: "2024-02-20", aksi: "terima",     aktor: "admin_pusat" },
      { tanggal: "2025-01-01", aksi: "sk_expired", aktor: "sistem",      alasan: "SK berakhir" }
    ],
    data: {
      region: "Prov. DKI Jakarta", nomorKanal: "0813xxx",
      members: {
        ketua:       { nama: "Dr. Ani Kusuma, M.Si",   email: "ani@dki.go.id",    jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234567", instansi: "Dinas Pendidikan DKI Jakarta", jabatan: "Ketua" },
        wakil:       { nama: "Bpk. Reza Pratama",      email: "reza@dki.go.id",   jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234568", instansi: "Dinas Pendidikan DKI Jakarta", jabatan: "Wakil Ketua" },
        koordinator: { nama: "Ibu Siti Aminah",        email: "siti@dki.go.id",   jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234569", instansi: "Setda DKI Jakarta",            jabatan: "Koordinator" },
        pendidikan:  { nama: "Bpk. Budi Hartono",      email: "budi@dki.go.id",   jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234570", instansi: "Dinas Pendidikan DKI Jakarta", jabatan: "Anggota" },
        pppa:        { nama: "Ibu Linda Sari",         email: "linda@dki.go.id",  jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234571", instansi: "DP3A DKI Jakarta",             jabatan: "Anggota" },
        sosial:      { nama: "Bpk. Anton Wijaya",      email: "anton@dki.go.id",  jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234572", instansi: "Dinas Sosial DKI Jakarta",     jabatan: "Anggota" },
        kesehatan:   { nama: "Dr. Sarah Rahmawati",    email: "sarah@dki.go.id",  jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234573", instansi: "Dinas Kesehatan DKI Jakarta",  jabatan: "Anggota" },
        kominfo:     { nama: "Bpk. Rizal Fauzi, S.Kom",email: "rizal@dki.go.id",  jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234574", instansi: "Dinas Kominfo DKI Jakarta",    jabatan: "Anggota" },
        dukbangga:   { nama: "Ibu Maya Kurniawati",    email: "maya@dki.go.id",   jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234575", instansi: "BPKAD DKI Jakarta",            jabatan: "Anggota" },
      },
      sk: { file: null, nomorSK: "456/002/2024", tanggalSK: "2024-01-20", periodeMultai: "2024-01-20", periodeSelesai: "2024-12-31" }
    }
  },
  {
    id: "p3", nama: "Prov. Jawa Barat", status: "aktif", tanggalDiverifikasi: "2024-03-15",
    validasiLog: [
      { tanggal: "2024-01-05", aksi: "pengajuan", aktor: "user" },
      { tanggal: "2024-01-10", aksi: "tolak",     aktor: "admin_pusat", alasan: "Data anggota tidak lengkap" },
      { tanggal: "2024-02-20", aksi: "perbaiki",  aktor: "user",        alasan: "Data anggota sudah diperbaiki" },
      { tanggal: "2024-03-15", aksi: "aktivasi",  aktor: "admin_pusat" }
    ],
    data: {
      region: "Prov. Jawa Barat", nomorKanal: "0814xxx",
      members: {
        ketua:       { nama: "Bpk. Dedi Supriadi, M.Pd",  email: "dedi@jabar.go.id",  jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08141234567", instansi: "Dinas Pendidikan Prov. Jawa Barat", jabatan: "Ketua" },
        wakil:       { nama: "Ibu Rina Marlina, S.Pd",    email: "rina@jabar.go.id",  jenisKelamin: "Perempuan" as const,  noWhatsapp: "08141234568", instansi: "Dinas Pendidikan Prov. Jawa Barat", jabatan: "Wakil Ketua" },
        koordinator: { nama: "Bpk. Rudi Hermawan, M.Si",  email: "rudi@jabar.go.id",  jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08141234569", instansi: "Sekretariat Daerah Prov. Jawa Barat",jabatan: "Koordinator" },
        pendidikan:  { nama: "Ibu Siti Nurhaliza, S.Pd",  email: "siti@jabar.go.id",  jenisKelamin: "Perempuan" as const,  noWhatsapp: "08141234570", instansi: "Dinas Pendidikan Prov. Jawa Barat", jabatan: "Anggota" },
        pppa:        { nama: "Bpk. Undang Hasan, M.H",    email: "undang@jabar.go.id",jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08141234571", instansi: "DP3A Prov. Jawa Barat",             jabatan: "Anggota" },
        sosial:      { nama: "Ibu Yanti Kusuma, S.Sos",   email: "yanti@jabar.go.id", jenisKelamin: "Perempuan" as const,  noWhatsapp: "08141234572", instansi: "Dinas Sosial Prov. Jawa Barat",     jabatan: "Anggota" },
      },
      sk: { file: null, nomorSK: "789/003/2024", tanggalSK: "2024-01-05", periodeMultai: "2024-01-05", periodeSelesai: "2027-01-04" }
    }
  },
  {
    id: "p4", nama: "Prov. Jawa Tengah", status: "masih-diverifikasi",
    validasiLog: [{ tanggal: "2024-02-01", aksi: "pengajuan", aktor: "user" }],
    data: {
      region: "Prov. Jawa Tengah", nomorKanal: "0815xxx",
      members: {
        ketua:       { nama: "Bpk. Hendra Wijanto, S.H, M.H", email: "hendra@jateng.go.id", jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08151234567", instansi: "Dinas Pendidikan Prov. Jawa Tengah", jabatan: "Ketua" },
        wakil:       { nama: "Ibu Diana Permata, M.Pd",       email: "diana@jateng.go.id",  jenisKelamin: "Perempuan" as const,  noWhatsapp: "08151234568", instansi: "Dinas Pendidikan Prov. Jawa Tengah", jabatan: "Wakil Ketua" },
        koordinator: { nama: "Bpk. Susanto, M.Si",            email: "susanto@jateng.go.id",jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08151234569", instansi: "Sekretariat Daerah Prov. Jawa Tengah",jabatan: "Koordinator" },
        pendidikan:  { nama: "Ibu Maya Kumala, S.Pd",         email: "maya@jateng.go.id",   jenisKelamin: "Perempuan" as const,  noWhatsapp: "08151234570", instansi: "Dinas Pendidikan Prov. Jawa Tengah", jabatan: "Anggota" },
        pppa:        { nama: "Bpk. Ali Akbar, M.H",           email: "ali@jateng.go.id",    jenisKelamin: "Laki-Laki" as const,  noWhatsapp: "08151234571", instansi: "DP3A Prov. Jawa Tengah",              jabatan: "Anggota" },
        sosial:      { nama: "Ibu Ratna Sari, S.Sos",         email: "ratna@jateng.go.id",  jenisKelamin: "Perempuan" as const,  noWhatsapp: "08151234572", instansi: "Dinas Sosial Prov. Jawa Tengah",      jabatan: "Anggota" },
      },
      sk: { file: null, nomorSK: "101/004/2024", tanggalSK: "2024-02-01", periodeMultai: "2024-02-01", periodeSelesai: "2027-01-31" }
    }
  },
  // Sisa 34 provinsi — belum dibentuk
  B("p5",  "Prov. Aceh"),
  B("p6",  "Prov. Bali"),
  B("p7",  "Prov. Banten"),
  B("p8",  "Prov. Bengkulu"),
  B("p9",  "Prov. D.I. Yogyakarta"),
  B("p10", "Prov. Gorontalo"),
  B("p11", "Prov. Jambi"),
  B("p12", "Prov. Kalimantan Barat"),
  B("p13", "Prov. Kalimantan Selatan"),
  B("p14", "Prov. Kalimantan Tengah"),
  B("p15", "Prov. Kalimantan Timur"),
  B("p16", "Prov. Kalimantan Utara"),
  B("p17", "Prov. Kepulauan Bangka Belitung"),
  B("p18", "Prov. Kepulauan Riau"),
  B("p19", "Prov. Lampung"),
  B("p20", "Prov. Maluku"),
  B("p21", "Prov. Maluku Utara"),
  B("p22", "Prov. Nusa Tenggara Barat"),
  B("p23", "Prov. Nusa Tenggara Timur"),
  B("p24", "Prov. Papua"),
  B("p25", "Prov. Papua Barat"),
  B("p26", "Prov. Papua Barat Daya"),
  B("p27", "Prov. Papua Pegunungan"),
  B("p28", "Prov. Papua Selatan"),
  B("p29", "Prov. Papua Tengah"),
  B("p30", "Prov. Riau"),
  B("p31", "Prov. Sulawesi Barat"),
  B("p32", "Prov. Sulawesi Selatan"),
  B("p33", "Prov. Sulawesi Tengah"),
  B("p34", "Prov. Sulawesi Tenggara"),
  B("p35", "Prov. Sulawesi Utara"),
  B("p36", "Prov. Sumatera Barat"),
  B("p37", "Prov. Sumatera Selatan"),
  B("p38", "Prov. Sumatera Utara"),
]

function AdminPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasProcessedSubmit = useRef(false)

  const [role, setRole] = useState<AdminRole>("dinas")
  const [dinasMenu, setDinasMenu] = useState<DinaMenu>("dashboard")
  const [pusatMenu, setPusatMenu] = useState<PusatMenu>("dashboard")
  const [pengajuan, setPengajuan] = useState<PengajuanPokja[]>(MOCK_PENGAJUAN)
  const [pokjaList, setPokjaList] = useState<PokjaItem[]>(() => {
    if (typeof window === "undefined") return MOCK_POKJA_LIST
    try {
      const stored = localStorage.getItem("pokjaList")
      const mockIds = new Set(MOCK_POKJA_LIST.map(p => p.id))
      let userPokja: PokjaItem[] = []
      if (stored) {
        const parsed = JSON.parse(stored) as PokjaItem[]
        userPokja = parsed.filter(p => !mockIds.has(p.id))
      }
      const seenUser = new Set<string>()
      const uniqueUserPokja = userPokja.filter(p => {
        if (seenUser.has(p.id)) return false
        seenUser.add(p.id)
        return true
      })
      localStorage.setItem("pokjaList", JSON.stringify(uniqueUserPokja))
      return [...MOCK_POKJA_LIST, ...uniqueUserPokja]
    } catch {
      return MOCK_POKJA_LIST
    }
  })
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
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      const mockIds = new Set(MOCK_POKJA_LIST.map(p => p.id))
      const seen = new Set<string>()
      const userPokja = pokjaList.filter(p => {
        if (mockIds.has(p.id) || seen.has(p.id)) return false
        seen.add(p.id)
        return true
      })
      localStorage.setItem("pokjaList", JSON.stringify(userPokja))
    } catch {}
  }, [pokjaList, mounted])

  useEffect(() => {
    if (!mounted) return
    if (searchParams.get("pokjaCreated") !== "1" && searchParams.get("pokjaSubmitted") !== "1") return
    if (hasProcessedSubmit.current) return
    hasProcessedSubmit.current = true

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

      const existingIds = new Set(pokjaList.map(p => p.id))
      let newId = `pokja-${Date.now()}`
      while (existingIds.has(newId)) {
        newId = `pokja-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      }

      const newPokja: PokjaItem = {
        id: newId,
        nama: parsed.region,
        status: isPusat ? "aktif" : "masih-diverifikasi",
        data: {
          ...parsed,
          sk: { ...parsed.sk, file: null, periodeMultai: parsed.sk.periodeMultai ?? "" },
        },
      }

      setPokjaList((prev) => {
        // Deduplicate entire list
        const seen = new Set<string>()
        const deduped = prev.filter(p => {
          if (seen.has(p.id)) return false
          seen.add(p.id)
          return true
        })
        // Jika sudah ada pokja dengan nama sama, update statusnya — jangan tambah baru
        const sameRegionIdx = deduped.findIndex(p =>
          p.nama.trim().toLowerCase() === newPokja.nama.trim().toLowerCase()
        )
        if (sameRegionIdx !== -1) {
          const updated = [...deduped]
          updated[sameRegionIdx] = { ...updated[sameRegionIdx], status: newPokja.status, data: newPokja.data }
          return updated
        }
        if (deduped.some(p => p.id === newId)) return deduped
        return [...deduped, newPokja]
      })

      const url = new URL(window.location.href)
      url.searchParams.delete("pokjaCreated")
      url.searchParams.delete("pokjaSubmitted")
      window.history.replaceState({}, "", url.toString())
    } catch (e) {
      console.error("Failed to process pokja submission", e)
    }
  }, [mounted, searchParams])

  const navigateToBuatPokja = () => {
    router.push("/buat-pokja")
  }

  const handleSavePengajuan = (updated: PengajuanPokja) => {
    setPengajuan((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  const handleSavePokjaValidation = (updated: PokjaItem) => {
    setPokjaList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setValidatingPokja(null)
  }

  if (!authChecked) return null

  return (
    <>
      {role === "dinas" && (
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar activeMenu={dinasMenu} onMenuChange={setDinasMenu} />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              {dinasMenu === "dashboard" && (
                <DashboardView
                  pokjaList={pokjaList.filter((p) => p.data.region === REGION)}
                  onBuatPokja={navigateToBuatPokja}
                  onViewDataPokja={() => setDinasMenu("data-pokja")}
                  onViewSumberRujukan={() => setDinasMenu("sumber-rujukan")}
                  onViewActivities={() => setDinasMenu("kActivities")}
                />
              )}
              {dinasMenu === "data-pokja" && (
                <DataPokjaView
                  pokjaList={pokjaList.filter((p) => p.data.region === REGION)}
                  onBuatPokja={navigateToBuatPokja}
                  isAdminPusat={false}
                  onValidatePusat={(p) => setValidatingPokja(p)}
                />
              )}
              {dinasMenu === "sumber-rujukan" && <SumberRujukanView />}
              {dinasMenu === "kActivities" && < KegiatanView />}
            </main>
          </div>
        </div>
      )}

      {role === "pusat" && (
        <div className="min-h-screen bg-gray-50 flex">
          <SidebarPusat activeMenu={pusatMenu} onMenuChange={setPusatMenu} />
          <div className="flex-1 flex flex-col min-w-0">
            <div className="md:hidden h-14" aria-hidden="true" />
            <HeaderPusat />
            <main className="flex-1 px-4 md:px-6 py-6">
              {pusatMenu === "dashboard" && (
                <DashboardPusatView
                  pokjaList={pokjaList}
                  onValidatePusat={(pokja) => setValidatingPokja(pokja)}
                  onViewSumberRujukan={() => setPusatMenu("sumber-rujukan")}
                  onViewActivities={() => setPusatMenu("k" as PusatMenu)}
                />
              )}
              {pusatMenu === "pokja" && (
                <DaftarPengajuanView 
                  pokjaList={pokjaList} 
                  onSelect={(pokja) => setValidatingPokja(pokja)}
                />
              )}
              {pusatMenu === "sumber-rujukan" && <SumberRujukanView />}
              {pusatMenu === "k" && < KegiatanView />}
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
              onSave={handleSavePokjaValidation}
            />
          )}
        </div>
      )}

      {role === "sekolah" && (
        <div className="min-h-screen bg-gray-50">
          <SekolahDashboard />
        </div>
      )}
    </>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <AdminPageInner />
    </Suspense>
  )
}
