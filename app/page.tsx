"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, BookOpen, Calendar, ChevronLeft, ChevronRight, ChevronDown, MapPin, X } from "lucide-react"
import { PieChart, Pie, Cell, Label } from "recharts"
import {
  TOTAL_PROVINSI,
  TOTAL_KAB_KOTA,
  PROVINSI_DATA,
  KAB_KOTA_PER_PROVINSI,
} from "@/data/provinsiData"
import { MOCK_KEGIATAN } from "@/components/landing/KegiatanContent"
import { SEED, KATEGORI_CONFIG } from "@/components/dashboard/SumberRujukanView"
import type { KategoriDukungan } from "@/components/dashboard/SumberRujukanView"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const ALL_VERIFIED = SEED.filter((i) => i.status === "terverifikasi")

const CHART_COLORS: Record<KategoriDukungan, string> = {
  "Fasilitas Kesehatan": "#e11d48",
  "Konseling":           "#9333ea",
  "Bantuan Hukum":       "#2563eb",
  "Kepolisian":          "#4f46e5",
  "Psikologi":           "#db2777",
  "Pendidikan":          "#16a34a",
  "Sosial":              "#d97706",
  "Lainnya":             "#6b7280",
}

const PROVINCE_OPTIONS = PROVINSI_DATA
  .filter((p) => !p.provinsi.includes(" - "))
  .map((p) => p.provinsi)
  .sort()

function Divider() {
  return <div className="hidden lg:block w-px self-stretch bg-slate-200 shrink-0" />
}


