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

const MOCK_POKJA_LIST: PokjaItem[] = [
  { 
    id: "p1", 
    nama: "Prov. Jawa Timur", 
    status: "aktif", 
    tanggalDiverifikasi: "2024-03-15",
    validasiLog: [
      { tanggal: "2024-03-15", aksi: "terima", aktor: "admin_pusat" }
    ],
    data: { 
      region: "Jawa Timur", 
      nomorKanal: "0812xxx", 
      members: { 
        ketua: { nama: "Dr. Budi Santoso, M.Si", email: "budi@jatim.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08121234567", instansi: "Dinas Pendidikan Prov. Jawa Timur", jabatan: "Ket" },
        wakil: { nama: "Ibu Siti Rahayu, M.Pd", email: "siti@jatim.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08121234568", instansi: "Dinas Pendidikan Prov. Jawa Timur", jabatan: "Wakil" },
        koordinator: { nama: "Bpk. Ahmad Wijaya, S.H", email: "ahmad@jatim.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08121234569", instansi: "Sekretariat Daerah Prov. Jawa Timur", jabatan: "Koordinator" },
        pendidikan: { nama: "Ibu Devi Kusuma, S.Pd", email: "devi@jatim.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08121234570", instansi: "Dinas Pendidikan Prov. Jawa Timur", jabatan: "Anggota" },
        pppa: { nama: "Bpk. Hadi Prasetyo, M.H", email: "hadi@jatim.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08121234571", instansi: "DP3A Prov. Jawa Timur", jabatan: "Anggota" },
        sosial: { nama: "Ibu Wati Susilowati, S.Sos", email: "wati@jatim.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08121234572", instansi: "Dinas Sosial Prov. Jawa Timur", jabatan: "Anggota" },
        kesehatan: { nama: "Dr. Nugroho, Sp.A", email: "nugroho@jatim.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08121234573", instansi: "Dinas Kesehatan Prov. Jawa Timur", jabatan: "Anggota" },
        kominfo: { nama: "Bpk. Firman Hermawan, S.Kom", email: "firman@jatim.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08121234574", instância: "Dinas Kominfo Prov. Jawa Timur", jabatan: "Anggota" },
        dukbangga: { nama: "Ibu Rina Hartati, M.Acc", email: "rina@jatim.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08121234575", instância: "BPKAD Prov. Jawa Timur", jabatan: "Anggota" },
      }, 
      sk: { file: null, nomorSK: "420/001/2024", tanggalSK: "2024-01-15", periodeMultai: "2024-01-15", periodeSelesai: "2027-01-14" } 
    } 
  },
  { 
    id: "p2", 
    nama: "Prov. DKI Jakarta", 
    status: "butuh-perbaikan", 
    tanggalDiverifikasi: "2024-02-20",
    validasiLog: [
      { tanggal: "2024-02-20", aksi: "terima", aktor: "admin_pusat" },
      { tanggal: "2025-01-01", aksi: "sk_expired", aktor: "sistem", alasan: "SK berakhir" }
    ],
    data: { 
      region: "DKI Jakarta", 
      nomorKanal: "0813xxx",
      members: { 
        ketua: { nama: "Dr. Ani Kusuma, M.Si", email: "ani@dki.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234567", instansi: "Dinas Pendidikan DKI Jakarta", jabatan: "Ketua" },
        wakil: { nama: "Bpk. Jakarta", email: "jakarta@dki.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234568", instansi: "Dinas Pendidikan DKI Jakarta", jabatan: "Wakil" },
        koordinator: { nama: "Ibu Siti", email: "siti@dki.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234569", instansi: "Setda DKI Jakarta", jabatan: "Koordinator" },
        pendidikan: { nama: "Bpk. Budi", email: "budi@dki.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234570", instansi: "Dinas Pendidikan DKI Jakarta", jabatan: "Anggota" },
        pppa: { nama: "Ibu Linda", email: "linda@dki.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234571", instância: "DP3A DKI Jakarta", jabatan: "Anggota" },
        sosial: { nama: "Bpk. Anton", email: "anton@dki.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234572", instância: "Dinas Sosial DKI Jakarta", jabatan: "Anggota" },
        kesehatan: { nama: "Dr. Sarah", email: "sarah@dki.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234573", instansi: "Dinas Kesehatan DKI Jakarta", jabatan: "Anggota" },
        kominfo: { nama: "Bpk. Rizal", email: "rizal@dki.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08131234574", instansi: "Dinas Kominfo DKI Jakarta", jabatan: "Anggota" },
        dukbangga: { nama: "Ibu Maya", email: "maya@dki.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08131234575", instância: "BPKAD DKI Jakarta", jabatan: "Anggota" },
      }, 
      sk: { file: null, nomorSK: "456/002/2024", tanggalSK: "2024-01-20", periodeMultai: "2024-01-20", periodeSelesai: "2024-12-31" } 
    } 
  },
  { 
    id: "p3", 
    nama: "Kab. Bandung", 
    status: "aktif", 
    tanggalDiverifikasi: "2024-03-15",
    validasiLog: [
      { tanggal: "2024-01-05", aksi: "pengajuan", aktor: "user" },
      { tanggal: "2024-01-10", aksi: "tolak", aktor: "admin_pusat", alasan: "Data anggota tidak lengkap" },
      { tanggal: "2024-02-20", aksi: "perbaiki", aktor: "user", alasan: "Data anggota sudah diperbaiki" },
      { tanggal: "2024-03-15", aksi: "aktivasi", aktor: "admin_pusat" }
    ],
    data: { 
      region: "Jawa Barat", 
      nomorKanal: "0814xxx", 
      members: { 
        ketua: { nama: "Bpk. Dedi Supriadi, M.Pd", email: "dedi@bandung.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08141234567", instansi: "Dinas Pendidikan Kab. Bandung", jabatan: "Ketua" },
        wakil: { nama: "Ibu Rina Marlina, S.Pd", email: "rina@bandung.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08141234568", instância: "Dinas Pendidikan Kab. Bandung", jabatan: "Wakil Ketua" },
        koordinator: { nama: "Bpk. Rudi Hermawan, M.Si", email: "rudi@bandung.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08141234569", instância: "Sekretariat Daerah Kab. Bandung", jabatan: "Koordinator" },
        pendidikan: { nama: "Ibu Siti Nurhaliza, S.Pd", email: "siti@bandung.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08141234570", instância: "Dinas Pendidikan Kab. Bandung", jabatan: "Anggota" },
        pppa: { nama: "Bpk. Undang Hasan, M.H", email: "undang@bandung.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08141234571", instância: "DP3A Kab. Bandung", jabatan: "Anggota" },
        sosial: { nama: "Ibu Yanti Kusuma, S.Sos", email: "yanti@bandung.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08141234572", instansi: "Dinas Sosial Kab. Bandung", jabatan: "Anggota" },
        kesehatan: { nama: "Dr. Budi Santoso", email: "budi@bandung.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08141234573", instância: "Dinas Kesehatan Kab. Bandung", jabatan: "Anggota" },
        kominfo: { nama: "Bpk. Adi Wijaya, S.Kom", email: "adi@bandung.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08141234574", instância: "Dinas Kominfo Kab. Bandung", jabatan: "Anggota" },
        dukbangga: { nama: "Ibu Diah Permata, M.Acc", email: "diah@bandung.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08141234575", instância: "BPKAD Kab. Bandung", jabatan: "Anggota" },
      }, 
      sk: { file: null, nomorSK: "789/003/2024", tanggalSK: "2024-01-05", periodeMultai: "2024-01-05", periodeSelesai: "2027-01-04" } 
    } 
  },
  { 
    id: "p4", 
    nama: "Kota Surabaya", 
    status: "masih-diverifikasi", 
    validasiLog: [
      { tanggal: "2024-02-01", aksi: "pengajuan", aktor: "user" }
    ],
    data: { 
      region: "Jawa Timur", 
      nomorKanal: "0815xxx", 
      members: { 
        ketua: { nama: "Bpk. Hendra Wijanto, S.H, M.H", email: "hendra@surabaya.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08151234567", instansi: "Dinas Pendidikan Kota Surabaya", jabatan: "Ketua" },
        wakil: { nama: "Ibu Diana Permata, M.Pd", email: "diana@surabaya.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08151234568", instansi: "Dinas Pendidikan Kota Surabaya", jabatan: "Wakil Ketua" },
        koordinator: { nama: "Bpk. Susanto, M.Si", email: "susanto@surabaya.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08151234569", instância: "Sekretariat Daerah Kota Surabaya", jabatan: "Koordinator" },
        pendidikan: { nama: "Ibu Maya Kumala, S.Pd", email: "maya@surabaya.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08151234570", instansi: "Dinas Pendidikan Kota Surabaya", jabatan: "Anggota" },
        pppa: { nama: "Bpk. Ali Akbar, M.H", email: "ali@surabaya.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08151234571", instansi: "DP3A Kota Surabaya", jabatan: "Anggota" },
        sosial: { nama: "Ibu Ratna Sari, S.Sos", email: "ratna@surabaya.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08151234572", instância: "Dinas Sosial Kota Surabaya", jabatan: "Anggota" },
        kesehatan: { nama: "Dr. Wahyu Nugroho", email: "wahyu@surabaya.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08151234573", instansi: "Dinas Kesehatan Kota Surabaya", jabatan: "Anggota" },
        kominfo: { nama: "Bpk. Dimaz Prasetyo, S.Kom", email: "dimaz@surabaya.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08151234574", instância: "Dinas Kominfo Kota Surabaya", jabatan: "Anggota" },
        dukbangga: { nama: "Ibu Sinta Wahyuni, M.Acc", email: "sinta@surabaya.go.id", jenisKelamin: "Perempuan" as const, noWhatsapp: "08151234575", instância: "BPKAD Kota Surabaya", jabatan: "Anggota" },
      }, 
      sk: { file: null, nomorSK: "101/004/2024", tanggalSK: "2024-02-01", periodeMultai: "2024-02-01", periodeSelesai: "2027-01-31" } 
    } 
  },
  { 
    id: "p4a", 
    nama: "Kab. Bekasi", 
    status: "butuh-perbaikan", 
    tanggalDiverifikasi: "2024-02-10",
    validasiLog: [
      { tanggal: "2024-02-01", aksi: "pengajuan", aktor: "user" },
      { tanggal: "2024-02-10", aksi: "tolak", aktor: "admin_pusat", alasan: "SK tidak valid" }
    ],
    data: { 
      region: "Jawa Barat", 
      nomorKanal: "0816xxx", 
      members: { 
        catatan: { nama: "Bpk. Herman, M.Pd", email: "herman@bekasi.go.id", jenisKelamin: "Laki-Laki" as const, noWhatsapp: "08161234567", instância: "Dinas Pendidikan Kab. Bekasi", jabatan: "Ketua" },
      }, 
      sk: { file: null, nomorSK: "456/005/2024", tanggalSK: "2024-02-01", periodeMultai: "2024-02-01", periodeSelesai: "2027-02-01" } 
    } 
  },
  { id: "p5", nama: "Prov. Aceh", status: "belum-dibentuk", data: { region: "Aceh", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p6", nama: "Prov. Bali", status: "belum-dibentuk", data: { region: "Bali", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p7", nama: "Prov. Banten", status: "belum-dibentuk", data: { region: "Banten", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p8", nama: "Prov. Bengkulu", status: "belum-dibentuk", data: { region: "Bengkulu", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p9", nama: "Prov. D.I. Yogyakarta", status: "belum-dibentuk", data: { region: "Yogyakarta", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p10", nama: "Prov. Gorontalo", status: "belum-dibentuk", data: { region: "Gorontalo", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p11", nama: "Prov. Jambi", status: "belum-dibentuk", data: { region: "Jambi", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p12", nama: "Prov. Jawa Barat", status: "belum-dibentuk", data: { region: "Jawa Barat", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p13", nama: "Prov. Jawa Tengah", status: "belum-dibentuk", data: { region: "Jawa Tengah", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p14", nama: "Prov. Kalimantan Barat", status: "belum-dibentuk", data: { region: "Kalimantan Barat", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p15", nama: "Prov. Kalimantan Selatan", status: "belum-dibentuk", data: { region: "Kalimantan Selatan", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p16", nama: "Prov. Kalimantan Tengah", status: "belum-dibentuk", data: { region: "Kalimantan Tengah", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p17", nama: "Prov. Kalimantan Timur", status: "belum-dibentuk", data: { region: "Kalimantan Timur", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p18", nama: "Prov. Lampung", status: "belum-dibentuk", data: { region: "Lampung", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p19", nama: "Prov. Maluku", status: "belum-dibentuk", data: { region: "Maluku", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
  { id: "p20", nama: "Prov. Nusa Tenggara Barat", status: "belum-dibentuk", data: { region: "Nusa Tenggara Barat", nomorKanal: "", members: { catatan: emptyMember() }, sk: { file: null, nomorSK: "", tanggalSK: "", periodeMultai: "", periodeSelesai: "" } } },
]

function AdminPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasProcessedSubmit = useRef(false)

  const [role, setRole] = useState<AdminRole>("dinas")
  const [dinasMenu, setDinasMenu] = useState<DinaMenu>("dashboard")
  const [pusatMenu, setPusatMenu] = useState<PusatMenu>("dashboard")
  const [pengajuan, setPengajuan] = useState<PengajuanPokja[]>(MOCK_PENGAJUAN)
  const [pokjaList, setPokjaList] = useState<PokjaItem[]>(MOCK_POKJA_LIST)
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
      const stored = localStorage.getItem("pokjaList")
      const mockIds = new Set(MOCK_POKJA_LIST.map(p => p.id))
      let userPokja: PokjaItem[] = []
      if (stored) {
        const parsed = JSON.parse(stored) as PokjaItem[]
        // Strip any entry whose id collides with a mock entry
        userPokja = parsed.filter(p => !mockIds.has(p.id))
      }
      // Deduplicate remaining user entries by id
      const seen = new Set<string>(mockIds)
      const uniqueUserPokja = userPokja.filter(p => {
        if (seen.has(p.id)) return false
        seen.add(p.id)
        return true
      })
      // Immediately persist the cleaned list so stale ids are gone
      localStorage.setItem("pokjaList", JSON.stringify(uniqueUserPokja))
      setPokjaList([...MOCK_POKJA_LIST, ...uniqueUserPokja])
    } catch {
      setPokjaList(MOCK_POKJA_LIST)
    }
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
        nama: `POKJA Budaya Sekolah – ${parsed.region}`,
        status: isPusat ? "aktif" : "masih-diverifikasi",
        data: {
          ...parsed,
          sk: { ...parsed.sk, file: null, periodeMultai: parsed.sk.periodeMultai ?? "" },
        },
      }

      setPokjaList((prev) => {
        if (prev.some(p => p.id === newId)) return prev
        // Deduplicate entire list sebelum menambah item baru
        const seen = new Set<string>()
        const deduped = prev.filter(p => {
          if (seen.has(p.id)) return false
          seen.add(p.id)
          return true
        })
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
