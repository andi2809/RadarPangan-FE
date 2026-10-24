'use client';

import React from 'react';
import Link from 'next/link';

export const CtaSection: React.FC = () => {
  return (
    <section className="cta-section py-16 bg-[#f8f4e9]">
      <div className="container">
        <div className="cta-card bg-[#fffdf7] border border-[#ded8c8] rounded-2xl p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="eyebrow text-xs font-mono font-bold uppercase tracking-wider text-[#67151d] block mb-2">
              Transparansi Pangan Publik
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1e221f] tracking-tight">
              Pantau Harga Pasar Daerahmu Secara Terbuka.
            </h2>
            <p className="text-sm text-[#68685e] mt-2 leading-relaxed">
              Ketahui disparitas harga bahan pokok di 27 kabupaten/kota Jawa Barat atau laporkan harga belanjaan di pasar terdekatmu hari ini.
            </p>
          </div>

          <div className="cta-actions flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              href="/harga"
              className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs shadow-md transition-all text-center"
            >
              <span>Jelajahi Detail Pasar</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/lapor"
              className="btn w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-[#fffdf7] hover:bg-[#f0ebde] text-[#1e221f] border border-[#ded8c8] font-bold text-xs shadow-sm transition-all text-center"
            >
              <span>Laporkan Harga Belanjaan</span>
            </Link>
            <Link
              href="/login"
              className="btn w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-[#2e070c] hover:bg-[#4c0d15] text-[#f4e8e9] font-bold text-xs shadow-sm transition-all text-center"
            >
              <span>Portal Masuk Stakeholder</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
