'use client';

import React, { useState } from 'react';
import { UnifiedRegionTelemetry, Commodity, SupplyRoute } from '../../../types/domain';
import {
  X,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowUpRight,
  Maximize2
} from 'lucide-react';

interface RightAnalysisDrawerProps {
  telemetry: UnifiedRegionTelemetry | null;
  selectedCommodity: Commodity;
  activeHorizon: 'aktual' | 'h7';
  onClose: () => void;
  onActivateRoute: () => void;
  isRouteActive: boolean;
}

export const RightAnalysisDrawer: React.FC<RightAnalysisDrawerProps> = ({
  telemetry,
  selectedCommodity,
  activeHorizon,
  onClose,
  onActivateRoute,
  isRouteActive
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ringkasan' | 'harga' | 'tren' | 'distribusi' | 'rekomendasi'>('ringkasan');

  if (!telemetry) return null;

  const { region, currentPrice, predictionH7, supply, affordability } = telemetry;
  const isH7 = activeHorizon === 'h7';

  return (
    <aside className="absolute top-20 right-4 bottom-64 z-30 w-96 max-w-[calc(100vw-32px)] bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md overflow-y-auto select-none text-slate-200 pointer-events-auto">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">{region.name}</h2>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                currentPrice.status === 'kritis'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : currentPrice.status === 'waspada'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}
            >
              {currentPrice.status === 'kritis' ? 'Rentan' : currentPrice.status}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Jawa Barat &bull; UMK Rp {region.umk2026.toLocaleString('id-ID')}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Tutup Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mini Sub-Tabs Header */}
      <div className="flex items-center gap-1 border-b border-slate-800/80 pb-2 mb-3 text-[11px] font-mono text-slate-400">
        {(['ringkasan', 'harga', 'tren', 'distribusi', 'rekomendasi'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-2 py-0.5 rounded capitalize transition-colors ${
              activeSubTab === tab
                ? 'bg-slate-800 text-white font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Status & Risiko Section */}
      <div className="space-y-3">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Status & Risiko Wilayah
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {affordability.umkRatioBasketPercent}%
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
                Tinggi
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Beban terhadap UMK</div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
              <span className="text-sm font-bold font-mono text-rose-400 tabular-nums">
                Rp {predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')}/kg
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Prediksi H+7 ({predictionH7.selisihPersen > 0 ? '+' : ''}{predictionH7.selisihPersen}%)
            </div>
          </div>
        </div>
      </div>

      {/* Harga Komoditas Section */}
      <div className="space-y-2 pt-3 border-t border-slate-800/80">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-slate-400 font-bold uppercase">Harga {selectedCommodity.name}</span>
          <span className="text-white font-bold tabular-nums">
            Rp {currentPrice.hargaAktualRp.toLocaleString('id-ID')}/kg
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Rata-rata Jawa Barat:</span>
          <span className="text-slate-200 font-semibold tabular-nums">
            Rp 68.400/kg <span className="text-rose-400 font-bold">(+5,2%)</span>
          </span>
        </div>

        {/* Mini sparkline */}
        <div className="w-full h-8 bg-slate-950/50 rounded-lg p-1 border border-slate-800 flex items-center justify-center">
          <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke="#DC2626"
              strokeWidth="2"
              strokeLinecap="round"
              points="0,18 20,16 40,14 60,15 80,10 100,6"
            />
            <circle cx="100" cy="6" r="3" fill="#DC2626" />
          </svg>
        </div>
      </div>

      {/* Ketahanan Wilayah (Donut Gauge) */}
      <div className="space-y-2 pt-3 border-t border-slate-800/80">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Ketahanan Wilayah
        </div>

        <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          {/* Donut SVG */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray="62.4, 100"
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[10px] text-white">
              62%
            </div>
          </div>

          <div className="flex-1 space-y-1 font-mono text-[10px]">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Terkendali</span>
              </span>
              <span className="text-white font-bold">62,4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Waspada</span>
              </span>
              <span className="text-white font-bold">24,8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Rentan</span>
              </span>
              <span className="text-rose-400 font-bold">12,8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Aksi Intervensi */}
      <div className="mt-3.5 bg-emerald-950/40 border border-emerald-600/50 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Rekomendasi Aksi TPID</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          Distribusikan cadangan <strong>8 Ton dari Kab. Garut (Surplus)</strong> ke <strong>{region.name}</strong> untuk menekan lonjakan harga.
        </p>
        <button
          onClick={onActivateRoute}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
            isRouteActive
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/50'
              : 'bg-emerald-700 hover:bg-emerald-600 text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>{isRouteActive ? '✓ Rute Distribusi Aktif di Peta' : 'Buat Rute Distribusi →'}</span>
        </button>
      </div>
    </aside>
  );
};
