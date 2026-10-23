'use client';

import React from 'react';
import { UnifiedRegionTelemetry, SupplyRoute } from '../../types/domain';
import { X, TrendingUp, Truck, ShieldAlert, Wallet, Sparkles } from 'lucide-react';

interface RegionDetailDrawerProps {
  telemetry: UnifiedRegionTelemetry | null;
  onClose: () => void;
  activeHorizon: 'aktual' | 'h7';
  onFindSupplyRoutes: () => void;
  activeSupplyRoutes: SupplyRoute[];
}

export const RegionDetailDrawer: React.FC<RegionDetailDrawerProps> = ({
  telemetry,
  onClose,
  activeHorizon,
  onFindSupplyRoutes,
  activeSupplyRoutes
}) => {
  if (!telemetry) return null;

  const { region, currentPrice, history14d, predictionH7, supply, affordability } = telemetry;
  const isH7 = activeHorizon === 'h7';

  // SVG Chart Calculation for H-14 to H+7
  const allPrices = [
    ...history14d.map((h) => h.hargaRp),
    predictionH7.hargaPrediksiH7Rp
  ];
  const minPrice = Math.min(...allPrices, predictionH7.confidenceLowerRp) * 0.96;
  const maxPrice = Math.max(...allPrices, predictionH7.confidenceUpperRp) * 1.04;

  const chartWidth = 320;
  const chartHeight = 110;

  // Scale function
  const getX = (index: number) => (index / 21) * chartWidth;
  const getY = (val: number) =>
    chartHeight - ((val - minPrice) / (maxPrice - minPrice)) * chartHeight;

  // History path (indices 0 to 14)
  const historyPoints = history14d
    .map((h, i) => `${getX(i)},${getY(h.hargaRp)}`)
    .join(' L ');
  const historyPath = `M ${historyPoints}`;

  // Forecast path (index 14 to index 21)
  const forecastStart = `${getX(14)},${getY(currentPrice.hargaAktualRp)}`;
  const forecastEnd = `${getX(21)},${getY(predictionH7.hargaPrediksiH7Rp)}`;
  const forecastPath = `M ${forecastStart} L ${forecastEnd}`;

  // Confidence area polygon (index 14 to 21)
  const confUpper = getY(predictionH7.confidenceUpperRp);
  const confLower = getY(predictionH7.confidenceLowerRp);
  const startY = getY(currentPrice.hargaAktualRp);
  const confidenceArea = `M ${getX(14)},${startY} L ${getX(21)},${confUpper} L ${getX(21)},${confLower} Z`;

  return (
    <aside className="fixed top-20 right-4 bottom-6 z-40 w-96 max-w-[calc(100vw-32px)] bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md overflow-y-auto select-none text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">{region.name}</h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
              {region.id}
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

      {/* Main Pricing Telemetry Banner */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {isH7 ? 'Status Proyeksi H+7' : 'Harga Aktual Terkini'}
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
              (isH7 ? predictionH7.status : currentPrice.status) === 'kritis'
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : (isH7 ? predictionH7.status : currentPrice.status) === 'waspada'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}
          >
            {isH7 ? predictionH7.status : currentPrice.status}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            Rp {(isH7 ? predictionH7.hargaPrediksiH7Rp : currentPrice.hargaAktualRp).toLocaleString('id-ID')}
          </div>
          <div
            className={`text-sm font-mono font-bold tabular-nums ${
              (isH7 ? predictionH7.selisihPersen : currentPrice.selisihPersen) > 0
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}
          >
            {(isH7 ? predictionH7.selisihPersen : currentPrice.selisihPersen) > 0 ? '+' : ''}
            {isH7 ? predictionH7.selisihPersen : currentPrice.selisihPersen}% HAP
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono mt-1">
          Acuan Resmi: Rp {currentPrice.hargaAcuanRp.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Mini Trend Line Chart (H-14 to H+7) */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            Tren H-14 & Proyeksi H+7
          </span>
          <span className="text-[10px] font-mono text-amber-400">Pita Konfidensi &plusmn;5%</span>
        </div>

        <div className="relative w-full h-[110px] overflow-hidden">
          <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Confidence Area */}
            <path d={confidenceArea} fill="#F59E0B" fillOpacity="0.15" />
            {/* Historical Solid Line */}
            <path d={historyPath} fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
            {/* Forecast Dashed Line */}
            <path
              d={forecastPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.2"
              strokeDasharray="4,3"
              strokeLinecap="round"
            />
            {/* Split boundary marker */}
            <line
              x1={getX(14)}
              y1={0}
              x2={getX(14)}
              y2={chartHeight}
              stroke="#475569"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1 border-t border-slate-800/80 pt-1">
          <span>H-14</span>
          <span className="text-sky-300">Hari Ini (H0)</span>
          <span className="text-amber-400 font-semibold">Proyeksi (H+7)</span>
        </div>
      </div>

      {/* EWS Score & Risk Drivers */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 mb-3 text-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Early Warning Score
          </span>
          <span className="font-bold font-mono text-sm text-white">
            {predictionH7.ewsScore} <span className="text-xs text-slate-400">/ 100</span>
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Deviasi HAP (Bobot 45%)</span>
              <span className="text-slate-200">{predictionH7.drivers.deviasiHapScore} pts</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${predictionH7.drivers.deviasiHapScore}%` }}
                className="h-full bg-rose-500 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Kecepatan Kenaikan (Bobot 35%)</span>
              <span className="text-slate-200">{predictionH7.drivers.trendLajuScore} pts</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${predictionH7.drivers.trendLajuScore}%` }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Affordability Index (UMK & Kemiskinan) */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 mb-3 text-xs">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            Daya Beli & Keterjangkauan
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold border border-slate-700">
            {affordability.kategoriDayaBeli}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          {affordability.uraianBeban ||
            `Beban pangan 5 komoditas pokok mengonsumsi ${affordability.umkRatioBasketPercent}% dari total UMK bulanan.`}
        </p>
      </div>

      {/* Smart Supply Matchmaker DSS Button */}
      <div className="mt-3">
        <button
          onClick={onFindSupplyRoutes}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Truck className="w-4 h-4" />
          <span>Cari Rute Pasokan Surplus Terdekat</span>
        </button>

        {activeSupplyRoutes.length > 0 && (
          <div className="mt-2 text-[11px] font-mono text-sky-400 text-center">
            &check; {activeSupplyRoutes.length} koridor distribusi aktif di peta
          </div>
        )}
      </div>
    </aside>
  );
};
