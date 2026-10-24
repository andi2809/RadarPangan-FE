'use client';

import React from 'react';
import { UnifiedRegionTelemetry } from '../../types/domain';

export interface NonJabarInfo {
  name: string;
  provinceName: string;
}

interface MapTooltipProps {
  telemetry: UnifiedRegionTelemetry | null;
  nonJabarInfo?: NonJabarInfo | null;
  x: number;
  y: number;
  visible: boolean;
  activeHorizon: 'aktual' | 'h7';
}

export const MapTooltip: React.FC<MapTooltipProps> = ({
  telemetry,
  nonJabarInfo,
  x,
  y,
  visible,
  activeHorizon
}) => {
  if (!visible) return null;

  // Tooltip for regions outside Jawa Barat
  if (nonJabarInfo) {
    return (
      <div
        className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out select-none"
        style={{
          left: `${x + 16}px`,
          top: `${y + 16}px`,
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <div className="w-64 rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md text-xs text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div>
              <div className="font-semibold text-sm text-slate-100">{nonJabarInfo.name}</div>
              <div className="text-[11px] text-slate-400">{nonJabarInfo.provinceName}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-slate-800 text-slate-400 border border-slate-700">
              Luar Jabar
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
            <span>Tidak memiliki data bahan pangan</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            *Pemantauan EWS aktif khusus 27 Kab/Kota Jawa Barat
          </div>
        </div>
      </div>
    );
  }

  if (!telemetry) return null;

  const { region, currentPrice, predictionH7, supply, affordability } = telemetry;
  const isH7 = activeHorizon === 'h7';
  const displayPrice = isH7 ? predictionH7.hargaPrediksiH7Rp : currentPrice.hargaAktualRp;
  const displayStatus = isH7 ? predictionH7.status : currentPrice.status;
  const displaySelisih = isH7 ? predictionH7.selisihPersen : currentPrice.selisihPersen;

  const statusBadgeBg =
    displayStatus === 'kritis'
      ? 'bg-rose-950 text-rose-300 border-rose-800'
      : displayStatus === 'waspada'
      ? 'bg-amber-950 text-amber-300 border-amber-800'
      : displayStatus === 'turun'
      ? 'bg-sky-950 text-sky-300 border-sky-800'
      : 'bg-emerald-950 text-emerald-300 border-emerald-800';

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out select-none"
      style={{
        left: `${x + 16}px`,
        top: `${y + 16}px`,
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      <div className="w-72 rounded-lg border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
          <div>
            <div className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <span>{region.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {region.id}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Jawa Barat</div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${statusBadgeBg}`}
          >
            {displayStatus}
          </span>
        </div>

        {/* Pricing Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-2.5 bg-slate-950/60 p-2 rounded border border-slate-800/80">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              {isH7 ? 'Proyeksi H+7' : 'Harga Aktual'}
            </div>
            <div className="text-base font-bold font-mono text-white tabular-nums">
              Rp {displayPrice.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Deviasi HAP
            </div>
            <div
              className={`text-sm font-bold font-mono tabular-nums ${
                displaySelisih > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {displaySelisih > 0 ? `+${displaySelisih}%` : `${displaySelisih}%`}
            </div>
          </div>
        </div>

        {/* EWS & Socio-economic Telemetry */}
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">EWS Risk Score:</span>
            <span
              className={`font-bold tabular-nums ${
                predictionH7.ewsScore >= 55 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {predictionH7.ewsScore} / 100 ({predictionH7.riskLevel})
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Neraca Pasokan:</span>
            <span
              className={`capitalize font-semibold ${
                supply.statusNeraca === 'surplus'
                  ? 'text-emerald-400'
                  : supply.statusNeraca === 'defisit'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {supply.statusNeraca} ({supply.hariKetahananStok} hari)
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Beban UMK 2026:</span>
            <span className="tabular-nums text-slate-200">
              {affordability.umkRatioBasketPercent}% UMK
            </span>
          </div>
        </div>

        {/* Micro-hint */}
        <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center font-mono">
          Klik wilayah untuk membuka kontrol analitik & DSS
        </div>
      </div>
    </div>
  );
};
