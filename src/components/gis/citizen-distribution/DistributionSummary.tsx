'use client';

import React from 'react';
import { PriceStats, formatRp } from '@/lib/citizen-distribution';
import { FactList } from './DistributionStates';

export interface GovernmentPrices {
  bapanas: { price: number; dateLabel: string; isToday: boolean } | null;
  acuan: { price: number; type: string } | null;
}

function Diff({ from, to }: { from: number; to: number }) {
  const diff = from - to;
  const pct = (diff / to) * 100;
  const tone = pct > 10 ? 'text-[#B85C52]' : pct > 5 ? 'text-[#9A7A22]' : 'text-[#4E7A60]';
  return (
    <span className={`font-mono tabular-nums ${tone}`}>
      {diff >= 0 ? '+' : '−'}
      {formatRp(Math.abs(diff))} ({pct >= 0 ? '+' : ''}
      {pct.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%)
    </span>
  );
}

const Price = ({ v, unit }: { v: number; unit: string }) => (
  <span className="font-mono tabular-nums text-[#292824]">
    {formatRp(v)}
    <span className="text-[#77746C]">/{unit}</span>
  </span>
);

/** Ringkasan statistik distribusi. Label median berubah sesuai status kuorum. */
export function DistributionSummary({
  stats,
  valid,
  unit,
  provisional,
}: {
  stats: PriceStats;
  valid: number;
  unit: string;
  provisional: boolean;
}) {
  return (
    <FactList
      rows={[
        { label: provisional ? 'Median sementara' : 'Median harga warga', value: <Price v={stats.median} unit={unit} /> },
        { label: 'Laporan valid', value: <span className="font-mono tabular-nums">{valid}</span> },
        { label: 'Harga terendah', value: <Price v={stats.min} unit={unit} /> },
        { label: 'Harga tertinggi', value: <Price v={stats.max} unit={unit} /> },
      ]}
    />
  );
}

/**
 * Perbandingan konsensus warga vs harga pemerintah. HANYA dirender saat kuorum
 * terpenuhi. Sumber yang belum tersedia ditandai, dan selisih tidak dihitung.
 */
export function ConsensusComparison({
  median,
  unit,
  gov,
}: {
  median: number;
  unit: string;
  gov: GovernmentPrices;
}) {
  const na = <span className="italic text-[#77746C]">Belum tersedia</span>;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#77746C]">Perbandingan dengan harga pemerintah</p>
      <FactList
        rows={[
          {
            label: gov.bapanas ? `Harga Bapanas (${gov.bapanas.dateLabel})` : 'Harga Bapanas',
            value: gov.bapanas ? <Price v={gov.bapanas.price} unit={unit} /> : na,
          },
          { label: 'Median vs Bapanas', value: gov.bapanas ? <Diff from={median} to={gov.bapanas.price} /> : na },
          {
            label: gov.acuan ? `Acuan pemerintah (${gov.acuan.type})` : 'Acuan pemerintah',
            value: gov.acuan ? <Price v={gov.acuan.price} unit={unit} /> : na,
          },
          { label: 'Median vs acuan', value: gov.acuan ? <Diff from={median} to={gov.acuan.price} /> : na },
        ]}
      />
      {gov.bapanas && !gov.bapanas.isToday && (
        <p className="text-[11px] leading-snug text-[#77746C]">
          Catatan periode: harga Bapanas per {gov.bapanas.dateLabel}, laporan warga per hari ini. Selisih dibaca sebagai
          indikasi, bukan perbandingan pada tanggal yang sama.
        </p>
      )}
    </div>
  );
}
