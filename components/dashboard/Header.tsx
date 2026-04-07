"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, LogOut, UserCircle2 } from "lucide-react"
import { clearAuthAndRedirectToLogin } from "@/lib/logout"

interface HeaderProps {
  userName?: string
}

export function Header({ userName = "Admin Dinas" }: HeaderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const logout = () => clearAuthAndRedirectToLogin(router)

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifikasi"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="relative" ref={wrapRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <UserCircle2 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[200px] truncate">{userName}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
