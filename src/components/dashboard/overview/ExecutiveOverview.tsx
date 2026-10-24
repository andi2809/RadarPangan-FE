'use client';

import React from 'react';
import {
  Commodity,
  Region,
  UnifiedRegionTelemetry,
  PriceStatus
} from '../../../types/domain';
import {
  KPI_METRICS_DATA,
  TOP_5_RISK_REGIONS,
  MARKET_COMPARISON_DATA
} from '../../../data/mock/dashboardData';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  DollarSign
} from 'lucide-react';

interface ExecutiveOverviewProps {
  commodities: Commodity[];
  selectedCommodity: Commodity;
  onSelectCommodity: (id: string) => void;
  activeHorizon: 'aktual' | 'h7';
  onChangeHorizon: (horizon: 'aktual' | 'h7') => void;
  allTelemetry: Record<string, UnifiedRegionTelemetry>;
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  onOpenCommandCenter: (regionId?: string) => void;
  onOpenSupplyRoute: () => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  commodities,
  selectedCommodity,
  onSelectCommodity,
  activeHorizon,
  onChangeHorizon,
  allTelemetry,
  selectedRegionId,
  onSelectRegion,
  onOpenCommandCenter,
  onOpenSupplyRoute
}) => {
  const selectedTelem = allTelemetry[selectedRegionId] || allTelemetry['32.16'] || Object.values(allTelemetry)[0];
  const isH7 = activeHorizon === 'h7';

  // Specific highlighted regions for quick interactive buttons
  const highlightRegions = [
    { id: '32.16', name: 'Kab. Bekasi', status: 'kritis', label: 'Defisit / Rentan (+8.7%)' },
    { id: '32.13', name: 'Kab. Subang', status: 'kritis', label: 'Rentan (+6.1%)' },
    { id: '32.73', name: 'Kota Bandung', status: 'waspada', label: 'Waspada (+4.8%)' },
    { id: '32.05', name: 'Kab. Garut', status: 'aman', label: 'Surplus Aman (-6.2%)' }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] text-slate-900 p-6 space-y-6">
      {/* 1. Header Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Peta Interaktif Kerawanan Harga Pangan Nasional
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono text-xs font-bold border border-sky-200">
              Jawa Barat
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau kondisi harga, potensi lonjakan, dan tingkat keterjangkauan bahan pokok di seluruh wilayah secara real-time.
          </p>
        </div>

        {/* Action Button: Buka Konsol GIS Penuh */}
        <button
          onClick={() => onOpenCommandCenter(selectedRegionId)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <span>Buka Konsol GIS Penuh</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Top Metrics Row (4 Clean KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Wilayah Dipantau
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {KPI_METRICS_DATA.totalWilayah}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">27 Kab/Kota</span> Jawa Barat
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Komoditas Strategis
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {KPI_METRICS_DATA.komoditasDipantau}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Bahan Pokok Pangan Bapanas
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-rose-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-rose-50/30">
          <div className="text-[11px] font-mono text-rose-500 uppercase tracking-wider font-semibold">
            Wilayah Risiko Tinggi
          </div>
          <div className="text-3xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
            {KPI_METRICS_DATA.wilayahRisikoTinggi}
          </div>
          <div className="text-xs text-rose-700/80 mt-1 font-medium">
            Kab / Kota Memerlukan Intervensi
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50/30">
          <div className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider font-semibold">
            Wilayah Surplus Pasokan
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {KPI_METRICS_DATA.wilayahSurplus}
          </div>
          <div className="text-xs text-emerald-700/80 mt-1 font-medium">
            Kab / Kota Siap Pasok Distribusi
          </div>
        </div>
      </div>

      {/* 3. Filter Strip Row */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Komoditas:</span>
            <select
              value={selectedCommodity.id}
              onChange={(e) => onSelectCommodity(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.jenisAcuan} Rp {c.hargaAcuanRp.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Horizon:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => onChangeHorizon('aktual')}
                className={`px-3 py-1 font-mono font-semibold rounded-md transition-all ${
                  activeHorizon === 'aktual'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => onChangeHorizon('h7')}
                className={`px-3 py-1 font-mono font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeHorizon === 'h7'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Prediksi H+7</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCommandCenter(selectedRegionId)}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Peta Interaktif Penuh</span>
          </button>
        </div>
      </div>

      {/* 4. Central Map Preview + Quick Region Telemetry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Map Showcase Box (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative flex flex-col justify-between min-h-[460px]">
          {/* Top Bar of Map Container */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Pratinjau Status Geospasial Jawa Barat</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {selectedCommodity.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {highlightRegions.map((hr) => (
                <button
                  key={hr.id}
                  onClick={() => onSelectRegion(hr.id)}
                  className={`text-[11px] font-mono px-2 py-1 rounded-md transition-all border ${
                    selectedRegionId === hr.id
                      ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {hr.name}
                </button>
              ))}
            </div>
          </div>

          {/* Map Preview Graphic Area */}
          <div className="relative my-4 flex-1 flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800 min-h-[320px]">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #38BDF8 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Stylized SVG Map of Jabar Regencies */}
            <svg viewBox="0 0 760 380" className="w-full h-full max-h-[340px] select-none p-4 z-10">
              <defs>
                <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38BDF8" />
                </filter>
              </defs>

              {/* Polygons of Jabar Regencies */}
              {/* Bekasi (Red/Critical in Cabai) */}
              <g
                onClick={() => onSelectRegion('32.16')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M120 70 L210 60 L230 115 L160 145 L110 115 Z"
                  fill="#DC2626"
                  stroke={selectedRegionId === '32.16' ? '#38BDF8' : '#7F1D1D'}
                  strokeWidth={selectedRegionId === '32.16' ? 3 : 1.5}
                  filter={selectedRegionId === '32.16' ? 'url(#glow-selected)' : undefined}
                />
                <text x="145" y="105" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Kab. Bekasi
                </text>
              </g>

              {/* Karawang (Amber/Waspada) */}
              <g
                onClick={() => onSelectRegion('32.15')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M210 60 L310 65 L295 135 L230 115 Z"
                  fill="#CA8A04"
                  stroke={selectedRegionId === '32.15' ? '#38BDF8' : '#78350F'}
                  strokeWidth={selectedRegionId === '32.15' ? 3 : 1.5}
                  filter={selectedRegionId === '32.15' ? 'url(#glow-selected)' : undefined}
                />
                <text x="240" y="100" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Karawang
                </text>
              </g>

              {/* Subang (Red/Rentan) */}
              <g
                onClick={() => onSelectRegion('32.13')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M310 65 L410 70 L385 145 L295 135 Z"
                  fill="#DC2626"
                  stroke={selectedRegionId === '32.13' ? '#38BDF8' : '#7F1D1D'}
                  strokeWidth={selectedRegionId === '32.13' ? 3 : 1.5}
                  filter={selectedRegionId === '32.13' ? 'url(#glow-selected)' : undefined}
                />
                <text x="335" y="105" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Subang
                </text>
              </g>

              {/* Indramayu (Green/Surplus Beras) */}
              <g
                onClick={() => onSelectRegion('32.12')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M410 70 L530 85 L505 160 L385 145 Z"
                  fill="#16A34A"
                  stroke={selectedRegionId === '32.12' ? '#38BDF8' : '#14532D'}
                  strokeWidth={selectedRegionId === '32.12' ? 3 : 1.5}
                  filter={selectedRegionId === '32.12' ? 'url(#glow-selected)' : undefined}
                />
                <text x="440" y="115" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Indramayu
                </text>
              </g>

              {/* Cirebon */}
              <g
                onClick={() => onSelectRegion('32.09')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M530 85 L620 120 L580 190 L505 160 Z"
                  fill="#16A34A"
                  stroke="#14532D"
                  strokeWidth="1.5"
                />
                <text x="535" y="145" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Cirebon
                </text>
              </g>

              {/* Bogor */}
              <g
                onClick={() => onSelectRegion('32.01')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M90 125 L160 145 L150 230 L80 195 Z"
                  fill="#CA8A04"
                  stroke="#78350F"
                  strokeWidth="1.5"
                />
                <text x="105" y="175" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Bogor
                </text>
              </g>

              {/* Cianjur */}
              <g
                onClick={() => onSelectRegion('32.03')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M160 145 L260 150 L240 250 L150 230 Z"
                  fill="#CA8A04"
                  stroke="#78350F"
                  strokeWidth="1.5"
                />
                <text x="185" y="195" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Cianjur
                </text>
              </g>

              {/* Bandung / Kota Bandung */}
              <g
                onClick={() => onSelectRegion('32.73')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M260 150 L370 155 L350 240 L240 250 Z"
                  fill="#CA8A04"
                  stroke={selectedRegionId === '32.73' ? '#38BDF8' : '#78350F'}
                  strokeWidth={selectedRegionId === '32.73' ? 3 : 1.5}
                  filter={selectedRegionId === '32.73' ? 'url(#glow-selected)' : undefined}
                />
                <text x="280" y="195" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  Bandung
                </text>
              </g>

              {/* Garut (Green/Surplus Cabai) */}
              <g
                onClick={() => onSelectRegion('32.05')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M350 240 L460 220 L440 320 L330 310 Z"
                  fill="#16A34A"
                  stroke={selectedRegionId === '32.05' ? '#38BDF8' : '#14532D'}
                  strokeWidth={selectedRegionId === '32.05' ? 3 : 1.5}
                  filter={selectedRegionId === '32.05' ? 'url(#glow-selected)' : undefined}
                />
                <text x="380" y="275" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Kab. Garut
                </text>
              </g>

              {/* Tasikmalaya */}
              <g
                onClick={() => onSelectRegion('32.06')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M460 220 L570 210 L540 310 L440 320 Z"
                  fill="#16A34A"
                  stroke="#14532D"
                  strokeWidth="1.5"
                />
                <text x="475" y="270" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Tasikmalaya
                </text>
              </g>

              {/* Ciamis & Banjar */}
              <g
                onClick={() => onSelectRegion('32.07')}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <path
                  d="M570 210 L660 215 L630 300 L540 310 Z"
                  fill="#16A34A"
                  stroke="#14532D"
                  strokeWidth="1.5"
                />
                <text x="585" y="260" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Ciamis
                </text>
              </g>

              {/* Supply Route Arrow Line: Garut -> Bekasi */}
              <path
                d="M 390 270 Q 250 180 160 110"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeDasharray="6,4"
              />
              {/* Truck Icon marker at midpoint */}
              <circle cx="270" cy="190" r="12" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
              <text x="264" y="194" fill="#FFFFFF" fontSize="10">🚚</text>

              {/* Interactive Tooltip Card overlaying on Selected Region (e.g. Bekasi) */}
              <g transform="translate(180, 40)">
                <rect width="180" height="85" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                <text x="12" y="22" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                  {selectedTelem.region.name}
                </text>
                <rect x="110" y="10" width="55" height="16" rx="4" fill="#7F1D1D" />
                <text x="118" y="22" fill="#FECACA" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  RENTAN
                </text>

                <text x="12" y="42" fill="#94A3B8" fontSize="10">
                  Harga Saat Ini:
                </text>
                <text x="95" y="42" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  Rp {selectedTelem.currentPrice.hargaAktualRp.toLocaleString('id-ID')}
                </text>

                <text x="12" y="58" fill="#94A3B8" fontSize="10">
                  Prediksi H+7:
                </text>
                <text x="95" y="58" fill="#F87171" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  Rp {selectedTelem.predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')}
                </text>

                <text x="12" y="74" fill="#94A3B8" fontSize="10">
                  Beban UMK:
                </text>
                <text x="95" y="74" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {selectedTelem.affordability.umkRatioBasketPercent}%
                </text>
              </g>
            </svg>

            {/* Bottom-left Legend inside Map Container */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 rounded-lg p-2.5 backdrop-blur-md text-[11px] font-mono text-slate-200 z-20 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                Tingkat Kerawanan Harga
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Terkendali / Surplus (0-5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span>Waspada Fluktuasi (5-10%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" />
                <span>Rentan / Defisit (&gt;10%)</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Action link to full command center */}
          <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100">
            <span className="text-slate-500">
              Menampilkan {highlightRegions.length} wilayah fokus pemantauan harian TPID Jawa Barat.
            </span>
            <button
              onClick={() => onOpenCommandCenter(selectedRegionId)}
              className="font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              <span>Lihat Detail di Konsol GIS Penuh</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Telemetry Column (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Region Telemetry Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Ringkasan Jawa Barat</h3>
                <p className="text-xs text-slate-500 font-mono">
                  Periode: {isH7 ? 'Prediksi H+7' : 'Harga Aktual Terkini'}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-xs">
                Aktif
              </span>
            </div>

            {/* Donut Gauge & Percentage */}
            <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {/* SVG Donut Circle */}
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="68.4, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-slate-800">
                  68%
                </div>
              </div>

              <div>
                <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  68,4%
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  wilayah terkendali
                </div>
                <div className="text-[11px] text-emerald-600 font-mono flex items-center gap-0.5 font-semibold mt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+6,8% dari minggu lalu</span>
                </div>
              </div>
            </div>

            {/* Top 3 Highest Risk Summary */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
                Risiko Tertinggi (Top 3)
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {TOP_5_RISK_REGIONS.slice(0, 3).map((r, idx) => (
                  <div
                    key={r.regionId}
                    onClick={() => onSelectRegion(r.regionId)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">{idx + 1}.</span>
                      <span className="font-semibold text-slate-800">{r.name}</span>
                    </div>
                    <span className="font-bold text-rose-600 tabular-nums">
                      +{r.deviationPct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rekomendasi Aksi Callout (Garut -> Bekasi) */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Rekomendasi Aksi Intervensi</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-sans">
                Distribusikan cadangan <strong>8 Ton dari Kab. Garut (Surplus)</strong> ke <strong>Kab. Bekasi</strong> untuk meredam lonjakan harga.
              </p>
              <button
                onClick={onOpenSupplyRoute}
                className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Lihat Rute Distribusi &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Section Detail Wilayah (Below Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Detail Wilayah Card (Col 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Detail Wilayah Terpilih</div>
              <h3 className="font-bold text-lg text-slate-900">{selectedTelem.region.name}</h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${
                selectedTelem.currentPrice.status === 'kritis'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : selectedTelem.currentPrice.status === 'waspada'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              {selectedTelem.currentPrice.status === 'kritis' ? 'Risiko Tinggi' : selectedTelem.currentPrice.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Harga Saat Ini</div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                Rp {selectedTelem.currentPrice.hargaAktualRp.toLocaleString('id-ID')}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Prediksi H+7</div>
              <div className="text-lg font-bold text-rose-600 tabular-nums">
                Rp {selectedTelem.predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono text-slate-600 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Beban terhadap UMK:</span>
              <span className="font-bold text-slate-900">{selectedTelem.affordability.umkRatioBasketPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Neraca Pasokan:</span>
              <span className="font-bold capitalize text-slate-900">
                {selectedTelem.supply.statusNeraca} ({selectedTelem.supply.hariKetahananStok} hari)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Deviasi terhadap HAP:</span>
              <span className="font-bold text-rose-600">+{selectedTelem.currentPrice.selisihPersen}%</span>
            </div>
          </div>
        </div>

        {/* Tren Harga Cabai Rawit Merah (Col 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Deret Waktu Historis & Proyeksi</div>
              <h3 className="font-bold text-base text-slate-900">
                Tren Harga {selectedCommodity.name} ({selectedTelem.region.name})
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-mono font-bold border border-rose-300">
              +{selectedTelem.predictionH7.selisihPersen}% H+7
            </span>
          </div>

          {/* SVG Trend Chart */}
          <div className="w-full h-36 relative">
            <svg viewBox="0 0 480 120" className="w-full h-full overflow-visible select-none">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="480" y2="30" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="70" x2="480" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="110" x2="480" y2="110" stroke="#E2E8F0" strokeWidth="1" />

              {/* Historical Trend Line (H-14 to H0) */}
              <polyline
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeLinecap="round"
                points="0,95 40,90 80,88 120,84 160,82 200,80 240,75 280,72 320,68 360,65"
              />

              {/* Forecast Dashed Line (H0 to H+7) */}
              <polyline
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeDasharray="4,4"
                strokeLinecap="round"
                points="360,65 400,52 440,38 480,25"
              />

              {/* Data points */}
              <circle cx="360" cy="65" r="4.5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="480" cy="25" r="4.5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
            <span>15 Okt</span>
            <span>18 Okt</span>
            <span className="text-slate-800 font-bold">22 Okt (Hari Ini)</span>
            <span className="text-rose-600 font-bold">29 Okt (H+7)</span>
          </div>
        </div>
      </div>

      {/* 6. Section Analisis Lanjutan (4 Cards Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
            Analisis Lanjutan & Rekomendasi TPID
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Perbandingan Harga Antar-Pasar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-slate-800 mb-2 flex items-center justify-between">
                <span>Perbandingan Antar-Pasar</span>
                <span className="text-[10px] text-slate-400 font-mono">Satuan</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {MARKET_COMPARISON_DATA.slice(0, 3).map((item) => (
                  <div key={item.commodityName} className="border-b border-slate-100 pb-1.5">
                    <div className="text-[11px] font-semibold text-slate-700">{item.commodityName}</div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>Bekasi: <b className="text-rose-600">Rp {item.prices.bekasi.toLocaleString('id-ID')}</b></span>
                      <span>Garut: <b className="text-emerald-600">Rp {item.prices.garut.toLocaleString('id-ID')}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => onOpenCommandCenter(selectedRegionId)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 pt-2 flex items-center gap-1"
            >
              <span>Lihat Detail Pasar &rarr;</span>
            </button>
          </div>

          {/* Card 2: Ketahanan Pangan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-slate-800 mb-2">
                Ketahanan Pangan Provinsi
              </div>
              <div className="flex items-center gap-3 my-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-mono font-bold text-sm">
                  68%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Terkendali</div>
                  <div className="text-[10px] text-slate-500">dari total 27 Kab/Kota</div>
                </div>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Risiko Tertinggi:</span>
                  <span className="text-rose-600 font-bold">Kab. Bekasi (+8.7%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Daerah Surplus:</span>
                  <span className="text-emerald-600 font-bold">Kab. Garut (-6.2%)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenCommandCenter(selectedRegionId)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 pt-2 flex items-center gap-1"
            >
              <span>Lihat Selengkapnya &rarr;</span>
            </button>
          </div>

          {/* Card 3: Rute Distribusi Pasokan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                <span>Rute Distribusi Cepat</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Kab. Garut (Surplus)</span>
                  <span>8 Ton</span>
                </div>
                <div className="text-center text-slate-400 text-[10px]">&darr; Rute Cipularang</div>
                <div className="flex items-center justify-between text-rose-700 font-bold">
                  <span>Kab. Bekasi (Defisit)</span>
                  <span>8 Ton</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-2">
                Estimasi Waktu Tiba: <strong>4.2 Jam (184 km)</strong>
              </div>
            </div>
            <button
              onClick={onOpenSupplyRoute}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 pt-2 flex items-center gap-1"
            >
              <span>Buka Rute di Peta &rarr;</span>
            </button>
          </div>

          {/* Card 4: Peringatan Dini Satgas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Peringatan Dini Satgas</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Risiko Lonjakan 3 Hari Lagi</span>
                  </div>
                  <div className="text-[10px] text-rose-700 mt-0.5">
                    Proyeksi kenaikan &gt;10% di Bekasi & Subang
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                  <div className="font-bold">Fluktuasi Pasokan Pasar</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">
                    Pasokan cabai dari sentra Jatim menurun
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenCommandCenter(selectedRegionId)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 pt-2 flex items-center gap-1"
            >
              <span>Lihat Semua Peringatan &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
