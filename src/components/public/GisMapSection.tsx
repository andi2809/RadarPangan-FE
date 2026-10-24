'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface RegionStatus {
  id: string;
  name: string;
  status: 'aman' | 'waspada' | 'kritis';
  priceRp: number;
  hapDeviasiPct: number;
}

const REGION_DATA: Record<string, RegionStatus> = {
  '32.16': { id: '32.16', name: 'Kab. Bekasi', status: 'kritis', priceRp: 78200, hapDeviasiPct: 18.5 },
  '32.75': { id: '32.75', name: 'Kota Bekasi', status: 'kritis', priceRp: 79500, hapDeviasiPct: 20.4 },
  '32.15': { id: '32.15', name: 'Kab. Karawang', status: 'waspada', priceRp: 71200, hapDeviasiPct: 7.9 },
  '32.13': { id: '32.13', name: 'Kab. Subang', status: 'kritis', priceRp: 76000, hapDeviasiPct: 15.2 },
  '32.04': { id: '32.04', name: 'Kab. Bandung', status: 'aman', priceRp: 64000, hapDeviasiPct: -3.0 },
  '32.73': { id: '32.73', name: 'Kota Bandung', status: 'waspada', priceRp: 69800, hapDeviasiPct: 5.8 },
  '32.05': { id: '32.05', name: 'Kab. Garut', status: 'aman', priceRp: 54000, hapDeviasiPct: -18.2 },
  '32.12': { id: '32.12', name: 'Kab. Indramayu', status: 'aman', priceRp: 58000, hapDeviasiPct: -12.1 }
};

