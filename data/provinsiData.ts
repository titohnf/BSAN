import { MOCK_PENGAJUAN } from "./mockPokja"

export interface ProvinsiRow {
  no: number
  provinsi: string
  statusPokja: "Terbentuk" | "Dalam Proses" | "Belum Terbentuk"
  jumlahKabKota: number
  pokjaKabKota: number
  persentase: number
  pokjaId?: string
}

const ALL_PROVINSI: { name: string; kabKota: number }[] = [
  { name: "Aceh", kabKota: 23 },
  { name: "Sumatera Utara", kabKota: 33 },
  { name: "Sumatera Barat", kabKota: 19 },
  { name: "Riau", kabKota: 12 },
  { name: "Jambi", kabKota: 11 },
  { name: "Sumatera Selatan", kabKota: 17 },
  { name: "Bengkulu", kabKota: 10 },
  { name: "Lampung", kabKota: 15 },
  { name: "Kepulauan Bangka Belitung", kabKota: 7 },
  { name: "Kepulauan Riau", kabKota: 7 },
  { name: "DKI Jakarta", kabKota: 6 },
  { name: "Jawa Barat", kabKota: 27 },
  { name: "Jawa Tengah", kabKota: 35 },
  { name: "DI Yogyakarta", kabKota: 5 },
  { name: "Jawa Timur", kabKota: 38 },
  { name: "Banten", kabKota: 8 },
  { name: "Bali", kabKota: 9 },
  { name: "Nusa Tenggara Barat", kabKota: 10 },
  { name: "Nusa Tenggara Timur", kabKota: 22 },
  { name: "Kalimantan Barat", kabKota: 14 },
  { name: "Kalimantan Tengah", kabKota: 14 },
  { name: "Kalimantan Selatan", kabKota: 13 },
  { name: "Kalimantan Timur", kabKota: 10 },
  { name: "Kalimantan Utara", kabKota: 5 },
  { name: "Sulawesi Utara", kabKota: 15 },
  { name: "Sulawesi Tengah", kabKota: 13 },
  { name: "Sulawesi Selatan", kabKota: 24 },
  { name: "Sulawesi Tenggara", kabKota: 17 },
  { name: "Gorontalo", kabKota: 6 },
  { name: "Sulawesi Barat", kabKota: 6 },
  { name: "Maluku", kabKota: 11 },
  { name: "Maluku Utara", kabKota: 10 },
  { name: "Papua Barat", kabKota: 6 },
  { name: "Papua Barat Daya", kabKota: 5 },
  { name: "Papua", kabKota: 9 },
  { name: "Papua Selatan", kabKota: 4 },
  { name: "Papua Tengah", kabKota: 8 },
  { name: "Papua Pegunungan", kabKota: 8 },
]

function getStatus(provinsi: string): {
  status: "Terbentuk" | "Dalam Proses" | "Belum Terbentuk"
  pokjaId?: string
} {
  const match = MOCK_PENGAJUAN.find((p) => p.provinsi === provinsi)
  if (!match) return { status: "Belum Terbentuk" }
  if (match.status === "disetujui") return { status: "Terbentuk", pokjaId: match.id }
  if (match.status === "menunggu-validasi") return { status: "Dalam Proses", pokjaId: match.id }
  return { status: "Dalam Proses", pokjaId: match.id }
}

export const PROVINSI_DATA: ProvinsiRow[] = ALL_PROVINSI.map((p, i) => {
  const { status, pokjaId } = getStatus(p.name)
  const pokjaKabKota = status === "Terbentuk" ? Math.floor(p.kabKota * 0.3) : 0
  return {
    no: i + 1,
    provinsi: p.name,
    statusPokja: status,
    jumlahKabKota: p.kabKota,
    pokjaKabKota,
    persentase: p.kabKota > 0 ? Math.round((pokjaKabKota / p.kabKota) * 100) : 0,
    pokjaId,
  }
})

export const TOTAL_PROVINSI = ALL_PROVINSI.length
export const TOTAL_KAB_KOTA = ALL_PROVINSI.reduce((s, p) => s + p.kabKota, 0)
export const PROVINSI_TERBENTUK = PROVINSI_DATA.filter((p) => p.statusPokja === "Terbentuk").length
export const KAB_KOTA_TERBENTUK = PROVINSI_DATA.reduce((s, p) => s + p.pokjaKabKota, 0)
export const PERSENTASE_NASIONAL =
  TOTAL_PROVINSI > 0 ? Math.round((PROVINSI_TERBENTUK / TOTAL_PROVINSI) * 100) : 0
export const LAST_UPDATED = "2 Februari 2026, 16:50:00"
