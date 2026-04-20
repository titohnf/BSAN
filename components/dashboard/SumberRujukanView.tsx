"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Heart, Scale, Shield, Phone, MapPin, Plus,
  Search, MessageCircle, Globe, Lock, Users,
  Building2, GraduationCap, HandHeart, Radio,
  ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, ChevronsDown,
  X, Pencil, Trash2, CheckCircle,
  XCircle, ExternalLink, RotateCcw, Clock, ArrowUpDown, Download,
  Upload, FileSpreadsheet, AlertCircle,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEFAULT_DINAS_NAMA, getDinasNamaForLogs, readAuthSession } from "@/lib/auth-session"
import { RUJUKAN_LOG, dinasLog, formatLogTerakhirDisplay, getStatusAfterRestore } from "@/lib/rujukan-logs"

const D_SEED = DEFAULT_DINAS_NAMA
const actorDinasSeed = `Admin ${D_SEED}`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type KategoriDukungan =
  | "Fasilitas Kesehatan" | "Konseling" | "Bantuan Hukum"
  | "Kepolisian" | "Psikologi" | "Pendidikan" | "Sosial" | "Lainnya"

export type KategoriPenyedia = "Pemerintah Pusat" | "Pemerintah Daerah" | "Swasta" | "OMS" | "Lainnya"
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
  "Lainnya":           { color: "text-gray-700",   bg: "bg-gray-100" },
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
export const SEED: SumberRujukan[] = [
  {
    id: "sr-review-1",
    namaInstansi: "Unit Layanan Psikologi Terpadu",
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
    dibuatOleh: actorDinasSeed, usulanDari: "dinas",
    logTerakhir: dinasLog.diperbaharui(D_SEED),
  },
  {
    id: "sr-2", namaInstansi: "Puskesmas Baiturrahman",
    kategoriBentukDukungan: "Fasilitas Kesehatan", kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Sri Ratu Safiatuddin",
    nomorCallCenter: "065122345", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: actorDinasSeed, usulanDari: "dinas",
    logTerakhir: dinasLog.dibuatTerverifikasi(D_SEED),
  },
  {
    id: "sr-3", namaInstansi: "Pusat Konseling Remaja Aceh",
    kategoriBentukDukungan: "Konseling", kategoriPenyedia: "OMS",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Teungku Chik Ditiro", nomorJalan: "No. 26",
    nomorCallCenter: "065131456", nomorPribadi: "08127654321", aksesInfo: "terbatas", status: "menunggu",
    dibuatOleh: "Admin Sekolah SMAN 1 Banda Aceh", usulanDari: "sekolah", namaSekolah: "SMAN 1 Banda Aceh",
    logTerakhir: RUJUKAN_LOG.dibuatSekolah("SMAN 1 Banda Aceh"),
  },
  {
    id: "sr-4", namaInstansi: "LBH Banda Aceh",
    kategoriBentukDukungan: "Bantuan Hukum", kategoriPenyedia: "OMS",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. T. Daud Syah", nomorJalan: "No. 5",
    nomorCallCenter: "065127890", aksesInfo: "publik", status: "menunggu",
    dibuatOleh: "Admin Sekolah SMAN 2 Banda Aceh", usulanDari: "sekolah", namaSekolah: "SMAN 2 Banda Aceh",
    logTerakhir: RUJUKAN_LOG.dibuatSekolah("SMAN 2 Banda Aceh"),
  },
  {
    id: "sr-5", namaInstansi: "Polresta Banda Aceh",
    kategoriBentukDukungan: "Kepolisian", kategoriPenyedia: "Pemerintah Pusat",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Sultan Malikul Saleh",
    nomorCallCenter: "110", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat", usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
  },
  {
    id: "sr-6",
    namaInstansi: "UPTD Dinas Sosial Kota Banda Aceh",
    kategoriBentukDukungan: "Sosial", kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. T. Amir Hamzah",
    nomorCallCenter: "065112233", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: actorDinasSeed, usulanDari: "dinas",
    logTerakhir: dinasLog.dibuatTerverifikasi(D_SEED),
  },
  {
    id: "sr-7",
    namaInstansi: "Klinik Pratama Medika",
    kategoriBentukDukungan: "Fasilitas Kesehatan", kategoriPenyedia: "Swasta",
    provinsi: "Aceh", kabupatenKota: "Banda Aceh", namaJalan: "Jl. Prof. Ali Hasyimi No. 20",
    nomorCallCenter: "065145678", aksesInfo: "publik", status: "dihapus",
    dibuatOleh: actorDinasSeed, usulanDari: "dinas",
    logTerakhir: dinasLog.dihapus(D_SEED),
  },
  // --- Seed lintas wilayah untuk demo fitur "Semua Wilayah" ---
  {
    id: "sr-jkt-1", namaInstansi: "RSUP Dr. Cipto Mangunkusumo",
    kategoriBentukDukungan: "Fasilitas Kesehatan", kategoriPenyedia: "Pemerintah Pusat",
    provinsi: "DKI Jakarta", kabupatenKota: "Jakarta Pusat", namaJalan: "Jl. Diponegoro", nomorJalan: "No. 71",
    nomorCallCenter: "02119408991", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat", usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
  },
  {
    id: "sr-jkt-2", namaInstansi: "LBH Jakarta",
    kategoriBentukDukungan: "Bantuan Hukum", kategoriPenyedia: "OMS",
    provinsi: "DKI Jakarta", kabupatenKota: "Jakarta Pusat", namaJalan: "Jl. Diponegoro", nomorJalan: "No. 74",
    nomorCallCenter: "02131925276", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat", usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
  },
  {
    id: "sr-jkt-3", namaInstansi: "Komnas Perempuan",
    kategoriBentukDukungan: "Bantuan Hukum", kategoriPenyedia: "Pemerintah Pusat",
    provinsi: "DKI Jakarta", kabupatenKota: "Jakarta Pusat", namaJalan: "Jl. Latuharhary", nomorJalan: "No. 4B",
    nomorCallCenter: "02139007748", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat", usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
  },
  {
    id: "sr-sby-1", namaInstansi: "RSUD Dr. Soetomo",
    kategoriBentukDukungan: "Fasilitas Kesehatan", kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Jawa Timur", kabupatenKota: "Surabaya", namaJalan: "Jl. Mayjen Prof. Dr. Moestopo", nomorJalan: "No. 6-8",
    nomorCallCenter: "0315501078", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat", usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
  },
  {
    id: "sr-mks-1", namaInstansi: "Yayasan Lembaga Konsumen Indonesia — Makassar",
    kategoriBentukDukungan: "Konseling", kategoriPenyedia: "OMS",
    provinsi: "Sulawesi Selatan", kabupatenKota: "Makassar", namaJalan: "Jl. AP. Pettarani",
    nomorCallCenter: "04114119600", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat", usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
  },
  {
    id: "sr-mdn-1", namaInstansi: "P2TP2A Kota Medan",
    kategoriBentukDukungan: "Sosial", kategoriPenyedia: "Pemerintah Daerah",
    provinsi: "Sumatera Utara", kabupatenKota: "Medan", namaJalan: "Jl. Kapten Maulana Lubis",
    nomorCallCenter: "0618458844", aksesInfo: "publik", status: "terverifikasi",
    dibuatOleh: "Admin Pusat", usulanDari: "pusat",
    logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
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
    <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
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

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
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
        </div>
      </div>
    </div>
  )
}
// ---------------------------------------------------------------------------
// Provinsi list for filter
// ---------------------------------------------------------------------------
const PROVINSI_LIST = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Bengkulu", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Lampung",
  "DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Maluku", "Maluku Utara", "Papua Barat", "Papua",
]

