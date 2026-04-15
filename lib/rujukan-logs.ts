import { DEFAULT_DINAS_NAMA } from "@/lib/auth-session"

const adminDinas = (namaDinas: string) => `Admin ${namaDinas.trim()}`

/** Pesan log yang menyebut dinas pemilik data (nama dari login, mis. Dinas Pendidikan Provinsi Aceh). */
export const dinasLog = {
  dibuat: (namaDinas: string) => `Dibuat oleh ${adminDinas(namaDinas)}`,
  dibuatTerverifikasi: (namaDinas: string) => `Dibuat dan diverifikasi oleh ${adminDinas(namaDinas)}`,
  diverifikasi: (namaDinas: string) => `Diverifikasi oleh ${adminDinas(namaDinas)}`,
  dihapus: (namaDinas: string) => `Dihapus oleh ${adminDinas(namaDinas)}`,
  diperbaharui: (namaDinas: string) => `Diperbaharui oleh ${adminDinas(namaDinas)}`,
  batalkanVerifikasi: (namaDinas: string) => `Verifikasi dibatalkan oleh ${adminDinas(namaDinas)}`,
  dipulihkan: (namaDinas: string) => `Dipulihkan oleh ${adminDinas(namaDinas)}`,
  menungguReview: (namaDinas: string) => `Menunggu review oleh ${adminDinas(namaDinas)}`,
}

/** Teks untuk peran pusat (tetap generik). */
export const RUJUKAN_LOG = {
  dibuatTerverifikasiPusat: "Dibuat dan diverifikasi oleh Admin Pusat",
  dibuatSekolah: (namaSekolah: string) => `Dibuat oleh Admin Sekolah ${namaSekolah}`,
  diverifikasiPusat: "Diverifikasi oleh Admin Pusat",
  dihapusPusat: "Dihapus oleh Admin Pusat",
  diperbaharuiPusat: "Diperbaharui oleh Admin Pusat",
  batalkanVerifikasiPusat: "Verifikasi dibatalkan oleh Admin Pusat",
  dipulihkanPusat: "Dipulihkan oleh Admin Pusat",
} as const

export type RujukanLogSource = {
  logTerakhir?: string
  status: "terverifikasi" | "menunggu" | "menunggu_review" | "dihapus"
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
const LEGACY_LOG_DIHAPUS_DINAS = /^Dihapus oleh Admin Dinas$/i

export function formatLogTerakhirDisplay(item: RujukanLogSource, dinasNama: string = DEFAULT_DINAS_NAMA) {
  const d = dinasNama.trim() || DEFAULT_DINAS_NAMA
  const t = item.logTerakhir?.trim()

  if (item.status === "dihapus") {
    if (!t || LEGACY_LOG_DIHAPUS_DINAS.test(t)) return item.usulanDari === "pusat" ? RUJUKAN_LOG.dihapusPusat : dinasLog.dihapus(d)
    return t
  }

  if (t) return t

  if (item.status === "menunggu") {
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
