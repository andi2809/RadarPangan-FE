'use client';

import React from 'react';
import { MbgSourcingRecommendation } from '../../types/domain';
import { ChefHat, ArrowRight, ShieldCheck, TrendingDown, MapPin } from 'lucide-react';

interface MbgSourcingPanelProps {
  recommendations: MbgSourcingRecommendation[];
  onFocusMbgRoute: (rec: MbgSourcingRecommendation) => void;
  onClose: () => void;
}

export const MbgSourcingPanel: React.FC<MbgSourcingPanelProps> = ({
  recommendations,
  onFocusMbgRoute,
  onClose
}) => {
  return (
    <div className="fixed top-20 left-4 bottom-6 z-40 w-[420px] max-w-[calc(100vw-32px)] bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md overflow-y-auto select-none text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              MBG SMART SOURCING
            </h2>
            <p className="text-[11px] text-emerald-400 font-mono">
              Badan Gizi Nasional &bull; Rantai Pasok SPPG Jabar
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs"
        >
          &times;
        </button>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-2.5 mb-3 text-xs text-slate-300 leading-relaxed font-sans">
        Algoritma pencocokan otomatis antara dapur sentral SPPG MBG dengan sentra surplus lokal Jawa Barat guna menekan biaya logistik dan mencegah lonjakan harga di pasar lokal.
      </div>

      {/* Sourcing Cards List */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-3 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                {rec.sppgId}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                <TrendingDown className="w-3 h-3" /> Hemat {rec.potensiHematPersen}%
              </span>
            </div>

            <div className="font-semibold text-xs text-white mb-2">{rec.sppgName}</div>

            {/* Sourcing Route Visual */}
            <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800/80 text-xs font-mono mb-2.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                <span>Sentra Surplus Rekomendasi</span>
                <span>Dapur Target MBG</span>
              </div>
              <div className="flex items-center justify-between text-white font-semibold">
                <span className="text-emerald-400">{rec.recommendedSourceRegionName}</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className="text-sky-400">{rec.targetRegionName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2.5">
              <span>Kebutuhan Bahan Baku:</span>
              <span className="font-bold text-white tabular-nums">
                {rec.kebutuhanTonPerBulan} Ton / Bulan
              </span>
            </div>

            <button
              onClick={() => onFocusMbgRoute(rec)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Lihat Rute Logistik di Peta</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
