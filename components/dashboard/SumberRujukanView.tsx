"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Heart, Scale, Shield, Phone, MapPin, Plus,
  Search, MessageCircle, Globe, Lock, Users,
  Building2, GraduationCap, HandHeart, Radio,
  ChevronRight, X, Pencil, Trash2, CheckCircle,
  XCircle, ExternalLink, RotateCcw, Clock,
} from "lucide-react"
import { DEFAULT_DINAS_NAMA, getDinasNamaForLogs } from "@/lib/auth-session"
import { RUJUKAN_LOG, dinasLog, formatLogTerakhirDisplay, getStatusAfterRestore } from "@/lib/rujukan-logs"

const D_SEED = DEFAULT_DINAS_NAMA
const actorDinasSeed = `Admin ${D_SEED}`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type KategoriDukungan =
  | "Fasilitas Kesehatan" | "Konseling" | "Bantuan Hukum"
  | "Kepolisian" | "Psikologi" | "Pendidikan" | "Sosial" | "Lainnya"

export type KategoriPenyedia = "Pemerintah Pusat" | "Pemerintah Daerah" | "Swasta" | "OMS"
export type StatusRujukan = "terverifikasi" | "menunggu" | "menunggu_review" | "dihapus"

export interface SumberRujukan {
  id: string
  namaInstansi: string
  kategoriBentukDukungan: KategoriDukungan
  kategoriPenyedia: KategoriPenyedia | ""
  provinsi: string
  kabupatenKota: string
  kecamatan?: string
  kelurahan?: string
  namaJalan?: string
  nomorJalan?: string
  kodePos?: string
  tautanGoogleMaps?: string
  nomorCallCenter: string
  nomorPribadi?: string
  website?: string
  aksesInfo: "publik" | "terbatas"
  status: StatusRujukan
  dibuatOleh: string
  logTerakhir?: string
  /** Asal usulan entri menunggu verifikasi (mempengaruhi teks log bila belum ada `logTerakhir`). */
  usulanDari?: "dinas" | "sekolah" | "pusat"
  /** Nama sekolah untuk log "Dibuat oleh Admin Sekolah …". */
  namaSekolah?: string
  createdAt?: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
export const KATEGORI_CONFIG: Record<KategoriDukungan, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  "Fasilitas Kesehatan": { label: "Fasilitas Kesehatan", icon: <Heart className="w-3.5 h-3.5" />,        color: "text-rose-600",   bg: "bg-rose-100" },
  "Konseling":           { label: "Konseling",           icon: <MessageCircle className="w-3.5 h-3.5" />, color: "text-purple-600", bg: "bg-purple-100" },
  "Bantuan Hukum":       { label: "Bantuan Hukum",       icon: <Scale className="w-3.5 h-3.5" />,         color: "text-blue-600",   bg: "bg-blue-100" },
  "Kepolisian":          { label: "Kepolisian",          icon: <Shield className="w-3.5 h-3.5" />,        color: "text-indigo-600", bg: "bg-indigo-100" },
  "Psikologi":           { label: "Psikologi",           icon: <HandHeart className="w-3.5 h-3.5" />,     color: "text-pink-600",   bg: "bg-pink-100" },
  "Pendidikan":          { label: "Pendidikan",          icon: <GraduationCap className="w-3.5 h-3.5" />, color: "text-green-600",  bg: "bg-green-100" },
  "Sosial":              { label: "Sosial",              icon: <Building2 className="w-3.5 h-3.5" />,     color: "text-amber-600",  bg: "bg-amber-100" },
  "Lainnya":             { label: "Lainnya",             icon: <Radio className="w-3.5 h-3.5" />,         color: "text-gray-600",   bg: "bg-gray-100" },
}

