'use client';

import React from 'react';
import Link from 'next/link';

export const InstrumentsSection: React.FC = () => {
  return (
    <section className="section py-14 bg-[#fffdf7] border-b border-[#ded8c8]" id="instrumen">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <span className="section-label inline-block px-3 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
            Instrumen Keputusan
          </span>
          <h2 className="section-heading text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Empat Instrumen Inti
          </h2>
          <p className="section-desc text-sm sm:text-base text-[#68685e] mt-1.5 leading-relaxed">
            Analisis mendalam, pemantauan akurat, dan rekomendasi yang bisa langsung ditindaklanjuti oleh pimpinan TPID, Satgas Pangan, dan pelaku logistik.
          </p>
        </div>

        <div className="instrument-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instrument 01 */}
          <article className="instrument bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="mb-5">
              <div className="instrument-heading flex items-center gap-2 mb-2">
                <span className="instrument-number font-mono text-xs font-black text-[#67151d] px-2 py-0.5 rounded bg-[#f4e8e9] border border-[#dfc7b8]">
                  01
                </span>
                <h3 className="text-xl font-bold text-[#1e221f]">Early Warning Engine</h3>
              </div>
              <p className="text-xs text-[#68685e] leading-relaxed mb-3">
                Mendeteksi anomali harga pasar harian, memantau deviasi terhadap HAP, dan memberi sinyal peringatan dini H+7 sebelum lonjakan meluas.
              </p>
              <a href="#peta" className="detail-link text-xs font-bold text-[#67151d] hover:underline inline-flex items-center gap-1">
                <span>Lihat detail di peta</span>
                <span>&rarr;</span>
              </a>
            </div>

            <div className="instrument-visual bg-[#f3eee3] rounded-lg p-3 border border-[#ded7c9]">
              <svg viewBox="0 0 280 150" className="w-full h-auto" role="img" aria-label="Grafik deteksi harga">
                <rect width="280" height="150" rx="6" fill="#f3eee3" />
                <g stroke="#ded7c9" strokeWidth="1">
                  <path d="M35 20H266M35 48H266M35 76H266M35 104H266M35 132H266" />
                </g>
                <g fill="#858174" fontSize="8" fontFamily="monospace">
                  <text x="5" y="23">120K</text>
                  <text x="5" y="51">100K</text>
                  <text x="12" y="79">80K</text>
                  <text x="12" y="107">60K</text>
                </g>
                <path d="M35 96 61 91 87 94 113 85 139 88 165 83 191 82 217 72" fill="none" stroke="#67151d" strokeWidth="2.3" strokeLinecap="round" />
                <path d="M217 72 Q238 58 266 23" fill="none" stroke="#67151d" strokeWidth="2.3" strokeDasharray="4 4" strokeLinecap="round" />
                <path d="M217 72 Q238 58 266 23 L266 132H217Z" fill="#67151d" opacity=".12" />
                <g fill="#67151d">
                  <circle cx="35" cy="96" r="2.5" />
                  <circle cx="87" cy="94" r="2.5" />
                  <circle cx="139" cy="88" r="2.5" />
                  <circle cx="191" cy="82" r="2.5" />
                  <circle cx="217" cy="72" r="3" />
                </g>
                <rect x="158" y="13" width="95" height="29" rx="4" fill="#fffaf0" stroke="#dfc7b8" />
                <text x="165" y="25" fontSize="8" fill="#67151d" fontWeight="700">Fluktuasi Terdeteksi</text>
                <text x="165" y="35" fontSize="8" fill="#67151d">Deviasi +8,7% vs HAP</text>
              </svg>
            </div>
          </article>

          {/* Instrument 02 */}
          <article className="instrument bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="mb-5">
              <div className="instrument-heading flex items-center gap-2 mb-2">
                <span className="instrument-number font-mono text-xs font-black text-[#67151d] px-2 py-0.5 rounded bg-[#f4e8e9] border border-[#dfc7b8]">
                  02
                </span>
                <h3 className="text-xl font-bold text-[#1e221f]">Smart Supply Matchmaker</h3>
              </div>
              <p className="text-xs text-[#68685e] leading-relaxed mb-3">
                Mempertemukan sentra panen surplus dan daerah defisit berdasarkan shortest-path logistik, jarak, dan efisiensi armada distribusi.
              </p>
              <a href="#sinergi" className="detail-link text-xs font-bold text-[#67151d] hover:underline inline-flex items-center gap-1">
                <span>Lihat rute distribusi</span>
                <span>&rarr;</span>
              </a>
            </div>

            <div className="instrument-visual bg-[#e8eadb] rounded-lg p-3 border border-[#ded7c9]">
              <svg viewBox="0 0 280 150" className="w-full h-auto" role="img" aria-label="Ilustrasi rute distribusi pangan">
                <rect width="280" height="150" rx="6" fill="#e8eadb" />
                <path d="M-10 38 74 12 120 46 190 12 300 48M-5 115 63 81 126 110 204 74 290 113M43 -5 71 53 45 100 78 160M153 -5 145 42 183 89 168 160M240 -5 222 53 253 91 240 160" stroke="#fffdf5" strokeWidth="8" fill="none" />
                <path d="M-10 60 80 60 118 87 181 87 218 55 290 55M-10 132 92 132 120 105 188 105 290 137" stroke="#d3d9c5" strokeWidth="2" fill="none" />
                <path d="M42 95 Q70 27 124 47 T209 47 T250 98" stroke="#67151d" strokeWidth="2.4" strokeDasharray="5 4" fill="none" />
                <g fill="#67151d">
                  <path d="M42 81c-10 0-10 12 0 22 10-10 10-22 0-22Z" />
                  <circle cx="42" cy="88" r="3" fill="#fff" />
                  <path d="M124 32c-10 0-10 12 0 22 10-10 10-22 0-22Z" />
                  <circle cx="124" cy="39" r="3" fill="#fff" />
                  <path d="M209 32c-10 0-10 12 0 22 10-10 10-22 0-22Z" />
                  <circle cx="209" cy="39" r="3" fill="#fff" />
                </g>
                <g transform="translate(151 76)">
                  <rect x="0" y="6" width="37" height="20" rx="3" fill="#4c7771" />
                  <path d="M37 12h13l9 10v4H37Z" fill="#c58a56" />
                  <circle cx="11" cy="29" r="5" fill="#4b4a41" />
                  <circle cx="44" cy="29" r="5" fill="#4b4a41" />
                </g>
              </svg>
            </div>
          </article>

          {/* Instrument 03 */}
          <article className="instrument bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="mb-5">
              <div className="instrument-heading flex items-center gap-2 mb-2">
                <span className="instrument-number font-mono text-xs font-black text-[#67151d] px-2 py-0.5 rounded bg-[#f4e8e9] border border-[#dfc7b8]">
                  03
                </span>
                <h3 className="text-xl font-bold text-[#1e221f]">Affordability Gap Matrix</h3>
              </div>
              <p className="text-xs text-[#68685e] leading-relaxed mb-3">
                Membandingkan rasio pengeluaran keranjang belanja pangan terhadap Upah Minimum Kabupaten/Kota (UMK) untuk mengukur daya beli warga secara adil.
              </p>
              <Link href="/harga" className="detail-link text-xs font-bold text-[#67151d] hover:underline inline-flex items-center gap-1">
                <span>Lihat matriks daerah</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="instrument-visual bg-[#fffdf7] rounded-lg p-3 border border-[#ded8c8] text-xs">
              <table className="matrix w-full text-left" aria-label="Contoh matriks keterjangkauan harga">
                <thead>
                  <tr className="border-b border-[#ded8c8] text-[#68685e]">
                    <th className="py-1">Komoditas</th>
                    <th className="py-1 text-center">Bekasi</th>
                    <th className="py-1 text-center">Bandung</th>
                    <th className="py-1 text-center">Garut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ded8c8]/60 font-mono">
                  <tr>
                    <td className="py-1.5 font-sans">Beras Medium</td>
                    <td className="py-1.5 text-center text-[#e85b4f] font-bold">7,2%</td>
                    <td className="py-1.5 text-center text-[#e69b39] font-bold">6,0%</td>
                    <td className="py-1.5 text-center text-[#4b9d73] font-bold">4,0%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">Cabai Rawit</td>
                    <td className="py-1.5 text-center text-[#e85b4f] font-bold">10,8%</td>
                    <td className="py-1.5 text-center text-[#e69b39] font-bold">7,0%</td>
                    <td className="py-1.5 text-center text-[#4b9d73] font-bold">6,0%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">Telur Ayam</td>
                    <td className="py-1.5 text-center text-[#e69b39] font-bold">8,0%</td>
                    <td className="py-1.5 text-center text-[#e69b39] font-bold">7,0%</td>
                    <td className="py-1.5 text-center text-[#4b9d73] font-bold">3,0%</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[10px] text-[#68685e] mt-2 italic">
                *Rasio pengeluaran keranjang belanja pangan terhadap UMK buruh.
              </p>
            </div>
          </article>

          {/* Instrument 04 */}
          <article className="instrument bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="mb-5">
              <div className="instrument-heading flex items-center gap-2 mb-2">
                <span className="instrument-number font-mono text-xs font-black text-[#67151d] px-2 py-0.5 rounded bg-[#f4e8e9] border border-[#dfc7b8]">
                  04
                </span>
                <h3 className="text-xl font-bold text-[#1e221f]">Crisis Simulation Sandbox</h3>
              </div>
              <p className="text-xs text-[#68685e] leading-relaxed mb-3">
                Uji skenario What-If: potensi gangguan pasokan, gagal panen, kenaikan biaya BBM logistik, dan efektifitas Gerakan Pangan Murah (GPM).
              </p>
              <Link href="/login" className="detail-link text-xs font-bold text-[#67151d] hover:underline inline-flex items-center gap-1">
                <span>Simulasi skenario tersedia di dashboard</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="instrument-visual rounded-lg overflow-hidden border border-[#ded7c9]">
              <svg viewBox="0 0 280 150" className="w-full h-auto" role="img" aria-label="Ilustrasi simulasi bencana dan distribusi pangan">
                <defs>
                  <linearGradient id="crisisSky" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#b8c9c5" />
                    <stop offset="1" stopColor="#526d6c" />
                  </linearGradient>
                </defs>
                <rect width="280" height="150" rx="6" fill="url(#crisisSky)" />
                <path d="M0 84 39 50 72 72 106 37 149 80 191 48 231 72 280 44V150H0Z" fill="#6c7770" />
                <path d="M0 104 48 80 88 100 133 75 183 103 230 84 280 99V150H0Z" fill="#8e9783" />
                <path d="M0 120 Q60 100 120 125 T280 120V150H0Z" fill="#536b6b" />
                <path d="M0 135 40 125 80 138 130 124 180 139 220 127 280 137" stroke="#c5d6cc" strokeWidth="2" fill="none" opacity=".7" />
                <g transform="translate(78 78)">
                  <rect x="0" y="9" width="72" height="29" rx="4" fill="#c0a06e" />
                  <path d="M-5 10 35 -6 77 10Z" fill="#7c493a" />
                  <rect x="8" y="16" width="14" height="15" fill="#e4d6b8" />
                  <rect x="31" y="16" width="14" height="15" fill="#e4d6b8" />
                  <rect x="54" y="16" width="11" height="22" fill="#4e4940" />
                </g>
              </svg>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
