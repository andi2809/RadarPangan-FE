'use client';

import React from 'react';
import Link from 'next/link';

export const CrowdsourceSection: React.FC = () => {
  return (
    <section className="section users-section py-14 bg-[#fffdf7] border-b border-[#ded8c8]" id="validasi">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <span className="section-label inline-block px-3 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
            Satu Ekosistem
          </span>
          <h2 className="section-heading text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Satu Sistem, Dua Pengguna.<br />Satu Tujuan: Pangan Stabil.
          </h2>
          <p className="section-desc text-sm sm:text-base text-[#68685e] mt-1.5 leading-relaxed">
            TPID dan Satgas Pangan mendapatkan analisis geospasial mendalam. Warga dan pedagang mendapatkan akses pelaporan harga belanjaan secara terbuka.
          </p>
        </div>

        <div className="users-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User 1: Desktop / Laptop Mockup (Col 4) */}
          <article className="user-product lg:col-span-4 bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm">
            <div className="device mb-4">
              <div className="device-screen bg-[#2e070c] rounded-lg p-3 text-white border border-[#4c0d15] shadow-inner">
                <div className="device-top flex items-center justify-between text-[10px] font-mono pb-2 mb-2 border-b border-[#4c0d15]">
                  <span className="font-bold text-[#f4e8e9]">RADAR PANGAN</span>
                  <span className="text-[#4b9d73] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4b9d73] animate-ping" />
                    <span>Live Console</span>
                  </span>
                </div>
                <div className="mock-dashboard grid grid-cols-4 gap-2">
                  <div className="mock-sidebar col-span-1 bg-[#3d0a11] rounded p-1.5 space-y-1">
                    <div className="h-1.5 bg-[#67151d] rounded w-full" />
                    <div className="h-1.5 bg-[#67151d] rounded w-3/4" />
                    <div className="h-1.5 bg-[#67151d] rounded w-5/6" />
                  </div>
                  <div className="mock-main col-span-3 space-y-2">
                    <div className="mock-map bg-[#4c0d15] rounded p-2 flex items-center justify-center">
                      <svg viewBox="0 0 100 60" className="w-full h-12">
                        <path d="M10 15 25 11 38 19 35 31 45 38 36 51 20 55 12 39Z" fill="#e5bd60" />
                        <path d="M46 32 61 30 74 33 86 30 80 45 58 49 43 48Z" fill="#4e9a71" />
                        <path d="M35 34 48 36 64 34 76 40" stroke="#bb514d" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                      </svg>
                    </div>
                    <div className="mock-stat flex items-center justify-between bg-[#3d0a11] p-1.5 rounded text-[9px] font-mono">
                      <span className="text-[#e3c2c0]">Kesesuaian HAP</span>
                      <strong className="text-white font-bold">68,4%</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="laptop-base h-2 bg-[#d1c8b8] rounded-b-lg mx-auto w-3/4 border-t border-[#beb4a2]" />
            </div>
            <h3 className="text-base font-bold text-[#1e221f] mb-1">Dashboard Analitik TPID</h3>
            <p className="text-xs text-[#68685e] leading-relaxed">
              Analisis tren H+7, disparitas spasial, dan rekomendasi intervensi pasar untuk Satgas Pangan &amp; TPID.
            </p>
          </article>

          {/* User 2: Mobile Phone Mockup (Col 3) */}
          <article className="user-product lg:col-span-3 bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm">
            <div className="phone max-w-[210px] mx-auto bg-[#1e221f] p-2.5 rounded-[24px] border-2 border-[#ded8c8] shadow-lg mb-4">
              <div className="phone-screen bg-[#fffdf7] rounded-[18px] p-3 text-[#1e221f] space-y-2">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-[#67151d] pb-1 border-b border-[#ded8c8]">
                  <span className="w-2 h-2 rounded-full bg-[#67151d]" />
                  <span>RADAR PANGAN</span>
                </div>
                <div className="text-[11px] font-extrabold text-[#1e221f]">Lapor Harga Pasar</div>
                <div className="phone-field bg-[#f0ebde] p-1.5 rounded text-[10px] text-[#1e221f] font-mono">
                  Cabai Rawit Merah ▾
                </div>
                <div className="phone-field bg-[#f0ebde] p-1.5 rounded text-[10px] text-[#1e221f] font-mono">
                  Pasar Ciroyom ▾
                </div>
                <div className="phone-field bg-[#f0ebde] p-1.5 rounded text-[10px] font-mono font-bold text-[#67151d]">
                  Rp 54.000 / kg
                </div>
                <div className="text-[9px] text-[#4b9d73] font-mono flex items-center gap-1">
                  <span>●</span> <span>GPS: Aktif (-6.9175)</span>
                </div>
                <Link
                  href="/lapor"
                  className="phone-submit block w-full py-1.5 rounded bg-[#67151d] text-white text-center font-bold text-[10px] hover:bg-[#4c0d15] transition-colors"
                >
                  Buka Form Lapor
                </Link>
              </div>
            </div>
            <h3 className="text-base font-bold text-[#1e221f] mb-1">Lapor Mandiri Warga</h3>
            <p className="text-xs text-[#68685e] leading-relaxed">
              Kirim laporan harga belanja pasar langsung dari ponsel, otomatis terbit kode tiket audit.
            </p>
          </article>

          {/* Validation Process Card (Col 5) */}
          <aside className="validation-card lg:col-span-5 bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#1e221f] pb-2 border-b border-[#ded8c8]">
              Alur Konsensus Kuorum Laporan
            </h3>

            {/* Step 1 */}
            <div className="validation-step flex items-start gap-3.5">
              <div className="step-num w-7 h-7 rounded-full bg-[#67151d] text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-sm font-bold text-[#1e221f] block mb-0.5">
                  Geotagging Radius GPS (&le; 3 km)
                </strong>
                <p className="text-xs text-[#68685e] leading-relaxed">
                  Jarak pelapor otomatis diverifikasi terhadap koordinat pasar rakyat terdaftar untuk mencegah manipulasi lokasi.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="validation-step flex items-start gap-3.5">
              <div className="step-num w-7 h-7 rounded-full bg-[#67151d] text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-sm font-bold text-[#1e221f] block mb-0.5">
                  Konsensus Kuorum &ge; 10 Laporan
                </strong>
                <p className="text-xs text-[#68685e] leading-relaxed">
                  Data harga baru dinyatakan valid setelah tercapai minimal 10 laporan independen dalam jendela 24 jam di pasar yang sama.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="validation-step flex items-start gap-3.5">
              <div className="step-num w-7 h-7 rounded-full bg-[#67151d] text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-sm font-bold text-[#1e221f] block mb-0.5">
                  Filter Deviasi Ekstrem (MAD)
                </strong>
                <p className="text-xs text-[#68685e] leading-relaxed">
                  Penyaringan matematis Median Absolute Deviation untuk membuang anomali harga ekstrem atau upaya manipulasi spekulan.
                </p>
              </div>
            </div>

            {/* Verification Note Badge */}
            <div className="validation-note p-3 rounded-lg bg-[#e0f0e2] border border-[#badfc4] text-xs text-[#1e221f] flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#4b9d73] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="leading-snug">
                Laporan warga diverifikasi algoritma kuorum konsensus sebelum dipublikasikan ke radar harga publik.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
