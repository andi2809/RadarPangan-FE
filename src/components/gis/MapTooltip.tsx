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
  commodityAcuanType?: string;
  commodityAcuanRp?: number;
}

export const MapTooltip: React.FC<MapTooltipProps> = ({
  telemetry,
  nonJabarInfo,
  x,
  y,
  visible,
  activeHorizon,
  commodityAcuanType = 'HAP',
  commodityAcuanRp,
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
        <div className="w-64 rounded-xl border border-[#E5E2DA] bg-white p-3 shadow-md text-xs text-[#292824]">
          <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-2 mb-2">
            <div>
              <div className="font-bold text-sm text-[#292824]">{nonJabarInfo.name}</div>
              <div className="text-[11px] text-[#77746C]">{nonJabarInfo.provinceName}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAE8E1] text-[#77746C]">
              Luar Cakupan
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#77746C] text-[11px] bg-[#F5F3ED] p-2 rounded-lg border border-[#E5E2DA]">
            <span className="w-2 h-2 rounded-full bg-[#D5D5D0] shrink-0" />
            <span>Data harga belum tersedia untuk wilayah ini</span>
          </div>
        </div>
      </div>
    );
  }

  if (!telemetry) return null;

  const { region, currentPrice, predictionH7 } = telemetry;
  const isH7 = activeHorizon === 'h7';
  const displayPrice = isH7 ? predictionH7.hargaPrediksiH7Rp : currentPrice.hargaAktualRp;
  const displayStatus = isH7 ? predictionH7.status : currentPrice.status;
  const acuanRp = commodityAcuanRp || currentPrice.hargaAcuanRp || 45000;
  const deviasiRp = displayPrice - acuanRp;
  const deviasiPct = Number(((deviasiRp / acuanRp) * 100).toFixed(2));

  // Visual status pill
  let statusLabel = 'Normal';
  let statusBadgeStyle = 'bg-[#729B82]/15 text-[#39634B] border-[#729B82]/30';

  if (displayStatus === 'kritis' || deviasiPct > 10) {
    statusLabel = 'Tekanan Tinggi';
    statusBadgeStyle = 'bg-[#B85C52]/15 text-[#8A372E] border-[#B85C52]/30';
  } else if (displayStatus === 'waspada' || deviasiPct > 5) {
    statusLabel = 'Perlu Perhatian';
    statusBadgeStyle = 'bg-[#D6B45F]/20 text-[#8F7020] border-[#D6B45F]/40';
  }

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out select-none"
      style={{
        left: `${x + 16}px`,
        top: `${y + 16}px`,
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      <div className="w-72 rounded-xl border border-[#E5E2DA] bg-white p-3.5 shadow-lg text-xs text-[#292824]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-2 mb-2.5">
          <div>
            <div className="font-bold text-sm text-[#292824] flex items-center gap-1.5">
              <span>{region.name}</span>
            </div>
            <div className="text-[11px] text-[#77746C]">Provinsi Jawa Barat</div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusBadgeStyle}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Pricing Metrics */}
        <div className="space-y-1.5 bg-[#F5F3ED] p-2.5 rounded-lg border border-[#E5E2DA] font-mono text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-[#77746C] font-sans font-medium">
              {isH7 ? 'Estimasi H+7:' : 'Harga Observasi:'}
            </span>
            <span className="font-bold text-[#292824] text-xs">
              Rp {displayPrice.toLocaleString('id-ID')}/kg
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#77746C] font-sans font-medium">
              Acuan ({commodityAcuanType}):
            </span>
            <span className="text-[#292824] font-medium">
              Rp {acuanRp.toLocaleString('id-ID')}/kg
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-[#E5E2DA]">
            <span className="text-[#77746C] font-sans font-medium">Deviasi Acuan:</span>
            <span
              className={`font-bold ${
                deviasiPct > 10
                  ? 'text-[#B85C52]'
                  : deviasiPct > 5
                  ? 'text-[#B58D2B]'
                  : 'text-[#39634B]'
              }`}
            >
              {deviasiPct > 0 ? `+${deviasiPct}%` : `${deviasiPct}%`} (
              {deviasiRp >= 0 ? `+Rp ${deviasiRp.toLocaleString('id-ID')}` : `-Rp ${Math.abs(deviasiRp).toLocaleString('id-ID')}`})
            </span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-[#77746C] text-center">
          Klik untuk meninjau detail wilayah pada panel analitik
        </div>
      </div>
    </div>
  );
};