export const GisMapSection: React.FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('cabai-rawit');
  const [scope, setScope] = useState<'jabar' | 'nasional'>('jabar');
  const [selectedRegionId, setSelectedRegionId] = useState('32.16');

  const selectedRegion = REGION_DATA[selectedRegionId] || REGION_DATA['32.16'];

  return (
    <section className="dashboard py-14 bg-[#f8f4e9] border-b border-[#ded8c8]" id="peta">
      <div className="container">
        {/* Section Header & Filters */}
        <div className="dashboard-head flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="section-label inline-block px-3 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
              Peta Disparitas Harga Publik
            </span>
            <h2 className="section-heading text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
              Radar Harga Pangan Nasional
            </h2>
            <p className="section-desc text-sm sm:text-base text-[#68685e] mt-1.5 max-w-xl">
              Pantau harga eceran harian, perbandingan terhadap Harga Acuan Pemerintah (HAP), dan riwayat pergerakan harga wilayah.
            </p>
          </div>

          <div className="map-filters flex flex-wrap items-center gap-3">
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="control px-3.5 py-2 rounded-lg bg-[#fffdf7] border border-[#ded8c8] text-xs font-bold text-[#1e221f] cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-[#67151d]"
              aria-label="Pilih komoditas peta"
            >
              <option value="cabai-rawit">Cabai Rawit Merah</option>
              <option value="beras-medium">Beras Medium</option>
              <option value="bawang-merah">Bawang Merah</option>
              <option value="telur-ayam">Telur Ayam Ras</option>
              <option value="minyakita">Minyak Goreng Minyakita</option>
            </select>

            <div className="segment flex rounded-lg bg-[#fffdf7] p-1 border border-[#ded8c8] text-xs font-bold shadow-sm">
              <button
                type="button"
                onClick={() => setScope('jabar')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  scope === 'jabar' ? 'bg-[#67151d] text-white shadow-sm' : 'text-[#68685e] hover:text-[#1e221f]'
                }`}
              >
                Jawa Barat (27 Kab/Kota)
              </button>
              <button
                type="button"
                onClick={() => setScope('nasional')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  scope === 'nasional' ? 'bg-[#67151d] text-white shadow-sm' : 'text-[#68685e] hover:text-[#1e221f]'
                }`}
              >
                Indonesia (38 Provinsi)
              </button>
            </div>
          </div>
        </div>

        {/* Map Grid */}
        <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Map Box (Col 8) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="map-panel bg-[#3d0a11] border border-[#67151d] rounded-xl overflow-hidden shadow-md flex-1 flex flex-col">
              {/* Map Toolbar */}
              <div className="map-toolbar px-4 py-2.5 bg-[#2e070c] border-b border-[#4c0d15] flex items-center justify-between text-xs text-[#e3c2c0] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4b9d73] animate-pulse" />
                  <span>Batas Administrasi Resmi (GeoJSON Kemendagri / BPS)</span>
                </span>
                <span className="text-[11px] text-[#f4e8e9]/70">Pembaruan: 24 Okt 2026, 09:00 WIB</span>
              </div>

              {/* Map Canvas Graphic */}
              <div className="relative p-6 flex-1 min-h-[380px] flex items-center justify-center bg-[#2e070c] overflow-hidden">
                {/* SVG Visual Representation of Java/Indonesia Regencies */}
                <svg viewBox="0 0 760 360" className="w-full h-full max-h-[360px] select-none">
                  {/* Outer Map Grid Backing */}
                  <defs>
                    <pattern id="civicMapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#4c0d15" opacity="0.6" />
                    </pattern>
                  </defs>
                  <rect width="760" height="360" fill="url(#civicMapGrid)" />

                  {/* Non-Jabar / Outer Province Silhouette in Muted Tone */}
                  <path
                    d="M 10 180 L 120 160 L 140 130 L 110 80 L 40 70 Z"
                    fill="#4c0d15"
                    stroke="#67151d"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <text x="35" y="125" fill="#a86d73" fontSize="11" fontFamily="monospace">Banten</text>

                  <path
                    d="M 140 100 L 180 95 L 175 125 L 140 120 Z"
                    fill="#4c0d15"
                    stroke="#67151d"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <text x="145" y="115" fill="#a86d73" fontSize="9" fontFamily="monospace">DKI</text>

                  <path
                    d="M 640 120 L 750 130 L 740 280 L 610 260 L 630 190 Z"
                    fill="#4c0d15"
                    stroke="#67151d"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <text x="660" y="200" fill="#a86d73" fontSize="12" fontFamily="monospace">Jawa Tengah</text>

                  {/* 27 Regencies of West Java (High-contrast Civic Warm Status Colors) */}
                  {/* Kab. Bekasi (Red/Critical) */}
                  <g onClick={() => setSelectedRegionId('32.16')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <path
                      d="M 175 95 L 260 90 L 280 145 L 210 165 L 170 140 Z"
                      fill="#e85b4f"
                      stroke={selectedRegionId === '32.16' ? '#fff' : '#2e070c'}
                      strokeWidth={selectedRegionId === '32.16' ? 3 : 1.5}
                    />
                    <text x="195" y="130" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="monospace">Bekasi</text>
                  </g>

                  {/* Kab. Karawang (Yellow/Waspada) */}
                  <g onClick={() => setSelectedRegionId('32.15')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <path
                      d="M 260 90 L 370 100 L 350 170 L 280 145 Z"
                      fill="#f0c94d"
                      stroke={selectedRegionId === '32.15' ? '#fff' : '#2e070c'}
                      strokeWidth={selectedRegionId === '32.15' ? 3 : 1.5}
                    />
                    <text x="290" y="130" fill="#1e221f" fontSize="11" fontWeight="bold" fontFamily="monospace">Karawang</text>
                  </g>

                  {/* Kab. Subang (Red/Kritis) */}
                  <g onClick={() => setSelectedRegionId('32.13')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <path
                      d="M 370 100 L 460 110 L 435 180 L 350 170 Z"
                      fill="#e85b4f"
                      stroke={selectedRegionId === '32.13' ? '#fff' : '#2e070c'}
                      strokeWidth={selectedRegionId === '32.13' ? 3 : 1.5}
                    />
                    <text x="385" y="140" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="monospace">Subang</text>
                  </g>

                  {/* Kab. Indramayu (Green/Stabil) */}
                  <g onClick={() => setSelectedRegionId('32.12')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <path
                      d="M 460 110 L 570 120 L 540 195 L 435 180 Z"
                      fill="#4b9d73"
                      stroke={selectedRegionId === '32.12' ? '#fff' : '#2e070c'}
                      strokeWidth={selectedRegionId === '32.12' ? 3 : 1.5}
                    />
                    <text x="470" y="150" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="monospace">Indramayu</text>
                  </g>

                  {/* Cirebon (Green/Stabil) */}
                  <g className="cursor-pointer">
                    <path
                      d="M 570 120 L 640 135 L 610 205 L 540 195 Z"
                      fill="#4b9d73"
                      stroke="#2e070c"
                      strokeWidth="1.5"
                    />
                    <text x="565" y="165" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="monospace">Cirebon</text>
                  </g>

                  {/* Kab & Kota Bandung (Yellow/Waspada) */}
                  <g onClick={() => setSelectedRegionId('32.04')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <path
                      d="M 280 170 L 390 170 L 375 250 L 255 240 Z"
                      fill="#4b9d73"
                      stroke={selectedRegionId === '32.04' ? '#fff' : '#2e070c'}
                      strokeWidth={selectedRegionId === '32.04' ? 3 : 1.5}
                    />
                    <text x="295" y="210" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="monospace">Bandung</text>
                  </g>

                  {/* Kab. Garut (Green/Surplus) */}
                  <g onClick={() => setSelectedRegionId('32.05')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                    <path
                      d="M 375 240 L 485 220 L 460 320 L 345 310 Z"
                      fill="#4b9d73"
                      stroke={selectedRegionId === '32.05' ? '#fff' : '#2e070c'}
                      strokeWidth={selectedRegionId === '32.05' ? 3 : 1.5}
                    />
                    <text x="390" y="275" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="monospace">Garut</text>
                  </g>

                  {/* Supply Route Arrow: Garut -> Bekasi */}
                  <path
                    d="M 400 260 Q 280 190 220 145"
                    fill="none"
                    stroke="#f0c94d"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                  />
                  <circle cx="310" cy="205" r="10" fill="#67151d" stroke="#f0c94d" strokeWidth="2" />
                  <text x="306" y="209" fill="#fff" fontSize="9">🚚</text>
                </svg>

                {/* Floating Region Pin Callout */}
                <div className="absolute top-8 left-8 bg-[#fffdf7] border border-[#ded8c8] rounded-lg p-3 shadow-xl text-xs text-[#1e221f] max-w-[210px] pointer-events-none">
                  <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#ded8c8]">
                    <strong className="font-bold">{selectedRegion.name}</strong>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        selectedRegion.status === 'kritis'
                          ? 'bg-[#fee2e2] text-[#991b1b]'
                          : selectedRegion.status === 'waspada'
                          ? 'bg-[#fef3c7] text-[#92400e]'
                          : 'bg-[#dcfce7] text-[#166534]'
                      }`}
                    >
                      {selectedRegion.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-black text-[#67151d]">
                    Rp {selectedRegion.priceRp.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-[#68685e]">
                    Deviasi HAP: <strong className={selectedRegion.hapDeviasiPct > 0 ? 'text-[#e85b4f]' : 'text-[#4b9d73]'}>
                      {selectedRegion.hapDeviasiPct > 0 ? `+${selectedRegion.hapDeviasiPct}%` : `${selectedRegion.hapDeviasiPct}%`}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="map-legend mt-4 flex flex-wrap items-center gap-6 text-xs text-[#1e221f]" aria-label="Legenda tingkat risiko">
              <div className="map-legend-item flex items-center gap-2">
                <span className="legend-circle w-3 h-3 rounded-full bg-[#4b9d73] inline-block" />
                <span><strong>Di Bawah / Sesuai HAP</strong> &bull; Pasokan Stabil</span>
              </div>
              <div className="map-legend-item flex items-center gap-2">
                <span className="legend-circle w-3 h-3 rounded-full bg-[#f0c94d] inline-block" />
                <span><strong>Fluktuasi Wajar</strong> &bull; +1% s.d. +5% dari HAP</span>
              </div>
              <div className="map-legend-item flex items-center gap-2">
                <span className="legend-circle w-3 h-3 rounded-full bg-[#e85b4f] inline-block" />
                <span><strong>Di Atas Acuan</strong> &bull; &gt;10% dari HAP</span>
              </div>
            </div>
          </div>

          {/* Right Aside Panel (Col 4 - .national-panel) */}
          <aside className="national-panel lg:col-span-4 bg-[#67151d] text-[#fffdf7] rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[#fffdf7] mb-4">
                Ringkasan Jawa Barat
              </h3>

              <div className="stat-label text-xs font-mono uppercase tracking-wider text-[#e3c2c0] mb-1">
                Kesesuaian Harga thd. HAP
              </div>
              <div className="national-stat mb-6">
                <div className="stat-value font-mono text-4xl font-black text-white">
                  68,4%
                </div>
                <div className="stat-caption text-xs text-[#e3c2c0] mt-1">
                  Titik pasar pantauan berada dalam rentang wajar terkendali
                </div>
              </div>

              <div className="stat-divider h-[1px] bg-[#87232d] my-6" />

              <div className="stat-label text-xs font-mono uppercase tracking-wider text-[#e3c2c0] mb-1">
                Rata-rata Pergerakan Harian
              </div>
              <div className="forecast-value font-mono text-3xl font-bold text-[#f0c94d] mb-1">
                +1,8%
              </div>
              <div className="stat-caption text-xs text-[#e3c2c0] mb-4">
                dibandingkan rata-rata pekan lalu di 27 Kab/Kota
              </div>

              {/* Sparkline Graphic */}
              <svg className="forecast-chart w-full h-12" viewBox="0 0 250 54" role="img" aria-label="Tren pergerakan harga">
                <path
                  d="M2 44 20 40 39 43 56 34 76 37 94 29 114 31 134 22 151 28 170 18 188 21 207 10 228 14 248 3"
                  fill="none"
                  stroke="#e7b0a4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 44 20 40 39 43 56 34 76 37 94 29 114 31 134 22 151 28 170 18 188 21 207 10 228 14 248 3V54H2Z"
                  fill="#e7b0a4"
                  opacity=".15"
                />
              </svg>
            </div>

            <Link
              href="/harga"
              className="btn btn-white mt-8 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#fffdf7] hover:bg-[#f0ebde] text-[#67151d] font-bold text-xs shadow-md transition-all text-center"
            >
              <span>Buka Rincian Pasar Wilayah</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
              </svg>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
};
