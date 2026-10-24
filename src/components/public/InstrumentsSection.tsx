'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const InstrumentsSection: React.FC = () => {
  // Interactive state for Instrument 04 (Exploratory Scenario Prototype)
  const [supplyShockPct, setSupplyShockPct] = useState<number>(-10);
  const [transportSubsidy, setTransportSubsidy] = useState<boolean>(true);

  const basePrice = 47700; // Kota Bandung Cabai Rawit Merah
  const estimatedPrice = Math.round(
    basePrice * (1 + Math.abs(supplyShockPct) * 0.008 - (transportSubsidy ? 0.05 : 0))
  );

  return (
    <section className="py-16 md:py-24 bg-[#fffdf7] border-b border-[#ded8c8]" id="instrumen">
      <div className="public-container space-y-14">
        {/* Section Header (Badge "Instrumen Keputusan" removed) */}
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
            Empat Instrumen Inti
          </h2>
          <p className="text-base sm:text-lg text-[#4a4b44] mt-3 leading-relaxed">
            Empat fungsi analisis yang disusun agar masyarakat, pelaku distribusi, dan pemerintah daerah dapat memahami perkembangan harga serta keterjangkauan pangan dengan lebih menyeluruh.
          </p>
        </div>

        {/* Varied Editorial & Visual Showcase Layout */}
        <div className="space-y-10">
          {/* ROW 1: 01 (7 Cols) + 02 (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* 01 — Peringatan Dini Kenaikan Harga */}
            <article className="lg:col-span-7 bg-[#f8f4e9] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-white bg-[#67151d] px-3 py-1 rounded-lg">
                    01
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                    Peringatan Dini Kenaikan Harga
                  </h3>
                </div>
                <p className="text-base text-[#4a4b44] leading-relaxed">
                  Membantu mengenali wilayah dan komoditas yang menunjukkan tanda-tanda kenaikan harga berdasarkan data historis dan metode prediksi yang digunakan.
                </p>
              </div>

              {/* Visual 01: Historical vs Projected Curve with HAP Threshold */}
              <div className="bg-[#fffdf7] border border-[#e2dcd0] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#5c5b52]">
                  <strong className="text-[#1e221f] font-sans text-sm">
                    Ilustrasi Deteksi Tren &amp; Proyeksi 7 Hari
                  </strong>
                  <span>Data Historis vs Proyeksi Statistik</span>
                </div>

                <svg
                  viewBox="0 0 460 155"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Grafik deteksi kenaikan harga terhadap acuan"
                >
                  <g stroke="#e8e2d4" strokeWidth="1">
                    <line x1="42" y1="25" x2="445" y2="25" />
                    <line x1="42" y1="65" x2="445" y2="65" />
                    <line x1="42" y1="105" x2="445" y2="105" />
                    <line x1="42" y1="135" x2="445" y2="135" />
                  </g>
                  <g fill="#5c5b52" fontSize="10" fontFamily="monospace">
                    <text x="4" y="29">55rb</text>
                    <text x="4" y="69">50rb</text>
                    <text x="4" y="109">45rb</text>
                    <text x="4" y="138">40rb</text>
                  </g>
                  {/* HAP Reference Line */}
                  <line
                    x1="42"
                    y1="105"
                    x2="445"
                    y2="105"
                    stroke="#347b56"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                  />
                  <text x="48" y="99" fill="#347b56" fontSize="10" fontWeight="bold">
                    Batas Acuan HAP (Rp 45.000/kg)
                  </text>

                  {/* Historical Solid Curve */}
                  <path
                    d="M42 115 L95 110 L148 106 L201 96 L254 88 L307 74"
                    fill="none"
                    stroke="#67151d"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Projected H+7 Confidence Band & Dashed Curve */}
                  <path
                    d="M307 74 L375 56 L440 42 L440 72 L375 82 Z"
                    fill="#e69b39"
                    opacity="0.22"
                  />
                  <path
                    d="M307 74 L375 64 L440 52"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.8"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />
                  <circle cx="307" cy="74" r="4.5" fill="#67151d" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="440" cy="52" r="4.5" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
                  <rect x="315" y="16" width="126" height="26" rx="6" fill="#fef3c7" stroke="#f59e0b" />
                  <text x="323" y="33" fontSize="10" fill="#92400e" fontWeight="bold">
                    Proyeksi H+7 (+14% thd HAP)
                  </text>
                </svg>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e8e2d4] text-xs">
                  <span className="text-[#5c5b52]">
                    Memisahkan data observasi historis (garis utuh) dari estimasi H+7 (garis putus-putus).
                  </span>
                  <a href="#peta" className="font-bold text-[#67151d] hover:underline">
                    Amati di Peta Persebaran &rarr;
                  </a>
                </div>
              </div>
            </article>

            {/* 02 — Membandingkan Pasokan Antarwilayah */}
            <article className="lg:col-span-5 bg-[#f0ebde] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-white bg-[#67151d] px-3 py-1 rounded-lg">
                    02
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                    Membandingkan Pasokan Antarwilayah
                  </h3>
                </div>
                <p className="text-base text-[#4a4b44] leading-relaxed">
                  Membantu menemukan wilayah yang memiliki potensi surplus dan wilayah yang membutuhkan pasokan tambahan, dengan mempertimbangkan data serta kelayakan distribusi.
                </p>
              </div>

              {/* Visual 02: Surplus vs Deficit Comparison Diagram */}
              <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-xl p-4 sm:p-5 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-[#5c5b52] font-bold">
                  Perbandingan Neraca &amp; Jarak Wilayah
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#e0f0e2]/70 border border-[#badfc4] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#2d6a4f] block">
                        Potensi Surplus (Penghasil)
                      </span>
                      <strong className="text-sm font-extrabold text-[#1e221f]">Kab. Garut</strong>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-black text-[#2d6a4f]">Rp 41.900/kg</div>
                      <div className="text-xs text-[#4a4b44]">Neraca: Surplus</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-xs font-mono text-[#67151d] py-0.5">
                    <span className="h-[1px] flex-1 bg-[#d6cebe]" />
                    <span className="px-2.5 py-1 rounded-full bg-[#f4e8e9] border border-[#dfc7b8] font-bold">
                      Koridor Darat ~185 km
                    </span>
                    <span className="h-[1px] flex-1 bg-[#d6cebe]" />
                  </div>

                  <div className="p-3 rounded-lg bg-[#f8ded8]/70 border border-[#f0bfb7] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#991b1b] block">
                        Kebutuhan Pasokan (Konsumsi)
                      </span>
                      <strong className="text-sm font-extrabold text-[#1e221f]">Kota Bekasi</strong>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-black text-[#991b1b]">Rp 53.700/kg</div>
                      <div className="text-xs text-[#4a4b44]">Selisih: +Rp 11.800/kg</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e8e2d4] flex items-center justify-between text-xs">
                  <span className="text-[#5c5b52]">Ilustrasi perbandingan data wilayah</span>
                  <a href="#sinergi" className="font-bold text-[#67151d] hover:underline">
                    Lihat Alur Distribusi &rarr;
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* ROW 2: 03 (6 Cols) + 04 (6 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* 03 — Memahami Harga dan Daya Beli */}
            <article className="lg:col-span-6 bg-[#fffdf7] border-2 border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-white bg-[#67151d] px-3 py-1 rounded-lg">
                    03
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                    Memahami Harga dan Daya Beli
                  </h3>
                </div>
                <p className="text-base text-[#4a4b44] leading-relaxed">
                  Membantu membandingkan harga kebutuhan pokok dengan indikator daya beli daerah agar dampak perubahan harga dapat dipahami dengan lebih baik.
                </p>
              </div>

              {/* Visual 03: Structured Affordability Comparison Table */}
              <div className="bg-[#f8f4e9] border border-[#d6cebe] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#1e221f] text-sm font-bold">
                    Perbandingan Harga Cabai Rawit &amp; UMK Daerah
                  </strong>
                  <span className="font-mono text-[#5c5b52]">Sumber UMK: BPS</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm" aria-label="Tabel perbandingan harga dan UMK">
                    <thead>
                      <tr className="border-b border-[#d6cebe] text-[#5c5b52]">
                        <th className="py-2 font-semibold">Wilayah</th>
                        <th className="py-2 font-semibold text-right">Harga/kg</th>
                        <th className="py-2 font-semibold text-right">UMK 2026</th>
                        <th className="py-2 font-semibold text-right">Beban Keranjang*</th>
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
                    *Harga nominal lebih rendah dapat tetap terasa lebih berat di daerah dengan UMK lebih kecil.
                  </span>
                  <Link href="/harga" className="font-bold text-[#67151d] hover:underline">
                    Lihat Rincian Wilayah &rarr;
                  </Link>
                </div>
              </div>
            </article>

            {/* 04 — Mencoba Berbagai Skenario */}
            <article className="lg:col-span-6 bg-[#f8f4e9] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-white bg-[#67151d] px-3 py-1 rounded-lg">
                      04
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                      Mencoba Berbagai Skenario
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#f0ebde] text-[#67151d] border border-[#cfc8b8]">
                    Simulasi Eksplorasi
                  </span>
                </div>
                <p className="text-base text-[#4a4b44] leading-relaxed">
                  Membantu pengguna mengeksplorasi kemungkinan dampak perubahan harga atau gangguan pasokan berdasarkan asumsi yang dapat diubah.
                </p>
              </div>

              {/* Interactive Scenario Explorer Preview */}
              <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-[#e5dfd0] pb-2.5">
                  <strong className="text-sm font-bold text-[#1e221f]">
                    Simulasi Asumsi Pasokan &amp; Distribusi (Contoh: Kota Bandung)
                  </strong>
                  <span className="font-mono text-[#5c5b52]">Data Simulasi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold text-[#1e221f]">
                      <label htmlFor="supplyShockRange">Asumsi Perubahan Pasokan:</label>
                      <span className="font-mono text-[#67151d]">{supplyShockPct}%</span>
                    </div>
                    <input
                      id="supplyShockRange"
                      type="range"
                      min={-25}
                      max={0}
                      step={5}
                      value={supplyShockPct}
                      onChange={(e) => setSupplyShockPct(Number(e.target.value))}
                      className="w-full accent-[#67151d] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#5c5b52] font-mono">
                      <span>-25% (Berkurang)</span>
                      <span>0% (Normal)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-[#1e221f] block">
                      Dukungan Kerja Sama Distribusi:
                    </span>
                    <button
                      type="button"
                      onClick={() => setTransportSubsidy(!transportSubsidy)}
                      className={`w-full py-2 px-3 rounded-lg font-bold text-xs border transition-colors flex items-center justify-between ${
                        transportSubsidy
                          ? 'bg-[#e0f0e2] border-[#4b9d73] text-[#166534]'
                          : 'bg-[#f8f4e9] border-[#cfc8b8] text-[#4a4b44]'
                      }`}
                    >
                      <span>{transportSubsidy ? 'Pasokan Tambahan Aktif' : 'Tanpa Pasokan Tambahan'}</span>
                      <span className="font-mono">{transportSubsidy ? '-5% Tekanan' : '0%'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f4e9] border border-[#e2dcd0] flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#5c5b52] block text-xs">Harga Awal Observasi: Rp 47.700/kg</span>
                    <strong className="text-[#1e221f]">Estimasi Harga pada Skenario Ini:</strong>
                  </div>
                  <span className="font-mono tabular-nums text-lg font-black text-[#67151d]">
                    Rp {estimatedPrice.toLocaleString('id-ID')}/kg
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-[#5c5b52]">
                    Perhitungan di atas adalah prototipe simulasi berbasis elastisitas asumsi.
                  </span>
                  <Link href="/metodologi" className="font-bold text-[#67151d] hover:underline">
                    Pelajari Metodologi &rarr;
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
