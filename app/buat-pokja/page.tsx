"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Wand2, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  User, Upload, X, AlertCircle, Phone, Building2, Download, Eye, FileText, Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  MemberField, Members, RoleKey, PIMPINAN_ROLES, BIDANG_ROLES,
  emptyMember, PokjaData,
} from "@/types/pokja"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const REGION = "Prov. Aceh"

const STEPS = [
  { number: 1, label: "Informasi Dasar" },
  { number: 2, label: "Susunan Pengurus" },
  { number: 3, label: "Dokumen SK" },
  { number: 4, label: "Review Data" },
]

// ---------------------------------------------------------------------------
// Dummy data generator
// ---------------------------------------------------------------------------
function makeDummyMember(nama: string, email: string, jenisKelamin: "Laki-Laki" | "Perempuan", instansi: string): MemberField {
  return { nama, email, jenisKelamin, noWhatsapp: "0812" + Math.floor(10000000 + Math.random() * 89999999), instansi }
}

const DUMMY_MEMBERS: Members = {
  ketua:       makeDummyMember("Dr. Hendra Kusuma, M.Pd", "hendra.kusuma@dinas-aceh.go.id", "Laki-Laki", "Dinas Pendidikan Prov. Aceh"),
  wakil:       makeDummyMember("Siti Rahmawati, S.Pd", "siti.rahmawati@dinas-aceh.go.id", "Perempuan", "Dinas Pendidikan Prov. Aceh"),
  koordinator: makeDummyMember("Ahmad Fauzi, M.Si", "ahmad.fauzi@dinas-aceh.go.id", "Laki-Laki", "Dinas Pendidikan Prov. Aceh"),
  pendidikan:  makeDummyMember("Nurhayati, S.Pd", "nurhayati@dinas-aceh.go.id", "Perempuan", "Dinas Pendidikan Prov. Aceh"),
  pppa:        makeDummyMember("Rina Andriani, M.Kes", "rina.andriani@p3a-aceh.go.id", "Perempuan", "Dinas Pemberdayaan Perempuan Prov. Aceh"),
  sosial:      makeDummyMember("Budi Santoso, S.Sos", "budi.santoso@dinsos-aceh.go.id", "Laki-Laki", "Dinas Sosial Prov. Aceh"),
  kesehatan:   makeDummyMember("dr. Fitri Yanti", "fitri.yanti@dinkes-aceh.go.id", "Perempuan", "Dinas Kesehatan Prov. Aceh"),
  kominfo:     makeDummyMember("Rizal Mahendra, S.Kom", "rizal.mahendra@kominfo-aceh.go.id", "Laki-Laki", "Dinas Kominfo Prov. Aceh"),
  dukbangga:   makeDummyMember("Yuli Astuti, S.E", "yuli.astuti@dukcapil-aceh.go.id", "Perempuan", "Dinas Kependudukan Prov. Aceh"),
}

