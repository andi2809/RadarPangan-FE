'use client';

import React, { useMemo, useState } from 'react';
import { MarketRef, formatJakartaLongDate } from '@/lib/citizen-distribution';
import { useCitizenReportDistribution } from '@/hooks/useCitizenReportDistribution';
import { getMarketsForRegion, MarketSelect } from './MarketSelect';
import { PriceHistogram } from './PriceHistogram';
import {
  DistributionLoadingState,
  DistributionErrorState,
  DistributionNoMarketState,
  DistributionEmptyState,
  DistributionExpiredState,
  DistributionInvalidState,
  QuorumProgress,
  ValidationFacts,
} from './DistributionStates';
import { ConsensusComparison, DistributionSummary, GovernmentPrices } from './DistributionSummary';
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

export function CitizenReportPriceDistribution({
  regionId,
  regionName,
  regionCentroid,
  commodity,
  selectedMarket: propMarket,
  onSelectMarket,
  bapanasPrice,
  className = '',
  height = 100,
  embedded = false,
}: CitizenReportPriceDistributionProps) {
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
    regionCentroid,
  });

  const [showValidation, setShowValidation] = useState(false);

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
        <div className="min-h-[125px] flex flex-col justify-center">
          {state.kind === 'loading' && <DistributionLoadingState />}

          {state.kind === 'error' && (
            <DistributionErrorState message={state.message} onRetry={retry} />
          )}

          {state.kind === 'no-market' && <DistributionNoMarketState />}

          {state.kind === 'no-active-reports' && <DistributionEmptyState />}

          {state.kind === 'expired-only' && (
            <DistributionExpiredState breakdown={state.breakdown} />
          )}

          {state.kind === 'no-valid-reports' && (
            <DistributionInvalidState breakdown={state.breakdown} />
          )}

          {state.kind === 'insufficient-quorum' && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-medium text-[#77746C]">Progres Kuorum Warga</span>
                <QuorumProgress valid={state.breakdown.valid} />
              </div>

              <div className="p-2 rounded-lg bg-[#D6B45F]/15 border border-[#D6B45F]/30 text-[11px] text-[#8F7020] leading-snug">
                {state.awaitingBackendConfirmation
                  ? 'Telah mencapai 10 laporan valid. Menunggu konfirmasi verifikasi konsensus resmi dari backend.'
                  : `Belum mencapai kuorum. Dibutuhkan ${
                      10 - state.breakdown.valid
                    } laporan valid tambahan untuk membentuk konsensus harga warga.`}
              </div>

              <PriceHistogram
                prices={state.stats.prices}
                median={state.stats.median}
                unit={unit}
                provisional={true}
                height={height}
              />

              <DistributionSummary
                stats={state.stats}
                valid={state.breakdown.valid}
                unit={unit}
                provisional={true}
              />
            </div>
          )}

          {state.kind === 'quorum-reached' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#729B82]" />
                  <span className="font-semibold text-[#39634B]">Konsensus Kuorum Terpenuhi</span>
                </div>
                <span className="font-mono text-[11px] text-[#77746C]">
                  {state.breakdown.valid} laporan valid
                </span>
              </div>

              <PriceHistogram
                prices={state.stats.prices}
                median={state.stats.median}
                unit={unit}
                provisional={false}
                height={height}
              />

              <DistributionSummary
                stats={state.stats}
                valid={state.breakdown.valid}
                unit={unit}
                provisional={false}
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

      {/* 3. Footer */}
      <div className="mt-2 pt-2 border-t border-[#E5E2DA] flex items-center justify-between text-[10px] text-[#77746C]">
        <span className="truncate">Sumber: Laporan Warga Hari Ini</span>

        {'breakdown' in state && (
          <button
            type="button"
            onClick={() => setShowValidation(!showValidation)}
            className="hover:text-[#791D2A] underline transition-colors shrink-0 font-medium ml-2"
          >
            {showValidation ? 'Tutup Rincian' : 'Rincian Validasi'}
          </button>
        )}
      </div>

      {/* Accordion Rincian Validasi Laporan bila dibuka */}
      {showValidation && 'breakdown' in state && (
        <div className="mt-2 pt-2 border-t border-[#E5E2DA] bg-[#F5F3ED]/60 p-2.5 rounded-lg">
          <ValidationFacts breakdown={state.breakdown} />
        </div>
      )}
    </div>
  );
}
