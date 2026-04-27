"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Plus,
  Search,
  Users,
  X,
  XCircle,
  Clock,
  ArrowUpDown,
  Building2,
} from "lucide-react"
import { RUJUKAN_LOG } from "@/lib/rujukan-logs"
import {
  KATEGORI_CONFIG,
  PENYEDIA_CONFIG,
  SEED,
  type KategoriDukungan,
  type KategoriPenyedia,
  type SumberRujukan,
  type StatusRujukan,
} from "@/components/dashboard/SumberRujukanView"

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
        Perlu Diperiksa
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

function ReadOnlyDetailPanel({ item, onClose }: { item: SumberRujukan; onClose: () => void }) {
  const kategoriCfg = KATEGORI_CONFIG[item.kategoriBentukDukungan]
  const penyediaCfg = item.kategoriPenyedia ? PENYEDIA_CONFIG[item.kategoriPenyedia] : null
  const alamat = [item.namaJalan, item.nomorJalan, item.kelurahan, item.kecamatan, item.kabupatenKota, item.provinsi, item.kodePos]
    .filter(Boolean)
    .join(", ")

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-full ${kategoriCfg.bg} ${kategoriCfg.color} flex items-center justify-center flex-shrink-0`}>
              {kategoriCfg.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 leading-tight truncate">{item.namaInstansi}</h2>
              <StatusBadge status={item.status} />
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Kategori */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${kategoriCfg.bg} ${kategoriCfg.color} flex items-center justify-center flex-shrink-0`}>
              {kategoriCfg.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">Kategori Dukungan</p>
              <p className="text-sm font-semibold text-gray-900">{item.kategoriBentukDukungan}</p>
            </div>
          </div>

          {/* Penyedia */}
          {penyediaCfg && (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${penyediaCfg.bg} ${penyediaCfg.color} flex items-center justify-center flex-shrink-0`}>
                {penyediaCfg.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">Penyedia Layanan</p>
                <p className="text-sm font-semibold text-gray-900">{item.kategoriPenyedia}</p>
              </div>
            </div>
          )}

          {/* Alamat */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Alamat</p>
            <p className="text-sm text-gray-900">{alamat || "-"}</p>
          </div>

          {/* Call Center */}
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Call Center</p>
              <p className="text-sm font-semibold text-gray-900">{item.nomorCallCenter || "-"}</p>
            </div>
          </div>

          {/* WhatsApp */}
          {item.nomorWhatsapp && (
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">WhatsApp</p>
                <p className="text-sm font-semibold text-gray-900">{item.nomorWhatsapp}</p>
              </div>
            </div>
          )}

          {/* Website */}
          {item.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Website</p>
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline">
                  {item.website}
                </a>
              </div>
            </div>
          )}

          {/* Google Maps */}
          {item.tautanGoogleMaps && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Lokasi</p>
                <a href={item.tautanGoogleMaps} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Lihat di Maps
                </a>
              </div>
            </div>
          )}

          {/* Sosial Media */}
          {item.sosialMedia && (
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Sosial Media</p>
                <p className="text-sm font-semibold text-gray-900">{item.sosialMedia}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

interface SekolahSumberRujukanViewProps {
  wilayah: string
}

export function SekolahSumberRujukanView({ wilayah }: SekolahSumberRujukanViewProps) {
  const [list, setList] = useState<SumberRujukan[]>(SEED)
  const [search, setSearch] = useState("")
  const [filterWilayah, setFilterWilayah] = useState<{ province: string; kabupaten: string } | null>(null)
  const [filterKategori, setFilterKategori] = useState<KategoriDukungan | "semua">("semua")
  const [filterStatus, setFilterStatus] = useState<StatusRujukan | "semua">("semua")
  const [filterPenyedia, setFilterPenyedia] = useState<KategoriPenyedia | "semua">("semua")
  const [sortMode, setSortMode] = useState<SortMode>("relevansi")
  const [selected, setSelected] = useState<SumberRujukan | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showWilayahModal, setShowWilayahModal] = useState(false)
  const [showStats, setShowStats] = useState(true)

  // Form state
  const [formNama, setFormNama] = useState("")
  const [formKategori, setFormKategori] = useState<KategoriDukungan>("Konseling")
  const [formPenyedia, setFormPenyedia] = useState<KategoriPenyedia>("Pemerintah Daerah")
  const [formProvinsi, setFormProvinsi] = useState("")
  const [formKabupaten, setFormKabupaten] = useState("")
  const [formKecamatan, setFormKecamatan] = useState("")
  const [formKelurahan, setFormKelurahan] = useState("")
  const [formNamaJalan, setFormNamaJalan] = useState("")
  const [formNomorJalan, setFormNomorJalan] = useState("")
  const [formKodePos, setFormKodePos] = useState("")
  const [formGoogleMaps, setFormGoogleMaps] = useState("")
  const [formKontak, setFormKontak] = useState<{ nomor: string; tipe: "call_center" | "nomor_pribadi" }[]>([
    { nomor: "", tipe: "call_center" }
  ])
  const [formwebsite, setFormwebsite] = useState("")
  const [formAksesInfo, setFormAksesInfo] = useState<"publik" | "terbatas">("publik")
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Auto-fill wilayah from prop
  useEffect(() => {
    const w = wilayah.trim()
    let prov = ""
    let kab = ""
    if (w.includes(" - ")) {
      const parts = w.split(" - ")
      prov = parts[0].trim()
      kab = parts[1].trim()
    } else {
      prov = w
    }
    setFormProvinsi(prov)
    setFormKabupaten(kab)
    // Set default filter to show only school's wilayah (auto-enabled)
    setFilterWilayah({ province: prov, kabupaten: kab })
    setShowWilayahModal(false)
    setShowStats(true)
  }, [])

  const addKontak = () => setFormKontak((prev) => [...prev, { nomor: "", tipe: "call_center" }])
  const removeKontak = (idx: number) => setFormKontak((prev) => prev.filter((_, i) => i !== idx))
  const updateKontak = (idx: number, field: "nomor" | "tipe", val: string) => {
    setFormKontak((prev) => prev.map((k, i) => i === idx ? { ...k, [field]: field === "nomor" ? val.replace(/\D/g, "") : val } : k))
  }

  // Parse wilayah prop
  const myWilayah = wilayah.trim().toLowerCase()

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = JSON.parse(sessionStorage.getItem("rujukanList") ?? "[]") as Array<Partial<SumberRujukan> & { id: string }>
        const storedMap = new Map(stored.map((i) => [i.id, i]))
        const seedMerged = SEED.map((s) => (storedMap.has(s.id) ? { ...s, ...storedMap.get(s.id) } : s))
        const newItems = stored.filter((i) => !SEED.find((s) => s.id === i.id)) as SumberRujukan[]
        setList([...seedMerged, ...newItems])
      } catch {
        setList([...SEED])
      }
    }
    loadData()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "rujukanList") loadData()
    }
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
      if (item.status === "dihapus") return false
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
      return 0
    })

  const totalRows = filtered.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows)
  const paginatedData = filtered.slice(startIndex, endIndex)

  // Stats calculations
  const stats = useMemo(() => {
    const total = filtered.length
    const terverifikasi = filtered.filter((i) => i.status === "terverifikasi").length
    const menunggu = filtered.filter((i) => i.status === "menunggu").length
    const byKategori = Object.keys(KATEGORI_CONFIG).map((k) => ({
      label: k,
      count: filtered.filter((i) => i.kategoriBentukDukungan === k).length,
    }))
    return { total, terverifikasi, menunggu, byKategori }
  }, [filtered])

  const downloadCsv = () => {
    const rows = [
      ["Nama Instansi", "Kategori Dukungan", "Penyedia", "Kab/Kota", "Provinsi", "Call Center", "Status"].join(","),
      ...filtered.map((item) =>
        [
          `"${item.namaInstansi.replace(/"/g, '""')}"`,
          `"${item.kategoriBentukDukungan}"`,
          `"${item.kategoriPenyedia || ""}"`,
          `"${item.kabupatenKota}"`,
          `"${item.provinsi}"`,
          `"${item.nomorCallCenter}"`,
          `"${item.status}"`,
        ].join(",")
      ),
    ]
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sumber-dukungan-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validKontak = formKontak.filter((k) => k.nomor.trim())
    if (!formNama.trim() || !formProvinsi || !formKabupaten || validKontak.length === 0) return
    setSending(true)
    const callCenterNomor = validKontak.find((k) => k.tipe === "call_center")?.nomor ?? validKontak[0]?.nomor ?? ""
    const newRujukan: SumberRujukan = {
      id: `usul-${Date.now()}`,
      namaInstansi: formNama.trim(),
      kategoriBentukDukungan: formKategori,
      kategoriPenyedia: formPenyedia,
      provinsi: formProvinsi,
      kabupatenKota: formKabupaten,
      kecamatan: formKecamatan.trim() || undefined,
      kelurahan: formKelurahan.trim() || undefined,
      namaJalan: formNamaJalan.trim() || undefined,
      nomorJalan: formNomorJalan.trim() || undefined,
      kodePos: formKodePos.trim() || undefined,
      tautanGoogleMaps: formGoogleMaps.trim() || undefined,
      kontak: validKontak,
      nomorCallCenter: callCenterNomor,
      website: formwebsite.trim() || undefined,
      aksesInfo: formAksesInfo,
      status: "menunggu",
      dibuatOleh: "Admin Sekolah",
      logTerakhir: RUJUKAN_LOG.menunggu,
      usulanDari: "sekolah",
      createdAt: new Date().toISOString(),
    }
    try {
      const raw = sessionStorage.getItem("rujukanList")
      const stored: Array<Partial<SumberRujukan> & { id: string }> = raw ? JSON.parse(raw) : []
      stored.unshift(newRujukan)
      sessionStorage.setItem("rujukanList", JSON.stringify(stored))
      window.dispatchEvent(new CustomEvent("rujukanUpdated"))
    } catch { /* ignore */ }
    setSending(false)
    setSubmitted(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSubmitted(false)
    // Note: Province/Kabupaten are auto-filled from wilayah prop, don't reset them
    setFormNama("")
    setFormKategori("Konseling")
    setFormPenyedia("Pemerintah Daerah")
    setFormProvinsi("")
    setFormKabupaten("")
    setFormKecamatan("")
    setFormKelurahan("")
    setFormNamaJalan("")
    setFormNomorJalan("")
    setFormKodePos("")
    setFormGoogleMaps("")
    setFormKontak([{ nomor: "", tipe: "call_center" }])
    setFormwebsite("")
    setFormAksesInfo("publik")
  }

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Sumber Dukungan</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Daftar kontak layanan untuk membangun lingkungan sekolah yang aman, nyaman, dan inklusif</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={downloadCsv}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Ekspor CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" /> Usul Sumber Dukungan
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
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-sm px-2 py-1 rounded-md transition"
          >
            Ganti
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Statistik:</span>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`relative w-10 h-5 rounded-full transition-colors ${showStats ? "bg-emerald-600" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showStats ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Stats cards by kategori */}
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.byKategori.filter(k => k.count > 0).map((k) => {
            const cfg = KATEGORI_CONFIG[k.label]
            return (
              <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className={`w-8 h-8 rounded-full ${cfg.bg} ${cfg.color} flex items-center justify-center mb-2`}>
                  {cfg.icon}
                </div>
                <p className="text-xs text-gray-500">{k.label}</p>
                <p className="text-2xl font-bold text-gray-900">{k.count}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-end flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ketik nama instansi atau kota"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value as KategoriDukungan | "semua")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="semua">Semua Kategori</option>
          {(Object.keys(KATEGORI_CONFIG) as KategoriDukungan[]).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as StatusRujukan | "semua")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="semua">Semua Status</option>
          <option value="terverifikasi">Terverifikasi</option>
          <option value="menunggu">Perlu Diperiksa</option>
          <option value="menunggu_review">Menunggu Review</option>
          <option value="dihapus">Dihapus</option>
        </select>
        <select
          value={filterPenyedia}
          onChange={(e) => setFilterPenyedia(e.target.value as KategoriPenyedia | "semua")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="semua">Semua Penyedia</option>
          {(["Pemerintah Pusat", "Pemerintah Daerah", "Swasta", "OMS", "Lainnya"] as KategoriPenyedia[]).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
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
          <p className="font-semibold text-gray-700 text-sm">Data tidak tersedia</p>
          <p className="text-gray-500 text-xs mt-1">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Instansi</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Penyedia</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wilayah</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedData.map((item) => {
                    const kategoriCfg = KATEGORI_CONFIG[item.kategoriBentukDukungan]
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-gray-900">{item.namaInstansi}</p>
                          {item.website && (
                            <a
                              href={item.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5"
                            >
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
                        <td className="px-4 py-3.5 text-sm text-gray-600">
                          {item.kategoriPenyedia || "-"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600">
                          {item.kabupatenKota}
                          <br />
                          {item.provinsi}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <a
                            href={`/sumber-rujukan/form?view=${item.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Cek Detail
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Menampilkan {startIndex + 1}-{endIndex} dari {totalRows} data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-3 py-1.5 text-xs font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* wilayah Filter Modal */}
      {showWilayahModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowWilayahModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Filter Wilayah</h3>
              <button onClick={() => setShowWilayahModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex h-full max-h-[400px]">
                <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => { setFilterWilayah(null); setShowWilayahModal(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${!filterWilayah ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50"}`}
                    >
                      Semua Provinsi
                    </button>
                    {PROVINSI_LIST.map((province) => {
                      const kabupatens = Array.from(new Set(list.filter((i) => i.provinsi === province).map((i) => i.kabupatenKota))).filter(Boolean).sort()
                      const isSelected = filterWilayah?.province === province
                      return (
                        <button
                          key={province}
                          onClick={() => setFilterWilayah({ province, kabupaten: "" })}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                            isSelected ? "bg-emerald-50 text-emerald-700 font-medium" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="truncate">{province}</span>
                          {kabupatens.length > 0 && <span className="text-xs text-gray-400">{kabupatens.length}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="w-1/2 overflow-y-auto bg-white">
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
                                !filterWilayah.kabupaten ? "bg-emerald-50 text-emerald-700 font-medium" : "hover:bg-gray-100"
                              }`}
                            >
                              Semua Kabupaten/Kota
                            </button>
                            {kabupatens.map((kab) => (
                              <button
                                key={kab}
                                onClick={() => { setFilterWilayah({ province: filterWilayah.province, kabupaten: kab }); setShowWilayahModal(false) }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                                  filterWilayah?.kabupaten === kab ? "bg-emerald-50 text-emerald-700 font-medium" : "hover:bg-gray-100"
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
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowWilayahModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={() => setShowWilayahModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && <ReadOnlyDetailPanel item={selected} onClose={() => setSelected(null)} />}

      {/* Usul Sumber Dukungan Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={handleCloseForm} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Usulan Berhasil Dikirim</h3>
                <p className="text-sm text-gray-600 mb-6">Usulan sumber dukungan Anda akan diverifikasi oleh admin.</p>
                <button
                  onClick={handleCloseForm}
                  className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <h3 className="text-base font-bold text-gray-900">Usul Sumber Dukungan</h3>
                  <button onClick={handleCloseForm} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Nama Instansi <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formNama}
                      onChange={(e) => setFormNama(e.target.value)}
                      placeholder="Nama instansi atau layanan"
                      required
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Kategori Dukungan <span className="text-red-500">*</span></label>
                      <select
                        value={formKategori}
                        onChange={(e) => setFormKategori(e.target.value as KategoriDukungan)}
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        {(Object.keys(KATEGORI_CONFIG) as KategoriDukungan[]).map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Penyedia Layanan <span className="text-red-500">*</span></label>
                      <select
                        value={formPenyedia}
                        onChange={(e) => setFormPenyedia(e.target.value as KategoriPenyedia)}
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        {(["Pemerintah Pusat", "Pemerintah Daerah", "Swasta", "OMS", "Lainnya"] as KategoriPenyedia[]).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Wilayah Anda</label>
                    <div className="mt-1 px-3 py-2 text-sm bg-gray-100 rounded-lg text-gray-600">
                      {formProvinsi}{formKabupaten ? ` - ${formKabupaten}` : ""}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={formNamaJalan}
                      onChange={(e) => setFormNamaJalan(e.target.value)}
                      placeholder="Nama jalan, nomor,(rt/rw), dll"
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Kecamatan</label>
                      <input
                        type="text"
                        value={formKecamatan}
                        onChange={(e) => setFormKecamatan(e.target.value)}
                        placeholder="Nama kecamatan"
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Kelurahan/Desa</label>
                      <input
                        type="text"
                        value={formKelurahan}
                        onChange={(e) => setFormKelurahan(e.target.value)}
                        placeholder="Nama kelurahan/desa"
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Nama Jalan</label>
                      <input
                        type="text"
                        value={formNamaJalan}
                        onChange={(e) => setFormNamaJalan(e.target.value)}
                        placeholder="Nama jalan"
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Nomor Jalan</label>
                      <input
                        type="text"
                        value={formNomorJalan}
                        onChange={(e) => setFormNomorJalan(e.target.value)}
                        placeholder="Nomor"
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Kode Pos</label>
                      <input
                        type="text"
                        value={formKodePos}
                        onChange={(e) => setFormKodePos(e.target.value)}
                        placeholder="Kode pos"
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 space-y-1">
                      <p className="text-xs text-blue-700">
                        <span className="font-semibold">Nomor Call Center</span> bisa lebih dari satu.
                      </p>
                      <p className="text-xs text-blue-600">
                        Jika tidak tersedia, gunakan nomor HP pribadi yang dapat menjadi rujukan dan dapat diakses publik.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="flex-1 text-xs font-semibold text-gray-700">Nomor <span className="text-red-500">*</span></span>
                    <span className="w-36 text-xs font-semibold text-gray-700">Tipe Kontak</span>
                    {formKontak.length > 1 && <span className="w-9" />}
                  </div>
                  <div className="space-y-2">
                    {formKontak.map((k, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          type="tel"
                          value={k.nomor}
                          onChange={(e) => updateKontak(i, "nomor", e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <select
                          value={k.tipe}
                          onChange={(e) => updateKontak(i, "tipe", e.target.value)}
                          className="w-36 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="call_center">Call Center</option>
                          <option value="nomor_pribadi">Nomor Pribadi</option>
                        </select>
                        {formKontak.length > 1 && (
                          <button type="button" onClick={() => removeKontak(i)} className="p-2 text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addKontak} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                    + Tambah kontak
                  </button>
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition"
                    >
                      {sending ? "Mengirim..." : "Kirim Usulan"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
