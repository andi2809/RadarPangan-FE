'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fffdf7]/95 backdrop-blur-md border-b border-[#ded8c8]">
      <nav className="public-container flex items-center justify-between h-20 gap-3" aria-label="Navigasi Utama">
        {/* Brand Logo (Matched with Footer) */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 min-w-0">
          <div className="w-8 h-9 sm:w-9 sm:h-10 text-[#67151d] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <svg viewBox="0 0 32 38" width="32" height="38" aria-hidden="true">
              <path
                d="M16 2 20 8 16 13 12 8Z M7 11 12 16 9 22 4 17Z M25 11 28 17 23 22 20 16Z M12 18 16 13 20 18 19 26 16 30 13 26Z M4 23 11 26 13 32 7 30Z M28 23 21 26 19 32 25 30Z"
                fill="currentColor"
              />
              <path
                d="M16 30v6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-black tracking-tight text-[#1e221f] leading-none text-base sm:text-lg whitespace-nowrap">
              RADAR PANGAN
            </div>
            <span className="hidden sm:block text-[11px] text-[#5c5b52] font-medium tracking-wide mt-1 whitespace-nowrap">
              Sistem Pemantauan Harga Pangan Nasional
            </span>
            <span className="block sm:hidden text-[10px] text-[#5c5b52] font-medium mt-0.5 truncate">
              Pemantauan Harga Pangan
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden xl:flex items-center gap-4 2xl:gap-5 text-[13.5px] 2xl:text-sm font-semibold text-[#2d312e]">
          <Link href="/#beranda" className="hover:text-[#67151d] transition-colors whitespace-nowrap">
            Beranda
          </Link>
          <Link href="/#peta" className="hover:text-[#67151d] transition-colors whitespace-nowrap">
            Peta Wilayah
          </Link>
          <Link href="/#instrumen" className="hover:text-[#67151d] transition-colors whitespace-nowrap">
            Instrumen
          </Link>
          <Link href="/#sinergi" className="hover:text-[#67151d] transition-colors whitespace-nowrap">
            Distribusi &amp; Sinergi
          </Link>
          <Link href="/harga" className="hover:text-[#67151d] transition-colors whitespace-nowrap">
            Detail Harga
          </Link>
          <Link href="/metodologi" className="hover:text-[#67151d] transition-colors whitespace-nowrap">
            Metodologi
          </Link>
        </div>

        {/* Right CTA Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <Link
            href="/harga"
            className="hidden md:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#f0ebde] hover:bg-[#e5decb] text-[#1e221f] font-bold text-xs border border-[#cfc8b8] transition-colors whitespace-nowrap"
          >
            <span>Jelajahi Peta Wilayah</span>
          </Link>
          <Link
            href="/lapor"
            className="hidden sm:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            <span>Laporkan Harga Pasar</span>
          </Link>

          {/* Mobile & Tablet Menu Button */}
          <button
            type="button"
            className="xl:hidden p-2.5 text-[#1e221f] rounded-xl border border-[#cfc8b8] bg-[#fffdf7] hover:bg-[#f0ebde] transition-colors flex-shrink-0"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#fffdf7] border-b border-[#ded8c8] px-4 pt-3 pb-6 shadow-lg">
          <div className="public-container flex flex-col space-y-1 text-base font-semibold text-[#1e221f]">
            <Link
              href="/#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Beranda
            </Link>
            <Link
              href="/#peta"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Persebaran Harga Nasional
            </Link>
            <Link
              href="/#instrumen"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Empat Instrumen Inti
            </Link>
            <Link
              href="/#sinergi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Distribusi &amp; Sinergi Kebijakan
            </Link>
            <Link
              href="/harga"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Detail Harga Wilayah
            </Link>
            <Link
              href="/lapor"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Lapor Harga Pasar
            </Link>
            <Link
              href="/metodologi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Metodologi &amp; Sumber Data
            </Link>

            <div className="pt-4 mt-2 border-t border-[#ded8c8] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/harga"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 px-4 rounded-xl bg-[#f0ebde] text-[#1e221f] font-bold text-sm border border-[#cfc8b8]"
              >
                Jelajahi Peta Wilayah
              </Link>
              <Link
                href="/lapor"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 px-4 rounded-xl bg-[#67151d] text-white font-bold text-sm"
              >
                Laporkan Harga Pasar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
