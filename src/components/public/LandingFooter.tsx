'use client';

import React from 'react';
import Link from 'next/link';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="footer bg-[#fffdf7] border-t border-[#ded8c8] py-12 text-xs text-[#68685e]">
      <div className="container space-y-8">
        <div className="footer-top flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#ded8c8]">
          {/* Brand */}
          <Link href="/#beranda" className="brand flex items-center gap-3">
            <div className="brand-mark w-7 h-8 text-[#67151d] flex-shrink-0">
              <svg viewBox="0 0 32 38" width="28" height="34" aria-hidden="true">
                <path
                  d="M16 2 20 8 16 13 12 8Z M7 11 12 16 9 22 4 17Z M25 11 28 17 23 22 20 16Z M12 18 16 13 20 18 19 26 16 30 13 26Z M4 23 11 26 13 32 7 30Z M28 23 21 26 19 32 25 30Z"
                  fill="currentColor"
                />
                <path
                  d="M16 30v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="brand-name font-black tracking-tight text-[#1e221f] leading-none text-sm">
                RADAR PANGAN
              </div>
              <span className="brand-tag text-[9px] text-[#68685e] font-mono tracking-wider block mt-0.5">
                Sistem Data Harga Pangan Nasional
              </span>
            </div>
          </Link>

          {/* Links */}
          <div className="footer-links flex flex-wrap items-center gap-6 font-semibold text-[#1e221f]">
            <Link href="/" className="hover:text-[#67151d] transition-colors">
              Beranda
            </Link>
            <Link href="/harga" className="hover:text-[#67151d] transition-colors">
              Peta &amp; Wilayah
            </Link>
            <Link href="/lapor" className="hover:text-[#67151d] transition-colors">
              Lapor Harga
            </Link>
            <Link href="/metodologi" className="hover:text-[#67151d] transition-colors">
              Metodologi
            </Link>
            <Link href="/login" className="text-[#67151d] hover:underline transition-colors font-bold">
              Portal TPID
            </Link>
          </div>

          <div className="small muted text-left md:text-right text-[11px] font-mono leading-relaxed">
            Transparansi Publik &bull; Open Data CC BY-NC 4.0<br />
            Sinkronisasi Harian Bapanas &amp; PIHPS BI
          </div>
        </div>

        <div className="footer-bottom flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#858174]">
          <span>&copy; 2026 Radar Pangan &bull; Sistem Data &amp; Peringatan Dini Ketahanan Pangan Nasional.</span>
          <span>Pembaruan resmi 24 Oktober 2026, 09:00 WIB &bull; Bebas spekulasi harga.</span>
        </div>
      </div>
    </footer>
  );
};
