'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header sticky top-0 z-50 bg-[#fffdf7]/95 backdrop-blur-md border-b border-[#ded8c8]">
      <nav className="container flex items-center justify-between py-3.5" aria-label="Navigasi Utama">
        {/* Brand Logo */}
        <Link href="/" className="brand flex items-center gap-3">
          <div className="brand-mark w-8 h-9 text-[#67151d] flex-shrink-0">
            <svg viewBox="0 0 32 38" width="30" height="36" aria-hidden="true">
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
            <div className="brand-name font-black tracking-tight text-[#1e221f] leading-none text-base">
              RADAR PANGAN
            </div>
            <span className="brand-tag text-[10px] text-[#68685e] font-mono tracking-wider block mt-0.5">
              Sistem Data &amp; Peringatan Dini Pangan
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div
          className={`nav-links ${mobileMenuOpen ? 'open' : ''} flex items-center gap-6 text-[13px] font-semibold text-[#1e221f]`}
          id="navLinks"
        >
          <Link href="/#beranda" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#67151d] transition-colors">
            Beranda
          </Link>
          <Link href="/harga" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#67151d] transition-colors">
            Peta &amp; Harga
          </Link>
          <Link href="/#instrumen" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#67151d] transition-colors">
            Instrumen EWS
          </Link>
          <Link href="/#sinergi" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#67151d] transition-colors">
            Sinergi MBG
          </Link>
          <Link href="/lapor" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#67151d] transition-colors">
            Lapor Warga
          </Link>
          <Link href="/metodologi" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#67151d] transition-colors">
            Metodologi
          </Link>

          {/* Mobile Login Button */}
          <div className="md:hidden pt-4 border-t border-[#ded8c8] w-full">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary w-full text-center py-2.5 px-4 rounded-lg bg-[#67151d] text-white font-bold text-xs"
            >
              Masuk Portal Stakeholder TPID &rarr;
            </Link>
          </div>
        </div>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="nav-actions flex items-center gap-3">
          <Link
            href="/login"
            className="btn btn-primary hidden sm:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>Masuk Portal Stakeholder</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="menu-toggle md:hidden p-2 text-[#1e221f] rounded-lg border border-[#ded8c8] hover:bg-[#f0ebde]"
            id="menuToggle"
            aria-label="Buka menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
