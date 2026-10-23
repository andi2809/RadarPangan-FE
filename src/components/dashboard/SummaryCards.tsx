'use client';

import React from 'react';
import { UnifiedRegionTelemetry, Commodity } from '../../types/domain';
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowDownRight } from 'lucide-react';

interface SummaryCardsProps {
  commodity: Commodity;
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  activeHorizon: 'aktual' | 'h7';
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  commodity,
  allTelemetry,
  activeHorizon
}) => {
  const telemetryList = Object.values(allTelemetry);
  if (telemetryList.length === 0) return null;

  const isH7 = activeHorizon === 'h7';

  // Compute status aggregates
  let countAman = 0;
  let countWaspada = 0;
  let countKritis = 0;
  let countTurun = 0;
  let totalHarga = 0;

  telemetryList.forEach((t) => {
    const status = isH7 ? t.predictionH7.status : t.currentPrice.status;
    const price = isH7 ? t.predictionH7.hargaPrediksiH7Rp : t.currentPrice.hargaAktualRp;
    totalHarga += price;

    if (status === 'kritis') countKritis++;
    else if (status === 'waspada') countWaspada++;
    else if (status === 'turun') countTurun++;
    else countAman++;
  });

  const total = telemetryList.length;
  const avgHarga = Math.round(totalHarga / total);
  const avgDiffPersen = Number((((avgHarga - commodity.hargaAcuanRp) / commodity.hargaAcuanRp) * 100).toFixed(1));

  // Find extreme hotspot & coldspot
  const sortedByPrice = [...telemetryList].sort((a, b) => {
    const pA = isH7 ? a.predictionH7.hargaPrediksiH7Rp : a.currentPrice.hargaAktualRp;
    const pB = isH7 ? b.predictionH7.hargaPrediksiH7Rp : b.currentPrice.hargaAktualRp;
    return pB - pA;
  });

  const topHotspot = sortedByPrice[0];
  const topSurplusHaven = sortedByPrice[sortedByPrice.length - 1];

  return (
    <div className="absolute top-20 right-4 z-30 w-80 space-y-2 pointer-events-none select-none">
      {/* Aggregate Status Bar Card */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md pointer-events-auto text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-200">KONDISI 27 KAB/KOTA</span>
          <span className="font-mono text-[10px] text-slate-400">
            HAP: Rp {commodity.hargaAcuanRp.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Progress bar of status shares */}
        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden flex mb-2 border border-slate-800">
          <div
            style={{ width: `${(countAman / total) * 100}%` }}
            className="bg-emerald-500 transition-all duration-300"
            title={`Aman: ${countAman}`}
          />
          <div
            style={{ width: `${(countWaspada / total) * 100}%` }}
            className="bg-amber-500 transition-all duration-300"
            title={`Waspada: ${countWaspada}`}
          />
          <div
            style={{ width: `${(countKritis / total) * 100}%` }}
            className="bg-rose-600 transition-all duration-300"
            title={`Kritis: ${countKritis}`}
          />
          <div
            style={{ width: `${(countTurun / total) * 100}%` }}
            className="bg-sky-600 transition-all duration-300"
            title={`Turun: ${countTurun}`}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px] pt-1 border-t border-slate-800/80">
          <div className="text-emerald-400">
            <div className="font-bold text-sm tabular-nums">{countAman}</div>
            <div>Aman</div>
          </div>
          <div className="text-amber-400">
            <div className="font-bold text-sm tabular-nums">{countWaspada}</div>
            <div>Waspada</div>
          </div>
          <div className="text-rose-400">
            <div className="font-bold text-sm tabular-nums">{countKritis}</div>
            <div>Kritis</div>
          </div>
          <div className="text-sky-400">
            <div className="font-bold text-sm tabular-nums">{countTurun}</div>
            <div>Surplus</div>
          </div>
        </div>
      </div>

      {/* Average Price Card */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md pointer-events-auto text-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              Rata-rata Jawa Barat
            </div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              Rp {avgHarga.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                avgDiffPersen > 0 ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
              }`}
            >
              {avgDiffPersen > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {avgDiffPersen > 0 ? `+${avgDiffPersen}%` : `${avgDiffPersen}%`}
            </span>
            <div className="text-[10px] text-slate-400 mt-0.5">vs Acuan Resmi</div>
          </div>
        </div>

        {/* Top Hotspot vs Surplus Haven snippet */}
        <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] space-y-1 font-mono">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Lonjakan Tertinggi:
            </span>
            <span className="font-semibold text-white truncate max-w-[140px]">
              {topHotspot?.region.name}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Sentra Terendah:
            </span>
            <span className="font-semibold text-white truncate max-w-[140px]">
              {topSurplusHaven?.region.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
