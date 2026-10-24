import React from 'react';
import Link from 'next/link';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#fffdf7] border-t border-[#ded8c8] py-14 text-sm text-[#4a4b44]">
      <div className="public-container space-y-10">
        {/* Top Grid: Brand + Navigation + Official Data Sources */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#e5dfd0]">
          {/* Col 1: Brand (Matched icon, size, color, and style with LandingHeader) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/#beranda" className="inline-flex items-center gap-3.5 group">
              <div className="w-9 h-10 text-[#67151d] flex items-center justify-center flex-shrink-0">
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
              <div>
                <div className="font-black tracking-tight text-[#1e221f] leading-none text-lg">
                  RADAR PANGAN
                </div>
                <span className="text-xs text-[#5c5b52] font-medium tracking-wide block mt-1">
                  Sistem Pemantauan Harga Pangan Nasional
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#4a4b44] leading-relaxed max-w-md">
              Platform informasi publik untuk memantau persebaran harga komoditas pangan pokok, membandingkan terhadap acuan pemerintah (HAP/HET), serta menyediakan saluran pelaporan harga pasar yang terverifikasi.
            </p>
          </div>

          {/* Col 2: Navigasi Halaman */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e221f]">
              Navigasi Utama
            </h3>
            <ul className="space-y-2.5 text-sm font-semibold text-[#2d312e]">
              <li>
                <Link href="/#beranda" className="hover:text-[#67151d] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#peta" className="hover:text-[#67151d] transition-colors">
                  Persebaran Harga Nasional
                </Link>
              </li>
              <li>
                <Link href="/harga" className="hover:text-[#67151d] transition-colors">
                  Detail Harga Wilayah
                </Link>
              </li>
              <li>
                <Link href="/lapor" className="hover:text-[#67151d] transition-colors">
                  Laporkan Harga Pasar
                </Link>
              </li>
              <li>
                <Link href="/metodologi" className="hover:text-[#67151d] transition-colors">
                  Metodologi &amp; Transparansi
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sumber Data & Atribusi */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e221f]">
              Rujukan Sumber Data Resmi
            </h3>
            <ul className="space-y-2 text-sm text-[#4a4b44]">
              <li>
                <a
                  href="https://panelharga.badanpangan.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#67151d] hover:underline font-medium"
                >
                  Badan Pangan Nasional (Panel Harga &amp; HAP/HET) &#8599;
                </a>
              </li>
              <li>
                <a
                  href="https://www.bi.go.id/hargapangan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#67151d] hover:underline font-medium"
                >
                  Bank Indonesia (PIHPS Nasional) &#8599;
                </a>
              </li>
              <li>
                <a
                  href="https://jabar.bps.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#67151d] hover:underline font-medium"
                >
                  Badan Pusat Statistik (Indikator UMK &amp; Konsumsi) &#8599;
                </a>
              </li>
              <li>
                <a
                  href="https://tanahair.indonesia.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#67151d] hover:underline font-medium"
                >
                  BIG &amp; Kemendagri (Geometri Batas Wilayah) &#8599;
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution & Privacy Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-[#5c5b52]">
          <div>
            &copy; 2026 Radar Pangan. Lisensi Data Terbuka CC BY-NC 4.0 &bull; Kebijakan Privasi Pelapor Dilindungi (Tanpa Identitas Pribadi Publik).
          </div>
          <div className="font-mono text-xs text-[#5c5b52]">
            Observasi Data Sampel: 23 Oktober 2026
          </div>
        </div>
      </div>
    </footer>
  );
};
