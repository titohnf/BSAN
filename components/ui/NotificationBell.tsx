"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, AlertTriangle, X } from "lucide-react"

interface Notif {
  id: string
  tipe: "warning" | "info"
  judul: string
  pesan: string
  waktu: string
  dibaca: boolean
}

const DUMMY_NOTIFS: Notif[] = [
  {
    id: "notif-1",
    tipe: "warning",
    judul: "SK Mendekati Masa Kedaluwarsa",
    pesan: "SK sudah mendekati masa kedaluwarsa, segera update dan unggah SK terbaru.",
    waktu: "Baru saja",
    dibaca: false,
  },
]

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>(DUMMY_NOTIFS)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifs.filter((n) => !n.dibaca).length

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, dibaca: true })))

  const dismiss = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id))

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Notifikasi"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          {notifs.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Tidak ada notifikasi</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {notifs.map((n) => (
                <li
                  key={n.id}
                  className={`flex gap-3 px-4 py-3.5 transition-colors ${!n.dibaca ? "bg-amber-50/60" : "bg-white"}`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.tipe === "warning" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{n.judul}</p>
                      <button
                        type="button"
                        onClick={() => dismiss(n.id)}
                        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                        aria-label="Tutup notifikasi"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.pesan}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{n.waktu}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
