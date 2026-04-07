"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowLeft, MapPin, Phone, Globe, Lock, Users,
  ChevronDown, Building2, RotateCcw,
} from "lucide-react"
import { SEED, type SumberRujukan } from "@/components/dashboard/SumberRujukanView"
import { RUJUKAN_LOG, dinasLog, getStatusAfterRestore } from "@/lib/rujukan-logs"
import { getDinasNamaForLogs, readAuthSession } from "@/lib/auth-session"

function getRujukanFormExitHref(): string {
  const auth = readAuthSession()
  return auth?.role === "pusat" ? "/" : "/?menu=sumber-rujukan"
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type KategoriDukungan =
  | "Fasilitas Kesehatan"
  | "Konseling"
  | "Bantuan Hukum"
  | "Kepolisian"
  | "Psikologi"
  | "Pendidikan"
  | "Sosial"
  | "Lainnya"

type KategoriPenyedia = "Pemerintah Pusat" | "Pemerintah Daerah" | "Swasta" | "OMS"
type AksesInfo = "publik" | "terbatas"
type StatusRujukan = "terverifikasi" | "menunggu" | "menunggu_review" | "dihapus"

interface FormState {
  kategoriBentukDukungan: KategoriDukungan | ""
  namaInstansi: string
  provinsi: string
  kabupatenKota: string
  kecamatan: string
  kelurahan: string
  namaJalan: string
  nomorJalan: string
  kodePos: string
  tautanGoogleMaps: string
  nomorCallCenter: string
  nomorPribadi: string
  website: string
  kategoriPenyedia: KategoriPenyedia | ""
  aksesInfo: AksesInfo
  status: StatusRujukan
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const KATEGORI_DUKUNGAN: KategoriDukungan[] = [
  "Fasilitas Kesehatan", "Konseling", "Bantuan Hukum",
  "Kepolisian", "Psikologi", "Pendidikan", "Sosial", "Lainnya",
]
const KATEGORI_PENYEDIA: KategoriPenyedia[] = [
  "Pemerintah Pusat", "Pemerintah Daerah", "Swasta", "OMS",
]
const PROVINSI_OPTIONS = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau",
  "Jambi", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu",
  "Lampung", "DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah",
  "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat",
  "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat",
  "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara",
  "Papua Barat", "Papua",
]
const SEED_IDS = SEED.map((s) => s.id)

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs font-semibold text-gray-700">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function TextInput({ value, onChange, placeholder, type = "text", disabled }: {
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-default"
    />
  )
}

function SelectInput({ value, onChange, options, placeholder, disabled }: {
  value: string
  onChange?: (v: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-default"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {!disabled && (
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      )}
    </div>
  )
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 border-b border-gray-200">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: StatusRujukan }) {
  if (status === "terverifikasi") {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Terverifikasi</span>
  }
  if (status === "dihapus") {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Dihapus</span>
  }
  if (status === "menunggu_review") {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">Menunggu Review</span>
  }
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Menunggu Verifikasi</span>
}

const emptyForm = (): FormState => ({
  kategoriBentukDukungan: "",
  namaInstansi: "",
  provinsi: "Aceh",
  kabupatenKota: "",
  kecamatan: "",
  kelurahan: "",
  namaJalan: "",
  nomorJalan: "",
  kodePos: "",
  tautanGoogleMaps: "",
  nomorCallCenter: "",
  nomorPribadi: "",
  website: "",
  kategoriPenyedia: "",
  aksesInfo: "publik",
  status: "menunggu",
})

