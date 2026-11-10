'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { OFFICIAL_MARKETS_BY_REGION } from '@/data/mock/officialMarkets';
import { MarketRef } from '@/lib/citizen-distribution';

/** Daftar pasar resmi (direktori statis, bukan data harga) untuk satu kab/kota. */
export function getMarketsForRegion(regionId: string): MarketRef[] {
  const dir = OFFICIAL_MARKETS_BY_REGION[regionId];
  if (!dir) return [];
  return dir.markets.map((m) => ({ id: m.id, name: m.name, regionId: dir.regionId, regionName: dir.regionName }));
}

export function MarketSelect({
  regionId,
  value,
  onChange,
  className = '',
}: {
  regionId: string;
  value: string | null;
  onChange: (market: MarketRef | null) => void;
  className?: string;
}) {
  const markets = getMarketsForRegion(regionId);
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label="Pilih pasar"
        value={value ?? ''}
        disabled={markets.length === 0}
        onChange={(e) => onChange(markets.find((m) => m.id === e.target.value) ?? null)}
        className="w-full appearance-none truncate rounded-md border border-[#E5E2DA] bg-white py-1 pl-2 pr-7 text-xs text-[#292824] focus:outline-none focus:ring-1 focus:ring-[#791D2A] disabled:text-[#77746C]"
      >
        <option value="">{markets.length ? 'Pilih pasar…' : 'Direktori pasar belum tersedia'}</option>
        {markets.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77746C]" />
    </div>
  );
}
