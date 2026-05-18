"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  FileText,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Activity,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  School,
} from "lucide-react"

interface SekolahIsian {
  id: string
  namaSekolah: string
  jumlahKasus: number
  skor: number
  googleFormResponseUrl: string
  tanggalSubmit: string
}

interface LaporanItem {
  id: string
  tahun: string
  periodeAwal: string
  periodeAkhir: string
  jumlahKasus: number | null
  jumlahKasus: number | null
  skorAkhir: number | null
  tanggalSubmit: string | null
  status: string
  googleFormUrl: string
  catatan: string
  dibuatOleh: string
  sekolahYangMengisi: number
  daftarSekolah: SekolahIsian[]
}

function formatDateDisplay(dateStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr + "T00:00:00")
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
  }
  return dateStr
}

function getStatusFromPeriod(periodeAkhir: string): "terjadwal" | "berlangsung" | "selesai" {
  const now = new Date()
  let endDate: Date

  if (/^\d{4}-\d{2}-\d{2}$/.test(periodeAkhir)) {
    endDate = new Date(periodeAkhir + "T00:00:00")
  } else {
    const parts = periodeAkhir.match(/(\d+)\s+(\w+)\s+(\d+)/)
    if (!parts) return "terjadwal"
    const [, day, monthName, year] = parts
    const months: Record<string, string> = {
      Januari: "01", Februari: "02", Maret: "03", April: "04", Mei: "05", Juni: "06",
      Juli: "07", Agustus: "08", September: "09", Oktober: "10", November: "11", Desember: "12"
    }
    const month = months[monthName] || "01"
    endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

  if (nowDate < end) return "terjadwal"
  if (nowDate > end) return "selesai"
  return "berlangsung"
}

function StatusBadge({ status }: { status: "terjadwal" | "berlangsung" | "selesai" }) {
  switch (status) {
    case "terjadwal":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          <Calendar className="w-3 h-3" /> Terjadwal
        </span>
      )
    case "berlangsung":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <Calendar className="w-3 h-3" /> Berlangsung
        </span>
      )
    case "selesai":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          <Calendar className="w-3 h-3" /> Selesai
        </span>
      )
  }
}

export default function LaporanDetailPage() {
  const router = useRouter()
  const [item, setItem] = useState<LaporanItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")

    if (!id) {
      router.push("/dashboard")
      return
    }

    const stored = localStorage.getItem("laporanAkhirTahunList")
    if (stored) {
      const list = JSON.parse(stored) as LaporanItem[]
      const found = list.find((l) => l.id === id)
      if (found) {
        setItem(found)
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }, [router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return null
  }

  const dynamicStatus = getStatusFromPeriod(item.periodeAkhir)
  const isFilled = item.sekolahYangMengisi > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">
                Laporan Tahun {item.tahun}
              </h1>
              <StatusBadge status={dynamicStatus} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDateDisplay(item.periodeAwal)} - {formatDateDisplay(item.periodeAkhir)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {isFilled ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <School className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Sekolah Mengisi</span>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {item.sekolahYangMengisi > 0 ? Math.round((item.sekolahYangMengisi / Math.max(item.sekolahYangMengisi, 1)) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.sekolahYangMengisi} dari {item.sekolahYangMengisi} sekolah
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Rata-rata Skor Akhir</span>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {item.skorAkhir !== null ? `${item.skorAkhir}/100` : "-"}
                </p>
              </div>
            </div>

            {item.daftarSekolah && item.daftarSekolah.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-gray-900">
                      Daftar Sekolah yang Sudah Mengirim Laporan
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.daftarSekolah.length} sekolah telah menyelesaikan pelaporan
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Sekolah</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Kegitan</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Kasus</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Skor</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal Submit</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Google Form</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {item.daftarSekolah.map((sekolah, index) => (
                        <tr key={sekolah.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{sekolah.namaSekolah}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              {sekolah.jumlahKasus || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              {sekolah.jumlahKasus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              sekolah.skor >= 80 ? "bg-green-100 text-green-700" :
                              sekolah.skor >= 60 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {sekolah.skor}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {formatDateDisplay(sekolah.tanggalSubmit)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {sekolah.googleFormResponseUrl ? (
                              <a
                                href={sekolah.googleFormResponseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-blue-600 hover:bg-blue-50"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Buka
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Laporan belum diisi</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {dynamicStatus === "terjadwal"
                      ? "Periode pengisian belum dimulai."
                      : "Lengkapi formulir di bawah ini untuk提交 laporan."}
                  </p>
                </div>
              </div>
            </div>

            </>
        )}
      </div>
    </div>
  )
}