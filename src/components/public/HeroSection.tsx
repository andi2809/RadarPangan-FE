'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import commoditiesData from '../../data/mock/commodities.json';
import telemetryData from '../../data/mock/telemetry.json';

interface HistoryEntry {
  date: string;
  hargaRp: number;
}

const SAMPLE_REGION_ID = '32.75'; // Kota Bekasi
const SAMPLE_REGION_NAME = 'Kota Bekasi, Jawa Barat';

const DATA_SOURCES = [
  {
    id: 'bapanas',
    institution: 'Badan Pangan Nasional (Bapanas)',
    dataType: 'Panel Harga Pangan & Acuan HAP/HET',
    description:
      'Digunakan sebagai rujukan harga rata-rata tingkat konsumen kabupaten/kota serta standar Harga Acuan Penjualan (HAP) dan Harga Eceran Tertinggi (HET).',
    schedule: 'Pembaruan Harian (Observasi Pasar)',
    url: 'https://panelharga.badanpangan.go.id/',
    urlLabel: 'panelharga.badanpangan.go.id',
    accentColor: '#67151d',
  },
  {
    id: 'bi-pihps',
    institution: 'Bank Indonesia — PIHPS Nasional',
    dataType: 'Survei Harga Pangan Strategis',
    description:
      'Digunakan sebagai pembanding pergerakan harga harian komoditas pangan bergejolak (volatile food) pada pasar tradisional di berbagai daerah.',
    schedule: 'Pembaruan Harian Hari Kerja',
    url: 'https://www.bi.go.id/hargapangan',
    urlLabel: 'bi.go.id/hargapangan',
    accentColor: '#92400e',
  },
  {
    id: 'bps',
    institution: 'Badan Pusat Statistik (BPS)',
    dataType: 'Statistik UMK, Populasi & Garis Kemiskinan',
    description:
      'Digunakan untuk menghitung indikator keterjangkauan harga pangan terhadap Upah Minimum Kabupaten/Kota (UMK) dan pengeluaran dasar rumah tangga.',
    schedule: 'Publikasi Tahunan & Berkala Resmi',
    url: 'https://jabar.bps.go.id/',
    urlLabel: 'jabar.bps.go.id',
    accentColor: '#347b56',
  },
  {
    id: 'geospasial',
    institution: 'BIG & Kemendagri',
    dataType: 'Batas Administrasi Wilayah (GeoJSON)',
    description:
      'Geometri batas wilayah administrasi 38 provinsi dan 507 kabupaten/kota yang digunakan untuk menampilkan peta persebaran harga pangan.',
    schedule: 'Standar Geospasial Wilayah',
    url: 'https://tanahair.indonesia.go.id/',
    urlLabel: 'tanahair.indonesia.go.id',
    accentColor: '#1e221f',
  },
];

function formatShortDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${day} ${months[monthIdx] || 'Okt'}`;
}

export const HeroSection: React.FC = () => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('cabai_rawit_merah');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeCommodity = useMemo(() => {
    return commoditiesData.find((c) => c.id === selectedCommodityId) || commoditiesData[1];
  }, [selectedCommodityId]);

  const activeTelemetry = useMemo(() => {
    const commMap = (telemetryData as Record<string, Record<string, any>>)[activeCommodity.id] || {};
    return commMap[SAMPLE_REGION_ID] || commMap['32.01'];
  }, [activeCommodity.id]);

  const history: HistoryEntry[] = activeTelemetry?.history14d || [];
  const currentPriceRp: number = activeTelemetry?.currentPrice?.hargaAktualRp || activeCommodity.hargaAcuanRp;
  const referencePriceRp: number = activeCommodity.hargaAcuanRp;
  const diffPercent: number = activeTelemetry?.currentPrice?.selisihPersen ?? 0;
  const observationDate: string = activeTelemetry?.currentPrice?.date || '2026-10-23';

  // Compute SVG chart coordinates dynamically from real 14-day history + reference price
  const chartGeometry = useMemo(() => {
    const values = history.map((h) => h.hargaRp).concat([referencePriceRp]);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const pad = Math.max((rawMax - rawMin) * 0.25, referencePriceRp * 0.06);
    const minVal = Math.max(0, Math.floor((rawMin - pad) / 500) * 500);
    const maxVal = Math.ceil((rawMax + pad) / 500) * 500;
    const range = Math.max(maxVal - minVal, 1000);

    const leftX = 56;
    const rightX = 486;
    const topY = 24;
    const bottomY = 168;
    const width = rightX - leftX;
    const height = bottomY - topY;

    const toY = (val: number) => bottomY - ((val - minVal) / range) * height;
    const points = history.map((h, i) => {
      const x = leftX + (i / Math.max(1, history.length - 1)) * width;
      const y = toY(h.hargaRp);
      return { x, y, date: h.date, label: formatShortDate(h.date), price: h.hargaRp };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPath =
      points.length > 0
        ? `${linePath} L${points[points.length - 1].x.toFixed(1)} ${bottomY} L${points[0].x.toFixed(1)} ${bottomY} Z`
        : '';

    const hapY = toY(referencePriceRp);
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
      const val = Math.round(minVal + (1 - t) * range);
      const y = topY + t * height;
      return { val, y };
    });

    return { points, linePath, areaPath, hapY, ticks, leftX, rightX, bottomY };
  }, [history, referencePriceRp]);

  const hoveredPoint = hoveredIdx !== null ? chartGeometry.points[hoveredIdx] : null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f8f4e9] border-b border-[#ded8c8]" id="beranda">
      <div className="public-container">
        {/* Main Hero Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy Column (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0ebde] text-[#67151d] text-[11px] sm:text-xs font-mono font-bold tracking-wider border border-[#d6cebe] max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#4b9d73] flex-shrink-0" />
              <span className="truncate">PEMANTAUAN HARGA &bull; TRANSPARANSI DATA PUBLIK</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-[#1e221f] tracking-tight leading-[1.08]">
              Harga Pangan{' '}
              <span className="text-[#67151d] block sm:inline">Tidak Menunggu</span>{' '}
              Kita Siap.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#4a4b44] leading-relaxed max-w-2xl">
              Radar Pangan menyajikan informasi perkembangan harga komoditas pokok menurut wilayah, perbandingan terhadap acuan pemerintah, serta perubahan harga dari waktu ke waktu agar masyarakat dan pemangku kepentingan dapat memantau kondisi pasar dengan lebih jernih.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-2">
              <a
                href="#peta"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-base shadow-sm transition-all"
              >
                <span>Jelajahi Peta Wilayah</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                  />
                </svg>
              </a>
              <Link
                href="/lapor"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#fffdf7] hover:bg-[#f0ebde] text-[#1e221f] font-bold text-base border border-[#cfc8b8] shadow-sm transition-all"
              >
                <span>Laporkan Harga Pasar</span>
              </Link>
            </div>
          </div>

          {/* Right Interactive Preview Card (5 cols on Desktop) */}
          <div className="lg:col-span-5 min-w-0">
            <article className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
              {/* Top Row: Location & Commodity Selector (No status badge!) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5dfd0]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#5c5b52] block">
                    Sampel Pantauan Wilayah
                  </span>
                  <strong className="text-base font-extrabold text-[#1e221f]">
                    {SAMPLE_REGION_NAME}
                  </strong>
                </div>

                <div className="relative">
                  <label htmlFor="heroCommoditySelect" className="sr-only">
                    Pilih Komoditas
                  </label>
                  <select
                    id="heroCommoditySelect"
                    value={selectedCommodityId}
                    onChange={(e) => setSelectedCommodityId(e.target.value)}
                    className="w-full sm:w-auto appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] border border-[#bfb7a6] text-sm font-bold text-[#67151d] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#67151d]"
                  >
                    {commoditiesData.map((comm) => (
                      <option key={comm.id} value={comm.id}>
                        {comm.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="w-4 h-4 text-[#67151d] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Price Summary Row */}
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div className="text-xs text-[#5c5b52] font-medium mb-1">
                    Harga Rata-Rata Observasi ({formatShortDate(observationDate)} 2026)
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono tabular-nums text-3xl sm:text-4xl font-black text-[#1e221f]">
                      Rp {currentPriceRp.toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm font-semibold text-[#5c5b52]">
                      /{activeCommodity.satuan}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-[#5c5b52] font-medium mb-1">
                    Acuan {activeCommodity.jenisAcuan === 'HET' ? 'HET' : 'HAP'} Pemerintah
                  </div>
                  <div className="font-mono tabular-nums text-sm font-bold text-[#1e221f]">
                    Rp {referencePriceRp.toLocaleString('id-ID')}/{activeCommodity.satuan}{' '}
                    <span
                      className={`inline-block ml-1 px-2 py-0.5 rounded text-xs ${
                        diffPercent > 5
                          ? 'bg-[#f8ded8] text-[#991b1b]'
                          : diffPercent > 0
                          ? 'bg-[#fef3c7] text-[#92400e]'
                          : 'bg-[#dcfce7] text-[#166534]'
                      }`}
                    >
                      {diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Historical 14-Day SVG Chart */}
              <div className="bg-[#f8f4e9] rounded-xl p-3.5 sm:p-4 border border-[#e5dfd0] relative">
                {hoveredPoint && (
                  <div className="mb-2 px-3 py-1.5 rounded-lg bg-[#1e221f] text-[#fffdf7] text-xs font-mono flex items-center justify-between">
                    <span>Tanggal: {hoveredPoint.label} 2026</span>
                    <strong>
                      Rp {hoveredPoint.price.toLocaleString('id-ID')}/{activeCommodity.satuan}
                    </strong>
                  </div>
                )}

                <svg
                  className="w-full h-auto block"
                  viewBox="0 0 500 200"
                  role="img"
                  aria-label={`Grafik riwayat harga ${activeCommodity.name} di ${SAMPLE_REGION_NAME}`}
                >
                  <defs>
                    <linearGradient id="heroChartArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#67151d" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#67151d" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines & Y-Axis Labels */}
                  {chartGeometry.ticks.map((tick, idx) => (
                    <g key={idx}>
                      <line
                        x1={chartGeometry.leftX}
                        y1={tick.y}
                        x2={chartGeometry.rightX}
                        y2={tick.y}
                        stroke="#e2dcd0"
                        strokeWidth="1"
                      />
                      <text
                        x={chartGeometry.leftX - 8}
                        y={tick.y + 4}
                        textAnchor="end"
                        fill="#5c5b52"
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        {(tick.val / 1000).toFixed(1).replace('.0', '')}rb
                      </text>
                    </g>
                  ))}

                  {/* Reference HAP / HET Line */}
                  <line
                    x1={chartGeometry.leftX}
                    y1={chartGeometry.hapY}
                    x2={chartGeometry.rightX}
                    y2={chartGeometry.hapY}
                    stroke="#92400e"
                    strokeWidth="1.8"
                    strokeDasharray="5 4"
                  />

                  {/* Filled Area & Price Curve */}
                  {chartGeometry.areaPath && (
                    <path d={chartGeometry.areaPath} fill="url(#heroChartArea)" />
                  )}
                  {chartGeometry.linePath && (
                    <path
                      d={chartGeometry.linePath}
                      fill="none"
                      stroke="#67151d"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data Points */}
                  {chartGeometry.points.map((pt, idx) => (
                    <g
                      key={pt.date}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className="cursor-pointer"
                    >
                      <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredIdx === idx || idx === chartGeometry.points.length - 1 ? 4.5 : 3}
                        fill={hoveredIdx === idx ? '#1e221f' : '#67151d'}
                        stroke="#fffdf7"
                        strokeWidth="1.5"
                      />
                    </g>
                  ))}

                  {/* X-Axis Labels (Every 3 days) */}
                  {chartGeometry.points
                    .filter((_, i) => i % 3 === 0)
                    .map((pt, idx, arr) => (
                      <text
                        key={pt.date}
                        x={pt.x}
                        y={chartGeometry.bottomY + 20}
                        textAnchor={idx === arr.length - 1 ? 'end' : idx === 0 ? 'start' : 'middle'}
                        fill="#5c5b52"
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        {pt.label}
                      </text>
                    ))}
                </svg>

                {/* Chart Legend */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-[#e5dfd0] text-xs text-[#4a4b44] font-medium">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#67151d] inline-block" />
                    <span>Riwayat Harga 14 Hari ({activeCommodity.name})</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-0 border-b-2 border-dashed border-[#92400e] inline-block" />
                    <span>Acuan Pemerintah (Rp {referencePriceRp.toLocaleString('id-ID')})</span>
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Section B: Sumber Data Terbuka (Informative & Interactive Grid) */}
        <div className="mt-14 sm:mt-16 pt-10 border-t border-[#d6cebe]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1e221f] tracking-tight">
                Sumber Data Terbuka yang Digunakan
              </h2>
              <p className="text-sm sm:text-base text-[#5c5b52] mt-1 max-w-2xl">
                Pilih masing-masing lembaga untuk meninjau portal publikasi resmi yang menjadi rujukan data harga, daya beli, dan batas administrasi wilayah pada sistem ini.
              </p>
            </div>
            <Link
              href="/metodologi"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#67151d] hover:underline flex-shrink-0"
            >
              <span>Dokumentasi Metodologi &amp; Sumber Data</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {DATA_SOURCES.map((src) => (
              <a
                key={src.id}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#fffdf7] hover:bg-[#f4efe2] border border-[#d6cebe] hover:border-[#67151d] rounded-xl p-5 transition-all flex flex-col justify-between shadow-sm hover:shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-bold text-xs flex-shrink-0"
                      style={{ backgroundColor: src.accentColor }}
                    >
                      {src.id === 'bapanas' && 'BPN'}
                      {src.id === 'bi-pihps' && 'BI'}
                      {src.id === 'bps' && 'BPS'}
                      {src.id === 'geospasial' && 'GEO'}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#67151d] group-hover:translate-x-0.5 transition-transform">
                      <span>Buka Sumber</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                        <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                      </svg>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1e221f] group-hover:text-[#67151d] transition-colors">
                    {src.institution}
                  </h3>
                  <div className="text-xs font-bold text-[#67151d] mt-0.5 mb-2">
                    {src.dataType}
                  </div>
                  <p className="text-sm text-[#4a4b44] leading-relaxed mb-4">
                    {src.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e8e2d4] flex items-center justify-between gap-2 text-xs text-[#5c5b52] font-mono">
                  <span>{src.schedule}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
