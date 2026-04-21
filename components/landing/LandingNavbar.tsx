"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { GraduationCap, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Beranda", href: "#beranda", anchor: true },
  { label: "Urgensi", href: "#urgensi", anchor: true },
  { label: "Tentang", href: "#tentang", anchor: true },
  { label: "Regulasi", href: "#regulasi", anchor: true },
  { label: "Data Publik", href: "/data-publik", anchor: false },
  { label: "FAQ", href: "#faq", anchor: true },
]

export function LandingNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (link: { href: string; anchor: boolean }) => {
    setMobileOpen(false)
    if (!link.anchor) {
      router.push(link.href)
      return
    }
    if (!isHome) {
      router.push(`/${link.href}`)
      return
    }
    const el = document.querySelector(link.href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => handleNavClick({ href: "#beranda", anchor: true })}
          className="flex items-center gap-2.5 group"
        >
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
            scrolled ? "bg-blue-700" : "bg-white"
          )}>
            <GraduationCap className={cn(
              "w-5 h-5 transition-colors",
              scrolled ? "text-white" : "text-blue-700"
            )} />
          </div>
          <span className={cn(
            "font-bold text-lg tracking-tight transition-colors",
            scrolled ? "text-slate-900" : "text-white"
          )}>
            BSAN
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                !link.anchor && pathname === link.href
                  ? scrolled
                    ? "text-blue-700 bg-blue-50"
                    : "text-white bg-white/20"
                  : scrolled
                  ? "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {link.label}
            </button>
          ))}
          <div className="w-px h-4 bg-current opacity-20 mx-2" />
          <Button
            onClick={() => router.push("/login")}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-5 shadow-none"
            size="sm"
          >
            Masuk
          </Button>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "md:hidden p-2 rounded-md transition-colors",
            scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
          )}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className="text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 pb-1">
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-none"
              >
                Masuk ke Sistem
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
