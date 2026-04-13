"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle,
  Download,
  ExternalLink,
  Globe,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Users,
  X,
  XCircle,
  Clock,
} from "lucide-react"
import {
  KATEGORI_CONFIG,
  PENYEDIA_CONFIG,
  SEED,
  type KategoriDukungan,
  type KategoriPenyedia,
  type SumberRujukan,
  type StatusRujukan,
} from "@/components/dashboard/SumberRujukanView"

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
              ) : (
                <span className="text-gray-400 text-xs">-</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Alamat</p>
            <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{alamat || "-"}</p>
            </div>
            {item.tautanGoogleMaps && (
              <a
                href={item.tautanGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-600 hover:underline"
              >
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
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline break-all"
                    >
                      {item.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

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
              <p className="text-xs text-gray-500 mb-1">Wilayah</p>
              <p className="text-xs font-medium text-gray-800">{item.kabupatenKota}, {item.provinsi}</p>
            </div>
          </div>
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
  const [filterKategori, setFilterKategori] = useState<KategoriDukungan | "semua">("semua")
  const [selected, setSelected] = useState<SumberRujukan | null>(null)

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

  const inWilayah = useMemo(() => {
    const w = wilayah.trim().toLowerCase()
    return list.filter((item) => {
      const kota = item.kabupatenKota?.toLowerCase() ?? ""
      return kota === w || kota.includes(w) || w.includes(kota)
    })
  }, [list, wilayah])

  const filtered = inWilayah.filter((item) => {
    if (item.status === "dihapus") return false
    const matchSearch =
      search.trim() === "" ||
      item.namaInstansi.toLowerCase().includes(search.toLowerCase()) ||
      item.kabupatenKota.toLowerCase().includes(search.toLowerCase())
    const matchKategori = filterKategori === "semua" || item.kategoriBentukDukungan === filterKategori
    return matchSearch && matchKategori
  })

  const downloadCsv = () => {
    const rows = [
      ["Nama Instansi", "Kategori Dukungan", "Kab/Kota", "Call Center", "Status"].join(","),
      ...filtered.map((item) =>
        [
          `"${item.namaInstansi.replace(/"/g, '""')}"`,
          `"${item.kategoriBentukDukungan}"`,
          `"${item.kabupatenKota}"`,
          `"${item.nomorCallCenter}"`,
          `"${item.status}"`,
        ].join(",")
      ),
    ]
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sumber-rujukan-${wilayah.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sumber Dukungan di Wilayah Anda</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cari, lihat detail, dan unduh daftar untuk kebutuhan sekolah — wilayah: <span className="font-medium text-gray-700">{wilayah}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold border border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
        >
          <Download className="w-4 h-4" />
          Unduh daftar (CSV)
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama instansi atau kota..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value as KategoriDukungan | "semua")}
          className="sm:w-56 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="semua">Semua Kategori</option>
          {(Object.keys(KATEGORI_CONFIG) as KategoriDukungan[]).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="font-semibold text-gray-700 text-sm">Tidak ada sumber rujukan di wilayah ini</p>
          <p className="text-gray-500 text-xs mt-1">Sesuaikan pencarian atau ajukan instansi baru melalui menu Usul Instansi.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Instansi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wilayah</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
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
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${kategoriCfg.bg} ${kategoriCfg.color}`}
                        >
                          {kategoriCfg.icon}
                          <span className="whitespace-nowrap">{kategoriCfg.label}</span>
                        </div>
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
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-1.5"
                        >
                          Lihat detail
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <ReadOnlyDetailPanel item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
