'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UnifiedRegionTelemetry, Commodity } from '../../../types/domain';
import { OTHER_COMMODITY_SPARKLINES } from '../../../data/mock/dashboardData';

interface BottomTelemetryDockProps {
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  selectedCommodity: Commodity;
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onSelectCommodity?: (id: string) => void;
  isDrawerOpen?: boolean;
}

export const BottomTelemetryDock: React.FC<BottomTelemetryDockProps> = ({
  allTelemetry,
  selectedCommodity,
  selectedRegionId,
  onSelectRegion,
  onSelectCommodity,
  isDrawerOpen = true,
}) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const acuanRp = selectedCommodity.hargaAcuanRp || 45000;
  const acuanLabel = selectedCommodity.jenisAcuan || 'HAP';

  // 1. Hitung Top 5 Deviasi Tertinggi secara dinamis dari data aktual
  const topDeviations = useMemo(() => {
    const list = Object.values(allTelemetry).map((telem) => {
      const hargaObservasi = telem.currentPrice?.hargaAktualRp || 0;
      const deviasiRp = hargaObservasi - acuanRp;
      const deviasiPct = Number(((deviasiRp / acuanRp) * 100).toFixed(2));
      return {
        regionId: telem.region.id,
        regionName: telem.region.name,
        hargaObservasi,
        hargaAcuan: acuanRp,
        deviasiRp,
        deviasiPct,
        status: telem.currentPrice?.status || 'aman',
      };
    });

    list.sort((a, b) => b.deviasiPct - a.deviasiPct);
    return list.slice(0, 5);
  }, [allTelemetry, acuanRp]);

  // 2. Data Tren untuk Wilayah Terpilih (Otomatis 14 hari + H+7, tanpa tombol horizon)
  const selectedTelem = allTelemetry[selectedRegionId] || Object.values(allTelemetry)[0];
  const historyData = selectedTelem?.history14d || [];
  const predictionH7 = selectedTelem?.predictionH7;

  // Chart data points (14 hari riil + 1 titik H+7 proyeksi)
  const chartPoints = useMemo(() => {
    if (historyData.length === 0) return [];
    const points = historyData.map((d) => ({
      date: d.date,
      hargaRp: d.hargaRp,
      isH7: false,
    }));

    if (predictionH7) {
      points.push({
        date: predictionH7.targetDate || '2026-10-30',
        hargaRp: predictionH7.hargaPrediksiH7Rp,
        isH7: true,
      });
    }

    return points;
  }, [historyData, predictionH7]);

  // SVG Chart dimensions & scales
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const allPrices = useMemo(
    () => [
      ...chartPoints.map((p) => p.hargaRp),
      acuanRp,
      predictionH7?.confidenceLowerRp || acuanRp,
      predictionH7?.confidenceUpperRp || acuanRp,
    ],
    [chartPoints, acuanRp, predictionH7]
  );

  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const step = 2000;
  const minTick = Math.floor((rawMin - 1000) / step) * step;
  const maxTick = Math.ceil((rawMax + 1000) / step) * step;

  const chartW = 320;
  const chartH = 125;
  const padL = 42;
  const padR = 25;
  const padT = 16;
  const padB = 22;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const getY = (val: number) =>
    padT + innerH - ((val - minTick) / Math.max(1, maxTick - minTick)) * innerH;

  const getX = (idx: number) =>
    padL + (idx / Math.max(1, chartPoints.length - 1)) * innerW;

  // Polyline untuk data riil (indeks 0 s.d. length - 2)
  const historyPointsStr = useMemo(() => {
    if (chartPoints.length < 2) return '';
    const histOnly = chartPoints.slice(0, chartPoints.length - 1);
    return histOnly
      .map((p, idx) => `${getX(idx)},${getY(p.hargaRp)}`)
      .join(' ');
  }, [chartPoints]);

  const lastHistIdx = Math.max(0, chartPoints.length - 2);
  const lastHistX = getX(lastHistIdx);
  const lastHistY = getY(chartPoints[lastHistIdx]?.hargaRp || acuanRp);

  const h7Idx = chartPoints.length - 1;
  const h7X = getX(h7Idx);
  const h7Y = getY(chartPoints[h7Idx]?.hargaRp || acuanRp);

  // Mouse move handler for interactive hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const scaleX = chartW / rect.width;
    const svgMouseX = mouseX * scaleX;

    // Cari titik terdekat
    let nearestIdx = 0;
    let minDistance = Infinity;
    chartPoints.forEach((_, idx) => {
      const ptX = getX(idx);
      const dist = Math.abs(svgMouseX - ptX);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = idx;
      }
    });

    setHoverIndex(nearestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredItem = hoverIndex !== null ? chartPoints[hoverIndex] : null;

  // 3. Komoditas Lain di Jawa Barat dengan Bar Tingkat Kritis Deviasi
  const otherCommodities = useMemo(() => {
    return OTHER_COMMODITY_SPARKLINES.map((c) => {
      // Tingkat kritis: > 6% Kritis, > 4% Waspada, <= 4% Normal
      let riskColor = 'bg-[#729B82]';
      let riskLabel = 'Normal';
      let textColor = 'text-[#39634B]';

      if (c.changePct > 6.0) {
        riskColor = 'bg-[#B85C52]';
        riskLabel = 'Kritis';
        textColor = 'text-[#8A372E]';
      } else if (c.changePct > 4.0) {
        riskColor = 'bg-[#D6B45F]';
        riskLabel = 'Waspada';
        textColor = 'text-[#854D0E]';
      }

      return {
        ...c,
        riskColor,
        riskLabel,
        textColor,
      };
    });
  }, []);

  return (
    <div
      className="absolute bottom-4 left-4 z-20 select-none pointer-events-none transition-all duration-300"
      style={{
        right: isDrawerOpen && isDesktop ? '392px' : '16px',
      }}
    >
      {/* Kontainer Bawah Terpadu 3 Kolom: Top 5, Tren, Komoditas Lain */}
      <div className="bg-white/95 border border-[#E5E2DA] rounded-2xl shadow-xl backdrop-blur-sm pointer-events-auto p-3.5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#E5E2DA]">
          {/* ================= KOLOM 1: TOP 5 DEVIASI HARGA ================= */}
          <div className="flex flex-col justify-between pr-0 md:pr-3">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-1.5 mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#292824]">
                  Top 5 Deviasi Harga
                </span>
                <span className="text-[10px] font-mono text-[#77746C]">
                  {acuanLabel} Rp {acuanRp.toLocaleString('id-ID')}
                </span>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-[#77746C] border-b border-[#E5E2DA]">
                    <th className="pb-1 font-medium w-5">#</th>
                    <th className="pb-1 font-medium">Kabupaten / Kota</th>
                    <th className="pb-1 font-medium text-right">Observasi</th>
                    <th className="pb-1 font-medium text-right">Deviasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F3ED]">
                  {topDeviations.map((item, idx) => {
                    const isSelected = selectedRegionId === item.regionId;
                    return (
                      <tr
                        key={item.regionId}
                        onClick={() => onSelectRegion(item.regionId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#791D2A]/10 text-[#791D2A] font-bold'
                            : 'hover:bg-[#F5F3ED] text-[#292824]'
                        }`}
                      >
                        <td className="py-1.5 font-mono text-[11px] text-[#77746C]">{idx + 1}</td>
                        <td className="py-1.5 text-[11px]">
                          <span className="truncate block max-w-[110px]">{item.regionName}</span>
                        </td>
                        <td className="py-1.5 text-right font-mono text-[11px] tabular-nums">
                          Rp {item.hargaObservasi.toLocaleString('id-ID')}
                        </td>
                        <td className="py-1.5 text-right font-mono tabular-nums">
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              item.deviasiPct > 10
                                ? 'bg-[#B85C52]/15 text-[#8A372E]'
                                : item.deviasiPct > 5
                                ? 'bg-[#D6B45F]/20 text-[#854D0E]'
                                : 'bg-[#729B82]/15 text-[#39634B]'
                            }`}
                          >
                            {item.deviasiPct > 0 ? `+${item.deviasiPct}%` : `${item.deviasiPct}%`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-[10px] text-[#77746C] mt-1 pt-1.5 border-t border-[#E5E2DA] flex justify-between items-center">
              <span className="truncate">Klik baris untuk sorot wilayah</span>
              <span className="font-mono shrink-0 ml-1">Bapanas 24 Okt</span>
            </div>
          </div>

          {/* ================= KOLOM 2: TREN HARGA (OTOMATIS H+7 + HOVER NILAI) ================= */}
          <div className="flex flex-col justify-between pt-3 md:pt-0 md:px-2">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-1.5 mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#292824] truncate">
                  Tren: {selectedTelem?.region?.name || 'Jawa Barat'}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]">
                  +{predictionH7?.selisihPersen || 8.7}% H+7
                </span>
              </div>

              {/* Interactive SVG Chart */}
              <div className="w-full h-28 relative">
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="w-full h-full overflow-visible cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Gridline acuan */}
                  <line
                    x1={padL}
                    y1={getY(acuanRp)}
                    x2={padL + innerW}
                    y2={getY(acuanRp)}
                    stroke="#E5E2DA"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={padL}
                    y={getY(acuanRp) - 3}
                    fill="#77746C"
                    fontSize="7.5"
                    fontFamily="monospace"
                  >
                    Acuan: Rp {acuanRp.toLocaleString('id-ID')}
                  </text>

                  {/* Historical Solid Line */}
                  <polyline
                    fill="none"
                    stroke="#791D2A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={historyPointsStr}
                  />

                  {/* Forecast Dotted Line to H+7 */}
                  <line
                    x1={lastHistX}
                    y1={lastHistY}
                    x2={h7X}
                    y2={h7Y}
                    stroke="#B85C52"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                    strokeLinecap="round"
                  />

                  {/* Points */}
                  <circle cx={lastHistX} cy={lastHistY} r="3" fill="#791D2A" />
                  <circle cx={h7X} cy={h7Y} r="3.5" fill="#B85C52" />

                  {/* H+7 Tag */}
                  <text
                    x={h7X}
                    y={h7Y - 6}
                    fill="#791D2A"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    H+7 Rp {(predictionH7?.hargaPrediksiH7Rp || acuanRp).toLocaleString('id-ID')}
                  </text>

                  {/* Interactive Hover Indicator Line & Tooltip */}
                  {hoverIndex !== null && hoveredItem && (
                    <g>
                      <line
                        x1={getX(hoverIndex)}
                        y1={padT}
                        x2={getX(hoverIndex)}
                        y2={padT + innerH}
                        stroke="#791D2A"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                      <circle
                        cx={getX(hoverIndex)}
                        cy={getY(hoveredItem.hargaRp)}
                        r="4.5"
                        fill="#791D2A"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>

                {/* Floating Tooltip displaying exact value on hover */}
                {hoverIndex !== null && hoveredItem && (
                  <div
                    className="pointer-events-none absolute z-50 rounded-lg border border-[#E5E2DA] bg-white px-2 py-1 shadow-md text-[10px] text-[#292824]"
                    style={{
                      left: `${Math.min(Math.max(10, (getX(hoverIndex) / chartW) * 100), 75)}%`,
                      top: '2px',
                    }}
                  >
                    <div className="font-bold font-mono">
                      Rp {hoveredItem.hargaRp.toLocaleString('id-ID')}/kg
                    </div>
                    <div className="text-[9px] text-[#77746C]">
                      {hoveredItem.isH7 ? 'Estimasi Model H+7' : `Bapanas · ${hoveredItem.date}`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#77746C] font-mono mt-1 pt-1.5 border-t border-[#E5E2DA]">
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#791D2A]" />
                  <span>Aktual</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#B85C52] border-b border-dashed" />
                  <span>H+7</span>
                </span>
              </div>
              <span className="truncate ml-2 text-right">Hover untuk tinjau nilai</span>
            </div>
          </div>

          {/* ================= KOLOM 3: KOMODITAS LAIN (JABAR) ================= */}
          <div className="flex flex-col justify-between pt-3 md:pt-0 md:pl-3">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-1.5 mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#292824]">
                  Komoditas Lain (Jabar)
                </span>
                <span className="text-[10px] font-mono text-[#77746C]">Tingkat Kritis</span>
              </div>

              {/* Daftar 5 Komoditas Lain dengan Progress Bar Kritis */}
              <div className="space-y-1.5 text-xs">
                {otherCommodities.map((comm) => (
                  <div
                    key={comm.id}
                    onClick={() => onSelectCommodity?.(comm.id)}
                    className="flex items-center justify-between text-[11px] p-1 rounded-md hover:bg-[#F5F3ED] cursor-pointer transition-colors"
                    title={`Klik untuk pantau ${comm.name}`}
                  >
                    <span className="truncate max-w-[120px] text-[#292824] font-medium">
                      {comm.name}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Bar Tingkat Kritis */}
                      <div className="w-14 h-1.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, comm.changePct * 12)}%` }}
                          className={`h-full rounded-full ${comm.riskColor}`}
                        />
                      </div>

                      <span className={`font-mono font-bold tabular-nums w-12 text-right ${comm.textColor}`}>
                        +{comm.changePct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-[#77746C] mt-1 pt-1.5 border-t border-[#E5E2DA] flex justify-between items-center">
              <span className="truncate">Deviasi vs HAP/HET</span>
              <span className="font-mono shrink-0 ml-1">Bapanas Jabar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
