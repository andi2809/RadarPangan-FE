'use client';

import React from 'react';
import Link from 'next/link';

export const CtaSection: React.FC = () => {
  const handleScrollToPeta = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      const isHome = window.location.pathname === '/' || window.location.pathname === '';
      if (isHome) {
        e.preventDefault();
        const el = document.getElementById('peta');
        if (el) {
          const headerOffset = 84;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
          });
          window.history.replaceState(null, '', '#peta');
        }
      }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#f8f4e9]">
      <div className="public-container">
        <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-8 sm:p-10 lg:p-14 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#67151d] block">
              Akses Informasi &amp; Partisipasi Publik
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
              Telusuri Harga Pangan di Wilayahmu atau Laporkan Temuan Harga Pasar.
            </h2>
            <p className="text-base sm:text-lg text-[#4a4b44] leading-relaxed">
              Bandingkan perkembangan harga bahan pokok terhadap acuan pemerintah di berbagai kabupaten/kota, atau berkontribusi melaporkan harga eceran di pasar terdekat.
            </p>
          </div>

          {/* Only Public CTAs ("Portal Masuk Stakeholder" removed) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-shrink-0">
            <Link
              href="/#peta"
              onClick={handleScrollToPeta}
              className="inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-base shadow-sm transition-all text-center"
            >
              <span>Jelajahi Peta Wilayah</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </Link>
            <Link
              href="/lapor"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] text-[#1e221f] border border-[#bfb7a6] font-bold text-base transition-all text-center"
            >
              <span>Laporkan Harga Pasar</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
