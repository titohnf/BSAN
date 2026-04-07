"use client"
import { useState } from "react"
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  Building2,
} from "lucide-react"
import type { PokjaItem } from "@/types/pokja"
import { ALL_ROLES } from "@/types/pokja"
import { Badge } from "@/components/ds/Badge"

type MemberAction = "approved" | "declined" | "pending"

interface MemberState {
  action: MemberAction
  alasan: string
}

interface ValidatePokjaDrawerProps {
  pokja: PokjaItem
  onClose: () => void
  onSave: (updated: PokjaItem) => void
}

const STATUS_CONFIG = {
  "belum-dibentuk": { label: "Belum Dibentuk", variant: "neutral" as const },
  "masih-diverifikasi": { label: "Menunggu Verifikasi", variant: "warning" as const },
  aktif: { label: "Aktif", variant: "success" as const },
  ditolak: { label: "Ditolak", variant: "error" as const },
}

export function ValidatePokjaDrawer({ pokja, onClose, onSave }: ValidatePokjaDrawerProps) {
  const isReadOnly = pokja.status !== "masih-diverifikasi"
  
  const members = pokja.data?.members
  const roleKeys = ALL_ROLES.map(r => r.key)
  
  const [memberStates, setMemberStates] = useState<Record<string, MemberState>>(() => {
    const init: Record<string, MemberState> = {}
    if (members) {
      roleKeys.forEach((key) => {
        const m = members[key as keyof typeof members]
        if (m && m.nama?.trim()) {
          init[key] = {
            action: "pending",
            alasan: "",
          }
        }
      })
    }
    return init
  })

  const [globalAlasan, setGlobalAlasan] = useState("")

  const setMemberState = (jabatan: string, s: MemberState) => {
    setMemberStates((prev) => ({ ...prev, [jabatan]: s }))
  }

  const approveAll = () => {
    const next: Record<string, MemberState> = {}
    Object.keys(memberStates).forEach((key) => {
      next[key] = { action: "approved", alasan: "" }
    })
    setMemberStates(next)
  }

  const declineAll = () => {
    const next: Record<string, MemberState> = {}
    Object.keys(memberStates).forEach((key) => {
      next[key] = { action: "declined", alasan: memberStates[key]?.alasan ?? "" }
    })
    setMemberStates(next)
  }

  const allDeclined = Object.values(memberStates).every(s => s.action === "declined")
  const allApproved = Object.values(memberStates).every(s => s.action === "approved")
  const anyDeclined = Object.values(memberStates).some(s => s.action === "declined")

  const handleSave = () => {
    const newPokja = { ...pokja }
    
    if (allApproved) {
      newPokja.status = "aktif"
    } else if (allDeclined) {
      newPokja.status = "ditolak"
    } else {
      newPokja.status = "aktif"
    }
    
    onSave(newPokja)
  }

  const statusCfg = STATUS_CONFIG[pokja.status]

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-900">{pokja.nama}</h2>
              <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {pokja.data?.region}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!isReadOnly && (
            <div className="flex gap-2">
              <button
                onClick={approveAll}
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
                Terima Semua
              </button>
              <button
                onClick={declineAll}
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-4 h-4 inline mr-1.5" />
                Tolak Semua
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">
                Daftar Anggota ({Object.keys(memberStates).length} anggota)
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {Object.entries(members as Record<string, { nama: string; email: string; noWhatsapp: string; instansi: string; jenisKelamin: string }>).map(([key, member]) => {
                if (!member || !member.nama?.trim()) return null
                
                const roleLabel = ALL_ROLES.find(r => r.key === key)?.label ?? key
                const state = memberStates[key] || { action: "pending" as MemberAction, alasan: "" }
                const isPending = state.action === "pending"
                const isApproved = state.action === "approved"
                const isDeclined = state.action === "declined"

                return (
                  <div key={key} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.nama}</p>
                          <p className="text-xs text-gray-500">{roleLabel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isApproved && <Badge variant="success" size="sm">Disetujui</Badge>}
                        {isDeclined && <Badge variant="error" size="sm">Ditolak</Badge>}
                        {isPending && <Badge variant="warning" size="sm">Menunggu</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs text-gray-600 pl-11">
                      {member.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.noWhatsapp && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{member.noWhatsapp}</span>
                        </div>
                      )}
                      {member.instansi && (
                        <div className="flex items-center gap-1 col-span-3 sm:col-span-1">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{member.instansi}</span>
                        </div>
                      )}
                    </div>

                    {!isReadOnly && (
                      <div className="pl-11 flex gap-2">
                        <button
                          onClick={() => setMemberState(key, { action: "approved", alasan: "" })}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Terima
                        </button>
                        <button
                          onClick={() => setMemberState(key, { action: "declined", alasan: state.alasan })}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isDeclined
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Tolak
                        </button>
                        {isDeclined && (
                          <input
                            type="text"
                            placeholder="Alasan penolakan..."
                            value={state.alasan}
                            onChange={(e) => setMemberState(key, { ...state, alasan: e.target.value })}
                            className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {!isReadOnly && anyDeclined && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Alasan Penolakan (Opsional)</span>
              </div>
              <textarea
                value={globalAlasan}
                onChange={(e) => setGlobalAlasan(e.target.value)}
                placeholder="Masukkan alasan penolakan..."
                className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={2}
              />
            </div>
          )}
        </div>

        {!isReadOnly && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Simpan Validasi
            </button>
          </div>
        )}
      </div>
    </>
  )
}