'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CommodityItem {
  id: string;
  name: string;
  location: string;
  price: number;
  changePct: number;
  unit: string;
  status: 'waspada' | 'aman' | 'kritis';
  recommendation: string;
  points: number[];
}

const DEMO_COMMODITIES: Record<string, CommodityItem> = {
  'cabai-rawit': {
    id: 'cabai-rawit',
    name: 'Cabai Rawit Merah',
    location: 'Kota Bekasi',
    price: 78200,
    changePct: 8.7,
    unit: '/kg',
    status: 'waspada',
    recommendation:
      'Distribusikan cadangan 8 ton dari Kab. Garut (Surplus) ke Kota Bekasi untuk menekan disparitas harga antardaerah.',
    points: [118, 108, 99, 92, 101, 85, 94, 78, 88, 65, 62]
  },
  'beras-medium': {
    id: 'beras-medium',
    name: 'Beras Medium',
    location: 'Kab. Karawang',
    price: 14200,
    changePct: 2.3,
    unit: '/kg',
    status: 'aman',
    recommendation:
      'Pantau ketersediaan stok panen dan pertahankan pasokan reguler dari sentra produksi terdekat.',
    points: [130, 128, 125, 124, 120, 118, 121, 117, 115, 112, 110]
  },
  'bawang-merah': {
    id: 'bawang-merah',
    name: 'Bawang Merah',
    location: 'Kota Bandung',
    price: 36500,
    changePct: 6.4,
    unit: '/kg',
    status: 'waspada',
    recommendation:
      'Periksa pasokan antarwilayah dan siapkan opsi distribusi tambahan jika tren kenaikan berlanjut.',
    points: [110, 105, 102, 98, 95, 91, 88, 82, 85, 76, 74]
  },
  'telur-ayam': {
    id: 'telur-ayam',
    name: 'Telur Ayam Ras',
    location: 'Kota Bogor',
    price: 29800,
    changePct: -1.8,
    unit: '/kg',
    status: 'aman',
    recommendation:
      'Monitor harga eceran dan stok distributor pakan untuk mengantisipasi perubahan permintaan.',
    points: [90, 92, 95, 98, 102, 105, 108, 112, 115, 118, 120]
  },
  minyakita: {
    id: 'minyakita',
    name: 'Minyakita (HET)',
    location: 'Kota Cirebon',
    price: 15700,
    changePct: 0.0,
    unit: '/liter',
    status: 'aman',
    recommendation:
      'Pertahankan distribusi reguler dan periksa kepatuhan harga eceran tertinggi HET Minyakita Rp 15.700 di pasar tradisional.',
    points: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  }
};

