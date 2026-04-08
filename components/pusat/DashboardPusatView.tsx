"use client"
import { useState } from "react"
import { ClipboardList, CheckCircle2, XCircle, Clock, MapPin, Users, Plus, ChevronRight, AlertTriangle, Building2, MapPinned, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { PokjaItem } from "@/types/pokja"

interface DashboardPusatViewProps {
  pokjaList: PokjaItem[]
  onValidatePusat?: (pokja: PokjaItem) => void
  onViewSumberRujukan?: () => void
  onViewActivities?: () => void
}

const RUJUKAN_BREAKDOWN = [
  { label: "Puskesmas / Faskes",  count: 48 },
  { label: "Konselor Sekolah",    count: 37 },
  { label: "Kepolisian",          count: 29 },
  { label: "LBH / Bantuan Hukum", count: 18 },
  { label: "Lainnya",             count: 12 },
]
const RUJUKAN_COLORS = ["#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#64748b"]

// Data provinsi dengan jumlah kab/kota dan pokja yang terbentuk
const PROVINCE_DATA = [
  { nama: "Prov. Aceh", totalKabKota: 23, pokjaKabKota: 0 },
  { nama: "Prov. Bali", totalKabKota: 9, pokjaKabKota: 0 },
  { nama: "Prov. Banten", totalKabKota: 8, pokjaKabKota: 0 },
  { nama: "Prov. Bengkulu", totalKabKota: 10, pokjaKabKota: 0 },
  { nama: "Prov. D.I. Yogyakarta", totalKabKota: 5, pokjaKabKota: 0 },
  { nama: "Prov. D.K.I. Jakarta", totalKabKota: 1, pokjaKabKota: 0 },
  { nama: "Prov. Gorontalo", totalKabKota: 6, pokjaKabKota: 0 },
  { nama: "Prov. Jambi", totalKabKota: 11, pokjaKabKota: 0 },
  { nama: "Prov. Jawa Barat", totalKabKota: 27, pokjaKabKota: 0 },
  { nama: "Prov. Jawa Tengah", totalKabKota: 35, pokjaKabKota: 0 },
  { nama: "Prov. Jawa Timur", totalKabKota: 38, pokjaKabKota: 2 },
  { nama: "Prov. Kalimantan Barat", totalKabKota: 14, pokjaKabKota: 0 },
  { nama: "Prov. Kalimantan Selatan", totalKabKota: 13, pokjaKabKota: 0 },
  { nama: "Prov. Kalimantan Tengah", totalKabKota: 14, pokjaKabKota: 0 },
  { nama: "Prov. Kalimantan Timur", totalKabKota: 10, pokjaKabKota: 0 },
  { nama: "Prov. Kalimantan Utara", totalKabKota: 5, pokjaKabKota: 0 },
  { nama: "Prov. Kepulauan Bangka Belitung", totalKabKota: 7, pokjaKabKota: 0 },
  { nama: "Prov. Kepulauan Riau", totalKabKota: 7, pokjaKabKota: 0 },
  { nama: "Prov. Lampung", totalKabKota: 15, pokjaKabKota: 0 },
  { nama: "Prov. Maluku", totalKabKota: 11, pokjaKabKota: 0 },
  { nama: "Prov. Maluku Utara", totalKabKota: 10, pokjaKabKota: 0 },
  { nama: "Prov. Nusa Tenggara Barat", totalKabKota: 10, pokjaKabKota: 0 },
  { nama: "Prov. Nusa Tenggara Timur", totalKabKota: 22, pokjaKabKota: 0 },
  { nama: "Prov. Papua", totalKabKota: 29, pokjaKabKota: 0 },
  { nama: "Prov. Papua Barat", totalKabKota: 13, pokjaKabKota: 0 },
  { nama: "Prov. Papua Barat Daya", totalKabKota: 5, pokjaKabKota: 0 },
  { nama: "Prov. Papua Pegunungan", totalKabKota: 8, pokjaKabKota: 0 },
  { nama: "Prov. Papua Selatan", totalKabKota: 4, pokjaKabKota: 0 },
  { nama: "Prov. Papua Tengah", totalKabKota: 8, pokjaKabKota: 0 },
  { nama: "Prov. Riau", totalKabKota: 12, pokjaKabKota: 0 },
  { nama: "Prov. Sulawesi Barat", totalKabKota: 6, pokjaKabKota: 0 },
  { nama: "Prov. Sulawesi Selatan", totalKabKota: 24, pokjaKabKota: 0 },
  { nama: "Prov. Sulawesi Tengah", totalKabKota: 13, pokjaKabKota: 0 },
  { nama: "Prov. Sulawesi Tenggara", totalKabKota: 17, pokjaKabKota: 0 },
  { nama: "Prov. Sulawesi Utara", totalKabKota: 15, pokjaKabKota: 0 },
  { nama: "Prov. Sumatra Barat", totalKabKota: 19, pokjaKabKota: 0 },
  { nama: "Prov. Sumatra Selatan", totalKabKota: 17, pokjaKabKota: 0 },
  { nama: "Prov. Sumatra Utara", totalKabKota: 33, pokjaKabKota: 0 },
]

export function DashboardPusatView({ pokjaList, onValidatePusat, onViewSumberRujukan, onViewActivities }: DashboardPusatViewProps) {
  const [search, setSearch] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)

  const aktif = pokjaList.filter((p) => p.status === "aktif").length
  const menunggu = pokjaList.filter((p) => p.status === "masih-diverifikasi").length
  const ditolak = pokjaList.filter((p) => p.status === "ditolak").length
  const total = pokjaList.length

  // Hitung total provinsi, kab/kota, dan pokja kab/kota yang terbentuk
  const totalProvinsi = PROVINCE_DATA.length
  const totalKabKota = PROVINCE_DATA.reduce((sum, p) => sum + p.totalKabKota, 0)
  const totalPokjaKabKota = PROVINCE_DATA.reduce((sum, p) => sum + p.pokjaKabKota, 0)
  const persentaseNasional = totalKabKota > 0 ? ((totalPokjaKabKota / totalKabKota) * 100).toFixed(1) : "0.0"
  
  // Hitung provinsi yang sudah terbentuk (punya minimal 1 pokja kab/kota)
  const provinsiTerbentuk = PROVINCE_DATA.filter(p => p.pokjaKabKota > 0).length

  // Filter data berdasarkan search
  const filteredProvinces = PROVINCE_DATA.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  // Stats untuk header cards
  const headerStats = [
    {
      label: "Provinsi Terbentuk",
      value: provinsiTerbentuk,
      total: `dari ${totalProvinsi} provinsi`,
      icon: Building2,
      color: "text-green-600",
      bg: "from-green-50 to-green-100/50",
      border: "border-green-200",
      iconBg: "bg-green-100",
    },
    {
      label: "Kab/Kota Terbentuk",
      value: totalPokjaKabKota,
      total: `dari ${totalKabKota} kab/kota`,
      icon: MapPinned,
      color: "text-blue-600",
      bg: "from-blue-50 to-blue-100/50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      label: "Persentase Nasional",
      value: `${persentaseNasional}%`,
      total: "capaian seluruh Indonesia",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "from-purple-50 to-purple-100/50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Stats - 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {headerStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`relative rounded-2xl border-2 ${stat.border} bg-gradient-to-br ${stat.bg} p-5 overflow-hidden`}
            >
              {/* Decorative icon background */}
              <div className="absolute top-3 right-3 opacity-10">
                <Icon className="w-20 h-20" />
              </div>
              
              <div className="relative z-10">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  {stat.label}
                </p>
                <p className={`text-4xl font-bold ${stat.color} leading-none mb-1`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.total}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabel Provinsi dengan Header */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Jumlah Kelompok Kerja tiap Provinsi</h2>
          <p className="text-sm text-gray-500">
            per {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            [Update terakhir: {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}]
          </p>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <label htmlFor="entries" className="text-sm text-gray-600">Tampilkan</label>
            <select 
              id="entries"
              value={entriesPerPage} 
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">data</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="search" className="text-sm text-gray-600">Cari:</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nama provinsi..."
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900">
                    No
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900">
                    Nama Provinsi
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900">
                    Lihat Pokja
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900">
                    Status Pokja
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900 mx-auto">
                    Jumlah Kota/Kab
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900 mx-auto">
                    Pokja Kota/Kab
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900 mx-auto">
                    Persentase
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProvinces.slice(0, entriesPerPage).map((prov, idx) => {
                const persentase = prov.totalKabKota > 0 ? ((prov.pokjaKabKota / prov.totalKabKota) * 100).toFixed(0) : 0
                const status = prov.pokjaKabKota > 0 ? "Ada" : "Belum Ada"
                const statusPokja = prov.pokjaKabKota > 0 ? "Ada" : "Belum"
                
                return (
                  <tr key={prov.nama} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <a href="#" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        {prov.nama}
                      </a>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                        status === "Ada" 
                          ? "bg-white border border-gray-300 text-gray-700" 
                          : "bg-gray-100 border border-gray-200 text-gray-500"
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                        statusPokja === "Ada" 
                          ? "bg-white border border-gray-300 text-gray-700" 
                          : "bg-gray-100 border border-gray-200 text-gray-500"
                      }`}>
                        {statusPokja}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-gray-900 font-medium">
                      {prov.totalKabKota}
                    </td>
                    <td className="px-4 py-3.5 text-center text-gray-900 font-medium">
                      {prov.pokjaKabKota}
                    </td>
                    <td className="px-4 py-3.5 text-center text-gray-900 font-medium">
                      {persentase}%
                    </td>
                  </tr>
                )
              })}
              {/* Total Row */}
              <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold">
                <td colSpan={4} className="px-4 py-3.5 text-center text-gray-900 uppercase tracking-wide">
                  Total Nasional
                </td>
                <td className="px-4 py-3.5 text-center text-gray-900">
                  {totalKabKota}
                </td>
                <td className="px-4 py-3.5 text-center text-gray-900">
                  {totalPokjaKabKota}
                </td>
                <td className="px-4 py-3.5 text-center text-gray-900">
                  {persentaseNasional}%
                </td>
              </tr>
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

      {/* Sumber Rujukan */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Sumber Rujukan</h3>
          {onViewSumberRujukan && (
            <button onClick={onViewSumberRujukan} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Kelola <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="px-5 py-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-44 h-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={RUJUKAN_BREAKDOWN} cx="50%" cy="50%" innerRadius={54} outerRadius={80} dataKey="count" startAngle={90} endAngle={-270} stroke="none">
                    {RUJUKAN_BREAKDOWN.map((_, i) => <Cell key={`cell-${i}`} fill={RUJUKAN_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-gray-900">{RUJUKAN_BREAKDOWN.reduce((a,b)=>a+b.count,0)}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
              {RUJUKAN_BREAKDOWN.map((r, i) => (
                <div key={r.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: RUJUKAN_COLORS[i]}} />
                  <p className="text-xs text-gray-600">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Nama</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Jenis</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Kontak</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {[{nama:"Klinik Sehat",jenis:"Kesehatan",kontak:"0812"},{nama:"Psikolog Dina",jenis:"Konseling",kontak:"0813"}].map((item,i)=>(
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-800 font-medium">{item.nama}</td>
                      <td className="px-3 py-2.5 text-gray-600">{item.jenis}</td>
                      <td className="px-3 py-2.5 text-gray-500">{item.kontak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Activities</h3>
          {onViewActivities && (
            <button onClick={onViewActivities} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Kelola <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="px-5 py-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-3 border border-gray-100 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Juni 2025</p>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["M","S","S","R","K","J","S"].map((d,i)=><p key={i} className="text-xs font-medium text-gray-400">{d}</p>)}
              {Array.from({length:30}).map((_,i)=><div key={i} className={`text-xs p-1 rounded ${[14,17,21].includes(i+1)?"bg-blue-100 text-blue-700 font-medium":"text-gray-500"}`}>{i+1}</div>)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase">Activities Mendatang</p>
            {[{tanggal:"14 Jun",judul:"Pelatihan"},{tanggal:"17 Jun",judul:"Verifikasi"},{tanggal:"21 Jun",judul:"Rapat"}].map((k,i)=>(
              <div key={i} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-700">{k.judul}</p>
                <p className="text-xs text-gray-500">{k.tanggal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
