"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, CheckCircle, Clock, PlayCircle, Landmark, Building2, GraduationCap, Heart, HelpCircle } from "lucide-react"
import { RealisasiModal } from "./RealisasiModal"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type StatusKegiatan = "menunggu" | "berlangsung" | "selesai" | "terealisasi"

export interface Kegiatan {
  id: string
  namaKegiatan: string
  penyelenggara: string[]
  tanggalMulai: string
  tanggalSelesai: string
  deskripsiKegiatan: string
  lokasi?: string
  linkGoogleMap?: string
  tautanMeeting?: string
  peserta?: { kategori: string; jumlah: string }[]
  status: StatusKegiatan
  createdAt?: string
  realize?: {
    jumlahPeserta: number
    tanggalRealisasi: string
    catatan: string
    dokumentasi: string
    createdAt: string
  } | null
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const SEED_DATA: Kegiatan[] = [
  { id: "kg-1", namaKegiatan: "Workshop PKSA", penyelenggara: ["Sekolah"], tanggalMulai: "2025-04-15", tanggalSelesai: "2025-04-15", deskripsiKegiatan: "Workshop pengenalan isu kekerasan pada anak", lokasi: "Aula Sekolah", peserta: [{ kategori: "Guru", jumlah: "20" }, { kategori: "Siswa", jumlah: "30" }], status: "selesai" },
  { id: "kg-2", namaKegiatan: "Sosialisasi Hak Anak", penyelenggara: ["Pusat", "Sekolah"], tanggalMulai: "2025-06-20", tanggalSelesai: "2025-06-21", deskripsiKegiatan: "Sosialisasi hak anak kepada seluruh siswa dan wali kelas", lokasi: "Ruang Serbaguna", linkGoogleMap: "https://maps.google.com", tautanMeeting: "https://zoom.us/j/123", peserta: [{ kategori: "Siswa", jumlah: "80" }, { kategori: "Masyarakat", jumlah: "40" }], status: "berlangsung" },
  { id: "kg-3", namaKegiatan: "Rapat Koordinasi Kelompok Kerja", penyelenggara: ["Dinas Pendidikan", "Dinas Sosial"], tanggalMulai: "2025-07-10", tanggalSelesai: "2025-07-10", deskripsiKegiatan: "Rapat koordinasi bulanan antar anggota kelompok kerja", lokasi: "Kantor Dinas Pendidikan", peserta: [{ kategori: "Guru", jumlah: "30" }], status: "menunggu" },
]

function getPenyelenggaraColors(type: string) {
  const lower = type.toLowerCase()
  if (lower === "pusat") return { bg: "bg-blue-500/10", text: "text-blue-700" }
  if (lower.startsWith("dinas")) return { bg: "bg-emerald-500/10", text: "text-emerald-700" }
  if (lower === "sekolah") return { bg: "bg-amber-500/10", text: "text-amber-700" }
  if (lower === "organisasi masyarakat") return { bg: "bg-purple-500/10", text: "text-purple-700" }
  return { bg: "bg-gray-500/10", text: "text-gray-700" }
}

function getPenyelenggaraIcon(type: string) {
  const lower = type.toLowerCase()
  if (lower === "pusat") return Landmark
  if (lower.startsWith("dinas")) return Building2
  if (lower === "sekolah") return GraduationCap
  if (lower === "organisasi masyarakat") return Heart
  return HelpCircle
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: StatusKegiatan }) {
  if (status === "terealisasi") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      <CheckCircle className="w-3 h-3" /> Terealisasi
    </span>
  )
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
          <p className="text-xs text-gray-500 mt-0.5">Daftar kegiatan yang diselenggarakan oleh Kelompok Kerja</p>
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
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lokasi</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Peserta</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Deskripsi</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                    Belum ada kegiatan
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-800">{item.namaKegiatan}</td>
                    <td className="px-4 py-3.5 text-gray-600">
                      <div className="flex flex-col gap-1">
                        {item.penyelenggara.map((p) => {
                          const Icon = getPenyelenggaraIcon(p)
                          const colors = getPenyelenggaraColors(p)
                          return (
                            <div key={p} className="flex items-center gap-1.5 px-1.5 py-1 bg-gray-50 rounded">
                              <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-4 h-4 ${colors.text}`} />
                              </div>
                              <span className="text-xs font-medium text-gray-600">{p}</span>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {(() => {
                        const fmt = (d: string) => new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })
                        return item.tanggalMulai === item.tanggalSelesai ? fmt(item.tanggalMulai) : `${fmt(item.tanggalMulai)} - ${fmt(item.tanggalSelesai)}`
                      })()}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 max-w-[150px] truncate">{item.lokasi || "-"}</td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {item.peserta && item.peserta.length > 0
                        ? item.peserta.map((p) => (
                            <span key={p.kategori} className="inline-block mr-1 last:mr-0 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded whitespace-nowrap">
                              {p.kategori}: {p.jumlah}
                            </span>
                          ))
                        : "-"}
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
