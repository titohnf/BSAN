"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Calendar, Upload, X, Users, FileText,
  CheckCircle, PlayCircle, Clock,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type StatusKegiatan = "selesai" | "berlangsung" | "menunggu"

interface KegiatanForm {
  namaKegiatan: string
  penyelenggara: string
  waktuKegiatan: string
  deskripsiKegiatan: string
  dokumentasi: string
  status: StatusKegiatan
}

// ---------------------------------------------------------------------------
// Seed data (must match KegiatanView SEED_DATA)
// ---------------------------------------------------------------------------
const SEED_DATA = [
  { id: "kg-1", namaKegiatan: "Workshop PKSA", penyelenggara: "SMA Negeri 1 Banda Aceh", waktuKegiatan: "2025-04-15T10:00", deskripsiKegiatan: "Workshop pengenalan isu kekerasan pada anak", dokumentasi: "", status: "selesai" as StatusKegiatan },
  { id: "kg-2", namaKegiatan: "Sosialisasi Hak Anak", penyelenggara: "SMP Negeri 2 Banda Aceh", waktuKegiatan: "2025-06-20T14:00", deskripsiKegiatan: "Sosialisasi hak anak kepada seluruh siswa dan wali kelas", dokumentasi: "", status: "berlangsung" as StatusKegiatan },
  { id: "kg-3", namaKegiatan: "Rapat Koordinasi Pokja", penyelenggara: "Dinas Pendidikan Prov Aceh", waktuKegiatan: "2025-07-10T09:00", deskripsiKegiatan: "Rapat koordinasi bulanan antar anggota pokja", dokumentasi: "", status: "menunggu" as StatusKegiatan },
]

const PENYELENGGARA_OPTIONS = [
  "SMA Negeri 1 Banda Aceh",
  "SMP Negeri 2 Banda Aceh",
  "SMA Negeri 3 Banda Aceh",
  "SMP Negeri 1 Aceh Besar",
  "Dinas Pendidikan Prov Aceh",
  "Lainnya",
]

const emptyForm = (): KegiatanForm => ({
  namaKegiatan: "",
  penyelenggara: "",
  waktuKegiatan: "",
  deskripsiKegiatan: "",
  dokumentasi: "",
  status: "menunggu",
})