export const PENYEDIA_CONFIG: Record<string, { color: string; bg: string }> = {
  "Pemerintah Pusat":  { color: "text-blue-700",   bg: "bg-blue-50" },
  "Pemerintah Daerah": { color: "text-indigo-700", bg: "bg-indigo-50" },
  "Swasta":            { color: "text-amber-700",  bg: "bg-amber-50" },
  "OMS":               { color: "text-green-700",  bg: "bg-green-50" },
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
export const SEED: SumberRujukan[] = [
  {
    id: "sr-review-1",
    namaInstansi: "Unit Layanan Psikologi Terpadu (contoh menunggu review)",
    kategoriBentukDukungan: "Psikologi",
    kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Aceh",
    kabupatenKota: "Banda Aceh",
    namaJalan: "Jl. Teuku Umar",
    nomorJalan: "No. 45",
    nomorCallCenter: "065199988",
    aksesInfo: "publik",
    status: "menunggu_review",
    dibuatOleh: actorDinasSeed,
    usulanDari: "dinas",
    logTerakhir: dinasLog.menungguReview(D_SEED),
  },
  {
    id: "sr-1", namaInstansi: "RSUD Zainoel Abidin",
    kategoriBentukDukungan: "Fasilitas Kesehatan", kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Tgk. Daud Beureueh", nomorJalan: "No. 108",
    nomorCallCenter: "065123560", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: actorDinasSeed,
    usulanDari: "dinas",
    logTerakhir: dinasLog.diperbaharui(D_SEED),
  },
  {
    id: "sr-2", namaInstansi: "Puskesmas Baiturrahman",
    kategoriBentukDukungan: "Fasilitas Kesehatan", kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Sri Ratu Safiatuddin",
    nomorCallCenter: "065122345", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: actorDinasSeed,
    usulanDari: "dinas",
    logTerakhir: dinasLog.dibuatTerverifikasi(D_SEED),
  },
  {
    id: "sr-3", namaInstansi: "Pusat Konseling Remaja Aceh",
    kategoriBentukDukungan: "Konseling", kategoriPenyedia: "OMS",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Teungku Chik Ditiro", nomorJalan: "No. 26",
    nomorCallCenter: "065131456", nomorPribadi: "08127654321", aksesInfo: "terbatas", status: "menunggu",
    dibuatOleh: "Admin Sekolah SMAN 1 Banda Aceh",
    usulanDari: "sekolah",
    namaSekolah: "SMAN 1 Banda Aceh",
    logTerakhir: RUJUKAN_LOG.dibuatSekolah("SMAN 1 Banda Aceh"),
  },
  {
    id: "sr-4", namaInstansi: "LBH Banda Aceh",
    kategoriBentukDukungan: "Bantuan Hukum", kategoriPenyedia: "OMS",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. T. Daud Syah", nomorJalan: "No. 5",
    nomorCallCenter: "065127890", aksesInfo: "publik", status: "menunggu",
    dibuatOleh: "Admin Sekolah SMAN 2 Banda Aceh",
    usulanDari: "sekolah",
    namaSekolah: "SMAN 2 Banda Aceh",
    logTerakhir: RUJUKAN_LOG.dibuatSekolah("SMAN 2 Banda Aceh"),
  },
  {
    id: "sr-5", namaInstansi: "Polresta Banda Aceh",
    kategoriBentukDukungan: "Kepolisian", kategoriPenyedia: "Pemerintah Pusat",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Sultan Malikul Saleh",
    nomorCallCenter: "110", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat",
    usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
  },
  {
    id: "sr-6",
    namaInstansi: "UPTD Dinas Sosial Kota Banda Aceh",
    kategoriBentukDukungan: "Sosial",
    kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Aceh",
    kabupatenKota: "Banda Aceh",
    namaJalan: "Jl. T. Amir Hamzah",
    nomorCallCenter: "065112233",
    aksesInfo: "publik",
    status: "terverifikasi",
    dibuatOleh: actorDinasSeed,
    usulanDari: "dinas",
    logTerakhir: dinasLog.dibuatTerverifikasi(D_SEED),
  },
  {
    id: "sr-7",
    namaInstansi: "Klinik Pratama Medika (contoh arsip dihapus)",
    kategoriBentukDukungan: "Fasilitas Kesehatan",
    kategoriPenyedia: "Swasta",
    provinsi: "Aceh",
    kabupatenKota: "Banda Aceh",
    namaJalan: "Jl. Prof. Ali Hasyimi No. 20",
    nomorCallCenter: "065145678",
    aksesInfo: "publik",
    status: "dihapus",
    dibuatOleh: actorDinasSeed,
    usulanDari: "dinas",
    logTerakhir: dinasLog.dihapus(D_SEED),
  },
]

// ---------------------------------------------------------------------------
// Status badge (non-clickable)
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: StatusRujukan }) {
  if (status === "terverifikasi") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3" /> Terverifikasi
      </span>
    )
  }
  if (status === "menunggu") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Menunggu Verifikasi
      </span>
    )
  }
  if (status === "menunggu_review") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
        <Clock className="w-3 h-3" /> Menunggu Review
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
      <XCircle className="w-3 h-3" /> Dihapus
    </span>
  )
}

