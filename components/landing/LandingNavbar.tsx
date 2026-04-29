"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { GraduationCap, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Beranda", href: "/", anchor: false },
  { label: "Sumber Dukungan", href: "/sumber-dukungan", anchor: false },
  { label: "Kegiatanyangdiinputkan", href: "/kegiatanyangdiinputkan", anchor: false },
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

  const handleNavClick = (link: { href: string; anchor: boolean; external?: boolean }) => {
    setMobileOpen(false)
    if (link.external) {
      window.open(link.href, "_blank")
      return
    }
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
        "fixed top-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => handleNavClick({ href: "/", anchor: false })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            BSAN
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
                pathname === link.href && !link.external
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
              )}
            >
              {link.label}
              {link.external && (
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </button>
          ))}
          <div className="w-px h-4 bg-slate-300 mx-2" />
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 shadow-none"
            size="sm"
          >
            Masuk
          </Button>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
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
                className="text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.external && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </button>
            ))}
            <div className="pt-2 pb-1">
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-none"
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
