'use client';

import React from 'react';
import Link from 'next/link';

export default function MetodologiPage() {
  return (
    <div className="metodologi-page py-12 bg-[#f8f4e9]">
      <div className="container max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="section-label inline-block px-3 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider border border-[#ded8c8]">
            Transparansi Ilmiah &amp; Regulasi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Metodologi &amp; Formula EWS
          </h1>
          <p className="text-sm text-[#68685e] leading-relaxed">
            Dokumentasi terbuka mengenai perumusan Early Warning Score, metode peramalan H+7, ambang batas HAP/HET, dan mekanisme verifikasi data kuorum konsensus.
          </p>
        </div>

        {/* Section 1: EWS Formulation */}
        <article className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#ded8c8]">
            <span className="w-6 h-6 rounded-md bg-[#67151d] text-white font-mono font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg font-bold text-[#1e221f]">Formula Early Warning Score (EWS 0 - 100)</h2>
          </div>
          <p className="text-xs text-[#68685e] leading-relaxed">
            Indeks Kerawanan Pangan dihitung secara deterministik setiap pukul 06:00 WIB menggunakan kombinasi 4 variabel terbobot:
          </p>
          <div className="p-4 rounded-lg bg-[#f0ebde] border border-[#ded8c8] font-mono text-xs text-[#1e221f] space-y-2">
            <div className="font-bold text-[#67151d]">
              EWS_Score = (0.40 &times; DevHAP) + (0.25 &times; Volatil30d) + (0.20 &times; UMK_Burden) + (0.15 &times; DefisitStok)
            </div>
            <ul className="text-[11px] text-[#68685e] list-disc list-inside space-y-1 pt-2 border-t border-[#ded8c8]">
              <li><strong>DevHAP (Bobot 40%):</strong> Deviasi persentase harga aktual terhadap Harga Acuan Penjualan Bapanas.</li>
              <li><strong>Volatil30d (Bobot 25%):</strong> Koefisien variasi pergerakan harga 30 hari ke belakang.</li>
              <li><strong>UMK_Burden (Bobot 20%):</strong> Rasio pengeluaran keranjang belanja pangan terhadap UMK lokal.</li>
              <li><strong>DefisitStok (Bobot 15%):</strong> Neraca perkiraan pasokan logistik pangan kabupaten/kota.</li>
            </ul>
          </div>
        </article>

        {/* Section 2: Threshold & Classification */}
        <article className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#ded8c8]">
            <span className="w-6 h-6 rounded-md bg-[#67151d] text-white font-mono font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-lg font-bold text-[#1e221f]">Klasifikasi Status Semantik</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#e0f0e2] border border-[#badfc4] space-y-1">
              <strong className="text-[#4b9d73] font-bold block text-sm">AMAN (&le; 40)</strong>
              <p className="text-[#68685e] leading-relaxed">
                Harga berada dalam batas wajar (-5% s.d. +5% dari HAP). Pasokan mencukupi dan pasar stabil.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#fef3c7] border border-[#fde68a] space-y-1">
              <strong className="text-[#92400e] font-bold block text-sm">WASPADA (41 - 70)</strong>
              <p className="text-[#68685e] leading-relaxed">
                Terjadi deviasi harga +5% s.d. +10% dari HAP. TPID menyiapkan opsi intervensi cadangan.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#fee2e2] border border-[#fca5a5] space-y-1">
              <strong className="text-[#991b1b] font-bold block text-sm">KRITIS (&gt; 70)</strong>
              <p className="text-[#68685e] leading-relaxed">
                Lonjakan harga &gt;10% di atas HAP. Memicu rekomendasi Gerakan Pangan Murah (GPM) &amp; pasokan lintas daerah.
              </p>
            </div>
          </div>
        </article>

        {/* Section 3: Data Sources & Audit Schedule */}
        <article className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#ded8c8]">
            <span className="w-6 h-6 rounded-md bg-[#67151d] text-white font-mono font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold text-[#1e221f]">Sumber Data Terbuka &amp; Jadwal Sinkronisasi</h2>
          </div>
          <div className="space-y-3 text-xs leading-relaxed text-[#68685e]">
            <div className="p-3 rounded-lg bg-[#f8f4e9] border border-[#ded8c8]">
              <strong className="text-[#1e221f]">1. Bapanas (Badan Pangan Nasional):</strong>
              <p>Data harga produsen dan konsumen tingkat eceran ditarik otomatis setiap hari pukul 06:00 WIB.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#f8f4e9] border border-[#ded8c8]">
              <strong className="text-[#1e221f]">2. Bank Indonesia (PIHPS Nasional):</strong>
              <p>Data pasar tradisional sampel untuk validasi silang dan penghitungan indeks ekspektasi inflasi.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#f8f4e9] border border-[#ded8c8]">
              <strong className="text-[#1e221f]">3. BPS Jawa Barat:</strong>
              <p>Data Upah Minimum Kabupaten/Kota (UMK 2026) dan Survei Sosial Ekonomi Nasional (Susenas) konsumsi pangan.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
