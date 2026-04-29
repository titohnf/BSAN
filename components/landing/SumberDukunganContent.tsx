"use client"

import React, { useState, useMemo } from "react"
import { BookOpen, FileText, Video, Link2, Search, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

interface SumberDukungan {
  no: number
  judul: string
  kategori: "Panduan" | "Regulasi" | "Template" | "Video" | "Artikel"
  jenis: "Dokumen" | "Video" | "Tautan"
  tahun: number
  url?: string
}

const MOCK_SUMBER: SumberDukungan[] = [
  { no: 1, judul: "Pedoman Pembentukan Kelompok Kerja BSAN", kategori: "Panduan", jenis: "Dokumen", tahun: 2024 },
  { no: 2, judul: "Permendikbud No. 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan", kategori: "Regulasi", jenis: "Dokumen", tahun: 2023 },
  { no: 3, judul: "Template Surat Keputusan Pembentukan Pokja Provinsi", kategori: "Template", jenis: "Dokumen", tahun: 2024 },
  { no: 4, judul: "Template Surat Keputusan Pembentukan Pokja Kabupaten/Kota", kategori: "Template", jenis: "Dokumen", tahun: 2024 },
  { no: 5, judul: "Panduan Teknis Monitoring dan Evaluasi Program BSAN", kategori: "Panduan", jenis: "Dokumen", tahun: 2024 },
  { no: 6, judul: "Video Pengenalan Program BSAN", kategori: "Video", jenis: "Video", tahun: 2023 },
  { no: 7, judul: "Webinar: Strategi Implementasi BSAN di Daerah", kategori: "Video", jenis: "Video", tahun: 2024 },
  { no: 8, judul: "Website Cerdas Berkarakter Kemendikdasmen", kategori: "Artikel", jenis: "Tautan", tahun: 2024, url: "https://cerdasberkarakter.kemendikdasmen.go.id/budayasekolahamannyaman/" },
  { no: 9, judul: "Modul Pelatihan Fasilitator BSAN", kategori: "Panduan", jenis: "Dokumen", tahun: 2024 },
  { no: 10, judul: "Buku Saku Implementasi BSAN untuk Guru", kategori: "Panduan", jenis: "Dokumen", tahun: 2024 },
  { no: 11, judul: "Peraturan Pemerintah No. 57 Tahun 2021 tentang Standar Nasional Pendidikan", kategori: "Regulasi", jenis: "Dokumen", tahun: 2021 },
  { no: 12, judul: "Instrumen Penilaian Budaya Sekolah Aman", kategori: "Template", jenis: "Dokumen", tahun: 2024 },
  { no: 13, judul: "Panduan Pengisian Data Pokja di Sistem BSAN", kategori: "Panduan", jenis: "Dokumen", tahun: 2025 },
  { no: 14, judul: "Video Tutorial Penggunaan Aplikasi BSAN", kategori: "Video", jenis: "Video", tahun: 2025 },
  { no: 15, judul: "Infografis Alur Pembentukan Kelompok Kerja", kategori: "Artikel", jenis: "Dokumen", tahun: 2024 },
  { no: 16, judul: "Panduan Pelaporan Kegiatan BSAN Tahunan", kategori: "Panduan", jenis: "Dokumen", tahun: 2025 },
  { no: 17, judul: "Template Laporan Bulanan Pokja BSAN", kategori: "Template", jenis: "Dokumen", tahun: 2024 },
  { no: 18, judul: "Undang-Undang No. 35 Tahun 2014 tentang Perlindungan Anak", kategori: "Regulasi", jenis: "Dokumen", tahun: 2014 },
]

const KATEGORI_OPTIONS = ["Semua", "Panduan", "Regulasi", "Template", "Video", "Artikel"] as const
const JENIS_ICON = {
  Dokumen: FileText,
  Video: Video,
  Tautan: Link2,
}
const JENIS_COLOR = {
  Dokumen: "bg-blue-50 text-blue-700 border-blue-200",
  Video: "bg-purple-50 text-purple-700 border-purple-200",
  Tautan: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0 self-start`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900 leading-tight">{label}</p>
          <p className="text-4xl font-extrabold text-slate-900">{value}</p>
          {sub && <p className="text-sm text-slate-500">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

export function SumberDukunganContent() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [kategoriFilter, setKategoriFilter] = useState<string>("Semua")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_SUMBER.filter((r) =>
      r.judul.toLowerCase().includes(q) &&
      (kategoriFilter === "Semua" || r.kategori === kategoriFilter)
    )
  }, [search, kategoriFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalDokumen = MOCK_SUMBER.filter(s => s.jenis === "Dokumen").length
  const totalVideo = MOCK_SUMBER.filter(s => s.jenis === "Video").length
  const totalTautan = MOCK_SUMBER.filter(s => s.jenis === "Tautan").length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pt-16">
        <div className="bg-[#C8F1F7]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div className="pb-16 pt-16">
                <h1 className="text-sm md:text-base font-bold text-slate-800">Informasi &amp; Referensi</h1>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">Sumber Dukungan BSAN</h1>
                <p className="mt-3 text-slate-700 text-base max-w-xl">
                  Dokumen panduan, regulasi, template, dan video pendukung pelaksanaan program Budaya Sekolah Aman dan Nyaman.
                </p>
              </div>
              <div className="hidden md:block self-end">
                <img src="/herobsan.png" alt="Ilustrasi BSAN" className="w-full h-auto rounded-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-0 mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 mt-16">Daftar Sumber Dukungan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={FileText} label="Total Dokumen" value={totalDokumen} sub="panduan, regulasi, template" color="bg-blue-600" />
            <StatCard icon={Video} label="Total Video" value={totalVideo} sub="webinar dan tutorial" color="bg-purple-600" />
            <StatCard icon={Link2} label="Tautan Eksternal" value={totalTautan} sub="sumber referensi online" color="bg-emerald-600" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Semua Sumber Dukungan</h2>
                <p className="text-slate-400 text-xs mt-1">{filtered.length} sumber ditemukan</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={kategoriFilter}
                  onChange={(e) => { setKategoriFilter(e.target.value); setPage(1) }}
                  className="h-9 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-700 shrink-0"
                >
                  {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k === "Semua" ? "Semua Kategori" : k}</option>)}
                </select>
                <div className="relative flex-1 sm:flex-none sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari sumber..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                  <TableHead className="w-10 text-slate-500 text-xs pl-5">No</TableHead>
                  <TableHead className="text-slate-500 text-xs">Judul</TableHead>
                  <TableHead className="w-28 text-slate-500 text-xs">Kategori</TableHead>
                  <TableHead className="w-28 text-slate-500 text-xs">Jenis</TableHead>
                  <TableHead className="w-20 text-slate-500 text-xs text-center">Tahun</TableHead>
                  <TableHead className="w-28 text-slate-500 text-xs" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row, idx) => {
                  const JenisIcon = JENIS_ICON[row.jenis]
                  return (
                    <TableRow key={row.no}>
                      <TableCell className="text-slate-400 text-xs pl-5">{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell className="font-medium text-slate-900">{row.judul}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs text-slate-600 border-slate-200">{row.kategori}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border", JENIS_COLOR[row.jenis])}>
                          <JenisIcon className="w-3 h-3" />
                          {row.jenis}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-slate-600 text-sm">{row.tahun}</TableCell>
                      <TableCell>
                        {row.url ? (
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Buka
                          </a>
                        ) : (
                          <Button variant="outline" size="sm" className="h-7 text-xs border-slate-200 gap-1">
                            <Download className="w-3 h-3" />
                            Unduh
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {totalPages >= 1 && (
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <p className="text-slate-400 text-xs">
                  Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-8 px-3 text-xs border-slate-200">Sebelumnya</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                    <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}
                      className={cn("h-8 w-8 p-0 text-xs", p === page ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" : "border-slate-200")}>
                      {p}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-8 px-3 text-xs border-slate-200">Berikutnya</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