type SortMode = "relevansi" | "terbaru" | "nama_az"

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------
export function SumberRujukanView({ wilayahDinas }: { wilayahDinas?: { provinsi: string; kabupatenKota: string } }) {
  const router = useRouter()
  const dinasNamaLog = getDinasNamaForLogs()

  // Wilayah dinas dari prop atau fallback ke Aceh / Banda Aceh
  const myProvinsi = wilayahDinas?.provinsi ?? "Aceh"
  const myKabupatenKota = wilayahDinas?.kabupatenKota ?? "Banda Aceh"
  const auth = readAuthSession()
  const isPusat = auth?.role === "pusat"

  const [list, setList] = useState<SumberRujukan[]>(SEED)
  const [search, setSearch] = useState("")
  const [filterWilayah, setFilterWilayah] = useState<{ province: string; kabupaten: string } | null>(isPusat ? null : { province: myProvinsi, kabupaten: myKabupatenKota })
  const [filterKategori, setFilterKategori] = useState<KategoriDukungan | "semua">("semua")
  const [filterStatus, setFilterStatus] = useState<StatusRujukan | "semua">("semua")
  const [filterPenyedia, setFilterPenyedia] = useState<KategoriPenyedia | "semua">("semua")
  const [sortMode, setSortMode] = useState<SortMode>("relevansi")
  const [selected, setSelected] = useState<SumberRujukan | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showWilayahModal, setShowWilayahModal] = useState(false)
  const [showStats, setShowStats] = useState(true)

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterWilayah, filterKategori, filterStatus, filterPenyedia, sortMode])

  const filtered = list
    .filter((item) => {
      const matchSearch =
        search.trim() === "" ||
        item.namaInstansi.toLowerCase().includes(search.toLowerCase()) ||
        item.kabupatenKota.toLowerCase().includes(search.toLowerCase()) ||
        item.provinsi.toLowerCase().includes(search.toLowerCase())
      const matchWilayah = !filterWilayah || 
        (filterWilayah.province === item.provinsi && (!filterWilayah.kabupaten || item.kabupatenKota === filterWilayah.kabupaten))
      const matchKategori = filterKategori === "semua" || item.kategoriBentukDukungan === filterKategori
      const matchStatus = filterStatus === "semua" || item.status === filterStatus
      const matchPenyedia = filterPenyedia === "semua" || item.kategoriPenyedia === filterPenyedia
      return matchSearch && matchWilayah && matchKategori && matchStatus && matchPenyedia
    })
    .sort((a, b) => {
      if (sortMode === "nama_az") return a.namaInstansi.localeCompare(b.namaInstansi)
      if (sortMode === "terbaru") return (b.createdAt ?? b.id).localeCompare(a.createdAt ?? a.id)
      // relevansi: wilayah sendiri → provinsi sama → lainnya
      const rankA = a.kabupatenKota === myKabupatenKota && a.provinsi === myProvinsi ? 0 : a.provinsi === myProvinsi ? 1 : 2
      const rankB = b.kabupatenKota === myKabupatenKota && b.provinsi === myProvinsi ? 0 : b.provinsi === myProvinsi ? 1 : 2
      return rankA - rankB
    })

  // Pagination calculations
  const totalRows = filtered.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const paginatedData = filtered.slice(startIndex, endIndex)

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
    const isPusat = readAuthSession()?.role === "pusat"
    const log = isPusat ? RUJUKAN_LOG.diverifikasiPusat : dinasLog.diverifikasi(dinasNamaLog)
    persistRujukanPatch(id, { status: "terverifikasi", logTerakhir: log })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: "terverifikasi" as StatusRujukan, logTerakhir: log } : i
    ))
  }

  const handleUnverify = (id: string) => {
    const isPusat = readAuthSession()?.role === "pusat"
    const log = isPusat ? RUJUKAN_LOG.batalkanVerifikasiPusat : dinasLog.batalkanVerifikasi(dinasNamaLog)
    persistRujukanPatch(id, { status: "menunggu", logTerakhir: log })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: "menunggu" as StatusRujukan, logTerakhir: log } : i
    ))
  }

  const handleDelete = (id: string) => {
    const isPusat = readAuthSession()?.role === "pusat"
    const log = isPusat ? RUJUKAN_LOG.dihapusPusat : dinasLog.dihapus(dinasNamaLog)
    persistRujukanPatch(id, { status: "dihapus", logTerakhir: log })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: "dihapus" as StatusRujukan, logTerakhir: log } : i
    ))
  }

  const handleRestore = (id: string) => {
    const item = list.find((i) => i.id === id)
    if (!item) return
    const nextStatus = getStatusAfterRestore(item.usulanDari)
    const isPusat = readAuthSession()?.role === "pusat"
    const logTerakhir = isPusat ? RUJUKAN_LOG.dipulihkanPusat : dinasLog.dipulihkan(dinasNamaLog)
    persistRujukanPatch(id, { status: nextStatus, logTerakhir })
    setList((prev) => prev.map((i) =>
      i.id === id ? { ...i, status: nextStatus, logTerakhir } : i
    ))
  }

  const handleEdit = (id: string) => router.push(`/sumber-rujukan/form?edit=${id}`)

  const exportToCSV = () => {
    const headers = [
      "Nama Instansi", "Kategori Dukungan", "Kategori Penyedia",
      "Provinsi", "Kabupaten/Kota", "Alamat",
      "Nomor Call Center", "Nomor Pribadi", "Website",
      "Akses Informasi", "Status", "Dibuat Oleh",
    ]
    const rows = filtered.map((item) => [
      item.namaInstansi,
      item.kategoriBentukDukungan,
      item.kategoriPenyedia ?? "",
      item.provinsi ?? "",
      item.kabupatenKota ?? "",
      [item.namaJalan, item.nomorJalan, item.kodePos].filter(Boolean).join(" "),
      item.nomorCallCenter ?? "",
      item.nomorPribadi ?? "",
      item.website ?? "",
      item.aksesInfo === "publik" ? "Publik" : "Terbatas",
      item.status,
      item.dibuatOleh ?? "",
    ])
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const scopeLabel = filterProvinsi !== "semua" || filterKabupaten !== "semua"
      ? [filterKabupaten !== "semua" ? filterKabupaten : null, filterProvinsi !== "semua" ? filterProvinsi : null].filter(Boolean).join("-").replace(/\s+/g, "-")
      : "Semua"
    a.href = url
    a.download = `Sumber-Dukungan-${scopeLabel}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const PROVINSI_OPTIONS = [
    "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
    "Jambi", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu",
    "Lampung", "DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah",
    "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat",
    "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
    "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
    "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat",
    "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara",
    "Papua Barat", "Papua",
  ]
  const KATEGORI_DUKUNGAN_OPTIONS: KategoriDukungan[] = [
    "Fasilitas Kesehatan", "Konseling", "Bantuan Hukum",
    "Kepolisian", "Psikologi", "Pendidikan", "Sosial", "Lainnya",
  ]
  const KATEGORI_PENYEDIA_OPTIONS: KategoriPenyedia[] = [
    "Pemerintah Pusat", "Pemerintah Daerah", "Swasta", "OMS", "Lainnya",
  ]

  const downloadTemplate = () => {
    const headers = [
      "Nama Instansi", "Kategori Dukungan", "Kategori Penyedia",
      "Provinsi", "Kabupaten/Kota", "Kecamatan",
      "Kelurahan", "Nama Jalan", "Nomor Jalan", "Kode Pos",
      "Tautan Google Maps", "Nomor Call Center", "Nomor Pribadi",
      "Website", "Akses Informasi",
    ]
    const sampleRows = [
      ["RSUD示例", "Fasilitas Kesehatan", "Pemerintah Daerah", "Aceh", "Banda Aceh", "", "", "", "", "", "", "", "0651123456", "", "", "Publik"],
      ["Puskesmas示例", "Fasilitas Kesehatan", "Pemerintah Daerah", "Aceh", "Banda Aceh", "Baiturrahman", "Peunayong", "Jl. Sri Ratu", "", "", "", "0651987654", "", "", "Publik"],
      ["LBH示例", "Bantuan Hukum", "OMS", "Aceh", "Banda Aceh", "", "", "Jl. T. Daud", "No. 5", "", "", "", "0651123456", "0812xxxx", "www.example.org", "Terbatas"],
    ]
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
    const csv = [headers, ...sampleRows].map((row) => row.map(escape).join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "template-sumber-dukungan.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "")
    if (lines.length === 0) return { headers: [], rows: [] }
    const parseRow = (row: string): string[] => {
      const result: string[] = []
      let current = ""
      let inQuotes = false
      for (let i = 0; i < row.length; i++) {
        const char = row[i]
        if (char === '"') {
          if (inQuotes && row[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }
    const headers = parseRow(lines[0])
    const rows = lines.slice(1).map(parseRow).filter((row) => row.some((cell) => cell !== ""))
    return { headers, rows }
  }

  const validateRow = (row: string[], rowIndex: number): { valid: boolean; errors: string[]; data: Partial<SumberRujukan> } => {
    const errors: string[] = []
    const h = row
    const get = (idx: number) => h[idx] ?? ""

    const namaInstansi = get(0).trim()
    const kategoriDukungan = get(1).trim() as KategoriDukungan
    const kategoriPenyedia = get(2).trim() as KategoriPenyedia
    const provinsi = get(3).trim()
    const kabupatenKota = get(4).trim()
    const kecamatan = get(5).trim()
    const kelurahan = get(6).trim()
    const namaJalan = get(7).trim()
    const nomorJalan = get(8).trim()
    const kodePos = get(9).trim()
    const tautanGoogleMaps = get(10).trim()
    const nomorCallCenter = get(11).trim()
    const nomorPribadi = get(12).trim()
    const website = get(13).trim()
    const aksesInfoRaw = get(14).trim()
    const aksesInfo: "publik" | "terbatas" = aksesInfoRaw === "Terbatas" ? "terbatas" : "publik"

    if (!namaInstansi) errors.push(`Baris ${rowIndex + 1}: "Nama Instansi" wajib diisi`)
    if (!kategoriDukungan || !KATEGORI_DUKUNGAN_OPTIONS.includes(kategoriDukungan)) {
      errors.push(`Baris ${rowIndex + 1}: "Kategori Dukungan" tidak valid (gunakan: ${KATEGORI_DUKUNGAN_OPTIONS.join(", ")})`)
    }
    if (!kategoriPenyedia || !KATEGORI_PENYEDIA_OPTIONS.includes(kategoriPenyedia)) {
      errors.push(`Baris ${rowIndex + 1}: "Kategori Penyedia" tidak valid (gunakan: ${KATEGORI_PENYEDIA_OPTIONS.join(", ")})`)
    }
    if (!provinsi || !PROVINSI_OPTIONS.includes(provinsi)) {
      errors.push(`Baris ${rowIndex + 1}: "Provinsi" tidak valid`)
    }
    if (!kabupatenKota) errors.push(`Baris ${rowIndex + 1}: "Kabupaten/Kota" wajib diisi`)
    if (!nomorCallCenter) errors.push(`Baris ${rowIndex + 1}: "Nomor Call Center" wajib diisi`)

    return {
      valid: errors.length === 0,
      errors,
      data: {
        namaInstansi,
        kategoriBentukDukungan: kategoriDukungan as KategoriDukungan,
        kategoriPenyedia: kategoriPenyedia as KategoriPenyedia,
        provinsi,
        kabupatenKota,
        kecamatan,
        kelurahan,
        namaJalan,
        nomorJalan,
        kodePos,
        tautanGoogleMaps,
        nomorCallCenter,
        nomorPribadi,
        website,
        aksesInfo,
      },
    }
  }

  const importExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const { headers, rows } = parseCSV(text)

        if (headers.length === 0 || rows.length === 0) {
          setImportError({ show: true, message: "File tidak valid atau kosong", errors: [] })
          return
        }

        const validItems: SumberRujukan[] = []
        const allErrors: string[] = []

        rows.forEach((row, idx) => {
          const { valid, errors, data } = validateRow(row, idx)
          if (valid) {
            const newItem: SumberRujukan = {
              id: `sr-${Date.now()}-${idx}`,
              namaInstansi: data.namaInstansi!,
              kategoriBentukDukungan: data.kategoriBentukDukungan!,
              kategoriPenyedia: data.kategoriPenyedia!,
              provinsi: data.provinsi!,
              kabupatenKota: data.kabupatenKota!,
              kecamatan: data.kecamatan,
              kelurahan: data.kelurahan,
              namaJalan: data.namaJalan,
              nomorJalan: data.nomorJalan,
              kodePos: data.kodePos,
              tautanGoogleMaps: data.tautanGoogleMaps,
              nomorCallCenter: data.nomorCallCenter!,
              nomorPribadi: data.nomorPribadi,
              website: data.website,
              aksesInfo: data.aksesInfo ?? "publik",
              status: "terverifikasi",
              dibuatOleh: "Admin Pusat",
              logTerakhir: RUJUKAN_LOG.dibuatTerverifikasiPusat,
              usulanDari: "pusat",
              createdAt: new Date().toISOString(),
            }
            validItems.push(newItem)
          } else {
            allErrors.push(...errors)
          }
        })

        if (validItems.length > 0) {
          try {
            const stored = JSON.parse(sessionStorage.getItem("rujukanList") ?? "[]") as Array<Record<string, unknown>>
            sessionStorage.setItem("rujukanList", JSON.stringify([...stored, ...validItems]))
            window.dispatchEvent(new CustomEvent("rujukanUpdated"))
          } catch { /* ignore */ }
        }

        if (allErrors.length > 0) {
          setImportError({ show: true, message: `${validItems.length} berhasil, ${allErrors.length} gagal`, errors: allErrors })
        } else if (validItems.length === 0) {
          setImportError({ show: true, message: "Tidak ada data yang valid", errors: allErrors })
        } else {
          setImportSuccess({ show: true, count: validItems.length })
        }
      } catch {
        setImportError({ show: true, message: "Gagal membaca file", errors: [] })
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const [importError, setImportError] = useState<{ show: boolean; message: string; errors: string[] }>({ show: false, message: "", errors: [] })
  const [importSuccess, setImportSuccess] = useState<{ show: boolean; count: number }>({ show: false, count: 0 })

  const statKeys: KategoriDukungan[] = [
    "Fasilitas Kesehatan", "Konseling", "Bantuan Hukum", "Kepolisian",
    "Psikologi", "Pendidikan", "Sosial", "Lainnya"
  ]
  const statList = isPusat 
    ? list 
    : list.filter((i) => i.provinsi === myProvinsi && i.kabupatenKota === myKabupatenKota)

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Sumber Dukungan</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Daftar kontak layanan untuk upaya preventif permasalahan di sekolah</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Template & Import - only for Admin Pusat */}
          {isPusat && (
            <>
              <button
                type="button"
                onClick={downloadTemplate}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
              >
                <FileSpreadsheet className="w-4 h-4" /> Template
              </button>
              <label className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                <Upload className="w-4 h-4" /> Import
                <input type="file" accept=".csv,.xlsx,.xls" onChange={importExcel} className="hidden" />
              </label>
            </>
          )}
          {/* Export CSV */}
          <button
            type="button"
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          {/* Add New - Primary Action */}
          <button
            onClick={() => router.push("/sumber-rujukan/form")}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Wilayah Display with Stats Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-lg">Wilayah:</span>
          {filterWilayah ? (
            <span className="font-bold text-gray-900 text-lg">
              {filterWilayah.kabupaten 
                ? `${filterWilayah.province} - ${filterWilayah.kabupaten}` 
                : filterWilayah.province}
            </span>
          ) : (
            <span className="font-bold text-gray-500 text-lg">
              Semua Wilayah
            </span>
          )}
          <button
            onClick={() => setShowWilayahModal(true)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm underline underline-offset-2"
          >
            Ganti
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Statistik:</span>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`relative w-10 h-5 rounded-full transition-colors ${showStats ? "bg-blue-600" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showStats ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Stat cards - only show if showStats is true */}
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statKeys.map((key) => {
          const cfg = KATEGORI_CONFIG[key]
          const count = filtered.filter((i) => i.kategoriBentukDukungan === key && i.status !== "dihapus").length
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
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2 items-end flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama instansi atau kota..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <Select value={filterKategori} onValueChange={(v) => setFilterKategori(v as KategoriDukungan | "semua")}>
          <SelectTrigger className="w-[180px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kategori</SelectItem>
            {(Object.keys(KATEGORI_CONFIG) as KategoriDukungan[]).map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as StatusRujukan | "semua")}>
          <SelectTrigger className="w-[180px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
            <SelectItem value="menunggu">Menunggu Verifikasi</SelectItem>
            <SelectItem value="menunggu_review">Menunggu Review</SelectItem>
            <SelectItem value="dihapus">Dihapus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPenyedia} onValueChange={(v) => setFilterPenyedia(v as KategoriPenyedia | "semua")}>
          <SelectTrigger className="w-[180px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <SelectValue placeholder="Semua Penyedia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Penyedia</SelectItem>
            {(["Pemerintah Pusat", "Pemerintah Daerah", "Swasta", "OMS", "Lainnya"] as KategoriPenyedia[]).map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Sort */}
        <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 bg-white">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="text-sm focus:outline-none bg-transparent text-gray-700"
          >
            <option value="relevansi">Relevansi</option>
            <option value="terbaru">Terbaru</option>
            <option value="nama_az">Nama A–Z</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {totalRows === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="font-semibold text-gray-700 text-sm">Tidak ada sumber dukungan ditemukan</p>
          <p className="text-gray-500 text-xs mt-1">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Instansi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wilayah</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori Dukungan</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Penyedia</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Log Terakhir</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((item) => {
                  const kategoriCfg = KATEGORI_CONFIG[item.kategoriBentukDukungan]
                  const penyediaCfg = item.kategoriPenyedia ? PENYEDIA_CONFIG[item.kategoriPenyedia] : null
                  return (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.status === "dihapus" ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-2">
                          <div>
                            <p className="font-semibold text-gray-900 whitespace-nowrap">{item.namaInstansi}</p>
                            {item.website && (
                              <a href={item.website} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5">
                                <Globe className="w-3 h-3" /> Website
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-gray-800">{item.kabupatenKota}</p>
                        <p className="text-xs text-gray-400">{item.provinsi}</p>
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

        {totalRows > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-gray-200">
            {/* Info & Rows per page */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>
                Menampilkan {startIndex + 1}-{endIndex} dari {totalRows}
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="hidden sm:inline">baris/halaman</span>
            </div>
            {/* Page Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman pertama"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman terakhir"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        </>
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

      {/* Import Error Modal */}
      {importError.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setImportError({ show: false, message: "", errors: [] })} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Import Gagal</h3>
                <p className="text-xs text-gray-500">{importError.message}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-2">
                {importError.errors.slice(0, 20).map((err, idx) => (
                  <p key={idx} className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{err}</p>
                ))}
                {importError.errors.length > 20 && (
                  <p className="text-xs text-gray-500 text-center py-2">...dan {importError.errors.length - 20} error lainnya</p>
                )}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200">
              <button
                onClick={() => setImportError({ show: false, message: "", errors: [] })}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Success Modal */}
      {importSuccess.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setImportSuccess({ show: false, count: 0 })} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex flex-col items-center gap-3 px-5 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Import Berhasil</h3>
                <p className="text-sm text-gray-500 mt-1">{importSuccess.count} data sumber dukungan berhasil ditambahkan</p>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200">
              <button
                onClick={() => setImportSuccess({ show: false, count: 0 })}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wilayah Modal - 2 columns */}
      {showWilayahModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWilayahModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Filter Wilayah</h3>
              <button onClick={() => setShowWilayahModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* All Wilayah Option */}
            <div className="px-5 py-3 border-b border-gray-100">
              <button
                onClick={() => { setFilterWilayah(null); setShowWilayahModal(false) }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${!filterWilayah ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-gray-50 hover:bg-gray-100 border border-gray-200"}`}
              >
                Semua Wilayah
              </button>
            </div>
            {/* 2 Column Layout: Province | Kabupaten */}
            <div className="flex-1 overflow-hidden">
              <div className="flex h-full max-h-[400px]">
                {/* Left: Province List */}
                <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
                  <div className="p-2">
                    {PROVINSI_LIST.map((province) => {
                      const kabupatens = Array.from(new Set(list.filter((i) => i.provinsi === province).map((i) => i.kabupatenKota))).filter(Boolean).sort()
                      const isSelected = filterWilayah?.province === province
                      return (
                        <button
                          key={province}
                          onClick={() => setFilterWilayah({ province, kabupaten: "" })}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                            isSelected ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="truncate">{province}</span>
                          {kabupatens.length > 0 && <span className="text-xs text-gray-400">{kabupatens.length}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* Right: Kabupaten List */}
                <div className="w-1/2 overflow-y-auto bg-gray-50">
                  <div className="p-2">
                    {filterWilayah ? (
                      (() => {
                        const kabupatens = Array.from(new Set(list.filter((i) => i.provinsi === filterWilayah.province).map((i) => i.kabupatenKota))).filter(Boolean).sort()
                        if (kabupatens.length === 0) {
                          return <p className="text-sm text-gray-400 p-3">Tidak ada kabupaten/kota</p>
                        }
                        return (
                          <>
                            <button
                              onClick={() => { setFilterWilayah({ province: filterWilayah.province, kabupaten: "" }); setShowWilayahModal(false) }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                                !filterWilayah.kabupaten ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-100"
                              }`}
                            >
                              Semua Kabupaten/Kota
                            </button>
                            {kabupatens.map((kab) => (
                              <button
                                key={kab}
                                onClick={() => { setFilterWilayah({ province: filterWilayah.province, kabupaten: kab }); setShowWilayahModal(false) }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                                  filterWilayah?.kabupaten === kab ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-100"
                                }`}
                              >
                                {kab}
                              </button>
                            ))}
                          </>
                        )
                      })()
                    ) : (
                      <p className="text-sm text-gray-400 p-3">Pilih province di kiri</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => setShowWilayahModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={() => setShowWilayahModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
