import { DEFAULT_DINAS_NAMA } from "@/lib/auth-session"

const adminDinas = (namaDinas: string) => `Admin ${namaDinas.trim()}`

/** Pesan log yang menyebut dinas pemilik data (nama dari login, mis. Dinas Pendidikan Provinsi Aceh). */
export const dinasLog = {
  dibuat: (namaDinas: string) => `Dibuat oleh ${adminDinas(namaDinas)}`,
  dibuatTerverifikasi: (namaDinas: string) => `Dibuat dan diverifikasi oleh ${adminDinas(namaDinas)}`,
  diverifikasi: (namaDinas: string) => `Diverifikasi oleh ${adminDinas(namaDinas)}`,
  dinonaktifkan: (namaDinas: string) => `Dinonaktifkan oleh ${adminDinas(namaDinas)}`,
  diperbaharui: (namaDinas: string) => `Diperbaharui oleh ${adminDinas(namaDinas)}`,
  batalkanVerifikasi: (namaDinas: string) => `Verifikasi dibatalkan oleh ${adminDinas(namaDinas)}`,
  dipulihkan: (namaDinas: string) => `Dipulihkan oleh ${adminDinas(namaDinas)}`,
  menungguReview: (namaDinas: string) => `Menunggu review oleh ${adminDinas(namaDinas)}`,
  butuhPerbaikan: (namaDinas: string) => `Ditolak oleh ${adminDinas(namaDinas)}`,
}

/** Teks untuk peran pusat (tetap generik). */
export const RUJUKAN_LOG = {
  dibuatTerverifikasiPusat: "Dibuat dan diverifikasi oleh Admin Pusat",
  dibuatSekolah: (namaSekolah: string) => `Dibuat oleh Admin Sekolah ${namaSekolah}`,
  diverifikasiPusat: "Diverifikasi oleh Admin Pusat",
  dinonaktifkanPusat: "Dinonaktifkan oleh Admin Pusat",
  diperbaharuiPusat: "Diperbaharui oleh Admin Pusat",
  batalkanVerifikasiPusat: "Verifikasi dibatalkan oleh Admin Pusat",
  dipulihkanPusat: "Dipulihkan oleh Admin Pusat",
} as const

export type RujukanLogSource = {
  logTerakhir?: string
  status: "terverifikasi" | "menunggu" | "menunggu_review" | "nonaktif" | "butuh_perbaikan"
  usulanDari?: "dinas" | "sekolah" | "pusat"
  namaSekolah?: string
}

/** Status setelah pulihkan dari arsip dihapus: sekolah kembali menunggu, selain itu terverifikasi. */
export function getStatusAfterRestore(usulanDari: RujukanLogSource["usulanDari"]) {
  if (usulanDari === "sekolah") return "menunggu" as const
  return "terverifikasi" as const
}

/**
 * Fallback bila `logTerakhir` belum terset (data lama / edge case).
 * `dinasNama` biasanya dari `getDinasNamaForLogs()`.
 */
/** Log lama sebelum nama dinas lengkap disimpan di sessionStorage. */
const LEGACY_LOG_NONAKTIF_DINAS = /^Di(hapus|nonaktifkan) oleh Admin Dinas$/i

/** Log lama yang perlu di-replace ke format baru. */
const LEGACY_LOG_BUTUH_PERBAIKAN = /^Butuh perbaikan oleh Admin /i

const LEGACY_LOG_DILAPORKAN = /^Dilaporkan oleh Admin /i

export function formatLogTerakhirDisplay(item: RujukanLogSource, dinasNama: string = DEFAULT_DINAS_NAMA) {
  const d = dinasNama.trim() || DEFAULT_DINAS_NAMA
  let t = item.logTerakhir?.trim()

  if (item.status === "nonaktif") {
    if (!t || LEGACY_LOG_NONAKTIF_DINAS.test(t)) return item.usulanDari === "pusat" ? RUJUKAN_LOG.dinonaktifkanPusat : dinasLog.dinonaktifkan(d)
    return t
  }

  if (item.status === "butuh_perbaikan") {
    if (!t) return dinasLog.butuhPerbaikan(d)
    if (LEGACY_LOG_BUTUH_PERBAIKAN.test(t)) {
      if (item.usulanDari === "pusat") return "Ditolak oleh Admin Pusat"
      return `Ditolak oleh Admin ${d}`
    }
    return t
  }

  if (item.status === "menunggu") {
    if (t && LEGACY_LOG_DILAPORKAN.test(t)) return t
    if (t) return t
    if (item.usulanDari === "sekolah" && item.namaSekolah?.trim()) {
      return RUJUKAN_LOG.dibuatSekolah(item.namaSekolah.trim())
    }
    if (item.usulanDari === "pusat") {
      return RUJUKAN_LOG.dibuatTerverifikasiPusat
    }
    return dinasLog.dibuat(d)
  }
  if (item.status === "menunggu_review") return dinasLog.menungguReview(d)
  if (item.status === "terverifikasi") {
    if (item.usulanDari === "pusat") {
      return RUJUKAN_LOG.diverifikasiPusat
    }
    return dinasLog.diverifikasi(d)
  }
  return "—"
}
