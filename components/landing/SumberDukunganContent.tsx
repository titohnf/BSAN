"use client"

import React, { useState, useMemo } from "react"
import { Search, Globe, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  KATEGORI_CONFIG,
  PENYEDIA_CONFIG,
  SEED,
  type SumberRujukan,
  type KategoriDukungan,
  type KategoriPenyedia,
} from "@/components/dashboard/SumberRujukanView"

const PAGE_SIZE = 10

const VERIFIED_DATA: SumberRujukan[] = SEED.filter((i) => i.status === "terverifikasi")

const KATEGORI_KEYS: KategoriDukungan[] = [
  "Fasilitas Kesehatan", "Konseling", "Bantuan Hukum", "Kepolisian",
  "Psikologi", "Pendidikan", "Sosial", "Lainnya",
]

const PENYEDIA_OPTIONS: KategoriPenyedia[] = [
  "Pemerintah Pusat", "Pemerintah Daerah", "Swasta", "OMS", "Lainnya",
]

const PROVINSI_LIST = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Bengkulu", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Lampung",
  "DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Maluku", "Maluku Utara", "Papua Barat", "Papua",
]

type FilterWilayah = { province: string; kabupaten: string } | null

type SumberDukunganContentProps = {
  hideHeroPrefix?: boolean
}

