'use client';

import React, { useState } from 'react';
import {
  TopRiskRegionItem,
  OtherCommoditySparkline,
  CrisisScenario
} from '../../../types/domain';
import {
  TOP_5_RISK_REGIONS,
  OTHER_COMMODITY_SPARKLINES,
  CRISIS_SCENARIOS
} from '../../../data/mock/dashboardData';
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  Zap,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

interface BottomTelemetryDockProps {
  onSelectRegion: (id: string) => void;
  selectedRegionId: string;
  onActivateRoute: () => void;
  onRunSimulation: (scenario: CrisisScenario) => void;
  isSimulating: boolean;
}

export const BottomTelemetryDock: React.FC<BottomTelemetryDockProps> = ({
  onSelectRegion,
  selectedRegionId,
  onActivateRoute,
  onRunSimulation,
  isSimulating
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(CRISIS_SCENARIOS[0].id);
  const activeScenario = CRISIS_SCENARIOS.find((s) => s.id === selectedScenarioId) || CRISIS_SCENARIOS[0];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 select-none pointer-events-none">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md pointer-events-auto text-slate-200">
        {/* Kolom 1: Top 5 Wilayah Risiko Tertinggi */}
        <div className="space-y-2 border-r border-slate-800 pr-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
            Top 5 Risiko Tertinggi
          </div>

          <div className="space-y-1 text-xs font-mono">
            {TOP_5_RISK_REGIONS.map((item) => (
              <div
                key={item.regionId}
                onClick={() => onSelectRegion(item.regionId)}
                className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedRegionId === item.regionId
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-bold">{item.rank}</span>
                  <span className="truncate max-w-[85px]">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tabular-nums text-slate-200">{item.burdenUmkPercent}%</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      item.status === 'kritis'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {item.statusLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 2: Tren Harga Cabai Rawit Merah (Jawa Barat) */}
        <div className="space-y-1.5 border-r border-slate-800 pr-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 truncate">
              Tren Cabai Rawit (Jabar)
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800">
              +8,7%
            </span>
          </div>

          {/* SVG Trend Chart */}
          <div className="w-full h-24 relative bg-slate-950/60 rounded-lg p-1.5 border border-slate-800/80">
            <svg viewBox="0 0 200 70" className="w-full h-full overflow-visible">
              {/* Reference Grid */}
              <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="0" y1="45" x2="200" y2="45" stroke="#334155" strokeWidth="0.8" strokeDasharray="2,2" />

              {/* History Solid Line */}
              <polyline
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
                points="0,55 30,50 60,48 90,42 120,38 150,32"
              />

              {/* Forecast Dashed Line */}
              <polyline
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeDasharray="3,3"
                strokeLinecap="round"
                points="150,32 175,22 200,12"
              />

              <circle cx="150" cy="32" r="3" fill="#DC2626" />
              <circle cx="200" cy="12" r="3" fill="#DC2626" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
            <span>15 Okt</span>
            <span className="text-slate-300">&mdash; Aktual</span>
            <span className="text-rose-400 font-semibold">--- H+7</span>
          </div>
        </div>

        {/* Kolom 3: Distribusi Pasokan (Surplus -> Defisit) */}
        <div className="space-y-1.5 border-r border-slate-800 pr-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
            Distribusi Pasokan
          </div>

          {/* Logistics Corridor Graphic Box */}
          <div
            onClick={onActivateRoute}
            className="w-full h-24 bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 cursor-pointer hover:border-sky-500/50 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                Surplus: Garut (8T)
              </span>
              <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 font-bold border border-rose-800">
                Defisit: Bekasi
              </span>
            </div>

            {/* Visual Route Curve with Truck Icon */}
            <div className="relative flex items-center justify-center my-1">
              <svg viewBox="0 0 120 28" className="w-full h-7 overflow-visible">
                <path
                  d="M 10 20 Q 60 5 110 15"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                />
                <circle cx="60" cy="11" r="9" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="56" y="14" fill="#FFFFFF" fontSize="8">🚚</text>
              </svg>
            </div>

            <div className="text-[10px] font-mono text-center text-sky-400 font-semibold">
              Koridor Tol Cipularang &bull; 4.2 Jam
            </div>
          </div>

          <div className="text-[9px] font-mono text-slate-400 text-center">
            Klik kotak untuk menyorot rute di peta
          </div>
        </div>

        {/* Kolom 4: Komoditas Lain - Status Wilayah */}
        <div className="space-y-1.5 border-r border-slate-800 pr-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
            Komoditas Lain (Jabar)
          </div>

          <div className="space-y-1 text-xs font-mono">
            {OTHER_COMMODITY_SPARKLINES.map((comm) => (
              <div key={comm.id} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 truncate max-w-[90px]">{comm.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, comm.changePct * 12)}%` }}
                      className={`h-full rounded-full ${
                        comm.changePct > 5
                          ? 'bg-rose-500'
                          : comm.changePct > 3
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span
                    className={`font-bold tabular-nums ${
                      comm.changePct > 5
                        ? 'text-rose-400'
                        : comm.changePct > 3
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    +{comm.changePct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 5: Simulasi Skenario ("What-If Engine") */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Simulasi Skenario</span>
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="w-full appearance-none bg-slate-800 border border-slate-700 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              {CRISIS_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none text-slate-400" />
          </div>

          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 font-mono text-[10px] flex justify-between items-center">
            <span className="text-slate-400">Prediksi Dampak:</span>
            <span className="text-rose-400 font-bold tabular-nums">
              +{activeScenario.projectedImpactPct}% H+7
            </span>
          </div>

          <button
            onClick={() => onRunSimulation(activeScenario)}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isSimulating
                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                : 'bg-purple-800/80 hover:bg-purple-700 text-purple-100 border border-purple-600/50'
            }`}
          >
            <span>{isSimulating ? '✓ Simulasi Berjalan' : 'Jalankan Simulasi →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
