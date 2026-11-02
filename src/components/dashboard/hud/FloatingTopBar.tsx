'use client';

import React from 'react';
import { Commodity } from '../../../types/domain';
import { ArrowLeft, ChevronDown, Calendar, Layers, ShieldCheck } from 'lucide-react';

interface FloatingTopBarProps {
  commodities: Commodity[];
  selectedCommodity: Commodity;
  onSelectCommodity: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onChangeHorizon: (horizon: 'aktual' | 'h7') => void;
  onBackToOverview: () => void;
}

export const FloatingTopBar: React.FC<FloatingTopBarProps> = ({
  commodities,
  selectedCommodity,
  onSelectCommodity,
  activeHorizon,
  onChangeHorizon,
  onBackToOverview
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-40 pointer-events-none select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-md pointer-events-auto">
        {/* Left: Back to Overview & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToOverview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Ringkasan Dashboard</span>
          </button>

          <span className="w-px h-5 bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">
              GIS COMMAND CENTER
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 font-bold hidden md:inline-block">
              27 KAB/KOTA JABAR
            </span>
          </div>
        </div>

        {/* Center: Filters */}
        <div className="flex items-center gap-3">
          {/* Commodity Dropdown */}
          <div className="relative">
            <select
              value={selectedCommodity.id}
              onChange={(e) => onSelectCommodity(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-600 text-white text-xs font-medium rounded-xl pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (HAP Rp {c.hargaAcuanRp.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Time Horizon Switcher */}
          <div className="flex bg-slate-950/80 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => onChangeHorizon('aktual')}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                activeHorizon === 'aktual'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => onChangeHorizon('h7')}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeHorizon === 'h7'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>H+7</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </button>
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Koneksi Real-time Telemetri</span>
          </div>
        </div>
      </div>
    </div>
  );
};