// ---------------------------------------------------------------------------
// Helper: persist status change to sessionStorage and update tabel
// ---------------------------------------------------------------------------
function persistStatusChange(id: string, status: StatusRujukan, logTerakhir: string) {
  try {
    const stored: Array<Record<string, unknown>> = JSON.parse(sessionStorage.getItem("rujukanList") ?? "[]")
    const existing = stored.find((i) => i.id === id)
    if (existing) {
      sessionStorage.setItem(
        "rujukanList",
        JSON.stringify(stored.map((i) => (i.id === id ? { ...i, status, logTerakhir } : i)))
      )
    } else {
      const seed = SEED.find((d) => d.id === id)
      sessionStorage.setItem(
        "rujukanList",
        JSON.stringify([...stored, seed ? { ...seed, status, logTerakhir } : { id, status, logTerakhir }])
      )
    }
    window.dispatchEvent(new CustomEvent("rujukanUpdated"))
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Inner component (uses useSearchParams — must be inside Suspense)
// ---------------------------------------------------------------------------
function RujukanFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const viewId = searchParams.get("view")
  const activeId = editId ?? viewId
  const isEdit = !!editId
  const isView = !!viewId
  const isReadOnly = isView

  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  // Form lengkap hanya untuk Admin Dinas & Admin Pusat; sekolah memakai Usul Instansi.
  useEffect(() => {
    if (editId || viewId) return
    const auth = readAuthSession()
    if (auth?.role === "sekolah") router.replace("/")
  }, [editId, viewId, router])

  // Load data — sessionStorage overrides take priority over SEED
  useEffect(() => {
    if (!activeId) return
    let storedItems: Array<Record<string, unknown>> = []
    try {
      storedItems = JSON.parse(sessionStorage.getItem("rujukanList") ?? "[]")
    } catch {}
    const fromStorage = storedItems.find((d) => d.id === activeId) as Record<string, unknown> | undefined
    const fromSeed = SEED.find((d) => d.id === activeId) as Record<string, unknown> | undefined
    const existing = fromSeed ? { ...fromSeed, ...(fromStorage ?? {}) } : fromStorage
    if (existing) {
      setForm({
        kategoriBentukDukungan: (existing.kategoriBentukDukungan as KategoriDukungan) ?? "",
        namaInstansi: (existing.namaInstansi as string) ?? "",
        provinsi: (existing.provinsi as string) ?? "Aceh",
        kabupatenKota: (existing.kabupatenKota as string) ?? "",
        kecamatan: (existing.kecamatan as string) ?? "",
        kelurahan: (existing.kelurahan as string) ?? "",
        namaJalan: (existing.namaJalan as string) ?? "",
        nomorJalan: (existing.nomorJalan as string) ?? "",
        kodePos: (existing.kodePos as string) ?? "",
        tautanGoogleMaps: (existing.tautanGoogleMaps as string) ?? "",
        nomorCallCenter: (existing.nomorCallCenter as string) ?? "",
        nomorPribadi: (existing.nomorPribadi as string) ?? "",
        website: (existing.website as string) ?? "",
        kategoriPenyedia: (existing.kategoriPenyedia as KategoriPenyedia) ?? "",
        aksesInfo: (existing.aksesInfo as AksesInfo) ?? "publik",
        status: (existing.status as StatusRujukan) ?? "menunggu",
      })
    }
  }, [activeId])

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  // Verify — updates sessionStorage so tabel reflects the change
  const handleVerify = () => {
    if (!viewId) return
    const isPusat = readAuthSession()?.role === "pusat"
    const d = getDinasNamaForLogs()
    persistStatusChange(
      viewId,
      "terverifikasi",
      isPusat ? RUJUKAN_LOG.diverifikasiPusat : dinasLog.diverifikasi(d)
    )
    setForm((prev) => ({ ...prev, status: "terverifikasi" }))
  }

  // Delete — marks as "dihapus" in sessionStorage then navigates back
  const handleDelete = () => {
    if (!viewId) return
    const isPusat = readAuthSession()?.role === "pusat"
    const d = getDinasNamaForLogs()
    persistStatusChange(viewId, "dihapus", isPusat ? RUJUKAN_LOG.dihapusPusat : dinasLog.dihapus(d))
    router.push(getRujukanFormExitHref())
  }

  const handleRestore = () => {
    if (!viewId) return
    let usulanDari: SumberRujukan["usulanDari"] = "dinas"
    try {
      const stored = JSON.parse(sessionStorage.getItem("rujukanList") ?? "[]") as Array<Record<string, unknown>>
      const row = stored.find((x) => x.id === viewId)
      const seed = SEED.find((s) => s.id === viewId)
      const merged = { ...seed, ...row } as Partial<SumberRujukan>
      if (merged.usulanDari) usulanDari = merged.usulanDari
    } catch { /* keep default */ }
    const nextStatus = getStatusAfterRestore(usulanDari)
    const isPusat = readAuthSession()?.role === "pusat"
    const d = getDinasNamaForLogs()
    persistStatusChange(
      viewId,
      nextStatus,
      isPusat ? RUJUKAN_LOG.dipulihkanPusat : dinasLog.dipulihkan(d)
    )
    setForm((prev) => ({ ...prev, status: nextStatus }))
  }

  const canSubmit =
    form.kategoriBentukDukungan !== "" &&
    form.namaInstansi.trim() !== "" &&
    form.kabupatenKota.trim() !== "" &&
    form.nomorCallCenter.trim() !== "" &&
    form.kategoriPenyedia !== ""

  const handleSubmit = () => {
    if (!canSubmit) return
    const auth = readAuthSession()
    if (!auth || auth.role === "sekolah") return
    const isPusat = auth.role === "pusat"
    const d = getDinasNamaForLogs()
    const logEdit = isPusat ? RUJUKAN_LOG.diperbaharuiPusat : dinasLog.diperbaharui(d)
    try {
      const stored = JSON.parse(sessionStorage.getItem("rujukanList") ?? "[]") as Array<Record<string, unknown>>
      if (isEdit && editId) {
        const idx = stored.findIndex((item) => item.id === editId)
        if (idx >= 0) {
          stored[idx] = { ...stored[idx], ...form, logTerakhir: logEdit }
          sessionStorage.setItem("rujukanList", JSON.stringify(stored))
        } else if (SEED_IDS.includes(editId)) {
          const seed = SEED.find((d) => d.id === editId)
          sessionStorage.setItem(
            "rujukanList",
            JSON.stringify([...stored, { ...seed, ...form, id: editId, logTerakhir: logEdit }])
          )
        } else {
          sessionStorage.setItem("rujukanList", JSON.stringify([...stored, { id: editId, ...form, logTerakhir: logEdit }]))
        }
      } else {
        const newItem: SumberRujukan = {
          id: `sr-${Date.now()}`,
          namaInstansi: form.namaInstansi,
          kategoriBentukDukungan: form.kategoriBentukDukungan as SumberRujukan["kategoriBentukDukungan"],
          kategoriPenyedia: form.kategoriPenyedia as SumberRujukan["kategoriPenyedia"],
          provinsi: form.provinsi,
          kabupatenKota: form.kabupatenKota,
          kecamatan: form.kecamatan,
          kelurahan: form.kelurahan,
          namaJalan: form.namaJalan,
          nomorJalan: form.nomorJalan,
          kodePos: form.kodePos,
          tautanGoogleMaps: form.tautanGoogleMaps,
          nomorCallCenter: form.nomorCallCenter,
          nomorPribadi: form.nomorPribadi,
          website: form.website,
          aksesInfo: form.aksesInfo,
          status: "terverifikasi",
          dibuatOleh: isPusat ? "Admin Pusat" : `Admin ${d}`,
          logTerakhir: isPusat ? RUJUKAN_LOG.dibuatTerverifikasiPusat : dinasLog.dibuatTerverifikasi(d),
          usulanDari: isPusat ? "pusat" : "dinas",
          createdAt: new Date().toISOString(),
        }
        sessionStorage.setItem("rujukanList", JSON.stringify([...stored, newItem]))
      }
      window.dispatchEvent(new CustomEvent("rujukanUpdated"))
    } catch { /* ignore */ }
    setSubmitted(true)
  }

  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(() => router.push(getRujukanFormExitHref()), 1500)
    return () => clearTimeout(t)
  }, [submitted, router])

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Berhasil Diperbarui" : "Berhasil Ditambahkan"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit
              ? "Perubahan berhasil disimpan."
              : "Sumber rujukan berhasil ditambahkan dan langsung terverifikasi."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(getRujukanFormExitHref())}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900">
              {isView ? "Detail Sumber Rujukan" : isEdit ? "Edit Sumber Rujukan" : "Tambah Sumber Rujukan"}
            </h1>
            {isView ? (
              <div className="mt-1">
                <StatusBadge status={form.status} />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                {isEdit ? "Perbarui informasi sumber rujukan" : "Lengkapi semua informasi yang diperlukan"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        <SectionCard icon={<Building2 className="w-4 h-4" />} title="Informasi Utama">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Nama Instansi / Layanan</FieldLabel>
              <TextInput value={form.namaInstansi} onChange={(v) => set("namaInstansi", v)} placeholder="Contoh: RSUD Zainoel Abidin" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Kategori Bentuk Dukungan</FieldLabel>
              <SelectInput value={form.kategoriBentukDukungan} onChange={(v) => set("kategoriBentukDukungan", v as KategoriDukungan)} options={KATEGORI_DUKUNGAN} placeholder="Pilih kategori" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Kategori Penyedia Layanan</FieldLabel>
              <SelectInput value={form.kategoriPenyedia} onChange={(v) => set("kategoriPenyedia", v as KategoriPenyedia)} options={KATEGORI_PENYEDIA} placeholder="Pilih kategori penyedia" disabled={isReadOnly} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={<MapPin className="w-4 h-4" />} title="Alamat Lengkap">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Provinsi</FieldLabel>
              <SelectInput value={form.provinsi} onChange={(v) => set("provinsi", v)} options={PROVINSI_OPTIONS} disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Kabupaten / Kota</FieldLabel>
              <TextInput value={form.kabupatenKota} onChange={(v) => set("kabupatenKota", v)} placeholder="Contoh: Kota Banda Aceh" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Kecamatan</FieldLabel>
              <TextInput value={form.kecamatan} onChange={(v) => set("kecamatan", v)} placeholder="Contoh: Baiturrahman" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Kelurahan</FieldLabel>
              <TextInput value={form.kelurahan} onChange={(v) => set("kelurahan", v)} placeholder="Contoh: Peunayong" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Nama Jalan</FieldLabel>
              <TextInput value={form.namaJalan} onChange={(v) => set("namaJalan", v)} placeholder="Contoh: Jl. Tgk. Daud Beureueh" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Nomor</FieldLabel>
              <TextInput value={form.nomorJalan} onChange={(v) => set("nomorJalan", v)} placeholder="Contoh: No. 108" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Kode Pos</FieldLabel>
              <TextInput value={form.kodePos} onChange={(v) => set("kodePos", v.replace(/\D/g, ""))} placeholder="Contoh: 23242" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Tautan Google Maps <span className="text-xs font-normal text-gray-400">(opsional)</span></FieldLabel>
              <TextInput value={form.tautanGoogleMaps} onChange={(v) => set("tautanGoogleMaps", v)} placeholder="https://maps.google.com/..." disabled={isReadOnly} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={<Phone className="w-4 h-4" />} title="Informasi Kontak">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Nomor Call Center</FieldLabel>
              <TextInput value={form.nomorCallCenter} onChange={(v) => set("nomorCallCenter", v.replace(/\D/g, ""))} placeholder="08xxxxxxxxxx" type="tel" disabled={isReadOnly} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Nomor Pribadi <span className="text-xs font-normal text-gray-400">(opsional)</span></FieldLabel>
              <TextInput value={form.nomorPribadi} onChange={(v) => set("nomorPribadi", v.replace(/\D/g, ""))} placeholder="08xxxxxxxxxx" type="tel" disabled={isReadOnly} />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <FieldLabel>Website <span className="text-xs font-normal text-gray-400">(opsional)</span></FieldLabel>
              <div className="relative">
                {!isReadOnly && <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />}
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://www.instansi.go.id"
                  disabled={isReadOnly}
                  className={`w-full h-9 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-default ${isReadOnly ? "pl-3" : "pl-9"}`}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={<Lock className="w-4 h-4" />} title="Akses Informasi">
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Tentukan siapa yang dapat melihat informasi sumber rujukan ini.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { value: "publik" as AksesInfo, label: "Publik", desc: "Dapat dilihat oleh semua orang tanpa perlu login", icon: <Users className="w-4 h-4" />, color: "border-green-400 bg-green-50", iconBg: "bg-green-100 text-green-700" },
                { value: "terbatas" as AksesInfo, label: "Terbatas (Login)", desc: "Hanya dapat dilihat oleh pengguna yang sudah login", icon: <Lock className="w-4 h-4" />, color: "border-amber-400 bg-amber-50", iconBg: "bg-amber-100 text-amber-700" },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { if (!isReadOnly) set("aksesInfo", opt.value) }}
                  disabled={isReadOnly}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition disabled:cursor-default ${form.aksesInfo === opt.value ? opt.color : "border-gray-200 bg-white hover:border-gray-300 disabled:hover:border-gray-200"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${opt.iconBg}`}>{opt.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Action buttons */}
        {isReadOnly ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            {form.status === "dihapus" ? (
              <>
                <button
                  type="button"
                  onClick={handleRestore}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Pulihkan
                </button>
                <button
                  type="button"
                  onClick={() => router.push(getRujukanFormExitHref())}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 transition"
                >
                  Tutup
                </button>
              </>
            ) : (
              <>
                {(form.status === "menunggu" || form.status === "menunggu_review") && (
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition"
                  >
                    Verifikasi
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl border border-red-300 text-sm font-semibold text-red-600 bg-white hover:bg-red-50 transition"
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => router.push(getRujukanFormExitHref())}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Tutup
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex gap-3 pt-2 pb-8">
            <button
              type="button"
              onClick={() => router.push(getRujukanFormExitHref())}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isEdit ? "Simpan Perubahan" : "Simpan Sumber Rujukan"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function RujukanFormFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p className="text-sm text-gray-500">Memuat…</p>
    </div>
  )
}

export function RujukanForm() {
  return (
    <Suspense fallback={<RujukanFormFallback />}>
      <RujukanFormInner />
    </Suspense>
  )
}
