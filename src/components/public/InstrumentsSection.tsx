import React from 'react';
import Link from 'next/link';

export const InstrumentsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#fffdf7] border-b border-[#ded8c8]" id="instrumen">
      <div className="public-container space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#67151d] px-3 py-1 rounded-md bg-[#f8f4e9] border border-[#d6cebe] inline-block">
            Keterjangkauan &amp; Kewajaran Harga
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
            Memahami Harga dan Daya Beli Pangan
          </h2>
          <p className="text-base sm:text-lg text-[#4a4b44] leading-relaxed">
            Harga bahan pokok tidak hanya dilihat dari nominal rupiahnya, melainkan bagaimana harga tersebut dibandingkan terhadap standar acuan pemerintah dan daya beli masyarakat di tiap daerah.
          </p>
        </div>

        {/* 2 Core Public Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: Perbandingan terhadap Acuan Pemerintah (HAP/HET) */}
          <article className="lg:col-span-6 bg-[#f8f4e9] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black text-white bg-[#67151d] px-3 py-1 rounded-lg">
                  01
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                  Pemantauan Batas Acuan HAP &amp; HET
                </h3>
              </div>
              <p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
                Setiap harga harian dari Badan Pangan Nasional (Bapanas) disandingkan secara transparan terhadap Harga Acuan Penjualan (HAP) dan Harga Eceran Tertinggi (HET) agar masyarakat mengetahui apakah harga di pasar masih dalam batas wajar.
              </p>
            </div>

            {/* Visual: Status Ambang Batas Resmi */}
            <div className="bg-[#fffdf7] border border-[#e2dcd0] rounded-xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
              <strong className="text-[#1e221f] font-bold block text-sm pb-2 border-b border-[#e8e2d4]">
                Klasifikasi Status Kewajaran Harga
              </strong>

              <div className="space-y-2.5 font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#e0f0e2]/80 border border-[#badfc4]">
                  <div>
                    <span className="font-sans font-bold text-[#166534] block">Sesuai / Di Bawah Acuan</span>
                    <span className="text-[11px] text-[#2d6a4f]">Deviasi &le; +5% dari HAP/HET</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#166534] text-white font-bold text-xs">
                    Wajar
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fef3c7] border border-[#fde68a]">
                  <div>
                    <span className="font-sans font-bold text-[#92400e] block">Fluktuasi Sedang</span>
                    <span className="text-[11px] text-[#78350f]">Deviasi +5% s.d. +10% dari HAP/HET</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#d97706] text-white font-bold text-xs">
                    Waspada
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8ded8] border border-[#f0bfb7]">
                  <div>
                    <span className="font-sans font-bold text-[#991b1b] block">Di Atas Acuan Resmi</span>
                    <span className="text-[11px] text-[#7f1d1d]">Deviasi &gt; +10% dari HAP/HET</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#991b1b] text-white font-bold text-xs">
                    Tinggi
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e8e2d4] flex items-center justify-between text-xs text-[#5c5b52]">
                <span>Sumber Acuan: Badan Pangan Nasional (Bapanas)</span>
                <Link href="/metodologi" className="font-bold text-[#67151d] hover:underline">
                  Pelajari Metodologi &rarr;
                </Link>
              </div>
            </div>
          </article>

          {/* Card 2: Harga Pangan terhadap Upah Minimum (UMK) */}
          <article className="lg:col-span-6 bg-[#fffdf7] border-2 border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black text-white bg-[#67151d] px-3 py-1 rounded-lg">
                  02
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                  Indikator Daya Beli &amp; UMK Daerah
                </h3>
              </div>
              <p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
                Kenaikan nominal harga yang sama terasa jauh lebih berat bagi masyarakat di kabupaten dengan upah minimum lebih rendah dibanding kota besar. Sistem menyandingkan harga pangan dengan ketetapan UMK 2026.
              </p>
            </div>

            {/* Table: Affordability Comparison */}
            <div className="bg-[#f8f4e9] border border-[#d6cebe] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <strong className="text-[#1e221f] text-sm font-bold">
                  Contoh Rasio Beban Pengeluaran Cabai Rawit
                </strong>
                <span className="font-mono text-[#5c5b52]">Sumber UMK: JDIH &amp; Galura Jabarprov</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm" aria-label="Tabel perbandingan harga dan UMK">
                  <thead>
                    <tr className="border-b border-[#d6cebe] text-[#5c5b52]">
                      <th className="py-2 font-semibold">Wilayah</th>
                      <th className="py-2 font-semibold text-right">Harga/kg</th>
                      <th className="py-2 font-semibold text-right">UMK 2026</th>
                      <th className="py-2 font-semibold text-right">Beban Pengeluaran*</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5dfd0] font-mono tabular-nums">
                    <tr>
                      <td className="py-2.5 font-sans font-bold text-[#1e221f]">Kota Bekasi</td>
                      <td className="py-2.5 text-right text-[#1e221f]">Rp 53.700</td>
                      <td className="py-2.5 text-right text-[#5c5b52]">Rp 5,61 Jt</td>
                      <td className="py-2.5 text-right font-bold text-[#347b56]">1,91%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-bold text-[#1e221f]">Kota Bandung</td>
                      <td className="py-2.5 text-right text-[#1e221f]">Rp 47.700</td>
                      <td className="py-2.5 text-right text-[#5c5b52]">Rp 4,41 Jt</td>
                      <td className="py-2.5 text-right font-bold text-[#92400e]">2,16%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-bold text-[#1e221f]">Kab. Kuningan</td>
                      <td className="py-2.5 text-right text-[#1e221f]">Rp 46.800</td>
                      <td className="py-2.5 text-right text-[#5c5b52]">Rp 2,20 Jt</td>
                      <td className="py-2.5 text-right font-bold text-[#a83c32]">4,25%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e5dfd0] text-xs">
                <span className="text-[#5c5b52]">
                  *Estimasi konsumsi rumah tangga bulanan berdasarkan standar BPS &amp; Bapanas.
                </span>
                <Link href="/harga" className="font-bold text-[#67151d] hover:underline">
                  Lihat 27 Wilayah &rarr;
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
