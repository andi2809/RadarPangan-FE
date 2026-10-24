'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { getAllRegions, getAllCommodities, getTelemetry } from '@/utils/geo-loader';
import { ChartNoAxesCombined, Calendar, TrendingUp, Layers, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function TrenPage() {
  const regions = useMemo(() => getAllRegions(), []);
  const commodities = useMemo(() => getAllCommodities(), []);

  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.16'); // Kab. Bekasi
  const [selectedCommodity, setSelectedCommodity] = useState<string>('cabai_rawit_merah');
  const [horizon, setHorizon] = useState<'14d' | '30d'>('14d');

  const telem = useMemo(() => {
    return getTelemetry(selectedCommodity, selectedRegionId);
  }, [selectedCommodity, selectedRegionId]);

  const activeRegion = useMemo(() => {
    return regions.find((r) => r.id === selectedRegionId) || regions[0];
  }, [regions, selectedRegionId]);

  const historyPoints = telem?.history14d || [
    { date: '10 Okt', hargaRp: 45000 },
    { date: '12 Okt', hargaRp: 45600 },
    { date: '14 Okt', hargaRp: 47000 },
    { date: '16 Okt', hargaRp: 46200 },
    { date: '18 Okt', hargaRp: 47900 },
    { date: '20 Okt', hargaRp: 46900 },
    { date: '22 Okt', hargaRp: 48700 },
    { date: '24 Okt', hargaRp: 48200 },
  ];

  return (
    <GISLayout>
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end border-b border-[#DED8CD] pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#74151C]">
            <ChartNoAxesCombined size={15} />
            Riwayat & Tren Pergerakan Harga
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-[#24231F]">
            Analisis Fluktuasi & Historis Harga Pangan
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#706B62] max-w-2xl">
            Pantau volatilitas pasar, tren 14–30 hari terakhir, deviasi dari Harga Acuan Penjualan (HAP), serta validasi kurva proyeksi ARIMA H+7.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#74151C] text-white text-xs font-bold hover:bg-[#580F15] transition shadow-sm"
        >
          <Layers size={14} />
          <span>Buka Peta Spasial</span>
        </Link>
      </section>

      {/* Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-[#DED8CD] shadow-sm">
        <div>
          <label className="block text-xs font-bold text-[#706B62] mb-1.5">Wilayah Analisis:</label>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#D8D1C5] text-xs font-bold text-[#24231F] outline-none focus:border-[#74151C]"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#706B62] mb-1.5">Komoditas:</label>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[#D8D1C5] text-xs font-bold text-[#24231F] outline-none focus:border-[#74151C]"
          >
            <option value="cabai_rawit_merah">Cabai Rawit Merah</option>
            <option value="bawang_merah">Bawang Merah</option>
            <option value="beras_medium">Beras Medium</option>
            <option value="telur_ayam_ras">Telur Ayam Ras</option>
            <option value="minyakita">Minyakita</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#706B62] mb-1.5">Rentang Waktu:</label>
          <div className="flex h-10 rounded-lg border border-[#D8D1C5] p-1 bg-white">
            <button
              onClick={() => setHorizon('14d')}
              className={`flex-1 rounded-md text-xs font-semibold transition ${
                horizon === '14d' ? 'bg-[#74151C] text-white shadow-sm' : 'text-[#706B62] hover:bg-[#F2EEE7]'
              }`}
            >
              14 Hari Terakhir
            </button>
            <button
              onClick={() => setHorizon('30d')}
              className={`flex-1 rounded-md text-xs font-semibold transition ${
                horizon === '30d' ? 'bg-[#74151C] text-white shadow-sm' : 'text-[#706B62] hover:bg-[#F2EEE7]'
              }`}
            >
              30 Hari (Bulanan)
            </button>
          </div>
        </div>
      </div>

      {/* Main Trend Chart Section */}
      <div className="rounded-xl border border-[#DED8CD] bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0ECE4] pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#24231F]">
              Kurva Tren Historis vs Acuan Pemerintah (HAP)
            </h3>
            <p className="text-xs text-[#706B62] mt-0.5">
              Wilayah: <strong className="text-[#24231F]">{activeRegion.name}</strong> &bull; Komoditas:{' '}
              <strong className="text-[#74151C]">Cabai Rawit Merah</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#24231F]">
              <span className="w-3.5 h-1 bg-[#DC4840] rounded-full inline-block" />
              <span>Harga Riil Pasar</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#706B62]">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#16A34A] inline-block" />
              <span>HAP Acuan (Rp 45.000)</span>
            </span>
          </div>
        </div>

        {/* SVG Detailed Graph */}
        <div className="h-64 w-full flex items-center justify-center bg-[#FAF6EE]/50 rounded-xl border border-[#DED8CD] p-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
            {/* Horizontal Grid lines */}
            <line x1="40" y1="30" x2="580" y2="30" stroke="#E2DDD2" strokeWidth="1" strokeDasharray="3,3" />
            <text x="35" y="34" textAnchor="end" fontSize="10" fill="#898277" fontFamily="monospace">
              Rp 52K
            </text>

            <line x1="40" y1="80" x2="580" y2="80" stroke="#E2DDD2" strokeWidth="1" strokeDasharray="3,3" />
            <text x="35" y="84" textAnchor="end" fontSize="10" fill="#898277" fontFamily="monospace">
              Rp 48K
            </text>

            <line x1="40" y1="130" x2="580" y2="130" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="35" y="134" textAnchor="end" fontSize="10" fill="#16A34A" fontWeight="bold" fontFamily="monospace">
              Rp 45K (HAP)
            </text>

            {/* Price Line */}
            <path
              d="M 50,130 L 115,124 L 180,95 L 245,110 L 310,82 L 375,102 L 440,68 L 505,78"
              fill="none"
              stroke="#DC4840"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Projection Line */}
            <path
              d="M 505,78 L 570,45"
              fill="none"
              stroke="#DC4840"
              strokeWidth="2.5"
              strokeDasharray="5,5"
              strokeLinecap="round"
            />

            {/* Points */}
            <circle cx="50" cy="130" r="4" fill="#DC4840" />
            <circle cx="115" cy="124" r="4" fill="#DC4840" />
            <circle cx="180" cy="95" r="4" fill="#DC4840" />
            <circle cx="245" cy="110" r="4" fill="#DC4840" />
            <circle cx="310" cy="82" r="4" fill="#DC4840" />
            <circle cx="375" cy="102" r="4" fill="#DC4840" />
            <circle cx="440" cy="68" r="4" fill="#DC4840" />
            <circle cx="505" cy="78" r="5" fill="#74151C" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="570" cy="45" r="5" fill="#DC4840" stroke="#FFFFFF" strokeWidth="2" />

            {/* Point Labels */}
            <text x="50" y="165" textAnchor="middle" fontSize="10" fill="#706B62">10 Okt</text>
            <text x="115" y="165" textAnchor="middle" fontSize="10" fill="#706B62">12 Okt</text>
            <text x="180" y="165" textAnchor="middle" fontSize="10" fill="#706B62">14 Okt</text>
            <text x="245" y="165" textAnchor="middle" fontSize="10" fill="#706B62">16 Okt</text>
            <text x="310" y="165" textAnchor="middle" fontSize="10" fill="#706B62">18 Okt</text>
            <text x="375" y="165" textAnchor="middle" fontSize="10" fill="#706B62">20 Okt</text>
            <text x="440" y="165" textAnchor="middle" fontSize="10" fill="#706B62">22 Okt</text>
            <text x="505" y="165" textAnchor="middle" fontSize="10" fill="#24231F" fontWeight="bold">Hari Ini</text>
            <text x="570" y="165" textAnchor="middle" fontSize="10" fill="#DC4840" fontWeight="bold">Proyeksi H+7</text>
          </svg>
        </div>

        {/* Statistical Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-lg border border-[#DED8CD] p-3.5 bg-[#FBF9F4]">
            <p className="text-[11px] font-bold text-[#706B62]">Rata-Rata Bergerak 7 Hari</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-[#24231F]">Rp 47.729</p>
            <p className="text-[10px] text-[#898277] mt-0.5">+6,06% terhadap acuan HAP</p>
          </div>

          <div className="rounded-lg border border-[#DED8CD] p-3.5 bg-[#FBF9F4]">
            <p className="text-[11px] font-bold text-[#706B62]">Volatilitas Harga</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-[#96620A]">Sedang (4,2%)</p>
            <p className="text-[10px] text-[#898277] mt-0.5">Rentang Rp 45.000 – Rp 48.700</p>
          </div>

          <div className="rounded-lg border border-[#DED8CD] p-3.5 bg-[#FBF9F4]">
            <p className="text-[11px] font-bold text-[#706B62]">Model Prediksi ARIMA</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-[#DC4840]">Rp 50.400</p>
            <p className="text-[10px] text-[#898277] mt-0.5">Akurasi Conf 95%: ±Rp 2.520</p>
          </div>
        </div>
      </div>
    </GISLayout>
  );
}
