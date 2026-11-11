'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (typeof window !== 'undefined') {
      const isHome = window.location.pathname === '/' || window.location.pathname === '';
      if (isHome) {
        e.preventDefault();
        const el = document.getElementById(targetId);
        if (el) {
          const headerOffset = 84;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
          });
          window.history.replaceState(null, '', `#${targetId}`);
        } else if (targetId === 'beranda') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          window.history.replaceState(null, '', '#beranda');
        }
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'border-[#cfc8b8] shadow-[0_4px_20px_rgba(30,34,31,0.07)]'
          : 'border-[#ded8c8]'
      }`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? 'rgba(255, 253, 247, 0.98)' : 'rgba(255, 253, 247, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
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
            <span className="hidden lg:block text-[11px] text-[#5c5b52] font-medium tracking-wide mt-1 whitespace-nowrap">
              Sistem Pemantauan Harga Pangan Nasional
            </span>
            <span className="block lg:hidden text-[10px] text-[#5c5b52] font-medium mt-0.5 truncate">
              Pemantauan Harga Pangan
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Hanya: Beranda, Metodologi, Peta Wilayah) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-[13px] lg:text-[14px] font-semibold text-[#2d312e]">
          <Link
            href="/#beranda"
            onClick={(e) => scrollToAnchor(e, 'beranda')}
            className="hover:text-[#67151d] transition-colors whitespace-nowrap"
          >
            Beranda
          </Link>
          <Link href="/metodologi" className="hover:text-[#67151d] transition-colors whitespace-nowrap">
            Metodologi
          </Link>
          <Link
            href="/#peta"
            onClick={(e) => scrollToAnchor(e, 'peta')}
            className="hover:text-[#67151d] transition-colors whitespace-nowrap"
          >
            Peta Wilayah
          </Link>
        </div>

        {/* Right CTA Button (Laporkan Harga Pasar) & Mobile Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/lapor"
            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] py-2.5 px-3.5 sm:px-4 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">Lapor</span>
            <span className="hidden sm:inline">Laporkan Harga Pasar</span>
          </Link>

          {/* Mobile & Tablet Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-[#1e221f] rounded-xl border border-[#cfc8b8] bg-[#fffdf7] hover:bg-[#f0ebde] transition-colors flex-shrink-0"
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
        <div className="md:hidden bg-[#fffdf7] border-b border-[#ded8c8] px-4 pt-3 pb-6 shadow-lg">
          <div className="public-container flex flex-col space-y-1 text-base font-semibold text-[#1e221f]">
            <Link
              href="/#beranda"
              onClick={(e) => {
                scrollToAnchor(e, 'beranda');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Beranda
            </Link>
            <Link
              href="/metodologi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Metodologi
            </Link>
            <Link
              href="/#peta"
              onClick={(e) => {
                scrollToAnchor(e, 'peta');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-lg hover:bg-[#f0ebde] hover:text-[#67151d]"
            >
              Peta Wilayah
            </Link>

            <div className="pt-4 mt-2 border-t border-[#ded8c8]">
              <Link
                href="/lapor"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-3 px-4 rounded-xl bg-[#67151d] text-white font-bold text-sm shadow-sm"
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