const DUMMY_SK = {
  nomorSK: "421/2345/SK/2025",
  tanggalSK: "2025-01-15",
  periodeMulai: "2025-01-15",
  periodeSelesai: "2027-01-14",
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function InputField({
  label, required = false, type = "text", placeholder, value, onChange,
}: {
  label: string; required?: boolean; type?: string; placeholder?: string
  value: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  )
}

function MemberSection({ label, value, onChange }: {
  label: string; value: MemberField
  onChange: (field: keyof MemberField, val: string) => void
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User className="w-3.5 h-3.5 text-blue-700" />
        </div>
        <span className="text-sm font-semibold text-gray-800">{label}</span>
      </div>
      {/* Order: Nama, Jenis Kelamin, Instansi, Jabatan, Email, No. WhatsApp */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Nama" required placeholder="Nama lengkap" value={value.nama} onChange={(v) => onChange("nama", v)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Jenis Kelamin <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={value.jenisKelamin}
              onChange={(e) => onChange("jenisKelamin", e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700"
            >
              <option value="" disabled>Pilih jenis kelamin</option>
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <InputField label="Instansi" required placeholder="Nama instansi" value={value.instansi} onChange={(v) => onChange("instansi", v)} />
        <InputField label="Jabatan" placeholder="Contoh: Kepala Bidang, Staff, dll" value={value.jabatan ?? ""} onChange={(v) => onChange("jabatan", v)} />
        <InputField label="Email" required type="email" placeholder="nama@dinas.go.id" value={value.email} onChange={(v) => onChange("email", v)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">No. WhatsApp <span className="text-red-500">*</span></label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="tel" inputMode="numeric" value={value.noWhatsapp}
              onChange={(e) => onChange("noWhatsapp", e.target.value.replace(/\D/g, ""))}
              placeholder="08xxxxxxxxxx"
              className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// MemberSection with disabled bidang field for mandatory members
function MandatoryMemberSection({ label, value, onChange, bidangValue }: {
  label: string; value: MemberField
  onChange: (field: keyof MemberField, val: string) => void
  bidangValue: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User className="w-3.5 h-3.5 text-blue-700" />
        </div>
        <span className="text-sm font-semibold text-gray-800">{label}</span>
      </div>
      {/* Order: Nama, Jenis Kelamin, Instansi, Jabatan, Email, No. WhatsApp */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Nama" required placeholder="Nama lengkap" value={value.nama} onChange={(v) => onChange("nama", v)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Jenis Kelamin <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={value.jenisKelamin}
              onChange={(e) => onChange("jenisKelamin", e.target.value)}
              className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700"
            >
              <option value="" disabled>Pilih jenis kelamin</option>
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <InputField label="Instansi" required placeholder="Nama instansi" value={value.instansi} onChange={(v) => onChange("instansi", v)} />
        <InputField label="Jabatan" placeholder="Contoh: Kepala Bidang, Staff, dll" value={value.jabatan ?? ""} onChange={(v) => onChange("jabatan", v)} />
        <InputField label="Email" required type="email" placeholder="nama@dinas.go.id" value={value.email} onChange={(v) => onChange("email", v)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">No. WhatsApp <span className="text-red-500">*</span></label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="tel" inputMode="numeric" value={value.noWhatsapp}
              onChange={(e) => onChange("noWhatsapp", e.target.value.replace(/\D/g, ""))}
              placeholder="08xxxxxxxxxx"
              className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || "-"}</span>
    </div>
  )
}

function ReviewMemberCard({ label, member }: { label: string; member: MemberField }) {
  const isEmpty = !member.nama && !member.email && !member.noWhatsapp
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <User className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        {isEmpty && (
          <span className="ml-auto text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Belum diisi</span>
        )}
      </div>
      {!isEmpty && (
        <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
          <ReviewRow label="Nama" value={member.nama} />
          <ReviewRow label="Jenis Kelamin" value={member.jenisKelamin} />
          <ReviewRow label="Instansi" value={member.instansi} />
          {member.jabatan && <ReviewRow label="Jabatan" value={member.jabatan} />}
          <ReviewRow label="Email" value={member.email} />
          <ReviewRow label="No. WhatsApp" value={member.noWhatsapp} />
        </div>
      )}
    </div>
  )
}

function FileUploadField({ value, onChange, error }: { value: File | null; onChange: (f: File | null) => void; error?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") { alert("Hanya file PDF yang diizinkan."); return }
    if (f.size > 2 * 1024 * 1024) { alert("Ukuran file melebihi 2MB."); return }
    onChange(f)
  }
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        Upload Dokumen SK <span className="text-red-500">*</span>
        <span className="ml-1 font-normal text-gray-400">(PDF, maks. 2MB)</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition",
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
        )}
      >
        <Upload className={cn("w-6 h-6", error ? "text-red-400" : "text-gray-400")} />
        {value ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-800 break-all">{value.name}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null) }} className="ml-1 text-gray-400 hover:text-red-500 transition" aria-label="Hapus file">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 font-medium">Klik atau seret file PDF ke sini</p>
            <p className="text-xs text-gray-400">Format PDF, maksimal 2MB</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }}
      />
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Excel helper
// ---------------------------------------------------------------------------
function downloadTemplate() {
  const csv = [
    ["Jabatan", "Nama", "Email", "Jenis Kelamin", "No. WhatsApp", "Instansi"],
    ...([...PIMPINAN_ROLES, ...BIDANG_ROLES].map((r) => [r.label, "", "", "Laki-Laki/Perempuan", "", ""])),
  ].map((r) => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url; a.download = "template_pengurus_kelompok_kerja.csv"; a.click()
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function BuatPokjaPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isPerbaikanMode, setIsPerbaikanMode] = useState(false)
  const [deskripsiPerbaikan, setDeskripsiPerbaikan] = useState("")

  // Step 1
  const [kanalPengaduan, setKanalPengaduan] = useState("")

  // Step 2 – pimpinan
  const [members, setMembers] = useState<Members>(() => ({
    ketua: emptyMember(), wakil: emptyMember(), koordinator: emptyMember(),
    pendidikan: emptyMember(), pppa: emptyMember(), sosial: emptyMember(),
    kesehatan: emptyMember(), kominfo: emptyMember(), dukbangga: emptyMember(),
  }))

  // Step 2 – anggota tambahan (opsional)
  type AnggotaItem = { nama: string; email: string; jenisKelamin: string; bidang: string; noWhatsapp: string; instansi: string; jabatan: string }
  const emptyAnggota = (): AnggotaItem => ({ nama: "", email: "", jenisKelamin: "", bidang: "", noWhatsapp: "", instansi: "", jabatan: "" })
  const [anggotaList, setAnggotaList] = useState<AnggotaItem[]>([])

  const updateAnggota = (index: number, field: keyof AnggotaItem, val: string) => {
    setAnggotaList((prev) => prev.map((a, i) => i === index ? { ...a, [field]: val } : a))
  }
  const addAnggota = () => setAnggotaList((prev) => [...prev, emptyAnggota()])
  const removeAnggota = (index: number) => setAnggotaList((prev) => prev.filter((_, i) => i !== index))

  // Step 3
  const [skFile, setSkFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")
  const [skDetail, setSkDetail] = useState({ nomorSK: "", tanggalSK: "", periodeMulai: "", periodeSelesai: "" })

  // ---------------------------------------------------------------------------
  // Mount: baca perbaikanPokjaData dari sessionStorage untuk mode perbaikan
  // ---------------------------------------------------------------------------
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("perbaikanPokjaData")
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        nomorKanal: string
        members: Members
        sk: { nomorSK: string; tanggalSK: string; periodeMulai: string; periodeSelesai: string }
      }
      setIsPerbaikanMode(true)
      setKanalPengaduan(parsed.nomorKanal ?? "")
      if (parsed.members) setMembers(parsed.members)
      if (parsed.sk) {
        setSkDetail({
          nomorSK: parsed.sk.nomorSK ?? "",
          tanggalSK: parsed.sk.tanggalSK ?? "",
          periodeMulai: parsed.sk.periodeMulai ?? "",
          periodeSelesai: parsed.sk.periodeSelesai ?? "",
        })
      }
      // Hapus setelah dibaca agar tidak terbawa ke sesi lain
      sessionStorage.removeItem("perbaikanPokjaData")
    } catch {}
  }, [])

  // ---------------------------------------------------------------------------
  // Auto-fill dummy data
  // ---------------------------------------------------------------------------
  const fillDummyData = () => {
    setKanalPengaduan("081234567890")
    setMembers(DUMMY_MEMBERS)
    setAnggotaList([])
    setSkDetail(DUMMY_SK)
    // Create a mock File for the SK upload
    const blob = new Blob(["(dummy PDF content)"], { type: "application/pdf" })
    const dummyFile = new File([blob], "SK_Kelompok_Kerja_Aceh_2025.pdf", { type: "application/pdf" })
    setSkFile(dummyFile)
    setFileError("")
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  const updateMember = (role: RoleKey, field: keyof MemberField, val: string) => {
    setMembers((prev) => ({ ...prev, [role]: { ...prev[role], [field]: val } }))
  }

  const canGoNext = () => {
    if (step === 1) return kanalPengaduan.trim().length > 0
    if (step === 3) return skFile !== null && skDetail.nomorSK && skDetail.tanggalSK && skDetail.periodeMulai && skDetail.periodeSelesai
    return true
  }

  const handleNext = () => {
    if (step === 3 && !skFile) { setFileError("Dokumen SK wajib diunggah."); return }
    setFileError("")
    setStep((s) => Math.min(s + 1, 4))
  }
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = () => {
    const payload: PokjaData = {
      region: REGION,
      nomorKanal: kanalPengaduan,
      members,
      sk: { file: skFile, nomorSK: skDetail.nomorSK, tanggalSK: skDetail.tanggalSK, periodeMultai: skDetail.periodeMulai, periodeSelesai: skDetail.periodeSelesai },
    }
    try {
      const serialisable = {
        ...payload,
        sk: { ...payload.sk, file: payload.sk.file?.name ?? null },
        ...(isPerbaikanMode && { deskripsiPerbaikan: deskripsiPerbaikan.trim() }),
      }
      const role = (() => {
        try { return JSON.parse(sessionStorage.getItem("auth") || "{}").role } catch { return null }
      })()
      const pokjaStatus = isPerbaikanMode ? undefined : (role === "pusat" ? "aktif" : "masih-diverifikasi")
      const key = isPerbaikanMode ? "perbaikanSubmitData" : "newPokjaData"
      sessionStorage.setItem(key, JSON.stringify({ ...serialisable, ...(pokjaStatus ? { pokjaStatus } : {}) }))
    } catch {}
    setSubmitted(true)
  }

  // Navigate after success screen
  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(() => {
      const role = (() => {
        try {
          return JSON.parse(sessionStorage.getItem("auth") || "{}").role
        } catch { return null }
      })()
      if (isPerbaikanMode) {
        window.location.href = "/dashboard?pokjaPerbaikan=1"
      } else if (role === "pusat") {
        window.location.href = "/dashboard?pokjaCreated=1"
      } else {
        window.location.href = "/dashboard?pokjaSubmitted=1"
      }
    }, 1800)
    return () => clearTimeout(t)
  }, [submitted, isPerbaikanMode])

  // ---------------------------------------------------------------------------
  // Success screen
  // ---------------------------------------------------------------------------
  if (submitted) {
    const role = (() => {
      try {
        return JSON.parse(sessionStorage.getItem("auth") || "{}").role
      } catch { return null }
    })()
    const isPusat = role === "pusat"

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 shadow-xl max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {isPerbaikanMode
              ? "Perbaikan Berhasil Dikirim!"
              : isPusat
                ? "Kelompok Kerja Berhasil Dibuat!"
                : "Data Kelompok Kerja Berhasil Dikirim!"}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {isPerbaikanMode
              ? `Perbaikan data Kelompok Kerja wilayah ${REGION} telah dikirim dan kembali menunggu verifikasi Admin Pusat.`
              : isPusat
                ? `Kelompok Kerja untuk wilayah ${REGION} telah dibuat dan aktif.`
                : `Data Kelompok Kerja wilayah ${REGION} sedang menunggu verifikasi dari Admin Pusat.`
            }
          </p>
          <p className="text-xs text-gray-400">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Form page
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <span className="text-gray-300">/</span>
            <h1 className="text-sm font-semibold text-gray-900">
              {isPerbaikanMode ? "Perbaikan Data Kelompok Kerja" : "Pembentukan Kelompok Kerja"} — {REGION}
            </h1>
            {isPerbaikanMode && (
              <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                Mode Perbaikan
              </span>
            )}
          </div>

          {/* Auto-fill button */}
          <button
            onClick={fillDummyData}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Isi Otomatis (Demo)
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const isActive = s.number === step
            const isDone = s.number < step
            return (
              <div key={s.number} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    isDone ? "bg-blue-600 text-white" : isActive ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-gray-200 text-gray-500"
                  )}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                  </div>
                  <span className={cn("text-xs font-medium whitespace-nowrap hidden sm:block", isActive ? "text-blue-700" : isDone ? "text-blue-500" : "text-gray-400")}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-2 mb-4", isDone ? "bg-blue-500" : "bg-gray-200")} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Step header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Langkah {step} dari {STEPS.length}</p>
            <h2 className="text-lg font-bold text-gray-900 mt-0.5">{STEPS[step - 1].label}</h2>
          </div>

          <div className="px-6 py-6">
            {/* ---- Step 1: Informasi Dasar ---- */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Wilayah</label>
                  <div className="flex items-center gap-2 h-9 px-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{REGION}</span>
                  </div>
                  <p className="text-xs text-gray-400">Wilayah tidak dapat diubah</p>
                </div>
                <div className="flex flex-col gap-2">
                  <InputField
                    label="Nomor Kanal Pengaduan dan Aspirasi"
                    required
                    placeholder="Contoh: 081234567890"
                    value={kanalPengaduan}
                    onChange={setKanalPengaduan}
                  />
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 flex flex-col gap-1">
                    <p className="text-xs font-semibold text-amber-900">Nomor ini akan menjadi call center utama POKJA</p>
                    <ul className="text-xs text-amber-800 space-y-0.5 list-disc list-inside">
                      <li>Pastikan nomor aktif dan dapat dihubungi masyarakat</li>
                      <li>Gunakan nomor resmi atas nama institusi, bukan nomor pribadi</li>
                      <li>Nomor ini akan dipublikasikan sebagai saluran pengaduan</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ---- Step 2: Susunan Pengurus ---- */}
            {step === 2 && (
              <div className="flex flex-col gap-6">

                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pimpinan</p>
                  {PIMPINAN_ROLES.map((r) => (
                    <MemberSection key={r.key} label={r.label} value={members[r.key]} onChange={(f, v) => updateMember(r.key, f, v)} />
                  ))}
                </div>
                {/* Anggota per Bidang - 6 Wajib */}
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Anggota per Bidang</p>
                  
                  {/* Anggota Wajib 1: Pendidikan */}
                  <MandatoryMemberSection 
                    label="Anggota Wajib (Bidang Pendidikan)" 
                    value={members.pendidikan} 
                    onChange={(f, v) => updateMember("pendidikan", f, v)}
                    bidangValue="Bidang Pendidikan"
                  />

                  {/* Anggota Wajib 2: PPPA */}
                  <MandatoryMemberSection 
                    label="Anggota Wajib (Bidang PPPA)" 
                    value={members.pppa} 
                    onChange={(f, v) => updateMember("pppa", f, v)}
                    bidangValue="Bidang PPPA"
                  />

                  {/* Anggota Wajib 3: Sosial */}
                  <MandatoryMemberSection 
                    label="Anggota Wajib (Bidang Sosial)" 
                    value={members.sosial} 
                    onChange={(f, v) => updateMember("sosial", f, v)}
                    bidangValue="Bidang Sosial"
                  />

                  {/* Anggota Wajib 4: Kesehatan */}
                  <MandatoryMemberSection 
                    label="Anggota Wajib (Bidang Kesehatan)" 
                    value={members.kesehatan} 
                    onChange={(f, v) => updateMember("kesehatan", f, v)}
                    bidangValue="Bidang Kesehatan"
                  />

                  {/* Anggota Wajib 5: Dukbangga */}
                  <MandatoryMemberSection 
                    label="Anggota Wajib (Bidang Dukbangga)" 
                    value={members.dukbangga} 
                    onChange={(f, v) => updateMember("dukbangga", f, v)}
                    bidangValue="Bidang Dukbangga"
                  />

                  {/* Anggota Wajib 6: Kominfo */}
                  <MandatoryMemberSection 
                    label="Anggota Wajib (Bidang Kominfo)" 
                    value={members.kominfo} 
                    onChange={(f, v) => updateMember("kominfo", f, v)}
                    bidangValue="Bidang Kominfo"
                  />
                </div>

                {/* Anggota Lainnya (Dinamis) */}
                <div className="flex flex-col gap-4">
                  {anggotaList.length > 0 && (
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Anggota Lainnya (Opsional)</p>
                  )}
                  
                  {anggotaList.map((anggota, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-blue-700" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">Anggota Lainnya {index + 1}</span>
                        </div>
                        <button
                          onClick={() => removeAnggota(index)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField 
                          label="Nama" 
                          required 
                          placeholder="Nama lengkap" 
                          value={anggota.nama} 
                          onChange={(v) => updateAnggota(index, "nama", v)} 
                        />
                        <InputField 
                          label="Email" 
                          required 
                          type="email" 
                          placeholder="nama@instansi.go.id" 
                          value={anggota.email} 
                          onChange={(v) => updateAnggota(index, "email", v)} 
                        />
                        <InputField 
                          label="Jabatan" 
                          required 
                          placeholder="Contoh: Kepala Bidang, Staff, dll" 
                          value={anggota.jabatan || ""} 
                          onChange={(v) => updateAnggota(index, "jabatan", v)} 
                        />
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-600">
                            Bidang <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={anggota.bidang}
                              onChange={(e) => updateAnggota(index, "bidang", e.target.value)}
                              className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700"
                            >
                              <option value="" disabled>Pilih bidang</option>
                              <option value="Bidang Pendidikan">Bidang Pendidikan</option>
                              <option value="Bidang PPPA">Bidang PPPA</option>
                              <option value="Bidang Sosial">Bidang Sosial</option>
                              <option value="Bidang Kesehatan">Bidang Kesehatan</option>
                              <option value="Bidang Dukbangga">Bidang Dukbangga</option>
                              <option value="Bidang Kominfo">Bidang Kominfo</option>
                              <option value="Lainnya (Tokoh Masyarakat, Akademisi, Kepolisian, dan sebagainya..)">Lainnya (Tokoh Masyarakat, Akademisi, Kepolisian, dan sebagainya..)</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-600">
                            Jenis Kelamin <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={anggota.jenisKelamin}
                              onChange={(e) => updateAnggota(index, "jenisKelamin", e.target.value)}
                              className="w-full h-9 pl-3 pr-8 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700"
                            >
                              <option value="" disabled>Pilih jenis kelamin</option>
                              <option value="Laki-Laki">Laki-Laki</option>
                              <option value="Perempuan">Perempuan</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-600">
                            No. WhatsApp <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={anggota.noWhatsapp}
                              onChange={(e) => updateAnggota(index, "noWhatsapp", e.target.value.replace(/\D/g, ""))}
                              placeholder="08xxxxxxxxxx"
                              className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                          </div>
                        </div>
                        <InputField 
                          label="Instansi" 
                          required 
                          placeholder="Nama instansi / lembaga" 
                          value={anggota.instansi || ""} 
                          onChange={(v) => updateAnggota(index, "instansi", v)} 
                          className="sm:col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addAnggota}
                    type="button"
                    className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition"
                  >
                    <Plus className="w-4 h-4" /> Tambah Anggota Lainnya
                  </button>
                </div>
              </div>
            )}

            {/* ---- Step 3: Dokumen SK ---- */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <FileUploadField value={skFile} onChange={setSkFile} error={fileError} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Nomor SK <span className="text-red-500">*</span></label>
                    <input type="text" value={skDetail.nomorSK} onChange={(e) => setSkDetail((p) => ({ ...p, nomorSK: e.target.value }))}
                      placeholder="Contoh: 421/001/SK/2025"
                      className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Tanggal SK <span className="text-red-500">*</span></label>
                    <input type="date" value={skDetail.tanggalSK} onChange={(e) => setSkDetail((p) => ({ ...p, tanggalSK: e.target.value }))}
                      className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Periode Mulai <span className="text-red-500">*</span></label>
                    <input type="date" value={skDetail.periodeMulai} onChange={(e) => setSkDetail((p) => ({ ...p, periodeMulai: e.target.value }))}
                      className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Periode Selesai <span className="text-red-500">*</span></label>
                    <input type="date" value={skDetail.periodeSelesai} onChange={(e) => setSkDetail((p) => ({ ...p, periodeSelesai: e.target.value }))}
                      className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  </div>
                </div>
              </div>
            )}

            {/* ---- Step 4: Review ---- */}
            {step === 4 && (
              <div className="flex flex-col gap-6">
                {/* Info Dasar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Informasi Dasar</p>
                    <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Ubah</button>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4 grid grid-cols-2 gap-4">
                    <ReviewRow label="Wilayah" value={REGION} />
                    <ReviewRow label="Nomor Kanal Pengaduan" value={kanalPengaduan} />
                  </div>
                </div>

                {/* Pengurus */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Susunan Pengurus</p>
                    <button onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Ubah</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {PIMPINAN_ROLES.map((r) => (
                      <ReviewMemberCard key={r.key} label={r.label} member={members[r.key]} />
                    ))}
                    {BIDANG_ROLES.map((r) => (
                      <ReviewMemberCard key={r.key} label={r.label} member={members[r.key]} />
                    ))}
                    {anggotaList.filter(a => a.nama).map((a, i) => (
                      <ReviewMemberCard
                        key={`anggota-${i}`}
                        label={`Anggota Lainnya ${i + 1}${a.bidang ? ` – ${a.bidang}` : ""}`}
                        member={{ nama: a.nama, email: a.email, jenisKelamin: a.jenisKelamin as "Laki-Laki" | "Perempuan" | "", noWhatsapp: a.noWhatsapp, instansi: "" }}
                      />
                    ))}
                  </div>
                </div>

                {/* SK */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dokumen SK</p>
                    <button onClick={() => setStep(3)} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Ubah</button>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4 grid grid-cols-2 gap-4">
                    <ReviewRow label="File SK" value={skFile?.name ?? "-"} />
                    <ReviewRow label="Nomor SK" value={skDetail.nomorSK} />
                    <ReviewRow label="Tanggal SK" value={skDetail.tanggalSK} />
                    <ReviewRow label="Periode" value={skDetail.periodeMulai && skDetail.periodeSelesai ? `${skDetail.periodeMulai} s/d ${skDetail.periodeSelesai}` : "-"} />
                  </div>
                </div>

                {/* Deskripsi perubahan — hanya mode perbaikan/edit */}
                {isPerbaikanMode && (
                  <div>
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Catatan Perubahan</p>
                      <p className="text-xs text-gray-400 mt-0.5">Jelaskan perubahan apa saja yang Anda lakukan pada data POKJA ini.</p>
                    </div>
                    <textarea
                      value={deskripsiPerbaikan}
                      onChange={(e) => setDeskripsiPerbaikan(e.target.value)}
                      placeholder="Contoh: Memperbarui nomor SK, mengganti anggota koordinator, dan memperpanjang periode berlaku..."
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pb-8">
          {step > 1 ? (
            <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className={cn(
                "flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition",
                canGoNext()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isPerbaikanMode ? "Kirim Perbaikan" : "Submit Pengajuan"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
