"use client"

import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function SumberDukunganPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingNavbar />
      <div className="pt-16">
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Sumber Dukungan</h1>
            <p className="mt-2 text-blue-200 text-base max-w-xl">
              Dokumen panduan dan informasi pendukung untuk pembentukan Kelompok Kerja 
              Budaya Sekolah Aman dan Nyaman.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://cerdasberkarakter.kemendikdasmen.go.id/budayasekolahamannyaman/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                  <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">Website Cerdas Berkarakter</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Portal resmi program Budaya Sekolah Aman dan Nyaman dari Kementerian Pendidikan Dasar dan Menengah.
                  </p>
                  <span className="text-xs text-blue-600 mt-2 inline-block font-medium flex items-center gap-1">
                    Kunjugi website 
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Pedoman Pembentukan</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Panduan lengkap pembentukan Kelompok Kerja BSAN di tingkat Provinsi dan Kabupaten/Kota.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Template SK</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Contoh Surat Keputusan pembentukan Kelompok Kerja yang dapat disesuaikan.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.125 2.485C11.34 10.4 10 11.253 10 12.5c0 1.517 1.611 2.622 3.322 2.265.858-.179 1.678-.608 2.264-1.342" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">FAQ</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Pertanyaan yang sering diajukan mengenai BSAN.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Butuh bantuan?</h3>
            <p className="text-sm text-blue-700">
              Untuk pertanyaan lebih lanjut mengenai pembentukan Kelompok Kerja BSAN, silakan hubungi 
              Sekretariat Direktorat Jenderal Pendidikan Dasar dan Menengah melalui emailatau telepon resmi.
            </p>
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  )
}