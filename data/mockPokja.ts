// ---------------------------------------------------------------------------
// Shared types & mock data for POKJA submissions
// ---------------------------------------------------------------------------

export type JenisKelamin = "Laki-Laki" | "Perempuan" | ""

export interface MemberData {
  jabatan: string
  nama: string
  email: string
  jenisKelamin: JenisKelamin
  noWhatsapp: string
  instansi: string
  // per-member validation state (set by admin pusat)
  status: "pending" | "approved" | "declined"
  alasanPenolakan?: string
}

export type PengajuanStatus =
  | "menunggu-validasi"
  | "disetujui"
  | "ditolak-sebagian"
  | "butuh-perbaikan"

export interface PengajuanPokja {
  id: string
  wilayah: string
  provinsi: string
  kanalPengaduan: string
  nomorSK: string
  tanggalSK: string
  periodeMulai: string
  periodeSelesai: string
  skFileName: string
  members: MemberData[]
  status: PengajuanStatus
  tanggalPengajuan: string
  alasanPenolakan?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeMember(jabatan: string, nama: string, email: string, jk: JenisKelamin, wa: string, instansi: string): MemberData {
  return { jabatan, nama, email, jenisKelamin: jk, noWhatsapp: wa, instansi, status: "pending" }
}

// ---------------------------------------------------------------------------
// Mock submissions from various daerah
// ---------------------------------------------------------------------------
export const MOCK_PENGAJUAN: PengajuanPokja[] = [
  {
    id: "pkj-001",
    wilayah: "Prov. Aceh",
    provinsi: "Aceh",
    kanalPengaduan: "08111234567",
    nomorSK: "420/001/2024",
    tanggalSK: "2024-03-01",
    periodeMulai: "2024-04-01",
    periodeSelesai: "2027-03-31",
    skFileName: "SK_POKJA_Aceh.pdf",
    tanggalPengajuan: "2024-03-15",
    status: "menunggu-validasi",
    members: [
      makeMember("Ketua Pokja", "Dr. Rizal Aditya, M.Pd", "rizal.aditya@aceh.go.id", "Laki-Laki", "08111234567", "Dinas Pendidikan Prov. Aceh"),
      makeMember("Wakil Ketua Pokja", "Sari Dewi, S.Pd", "sari.dewi@aceh.go.id", "Perempuan", "08122345678", "Dinas Pendidikan Prov. Aceh"),
      makeMember("Koordinator", "Budi Santoso, M.Si", "budi.santoso@aceh.go.id", "Laki-Laki", "08133456789", "Sekretariat Daerah Prov. Aceh"),
      makeMember("Bidang Pendidikan", "Nurul Huda, S.Pd", "nurul.huda@aceh.go.id", "Perempuan", "08144567890", "Dinas Pendidikan Prov. Aceh"),
      makeMember("Bidang PPPA", "Aminah Siregar, M.Si", "aminah.siregar@aceh.go.id", "Perempuan", "08155678901", "DP3A Prov. Aceh"),
      makeMember("Bidang Sosial", "Hendra Wijaya, S.Sos", "hendra.wijaya@aceh.go.id", "Laki-Laki", "08166789012", "Dinas Sosial Prov. Aceh"),
      makeMember("Bidang Kesehatan", "dr. Lestari Putri", "lestari.putri@aceh.go.id", "Perempuan", "08177890123", "Dinas Kesehatan Prov. Aceh"),
      makeMember("Bidang Kominfo", "Faisal Rahman, S.Kom", "faisal.rahman@aceh.go.id", "Laki-Laki", "08188901234", "Dinas Kominfo Prov. Aceh"),
      makeMember("Bidang Dukbangga", "Indah Permata, M.Pd", "indah.permata@aceh.go.id", "Perempuan", "08199012345", "BPKAD Prov. Aceh"),
    ],
  },
  {
    id: "pkj-002",
    wilayah: "Prov. Sumatera Utara",
    provinsi: "Sumatera Utara",
    kanalPengaduan: "08222345678",
    nomorSK: "420/015/2024",
    tanggalSK: "2024-03-10",
    periodeMulai: "2024-04-10",
    periodeSelesai: "2027-04-09",
    skFileName: "SK_POKJA_Sumut.pdf",
    tanggalPengajuan: "2024-03-18",
    status: "menunggu-validasi",
    members: [
      makeMember("Ketua Pokja", "Prof. Andi Kurniawan", "andi.kurniawan@sumut.go.id", "Laki-Laki", "08222345678", "Dinas Pendidikan Prov. Sumut"),
      makeMember("Wakil Ketua Pokja", "Mardiana Lubis, M.Pd", "mardiana.lubis@sumut.go.id", "Perempuan", "08233456789", "Dinas Pendidikan Prov. Sumut"),
      makeMember("Koordinator", "Syahrul Efendi, S.H", "syahrul.efendi@sumut.go.id", "Laki-Laki", "08244567890", "Sekretariat Daerah Prov. Sumut"),
      makeMember("Bidang Pendidikan", "Rini Hartati, S.Pd", "rini.hartati@sumut.go.id", "Perempuan", "08255678901", "Dinas Pendidikan Prov. Sumut"),
      makeMember("Bidang PPPA", "Wulandari, M.Si", "wulandari@sumut.go.id", "Perempuan", "08266789012", "DP3A Prov. Sumut"),
      makeMember("Bidang Sosial", "Ramli Nasution, S.Sos", "ramli.nasution@sumut.go.id", "Laki-Laki", "08277890123", "Dinas Sosial Prov. Sumut"),
      makeMember("Bidang Kesehatan", "dr. Dian Anggraini", "dian.anggraini@sumut.go.id", "Perempuan", "08288901234", "Dinas Kesehatan Prov. Sumut"),
      makeMember("Bidang Kominfo", "Taufik Hidayat, S.Kom", "taufik.hidayat@sumut.go.id", "Laki-Laki", "08299012345", "Dinas Kominfo Prov. Sumut"),
      makeMember("Bidang Dukbangga", "Erna Sitompul, M.Pd", "erna.sitompul@sumut.go.id", "Perempuan", "08200123456", "BPKAD Prov. Sumut"),
    ],
  },
  {
    id: "pkj-003",
    wilayah: "Prov. DKI Jakarta",
    provinsi: "DKI Jakarta",
    kanalPengaduan: "08311234567",
    nomorSK: "420/022/2024",
    tanggalSK: "2024-02-28",
    periodeMulai: "2024-03-28",
    periodeSelesai: "2027-03-27",
    skFileName: "SK_POKJA_DKI.pdf",
    tanggalPengajuan: "2024-03-05",
    status: "disetujui",
    members: [
      makeMember("Ketua Pokja", "Dr. Hendra Gunawan", "hendra.gunawan@jakarta.go.id", "Laki-Laki", "08311234567", "Dinas Pendidikan DKI Jakarta"),
      makeMember("Wakil Ketua Pokja", "Dewi Rahmawati, M.Pd", "dewi.rahmawati@jakarta.go.id", "Perempuan", "08322345678", "Dinas Pendidikan DKI Jakarta"),
      makeMember("Koordinator", "Agus Setiawan, S.H", "agus.setiawan@jakarta.go.id", "Laki-Laki", "08333456789", "Sekretariat Daerah DKI Jakarta"),
      makeMember("Bidang Pendidikan", "Yunita Sari, S.Pd", "yunita.sari@jakarta.go.id", "Perempuan", "08344567890", "Dinas Pendidikan DKI Jakarta"),
      makeMember("Bidang PPPA", "Kartini Wahyuni, M.Si", "kartini.wahyuni@jakarta.go.id", "Perempuan", "08355678901", "DP3A DKI Jakarta"),
      makeMember("Bidang Sosial", "Bambang Priyanto, S.Sos", "bambang.priyanto@jakarta.go.id", "Laki-Laki", "08366789012", "Dinas Sosial DKI Jakarta"),
      makeMember("Bidang Kesehatan", "dr. Siti Nurbaya", "siti.nurbaya@jakarta.go.id", "Perempuan", "08377890123", "Dinas Kesehatan DKI Jakarta"),
      makeMember("Bidang Kominfo", "Denny Prasetyo, S.Kom", "denny.prasetyo@jakarta.go.id", "Laki-Laki", "08388901234", "Dinas Kominfo DKI Jakarta"),
      makeMember("Bidang Dukbangga", "Retno Wulandari, M.Pd", "retno.wulandari@jakarta.go.id", "Perempuan", "08399012345", "BPKAD DKI Jakarta"),
    ],
  },
  {
    id: "pkj-004",
    wilayah: "Prov. Jawa Barat",
    provinsi: "Jawa Barat",
    kanalPengaduan: "08411234567",
    nomorSK: "420/031/2024",
    tanggalSK: "2024-03-05",
    periodeMulai: "2024-04-05",
    periodeSelesai: "2027-04-04",
    skFileName: "SK_POKJA_Jabar.pdf",
    tanggalPengajuan: "2024-03-20",
    status: "menunggu-validasi",
    members: [
      makeMember("Ketua Pokja", "Prof. Asep Kurniawan", "asep.kurniawan@jabar.go.id", "Laki-Laki", "08411234567", "Dinas Pendidikan Prov. Jabar"),
      makeMember("Wakil Ketua Pokja", "Neneng Susilawati, M.Pd", "neneng.susilawati@jabar.go.id", "Perempuan", "08422345678", "Dinas Pendidikan Prov. Jabar"),
      makeMember("Koordinator", "Ujang Suherman, S.H", "ujang.suherman@jabar.go.id", "Laki-Laki", "08433456789", "Sekretariat Daerah Prov. Jabar"),
      makeMember("Bidang Pendidikan", "Pipit Rachmawati, S.Pd", "pipit.rachmawati@jabar.go.id", "Perempuan", "08444567890", "Dinas Pendidikan Prov. Jabar"),
      makeMember("Bidang PPPA", "Titi Suharti, M.Si", "titi.suharti@jabar.go.id", "Perempuan", "08455678901", "DP3A Prov. Jabar"),
      makeMember("Bidang Sosial", "Dadang Firmansyah, S.Sos", "dadang.firmansyah@jabar.go.id", "Laki-Laki", "08466789012", "Dinas Sosial Prov. Jabar"),
      makeMember("Bidang Kesehatan", "dr. Nina Kurnia", "nina.kurnia@jabar.go.id", "Perempuan", "08477890123", "Dinas Kesehatan Prov. Jabar"),
      makeMember("Bidang Kominfo", "Rudi Hartono, S.Kom", "rudi.hartono@jabar.go.id", "Laki-Laki", "08488901234", "Dinas Kominfo Prov. Jabar"),
      makeMember("Bidang Dukbangga", "Siti Fatimah, M.Pd", "siti.fatimah@jabar.go.id", "Perempuan", "08499012345", "BPKAD Prov. Jabar"),
    ],
  },
  {
    id: "pkj-005",
    wilayah: "Prov. Jawa Tengah",
    provinsi: "Jawa Tengah",
    kanalPengaduan: "08511234567",
    nomorSK: "420/042/2024",
    tanggalSK: "2024-03-08",
    periodeMulai: "2024-04-08",
    periodeSelesai: "2027-04-07",
    skFileName: "SK_POKJA_Jateng.pdf",
    tanggalPengajuan: "2024-03-22",
    status: "butuh-perbaikan",
    alasanPenolakan: "Dokumen SK tidak memenuhi format yang ditentukan. Nomor SK tidak sesuai dengan ketentuan administrasi.",
    members: [
      makeMember("Ketua Pokja", "Dr. Slamet Riyadi", "slamet.riyadi@jateng.go.id", "Laki-Laki", "08511234567", "Dinas Pendidikan Prov. Jateng"),
      makeMember("Wakil Ketua Pokja", "Sumiati Rahayu, M.Pd", "sumiati.rahayu@jateng.go.id", "Perempuan", "08522345678", "Dinas Pendidikan Prov. Jateng"),
      makeMember("Koordinator", "Mulyono, S.H", "mulyono@jateng.go.id", "Laki-Laki", "08533456789", "Sekretariat Daerah Prov. Jateng"),
      makeMember("Bidang Pendidikan", "Wahyuni Setyaningsih, S.Pd", "wahyuni.setyaningsih@jateng.go.id", "Perempuan", "08544567890", "Dinas Pendidikan Prov. Jateng"),
      makeMember("Bidang PPPA", "Endang Wulandari, M.Si", "endang.wulandari@jateng.go.id", "Perempuan", "08555678901", "DP3A Prov. Jateng"),
      makeMember("Bidang Sosial", "Purnomo, S.Sos", "purnomo@jateng.go.id", "Laki-Laki", "08566789012", "Dinas Sosial Prov. Jateng"),
      makeMember("Bidang Kesehatan", "dr. Rina Kusuma", "rina.kusuma@jateng.go.id", "Perempuan", "08577890123", "Dinas Kesehatan Prov. Jateng"),
      makeMember("Bidang Kominfo", "Gunawan Susilo, S.Kom", "gunawan.susilo@jateng.go.id", "Laki-Laki", "08588901234", "Dinas Kominfo Prov. Jateng"),
      makeMember("Bidang Dukbangga", "Sri Wahyuni, M.Pd", "sri.wahyuni@jateng.go.id", "Perempuan", "08599012345", "BPKAD Prov. Jateng"),
    ],
  },
]
