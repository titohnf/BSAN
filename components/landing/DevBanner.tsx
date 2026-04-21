"use client"

import { useState } from "react"
import { Construction, X } from "lucide-react"

export function DevBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-amber-400 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Construction className="w-4 h-4 shrink-0" />
          <p className="text-xs font-medium leading-snug">
            <span className="font-bold">Dalam Pengembangan</span>
            {" — "}Halaman ini masih dalam tahap pengembangan. Beberapa fitur mungkin belum berfungsi sepenuhnya.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded text-slate-900/60 hover:text-slate-900 hover:bg-black/10 transition-colors shrink-0"
          aria-label="Tutup"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