export function SumberDukunganContent({ hideHeroPrefix = false }: SumberDukunganContentProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [filterKategori, setFilterKategori] = useState<KategoriDukungan | "semua">("semua")
  const [filterPenyedia, setFilterPenyedia] = useState<KategoriPenyedia | "semua">("semua")
  const [filterWilayah, setFilterWilayah] = useState<FilterWilayah>(null)
  const [showWilayahModal, setShowWilayahModal] = useState(false)
  const [modalProvinsi, setModalProvinsi] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<SumberRujukan | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return VERIFIED_DATA.filter((item) => {
      const matchSearch =
        q === "" ||
        item.namaInstansi.toLowerCase().includes(q) ||
        item.kabupatenKota.toLowerCase().includes(q) ||
        item.provinsi.toLowerCase().includes(q)
      const matchKategori = filterKategori === "semua" || item.kategoriBentukDukungan === filterKategori
      const matchPenyedia = filterPenyedia === "semua" || item.kategoriPenyedia === filterPenyedia
      const matchWilayah =
        !filterWilayah ||
        (filterWilayah.province === item.provinsi &&
          (!filterWilayah.kabupaten || item.kabupatenKota === filterWilayah.kabupaten))
      return matchSearch && matchKategori && matchPenyedia && matchWilayah
    })
  }, [search, filterKategori, filterPenyedia, filterWilayah])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const paged = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const openWilayahModal = () => {
    setModalProvinsi(filterWilayah?.province ?? null)
    setShowWilayahModal(true)
  }

  const closeWilayahModal = () => setShowWilayahModal(false)

  const selectSemua = () => {
    setFilterWilayah(null)
    setPage(1)
    closeWilayahModal()
  }

  const selectProvinsi = (province: string) => {
    setModalProvinsi(province)
    setFilterWilayah({ province, kabupaten: "" })
    setPage(1)
  }

  const selectKabupaten = (kabupaten: string) => {
    setFilterWilayah((prev) => ({ province: prev?.province ?? modalProvinsi ?? "", kabupaten }))
    setPage(1)
    closeWilayahModal()
  }

  const selectSemauKabupaten = () => {
    setFilterWilayah((prev) => ({ province: prev?.province ?? modalProvinsi ?? "", kabupaten: "" }))
    setPage(1)
    closeWilayahModal()
  }

  const wilayahLabel = filterWilayah
    ? filterWilayah.kabupaten
      ? `${filterWilayah.province} — ${filterWilayah.kabupaten}`
      : filterWilayah.province
    : "Semua Wilayah"

  const kabupatenForModal = modalProvinsi
    ? Array.from(new Set(VERIFIED_DATA.filter((i) => i.provinsi === modalProvinsi).map((i) => i.kabupatenKota)))
        .filter(Boolean)
        .sort()
    : []

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pt-16">
        {/* Hero */}
        <div className="bg-[#C8F1F7]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div className="pb-16 pt-16">
                {!hideHeroPrefix && <h1 className="text-sm md:text-base font-bold text-slate-800">Informasi &amp; Referensi</h1>}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">Sumber Dukungan BSAN</h1>
                <p className="mt-3 text-slate-700 text-base max-w-xl">
                  Daftar kontak layanan untuk membangun lingkungan sekolah yang aman, nyaman, dan inklusif.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-0 mb-16">
          {/* Table card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
            {/* Filter bar */}
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="font-semibold text-slate-900">
                    Sumber Dukungan: {wilayahLabel}
                  </h2>
                  <Button variant="outline" size="sm" onClick={openWilayahModal} className="w-fit h-7 text-xs gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Ganti
                  </Button>
                </div>
                <p className="text-slate-400 text-xs mt-1">{filtered.length} layanan ditemukan</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <select
                  value={filterKategori}
                  onChange={(e) => { setFilterKategori(e.target.value as KategoriDukungan | "semua"); setPage(1) }}
                  className="h-9 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-700 shrink-0"
                >
                  <option value="semua">Semua Kategori</option>
                  {KATEGORI_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <select
                  value={filterPenyedia}
                  onChange={(e) => { setFilterPenyedia(e.target.value as KategoriPenyedia | "semua"); setPage(1) }}
                  className="h-9 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-700 shrink-0"
                >
                  <option value="semua">Semua Penyedia</option>
                  {PENYEDIA_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="relative flex-1 sm:flex-none sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari instansi atau kota..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-semibold text-gray-700 text-sm">Tidak ada sumber dukungan ditemukan</p>
                <p className="text-gray-500 text-xs mt-1">Coba ubah filter, wilayah, atau kata kunci pencarian.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Instansi</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wilayah</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori Dukungan</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kontak</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paged.map((item) => {
                        const kategoriCfg = KATEGORI_CONFIG[item.kategoriBentukDukungan]
                        const penyediaCfg = item.kategoriPenyedia ? PENYEDIA_CONFIG[item.kategoriPenyedia] : null
                        return (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <p className="font-semibold text-gray-900 whitespace-nowrap">{item.namaInstansi}</p>
                              {item.website && (
                                <a href={item.website} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5">
                                  <Globe className="w-3 h-3" /> Website
                                </a>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">
                              {item.kabupatenKota ? `Kota ${item.kabupatenKota}` : "-"}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${kategoriCfg.bg} ${kategoriCfg.color}`}>
                                {kategoriCfg.icon}
                                <span className="whitespace-nowrap">{kategoriCfg.label}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              {item.nomorCallCenter || item.nomorPribadi ? (
                                <span className="text-slate-700">{item.nomorCallCenter || item.nomorPribadi}</span>
                              ) : <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                                className="h-7 text-xs border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Lihat Detail
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-slate-400 text-xs">
                    Menampilkan {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filtered.length)} dari {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(1)}
                      disabled={safePage === 1}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Halaman pertama"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Halaman sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-sm text-gray-600">{safePage} / {totalPages}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Halaman berikutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(totalPages)}
                      disabled={safePage === totalPages}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Halaman terakhir"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Sumber Dukungan</p>
                <h3 className="text-base font-bold text-slate-900">{selectedItem.namaInstansi}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Terverifikasi
                </span>
                <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-6 py-5">
              <div className="grid grid-cols-2 gap-y-4 gap-x-3 pb-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Kategori Dukungan</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${KATEGORI_CONFIG[selectedItem.kategoriBentukDukungan]?.bg} ${KATEGORI_CONFIG[selectedItem.kategoriBentukDukungan]?.color}`}>
                    {KATEGORI_CONFIG[selectedItem.kategoriBentukDukungan]?.icon}
                    <span>{KATEGORI_CONFIG[selectedItem.kategoriBentukDukungan]?.label}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Wilayah</p>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedItem.kabupatenKota ? `Kota ${selectedItem.kabupatenKota}` : "-"}
                  </p>
                </div>
                {selectedItem.kategoriPenyedia && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Penyedia</p>
                    <p className="text-sm text-slate-900">{selectedItem.kategoriPenyedia}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Provinsi</p>
                  <p className="text-sm text-slate-900">{selectedItem.provinsi || "-"}</p>
                </div>
              </div>

              {(selectedItem.namaJalan || selectedItem.nomorJalan) && (
                <div className="pt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Alamat</p>
                  <p className="text-sm text-slate-700 mb-3">
                    {[selectedItem.namaJalan, selectedItem.nomorJalan, selectedItem.kelurahan, selectedItem.kecamatan, selectedItem.kabupatenKota, selectedItem.provinsi].filter(Boolean).join(", ")}
                  </p>
                  <div className="rounded-lg border border-slate-200 overflow-hidden h-48">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent([selectedItem.namaJalan, selectedItem.kabupatenKota, selectedItem.provinsi].filter(Boolean).join(", "))}&t=&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Peta Lokasi"
                    />
                  </div>
                </div>
              )}

              <div className="py-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kontak</p>
                <div className="space-y-3">
                  {selectedItem.nomorCallCenter && (
                    <a
                      href={`https://wa.me/62${selectedItem.nomorCallCenter.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Hubungi via WhatsApp - {selectedItem.nomorCallCenter}
                    </a>
                  )}
                  {selectedItem.nomorPribadi && !selectedItem.nomorCallCenter && (
                    <a
                      href={`https://wa.me/62${selectedItem.nomorPribadi.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Hubungi via WhatsApp - {selectedItem.nomorPribadi}
                    </a>
                  )}
                  {selectedItem.website && (
                    <a
                      href={selectedItem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Kunjugi Website
                    </a>
                  )}
                  {(!selectedItem.nomorCallCenter && !selectedItem.nomorPribadi && !selectedItem.website) && (
                    <p className="text-sm text-slate-400">Tidak ada kontak tersedia</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setSelectedItem(null)} variant="outline" className="border-slate-200 text-sm">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Wilayah Modal */}
      {showWilayahModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeWilayahModal} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Filter Wilayah</h3>
              <button onClick={closeWilayahModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex h-full max-h-[400px]">
                {/* Kolom kiri: Provinsi */}
                <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={selectSemua}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${!modalProvinsi && !filterWilayah ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}
                    >
                      Semua Provinsi
                    </button>
                    {PROVINSI_LIST.map((province) => {
                      const kabupatens = Array.from(
                        new Set(VERIFIED_DATA.filter((i) => i.provinsi === province).map((i) => i.kabupatenKota))
                      ).filter(Boolean)
                      const isSelected = modalProvinsi === province
                      return (
                        <button
                          key={province}
                          onClick={() => selectProvinsi(province)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                            isSelected ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="truncate">{province}</span>
                          {kabupatens.length > 0 && (
                            <span className="text-xs text-gray-400 ml-1 shrink-0">{kabupatens.length}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Kolom kanan: Kabupaten/Kota */}
                <div className="w-1/2 overflow-y-auto bg-white">
                  <div className="p-2">
                    {modalProvinsi ? (
                      kabupatenForModal.length === 0 ? (
                        <p className="text-sm text-gray-400 p-3">Tidak ada data kabupaten/kota</p>
                      ) : (
                        <>
                          <button
                            onClick={selectSemauKabupaten}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                              filterWilayah?.province === modalProvinsi && !filterWilayah.kabupaten
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            Semua Kabupaten/Kota
                          </button>
                          {kabupatenForModal.map((kab) => (
                            <button
                              key={kab}
                              onClick={() => selectKabupaten(kab)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                                filterWilayah?.kabupaten === kab
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {kab}
                            </button>
                          ))}
                        </>
                      )
                    ) : (
                      <p className="text-sm text-gray-400 p-3">Pilih provinsi di kiri</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={selectSemua}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Reset Wilayah
              </button>
              <button
                onClick={closeWilayahModal}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
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