// ---------------------------------------------------------------------------
// Shared helper components (same as tambah-rujukan)
// ---------------------------------------------------------------------------
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs font-semibold text-gray-700">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function TextInput({
  value, onChange, placeholder, type = "text", disabled,
}: {
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

function SelectInput({
  value, onChange, options, placeholder, disabled,
}: {
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
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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

function StatusBadge({ status }: { status: StatusKegiatan }) {
  if (status === "selesai") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      <CheckCircle className="w-3 h-3" /> Selesai
    </span>
  )
  if (status === "berlangsung") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
      <PlayCircle className="w-3 h-3" /> Berlangsung
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Menunggu
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
function TambahKegiatanInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const viewId = searchParams.get("view")
  const activeId = editId ?? viewId
  const isEdit = !!editId
  const isView = !!viewId
  const isReadOnly = isView

  const [form, setForm] = useState<KegiatanForm>(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [dokumentasiFile, setDokumentasiFile] = useState<File | null>(null)

  useEffect(() => {
    if (!activeId) return
    let storedItems: Array<Record<string, unknown>> = []
    try {
      storedItems = JSON.parse(sessionStorage.getItem("kegiatanList") ?? "[]")
    } catch {}
    const fromStorage = storedItems.find((d) => d.id === activeId) as Record<string, unknown> | undefined
    const fromSeed = (SEED_DATA as Array<Record<string, unknown>>).find((d) => d.id === activeId)
    // Merge: seed base + sessionStorage overrides take priority
    const existing = fromSeed ? { ...fromSeed, ...(fromStorage ?? {}) } : fromStorage
    if (existing) {
      setForm({
        namaKegiatan: (existing.namaKegiatan as string) ?? "",
        penyelenggara: (existing.penyelenggara as string) ?? "",
        waktuKegiatan: (existing.waktuKegiatan as string) ?? "",
        deskripsiKegiatan: (existing.deskripsiKegiatan as string) ?? "",
        dokumentasi: (existing.dokumentasi as string) ?? "",
        status: (existing.status as StatusKegiatan) ?? "menunggu",
      })
    }
  }, [activeId])

  const set = <K extends keyof KegiatanForm>(k: K, v: KegiatanForm[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const canSubmit =
    form.namaKegiatan.trim() !== "" &&
    form.penyelenggara.trim() !== "" &&
    form.waktuKegiatan.trim() !== "" &&
    form.deskripsiKegiatan.trim() !== ""

  const handleSubmit = () => {
    if (!canSubmit) return
    try {
      const allData = JSON.parse(sessionStorage.getItem("kegiatanList") ?? "[]") as Array<Record<string, unknown>>
      if (isEdit && editId) {
        const updated = allData.map((item) =>
          item.id === editId ? { ...item, ...form, dokumentasi: dokumentasiFile?.name ?? form.dokumentasi } : item
        )
        if (!allData.find((item) => item.id === editId)) {
          updated.push({ id: editId, ...form, dokumentasi: dokumentasiFile?.name ?? "", createdAt: new Date().toISOString() })
        }
        sessionStorage.setItem("kegiatanList", JSON.stringify(updated))
      } else {
        const newItem = {
          id: `kg-${Date.now()}`,
          ...form,
          dokumentasi: dokumentasiFile?.name ?? "",
          status: "menunggu" as StatusKegiatan,
          createdAt: new Date().toISOString(),
        }
        sessionStorage.setItem("kegiatanList", JSON.stringify([...allData, newItem]))
      }
      window.dispatchEvent(new CustomEvent("kegiatanUpdated"))
    } catch {}
    setSubmitted(true)
  }

  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(() => router.back(), 1500)
    return () => clearTimeout(t)
  }, [submitted])

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Berhasil Diperbarui" : "Berhasil Ditambahkan"}</h2>
          <p className="text-sm text-gray-500 mt-1">{isEdit ? "Kegiatan berhasil diperbarui." : "Kegiatan baru berhasil ditambahkan."}</p>
        </div>
      </div>
    )
  }

  const pageTitle = isView ? "Detail Kegiatan" : isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"
  const pageSubtitle = isView ? "Informasi lengkap kegiatan" : isEdit ? "Perbarui informasi kegiatan" : "Lengkapi semua informasi yang diperlukan"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900">{pageTitle}</h1>
            {isView ? (
              <div className="mt-1">
                <StatusBadge status={form.status} />
              </div>
            ) : (
              <p className="text-xs text-gray-500">{pageSubtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Info Kegiatan */}
        <SectionCard icon={<Calendar className="w-4 h-4" />} title="Informasi Kegiatan">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Nama Kegiatan</FieldLabel>
              <TextInput
                value={form.namaKegiatan}
                onChange={(v) => set("namaKegiatan", v)}
                placeholder="Contoh: Workshop PKSA"
                disabled={isReadOnly}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Penyelenggara</FieldLabel>
              <SelectInput
                value={form.penyelenggara}
                onChange={(v) => set("penyelenggara", v)}
                options={PENYELENGGARA_OPTIONS}
                placeholder="Pilih penyelenggara"
                disabled={isReadOnly}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required={!isReadOnly}>Waktu Kegiatan</FieldLabel>
              <TextInput
                type="datetime-local"
                value={form.waktuKegiatan}
                onChange={(v) => set("waktuKegiatan", v)}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </SectionCard>

        {/* Deskripsi */}
        <SectionCard icon={<FileText className="w-4 h-4" />} title="Deskripsi Kegiatan">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required={!isReadOnly}>Deskripsi</FieldLabel>
            <textarea
              value={form.deskripsiKegiatan}
              onChange={(e) => set("deskripsiKegiatan", e.target.value)}
              placeholder="Jelaskan tujuan dan hasil kegiatan..."
              rows={4}
              disabled={isReadOnly}
              className="p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-default"
            />
          </div>
        </SectionCard>

        {/* Dokumentasi */}
        <SectionCard icon={<Upload className="w-4 h-4" />} title="Dokumentasi Kegiatan">
          {isReadOnly ? (
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Dokumentasi</FieldLabel>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">{form.dokumentasi || "Tidak ada dokumentasi"}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-5 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 font-medium">Klik untuk unggah foto / video dokumentasi</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, MP4 — maks. 10 MB</p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null
                    setDokumentasiFile(f)
                    if (f) set("dokumentasi", f.name)
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {dokumentasiFile && (
                <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700 flex-1 truncate">{dokumentasiFile.name}</p>
                  <button
                    onClick={() => { setDokumentasiFile(null); set("dokumentasi", "") }}
                    className="p-1 hover:bg-red-100 rounded text-red-500 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* Penyelenggara info — view only */}
        {isView && (
          <SectionCard icon={<Users className="w-4 h-4" />} title="Penyelenggara">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-700" />
              </div>
              <p className="text-sm font-medium text-gray-700">{form.penyelenggara || "-"}</p>
            </div>
          </SectionCard>
        )}

        {/* Footer actions */}
        {!isReadOnly && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isEdit ? "Simpan Perubahan" : "Simpan Kegiatan"}
            </button>
          </div>
        )}

        {isReadOnly && (
          <div className="flex gap-3 pt-2 pb-4">
            <a
              href={`/tambah-kegiatan?edit=${viewId}`}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition text-center"
            >
              Edit
            </a>
            <button
              onClick={() => {
                try {
                  const stored = JSON.parse(sessionStorage.getItem("kegiatanList") ?? "[]") as Array<Record<string, unknown>>
                  const filtered = stored.filter((i) => i.id !== viewId)
                  // If it's a SEED item, mark as deleted instead of removing
                  const isSeed = ["kg-1", "kg-2", "kg-3"].includes(viewId ?? "")
                  if (isSeed) {
                    const override = stored.find((i) => i.id === viewId) ?? { id: viewId }
                    sessionStorage.setItem("kegiatanList", JSON.stringify([...filtered, { ...override, status: "dihapus" }]))
                  } else {
                    sessionStorage.setItem("kegiatanList", JSON.stringify(filtered))
                  }
                  window.dispatchEvent(new CustomEvent("kegiatanUpdated"))
                } catch {}
                router.back()
              }}
              className="flex-1 py-2.5 rounded-lg border border-red-300 text-red-600 font-medium text-sm hover:bg-red-50 transition"
            >
              Hapus
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
            >
              Tutup
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default function TambahKegiatanPage() {
  return (
    <Suspense>
      <TambahKegiatanInner />
    </Suspense>
  )
}
