'use client';

import React from 'react';
import { BarChart3, AlertCircle, MapPin } from 'lucide-react';
import { QUORUM_MIN, ValidationBreakdown } from '@/lib/citizen-distribution';

/** Nilai `null` = backend tidak mengirim metrik tersebut. Tidak pernah ditampilkan sebagai 0. */
export function Metric({ value, suffix }: { value: number | null; suffix?: string }) {
  if (value === null) return <span className="text-[#77746C] italic font-sans">Tidak dilaporkan</span>;
  return (
    <span className="font-mono tabular-nums text-[#292824]">
      {value}
      {suffix}
    </span>
  );
}

export function FactList({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-x-6 gap-y-1 text-xs">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-2 border-b border-[#F0EEE8] py-1">
          <dt className="text-[#77746C]">{r.label}</dt>
          <dd className="text-right">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StateShell({
  icon,
  headline,
  description,
  children,
  tone = 'neutral',
}: {
  icon: React.ReactNode;
  headline: string;
  description: string;
  children?: React.ReactNode;
  tone?: 'neutral' | 'error';
}) {
  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
            tone === 'error' ? 'border-[#B85C52]/30 text-[#B85C52]' : 'border-[#E5E2DA] text-[#77746C]'
          }`}
        >
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-[#292824]">{headline}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#77746C]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function DistributionLoadingState() {
  return (
    <div className="flex flex-col gap-3 py-1" aria-busy="true" aria-label="Memuat laporan warga">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-[#EAE8E1]" />
        ))}
      </div>
      <div className="flex h-[150px] items-end gap-1.5 px-8">
        {[35, 55, 80, 100, 70, 45, 25].map((h, i) => (
          <div key={i} className="flex-1 animate-pulse rounded-sm bg-[#EAE8E1]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function DistributionErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StateShell
      tone="error"
      icon={<AlertCircle className="h-4 w-4" />}
      headline="Data Laporan Tidak Dapat Dimuat"
      description="Terjadi kendala saat mengambil data laporan warga. Silakan coba kembali."
    >
      <div className="flex items-center justify-between gap-3 pl-11">
        <span className="text-[11px] text-[#77746C]">{message}</span>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-[#E5E2DA] bg-white px-2.5 py-1 text-xs font-medium text-[#791D2A] hover:bg-[#F5F3ED]"
        >
          Coba Lagi
        </button>
      </div>
    </StateShell>
  );
}

export function DistributionNoMarketState() {
  return (
    <StateShell
      icon={<MapPin className="h-4 w-4" />}
      headline="Pilih pasar untuk melihat distribusi harga laporan warga."
      description="Distribusi dihitung per pasar dan per komoditas. Laporan dari pasar berbeda tidak digabungkan dalam satu histogram."
    />
  );
}

export function DistributionEmptyState() {
  return (
    <StateShell
      icon={<BarChart3 className="h-4 w-4" />}
      headline="Belum Ada Laporan Hari Ini"
      description="Belum terdapat laporan harga warga yang diterima untuk komoditas ini pada pasar terpilih."
    >
      <FactList
        rows={[
          { label: 'Laporan masuk', value: <Metric value={0} /> },
          { label: 'Laporan valid', value: <Metric value={0} /> },
          { label: 'Kuorum', value: <Metric value={0} suffix={` / ${QUORUM_MIN}`} /> },
          { label: 'Median harga', value: <span className="italic text-[#77746C]">Belum tersedia</span> },
        ]}
      />
    </StateShell>
  );
}

export function DistributionExpiredState({ breakdown }: { breakdown: ValidationBreakdown }) {
  return (
    <StateShell
      icon={<BarChart3 className="h-4 w-4" />}
      headline="Tidak Ada Laporan Aktif"
      description="Laporan dari periode sebelumnya telah kedaluwarsa dan hanya tersedia sebagai arsip historis."
    >
      <FactList
        rows={[
          { label: 'Laporan aktif hari ini', value: <Metric value={0} /> },
          { label: 'Laporan historis', value: <Metric value={breakdown.historical} /> },
          { label: 'Kuorum hari ini', value: <Metric value={0} suffix={` / ${QUORUM_MIN}`} /> },
          { label: 'Median harga', value: <span className="italic text-[#77746C]">Belum tersedia</span> },
        ]}
      />
    </StateShell>
  );
}

export function ValidationFacts({ breakdown }: { breakdown: ValidationBreakdown }) {
  return (
    <FactList
      rows={[
        { label: 'Laporan diterima', value: <Metric value={breakdown.receivedActive} /> },
        { label: 'Perangkat unik', value: <Metric value={breakdown.uniqueDevices} /> },
        { label: 'Duplikat perangkat', value: <Metric value={breakdown.duplicates} /> },
        { label: 'Lolos radius 3 km', value: <Metric value={breakdown.withinRadius} /> },
        { label: 'Di luar radius', value: <Metric value={breakdown.outsideRadius} /> },
        { label: 'Laporan anomali', value: <Metric value={breakdown.anomalies} /> },
        { label: 'Laporan valid', value: <Metric value={breakdown.valid} /> },
        { label: 'Arsip (kedaluwarsa)', value: <Metric value={breakdown.historical} /> },
      ]}
    />
  );
}

export function DistributionInvalidState({ breakdown }: { breakdown: ValidationBreakdown }) {
  return (
    <StateShell
      icon={<AlertCircle className="h-4 w-4" />}
      headline="Belum Ada Laporan yang Memenuhi Syarat"
      description="Seluruh laporan yang diterima belum memenuhi persyaratan untuk membentuk konsensus harga warga. Median: belum tersedia."
    >
      <ValidationFacts breakdown={breakdown} />
    </StateShell>
  );
}

export function QuorumProgress({ valid }: { valid: number }) {
  const reached = valid >= QUORUM_MIN;
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EAE8E1]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={QUORUM_MIN}
        aria-valuenow={Math.min(valid, QUORUM_MIN)}
        aria-label="Progres kuorum"
      >
        <div
          className={`h-full ${reached ? 'bg-[#729B82]' : 'bg-[#D6B45F]'}`}
          style={{ width: `${Math.min(100, (valid / QUORUM_MIN) * 100)}%` }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-[#292824]">
        {valid} / {QUORUM_MIN}
      </span>
    </div>
  );
}
