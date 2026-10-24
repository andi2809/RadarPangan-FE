'use client';

import React from 'react';
import { ActiveScreen } from '../../types/domain';
import { Search, Bell, User, ExternalLink, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onToggleScreen: (screen: ActiveScreen) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegionName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onToggleScreen,
  searchQuery,
  onSearchChange,
  selectedRegionName
}) => {
  const isCommandCenter = activeScreen === 'command-center';

  return (
    <header
      className={`h-16 px-6 border-b flex items-center justify-between shrink-0 transition-colors select-none ${
        isCommandCenter
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Left: Breadcrumbs & Context Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Jawa Barat</span>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {activeScreen === 'overview' ? 'Executive Overview TPID' : 'GIS Command Center'}
          </span>
          {selectedRegionName && (
            <>
              <span>/</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono font-bold text-[11px]">
                {selectedRegionName}
              </span>
            </>
          )}
        </div>

        <span className="hidden md:inline-block w-px h-4 bg-slate-300 dark:bg-slate-700" />

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bapanas &bull; PIHPS BI Live</span>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kabupaten, kota, atau pasar (contoh: Bekasi, Caringin)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 border ${
              isCommandCenter
                ? 'bg-slate-950/80 border-slate-700 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Right: Screen Mode Shortcut & Profile */}
      <div className="flex items-center gap-3">
        {/* Toggle Mode Button */}
        {activeScreen === 'overview' ? (
          <button
            onClick={() => onToggleScreen('command-center')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Buka Konsol GIS Penuh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onToggleScreen('overview')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            <span>&larr; Kembali ke Ringkasan</span>
          </button>
        )}

        {/* Notifications */}
        <button
          className={`relative p-2 rounded-lg border transition-colors ${
            isCommandCenter
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Pemberitahuan Peringatan Dini"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* User Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold leading-tight">Admin TPID Jabar</div>
            <div className="text-[10px] text-slate-400 font-mono">Biro Perekonomian</div>
          </div>
        </div>
      </div>
    </header>
  );
};
