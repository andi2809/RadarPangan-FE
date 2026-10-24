import React from 'react';
import Link from 'next/link';

export const CrowdsourceSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#fffdf7] border-b border-[#ded8c8]" id="validasi">
      <div className="public-container space-y-14">
        {/* Section Header (Badges "Satu Ekosistem" and "Live Console" removed) */}
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
            Satu Sistem, Dua Pengguna
          </h2>
          <p className="text-base sm:text-lg text-[#4a4b44] mt-3 leading-relaxed">
            Radar Pangan menyajikan antarmuka pemantauan analitik untuk pemerintah daerah atau analis, sekaligus menyediakan antarmuka pelaporan harga pasar yang praktis bagi masyarakat.
          </p>
        </div>

        {/* Two Interface Previews + Verification Mechanism */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Preview 1: Desktop Dashboard Interface (5 Cols) */}
          <article className="lg:col-span-5 bg-[#f8f4e9] border border-[#d6cebe] rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#67151d]">
                Antarmuka Desktop &bull; Pemerintah Daerah &amp; Analis
              </span>
              <h3 className="text-xl font-extrabold text-[#1e221f]">
                Dashboard Pemantauan Wilayah
              </h3>
              <p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
                Menampilkan perbandingan harga komoditas lintas kabupaten/kota, selisih terhadap acuan HAP/HET, serta tren historis untuk membantu evaluasi kondisi pasar.
              </p>
            </div>

            {/* Realistic Warm-Paper Desktop UI Preview (Consistent with Product Design) */}
            <div className="bg-[#fffdf7] border border-[#cfc8b8] rounded-xl overflow-hidden shadow-sm">
              {/* Browser Window Bar */}
              <div className="px-3.5 py-2.5 bg-[#f0ebde] border-b border-[#d6cebe] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e85b4f]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e69b39]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4b9d73]" />
                  <span className="ml-2 font-mono font-semibold text-[#1e221f]">
                    Radar Pangan — Konsol Wilayah
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#5c5b52] bg-[#fffdf7] px-2 py-0.5 rounded border border-[#d6cebe]">
                  Data Simulasi
                </span>
              </div>

              {/* Preview Content */}
              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e8e2d4]">
                  <div>
                    <span className="text-[#5c5b52] block">Komoditas Pantauan</span>
                    <strong className="text-sm font-extrabold text-[#1e221f]">
                      Cabai Rawit Merah (HAP Rp 45.000/kg)
                    </strong>
                  </div>
                  <span className="font-mono text-[#5c5b52]">27 Kab/Kota</span>
                </div>

                {/* Mini Region Comparison Table */}
                <div className="space-y-2 font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f4e9] border border-[#e5dfd0]">
                    <span className="font-sans font-bold text-[#1e221f]">Kota Bekasi</span>
                    <span className="text-[#1e221f] font-bold">Rp 53.700/kg</span>
                    <span className="px-2 py-0.5 rounded bg-[#f8ded8] text-[#991b1b] font-bold">
                      +19,3%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f4e9] border border-[#e5dfd0]">
                    <span className="font-sans font-bold text-[#1e221f]">Kota Bandung</span>
                    <span className="text-[#1e221f] font-bold">Rp 47.700/kg</span>
                    <span className="px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] font-bold">
                      +6,0%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f4e9] border border-[#e5dfd0]">
                    <span className="font-sans font-bold text-[#1e221f]">Kab. Garut</span>
                    <span className="text-[#1e221f] font-bold">Rp 41.900/kg</span>
                    <span className="px-2 py-0.5 rounded bg-[#dcfce7] text-[#166534] font-bold">
                      -6,9%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Preview 2: Mobile Citizen Reporting Interface (3 Cols) */}
          <article className="lg:col-span-3 bg-[#f8f4e9] border border-[#d6cebe] rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#67151d]">
                Antarmuka Mobile &bull; Warga
              </span>
              <h3 className="text-xl font-extrabold text-[#1e221f]">
                Pelaporan Harga Pasar
              </h3>
              <p className="text-sm text-[#4a4b44] leading-relaxed">
                Memudahkan warga mengirimkan informasi harga eceran yang ditemui di pasar lokal.
              </p>
            </div>

            {/* Proportional Mobile Device Preview */}
            <div className="w-full max-w-[260px] mx-auto bg-[#24231f] p-2.5 rounded-[26px] border border-[#cfc8b8] shadow-md">
              <div className="bg-[#fffdf7] rounded-[20px] p-4 text-[#1e221f] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#e5dfd0] text-xs">
                  <span className="font-black text-[#67151d] tracking-tight">RADAR PANGAN</span>
                  <span className="font-mono text-[11px] text-[#5c5b52]">Form Warga</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#5c5b52] block mb-0.5">Komoditas</span>
                    <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f4e9] border border-[#d6cebe] font-bold text-[#1e221f]">
                      Cabai Rawit Merah
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5c5b52] block mb-0.5">Lokasi Pasar</span>
                    <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f4e9] border border-[#d6cebe] font-semibold text-[#1e221f]">
                      Pasar Ciroyom, Bandung
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5c5b52] block mb-0.5">Harga Temuan</span>
                    <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f4e9] border border-[#d6cebe] font-mono font-bold text-[#67151d]">
                      Rp 48.000 / kg
                    </div>
                  </div>
                </div>

                <Link
                  href="/lapor"
                  className="block w-full py-2.5 px-3 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white text-center font-bold text-xs transition-colors"
                >
                  Buka Halaman Lapor Harga
                </Link>
              </div>
            </div>
          </article>

          {/* Column 3: Plain-Language Explanation of Report Verification (4 Cols) */}
          <aside className="lg:col-span-4 bg-[#f0ebde] border border-[#d6cebe] rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="pb-4 border-b border-[#cfc8b8]">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                Bagaimana Laporan Warga Diperiksa?
              </h3>
              <p className="text-sm text-[#4a4b44] mt-1.5 leading-relaxed">
                Setiap laporan harga dari masyarakat melewati aturan pemeriksaan bertahap agar informasi tetap wajar dan dapat dipercaya:
              </p>
            </div>

            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-base font-extrabold text-[#1e221f] block mb-1">
                    1. Lokasi Diperiksa
                  </strong>
                  <p className="text-sm text-[#4a4b44] leading-relaxed">
                    Sistem memeriksa kesesuaian lokasi laporan dengan area pasar yang dipilih (menggunakan aturan jarak koordinat maksimal 3 km dari titik pasar).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-base font-extrabold text-[#1e221f] block mb-1">
                    2. Laporan Dibandingkan
                  </strong>
                  <p className="text-sm text-[#4a4b44] leading-relaxed">
                    Laporan dari warga lain pada pasar dan periode waktu yang sama digunakan sebagai pembanding (dengan ketentuan minimal 10 laporan independen).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-base font-extrabold text-[#1e221f] block mb-1">
                    3. Harga Tidak Wajar Diperiksa
                  </strong>
                  <p className="text-sm text-[#4a4b44] leading-relaxed">
                    Laporan yang berbeda jauh dari laporan lain (misalnya melampaui batas toleransi deviasi 10%) dapat ditandai untuk diperiksa lebih lanjut sebelum ditampilkan.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#fffdf7] border border-[#d6cebe] text-xs sm:text-sm text-[#4a4b44] leading-relaxed">
              Status pemeriksaan setiap laporan dapat ditinjau menggunakan kode tiket pada halaman{' '}
              <Link href="/lapor" className="font-bold text-[#67151d] underline">
                Lapor Harga Pasar
              </Link>
              .
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
