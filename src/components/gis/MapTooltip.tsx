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
  activeHorizon,
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
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        <div className="w-64 rounded-xl border border-[#DED8CD] bg-white/95 p-3.5 shadow-xl backdrop-blur-md text-xs text-[#24231F]">
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2 mb-2">
            <div>
              <div className="font-extrabold text-sm text-[#24231F]">{nonJabarInfo.name}</div>
              <div className="text-[11px] text-[#706B62]">{nonJabarInfo.provinceName}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]">
              Tanpa data
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#706B62] text-[11px] bg-[#F8FAFC] p-2 rounded-lg border border-[#DED8CD]">
            <span className="size-2 rounded-full bg-[#CBD5E1] shrink-0" />
            <span>Data harga belum tersedia untuk wilayah ini</span>
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
      ? 'bg-[#FBE7E4] text-[#DC4840] border-[#DC4840]/30'
      : displayStatus === 'waspada'
      ? 'bg-[#FBF0D7] text-[#96620A] border-[#E9B949]/40'
      : displayStatus === 'turun'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-[#E3F0E7] text-[#287653] border-[#27815A]/30';

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out select-none"
      style={{
        left: `${x + 16}px`,
        top: `${y + 16}px`,
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      <div className="w-72 rounded-xl border border-[#DED8CD] bg-white/95 p-3.5 shadow-2xl backdrop-blur-md text-xs text-[#24231F]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-2 mb-2.5">
          <div>
            <div className="font-extrabold text-sm text-[#24231F] flex items-center gap-1.5">
              <span>{region.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FBF9F4] text-[#706B62] border border-[#DED8CD]">
                {region.id}
              </span>
            </div>
            <div className="text-[11px] text-[#706B62]">Jawa Barat</div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusBadgeBg}`}
          >
            {displayStatus}
          </span>
        </div>

        {/* Pricing Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-2.5 bg-[#FBF9F4] p-2 rounded-lg border border-[#DED8CD]">
          <div>
            <div className="text-[10px] text-[#898277] uppercase tracking-wider font-semibold">
              {isH7 ? 'Proyeksi H+7' : 'Harga Aktual'}
            </div>
            <div className="text-base font-extrabold font-mono text-[#24231F] tabular-nums">
              Rp {displayPrice.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#898277] uppercase tracking-wider font-semibold">
              Deviasi HAP
            </div>
            <div
              className={`text-sm font-bold font-mono tabular-nums ${
                displaySelisih > 0 ? 'text-[#DC4840]' : 'text-[#287653]'
              }`}
            >
              {displaySelisih > 0 ? `+${displaySelisih}%` : `${displaySelisih}%`}
            </div>
          </div>
        </div>

        {/* EWS Telemetry */}
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between items-center text-[#24231F]">
            <span className="text-[#706B62]">EWS Risk Score:</span>
            <span
              className={`font-bold tabular-nums ${
                predictionH7.ewsScore >= 55 ? 'text-[#DC4840]' : 'text-[#24231F]'
              }`}
            >
              {predictionH7.ewsScore} / 100 ({predictionH7.riskLevel})
            </span>
          </div>

          <div className="flex justify-between items-center text-[#24231F]">
            <span className="text-[#706B62]">Neraca Pasokan:</span>
            <span
              className={`capitalize font-semibold ${
                supply.statusNeraca === 'surplus'
                  ? 'text-[#287653]'
                  : supply.statusNeraca === 'defisit'
                  ? 'text-[#DC4840]'
                  : 'text-[#96620A]'
              }`}
            >
              {supply.statusNeraca} ({supply.hariKetahananStok} hari)
            </span>
          </div>

          <div className="flex justify-between items-center text-[#24231F]">
            <span className="text-[#706B62]">Beban UMK 2026:</span>
            <span className="tabular-nums font-bold text-amber-700">
              {affordability.umkRatioBasketPercent}% UMK
            </span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#F0ECE4] text-[10px] text-[#898277] text-center">
          Klik wilayah untuk sinkronisasi analitik & rekomendasi
        </div>
      </div>
    </div>
  );
};
