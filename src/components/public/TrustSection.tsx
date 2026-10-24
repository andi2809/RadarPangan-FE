'use client';

import React from 'react';

export const TrustSection: React.FC = () => {
  return (
    <section className="trust-section py-14 bg-[#fffdf7] border-b border-[#ded8c8]">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <span className="section-label inline-block px-3 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
            Akuntabilitas
          </span>
          <h2 className="section-heading text-2xl sm:text-3xl font-black text-[#1e221f] tracking-tight">
            Setiap Peringatan Harus Bisa Ditelusuri.
          </h2>
        </div>

        <div className="trust-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Trust 1 */}
          <div className="trust-item bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#e0f0e2] text-[#4b9d73] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <strong className="text-sm font-bold text-[#1e221f] block mb-1">Transparansi Data</strong>
              <p className="text-xs text-[#68685e] leading-relaxed">
                Sumber data resmi, jadwal sinkronisasi, dan cakupan wilayah selalu dijelaskan secara terbuka tanpa klaim artifisial.
              </p>
            </div>
          </div>

          {/* Trust 2 */}
          <div className="trust-item bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#fef3c7] text-[#92400e] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <strong className="text-sm font-bold text-[#1e221f] block mb-1">Ketertelusuran</strong>
              <p className="text-xs text-[#68685e] leading-relaxed">
                Setiap titik pasar sampel dan waktu pengambilan data dapat diaudit secara riil oleh satgas pengawas pangan.
              </p>
            </div>
          </div>

          {/* Trust 3 */}
          <div className="trust-item bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#f4e8e9] text-[#67151d] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <strong className="text-sm font-bold text-[#1e221f] block mb-1">Penjelasan Ilmiah</strong>
              <p className="text-xs text-[#68685e] leading-relaxed">
                Deviasi harga mengacu pada regulasi HAP resmi Bapanas dan metode statistik peramalan ekonometrika yang teruji.
              </p>
            </div>
          </div>

          {/* Trust 4 */}
          <div className="trust-item bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8eadb] text-[#556942] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <strong className="text-sm font-bold text-[#1e221f] block mb-1">Partisipasi Warga</strong>
              <p className="text-xs text-[#68685e] leading-relaxed">
                Laporan masyarakat diverifikasi kuorum konsensus 10 warga sehingga kebal terhadap intervensi spekulatif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
