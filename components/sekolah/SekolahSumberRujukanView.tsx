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
} from "lucide-react"
import Link from "next/link"
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
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showWilayahModal, setShowWilayahModal] = useState(false)
  const [showStats, setShowStats] = useState(true)

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
          <button
            type="button"
            onClick={downloadCsv}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link
            href="/usul-instansi"
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" /> Usul Instansi
          </Link>
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

      {/* Stats cards */}
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Terverifikasi</p>
            <p className="text-2xl font-bold text-green-700">{stats.terverifikasi}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Menunggu</p>
            <p className="text-2xl font-bold text-amber-700">{stats.menunggu}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Kategori</p>
            <p className="text-2xl font-bold text-gray-900">{stats.byKategori.length}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-end flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama instansi atau kota..."
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
          <option value="menunggu">Menunggu Verifikasi</option>
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
          <p className="font-semibold text-gray-700 text-sm">Tidak ada sumber dukungan</p>
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
                            Lihat Detail
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
    </div>
  )
}