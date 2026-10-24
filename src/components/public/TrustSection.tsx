import React from 'react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-[#f8f4e9] border-b border-[#ded8c8]">
      <div className="public-container">
        <div className="max-w-3xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1e221f] tracking-tight leading-[1.18]">
            Prinsip Keterbukaan &amp; Ketertelusuran Informasi
          </h2>
          <p className="text-base text-[#4a4b44] mt-2 leading-relaxed">
            Setiap indikator harga, pembanding acuan, dan proyeksi statistik disajikan bersama sumber serta penjelasan metodologinya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#e0f0e2] text-[#2d6a4f] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-[#1e221f]">Transparansi Sumber</h3>
            <p className="text-sm text-[#4a4b44] leading-relaxed">
              Sumber data resmi, tanggal observasi, dan cakupan wilayah selalu dicantumkan secara jelas pada setiap tampilan.
            </p>
          </div>

          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#fef3c7] text-[#92400e] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-[#1e221f]">Kejelasan Periode Data</h3>
            <p className="text-sm text-[#4a4b44] leading-relaxed">
              Data historis hasil observasi dibedakan secara tegas dari angka proyeksi maupun contoh simulasi skenario.
            </p>
          </div>

          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#f4e8e9] text-[#67151d] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-[#1e221f]">Acuan Regulasi Resmi</h3>
            <p className="text-sm text-[#4a4b44] leading-relaxed">
              Perbandingan kewajaran harga mengacu pada standar Harga Acuan Penjualan (HAP) dan HET dari Badan Pangan Nasional.
            </p>
          </div>

          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#e8eadb] text-[#4a5d32] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-[#1e221f]">Pemeriksaan Berlapis</h3>
            <p className="text-sm text-[#4a4b44] leading-relaxed">
              Laporan warga melalui pemeriksaan lokasi, pembandingan antarlaporan, dan penyaringan nilai ekstrem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
