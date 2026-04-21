import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"

const quickLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Urgensi Program", href: "#urgensi" },
  { label: "Tentang BSAN", href: "#tentang" },
  { label: "Ringkasan Regulasi", href: "#regulasi" },
  { label: "FAQ", href: "#faq" },
]

const partners = ["G7KAIH", "Smart Character", "Ramah"]

export function LandingFooter() {
  const handleClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">BSAN</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Sistem Informasi Budaya Sekolah Aman dan Nyaman — Platform pengelolaan
              POKJA dan pemantauan program perlindungan peserta didik.
            </p>
            <div className="flex gap-2 flex-wrap">
              {partners.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm text-slate-200 mb-4">Tautan Cepat</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-slate-400 text-sm hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm text-slate-200 mb-4">Kontak</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-slate-400 text-sm">
                  Pusat Penguatan Karakter, Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-400 text-sm">bsan@kemdikbud.go.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-400 text-sm">(021) 5703303</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-xs">
            © 2025 BSAN — Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi
          </p>
          <p className="text-slate-600 text-xs">
            Sistem Informasi POKJA Sekolah Aceh
          </p>
        </div>
      </div>
    </footer>
  )
}
