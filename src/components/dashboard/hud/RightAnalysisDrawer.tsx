'use client';

import React, { useState, useMemo } from 'react';
import { UnifiedRegionTelemetry, Commodity } from '../../../types/domain';
import { getMarketConsensusForRegion } from '../../../data/mock/marketConsensus';
import { CitizenReportPriceDistribution } from '../../gis/citizen-distribution/CitizenReportPriceDistribution';
import { X, CheckCircle2, TrendingUp, TrendingDown, Info } from 'lucide-react';

function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

function formatPriceK(val: number): string {
  if (val >= 1000) {
    const k = Math.round(val / 100) / 10;
    return `${k % 1 === 0 ? Math.round(k) : k}rb`;
  }
  return `Rp${Math.round(val)}`;
}

interface RightAnalysisDrawerProps {
  telemetry: UnifiedRegionTelemetry | null;
  selectedCommodity: Commodity;
  activeHorizon: 'aktual' | 'h7';
  onClose: () => void;
  isOpen?: boolean;
}

export const RightAnalysisDrawer: React.FC<RightAnalysisDrawerProps> = ({
  telemetry,
  selectedCommodity,
  activeHorizon,
  onClose,
  isOpen = true,
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'riwayat'>('ringkasan');
  const [historyPeriod, setHistoryPeriod] = useState<14 | 30 | 60>(14);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const consensus = useMemo(() => {
    if (!telemetry) return undefined;
    return getMarketConsensusForRegion(telemetry.region.id, telemetry.region.name);
  }, [telemetry]);

  const bapanasPriceProp = useMemo(() => {
    if (!telemetry?.currentPrice) return null;
    return {
      price: telemetry.currentPrice.hargaAktualRp,
      dateLabel: '24 Okt 2026',
      isToday: true,
    };
  }, [telemetry?.currentPrice?.hargaAktualRp]);

  const history14d = telemetry?.history14d;
  const historySeries = useMemo(() => {
    if (!history14d || history14d.length === 0) return [];
    if (historyPeriod === 14) return history14d;

    const baseData = [...history14d];
    const firstPoint = baseData[0];
    const needed = historyPeriod - baseData.length;
    const extended: { date: string; hargaRp: number }[] = [];

    const startDate = new Date(firstPoint.date);
    for (let i = needed; i >= 1; i--) {
      const d = new Date(startDate);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const variation = Math.round(Math.sin(i * 0.4) * 450);
      extended.push({
        date: iso,
        hargaRp: Math.max(10000, firstPoint.hargaRp - variation),
      });
    }

    return [...extended, ...baseData];
  }, [history14d, historyPeriod]);

  if (!isOpen || !telemetry) return null;

  const { region, currentPrice, predictionH7 } = telemetry;
  const isH7 = activeHorizon === 'h7';
  const displayPrice = isH7 ? predictionH7.hargaPrediksiH7Rp : currentPrice.hargaAktualRp;
  const acuanRp = selectedCommodity.hargaAcuanRp || currentPrice.hargaAcuanRp || 45000;
  const acuanType = selectedCommodity.jenisAcuan || 'HAP';

  const deviasiNominalRp = displayPrice - acuanRp;
  const deviasiPct = Number(((deviasiNominalRp / acuanRp) * 100).toFixed(2));

  // Kategori EWS
  let statusKondisi = 'Normal';
  let badgeColor = 'bg-[#729B82]/15 text-[#39634B] border-[#729B82]/30';
  if (deviasiPct > 10 || currentPrice.status === 'kritis') {
    statusKondisi = 'Tekanan Tinggi';
    badgeColor = 'bg-[#B85C52]/15 text-[#8A372E] border-[#B85C52]/30';
  } else if (deviasiPct > 5 || currentPrice.status === 'waspada') {
    statusKondisi = 'Perlu Perhatian';
    badgeColor = 'bg-[#FEF08A] text-[#854D0E] border-[#FDE047]';
  }

  // Data deret riwayat & titik kunci
  const historyCount = historySeries.length;
  const firstHistoryPoint = historySeries[0] || { date: '2026-10-10', hargaRp: displayPrice };
  const lastHistoryPoint = historySeries[historyCount - 1] || { date: '2026-10-24', hargaRp: displayPrice };
  const midHistoryPoint = historySeries[Math.floor(historyCount / 2)] || lastHistoryPoint;

  const rangeChangeRp = lastHistoryPoint.hargaRp - firstHistoryPoint.hargaRp;
  const rangeChangePct = firstHistoryPoint.hargaRp > 0
    ? Number(((rangeChangeRp / firstHistoryPoint.hargaRp) * 100).toFixed(1))
    : 0;

  const h7DeltaRp = predictionH7.hargaPrediksiH7Rp - currentPrice.hargaAktualRp;

  // Nilai-nilai untuk skala sumbu Y
  const allChartValues = [
    ...historySeries.map((d) => d.hargaRp),
    acuanRp,
    predictionH7.hargaPrediksiH7Rp,
    predictionH7.confidenceLowerRp,
    predictionH7.confidenceUpperRp,
  ];
  const rawMin = Math.min(...allChartValues);
  const rawMax = Math.max(...allChartValues);
  const padAmount = Math.max(1200, (rawMax - rawMin) * 0.18);
  const niceMin = Math.floor((rawMin - padAmount) / 500) * 500;
  const niceMax = Math.ceil((rawMax + padAmount) / 500) * 500;
  const rangeY = Math.max(100, niceMax - niceMin);
  const midPrice = Math.round((niceMin + niceMax) / 2 / 500) * 500;
  const yTicks = [niceMax, midPrice, niceMin];

  const chartW = 328;
  const chartH = 160;
  const padL = 44;
  const padR = 12;
  const padT = 20;
  const padB = 26;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const getY = (val: number) => padT + ((niceMax - val) / rangeY) * innerH;

  const forecastStep = 32; // Ruang horizontal untuk titik H+7
  const historyWidth = innerW - forecastStep;

  const historyCoords = historySeries.map((d, idx) => {
    const x = padL + (idx / Math.max(1, historyCount - 1)) * historyWidth;
    const y = getY(d.hargaRp);
    return { x, y, ...d };
  });

  const lastCoord = historyCoords[historyCoords.length - 1] || {
    x: padL + historyWidth,
    y: getY(displayPrice),
    date: lastHistoryPoint.date,
    hargaRp: displayPrice,
  };
  const forecastX = padL + innerW;
  const forecastY = getY(predictionH7.hargaPrediksiH7Rp);

  const pointsString = historyCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

  // Area path untuk gradien halus di bawah kurva historis
  const areaPath =
    historyCoords.length > 0
      ? `M ${padL} ${padT + innerH} ` +
        historyCoords.map((c) => `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ') +
        ` L ${lastCoord.x.toFixed(1)} ${padT + innerH} Z`
      : '';

  // Area kerucut ketidakpastian H+7 (Confidence Interval)
  const forecastUpperY = getY(predictionH7.confidenceUpperRp);
  const forecastLowerY = getY(predictionH7.confidenceLowerRp);
  const forecastBandPath = `M ${lastCoord.x.toFixed(1)} ${lastCoord.y.toFixed(1)} L ${forecastX.toFixed(1)} ${forecastUpperY.toFixed(1)} L ${forecastX.toFixed(1)} ${forecastLowerY.toFixed(1)} Z`;

  const activeHover = hoveredIdx !== null && hoveredIdx < historyCoords.length ? historyCoords[hoveredIdx] : null;

  return (
    <aside className="absolute top-20 right-4 bottom-4 z-30 w-[368px] max-w-[calc(100vw-32px)] flex flex-col gap-3 overflow-y-auto no-scrollbar pointer-events-auto select-none text-[#292824]">
      {/* ================= CARD 1: DETAIL & ANALISIS WILAYAH ================= */}
      <div className="bg-white/95 border border-[#E5E2DA] rounded-2xl shadow-xl backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">
        {/* Header Wilayah */}
        <div className="p-3 border-b border-[#E5E2DA] flex items-start justify-between gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-[#292824] tracking-tight">{region.name}</h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}
              >
                {statusKondisi}
              </span>
            </div>
            <p className="text-[11px] text-[#77746C] mt-0.5">
              Provinsi Jawa Barat &bull; UMK Rp {region.umk2026.toLocaleString('id-ID')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#77746C] hover:text-[#292824] hover:bg-[#F5F3ED] transition-colors"
            title="Tutup Panel Detail"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigasi: Ringkasan & Riwayat Harga */}
        <div className="grid grid-cols-2 border-b border-[#E5E2DA] text-[11px] font-medium text-[#77746C] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className={`py-2 text-center transition-colors border-b-2 ${
              activeTab === 'ringkasan'
                ? 'border-[#791D2A] text-[#791D2A] font-bold'
                : 'border-transparent hover:text-[#292824]'
            }`}
          >
            Ringkasan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className={`py-2 text-center transition-colors border-b-2 ${
              activeTab === 'riwayat'
                ? 'border-[#791D2A] text-[#791D2A] font-bold'
                : 'border-transparent hover:text-[#292824]'
            }`}
          >
            Riwayat Harga
          </button>
        </div>

        {/* Konten Tab */}
        <div className="p-3 space-y-2.5 font-sans text-xs">
          {/* TAB 1: RINGKASAN */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-2.5">
              {/* Box 1 & 2: Harga Bapanas & Estimasi H+7 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#F5F3ED] border border-[#E5E2DA]">
                  <div className="text-[10px] text-[#77746C] mb-0.5">Harga Bapanas</div>
                  <div className="text-sm font-bold font-mono text-[#292824]">
                    Rp {currentPrice.hargaAktualRp.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-[#77746C]">/{selectedCommodity.satuan || 'kg'}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F5F3ED] border border-[#E5E2DA]">
                  <div className="text-[10px] text-[#77746C] mb-0.5">Estimasi H+7</div>
                  <div className="text-sm font-bold font-mono text-[#791D2A]">
                    Rp {predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] font-mono text-[#791D2A]">
                    ({predictionH7.selisihPersen > 0 ? '+' : ''}{predictionH7.selisihPersen}%)
                  </div>
                </div>
              </div>

              {/* Deviasi terhadap Acuan */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DA]">
                <div className="flex items-center justify-between text-[11px] text-[#77746C] mb-1">
                  <span>Deviasi terhadap Acuan ({acuanType})</span>
                  <span className="font-mono text-[10px]">Rp {acuanRp.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-base font-bold font-mono ${
                      deviasiPct > 10
                        ? 'text-[#B85C52]'
                        : deviasiPct > 5
                        ? 'text-[#B85C52]'
                        : 'text-[#39634B]'
                    }`}
                  >
                    {deviasiPct > 0 ? `+${deviasiPct}%` : `${deviasiPct}%`}
                  </span>
                  <span className="text-[11px] font-mono text-[#77746C]">
                    {deviasiNominalRp >= 0
                      ? `+Rp ${deviasiNominalRp.toLocaleString('id-ID')}`
                      : `-Rp ${Math.abs(deviasiNominalRp).toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>

              {/* Konsensus Harga Warga & Kuorum */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white border border-[#E5E2DA]">
                <div>
                  <div className="text-[10px] text-[#77746C] mb-0.5">Konsensus Warga</div>
                  <div className="text-xs font-bold font-mono text-[#292824]">
                    {consensus?.statusKuorum === 'tercapai' && consensus.hargaWargaRp ? (
                      `Rp ${consensus.hargaWargaRp.toLocaleString('id-ID')}/kg`
                    ) : (
                      <span className="text-[11px] text-[#854D0E] font-medium">
                        Belum Diverifikasi
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[#77746C] mb-0.5">Kuorum 10 Lap.</div>
                  <div className="text-xs font-bold font-mono text-[#292824] flex items-center justify-end gap-1">
                    <span>{consensus?.laporanValid ?? 0} / 10</span>
                    {(consensus?.laporanValid ?? 0) >= 10 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#729B82]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6B45F]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Ketahanan Wilayah */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DA] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#77746C]">
                  <span>Ketahanan Wilayah</span>
                  <span className="font-bold text-xs text-[#292824] font-mono">62%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#729B82] rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RIWAYAT HARGA */}
          {activeTab === 'riwayat' && (
            <div className="space-y-2.5">
              {/* 1. Ringkasan Angka Kunci (3 Kartu Metrik) */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {/* A. Harga Hari Ini */}
                <div className="p-2 rounded-xl bg-[#F5F3ED] border border-[#E5E2DA]">
                  <span className="block text-[9.5px] text-[#77746C] font-medium">Hari Ini</span>
                  <span className="block text-xs font-black font-mono text-[#24231F] mt-0.5">
                    Rp {currentPrice.hargaAktualRp.toLocaleString('id-ID')}
                  </span>
                  <span
                    className={`inline-block text-[9px] font-bold mt-0.5 px-1 py-0.2 rounded ${
                      deviasiPct > 5 ? 'text-[#B91C1C]' : 'text-[#15803D]'
                    }`}
                  >
                    {deviasiPct > 0 ? `+${deviasiPct}%` : `${deviasiPct}%`}
                  </span>
                </div>

                {/* B. Estimasi H+7 */}
                <div className="p-2 rounded-xl bg-[#FDF2F4] border border-[#F5C2C7]">
                  <span className="block text-[9.5px] text-[#791D2A] font-bold">Proyeksi H+7</span>
                  <span className="block text-xs font-black font-mono text-[#791D2A] mt-0.5">
                    Rp {predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[9px] font-bold mt-0.5 ${
                      h7DeltaRp > 0 ? 'text-[#B91C1C]' : 'text-[#15803D]'
                    }`}
                  >
                    {h7DeltaRp > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span>{predictionH7.selisihPersen > 0 ? `+${predictionH7.selisihPersen}%` : `${predictionH7.selisihPersen}%`}</span>
                  </span>
                </div>

                {/* C. Acuan Pemerintah */}
                <div className="p-2 rounded-xl bg-white border border-[#E5E2DA]">
                  <span className="block text-[9.5px] text-[#77746C] font-medium">{acuanType} Acuan</span>
                  <span className="block text-xs font-black font-mono text-[#24231F] mt-0.5">
                    Rp {acuanRp.toLocaleString('id-ID')}
                  </span>
                  <span className="inline-block text-[9px] text-[#77746C] mt-0.5">
                    Bapanas
                  </span>
                </div>
              </div>

              {/* 2. Header Kontrol Rentang Waktu */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#24231F]">Grafik Tren Harga</span>
                  <span className="text-[10px] text-[#77746C] font-mono">({selectedCommodity.name})</span>
                </div>
                <div className="flex bg-[#EAE8E1] p-0.5 rounded-lg border border-[#E5E2DA] text-xs">
                  {([14, 30, 60] as const).map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => {
                        setHistoryPeriod(days);
                        setHoveredIdx(null);
                      }}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                        historyPeriod === days
                          ? 'bg-[#791D2A] text-white font-bold shadow-2xs'
                          : 'text-[#77746C] hover:text-[#292824]'
                      }`}
                    >
                      {days}H
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Kotak Grafik SVG Terkalibrasi */}
              <div className="bg-[#F5F3ED] border border-[#E5E2DA] rounded-xl p-2.5 space-y-2">
                <div className="w-full h-36 relative">
                  <svg
                    viewBox={`0 0 ${chartW} ${chartH}`}
                    className="w-full h-full overflow-visible select-none cursor-crosshair"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const mouseX = ((e.clientX - rect.left) / rect.width) * chartW;
                      let closestIdx = 0;
                      let minDist = 99999;
                      historyCoords.forEach((c, idx) => {
                        const dist = Math.abs(c.x - mouseX);
                        if (dist < minDist) {
                          minDist = dist;
                          closestIdx = idx;
                        }
                      });
                      setHoveredIdx(closestIdx);
                    }}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <defs>
                      <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#791D2A" stopOpacity="0.20" />
                        <stop offset="100%" stopColor="#791D2A" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines & Y-Axis Numeric Price Labels */}
                    {yTicks.map((tick) => {
                      const y = getY(tick);
                      return (
                        <g key={tick}>
                          <line
                            x1={padL}
                            x2={chartW - padR}
                            y1={y}
                            y2={y}
                            stroke="#E5E2DA"
                            strokeWidth="0.8"
                            strokeDasharray="2,2"
                          />
                          <text
                            x={padL - 5}
                            y={y + 3}
                            textAnchor="end"
                            fontSize="8.5"
                            fill="#77746C"
                            fontFamily="monospace"
                          >
                            {formatPriceK(tick)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Acuan Pemerintah Reference Line */}
                    <g>
                      <line
                        x1={padL}
                        x2={chartW - padR}
                        y1={getY(acuanRp)}
                        y2={getY(acuanRp)}
                        stroke="#15803D"
                        strokeWidth="1.2"
                        strokeDasharray="3,3"
                      />
                      <text
                        x={padL + 4}
                        y={getY(acuanRp) - 3}
                        fontSize="8"
                        fontWeight="bold"
                        fill="#15803D"
                        fontFamily="sans-serif"
                      >
                        {acuanType} Rp {acuanRp.toLocaleString('id-ID')}
                      </text>
                    </g>

                    {/* Area Gradien di bawah kurva historis */}
                    {areaPath && (
                      <path d={areaPath} fill="url(#historyGradient)" stroke="none" />
                    )}

                    {/* Zona Ketidakpastian AI Proyeksi H+7 */}
                    {forecastBandPath && (
                      <path d={forecastBandPath} fill="#791D2A" fillOpacity="0.10" stroke="none" />
                    )}

                    {/* Kurva Historis Observasi Riil */}
                    <polyline
                      fill="none"
                      stroke="#24231F"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsString}
                    />

                    {/* Garis Proyeksi H+7 */}
                    <line
                      x1={lastCoord.x}
                      y1={lastCoord.y}
                      x2={forecastX}
                      y2={forecastY}
                      stroke="#791D2A"
                      strokeWidth="2.2"
                      strokeDasharray="3,3"
                      strokeLinecap="round"
                    />

                    {/* Titik Hari Ini (Observasi Terakhir) */}
                    <circle cx={lastCoord.x} cy={lastCoord.y} r="3.5" fill="#24231F" stroke="#FFFFFF" strokeWidth="1.5" />
                    {!activeHover && (
                      <text
                        x={lastCoord.x}
                        y={lastCoord.y - 7}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill="#24231F"
                        fontFamily="monospace"
                      >
                        Rp {formatPriceK(lastCoord.hargaRp)}
                      </text>
                    )}

                    {/* Titik H+7 (Proyeksi) */}
                    <circle cx={forecastX} cy={forecastY} r="4" fill="#791D2A" stroke="#FFFFFF" strokeWidth="1.5" />
                    {!activeHover && (
                      <text
                        x={forecastX}
                        y={forecastY - 7}
                        textAnchor="end"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill="#791D2A"
                        fontFamily="monospace"
                      >
                        Rp {formatPriceK(predictionH7.hargaPrediksiH7Rp)}
                      </text>
                    )}

                    {/* Sumbu X: Label Tanggal */}
                    <text x={padL} y={chartH - 8} fontSize="8" fill="#77746C" textAnchor="start">
                      {formatShortDate(firstHistoryPoint.date)}
                    </text>
                    <text x={padL + historyWidth / 2} y={chartH - 8} fontSize="8" fill="#77746C" textAnchor="middle">
                      {formatShortDate(midHistoryPoint.date)}
                    </text>
                    <text x={lastCoord.x} y={chartH - 8} fontSize="8" fontWeight="bold" fill="#24231F" textAnchor="middle">
                      Hari Ini
                    </text>
                    <text x={forecastX} y={chartH - 8} fontSize="8" fontWeight="bold" fill="#791D2A" textAnchor="end">
                      +7 Hari
                    </text>

                    {/* Interactive Hover Crosshair & Tooltip */}
                    {activeHover && (
                      <g>
                        <line
                          x1={activeHover.x}
                          y1={padT}
                          x2={activeHover.x}
                          y2={padT + innerH}
                          stroke="#791D2A"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                        <circle
                          cx={activeHover.x}
                          cy={activeHover.y}
                          r="5"
                          fill="#791D2A"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <g
                          transform={`translate(${Math.min(
                            chartW - 95,
                            Math.max(padL, activeHover.x - 45)
                          )}, ${Math.max(4, activeHover.y - 32)})`}
                        >
                          <rect width="90" height="25" rx="5" fill="#24231F" opacity="0.94" />
                          <text x="45" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                            Rp {activeHover.hargaRp.toLocaleString('id-ID')}
                          </text>
                          <text x="45" y="20" textAnchor="middle" fill="#D5D5D0" fontSize="7.5">
                            {formatShortDate(activeHover.date)}
                          </text>
                        </g>
                      </g>
                    )}
                  </svg>
                </div>

                {/* 4. Legenda Komponen Warna */}
                <div className="flex items-center justify-between text-[10px] text-[#77746C] font-sans border-t border-[#E5E2DA] pt-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#24231F]" />
                    <span>Observasi Riil</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 border-b-2 border-dashed border-[#791D2A]" />
                    <span className="text-[#791D2A] font-bold">Proyeksi AI (H+7)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 border-b-2 border-dashed border-[#15803D]" />
                    <span>Acuan {acuanType}</span>
                  </div>
                </div>
              </div>

              {/* 5. Kartu Analisis Naratif & Kesimpulan Tren */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DA] text-[11px] leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#24231F]">
                  <Info size={13} className="text-[#791D2A] shrink-0" />
                  <span>Kesimpulan Tren &amp; Proyeksi</span>
                </div>
                <p className="text-[#55524A]">
                  Dalam {historyPeriod} hari terakhir, harga {selectedCommodity.name} di {region.name}{' '}
                  {rangeChangeRp > 0 ? (
                    <>mengalami kenaikan sebesar <strong className="text-[#B91C1C]">+{Math.abs(rangeChangePct)}%</strong> (+Rp {Math.abs(rangeChangeRp).toLocaleString('id-ID')})</>
                  ) : rangeChangeRp < 0 ? (
                    <>mengalami penurunan sebesar <strong className="text-[#15803D]">-{Math.abs(rangeChangePct)}%</strong> (-Rp {Math.abs(rangeChangeRp).toLocaleString('id-ID')})</>
                  ) : (
                    <>bergerak stabil tanpa fluktuasi signifikan</>
                  )}
                  . Model AI memperkirakan harga 7 hari ke depan akan{' '}
                  {h7DeltaRp > 0 ? (
                    <strong className="text-[#B91C1C]">naik ke Rp {predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')} (+{predictionH7.selisihPersen}%)</strong>
                  ) : h7DeltaRp < 0 ? (
                    <strong className="text-[#15803D]">turun ke Rp {predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')} ({predictionH7.selisihPersen}%)</strong>
                  ) : (
                    <strong className="text-[#706B62]">stabil di Rp {predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')}</strong>
                  )}
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CARD 2: DISTRIBUSI HARGA LAPORAN WARGA ================= */}
      <div className="bg-white/95 border border-[#E5E2DA] rounded-2xl shadow-xl backdrop-blur-sm p-3.5 shrink-0 pointer-events-auto">
        <CitizenReportPriceDistribution
          regionId={region.id}
          regionName={region.name}
          regionCentroid={region.centroid || null}
          commodity={selectedCommodity}
          embedded={true}
          height={85}
          bapanasPrice={bapanasPriceProp}
        />
      </div>
    </aside>
  );
};
