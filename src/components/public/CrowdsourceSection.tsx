import React from 'react';
import Link from 'next/link';

export const CrowdsourceSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#fffdf7] border-b border-[#ded8c8]" id="lapor-warga">
      <div className="public-container space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#67151d] px-3 py-1 rounded-md bg-[#f8f4e9] border border-[#d6cebe] inline-block">
            Partisipasi Publik &amp; Transparansi Pasar
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
            Ruang Pelaporan Harga Warga &amp; Verifikasi Transparan
          </h2>
          <p className="text-base sm:text-lg text-[#4a4b44] leading-relaxed">
            Masyarakat dapat berpartisipasi melaporkan harga riil di pasar tradisional terdekat. Setiap laporan diperiksa secara bertahap melalui sistem konsensus agar data tetap akurat dan tidak dapat dimanipulasi.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Column 1: Mobile Reporting Preview & CTA Card (5 Cols) */}
          <article className="lg:col-span-5 bg-[#f8f4e9] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#67151d]">
                Formulir Partisipasi Masyarakat
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                Lapor Harga Pasar Tanpa Ribet
              </h3>
              <p className="text-sm text-[#4a4b44] leading-relaxed">
                Laporkan harga eceran yang Anda temui saat berbelanja di pasar lokal. Anda akan mendapatkan kode tiket pelacakan unik untuk memantau status pemeriksaan laporan Anda.
              </p>
            </div>

            {/* Mobile Device Mockup */}
            <div className="w-full max-w-[280px] mx-auto bg-[#24231f] p-3 rounded-[28px] border border-[#cfc8b8] shadow-lg">
              <div className="bg-[#fffdf7] rounded-[22px] p-4 text-[#1e221f] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e5dfd0]">
                  <span className="font-black text-[#67151d] tracking-tight">RADAR PANGAN</span>
                  <span className="font-mono text-[10px] text-[#5c5b52] bg-[#f0ebde] px-2 py-0.5 rounded">Form Warga</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[#5c5b52] block text-[11px] mb-0.5">Komoditas yang Dibeli</span>
                    <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f4e9] border border-[#d6cebe] font-bold text-[#1e221f]">
                      Cabai Rawit Merah
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5c5b52] block text-[11px] mb-0.5">Pasar Tradisional</span>
                    <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f4e9] border border-[#d6cebe] font-semibold text-[#1e221f]">
                      Pasar Kosambi, Kota Bandung
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5c5b52] block text-[11px] mb-0.5">Harga Aktual yang Ditemukan</span>
                    <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f4e9] border border-[#d6cebe] font-mono font-bold text-[#67151d]">
                      Rp 48.000 / kg
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    href="/lapor"
                    className="block w-full py-2.5 px-3 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white text-center font-bold text-xs transition-colors shadow-sm"
                  >
                    Buka Formulir Lapor Harga &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fffdf7] border border-[#d6cebe] text-xs text-[#5c5b52]">
              Laporan yang lolos pemeriksaan disajikan sebagai pembanding lapangan (<em>Dual-Source</em>) mendampingi data survei resmi pemerintah.
            </div>
          </article>

          {/* Column 2: 3-Stage Verification Rules (7 Cols) */}
          <aside className="lg:col-span-7 bg-[#f0ebde] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="pb-4 border-b border-[#cfc8b8] space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#166534] px-2.5 py-1 rounded bg-[#e0f0e2] inline-block">
                Sistem Pemeriksaan Bertingkat
              </span>
              <h3 className="text-2xl font-black text-[#1e221f]">
                Bagaimana Laporan Warga Diperiksa?
              </h3>
              <p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
                Untuk mencegah manipulasi harga, laporan palsu dari oknum spekulan, maupun kesalahan input, sistem menjalankan 3 saringan otomatis:
              </p>
            </div>

            <div className="space-y-4">
              {/* Saringan 1 */}
              <div className="p-4 rounded-xl bg-[#fffdf7] border border-[#d6cebe] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-base font-extrabold text-[#1e221f] block mb-1">
                    Saringan 1: Satu Perangkat Hanya Satu Suara &amp; Radius Pasar
                  </strong>
                  <p className="text-sm text-[#4a4b44] leading-relaxed">
                    Satu ponsel/perangkat dibatasi mengirim 1 suara per komoditas dalam periode aktif agar tidak terjadi spamming, dan titik koordinat diperiksa berada dalam radius maksimal 3 km dari pasar yang dipilih.
                  </p>
                </div>
              </div>

              {/* Saringan 2 */}
              <div className="p-4 rounded-xl bg-[#fffdf7] border border-[#d6cebe] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-base font-extrabold text-[#1e221f] block mb-1">
                    Saringan 2: Syarat Kuorum Minimal 10 Laporan Independen
                  </strong>
                  <p className="text-sm text-[#4a4b44] leading-relaxed">
                    Sebuah pasar baru dinyatakan mencapai konsensus awal jika terdapat minimal 10 laporan warga berbeda yang saling bersesuaian pada periode waktu yang sama.
                  </p>
                </div>
              </div>

              {/* Saringan 3 */}
              <div className="p-4 rounded-xl bg-[#fffdf7] border border-[#d6cebe] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-base font-extrabold text-[#1e221f] block mb-1">
                    Saringan 3: Pembuangan Harga Ekstrem (Outlier MAD)
                  </strong>
                  <p className="text-sm text-[#4a4b44] leading-relaxed">
                    Laporan yang menyimpang ekstrem (deviasi &gt; 10% dari nilai tengah median) otomatis ditandai sebagai anomali dan dibuang dari konsensus harga warga.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdf7] border border-[#d6cebe] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-[#4a4b44]">
                Sudah pernah mengirim laporan? Lacak status pemeriksaan tiket Anda:
              </span>
              <Link href="/lapor" className="font-bold text-[#67151d] hover:underline">
                Cek Nomor Tiket &rarr;
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
