"use client"
import { ClipboardList, CheckCircle2, XCircle, Clock, MapPin, Users, Plus, ChevronRight } from "lucide-react"
import type { PokjaItem } from "@/types/pokja"

interface DashboardPusatViewProps {
  pokjaList: PokjaItem[]
  onValidatePusat?: (pokja: PokjaItem) => void
}

export function DashboardPusatView({ pokjaList, onValidatePusat }: DashboardPusatViewProps) {
  const aktif = pokjaList.filter((p) => p.status === "aktif").length
  const menunggu = pokjaList.filter((p) => p.status === "masih-diverifikasi").length
  const ditolak = pokjaList.filter((p) => p.status === "ditolak").length
  const total = pokjaList.length
  const completionRate = Math.round((aktif / 34) * 100)

  // Mock data untuk semua provinsi (dalam实际的 app, ini diambil dari database)
  const provinces = [
    { prov: "Prov. Aceh", pokja: aktif > 0 ? 1 : 0, status: aktif > 0 ? "aktif" : "belum" },
    { prov: "Prov. Sumatra Utara", pokja: 4, status: "aktif" },
    { prov: "Prov. Sumatra Barat", pokja: 3, status: "aktif" },
    { prov: "Prov. Riau", pokja: 2, status: "aktif" },
    { prov: "Prov. Jambi", pokja: 1, status: "aktif" },
    { prov: "Prov. Sumatra Selatan", pokja: 2, status: "aktif" },
    { prov: "Prov. Bengkulu", pokja: 1, status: "aktif" },
    { prov: "Prov. Lampung", pokja: 2, status: "aktif" },
    { prov: "Prov. DKI Jakarta", pokja: 1, status: "aktif" },
    { prov: "Prov. Jawa Barat", pokja: 5, status: "aktif" },
    { prov: "Prov. Jawa Tengah", pokja: 4, status: "aktif" },
    { prov: "Prov. Jawa Timur", pokja: 4, status: "aktif" },
    { prov: "Prov. DI Yogyakarta", pokja: 1, status: "aktif" },
    { prov: "Prov. Banten", pokja: 2, status: "aktif" },
    { prov: "Prov. Bali", pokja: 1, status: "aktif" },
    { prov: "Prov. Nusa Tenggara Barat", pokja: 1, status: "aktif" },
    { prov: "Prov. Nusa Tenggara Timur", pokja: 1, status: "aktif" },
    { prov: "Prov. Kalimantan Barat", pokja: 1, status: "aktif" },
    { prov: "Prov. Kalimantan Tengah", pokja: 1, status: "aktif" },
    { prov: "Prov. Kalimantan Selatan", pokja: 1, status: "aktif" },
    { prov: "Prov. Kalimantan Timur", pokja: 1, status: "aktif" },
    { prov: "Prov. Sulawesi Utara", pokja: 1, status: "aktif" },
    { prov: "Prov. Sulawesi Tengah", pokja: 1, status: "aktif" },
    { prov: "Prov. Sulawesi Selatan", pokja: 1, status: "aktif" },
    { prov: "Prov. Sulawesi Tenggara", pokja: 1, status: "aktif" },
    { prov: "Prov. Maluku", pokja: 0, status: "belum" },
    { prov: "Prov. Maluku Utara", pokja: 0, status: "belum" },
    { prov: "Prov. Papua", pokja: 0, status: "belum" },
    { prov: "Prov. Papua Barat", pokja: 0, status: "belum" },
    { prov: "Prov. Gorontalo", pokja: 0, status: "belum" },
    { prov: "Prov. Sulawesi Barat", pokja: 0, status: "belum" },
    { prov: "Prov. Kalimantan Utara", pokja: 0, status: "belum" },
    { prov: "Prov. Kepulauan Riau", pokja: 0, status: "belum" },
    { prov: "Prov. Kepulauan Bangka Belitung", pokja: 0, status: "belum" },
  ]

  const stats = [
    {
      label: "POKJA Aktif",
      value: aktif,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      label: "Menunggu Verifikasi",
      value: menunggu,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      label: "Ditolak",
      value: ditolak,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      label: "Total POKJA",
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
      <div className="rounded-xl bg-slate-800 text-white px-6 py-5">
        <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">Selamat Datang</p>
        <h2 className="text-xl font-bold mt-1">Dashboard Admin Pusat - Nasional</h2>
        <p className="text-sm text-slate-400 mt-1">Pengelolaan POKJA Budaya Sekolah Aman dan Nyaman Seluruh Indonesia</p>
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

      {/* Progress completion */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Cakupan Pembentukan POKJA Nasional</h3>
          <span className="text-sm font-bold text-gray-900">{completionRate}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {aktif} dari 34 provinsi telah membentuk POKJA
        </p>
      </div>

      {/* Tabel provinsi */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Pembentukan POKJA per Provinsi</h3>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Provinsi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Jumlah POKJA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {provinces.map((p, i) => (
                <tr key={p.prov} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.prov}</td>
                  <td className="px-4 py-3">
                    {p.status === "aktif" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Belum Dibentuk
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{p.pokja}</span>
                      <span className="text-gray-400 text-xs">POKJA</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daftar pokja menunggu verifikasi */}
      {menunggu > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-gray-800">POKJA Menunggu Verifikasi</h3>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold">
                {menunggu}
              </span>
            </div>
          </div>
          <ul className="divide-y divide-amber-100">
            {pokjaList
              .filter((p) => p.status === "masih-diverifikasi")
              .slice(0, 5)
              .map((p) => (
                <li key={p.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.nama}</p>
                    <p className="text-xs text-gray-500">{p.data?.region}</p>
                  </div>
                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                    Menunggu Verifikasi
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}