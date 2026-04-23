"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, CheckCircle, Clock, PlayCircle } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type StatusKegiatan = "selesai" | "berlangsung" | "menunggu"

export interface Kegiatan {
  id: string
  namaKegiatan: string
  penyelenggara: string
  waktuKegiatan: string
  deskripsiKegiatan: string
  dokumentasi?: string | null
  status: StatusKegiatan
  createdAt?: string
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const SEED_DATA: Kegiatan[] = [
  { id: "kg-1", namaKegiatan: "Workshop PKSA", penyelenggara: "SMA Negeri 1 Banda Aceh", waktuKegiatan: "2025-04-15T10:00", deskripsiKegiatan: "Workshop pengenalan isu kekerasan pada anak", status: "selesai" },
  { id: "kg-2", namaKegiatan: "Sosialisasi Hak Anak", penyelenggara: "SMP Negeri 2 Banda Aceh", waktuKegiatan: "2025-06-20T14:00", deskripsiKegiatan: "Sosialisasi hak anak kepada seluruh siswa dan wali kelas", status: "berlangsung" },
  { id: "kg-3", namaKegiatan: "Rapat Koordinasi Kelompok Kerja", penyelenggara: "Dinas Pendidikan Prov Aceh", waktuKegiatan: "2025-07-10T09:00", deskripsiKegiatan: "Rapat koordinasi bulanan antar anggota kelompok kerja", status: "menunggu" },
]

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: StatusKegiatan }) {
  if (status === "selesai") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      <CheckCircle className="w-3 h-3" /> Selesai
    </span>
  )
  if (status === "berlangsung") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
      <PlayCircle className="w-3 h-3" /> Berlangsung
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Menunggu
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------
export function KegiatanView() {
  const [list, setList] = useState<Kegiatan[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loadData = () => {
      try {
        const stored: Kegiatan[] = JSON.parse(sessionStorage.getItem("kegiatanList") ?? "[]")
        const storedMap = new Map(stored.map((i) => [i.id, i]))
        const seedMerged = SEED_DATA.map((s) => storedMap.has(s.id) ? { ...s, ...storedMap.get(s.id) } : s)
        const newItems = stored.filter((i) => !SEED_DATA.find((s) => s.id === i.id))
        setList([...seedMerged, ...newItems])
      } catch {
        setList([...SEED_DATA])
      }
    }

    setMounted(true)
    loadData()

    // storage fires in other tabs; kegiatanUpdated fires in the same tab
    const onStorage = (e: StorageEvent) => { if (e.key === "kegiatanList") loadData() }
    window.addEventListener("storage", onStorage)
    window.addEventListener("kegiatanUpdated", loadData)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("kegiatanUpdated", loadData)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kegiatan</h2>
          <p className="text-xs text-gray-500 mt-0.5">Daftar kegiatan yang diselenggarakan oleh kelompok kerja</p>
        </div>
        <a
          href="/tambah-kegiatan"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Kegiatan
        </a>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Kegiatan</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Penyelenggara</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Waktu</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Deskripsi</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    Belum ada kegiatan
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-800">{item.namaKegiatan}</td>
                    <td className="px-4 py-3.5 text-gray-600">{item.penyelenggara}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {new Date(item.waktuKegiatan).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 max-w-[200px] truncate">{item.deskripsiKegiatan}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={`/tambah-kegiatan?view=${item.id}`}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition border border-blue-200 whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" /> Cek Detail
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
