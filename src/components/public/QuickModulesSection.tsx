'use client';

import React from 'react';
import Link from 'next/link';

export const QuickModulesSection: React.FC = () => {
  return (
    <section className="section py-12 bg-[#f8f4e9] border-b border-[#ded8c8]">
      <div className="container">
        <div className="quick-modules-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="card bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <span className="section-label inline-block px-2.5 py-0.5 rounded-full bg-[#f0ebde] text-[#67151d] text-[11px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
                Modul P02
              </span>
              <h3 className="text-lg font-bold text-[#1e221f] mb-1.5">Detail Harga Wilayah</h3>
              <p className="text-xs text-[#68685e] leading-relaxed mb-6">
                Grafik riwayat harian, rincian 27 kabupaten/kota sampel, dan perbandingan disparitas harga antarwilayah tetangga.
              </p>
            </div>
            <Link
              href="/harga"
              className="btn btn-primary inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#67151d] hover:bg-[#4c0d15] text-white text-xs font-bold transition-all text-center"
            >
              <span>Buka Peta &amp; Wilayah</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Module 2 */}
          <div className="card bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <span className="section-label inline-block px-2.5 py-0.5 rounded-full bg-[#f0ebde] text-[#67151d] text-[11px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
                Modul P03
              </span>
              <h3 className="text-lg font-bold text-[#1e221f] mb-1.5">Lapor Harga Pasar</h3>
              <p className="text-xs text-[#68685e] leading-relaxed mb-6">
                Kirimkan harga belanjaan komoditas Anda di pasar rakyat terdekat dan pantau status verifikasi kuorum dengan kode tiket pelapor.
              </p>
            </div>
            <Link
              href="/lapor"
              className="btn btn-primary inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#67151d] hover:bg-[#4c0d15] text-white text-xs font-bold transition-all text-center"
            >
              <span>Buat Laporan Warga</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Module 3 */}
          <div className="card bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <span className="section-label inline-block px-2.5 py-0.5 rounded-full bg-[#f0ebde] text-[#67151d] text-[11px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
                Modul P04
              </span>
              <h3 className="text-lg font-bold text-[#1e221f] mb-1.5">Metodologi &amp; Transparansi</h3>
              <p className="text-xs text-[#68685e] leading-relaxed mb-6">
                Pelajari sumber data resmi Bapanas &amp; BI, formula peramalan H+7, algoritma kuorum anti-spekulan, dan jadwal sinkronisasi harian.
              </p>
            </div>
            <Link
              href="/metodologi"
              className="btn inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#fffdf7] hover:bg-[#f0ebde] text-[#1e221f] border border-[#ded8c8] text-xs font-bold transition-all text-center"
            >
              <span>Baca Metodologi</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
