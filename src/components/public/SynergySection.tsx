import React from 'react';
import Link from 'next/link';

export const SynergySection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#f0ebde] border-b border-[#ded8c8]" id="sinergi">
      <div className="public-container space-y-20">
        {/* =======================================================
            PART 1 (SECTION F): DISTRIBUSI YANG LEBIH CERDAS
            ======================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Narrative Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
                Distribusi yang Lebih Cerdas
              </h2>
              <p className="text-base sm:text-lg text-[#4a4b44] mt-3 leading-relaxed">
                Radar Pangan dapat menjadi alat bantu informasi untuk membandingkan harga antarwilayah, ketersediaan pasokan, kebutuhan daerah, jarak tempuh, dan kelayakan distribusi guna melengkapi perencanaan kerja sama yang sudah berjalan.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-[#d6cebe]">
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-lg bg-[#67151d] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#1e221f]">
                    Menghubungkan Daerah Penghasil dan Daerah yang Membutuhkan
                  </h3>
                  <p className="text-sm text-[#4a4b44] mt-1 leading-relaxed">
                    Memetakan perbedaan harga dan estimasi neraca ketersediaan antara wilayah sentra produksi dengan wilayah yang memerlukan pasokan tambahan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-lg bg-[#67151d] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#1e221f]">
                    Membantu Perencanaan Distribusi Antarwilayah
                  </h3>
                  <p className="text-sm text-[#4a4b44] mt-1 leading-relaxed">
                    Menyajikan perbandingan jarak antardaerah, volume kebutuhan, dan selisih harga sebagai bahan pertimbangan awal koordinasi distribusi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-lg bg-[#67151d] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#1e221f]">
                    Melengkapi Informasi untuk Pengambilan Keputusan
                  </h3>
                  <p className="text-sm text-[#4a4b44] mt-1 leading-relaxed">
                    Indikator rute dan volume disajikan sebagai bahan analisis pendukung, bukan keputusan otomatis yang menggantikan verifikasi lapangan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Route & Corridor Diagram (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#e5dfd0]">
                <div>
                  <h3 className="text-lg font-extrabold text-[#1e221f]">
                    Alur Perbandingan Pasokan Antarwilayah
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c5b52]">
                    Komoditas: Cabai Rawit Merah &bull; Acuan HAP Rp 45.000/kg
                  </p>
                </div>
                <span className="px-3 py-1 rounded-md bg-[#f8f4e9] border border-[#d6cebe] text-xs font-mono font-bold text-[#67151d]">
                  Contoh Simulasi Data
                </span>
              </div>

              {/* Origin -> Route -> Destination Visual */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* Origin Node: Surplus */}
                <div className="md:col-span-4 bg-[#e0f0e2]/70 border-2 border-[#4b9d73] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-[#166534]">
                      Daerah Penghasil
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4b9d73]" />
                  </div>
                  <div className="text-lg font-black text-[#1e221f]">Kab. Garut</div>
                  <div className="pt-2 border-t border-[#badfc4] space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#4a4b44]">Harga Pasar:</span>
                      <strong className="font-mono tabular-nums text-[#166534]">Rp 41.900/kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4a4b44]">Selisih thd. HAP:</span>
                      <strong className="font-mono tabular-nums text-[#166534]">-6,9%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4a4b44]">Potensi Surplus:</span>
                      <strong className="font-mono tabular-nums text-[#1e221f]">+12 Ton (Simulasi)</strong>
                    </div>
                  </div>
                </div>

                {/* Route Connector */}
                <div className="md:col-span-3 flex flex-col items-center justify-center py-2 px-1 text-center">
                  <div className="text-xs font-mono font-bold text-[#67151d] mb-1">
                    Rute Darat ~185 km
                  </div>
                  <svg
                    viewBox="0 0 140 36"
                    className="w-full max-w-[140px] h-9 hidden md:block"
                    aria-hidden="true"
                  >
                    <line
                      x1="6"
                      y1="18"
                      x2="122"
                      y2="18"
                      stroke="#67151d"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <circle cx="8" cy="18" r="4" fill="#4b9d73" />
                    <path
                      d="M116 11 L130 18 L116 25"
                      fill="none"
                      stroke="#67151d"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-1 px-2.5 py-1 rounded bg-[#f4e8e9] border border-[#dfc7b8] text-xs font-mono font-bold text-[#67151d]">
                    Alokasi: 8 Ton (Simulasi)
                  </div>
                </div>

                {/* Destination Node: Deficit */}
                <div className="md:col-span-4 bg-[#f8ded8]/70 border-2 border-[#e85b4f] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-[#991b1b]">
                      Daerah Membutuhkan
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e85b4f]" />
                  </div>
                  <div className="text-lg font-black text-[#1e221f]">Kota Bekasi</div>
                  <div className="pt-2 border-t border-[#f0bfb7] space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#4a4b44]">Harga Pasar:</span>
                      <strong className="font-mono tabular-nums text-[#991b1b]">Rp 53.700/kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4a4b44]">Selisih thd. HAP:</span>
                      <strong className="font-mono tabular-nums text-[#991b1b]">+19,3%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4a4b44]">Estimasi Kebutuhan:</span>
                      <strong className="font-mono tabular-nums text-[#1e221f]">8 Ton (Simulasi)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytical Explanation Box */}
              <div className="p-4 rounded-xl bg-[#f8f4e9] border border-[#e2dcd0] text-sm text-[#4a4b44] leading-relaxed">
                <strong className="text-[#1e221f] font-bold block mb-1">
                  Catatan Informasi Pendukung Keputusan:
                </strong>
                Selisih harga sebesar <span className="font-mono font-bold text-[#1e221f]">Rp 11.800/kg</span> antara Kab. Garut dan Kota Bekasi menunjukkan potensi kerja sama pasokan antardaerah. Angka volume pasokan dan kebutuhan di atas merupakan simulasi perencanaan; keputusan realisasi distribusi tetap ditentukan oleh koordinasi instansi berwenang dan pelaku pasar.
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            PART 2 (SECTION G): SINERGI KEBIJAKAN PANGAN NASIONAL
            ======================================================= */}
        <div className="pt-16 border-t border-[#cfc8b8]">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
              Sinergi Kebijakan Pangan Nasional
            </h2>
            <p className="text-base sm:text-lg text-[#4a4b44] mt-3 leading-relaxed">
              Informasi perkembangan harga dan pasokan wilayah disusun untuk mendukung koordinasi pemantauan daerah, pelaksanaan program stabilisasi harga, serta evaluasi kebijakan secara terbuka.
            </p>
          </div>

          {/* Editorial 3-Pillar Layout (No generic identical cards) */}
          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl divide-y lg:divide-y-0 lg:divide-x divide-[#e2dcd0] grid grid-cols-1 lg:grid-cols-3 overflow-hidden shadow-sm">
            {/* Pillar 1 */}
            <article className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#67151d] px-2.5 py-1 rounded bg-[#f4e8e9]">
                    Pemantauan Daerah
                  </span>
                  <span className="font-mono text-lg font-black text-[#67151d]">01</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#1e221f]">
                  TPID dan Pemerintah Daerah
                </h3>
                <p className="text-base text-[#4a4b44] leading-relaxed">
                  Membantu memantau perkembangan harga dan mengidentifikasi wilayah yang membutuhkan perhatian lebih awal berdasarkan perbandingan terhadap harga acuan.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8e2d4] text-xs sm:text-sm text-[#5c5b52] flex items-center justify-between">
                <span>Fokus: 27 Kab/Kota &amp; Provinsi</span>
                <a href="#peta" className="font-bold text-[#67151d] hover:underline">
                  Peta Wilayah &rarr;
                </a>
              </div>
            </article>

            {/* Pillar 2 */}
            <article className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#92400e] px-2.5 py-1 rounded bg-[#fef3c7]">
                    Stabilisasi Pasokan
                  </span>
                  <span className="font-mono text-lg font-black text-[#92400e]">02</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#1e221f]">
                  Gerakan Pangan Murah dan Kerja Sama Antarwilayah
                </h3>
                <p className="text-base text-[#4a4b44] leading-relaxed">
                  Menyediakan informasi pendukung untuk menentukan wilayah prioritas dan mengevaluasi pilihan distribusi dari daerah penghasil ke daerah konsumen.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8e2d4] text-xs sm:text-sm text-[#5c5b52] flex items-center justify-between">
                <span>Fokus: Prioritas Wilayah &amp; Rute</span>
                <Link href="/harga" className="font-bold text-[#67151d] hover:underline">
                  Perbandingan Wilayah &rarr;
                </Link>
              </div>
            </article>

            {/* Pillar 3 */}
            <article className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#166534] px-2.5 py-1 rounded bg-[#dcfce7]">
                    Akuntabilitas Publik
                  </span>
                  <span className="font-mono text-lg font-black text-[#166534]">03</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#1e221f]">
                  Transparansi dan Evaluasi Kebijakan
                </h3>
                <p className="text-base text-[#4a4b44] leading-relaxed">
                  Membantu menelusuri sumber data, perkembangan harga, serta indikator keterjangkauan yang digunakan untuk mengevaluasi kebijakan.
                </p>
              </div>
              <div className="pt-4 border-t border-[#e8e2d4] text-xs sm:text-sm text-[#5c5b52] flex items-center justify-between">
                <span>Fokus: Sumber &amp; Metodologi</span>
                <Link href="/metodologi" className="font-bold text-[#67151d] hover:underline">
                  Baca Metodologi &rarr;
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