export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedKota, setSelectedKota] = useState("")
  const [showWilayahModal, setShowWilayahModal] = useState(false)
  const [modalBrowseProvince, setModalBrowseProvince] = useState<string | null>(null)
  const [modalPendingProvince, setModalPendingProvince] = useState("")
  const [modalPendingKota, setModalPendingKota] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setSelectedDate(new Date())
  }, [])

  useEffect(() => {
    const auth = localStorage.getItem("auth")
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed.role === "pusat" || parsed.role === "dinas" || parsed.role === "sekolah") {
          router.replace("/dashboard")
          return
        }
      } catch {}
    }
  }, [router])

  const kotaOptions = useMemo(() => {
    if (!selectedProvince) return []
    return PROVINSI_DATA
      .filter((p) => p.provinsi.startsWith(selectedProvince + " - "))
      .map((p) => p.provinsi.split(" - ")[1])
  }, [selectedProvince])

  const handleProvinceChange = (val: string) => {
    setSelectedProvince(val)
    setSelectedKota("")
  }

  const filteredPokja = useMemo(() => {
    if (selectedProvince === "__hanya_provinsi__") {
      return PROVINSI_DATA.filter((p) => !p.provinsi.includes(" - "))
    }
    if (selectedKota) {
      return PROVINSI_DATA.filter((p) => p.provinsi === `${selectedProvince} - ${selectedKota}`)
    }
    if (selectedProvince) {
      return PROVINSI_DATA.filter(
        (p) => p.provinsi === selectedProvince || p.provinsi.startsWith(selectedProvince + " - ")
      )
    }
    return PROVINSI_DATA
  }, [selectedProvince, selectedKota])

  const pokjaAktif = filteredPokja.filter((p) => p.statusPokja === "Aktif" && !p.provinsi.includes(" - ")).length
  const totalKabKotaFiltered = filteredPokja.reduce((s, p) => s + p.pokjaKabKota, 0)
  const pokjaTotal = filteredPokja.length
  const kabKotaDenominator = selectedProvince
    ? (KAB_KOTA_PER_PROVINSI[selectedProvince] ?? TOTAL_KAB_KOTA)
    : TOTAL_KAB_KOTA

  const filteredSumber = useMemo(() => {
    return ALL_VERIFIED.filter((i) => {
      if (selectedProvince === "__hanya_provinsi__") return true
      if (selectedKota) return i.provinsi === selectedProvince && i.kabupatenKota === selectedKota
      if (selectedProvince) return i.provinsi === selectedProvince
      return true
    })
  }, [selectedProvince, selectedKota])

  const sumberChartData = useMemo(() =>
    (Object.keys(KATEGORI_CONFIG) as KategoriDukungan[]).map((key) => ({
      name: KATEGORI_CONFIG[key].label,
      value: filteredSumber.filter((i) => i.kategoriBentukDukungan === key).length,
      fill: CHART_COLORS[key],
    })).filter((d) => d.value > 0)
  , [filteredSumber])

  const filteredKegiatan = useMemo(() => {
    if (selectedProvince === "__hanya_provinsi__") return MOCK_KEGIATAN
    if (selectedKota) {
      return MOCK_KEGIATAN.filter((k) =>
        k.wilayah.toLowerCase().includes(selectedKota.toLowerCase())
      )
    }
    return MOCK_KEGIATAN
  }, [selectedProvince, selectedKota])

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    return filteredKegiatan.filter(k => new Date(k.tanggal).toDateString() === selectedDate.toDateString())
  }, [selectedDate, filteredKegiatan])

  const shiftDay = (delta: number) => setSelectedDate(d => {
    if (!d) return d
    const next = new Date(d)
    next.setDate(d.getDate() + delta)
    return next
  })

  const isFiltered = selectedProvince !== ""

  return (
    <main>
      <LandingNavbar />
      <div className="min-h-screen bg-slate-50">
        <div className="pt-16">

          {/* Hero */}
          <div className="bg-[#C8F1F7]">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-end">
                <div className="pb-16 pt-16">
                  <p className="text-sm md:text-base font-bold text-slate-800">Selamat Datang di</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                    Portal Budaya Sekolah Aman dan Nyaman (BSAN)
                  </h1>
                  <p className="mt-3 text-slate-700 text-base max-w-xl">
                    Lihat informasi pembentukan kelompok kerja BSAN beserta beragam informasi
                    dan Sumber Dukungan di Daerah Anda.
                  </p>
                </div>
                <div className="hidden md:block self-end">
                  <img src="/herobsan.png" alt="Ilustrasi BSAN" className="w-full h-auto rounded-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Summary section */}
          <div className="max-w-6xl mx-auto px-4 py-12">

            {/* Section header + filter */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-900 shrink-0">Ringkasan Portal BSAN</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setModalPendingProvince(selectedProvince)
                    setModalPendingKota(selectedProvince ? selectedKota : null)
                    setModalBrowseProvince(selectedProvince || null)
                    setShowWilayahModal(true)
                  }}
                  className="h-9 px-3 text-sm border border-slate-400 rounded-lg bg-white text-slate-800 font-medium hover:bg-slate-50 hover:border-slate-500 transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="max-w-[200px] truncate">
                    {selectedProvince === "__hanya_provinsi__" ? "Hanya Tingkat Provinsi" : selectedKota ? `${selectedKota}, ${selectedProvince}` : selectedProvince || "Seluruh Indonesia"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
                {isFiltered && (
                  <button
                    onClick={() => { setSelectedProvince(""); setSelectedKota("") }}
                    className="h-9 px-3 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">

              {/* ── Kelompok Kerja ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">

                  {/* Identity */}
                  <div className="bg-slate-50 lg:w-56 p-6 shrink-0">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900">Kelompok Kerja</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        Pembentukan Pokja BSAN di seluruh Indonesia
                      </p>
                    </div>
                  </div>

{/* Metrics + breakdown */}
                  <div className="flex-1 px-6 py-7 min-h-[200px] flex items-center gap-6">

                    {filteredPokja.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
                        <p className="text-sm font-medium text-slate-500">Belum ada data Kelompok Kerja</p>
                        <p className="text-xs text-slate-400">untuk wilayah yang dipilih</p>
                      </div>
                    ) : selectedKota ? (() => {
                      const row = filteredPokja[0]
                      const STATUS_STYLE: Record<string, string> = {
                        "Aktif":             "bg-emerald-100 text-emerald-700 border border-emerald-200",
                        "Perlu Diperiksa":   "bg-amber-100 text-amber-700 border border-amber-200",
                        "Perlu Perbaikan":   "bg-orange-100 text-orange-700 border border-orange-200",
                        "Belum Dibentuk":    "bg-slate-100 text-slate-500 border border-slate-200",
                        "Belum Terbentuk":   "bg-slate-100 text-slate-500 border border-slate-200",
                      }
                      return (
                        <div className="flex flex-1 items-center gap-6">
                          <div className="shrink-0">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status Pokja</p>
                            <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold", STATUS_STYLE[row.statusPokja] ?? STATUS_STYLE["Belum Terbentuk"])}>
                              {row.statusPokja}
                            </span>
                          </div>
                          {row.skor != null && (<>
                            <Divider />
                            <div className="shrink-0">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Skor</p>
                              <p className="text-3xl font-extrabold text-black tabular-nums">{row.skor}</p>
                            </div>
                          </>)}
                          {row.bidangTersedia != null && (<>
                            <Divider />
                            <div className="shrink-0">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bidang Tersedia</p>
                              <p className="text-3xl font-extrabold text-black tabular-nums">{row.bidangTersedia}</p>
                            </div>
                          </>)}
                        </div>
                      )
                    })() : selectedProvince === "__hanya_provinsi__" ? (
                      <div className="flex flex-1 items-start gap-6 overflow-hidden">
                        <div className="shrink-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Provinsi Terbentuk</p>
                          <p className="text-3xl font-extrabold text-black tabular-nums leading-none">
                            {pokjaAktif}
                            <span className="text-sm font-semibold text-emerald-600 ml-1.5">{Math.round(pokjaAktif / TOTAL_PROVINSI * 100)}%</span>
                          </p>
                          <p className="text-sm text-slate-400 mt-1">dari {TOTAL_PROVINSI} Provinsi</p>
                        </div>
                        <Divider />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Provinsi Aktif</p>
                          {(() => {
                            const aktifList = filteredPokja.filter(p => p.statusPokja === "Aktif").map(p => p.provinsi)
                            const visible = aktifList.slice(0, 10)
                            const hidden = aktifList.slice(10)
                            return (
                              <div className="flex flex-wrap gap-1.5">
                                {visible.map(name => (
                                  <span key={name} className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    {name}
                                  </span>
                                ))}
                                {hidden.length > 0 && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-500 cursor-default">
                                        dan {hidden.length} provinsi lainnya
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="!bg-white !text-slate-700 border border-slate-200 shadow-md px-3 py-2" arrowClassName="!bg-white !fill-white">
                                      <ul className="space-y-1">
                                        {hidden.map(name => <li key={name} className="text-xs">{name}</li>)}
                                      </ul>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    ) : (
                    <div className="flex flex-1 gap-6">

                      {/* Provinsi Terbentuk */}
                      <div className="shrink-0">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Provinsi Terbentuk</p>
                        <p className="text-3xl font-extrabold text-black tabular-nums leading-none">
                          {isFiltered ? 1 : pokjaAktif}
                          <span className="text-sm font-semibold text-emerald-600 ml-1.5">{isFiltered ? 100 : Math.round(pokjaAktif / TOTAL_PROVINSI * 100)}%</span>
                        </p>
                        <p className="text-sm text-slate-400 mt-1">dari {isFiltered ? 1 : TOTAL_PROVINSI} Provinsi</p>
                      </div>

                      <Divider />

                      {/* Kab/Kota Terbentuk */}
                      <div className="shrink-0">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kab/Kota Terbentuk</p>
                        <p className="text-3xl font-extrabold text-black tabular-nums leading-none">
                          {totalKabKotaFiltered}
                          <span className="text-sm font-semibold text-emerald-600 ml-1.5">{Math.round(totalKabKotaFiltered / kabKotaDenominator * 100)}%</span>
                        </p>
                        <p className="text-sm text-slate-400 mt-1">dari {kabKotaDenominator} Kab/Kota</p>
                      </div>

                      <Divider />

                      {/* Capaian Nasional / Provinsi */}
                      <div className="shrink-0">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{isFiltered ? "Capaian Provinsi" : "Capaian Nasional"}</p>
                        <p className="text-3xl font-extrabold text-black tabular-nums">
                          {Math.round(((isFiltered ? 1 : pokjaAktif) + totalKabKotaFiltered) / (isFiltered ? 1 + kabKotaDenominator : 38 + 514) * 100)}%
                        </p>
                      </div>
                    </div>
                    )}

                    <Divider />

                    {/* Button - right side */}
                    <Button
                      onClick={() => router.push("/kelompok-kerja")}
                      size="sm"
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 gap-1 shrink-0"
                    >
                      Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* ── Sumber Dukungan ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">

                  {/* Identity */}
                  <div className="bg-slate-50 lg:w-56 p-6 shrink-0">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-3">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900">Sumber Dukungan</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        Layanan terverifikasi untuk implementasi BSAN
                      </p>
                    </div>
                  </div>

                  {/* Metrics + breakdown */}
                  <div className="flex-1 px-6 py-7 flex items-center gap-6">

                    {filteredSumber.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
                        <p className="text-sm font-medium text-slate-500">Belum ada Sumber Dukungan</p>
                        <p className="text-xs text-slate-400">untuk wilayah yang dipilih</p>
                      </div>
                    ) : (
                    <div className="flex flex-1 items-center gap-6">
                      <div className="shrink-0">
                        {mounted ? (
                          <PieChart width={144} height={144}>
                            <Pie
                              data={sumberChartData}
                              cx={72}
                              cy={72}
                              innerRadius={44}
                              outerRadius={66}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {sumberChartData.map((entry) => (
                                <Cell key={entry.name} fill={entry.fill} />
                              ))}
                              <Label
                                content={({ viewBox }) => {
                                  const { cx, cy } = viewBox as { cx: number; cy: number }
                                  return (
                                    <text textAnchor="middle" dominantBaseline="middle">
                                      <tspan x={cx} y={cy} fontSize={22} fontWeight={800} fill="#1e293b">{filteredSumber.length}</tspan>
                                    </text>
                                  )
                                }}
                              />
                            </Pie>
                          </PieChart>
                        ) : (
                          <svg width={144} height={144}>
                            <circle cx={72} cy={72} r={66} fill="#f1f5f9" />
                            <circle cx={72} cy={72} r={44} fill="white" />
                            <text x={72} y={72} textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight="800" fill="#1e293b">{filteredSumber.length}</text>
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 border border-slate-100 rounded-lg overflow-hidden divide-y divide-slate-100">
                        {Array.from({ length: Math.ceil(sumberChartData.length / 2) }, (_, rowIdx) => (
                          <div key={rowIdx} className="grid grid-cols-2 divide-x divide-slate-100">
                            {sumberChartData.slice(rowIdx * 2, rowIdx * 2 + 2).map((entry) => (
                              <div key={entry.name} className="flex items-center gap-2 text-sm px-3 py-2.5 overflow-hidden">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.fill }} />
                                <span className="font-bold text-slate-800 tabular-nums shrink-0">{entry.value}</span>
                                <span className="text-xs font-semibold text-emerald-600 shrink-0">
                                  {filteredSumber.length > 0 ? Math.round(entry.value / filteredSumber.length * 100) : 0}%
                                </span>
                                <span className="text-slate-500 text-xs truncate min-w-0">{entry.name}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    )}

                    <Divider />

                    {/* Button - right side */}
                    <Button
                      onClick={() => router.push("/sumber-dukungan")}
                      size="sm"
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 gap-1 shrink-0"
                    >
                      Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

{/* ── Kegiatan ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">

                  {/* Identity */}
                  <div className="bg-slate-50 lg:w-56 p-6 shrink-0">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center mb-3">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900">Kegiatan</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        Pelatihan, workshop &amp; forum koordinasi BSAN
                      </p>
                    </div>
                  </div>

                  {/* Metrics + breakdown */}
                  <div className="flex-1 px-6 py-7 min-h-[200px] flex items-center gap-6">

                    {filteredKegiatan.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
                        <p className="text-sm font-medium text-slate-500">Belum ada Kegiatan</p>
                        <p className="text-xs text-slate-400">untuk wilayah yang dipilih</p>
                      </div>
                    ) : (<>

                    {/* Day tile with nav */}
                    <div className="shrink-0 flex items-center gap-1">
                      <button onClick={() => shiftDay(-1)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex flex-col items-center border border-slate-100 rounded-xl overflow-hidden w-24">
                        <div className="w-full bg-slate-100 py-1.5 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {selectedDate ? selectedDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "–"}
                          </span>
                        </div>
                        <div className="flex flex-col items-center py-3 gap-1.5">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {selectedDate ? ["Min","Sen","Sel","Rab","Kam","Jum","Sab"][selectedDate.getDay()] : "–"}
                          </span>
                          <span className="text-4xl font-extrabold text-slate-800 tabular-nums leading-none">
                            {selectedDate ? selectedDate.getDate() : "–"}
                          </span>
                          <div className="flex items-center gap-1 h-2.5">
                            {selectedDateEvents.length > 0
                              ? selectedDateEvents.slice(0, 5).map((_, idx) => (
                                  <span key={idx} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                ))
                              : <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            }
                          </div>
                        </div>
                      </div>
                      <button onClick={() => shiftDay(1)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <Divider />

                    {/* Events for selected date */}
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {selectedDate ? selectedDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }) : "–"}
                      </p>
                      {selectedDateEvents.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {selectedDateEvents.slice(0, 2).map(k => (
                            <div key={k.no}>
                              <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">{k.nama}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{k.wilayah}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">Tidak ada kegiatan</p>
                      )}
                    </div>
                    </>)}

                    <Divider />

                    {/* Button - right side */}
                    <Button
                      onClick={() => router.push("/kegiatan")}
                      size="sm"
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 gap-1 shrink-0 self-center"
                    >
                      Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                    </Button>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <LandingFooter />

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
              <div className="flex h-full max-h-[420px]">
                {/* Kiri: Provinsi */}
                <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => { setModalPendingProvince(""); setModalPendingKota(null); setModalBrowseProvince(null) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!modalBrowseProvince && modalPendingProvince === "" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      Seluruh Indonesia
                    </button>
                    <button
                      onClick={() => { setModalPendingProvince("__hanya_provinsi__"); setModalPendingKota(null); setModalBrowseProvince(null) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${modalPendingProvince === "__hanya_provinsi__" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      Hanya Tingkat Provinsi
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    {PROVINCE_OPTIONS.map((province) => {
                      const isBrowsed = modalBrowseProvince === province
                      return (
                        <button
                          key={province}
                          onClick={() => { setModalBrowseProvince(province); setModalPendingProvince(province); setModalPendingKota(null) }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                            isBrowsed ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span className="truncate">{province}</span>
                          {isBrowsed && <svg className="w-3.5 h-3.5 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* Kanan: Kab/Kota */}
                <div className="w-1/2 overflow-y-auto bg-gray-50/40">
                  <div className="p-2 space-y-0.5">
                    {modalBrowseProvince ? (() => {
                      const kotaList = PROVINSI_DATA
                        .filter(p => p.provinsi.startsWith(modalBrowseProvince + " - "))
                        .map(p => p.provinsi.split(" - ")[1])
                      return (
                        <>
                          <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{modalBrowseProvince}</p>
                          <button
                            onClick={() => setModalPendingKota("")}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              modalPendingKota === "" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            Semua Kabupaten/Kota
                          </button>
                          {kotaList.length > 0 && <div className="border-t border-gray-100 my-1" />}
                          {kotaList.map((kota) => (
                            <button
                              key={kota}
                              onClick={() => setModalPendingKota(kota)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                modalPendingKota === kota ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {kota}
                            </button>
                          ))}
                        </>
                      )
                    })() : (
                      <p className="text-sm text-gray-400 p-4">Pilih provinsi di kiri untuk melihat kab/kota</p>
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
                onClick={() => {
                  setSelectedProvince(modalPendingProvince)
                  setSelectedKota(modalPendingProvince === "__hanya_provinsi__" ? "" : (modalPendingKota ?? ""))
                  setShowWilayahModal(false)
                }}
                disabled={modalBrowseProvince !== null && modalPendingKota === null}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
