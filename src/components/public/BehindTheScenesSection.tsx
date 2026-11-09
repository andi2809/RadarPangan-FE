import React from 'react';
import Link from 'next/link';

export const BehindTheScenesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#f0ebde] border-b border-[#ded8c8]" id="cara-kerja">
      <div className="public-container space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#67151d] px-3 py-1 rounded-md bg-[#f8f4e9] border border-[#d6cebe] inline-block">
            Tata Kelola &amp; Arsitektur Informasi
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
            Cara Kerja di Balik Layar: Protokol Dua Lensa
          </h2>
          <p className="text-base sm:text-lg text-[#4a4b44] leading-relaxed">
            Untuk menjaga stabilitas pasar sekaligus melindungi masyarakat, Radar Pangan memisahkan area keterbukaan publik dengan instrumen intervensi pemerintah daerah.
          </p>
        </div>

        {/* Dual-Lens Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Lensa 1: Area Publik (Masyarakat Umum) */}
          <article className="lg:col-span-6 bg-[#fffdf7] border-2 border-[#Badfc4] rounded-2xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#e0f0e2] text-[#166534] font-mono text-xs font-extrabold uppercase tracking-wider">
                  Lensa 1 &bull; Area Terbuka
                </span>
                <span className="text-2xl" aria-hidden="true">🌐</span>
              </div>
              <h3 className="text-2xl font-black text-[#1e221f]">
                Portal Publik Masyarakat &amp; UMKM
              </h3>
              <p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
                Dirancang khusus bagi warga, pedagang, dan pelaku usaha untuk mendapatkan informasi harga harian yang transparan dan dapat dipertanggungjawabkan:
              </p>
              <ul className="space-y-2.5 text-sm text-[#334155]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#166534] font-bold">✓</span>
                  <span><strong>Pantau Harga Resmi H0:</strong> Data harga pangan tingkat konsumen harian dari Badan Pangan Nasional (Bapanas).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#166534] font-bold">✓</span>
                  <span><strong>Transparansi Batas Wajar:</strong> Perbandingan langsung terhadap batas Harga Acuan Penjualan (HAP/HET).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#166534] font-bold">✓</span>
                  <span><strong>Beban Daya Beli UMK:</strong> Memahami dampak harga terhadap upah riil di 27 Kabupaten/Kota Jawa Barat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#166534] font-bold">✓</span>
                  <span><strong>Ruang Partisipasi Warga:</strong> Melaporkan harga pasar lokal dan memantau status pemeriksaan lewat nomor tiket.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f4e9] border border-[#e2dcd0] text-xs text-[#5c5b52] leading-relaxed">
              <strong className="text-[#1e221f] block mb-0.5">Komitmen Transparansi:</strong>
              Masyarakat memperoleh informasi yang jernih tanpa adanya angka spekulasi yang dapat membingungkan konsumen.
            </div>
          </article>

          {/* Lensa 2: Area Internal TPID (Protokol Anti-Panic Buying) */}
          <article className="lg:col-span-6 bg-[#fffdf7] border-2 border-[#f0bfb7] rounded-2xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-[#f8ded8] text-[#991b1b] font-mono text-xs font-extrabold uppercase tracking-wider">
                  Lensa 2 &bull; Akses Terproteksi
                </span>
                <span className="text-2xl" aria-hidden="true">🛡️</span>
              </div>
              <h3 className="text-2xl font-black text-[#1e221f]">
                Konsol Pengendalian Inflasi (TPID)
              </h3>
              <p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
                Mengapa proyeksi lonjakan 7 hari ke depan (H+7) dan simulator intervensi tidak dibuka bebas di halaman publik?
              </p>
              
              <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] space-y-2">
                <div className="font-bold text-[#991b1b] text-xs font-mono uppercase tracking-wide">
                  Protokol Anti-Panic Buying &amp; Anti-Spekulan:
                </div>
                <p className="text-xs sm:text-sm text-[#7f1d1d] leading-relaxed">
                  Jika proyeksi kenaikan harga disiarkan secara terbuka ke publik, hal tersebut berisiko memicu aksi borong warga (<em>panic buying</em>) dan penimbunan stok oleh spekulan. Oleh karena itu, instrumen prediktif dikunci khusus bagi Tim Pengendalian Inflasi Daerah (TPID) dan Satgas Pangan.
                </p>
              </div>

              <ul className="space-y-2.5 text-sm text-[#334155]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#991b1b] font-bold">🔒</span>
                  <span><strong>Peringatan Dini H+7:</strong> Mendeteksi potensi lonjakan sebelum terjadi di pasar fisik.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#991b1b] font-bold">🔒</span>
                  <span><strong>Smart Supply Matchmaker:</strong> Rekomendasi rute logistik dari daerah surplus panen ke daerah defisit.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#991b1b] font-bold">🔒</span>
                  <span><strong>Simulasi Kebijakan (What-If):</strong> Menghitung efektivitas subsidi angkut dan Operasi Pasar sebelum anggaran dicairkan.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-between py-3 px-4 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
              >
                <span>Akses Portal Instansi (TPID &amp; Satgas Pangan)</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
