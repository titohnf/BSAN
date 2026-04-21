"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Building2,
  BarChart3,
  Clock,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
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
} from "@/data/provinsiData"
import { MOCK_PENGAJUAN } from "@/data/mockPokja"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

function statusBadge(status: "Terbentuk" | "Dalam Proses" | "Belum Terbentuk") {
  if (status === "Terbentuk")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
        Terbentuk
      </Badge>
    )
  if (status === "Dalam Proses")
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
        Dalam Proses
      </Badge>
    )
  return (
    <Badge className="bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50">
      Belum Terbentuk
    </Badge>
  )
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
  sub: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-slate-800 font-medium text-sm mt-0.5">{label}</p>
      <p className="text-slate-400 text-xs mt-1">{sub}</p>
    </div>
  )
}

export default function DataPublikPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return PROVINSI_DATA.filter((r) => r.provinsi.toLowerCase().includes(q))
  }, [search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (v: string) => {
    setSearch(v)
    setPage(1)
  }

  const exportCSV = () => {
    const header = ["No", "Provinsi", "Status POKJA", "Jml Kab/Kota", "POKJA Kab/Kota", "Persentase"]
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
    a.download = "data-pokja-provinsi.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingNavbar />

      <div className="pt-16">
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Data Publik POKJA BSAN</h1>
            <p className="mt-2 text-blue-200 text-base max-w-xl">
              Data pembentukan Kelompok Kerja (POKJA) Budaya Sekolah Aman dan Nyaman
              seluruh provinsi di Indonesia.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <span className="font-semibold">Catatan:</span> Data di bawah ini merupakan data dummy untuk keperluan
              pengembangan dan demonstrasi sistem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={MapPin}
              label="Provinsi Terbentuk"
              value={`${PROVINSI_TERBENTUK}/${TOTAL_PROVINSI}`}
              sub="dari 38 provinsi"
              color="bg-blue-600"
            />
            <StatCard
              icon={Building2}
              label="Kab/Kota Terbentuk"
              value={`${KAB_KOTA_TERBENTUK}/${TOTAL_KAB_KOTA}`}
              sub="dari total kab/kota"
              color="bg-amber-500"
            />
            <StatCard
              icon={BarChart3}
              label="Persentase Nasional"
              value={`${PERSENTASE_NASIONAL}%`}
              sub="capaian di Indonesia"
              color="bg-emerald-600"
            />
            <StatCard
              icon={Clock}
              label="Terakhir Diperbarui"
              value="2 Feb 2026"
              sub={LAST_UPDATED}
              color="bg-slate-600"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">POKJA per Provinsi</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Menampilkan {paged.length} dari {filtered.length} provinsi
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
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
                  <TableHead className="text-slate-500 text-xs">Provinsi</TableHead>
                  <TableHead className="text-slate-500 text-xs">Status POKJA</TableHead>
                  <TableHead className="text-slate-500 text-xs text-right">Jml Kab/Kota</TableHead>
                  <TableHead className="text-slate-500 text-xs text-right">POKJA Kab/Kota</TableHead>
                  <TableHead className="text-slate-500 text-xs text-right">Persentase</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row) => {
                  const pokja = row.pokjaId
                    ? MOCK_PENGAJUAN.find((p) => p.id === row.pokjaId)
                    : null
                  const isExpanded = expandedId === row.pokjaId
                  return (
                    <React.Fragment key={row.no}>
                      <TableRow className="group">
                        <TableCell className="text-slate-400 text-xs pl-5">{row.no}</TableCell>
                        <TableCell className="font-medium text-slate-900">{row.provinsi}</TableCell>
                        <TableCell>{statusBadge(row.statusPokja)}</TableCell>
                        <TableCell className="text-slate-600 text-right">{row.jumlahKabKota}</TableCell>
                        <TableCell className="text-slate-600 text-right">{row.pokjaKabKota}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  row.persentase >= 50
                                    ? "bg-emerald-500"
                                    : row.persentase > 0
                                    ? "bg-amber-400"
                                    : "bg-slate-200"
                                )}
                                style={{ width: `${row.persentase}%` }}
                              />
                            </div>
                            <span className="text-slate-600 text-xs w-8 text-right">
                              {row.persentase}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {pokja && (
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : row.pokjaId!)
                              }
                              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                      {isExpanded && pokja && (
                        <TableRow className="bg-blue-50/40 hover:bg-blue-50/40">
                          <TableCell colSpan={7} className="px-5 py-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                              Anggota POKJA — {row.provinsi}
                            </p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200">
                                    <th className="text-left text-xs text-slate-500 pb-2 pr-4 font-medium">Nama</th>
                                    <th className="text-left text-xs text-slate-500 pb-2 pr-4 font-medium">Jabatan</th>
                                    <th className="text-left text-xs text-slate-500 pb-2 pr-4 font-medium">Instansi</th>
                                    <th className="text-left text-xs text-slate-500 pb-2 font-medium">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pokja.members.map((m, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                      <td className="py-2 pr-4 font-medium text-slate-900">{m.nama}</td>
                                      <td className="py-2 pr-4 text-slate-600">{m.jabatan}</td>
                                      <td className="py-2 pr-4 text-slate-500">{m.instansi}</td>
                                      <td className="py-2">
                                        <Badge
                                          className={cn(
                                            "text-xs",
                                            m.status === "approved"
                                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                              : m.status === "declined"
                                              ? "bg-red-50 text-red-700 border-red-200"
                                              : "bg-slate-50 text-slate-500 border-slate-200"
                                          )}
                                        >
                                          {m.status === "approved"
                                            ? "Disetujui"
                                            : m.status === "declined"
                                            ? "Ditolak"
                                            : "Menunggu"}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-slate-400 text-xs">
                  Halaman {page} dari {totalPages}
                </p>
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

      <LandingFooter />
    </div>
  )
}
