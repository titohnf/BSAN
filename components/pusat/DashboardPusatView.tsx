"use client"
import { ClipboardList, CheckCircle2, XCircle, Clock, MapPin } from "lucide-react"
import { PengajuanPokja } from "@/data/mockPokja"

interface DashboardPusatViewProps {
  pengajuan: PengajuanPokja[]
  onViewDaftar: () => void
}

export function DashboardPusatView({ pengajuan, onViewDaftar }: DashboardPusatViewProps) {
  const pending = pengajuan.filter((p) => p.status === "menunggu-validasi").length
  const approved = pengajuan.filter((p) => p.status === "disetujui" || p.status === "ditolak-sebagian").length
  const rejected = pengajuan.filter((p) => p.status === "ditolak").length
  const total = pengajuan.length

  const stats = [
    {
      label: "Menunggu Validasi",
      value: pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      label: "Disetujui",
      value: approved,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      label: "Ditolak",
      value: rejected,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      label: "Total Pengajuan",
      value: total,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl bg-emerald-700 text-white px-6 py-5">
        <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide">Selamat Datang</p>
        <h2 className="text-xl font-bold mt-1">Dashboard Admin Pusat</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={`rounded-xl border ${s.border} ${s.bg} p-4 flex flex-col gap-3`}
            >
              <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center ${s.color} shadow-sm`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pending list preview */}
      {pending > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-800">Pengajuan Menunggu Validasi</h3>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                {pending}
              </span>
            </div>
            <button
              onClick={onViewDaftar}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              Lihat Semua
            </button>
          </div>

          <ul className="divide-y divide-gray-100">
            {pengajuan
              .filter((p) => p.status === "menunggu-validasi")
              .slice(0, 3)
              .map((p) => (
                <li key={p.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.wilayah}</p>
                    <p className="text-xs text-gray-400">Diajukan {p.tanggalPengajuan}</p>
                  </div>
                  <button
                    onClick={onViewDaftar}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
                  >
                    Validasi
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