export const HeroSection: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('cabai-rawit');
  const commodity = DEMO_COMMODITIES[selectedKey] || DEMO_COMMODITIES['cabai-rawit'];

  return (
    <section className="hero py-12 md:py-16 bg-[#f8f4e9] border-b border-[#ded8c8]" id="beranda">
      <div className="container">
        <div className="hero-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Copy Column (Col 7) */}
          <div className="hero-copy lg:col-span-7 space-y-6">
            <div className="hero-kicker inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4e8e9] text-[#67151d] text-xs font-mono font-bold tracking-wider border border-[#dfc7b8]">
              <span className="dot dot-green w-2 h-2 rounded-full bg-[#4b9d73] animate-pulse"></span>
              <span>RADAR PANGAN &bull; INDONESIA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1e221f] tracking-tight leading-[1.08]">
              Harga Pangan<br />
              <span className="text-[#67151d]">Tidak Menunggu</span><br />
              Kita Siap.
            </h1>

            <p className="text-base sm:text-lg text-[#68685e] leading-relaxed max-w-xl">
              Radar Pangan mengubah tabel harga yang pasif menjadi sistem pemantauan harga eceran riil dan peringatan dini.
              Early Warning System berbasis data terbuka untuk pemerintah daerah, pelaku logistik, dan masyarakat agar lebih siap menghadapi gejolak harga pangan.
            </p>

            <div className="hero-actions flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#peta"
                className="btn btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-sm shadow-md transition-all hover:translate-y-[-1px]"
              >
                <span>Jelajahi Radar Kerawanan &amp; Peta</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                </svg>
              </a>
              <a
                href="#instrumen"
                className="btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#fffdf7] hover:bg-[#f0ebde] text-[#1e221f] font-semibold text-sm border border-[#ded8c8] shadow-sm transition-all"
              >
                Lihat Cara Kerja
              </a>
            </div>
          </div>

          {/* Right Interactive Art Card (Col 5) */}
          <div className="hero-art lg:col-span-5">
            <article className="price-card bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-5 shadow-lg space-y-4">
              {/* Card Header & Commodity Switcher */}
              <div className="price-top flex items-center justify-between pb-3 border-b border-[#ded8c8]">
                <div className="price-location text-xs font-bold text-[#1e221f]">
                  <span>{commodity.location}</span> <span className="text-[#68685e]">&bull;</span>{' '}
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="font-bold text-[#67151d] bg-transparent cursor-pointer border-b border-dashed border-[#67151d] focus:outline-none"
                    aria-label="Pilih komoditas hero"
                  >
                    <option value="cabai-rawit">Cabai Rawit Merah</option>
                    <option value="beras-medium">Beras Medium</option>
                    <option value="bawang-merah">Bawang Merah</option>
                    <option value="telur-ayam">Telur Ayam</option>
                    <option value="minyakita">Minyakita (HET)</option>
                  </select>
                </div>

                <span
                  className={`pill text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                    commodity.status === 'waspada'
                      ? 'bg-[#fef3c7] text-[#92400e]'
                      : commodity.status === 'kritis'
                      ? 'bg-[#fee2e2] text-[#991b1b]'
                      : 'bg-[#dcfce7] text-[#166534]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      commodity.status === 'waspada'
                        ? 'bg-[#d97706]'
                        : commodity.status === 'kritis'
                        ? 'bg-[#dc2626]'
                        : 'bg-[#16a34a]'
                    }`}
                  />
                  <span>{commodity.status === 'waspada' ? 'Waspada Fluktuasi' : commodity.status === 'kritis' ? 'Defisit Kritis' : 'Stabil'}</span>
                </span>
              </div>

              {/* Price & Change Value */}
              <div className="flex items-baseline gap-2.5">
                <span className="price-value font-mono text-3xl font-black text-[#1e221f]">
                  Rp {commodity.price.toLocaleString('id-ID')}{commodity.unit}
                </span>
                <span
                  className={`price-change font-mono font-bold text-sm ${
                    commodity.changePct > 0 ? 'text-[#e85b4f]' : commodity.changePct < 0 ? 'text-[#4b9d73]' : 'text-[#68685e]'
                  }`}
                >
                  {commodity.changePct > 0 ? `↑ +${commodity.changePct}%` : commodity.changePct < 0 ? `↓ ${commodity.changePct}%` : '± 0.0%'}
                </span>
                <span className="text-xs text-[#68685e]">(vs. kemarin)</span>
              </div>

              {/* Chart SVG Canvas */}
              <div className="chart-wrap bg-[#f8f4e9]/50 rounded-lg p-3 border border-[#ded8c8]/60">
                <svg className="w-full h-auto" viewBox="0 0 480 190" role="img" aria-label="Grafik histori harga pangan">
                  <defs>
                    <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#67151d" stopOpacity=".18" />
                      <stop offset="100%" stopColor="#67151d" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Gridlines */}
                  <g stroke="#e8e1d5" strokeWidth="1">
                    <line x1="42" y1="25" x2="460" y2="25" />
                    <line x1="42" y1="58" x2="460" y2="58" />
                    <line x1="42" y1="91" x2="460" y2="91" />
                    <line x1="42" y1="124" x2="460" y2="124" />
                    <line x1="42" y1="157" x2="460" y2="157" />
                  </g>
                  {/* Y Axis Labels */}
                  <g fill="#898578" fontSize="10">
                    <text x="0" y="28">120K</text>
                    <text x="0" y="61">100K</text>
                    <text x="7" y="94">80K</text>
                    <text x="7" y="127">60K</text>
                    <text x="7" y="160">40K</text>
                  </g>
                  {/* Filled Area */}
                  <path
                    d="M45 118 L78 108 L111 99 L145 92 L178 101 L211 85 L244 94 L277 78 L310 88 L343 65 L460 62 L460 157 L45 157Z"
                    fill="url(#heroFill)"
                  />
                  {/* Line Graph */}
                  <path
                    d="M45 118 L78 108 L111 99 L145 92 L178 101 L211 85 L244 94 L277 78 L310 88 L343 65 L460 62"
                    fill="none"
                    stroke="#67151d"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Points */}
                  <g fill="#67151d">
                    <circle cx="45" cy="118" r="3" />
                    <circle cx="78" cy="108" r="3" />
                    <circle cx="111" cy="99" r="3" />
                    <circle cx="145" cy="92" r="3" />
                    <circle cx="178" cy="101" r="3" />
                    <circle cx="211" cy="85" r="3" />
                    <circle cx="244" cy="94" r="3" />
                    <circle cx="277" cy="78" r="3" />
                    <circle cx="310" cy="88" r="3" />
                    <circle cx="343" cy="65" r="3" />
                    <circle cx="460" cy="62" r="4" fill="#67151d" />
                  </g>
                  {/* X Axis Date Labels */}
                  <g fill="#898578" fontSize="10" textAnchor="middle">
                    <text x="45" y="177">18 Okt</text>
                    <text x="110" y="177">19 Okt</text>
                    <text x="175" y="177">20 Okt</text>
                    <text x="240" y="177">21 Okt</text>
                    <text x="305" y="177">22 Okt</text>
                    <text x="370" y="177">23 Okt</text>
                    <text x="435" y="177">24 Okt</text>
                  </g>
                </svg>

                {/* Legend */}
                <div className="chart-legend flex items-center justify-between pt-2.5 text-[11px] text-[#68685e]">
                  <span className="flex items-center gap-1.5">
                    <i className="w-3 h-0.5 bg-[#67151d] inline-block" />
                    <span>Harga Eceran Aktual</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="w-3 h-0.5 bg-[#8a6212] inline-block border-b border-dashed" />
                    <span>Batas Acuan HAP Bapanas</span>
                  </span>
                </div>
              </div>

              {/* AI Policy Recommendation Box */}
              <div className="ai-recommendation flex items-start gap-3 p-3 rounded-lg bg-[#f0ebde] border border-[#ded8c8] text-xs">
                <div className="ai-icon w-6 h-6 rounded-md bg-[#e0f0e2] text-[#4b9d73] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <strong className="text-[#1e221f] block mb-0.5">Rekomendasi Kebijakan Pasokan</strong>
                  <p className="text-[#68685e] leading-snug">{commodity.recommendation}</p>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Source Strip Row */}
        <div className="source-strip mt-12 pt-6 border-t border-[#ded8c8] flex flex-wrap items-center justify-between gap-6 text-xs text-[#68685e]">
          <div className="source-heading font-mono uppercase tracking-wider font-bold text-[#1e221f]">
            Sumber data terbuka resmi:
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="source-item flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#67151d]" />
              <div>
                <strong className="text-[#1e221f] mr-1">Bapanas</strong>
                <span className="text-[#68685e]">Panel Harga Pangan</span>
              </div>
            </div>
            <div className="source-item flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8a6212]" />
              <div>
                <strong className="text-[#1e221f] mr-1">Bank Indonesia</strong>
                <span className="text-[#68685e]">PIHPS &amp; GNPIP</span>
              </div>
            </div>
            <div className="source-item flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4b9d73]" />
              <div>
                <strong className="text-[#1e221f] mr-1">BPS</strong>
                <span className="text-[#68685e]">Statistik UMK &amp; Konsumsi</span>
              </div>
            </div>
            <div className="source-item flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1e221f]" />
              <div>
                <strong className="text-[#1e221f] mr-1">Kemendagri</strong>
                <span className="text-[#68685e]">Batas Geospasial Wilayah</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
