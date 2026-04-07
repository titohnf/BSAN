"use client"
import { Search, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Filter } from "lucide-react"
import { useState } from "react"
import { PengajuanPokja, PengajuanStatus } from "@/data/mockPokja"

interface DaftarPengajuanViewProps {
  pengajuan: PengajuanPokja[]
  onSelect: (item: PengajuanPokja) => void
}

const STATUS_CONFIG: Record<PengajuanStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  "menunggu-validasi": { label: "Menunggu Validasi", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  disetujui: { label: "Disetujui", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  "ditolak-sebagian": { label: "Diterima Sebagian", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: AlertCircle },
  ditolak: { label: "Ditolak", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
}

const FILTER_OPTIONS: { value: PengajuanStatus | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "menunggu-validasi", label: "Menunggu Validasi" },
  { value: "disetujui", label: "Disetujui" },
  { value: "ditolak-sebagian", label: "Diterima Sebagian" },
  { value: "ditolak", label: "Ditolak" },
]

export function DaftarPengajuanView({ pengajuan, onSelect }: DaftarPengajuanViewProps) {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<PengajuanStatus | "semua">("semua")

  const filtered = pengajuan.filter((p) => {
    const matchSearch = p.wilayah.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "semua" || p.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari wilayah..."
            className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PengajuanStatus | "semua")}
            className="h-9 pl-9 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-gray-700"
          >
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Search className="w-8 h-8" />
            <p className="text-sm">Tidak ada pengajuan ditemukan</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wilayah</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Nomor SK</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Tanggal Pengajuan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const cfg = STATUS_CONFIG[p.status]
                const Icon = cfg.icon
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">{p.wilayah}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.members.length} anggota terdaftar</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">{p.nomorSK}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{p.tanggalPengajuan}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onSelect(p)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        {p.status === "menunggu-validasi" ? "Validasi" : "Lihat Detail"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 text-right">Menampilkan {filtered.length} dari {pengajuan.length} pengajuan</p>
    </div>
  )
}
