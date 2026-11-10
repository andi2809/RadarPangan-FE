'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { MarketRef, formatJakartaLongDate } from '@/lib/citizen-distribution';
import { useCitizenReportDistribution } from '@/hooks/useCitizenReportDistribution';
import { getMarketsForRegion, MarketSelect } from './MarketSelect';
import { PriceHistogram } from './PriceHistogram';
import {
  DistributionLoadingState,
  DistributionErrorState,
  DistributionNoMarketState,
  DistributionExpiredState,
  DistributionInvalidState,
} from './DistributionStates';
import { ConsensusComparison, GovernmentPrices } from './DistributionSummary';
import { Commodity } from '@/types/domain';

export interface CitizenReportPriceDistributionProps {
  regionId: string;
  regionName: string;
  regionCentroid: { lat: number; lng: number } | null;
  commodity: Commodity;
  selectedMarket?: MarketRef | null;
  onSelectMarket?: (m: MarketRef | null) => void;
  bapanasPrice?: { price: number; dateLabel: string; isToday: boolean } | null;
  className?: string;
  height?: number;
  embedded?: boolean;
}

export const CitizenReportPriceDistribution: React.FC<CitizenReportPriceDistributionProps> = ({
  regionId,
  regionName: _regionName,
  regionCentroid,
  commodity,
  selectedMarket: propMarket,
  onSelectMarket,
  bapanasPrice,
  className = '',
  height = 90,
  embedded = false,
}) => {
  // Sinkronkan pasar dengan regionId aktif
  const availableMarkets = useMemo(() => getMarketsForRegion(regionId), [regionId]);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  const activeMarket = useMemo(() => {
    if (propMarket !== undefined) return propMarket;
    return (
      availableMarkets.find((m) => m.id === selectedMarketId) ||
      availableMarkets[0] ||
      null
    );
  }, [propMarket, availableMarkets, selectedMarketId]);

  const handleMarketChange = (m: MarketRef | null) => {
    setSelectedMarketId(m?.id || null);
    onSelectMarket?.(m);
  };

  const { state, retry } = useCitizenReportDistribution({
    market: activeMarket,
    commodityId: commodity.id,
    regionCentroid: regionCentroid || { lat: -6.2415, lng: 107.0016 },
  });

  const todayLabel = useMemo(() => formatJakartaLongDate(new Date()), []);
  const unit = commodity.satuan || 'kg';

  const govPrices: GovernmentPrices = useMemo(
    () => ({
      bapanas: bapanasPrice ?? null,
      acuan: commodity.hargaAcuanRp
        ? { price: commodity.hargaAcuanRp, type: commodity.jenisAcuan || 'HAP' }
        : null,
    }),
    [bapanasPrice, commodity]
  );

  const containerClasses = embedded
    ? `flex flex-col justify-between select-none text-[#292824] h-full ${className}`
    : `bg-white/95 border border-[#E5E2DA] rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-col justify-between select-none text-[#292824] ${className}`;

  const marketAuditId = activeMarket?.id || 'pasar-baru-cikarang';

  return (
    <div className={containerClasses}>
      {/* 1. Header */}
      <div>
        <div className="border-b border-[#E5E2DA] pb-2 mb-2 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#292824]">
              Distribusi Laporan Warga
            </h3>
            <span className="text-[10px] font-mono text-[#77746C] shrink-0">
              {todayLabel}
            </span>
          </div>

          <div className="w-full">
            <MarketSelect
              regionId={regionId}
              value={activeMarket?.id ?? null}
              onChange={handleMarketChange}
            />
          </div>
        </div>

        {/* 2. Body Berdasarkan State */}
        <div className="min-h-[110px] flex flex-col justify-center">
          {state.kind === 'loading' && <DistributionLoadingState />}

          {state.kind === 'error' && (
            <DistributionErrorState message={state.message} onRetry={retry} />
          )}

          {state.kind === 'no-market' && <DistributionNoMarketState />}

          {/* State: Belum Ada Laporan Hari Ini */}
          {state.kind === 'no-active-reports' && (
            <div className="space-y-2.5 py-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#77746C]">Progres Kuorum Laporan</span>
                  <span className="font-mono text-xs tabular-nums text-[#77746C]">
                    0 / 10
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#EAE8E1] w-0" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F3ED] border border-[#E5E2DA] space-y-1 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#77746C]">
                  Konsensus Harga Warga
                </div>
                <div className="text-sm font-bold text-[#77746C]">
                  Belum Diverifikasi
                </div>
                <p className="text-[11px] text-[#77746C] leading-snug">
                  Belum ada laporan harga warga yang diterima hari ini pada pasar terpilih.
                </p>
              </div>
            </div>
          )}

          {state.kind === 'expired-only' && (
            <DistributionExpiredState breakdown={state.breakdown} />
          )}

          {state.kind === 'no-valid-reports' && (
            <DistributionInvalidState breakdown={state.breakdown} />
          )}

          {/* State: Laporan Masuk Tapi Belum Mencapai Kuorum (< 10) */}
          {state.kind === 'insufficient-quorum' && (
            <div className="space-y-2.5 py-1">
              {/* Progres Kuorum */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#77746C]">Progres Kuorum Warga</span>
                  <span className="font-mono text-xs font-bold tabular-nums text-[#854D0E]">
                    {state.breakdown.valid} / 10
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D6B45F] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (state.breakdown.valid / 10) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Status Box: Belum Diverifikasi */}
              <div className="p-3 rounded-xl bg-[#FEF08A]/40 border border-[#FDE047] space-y-1.5 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#854D0E]">
                  Konsensus Harga Warga
                </div>
                <div className="text-base font-bold text-[#854D0E] flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D6B45F]" />
                  <span>Belum Diverifikasi</span>
                </div>
                <p className="text-[11px] text-[#706B62] leading-snug">
                  Memerlukan {10 - state.breakdown.valid} laporan valid tambahan untuk membentuk konsensus harga yang sah.
                </p>
              </div>
            </div>
          )}

          {/* State: Kuorum Terpenuhi (>= 10) */}
          {state.kind === 'quorum-reached' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#729B82]" />
                  <span className="font-semibold text-[#39634B]">Konsensus Terverifikasi</span>
                </div>
                <span className="font-mono text-[11px] text-[#77746C]">
                  {state.breakdown.valid} / 10 laporan valid
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5F3ED] border border-[#E5E2DA] flex items-baseline justify-between">
                <span className="text-xs text-[#77746C]">Median Harga Warga</span>
                <span className="text-base font-bold font-mono text-[#292824]">
                  Rp {state.stats.median.toLocaleString('id-ID')}/{unit}
                </span>
              </div>

              <PriceHistogram
                prices={state.stats.prices}
                median={state.stats.median}
                unit={unit}
                provisional={false}
                height={height}
              />

              <ConsensusComparison
                median={state.stats.median}
                unit={unit}
                gov={govPrices}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer: Sumber dan Akses ke Ruang Audit Pasar */}
      <div className="mt-2.5 pt-2 border-t border-[#E5E2DA] flex items-center justify-between text-[11px]">
        <span className="text-[10px] text-[#77746C] truncate">
          Sumber: Laporan Warga
        </span>

        <Link
          href={`/dashboard/laporan-warga/${marketAuditId}`}
          className="inline-flex items-center gap-1 font-semibold text-xs text-[#791D2A] hover:underline transition-colors shrink-0"
          title="Buka ruang audit untuk memeriksa laporan perorangan dan validasi MAD"
        >
          <span>Ruang Audit Pasar</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
};
