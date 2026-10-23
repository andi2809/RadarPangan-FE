'use client';

import React from 'react';
import { UnifiedRegionTelemetry, WhatIfParameters } from '../../types/domain';
import { simulateIntervention } from '../../lib/engines/what-if';
import { Sliders, RotateCcw, X, Zap } from 'lucide-react';

interface WhatIfSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTelemetry: UnifiedRegionTelemetry | null;
  params: WhatIfParameters;
  onParamsChange: (newParams: WhatIfParameters) => void;
  onResetParams: () => void;
}

export const WhatIfSandbox: React.FC<WhatIfSandboxProps> = ({
  isOpen,
  onClose,
  selectedTelemetry,
  params,
  onParamsChange,
  onResetParams
}) => {
  if (!isOpen) return null;

  const simulation = selectedTelemetry
    ? simulateIntervention({
        baseTelemetry: selectedTelemetry,
        transportSubsidyPercent: params.transportSubsidyPercent,
        marketOperationTonnage: params.marketOperationTonnage,
        distributionIntervention: params.distributionIntervention
      })
    : null;

  return (
    <div className="fixed bottom-6 left-6 z-40 w-96 max-w-[calc(100vw-32px)] bg-slate-900/95 border border-purple-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md select-none text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-600/40 text-purple-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">
              WHAT-IF CRISIS SANDBOX
            </h3>
            <p className="text-[10px] text-purple-300 font-mono">
              Simulasi Intervensi TPID & Satgas Pangan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onResetParams}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reset Parameter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Tutup Sandbox"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Regency Notice */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 mb-3 text-xs flex justify-between items-center">
        <span className="text-slate-400">Target Wilayah Simulasi:</span>
        <span className="font-semibold text-white font-mono">
          {selectedTelemetry ? selectedTelemetry.region.name : 'Pilih Wilayah di Peta'}
        </span>
      </div>

      {/* Control Sliders */}
      <div className="space-y-3.5 text-xs">
        {/* Slider 1: Subsidi Ongkos Angkut */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-300 font-medium">Subsidi Angkut Logistik:</label>
            <span className="font-mono font-bold text-sky-400 tabular-nums">
              {params.transportSubsidyPercent}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={params.transportSubsidyPercent}
            onChange={(e) =>
              onParamsChange({
                ...params,
                transportSubsidyPercent: Number(e.target.value)
              })
            }
            className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Slider 2: Operasi Pasar Murah (GPM) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-300 font-medium">Injeksi Stok GPM (Pasar Murah):</label>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {params.marketOperationTonnage} Ton
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="25"
            value={params.marketOperationTonnage}
            onChange={(e) =>
              onParamsChange({
                ...params,
                marketOperationTonnage: Number(e.target.value)
              })
            }
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
            <span>0 Ton</span>
            <span>250 Ton</span>
            <span>500 Ton</span>
          </div>
        </div>

        {/* Toggle 3: Fasilitasi Distribusi Pangan */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800">
          <div>
            <div className="font-medium text-slate-300">Fasilitasi Koridor Tol Laut / Darat</div>
            <div className="text-[10px] text-slate-500">Bebas hambatan distribusi logistik pangan</div>
          </div>
          <input
            type="checkbox"
            checked={params.distributionIntervention}
            onChange={(e) =>
              onParamsChange({
                ...params,
                distributionIntervention: e.target.checked
              })
            }
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Real-time Calculation Outcome */}
      {simulation && selectedTelemetry && (
        <div className="mt-3.5 pt-3 border-t border-purple-500/30 bg-purple-950/20 p-2.5 rounded-xl border border-purple-900/40 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">
              Hasil Simulasi Dampak
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                simulation.simulatedStatus === 'kritis'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : simulation.simulatedStatus === 'waspada'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}
            >
              Status: {simulation.simulatedStatus}
            </span>
          </div>

          <div className="flex justify-between items-baseline mb-1">
            <span className="text-slate-400">Harga Terintervensi:</span>
            <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
              Rp {simulation.simulatedPriceRp.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Penurunan Harga:</span>
            <span className="text-emerald-400 font-bold tabular-nums">
              -Rp {simulation.priceReductionRp.toLocaleString('id-ID')} (-{simulation.reductionPercentage}%)
            </span>
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed mt-2 pt-1.5 border-t border-slate-800 font-sans">
            {simulation.keteranganEfek}
          </div>
        </div>
      )}
    </div>
  );
};
