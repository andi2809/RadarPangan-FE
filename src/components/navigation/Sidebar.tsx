'use client';

import React from 'react';
import { ActiveNavTab, ActiveScreen, Commodity } from '../../types/domain';
import {
  Map,
  BarChart3,
  Users,
  Settings,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  activeScreen: ActiveScreen;
  onToggleScreen: (screen: ActiveScreen) => void;
  commodities: Commodity[];
  selectedCommodityId: string;
  onSelectCommodity: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onChangeHorizon: (horizon: 'aktual' | 'h7') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeScreen,
  onToggleScreen,
  commodities,
  selectedCommodityId,
  onSelectCommodity,
  activeHorizon,
  onChangeHorizon
}) => {
  const isCommandCenter = activeScreen === 'command-center';

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col justify-between border-r transition-colors duration-200 select-none z-30 ${
        isCommandCenter
          ? 'bg-slate-900 border-slate-800 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Top Branding & Main Nav */}
      <div>
        {/* Brand Header */}
        <div className={`p-4 border-b ${isCommandCenter ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight flex items-center gap-1.5">
                <span>RADAR PANGAN</span>
              </div>
              <div className="text-[10px] font-mono tracking-wider font-semibold uppercase text-sky-600 dark:text-sky-400">
                EWS & DSS JABAR
              </div>
            </div>
          </div>
        </div>

        {/* Primary Navigation Items */}
        <nav className="p-3 space-y-1">
          <button
            onClick={() => {
              onSelectTab('gis');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'gis'
                ? isCommandCenter
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-900 text-white shadow-sm'
                : isCommandCenter
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Peta Wilayah (GIS)</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'analytics'
                ? isCommandCenter
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 text-white'
                : isCommandCenter
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analisis & Laporan</span>
          </button>

          <button
            onClick={() => onSelectTab('crowdsource')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'crowdsource'
                ? isCommandCenter
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 text-white'
                : isCommandCenter
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Validasi Warga (Crowdsource)</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'settings'
                ? isCommandCenter
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 text-white'
                : isCommandCenter
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Data</span>
          </button>
        </nav>

        {/* Filter Cepat (Sidebar Sub-Panel) */}
        <div className={`mx-3 my-2 p-3 rounded-xl border ${
          isCommandCenter ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-wider font-bold mb-2.5 text-slate-400">
            Filter Cepat Pemantauan
          </div>

          {/* Commodity Dropdown */}
          <div className="mb-3">
            <label className="text-[11px] font-medium block mb-1 text-slate-500">Komoditas:</label>
            <div className="relative">
              <select
                value={selectedCommodityId}
                onChange={(e) => onSelectCommodity(e.target.value)}
                className={`w-full appearance-none rounded-lg px-2.5 py-1.5 text-xs font-medium border cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                  isCommandCenter
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {commodities.map((comm) => (
                  <option key={comm.id} value={comm.id}>
                    {comm.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          {/* Time Horizon Switcher */}
          <div>
            <label className="text-[11px] font-medium block mb-1 text-slate-500">Horizon Waktu:</label>
            <div className={`grid grid-cols-2 p-0.5 rounded-lg border ${
              isCommandCenter ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300'
            }`}>
              <button
                onClick={() => onChangeHorizon('aktual')}
                className={`py-1 text-[11px] font-mono font-semibold rounded-md transition-all ${
                  activeHorizon === 'aktual'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => onChangeHorizon('h7')}
                className={`py-1 text-[11px] font-mono font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                  activeHorizon === 'h7'
                    ? 'bg-amber-600 text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>H+7</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Mode Switcher at Sidebar Bottom */}
      <div className={`p-3 border-t ${isCommandCenter ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="text-[10px] font-mono uppercase text-slate-400 mb-2 font-bold tracking-wider">
          Mode Tampilan Layar
        </div>
        <div className="space-y-1.5">
          <button
            onClick={() => onToggleScreen('overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              activeScreen === 'overview'
                ? 'bg-sky-50 border-sky-300 text-sky-800 dark:bg-sky-950/80 dark:border-sky-700 dark:text-sky-300'
                : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>1. Executive Overview</span>
            {activeScreen === 'overview' && <span className="w-2 h-2 rounded-full bg-sky-500" />}
          </button>

          <button
            onClick={() => onToggleScreen('command-center')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              activeScreen === 'command-center'
                ? 'bg-slate-900 text-white border-slate-700 shadow-sm dark:bg-sky-600 dark:border-sky-500'
                : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>2. GIS Command Center</span>
            {activeScreen === 'command-center' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>
        </div>

        {/* Agency Tag */}
        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>TPID Jabar v2.1</span>
          <span className="text-emerald-600 font-bold">● EWS Aktif</span>
        </div>
      </div>
    </aside>
  );
};