// ---------------------------------------------------------------------------
// Detail slide-over panel
// ---------------------------------------------------------------------------
function DetailPanel({
  item,
  dinasNamaForLog,
  onClose,
  onVerify,
  onUnverify,
  onEdit,
  onDelete,
  onRestore,
}: {
  item: SumberRujukan
  dinasNamaForLog: string
  onClose: () => void
  onVerify: (id: string) => void
  onUnverify: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}) {
  const kategoriCfg = KATEGORI_CONFIG[item.kategoriBentukDukungan]
  const penyediaCfg = item.kategoriPenyedia ? PENYEDIA_CONFIG[item.kategoriPenyedia] : null
  const alamat = [item.namaJalan, item.nomorJalan, item.kelurahan, item.kecamatan, item.kabupatenKota, item.provinsi, item.kodePos]
    .filter(Boolean).join(", ")

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${kategoriCfg.bg} ${kategoriCfg.color} flex items-center justify-center flex-shrink-0`}>
              {kategoriCfg.icon}
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">{item.namaInstansi}</h2>
              <StatusBadge status={item.status} />
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Kategori & Penyedia */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Kategori Dukungan</p>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${kategoriCfg.bg} ${kategoriCfg.color}`}>
                {kategoriCfg.icon} {kategoriCfg.label}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Kategori Penyedia</p>
              {penyediaCfg && item.kategoriPenyedia ? (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${penyediaCfg.bg} ${penyediaCfg.color}`}>
                  {item.kategoriPenyedia}
                </span>
              ) : <span className="text-gray-400 text-xs">-</span>}
            </div>
          </div>

          {/* Alamat */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Alamat</p>
            <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{alamat || "-"}</p>
            </div>
            {item.tautanGoogleMaps && (
              <a href={item.tautanGoogleMaps} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-600 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> Lihat di Google Maps
              </a>
            )}
          </div>

          {/* Kontak */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kontak</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Call Center</p>
                  <p className="text-sm font-medium text-gray-900">{item.nomorCallCenter}</p>
                </div>
              </div>
              {item.nomorPribadi && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                  <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Nomor Pribadi</p>
                    <p className="text-sm font-medium text-gray-900">{item.nomorPribadi}</p>
                  </div>
                </div>
              )}
              {item.website && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                  <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <a href={item.website} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline break-all">{item.website}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Akses & Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Akses Informasi</p>
              {item.aksesInfo === "publik" ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                  <Users className="w-3.5 h-3.5" /> Publik
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                  <Lock className="w-3.5 h-3.5" /> Terbatas
                </span>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Dibuat Oleh</p>
              <p className="text-xs font-medium text-gray-800 leading-snug">{item.dibuatOleh}</p>
            </div>
          </div>

          {/* Log Terakhir */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Log Terakhir</p>
            <p className="text-xs text-gray-700">{formatLogTerakhirDisplay(item, dinasNamaForLog)}</p>
          </div>
        </div>

        {/* Footer actions – depend on status */}
        <div className="flex-shrink-0 border-t border-gray-200 px-5 py-4 space-y-2 bg-white">
          {item.status === "dihapus" ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => { onRestore(item.id); onClose() }}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Pulihkan
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Tutup
              </button>
            </div>
          ) : (
            <>
              {(item.status === "menunggu" || item.status === "menunggu_review") && (
                <button
                  type="button"
                  onClick={() => { onVerify(item.id); onClose() }}
                  className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Verifikasi
                </button>
              )}
              {item.status === "terverifikasi" && (
                <button
                  type="button"
                  onClick={() => { onUnverify(item.id); onClose() }}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Batalkan Verifikasi
                </button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { onEdit(item.id); onClose() }}
                  className="py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => { onDelete(item.id); onClose() }}
                  className="py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------
export function SumberRujukanView() {
  const router = useRouter()
  const dinasNamaLog = getDinasNamaForLogs()
  const [list, setList] = useState<SumberRujukan[]>(SEED)
  const [search, setSearch] = useState("")
  const [filterKategori, setFilterKategori] = useState<KategoriDukungan | "semua">("semua")
  const [filterStatus, setFilterStatus] = useState<StatusRujukan | "semua">("semua")
  const [filterPenyedia, setFilterPenyedia] = useState<KategoriPenyedia | "semua">("semua")
  const [selected, setSelected] = useState<SumberRujukan | null>(null)

  useEffect(() => {
    const loadData = () => {
      try {
        const raw = sessionStorage.getItem("rujukanList")
        let stored: Array<Partial<SumberRujukan> & { id: string }> = []
        if (raw != null && raw !== "") {
          const parsed = JSON.parse(raw) as unknown
          if (Array.isArray(parsed)) stored = parsed as Array<Partial<SumberRujukan> & { id: string }>
        }
        const storedMap = new Map(stored.map((i) => [i.id, i]))
        const seedMerged = SEED.map((s) => (storedMap.has(s.id) ? { ...s, ...storedMap.get(s.id) } : s)) as SumberRujukan[]
        const newItems = stored.filter((i) => !SEED.find((s) => s.id === i.id)) as SumberRujukan[]
        const merged = [...seedMerged, ...newItems]
        setList(merged.length > 0 ? merged : [...SEED])
      } catch {
        setList([...SEED])
      }
    }

    loadData()

    // storage fires in other tabs; rujukanUpdated fires in the same tab from RujukanForm
    const onStorage = (e: StorageEvent) => { if (e.key === "rujukanList") loadData() }
    window.addEventListener("storage", onStorage)
    window.addEventListener("rujukanUpdated", loadData)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("rujukanUpdated", loadData)
    }
  }, [])

  const filtered = list.filter((item) => {
    const matchSearch =
      search.trim() === "" ||
      item.namaInstansi.toLowerCase().includes(search.toLowerCase()) ||
      item.kabupatenKota.toLowerCase().includes(search.toLowerCase())
    const matchKategori = filterKategori === "semua" || item.kategoriBentukDukungan === filterKategori
    const matchStatus = filterStatus === "semua" || item.status === filterStatus
    const matchPenyedia = filterPenyedia === "semua" || item.kategoriPenyedia === filterPenyedia
    return matchSearch && matchKategori && matchStatus && matchPenyedia
  })

  const persistRujukanPatch = (id: string, patch: Partial<SumberRujukan> & { status?: StatusRujukan }) => {
    try {
      const stored: Array<Record<string, unknown> & { id: string }> = JSON.parse(sessionStorage.getItem("rujukanList") ?? "[]")
      const idx = stored.findIndex((row) => row.id === id)
      if (idx >= 0) {
        stored[idx] = { ...stored[idx], ...patch, id }
      } else {
        const seed = SEED.find((s) => s.id === id)
        stored.push({ ...(seed ?? { id }), ...patch, id } as Record<string, unknown> & { id: string })
      }
      sessionStorage.setItem("rujukanList", JSON.stringify(stored))
      window.dispatchEvent(new CustomEvent("rujukanUpdated"))
    } catch { /* ignore */ }
  }

  const handleVerify = (id: string) => {
    const log = dinasLog.diverifikasi(dinasNamaLog)
    persistRujukanPatch(id, { status: "terverifikasi", logTerakhir: log })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: "terverifikasi" as StatusRujukan, logTerakhir: log } : i
    ))
  }

  const handleUnverify = (id: string) => {
    const log = dinasLog.batalkanVerifikasi(dinasNamaLog)
    persistRujukanPatch(id, { status: "menunggu", logTerakhir: log })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: "menunggu" as StatusRujukan, logTerakhir: log } : i
    ))
  }

  const handleDelete = (id: string) => {
    const log = dinasLog.dihapus(dinasNamaLog)
    persistRujukanPatch(id, { status: "dihapus", logTerakhir: log })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: "dihapus" as StatusRujukan, logTerakhir: log } : i
    ))
  }

  const handleRestore = (id: string) => {
    const item = list.find((i) => i.id === id)
    if (!item) return
    const nextStatus = getStatusAfterRestore(item.usulanDari)
    const logTerakhir = dinasLog.dipulihkan(dinasNamaLog)
    persistRujukanPatch(id, { status: nextStatus, logTerakhir })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: nextStatus, logTerakhir } : i
    ))
  }

  const handleEdit = (id: string) => router.push(`/sumber-rujukan/form?edit=${id}`)

  const statKeys: KategoriDukungan[] = ["Fasilitas Kesehatan", "Konseling", "Bantuan Hukum", "Kepolisian"]

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sumber Rujukan</h2>
          <p className="text-xs text-gray-500 mt-0.5">Daftar kontak layanan untuk upaya preventif permasalahan di sekolah</p>
        </div>
        <button
          onClick={() => router.push("/sumber-rujukan/form")}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Sumber Rujukan
        </button>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statKeys.map((key) => {
          const cfg = KATEGORI_CONFIG[key]
          const count = list.filter((i) => i.kategoriBentukDukungan === key && i.status !== "dihapus").length
          return (
            <div key={key} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${cfg.bg} ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                {cfg.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 leading-tight">{cfg.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-end">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama instansi atau kota..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value as KategoriDukungan | "semua")}
          className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="semua">Semua Kategori</option>
          {(Object.keys(KATEGORI_CONFIG) as KategoriDukungan[]).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as StatusRujukan | "semua")}
          className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="semua">Semua Status</option>
          <option value="terverifikasi">Terverifikasi</option>
          <option value="menunggu">Menunggu Verifikasi</option>
          <option value="menunggu_review">Menunggu Review</option>
          <option value="dihapus">Dihapus</option>
        </select>
        <select
          value={filterPenyedia}
          onChange={(e) => setFilterPenyedia(e.target.value as KategoriPenyedia | "semua")}
          className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="semua">Semua Penyedia</option>
          {(["Pemerintah Pusat", "Pemerintah Daerah", "Swasta", "OMS"] as KategoriPenyedia[]).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="font-semibold text-gray-700 text-sm">Tidak ada sumber rujukan ditemukan</p>
          <p className="text-gray-500 text-xs mt-1">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Instansi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori Dukungan</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Penyedia</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dibuat Oleh</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Log Terakhir</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const kategoriCfg = KATEGORI_CONFIG[item.kategoriBentukDukungan]
                  const penyediaCfg = item.kategoriPenyedia ? PENYEDIA_CONFIG[item.kategoriPenyedia] : null
                  return (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.status === "dihapus" ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-gray-900 whitespace-nowrap">{item.namaInstansi}</p>
                        {item.website && (
                          <a href={item.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5">
                            <Globe className="w-3 h-3" /> Website
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${kategoriCfg.bg} ${kategoriCfg.color}`}>
                          {kategoriCfg.icon}
                          <span className="whitespace-nowrap">{kategoriCfg.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {penyediaCfg && item.kategoriPenyedia ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${penyediaCfg.bg} ${penyediaCfg.color}`}>
                            {item.kategoriPenyedia}
                          </span>
                        ) : <span className="text-gray-400 text-xs">-</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-gray-600 max-w-[160px] leading-relaxed">{item.dibuatOleh}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-gray-600 max-w-[220px] leading-relaxed">{formatLogTerakhirDisplay(item, dinasNamaLog)}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <a
                          href={`/sumber-rujukan/form?view=${item.id}`}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition whitespace-nowrap"
                        >
                          Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail slide-over */}
      {selected && (
        <DetailPanel
          item={selected}
          dinasNamaForLog={dinasNamaLog}
          onClose={() => setSelected(null)}
          onVerify={handleVerify}
          onUnverify={handleUnverify}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      )}
    </div>
  )
}
