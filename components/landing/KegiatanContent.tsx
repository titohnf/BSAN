"use client"

import React, { useState, useMemo } from "react"
import { MapPin, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

interface Kegiatan {
  no: number
  nama: string
  penyelenggara: string
  wilayah: string
  tanggal: string
  status: "Berlangsung" | "Selesai" | "Akan Datang"
  peserta: number
  deskripsi: string
}

export const MOCK_KEGIATAN: Kegiatan[] = [
  { no: 1, nama: "Pelatihan Fasilitator BSAN Tingkat Nasional", penyelenggara: "Kemendikdasmen", wilayah: "Jakarta", tanggal: "2025-03-10", status: "Selesai", peserta: 120, deskripsi: "Pelatihan bagi fasilitator BSAN dari seluruh Indonesia untuk meningkatkan kapasitas dalam implementasi program." },
  { no: 2, nama: "Workshop Pembentukan Pokja BSAN Provinsi Jawa Barat", penyelengara: "Dinas Pendidikan Jawa Barat", wilayah: "Bandung", tanggal: "2025-04-05", status: "Selesai", peserta: 45, deskripsi: "Workshop khusus untuk membantu pembentukan Kelompok Kerja BSAN di wilayah Jawa Barat." },
  { no: 3, nama: "Sosialisasi Program BSAN di Aceh", penyelengara: "Dinas Pendidikan Aceh", wilayah: "Banda Aceh", tanggal: "2025-04-18", status: "Selesai", peserta: 80, deskripsi: "Kesgiatan sosialisasi program BSAN kepada seluruh pemangku kepentingan di Provinsi Aceh." },
  { no: 4, nama: "Webinar Nasional: Budaya Sekolah Aman", penyelengara: "Kemendikdasmen", wilayah: "Online", tanggal: "2025-05-12", status: "Selesai", peserta: 500, deskripsi: "Webinar nasional yang membahas strategi implementasi budaya sekolah aman dan nyaman." },
  { no: 5, nama: "Bimtek Monitoring dan Evaluasi BSAN", penyelengara: "Pusat Penguatan Karakter", wilayah: "Surabaya", tanggal: "2025-05-20", status: "Selesai", peserta: 60, deskripsi: "Bimbingan teknis untuk petugas yang menangani monitoring dan evaluasi program BSAN." },
  { no: 6, nama: "Forum Koordinasi Pokja BSAN Sumatera", penyelengara: "Kemendikdasmen", wilayah: "Medan", tanggal: "2025-06-03", status: "Berlangsung", peserta: 90, deskripsi: "Forum koordinasi antar Kelompok Kerja BSAN di wilayah Sumatera." },
  { no: 7, nama: "Pelatihan Guru: Pencegahan Kekerasan di Sekolah", penyelengara: "Dinas Pendidikan DKI Jakarta", wilayah: "Jakarta", tanggal: "2025-06-10", status: "Berlangsung", peserta: 200, deskripsi: "Pelatihan untuk guru-guru di DKI Jakarta tentang pencegahan dan penanganan kekerasan di lingkungan sekolah." },
  { no: 8, nama: "Rapat Koordinasi Pokja BSAN Nasional", penyelengara: "Kemendikdasmen", wilayah: "Jakarta", tanggal: "2025-06-25", status: "Akan Datang", peserta: 150, deskripsi: "Rapat koordinasi seluruh Pokja BSAN tingkat nasional untuk evaluasi semester pertama." },
  { no: 9, nama: "Workshop BSAN untuk Kepala Sekolah", penyelengara: "Dinas Pendidikan Jawa Tengah", wilayah: "Semarang", tanggal: "2025-07-08", status: "Akan Datang", peserta: 75, deskripsi: "Workshop khusus kepala sekolah tentang implementasi kebijakan BSAN di tingkat satuan pendidikan." },
  { no: 10, nama: "Seminar Nasional: Perlindungan Peserta Didik", penyelengara: "Kemendikdasmen", wilayah: "Yogyakarta", tanggal: "2025-07-15", status: "Akan Datang", peserta: 300, deskripsi: "Seminar nasional yang membahas isu perlindungan peserta didik dari berbagai perspektif." },
  { no: 11, nama: "Pelatihan Pokja BSAN Kalimantan", penyelengara: "Dinas Pendidikan Kaltim", wilayah: "Samarinda", tanggal: "2025-07-22", status: "Akan Datang", peserta: 55, deskripsi: "Pelatihan pembentukan dan penguatan Pokja BSAN di wilayah Kalimantan." },
  { no: 12, nama: "Forum BSAN Kawasan Timur Indonesia", penyelengara: "Kemendikdasmen", wilayah: "Makassar", tanggal: "2025-08-05", status: "Akan Datang", peserta: 110, deskripsi: "Forum khusus untuk daerah-daerah di kawasan timur Indonesia dalam mengakselerasi program BSAN." },
  { no: 13, nama: "Rapat Pokja BSAN Tingkat Nasional", penyelengara: "Kemendikdasmen", wilayah: "Jakarta", tanggal: "2026-05-06", status: "Berlangsung", peserta: 80, deskripsi: "Rapat koordinasi pokja BSAN tingkat nasional." },
  { no: 14, nama: "Sosialisasi Kebijakan BSAN untuk Dinas Pendidikan", penyelengara: "Pusat Penguatan Karakter", wilayah: "Online", tanggal: "2026-05-06", status: "Berlangsung", peserta: 250, deskripsi: "Sosialisasi kebijakan BSAN terbaru kepada seluruh dinas pendidikan provinsi." },
  { no: 15, nama: "Pelatihan Guru Anti Bullying", penyelengara: "Dinas Pendidikan Jawa Barat", wilayah: "Bandung", tanggal: "2026-05-06", status: "Berlangsung", peserta: 150, deskripsi: "Pelatihan untuk guru-guru mengenai pencegahan dan penanganan bullying di sekolah." },
  { no: 16, nama: "Workshop Pemetaan Zona Aman Sekolah", penyelengara: "Kemendikdasmen", wilayah: "Jakarta", tanggal: "2026-05-06", status: "Akan Datang", peserta: 60, deskripsi: "Workshop pemetaan zona aman di setiap sekolah untuk keselamatan peserta didik." },
  { no: 17, nama: "Forum Koordinasi Orang Tua - Sekolah", penyelengara: "Dinas Pendidikan Banten", wilayah: "Serang", tanggal: "2026-05-06", status: "Akan Datang", peserta: 100, deskripsi: "Forum koordinasi antara orang tua dan sekolah untuk mendukung program BSAN." },
]

const STATUS_OPTIONS = ["Semua", "Berlangsung", "Selesai", "Akan Datang"] as const

const STATUS_BADGE: Record<Kegiatan["status"], string> = {
  "Berlangsung": "bg-blue-50 text-blue-700 border-blue-200",
  "Selesai":     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Akan Datang": "bg-amber-50 text-amber-700 border-amber-200",
}


type KegiatanContentProps = { hideHeroPrefix?: boolean }
export function KegiatanContent({ hideHeroPrefix = false }: KegiatanContentProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("Semua")
  const [expandedNo, setExpandedNo] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_KEGIATAN.filter((r) =>
      (r.nama.toLowerCase().includes(q) || r.penyelenggara.toLowerCase().includes(q) || r.wilayah.toLowerCase().includes(q)) &&
      (statusFilter === "Semua" || r.status === statusFilter)
    )
  }, [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pt-16">
        <div className="bg-[#C8F1F7]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div className="pb-16 pt-16">
                {!hideHeroPrefix && <h1 className="text-sm md:text-base font-bold text-slate-800">Program &amp; Aktivitas</h1>}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">Kegiatan BSAN</h1>
                <p className="mt-3 text-slate-700 text-base max-w-xl">
                  Daftar kegiatan pelatihan, workshop, sosialisasi, dan forum koordinasi program Budaya Sekolah Aman dan Nyaman di seluruh Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-0 mb-16">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Semua Kegiatan</h2>
                <p className="text-slate-400 text-xs mt-1">{filtered.length} kegiatan ditemukan</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                  className="h-9 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-700 shrink-0"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === "Semua" ? "Semua Status" : s}</option>)}
                </select>
                <div className="relative flex-1 sm:flex-none sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari kegiatan..."
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
                  <TableHead className="text-slate-500 text-xs">Nama Kegiatan</TableHead>
                  <TableHead className="text-slate-500 text-xs">Penyelenggara</TableHead>
                  <TableHead className="w-32 text-slate-500 text-xs">Wilayah</TableHead>
                  <TableHead className="w-28 text-slate-500 text-xs">Tanggal</TableHead>
                  <TableHead className="w-28 text-slate-500 text-xs text-center">Peserta</TableHead>
                  <TableHead className="w-32 text-slate-500 text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row, idx) => (
                  <React.Fragment key={row.no}>
                    <TableRow
                      className="cursor-pointer"
                      onClick={() => setExpandedNo(expandedNo === row.no ? null : row.no)}
                    >
                      <TableCell className="text-slate-400 text-xs pl-5">{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell className="font-medium text-slate-900">{row.nama}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{row.penyelenggara}</TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {row.wilayah}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">{row.tanggal}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {row.peserta}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", STATUS_BADGE[row.status])}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expandedNo === row.no && (
                      <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                        <TableCell colSpan={7} className="px-5 py-3">
                          <p className="text-sm text-slate-600">{row.deskripsi}</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
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
