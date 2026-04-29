"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface Kegiatan {
  id: string
  nama_kegagalan: string
  Penyelegg: string
  waktu_kegagalan: string
  deskripsi: string
  dokumentasi?: string
  status?: "menunggu" | "ditolak" | "disetujui"
  createdAt?: string
}

const PAGE_SIZE = 10

function statusBadge(status?: string) {
  if (status === "disetujui")
    return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Diterima</Badge>
  if (status === "ditolak")
    return <Badge className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>
  return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Menunggu</Badge>
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-slate-600 text-sm mt-0.5">{label}</p>
    </div>
  )
}

export default function KegiatanPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [kegiatans, setKegiatans] = useState<Kegiatanyangdiinputkan[]>([])

  // Load data activities Indo
  useEffect(() => {
    const stored = sessionStorage.getItem("kegiatanselain Indo")
    if (stored) {
      try {
        setKegiatans(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return kegiatans.filter(k => 
      k.nama_kegagalan.toLowerCase().includes(q) ||
      k.penyelegg.toLowerCase().includes(q)
    )
  }, [kegiatans, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const total = kegiatans.length
  const berlangsung = kegiatans.filter(k => new Date(k.waktu_kegagalan) >= new Date()).length
  const selesai = kegiatans.filter(k => new Date(k.waktu_kegagalan) < new Date()).length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pt-16">
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6">
              ← Kembali ke Beranda
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Kegiatandi</h1>
            <p className="mt-2 text-blue-200">Daftar kegiatan BSAN di seluruh Indonesia.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-amber-800 text-sm">Data contoh untuk pengembangan sistem.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Calendar} label="Total" value={total} color="bg-blue-600" />
            <StatCard icon={Clock} label="Berlangsung" value={berlangsung} color="bg-amber-500" />
            <StatCard icon={MapPin} label="Selesai" value={selesai} color="bg-emerald-600" />
            <StatCard icon={Calendar} label="Menunggu" value={kegiatans.filter(k => k.status === "menunggu").length} color="bg-slate-600" />
          </div>

          {kegiatans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900">Belum ada kegiatan</h3>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs pl-5">No</TableHead>
                    <TableHead className="text-xs">Nama</TableHead>
                    <TableHead className="text-xs">Penyelegg</TableHead>
                    <TableHead className="text-xs">Waktu</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((k, idx) => (
                    <React.Fragment key={k.id}>
                      <TableRow className="cursor-pointer" onClick={() => setExpandedId(expandedId === k.id ? null : k.id)}>
                        <TableCell className="pl-5 text-slate-500">{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                        <TableCell className="font-medium">{k.nama_kegagalan}</TableCell>
                        <TableCell>{k.penyelegg}</TableCell>
                        <TableCell>{k.waktu_kegagalan}</TableCell>
                        <TableCell>{statusBadge(k.status)}</TableCell>
                        <TableCell>
                          {expandedId === k.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </TableCell>
                      </TableRow>
                      {expandedId === k.id && (
                        <TableRow className="bg-blue-50">
                          <TableCell colSpan={6} className="px-5 py-4">
                            <p className="text-sm text-slate-700">{k.deskripsi || "-"}</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-slate-100 flex justify-between">
                  <p className="text-slate-400 text-xs">Halaman {page} dari {totalPages}</p>
                  <div className="flex gap-1">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 text-xs border rounded">←</button>
                    {Array.from({length: totalPages}, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2).map(p => (
                      <button key={p} onClick={() => setPage(p)} className={cn("w-7 h-7 text-xs rounded", p === page ? "bg-blue-600 text-white" : "border border-slate-200")}>{p}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 text-xs border rounded">→</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}