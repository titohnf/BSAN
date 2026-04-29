"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Building2,
  BarChart3,
  Search,
  Download,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PROVINSI_DATA,
  TOTAL_PROVINSI,
  TOTAL_KAB_KOTA,
  PROVINSI_TERBENTUK,
  KAB_KOTA_TERBENTUK,
  PERSENTASE_NASIONAL,
  LAST_UPDATED,
  type ProvinsiRow,
} from "@/data/provinsiData"
import { MOCK_PENGAJUAN, generateDummyPokja } from "@/data/mockPokja"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

function statusBadge(status: ProvinsiRow["statusPokja"]) {
  const map: Record<ProvinsiRow["statusPokja"], { label: string; className: string }> = {
    "Aktif":           { label: "Aktif",           className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" },
    "Perlu Diperiksa": { label: "Perlu Diperiksa", className: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50" },
    "Perlu Perbaikan": { label: "Perlu Perbaikan", className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50" },
    "Belum Dibentuk":  { label: "Belum Dibentuk",  className: "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50" },
    "Belum Terbentuk": { label: "Belum Terbentuk", className: "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50" },
  }
  const { label, className } = map[status] ?? map["Belum Terbentuk"]
  return <Badge className={className}>{label}</Badge>
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
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

function DetailModal({ row, onClose }: { row: ProvinsiRow; onClose: () => void }) {
  const pokja = row.pokjaId
    ? MOCK_PENGAJUAN.find((p) => p.id === row.pokjaId) ?? generateDummyPokja(row.no, row.provinsi, row.kontak)
    : generateDummyPokja(row.no, row.provinsi, row.kontak)
  const wilayah = row.provinsi.includes(" - ")
    ? `Kota ${row.provinsi.split(" - ")[1]}, ${row.provinsi.split(" - ")[0]}`
    : `Provinsi ${row.provinsi}`

  const waNumber = row.kontak
    ? `62${row.kontak.replace(/^0/, "")}`
    : pokja?.kanalPengaduan
    ? `62${pokja.kanalPengaduan.replace(/^0/, "")}`
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Kelompok Kerja</p>
            <h3 className="text-base font-bold text-slate-900">{wilayah}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg ml-4 shrink-0">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">

          {/* Status + Kontak + Stat Cards */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Status</p>
                {statusBadge(row.statusPokja)}
              </div>
              {waNumber && (
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Kontak</p>
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {row.kontak ?? pokja?.kanalPengaduan}
                  </a>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1">
              <p className="text-xs text-slate-500">Jumlah Bidang</p>
              <p className="text-2xl font-bold text-slate-900">{row.bidangTersedia ?? pokja?.members.filter(m => m.jabatan.startsWith("Bidang")).length ?? "-"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1">
              <p className="text-xs text-slate-500">Jumlah Anggota</p>
              <p className="text-2xl font-bold text-slate-900">{pokja?.members.length ?? "-"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1">
              <p className="text-xs text-slate-500">Skor</p>
              <p className={cn(
                "text-2xl font-bold",
                row.skor != null && row.skor >= 75 ? "text-emerald-600"
                  : row.skor != null && row.skor >= 50 ? "text-amber-600"
                  : "text-slate-900"
              )}>
                {row.skor ?? "-"}
              </p>
            </div>
            </div>
          </div>

          {/* SK Detail */}
          {pokja && (
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Detail SK</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Nomor SK</p>
                  <p className="text-sm font-semibold text-slate-900">{pokja.nomorSK}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Tanggal Berlaku</p>
                  <p className="text-sm font-semibold text-slate-900">{pokja.periodeMulai}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Tanggal Berakhir</p>
                  <p className="text-sm font-semibold text-slate-900">{pokja.periodeSelesai}</p>
                </div>
              </div>
              <a
                href={`/sk/${pokja.skFileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview SK — {pokja.skFileName}
              </a>
            </div>
          )}

          {/* Tabel Pokja */}
          {pokja && pokja.members.length > 0 && (
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Anggota Kelompok Kerja</p>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left text-xs text-slate-500 px-4 py-2.5 font-medium">Peran di Kelompok Kerja</th>
                      <th className="text-left text-xs text-slate-500 px-4 py-2.5 font-medium">Asal Instansi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pokja.members.map((m, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-4 py-2.5 text-slate-900 text-xs font-medium">
                          {m.jabatan.startsWith("Bidang") ? `anggota ${m.jabatan}` : m.jabatan}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 text-xs">{m.instansi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <Button onClick={onClose} variant="outline" className="border-slate-200 text-sm">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DataPublikContent({ showBackButton = false }: { showBackButton?: boolean }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [showWilayahModal, setShowWilayahModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState<ProvinsiRow | null>(null)
  const [statusFilter, setStatusFilter] = useState<ProvinsiRow["statusPokja"] | "Semua">("Semua")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return PROVINSI_DATA.filter((r) =>
      r.provinsi.toLowerCase().includes(q) &&
      r.statusPokja !== "Belum Terbentuk" &&
      (statusFilter === "Semua" || r.statusPokja === statusFilter)
    )
  }, [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (v: string) => {
    setSearch(v)
    setPage(1)
    setStatusFilter("Semua")
  }

  const exportCSV = () => {
    const header = ["No", "Provinsi", "Status Kelompok Kerja", "Jml Kab/Kota", "Kelompok Kerja Kab/Kota", "Persentase"]
    const rows = PROVINSI_DATA.map((r) => [
      r.no,
      r.provinsi,
      r.statusPokja,
      r.jumlahKabKota,
      r.pokjaKabKota,
      `${r.persentase}%`,
    ])
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data-kelompok-kerja-provinsi.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pt-16">
        <div className="bg-[#C8F1F7]">
          <div className="max-w-6xl mx-auto px-4">
            {showBackButton && (
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Beranda
              </button>
            )}
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div className="pb-16 pt-16">
                <h1 className="text-sm md:text-base font-bold text-slate-800">Selamat Datang di</h1>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">Portal Budaya Sekolah Aman dan Nyaman (BSAN)</h1>
                <p className="mt-3 text-slate-700 text-base max-w-xl">
                  Lihat informasi pembentukan kelompok kerja BSAN beserta beragam informasi
                  dan Sumber Dukungan di Daerah Anda.
                </p>
              </div>
              <div className="hidden md:block self-end">
                <img
                  src="/herobsan.png"
                  alt="Ilustrasi BSAN"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-0 mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 mt-16">Data Kelompok Kerja</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={MapPin}
              label="Provinsi Terbentuk"
              value={PROVINSI_TERBENTUK}
              sub={`dari ${TOTAL_PROVINSI} provinsi`}
              color="bg-blue-600"
            />
            <StatCard
              icon={Building2}
              label="Kab/Kota Terbentuk"
              value={KAB_KOTA_TERBENTUK}
              sub={`dari ${TOTAL_KAB_KOTA} kab/kota`}
              color="bg-amber-500"
            />
            <StatCard
              icon={BarChart3}
              label="Persentase Nasional"
              value={`${PERSENTASE_NASIONAL}%`}
              sub="capaian di Indonesia"
              color="bg-emerald-600"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
              <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="font-semibold text-slate-900">Kelompok Kerja: {search || "Seluruh Indonesia"}</h2>
                  <Button variant="outline" size="sm" onClick={() => setShowWilayahModal(true)} className="w-fit h-7 text-xs gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Ganti
                  </Button>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  {filtered.length} provinsi ditemukan
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1) }}
                  className="h-9 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-700 shrink-0"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Perlu Diperiksa">Perlu Diperiksa</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                  <option value="Belum Dibentuk">Belum Dibentuk</option>
                </select>
                <div className="relative flex-1 sm:flex-none sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari provinsi..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportCSV}
                  className="gap-1.5 border-slate-200 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                  <TableHead className="w-10 text-slate-500 text-xs pl-5">No</TableHead>
                  <TableHead className="text-slate-500 text-xs">Wilayah</TableHead>
                  <TableHead className="text-slate-500 text-xs">Provinsi</TableHead>
                  <TableHead className="w-36 text-slate-500 text-xs">Status Kelompok Kerja</TableHead>
                  <TableHead className="w-36 text-slate-500 text-xs text-center">Jumlah Bidang</TableHead>
                  <TableHead className="w-36 text-slate-500 text-xs">Kontak</TableHead>
                  <TableHead className="w-36 text-slate-500 text-xs text-center">Skor Terakhir</TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row, idx) => {
                  return (
                    <React.Fragment key={row.no}>
                      <TableRow className="group">
                        <TableCell className="text-slate-400 text-xs pl-5">{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {row.provinsi.includes(" - ") ? `Kota ${row.provinsi.split(" - ")[1]}` : `Provinsi ${row.provinsi}`}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {row.provinsi.includes(" - ") ? row.provinsi.split(" - ")[0] : "-"}
                        </TableCell>
                        <TableCell>{statusBadge(row.statusPokja)}</TableCell>
                        <TableCell className="text-center">
                          {row.bidangTersedia != null ? (
                            <span className="text-slate-700">{row.bidangTersedia}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600 text-xs">
                          {row.kontak ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.skor != null ? (
                            <span className={cn(
                              "font-semibold text-sm",
                              row.skor >= 75 ? "text-emerald-600" : row.skor >= 50 ? "text-amber-600" : "text-slate-500"
                            )}>
                              {row.skor}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {row.statusPokja === "Aktif" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRow(row)}
                              className="h-7 text-xs border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              Lihat Detail
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>

            {totalPages >= 1 && (
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <p className="text-slate-400 text-xs">
                    Menampilkan {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <select
                      value={PAGE_SIZE}
                      onChange={(e) => { setPage(1) }}
                      className="px-1 py-0.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-slate-400 text-xs">baris/halaman</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 px-3 text-xs border-slate-200"
                  >
                    Sebelumnya
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - page) <= 2)
                    .map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className={cn(
                          "h-8 w-8 p-0 text-xs",
                          p === page
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "border-slate-200"
                        )}
                      >
                        {p}
                      </Button>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 px-3 text-xs border-slate-200"
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRow && (
        <DetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}

      {/* Wilayah Modal */}
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
            <div className="flex-1 overflow-hidden">
              <div className="flex h-full max-h-[400px]">
                <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => { setSearch(""); setPage(1); setShowWilayahModal(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${!search ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}
                    >
                      Semua Wilayah
                    </button>
                    {PROVINSI_DATA.map((prov) => {
                      const isSelected = search === prov.provinsi
                      return (
                        <button
                          key={prov.provinsi}
                          onClick={() => { setSearch(prov.provinsi); setPage(1); setShowWilayahModal(false) }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                            isSelected ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="truncate">{prov.provinsi}</span>
                          <span className="text-xs text-gray-400">{prov.jumlahKabKota}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="w-1/2 overflow-y-auto bg-white">
                  <div className="p-2">
                    {search ? (
                      (() => {
                        const prov = PROVINSI_DATA.find(p => p.provinsi === search)
                        const kabCount = prov?.jumlahKabKota ?? 0
                        if (kabCount === 0) {
                          return <p className="text-sm text-gray-400 p-3">Tidak ada kabupaten/kota</p>
                        }
                        return (
                          <>
                            <button
                              onClick={() => { setSearch(search); setPage(1); setShowWilayahModal(false) }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
                            >
                              Semua Kabupaten/Kota
                            </button>
                            {Array.from({ length: kabCount }, (_, i) => (
                              <button
                                key={i}
                                onClick={() => { setSearch(`${search} - Kab/Kota ${i + 1}`); setPage(1); setShowWilayahModal(false) }}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
                              >
                                Kab/Kota {i + 1}
                              </button>
                            ))}
                          </>
                        )
                      })()
                    ) : (
                      <p className="text-sm text-gray-400 p-3">Pilih wilayah di kiri</p>
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