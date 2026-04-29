import { MOCK_PENGAJUAN } from "./mockPokja"

export interface ProvinsiRow {
  no: number
  provinsi: string
  statusPokja: "Terbentuk" | "Dalam Proses" | "Belum Terbentuk"
  jumlahKabKota: number
  pokjaKabKota: number
  persentase: number
  pokjaId?: string
  skor?: number
  skorDelta?: number
  bidangTersedia?: number
  kontak?: string
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
  if (provinsi.includes(" - ")) {
    const statuses: Array<"Terbentuk" | "Dalam Proses" | "Belum Terbentuk"> = ["Terbentuk", "Terbentuk", "Dalam Proses", "Dalam Proses", "Belum Terbentuk"]
    const idx = Math.abs(provinsi.charCodeAt(provinsi.length - 1)) % 5
    return { status: statuses[idx] }
  }
  const match = MOCK_PENGAJUAN.find((p) => p.provinsi === provinsi)
  if (!match) return { status: "Belum Terbentuk" }
  if (match.status === "disetujui") return { status: "Terbentuk", pokjaId: match.id }
  if (match.status === "menunggu-validasi") return { status: "Dalam Proses", pokjaId: match.id }
  return { status: "Dalam Proses", pokjaId: match.id }
}

const KAB_TO_INCLUDE: Record<string, string[]> = {
  "Aceh": ["Banda Aceh", "Aceh Besar", "Pidie", "Aceh Utara", "Aceh Timur", "Aceh Barat"],
  "Sumatera Utara": ["Medan", "Deli Serdang", "Simalungun", "Toba Samosir", "Labuhanbatu", "Padang Sidempuan"],
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu"],
  "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Depok", "Cirebon", "Sukabumi", "Garut", "Karawang"],
  "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo", "Gresik", "Mojokerto", "Kediri", "Jember", "Banyuwangi"],
  "Bali": ["Denpasar", "Badung", "Gianyar", "Klungkung", "Bangli", "Karangasem", "Jembrana", "Buleleng", "Tabanan"],
  "Sulawesi Selatan": ["Makassar", "Gowa", "Maros", "Parepare", "Mamuju", "Bantaeng", "Bone", "Luwu"],
  "Papua": ["Jayapura", "Mamberamo Tengah", "Keerom", "Sarmi", "Biak Numfor", "Supiori", "Yahukimo", "Puncak", "Tolikara"],
}

function seedScore(seed: number, min: number, max: number): number {
  const x = Math.sin(seed + 1) * 10000
  return min + Math.floor((x - Math.floor(x)) * (max - min + 1))
}

function seedDelta(seed: number): number {
  const x = Math.sin(seed + 13) * 10000
  const raw = Math.floor((x - Math.floor(x)) * 21) - 10 // -10 to +10
  return raw === 0 ? 1 : raw
}

function seedPhone(seed: number): string {
  const x = Math.abs(Math.sin(seed + 7) * 1e10)
  const digits = Math.floor(x) % 100000000
  return `0812${String(digits).padStart(8, "0")}`
}

function generateRows(): ProvinsiRow[] {
  const rows: ProvinsiRow[] = []
  let no = 0

  for (const p of ALL_PROVINSI) {
    const { status, pokjaId } = getStatus(p.name)
    const pokjaKabKota = status === "Terbentuk" ? Math.floor(p.kabKota * 0.3) : 0
    no++
    const skor = status === "Terbentuk"
      ? seedScore(no, 60, 100)
      : status === "Dalam Proses"
      ? seedScore(no, 30, 59)
      : undefined
    const bidangTersedia = status === "Terbentuk" ? 3 + (no % 3) : undefined
    const skorDelta = skor != null ? seedDelta(no) : undefined
    const matchPokja = MOCK_PENGAJUAN.find((p2) => p2.id === pokjaId)
    const kontak = status === "Terbentuk"
      ? (matchPokja?.kanalPengaduan ?? seedPhone(no))
      : undefined
    rows.push({
      no: no,
      provinsi: p.name,
      statusPokja: status,
      jumlahKabKota: p.kabKota,
      pokjaKabKota,
      persentase: p.kabKota > 0 ? Math.round((pokjaKabKota / p.kabKota) * 100) : 0,
      pokjaId,
      skor,
      skorDelta,
      bidangTersedia,
      kontak,
    })

    if (KAB_TO_INCLUDE[p.name]) {
      for (const kabName of KAB_TO_INCLUDE[p.name]) {
        const fullName = `${p.name} - ${kabName}`
        const { status: kabStatus, pokjaId: kabPokjaId } = getStatus(fullName)
        const isTerbentuk = kabStatus === "Terbentuk"
        const kabNo = ++no
        const kabSkor = isTerbentuk
          ? seedScore(kabNo, 60, 100)
          : kabStatus === "Dalam Proses"
          ? seedScore(kabNo, 30, 59)
          : undefined
        const kabBidang = isTerbentuk ? 3 + (kabNo % 3) : undefined
        const kabSkorDelta = kabSkor != null ? seedDelta(kabNo) : undefined
        const kabKontak = isTerbentuk ? seedPhone(kabNo) : undefined
        rows.push({
          no: kabNo,
          provinsi: fullName,
          statusPokja: kabStatus,
          jumlahKabKota: 1,
          pokjaKabKota: isTerbentuk ? 1 : 0,
          persentase: isTerbentuk ? 100 : 0,
          pokjaId: kabPokjaId,
          skor: kabSkor,
          skorDelta: kabSkorDelta,
          bidangTersedia: kabBidang,
          kontak: kabKontak,
        })
      }
    }
  }

  return rows
}

export const PROVINSI_DATA: ProvinsiRow[] = generateRows()

export const TOTAL_PROVINSI = ALL_PROVINSI.length
export const TOTAL_KAB_KOTA = ALL_PROVINSI.reduce((s, p) => s + p.kabKota, 0)
export const PROVINSI_TERBENTUK = PROVINSI_DATA.filter((p) => p.statusPokja === "Terbentuk").length
export const KAB_KOTA_TERBENTUK = PROVINSI_DATA.reduce((s, p) => s + p.pokjaKabKota, 0)
export const PERSENTASE_NASIONAL =
  TOTAL_PROVINSI > 0 ? Math.round((PROVINSI_TERBENTUK / TOTAL_PROVINSI) * 100) : 0
export const LAST_UPDATED = "2 Februari 2026, 16:50:00"
