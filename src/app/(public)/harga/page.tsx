'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import regionsData from '../../../data/mock/regions.json';
import commoditiesData from '../../../data/mock/commodities.json';
import telemetryData from '../../../data/mock/telemetry.json';

function formatShortDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${day} ${months[monthIdx] || 'Okt'}`;
}

export default function DetailHargaPage() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.75');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('cabai_rawit_merah');

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const r = params.get('region');
    const c = params.get('commodity');
    if (r && regionsData.some((reg) => reg.id === r)) {
      setSelectedRegionId(r);
    }
    if (c && commoditiesData.some((comm) => comm.id === c)) {
      setSelectedCommodityId(c);
    }
  }, []);

  const sortedRegions = useMemo(
    () => [...regionsData].sort((a, b) => a.name.localeCompare(b.name, 'id')),
    []
  );

  const selectedRegion = useMemo(
    () => regionsData.find((r) => r.id === selectedRegionId) || regionsData[0],
    [selectedRegionId]
  );

  const selectedComm = useMemo(
    () => commoditiesData.find((c) => c.id === selectedCommodityId) || commoditiesData[1],
    [selectedCommodityId]
  );

  const regionTelemetry = useMemo(() => {
    const commMap = (telemetryData as Record<string, Record<string, any>>)[selectedComm.id] || {};
    return commMap[selectedRegion.id] || commMap['32.01'];
  }, [selectedComm.id, selectedRegion.id]);

  // All 27 regions comparison for selected commodity
  const allRegionsComparison = useMemo(() => {
    const commMap = (telemetryData as Record<string, Record<string, any>>)[selectedComm.id] || {};
    return sortedRegions.map((reg) => {
      const t = commMap[reg.id];
      return {
        id: reg.id,
        name: reg.name,
        umk2026: reg.umk2026,
        priceRp: t?.currentPrice?.hargaAktualRp || selectedComm.hargaAcuanRp,
        diffPct: t?.currentPrice?.selisihPersen ?? 0,
        status: t?.currentPrice?.status || 'aman',
        umkBurdenPct: t?.affordability?.umkRatioBasketPercent ?? 0,
      };
    });
  }, [selectedComm, sortedRegions]);

  const currentPrice = regionTelemetry?.currentPrice?.hargaAktualRp || selectedComm.hargaAcuanRp;
  const referencePrice = selectedComm.hargaAcuanRp;
  const deviasiPct = regionTelemetry?.currentPrice?.selisihPersen ?? 0;
  const umkRatioPct = regionTelemetry?.affordability?.umkRatioBasketPercent ?? 0;
  const history: { date: string; hargaRp: number }[] = regionTelemetry?.history14d || [];

  // SVG Chart Geometry
  const chartGeom = useMemo(() => {
    const vals = history.map((h) => h.hargaRp).concat([referencePrice]);
    const minV = Math.max(0, Math.floor((Math.min(...vals) * 0.92) / 500) * 500);
    const maxV = Math.ceil((Math.max(...vals) * 1.08) / 500) * 500;
    const span = Math.max(maxV - minV, 1000);

    const leftX = 64;
    const rightX = 760;
    const topY = 24;
    const bottomY = 195;
    const w = rightX - leftX;
    const h = bottomY - topY;
    const toY = (v: number) => bottomY - ((v - minV) / span) * h;

    const pts = history.map((item, i) => ({
      x: leftX + (i / Math.max(1, history.length - 1)) * w,
      y: toY(item.hargaRp),
      label: formatShortDate(item.date),
      price: item.hargaRp,
    }));

    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const hapY = toY(referencePrice);
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      val: Math.round(minV + (1 - t) * span),
      y: topY + t * h,
    }));

    return { pts, line, hapY, ticks, leftX, rightX, bottomY };
  }, [history, referencePrice]);

  return (
    <div className="py-12 md:py-16 bg-[#f8f4e9]">
      <div className="public-container space-y-10">
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="text-sm text-[#5c5b52] flex flex-wrap items-center gap-2 font-medium">
            <Link href="/" className="hover:text-[#67151d] hover:underline">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/#peta" className="hover:text-[#67151d] hover:underline">
              Persebaran Harga
            </Link>
            <span>/</span>
            <span className="text-[#1e221f] font-bold">{selectedRegion.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Detail Harga Wilayah: {selectedRegion.name}
          </h1>
          <p className="text-base sm:text-lg text-[#4a4b44] max-w-3xl leading-relaxed">
            Menampilkan data observasi harga komoditas pokok, perbandingan terhadap standar{' '}
            {selectedComm.jenisAcuan === 'HET' ? 'HET' : 'HAP'} Pemerintah (Rp{' '}
            {referencePrice.toLocaleString('id-ID')}/{selectedComm.satuan}), serta perbandingan lintas kabupaten/kota di Jawa Barat.
          </p>
        </div>

        {/* High-Contrast Filter Controls */}
        <div className="bg-[#fffdf7] border border-[#cfc8b8] rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <div className="md:col-span-5 space-y-1.5">
              <label
                htmlFor="detailRegionSelect"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1e221f]"
              >
                Pilih Kabupaten / Kota (27 Wilayah)
              </label>
              <select
                id="detailRegionSelect"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none"
              >
                {sortedRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label
                htmlFor="detailCommoditySelect"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#1e221f]"
              >
                Pilih Komoditas Pangan
              </label>
              <select
                id="detailCommoditySelect"
                value={selectedCommodityId}
                onChange={(e) => setSelectedCommodityId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#67151d]/40 focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none"
              >
                {commoditiesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Acuan Rp {c.hargaAcuanRp.toLocaleString('id-ID')}/{c.satuan})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <Link
                href="/lapor"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-sm transition-colors text-center"
              >
                Lapor Harga
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Key Indicator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#5c5b52]">
              Harga Observasi Wilayah
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-[#1e221f]">
              Rp {currentPrice.toLocaleString('id-ID')}/{selectedComm.satuan}
            </div>
            <div
              className={`text-xs sm:text-sm font-bold ${
                deviasiPct > 5 ? 'text-[#991b1b]' : deviasiPct > 0 ? 'text-[#92400e]' : 'text-[#166534]'
              }`}
            >
              {deviasiPct > 0 ? `+${deviasiPct}% di atas acuan` : `${deviasiPct}% terhadap acuan`}
            </div>
          </div>

          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#5c5b52]">
              Standar {selectedComm.jenisAcuan === 'HET' ? 'HET' : 'HAP'} Pemerintah
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-[#92400e]">
              Rp {referencePrice.toLocaleString('id-ID')}/{selectedComm.satuan}
            </div>
            <div className="text-xs sm:text-sm text-[#5c5b52]">
              Acuan resmi Badan Pangan Nasional
            </div>
          </div>

          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#5c5b52]">
              Indikator Kewajaran Harga
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#1e221f] flex items-center gap-2 pt-1">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  deviasiPct > 10
                    ? 'bg-[#e85b4f]'
                    : deviasiPct > 5
                    ? 'bg-[#e69b39]'
                    : 'bg-[#4b9d73]'
                }`}
              />
              <span>
                {deviasiPct > 10
                  ? 'Di Atas Acuan'
                  : deviasiPct > 5
                  ? 'Fluktuasi Sedang'
                  : 'Sesuai Acuan'}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-[#5c5b52]">
              Tanggal data: 23 Oktober 2026
            </div>
          </div>

          <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-5 shadow-sm space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#5c5b52]">
              UMK Daerah &amp; Beban Pangan
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-[#67151d]">
              {umkRatioPct}% thd. UMK
            </div>
            <div className="text-xs sm:text-sm text-[#5c5b52]">
              UMK 2026: Rp {(selectedRegion.umk2026 / 1000000).toFixed(2)} Juta
            </div>
          </div>
        </div>

        {/* Historical 14-Day Chart */}
        <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#67151d] block mb-1">
              Riwayat Observasi 14 Hari
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
              Pergerakan Harga {selectedComm.name} di {selectedRegion.name}
            </h2>
            <p className="text-sm text-[#5c5b52] mt-0.5">
              Garis marun menunjukkan harga observasi harian (9–23 Oktober 2026); garis hijau putus-putus adalah standar acuan pemerintah.
            </p>
          </div>

          <div className="p-4 bg-[#f8f4e9] rounded-xl border border-[#e5dfd0] overflow-x-auto">
            <svg viewBox="0 0 790 225" className="w-full h-auto block">
              {chartGeom.ticks.map((t, idx) => (
                <g key={idx}>
                  <line
                    x1={chartGeom.leftX}
                    y1={t.y}
                    x2={chartGeom.rightX}
                    y2={t.y}
                    stroke="#e2dcd0"
                    strokeWidth="1"
                  />
                  <text
                    x={chartGeom.leftX - 10}
                    y={t.y + 4}
                    textAnchor="end"
                    fill="#5c5b52"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    Rp {(t.val / 1000).toFixed(1).replace('.0', '')}rb
                  </text>
                </g>
              ))}

              <line
                x1={chartGeom.leftX}
                y1={chartGeom.hapY}
                x2={chartGeom.rightX}
                y2={chartGeom.hapY}
                stroke="#347b56"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={chartGeom.rightX - 8}
                y={chartGeom.hapY - 8}
                textAnchor="end"
                fill="#166534"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                Acuan: Rp {referencePrice.toLocaleString('id-ID')}
              </text>

              <path
                d={chartGeom.line}
                fill="none"
                stroke="#67151d"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartGeom.pts.map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#67151d" stroke="#fffdf7" strokeWidth="1.5" />
                  {(i % 2 === 0 || i === chartGeom.pts.length - 1) && (
                    <text
                      x={pt.x}
                      y={chartGeom.bottomY + 20}
                      textAnchor="middle"
                      fill="#4a4b44"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {pt.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* All 27 Regencies Comparison Table */}
        <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e5dfd0]">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
                Perbandingan Harga 27 Kabupaten/Kota Jawa Barat
              </h2>
              <p className="text-sm text-[#5c5b52] mt-0.5">
                Klik baris wilayah untuk melihat grafik detail wilayah tersebut.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-[#f0ebde] text-[#67151d] border border-[#cfc8b8]">
              Komoditas: {selectedComm.name}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#d6cebe] text-[#5c5b52] text-xs font-mono uppercase">
                  <th className="py-3 px-3">Kabupaten / Kota</th>
                  <th className="py-3 px-3 text-right">Harga Rata-Rata</th>
                  <th className="py-3 px-3 text-right">Selisih thd. Acuan</th>
                  <th className="py-3 px-3 text-right">UMK 2026</th>
                  <th className="py-3 px-3 text-center">Status Indikator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e2d4]">
                {allRegionsComparison.map((row) => {
                  const isCurrent = row.id === selectedRegionId;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRegionId(row.id)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'bg-[#f4e8e9]/70 font-bold' : 'hover:bg-[#f8f4e9]'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-[#1e221f]">{row.name}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#1e221f]">
                        Rp {row.priceRp.toLocaleString('id-ID')}/{selectedComm.satuan}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono tabular-nums font-bold ${
                          row.diffPct > 5
                            ? 'text-[#991b1b]'
                            : row.diffPct > 0
                            ? 'text-[#92400e]'
                            : 'text-[#166534]'
                        }`}
                      >
                        {row.diffPct > 0 ? `+${row.diffPct}%` : `${row.diffPct}%`}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#5c5b52]">
                        Rp {(row.umk2026 / 1000000).toFixed(2)} Jt
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            row.status === 'kritis'
                              ? 'bg-[#f8ded8] text-[#991b1b]'
                              : row.status === 'waspada'
                              ? 'bg-[#fef3c7] text-[#92400e]'
                              : 'bg-[#dcfce7] text-[#166534]'
                          }`}
                        >
                          {row.status === 'kritis'
                            ? 'Di Atas Acuan'
                            : row.status === 'waspada'
                            ? 'Waspada'
                            : 'Sesuai Acuan'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
