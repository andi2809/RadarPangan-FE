'use client';

import React, { useState, useMemo } from 'react';
import { UnifiedRegionTelemetry, Commodity } from '../../../types/domain';
import { getMarketConsensusForRegion } from '../../../data/mock/marketConsensus';
import { CitizenReportPriceDistribution } from '../../gis/citizen-distribution/CitizenReportPriceDistribution';
import { X, CheckCircle2 } from 'lucide-react';

interface RightAnalysisDrawerProps {
  telemetry: UnifiedRegionTelemetry | null;
  selectedCommodity: Commodity;
  activeHorizon: 'aktual' | 'h7';
  onClose: () => void;
  isOpen?: boolean;
}

export const RightAnalysisDrawer: React.FC<RightAnalysisDrawerProps> = ({
  telemetry,
  selectedCommodity,
  activeHorizon,
  onClose,
  isOpen = true,
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'riwayat'>('ringkasan');
  const [historyPeriod, setHistoryPeriod] = useState<14 | 30 | 60>(14);

  const consensus = useMemo(() => {
    if (!telemetry) return undefined;
    return getMarketConsensusForRegion(telemetry.region.id, telemetry.region.name);
  }, [telemetry]);

  const bapanasPriceProp = useMemo(() => {
    if (!telemetry?.currentPrice) return null;
    return {
      price: telemetry.currentPrice.hargaAktualRp,
      dateLabel: '24 Okt 2026',
      isToday: true,
    };
  }, [telemetry?.currentPrice?.hargaAktualRp]);

  const history14d = telemetry?.history14d;
  const historySeries = useMemo(() => {
    if (!history14d || history14d.length === 0) return [];
    if (historyPeriod === 14) return history14d;

    const baseData = [...history14d];
    const firstPoint = baseData[0];
    const needed = historyPeriod - baseData.length;
    const extended: { date: string; hargaRp: number }[] = [];

    const startDate = new Date(firstPoint.date);
    for (let i = needed; i >= 1; i--) {
      const d = new Date(startDate);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const variation = Math.round(Math.sin(i * 0.4) * 450);
      extended.push({
        date: iso,
        hargaRp: Math.max(10000, firstPoint.hargaRp - variation),
      });
    }

    return [...extended, ...baseData];
  }, [history14d, historyPeriod]);

  if (!isOpen || !telemetry) return null;

  const { region, currentPrice, predictionH7 } = telemetry;
  const isH7 = activeHorizon === 'h7';
  const displayPrice = isH7 ? predictionH7.hargaPrediksiH7Rp : currentPrice.hargaAktualRp;
  const acuanRp = selectedCommodity.hargaAcuanRp || currentPrice.hargaAcuanRp || 45000;
  const acuanType = selectedCommodity.jenisAcuan || 'HAP';

  const deviasiNominalRp = displayPrice - acuanRp;
  const deviasiPct = Number(((deviasiNominalRp / acuanRp) * 100).toFixed(2));

  // Kategori EWS
  let statusKondisi = 'Normal';
  let badgeColor = 'bg-[#729B82]/15 text-[#39634B] border-[#729B82]/30';
  if (deviasiPct > 10 || currentPrice.status === 'kritis') {
    statusKondisi = 'Tekanan Tinggi';
    badgeColor = 'bg-[#B85C52]/15 text-[#8A372E] border-[#B85C52]/30';
  } else if (deviasiPct > 5 || currentPrice.status === 'waspada') {
    statusKondisi = 'Perlu Perhatian';
    badgeColor = 'bg-[#FEF08A] text-[#854D0E] border-[#FDE047]';
  }

  // Calculations for History Chart SVG
  const chartMin = Math.min(...historySeries.map((d) => d.hargaRp), acuanRp, predictionH7.confidenceLowerRp);
  const chartMax = Math.max(...historySeries.map((d) => d.hargaRp), acuanRp, predictionH7.confidenceUpperRp);
  const chartRange = Math.max(1, chartMax - chartMin);
  const chartW = 300;
  const chartH = 130;
  const padT = 15;
  const padB = 22;
  const padL = 36;
  const padR = 15;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const getY = (val: number) => padT + innerH - ((val - chartMin) / chartRange) * innerH;

  const pointsString = historySeries
    .map((d, idx) => {
      const x = padL + (idx / Math.max(1, historySeries.length - 1)) * (innerW - 20);
      const y = getY(d.hargaRp);
      return `${x},${y}`;
    })
    .join(' ');

  const lastHistoryX = padL + innerW - 20;
  const lastHistoryY = getY(historySeries[historySeries.length - 1]?.hargaRp || displayPrice);
  const forecastX = padL + innerW;
  const forecastY = getY(predictionH7.hargaPrediksiH7Rp);

  return (
    <aside className="absolute top-20 right-4 bottom-4 z-30 w-[368px] max-w-[calc(100vw-32px)] flex flex-col gap-3 overflow-y-auto no-scrollbar pointer-events-auto select-none text-[#292824]">
      {/* ================= CARD 1: DETAIL & ANALISIS WILAYAH ================= */}
      <div className="bg-white/95 border border-[#E5E2DA] rounded-2xl shadow-xl backdrop-blur-sm flex flex-col shrink-0 overflow-hidden">
        {/* Header Wilayah */}
        <div className="p-3 border-b border-[#E5E2DA] flex items-start justify-between gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-[#292824] tracking-tight">{region.name}</h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}
              >
                {statusKondisi}
              </span>
            </div>
            <p className="text-[11px] text-[#77746C] mt-0.5">
              Provinsi Jawa Barat &bull; UMK Rp {region.umk2026.toLocaleString('id-ID')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#77746C] hover:text-[#292824] hover:bg-[#F5F3ED] transition-colors"
            title="Tutup Panel Detail"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigasi: Ringkasan & Riwayat Harga */}
        <div className="grid grid-cols-2 border-b border-[#E5E2DA] text-[11px] font-medium text-[#77746C] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className={`py-2 text-center transition-colors border-b-2 ${
              activeTab === 'ringkasan'
                ? 'border-[#791D2A] text-[#791D2A] font-bold'
                : 'border-transparent hover:text-[#292824]'
            }`}
          >
            Ringkasan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className={`py-2 text-center transition-colors border-b-2 ${
              activeTab === 'riwayat'
                ? 'border-[#791D2A] text-[#791D2A] font-bold'
                : 'border-transparent hover:text-[#292824]'
            }`}
          >
            Riwayat Harga
          </button>
        </div>

        {/* Konten Tab */}
        <div className="p-3 space-y-2.5 font-sans text-xs">
          {/* TAB 1: RINGKASAN */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-2.5">
              {/* Box 1 & 2: Harga Bapanas & Estimasi H+7 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#F5F3ED] border border-[#E5E2DA]">
                  <div className="text-[10px] text-[#77746C] mb-0.5">Harga Bapanas</div>
                  <div className="text-sm font-bold font-mono text-[#292824]">
                    Rp {currentPrice.hargaAktualRp.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-[#77746C]">/{selectedCommodity.satuan || 'kg'}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F5F3ED] border border-[#E5E2DA]">
                  <div className="text-[10px] text-[#77746C] mb-0.5">Estimasi H+7</div>
                  <div className="text-sm font-bold font-mono text-[#791D2A]">
                    Rp {predictionH7.hargaPrediksiH7Rp.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] font-mono text-[#791D2A]">
                    ({predictionH7.selisihPersen > 0 ? '+' : ''}{predictionH7.selisihPersen}%)
                  </div>
                </div>
              </div>

              {/* Deviasi terhadap Acuan */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DA]">
                <div className="flex items-center justify-between text-[11px] text-[#77746C] mb-1">
                  <span>Deviasi terhadap Acuan ({acuanType})</span>
                  <span className="font-mono text-[10px]">Rp {acuanRp.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-base font-bold font-mono ${
                      deviasiPct > 10
                        ? 'text-[#B85C52]'
                        : deviasiPct > 5
                        ? 'text-[#B85C52]'
                        : 'text-[#39634B]'
                    }`}
                  >
                    {deviasiPct > 0 ? `+${deviasiPct}%` : `${deviasiPct}%`}
                  </span>
                  <span className="text-[11px] font-mono text-[#77746C]">
                    {deviasiNominalRp >= 0
                      ? `+Rp ${deviasiNominalRp.toLocaleString('id-ID')}`
                      : `-Rp ${Math.abs(deviasiNominalRp).toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>

              {/* Konsensus Harga Warga & Kuorum */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white border border-[#E5E2DA]">
                <div>
                  <div className="text-[10px] text-[#77746C] mb-0.5">Konsensus Warga</div>
                  <div className="text-xs font-bold font-mono text-[#292824]">
                    {consensus?.statusKuorum === 'tercapai' && consensus.hargaWargaRp ? (
                      `Rp ${consensus.hargaWargaRp.toLocaleString('id-ID')}/kg`
                    ) : (
                      <span className="text-[11px] text-[#854D0E] font-medium">
                        Belum Diverifikasi
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[#77746C] mb-0.5">Kuorum 10 Lap.</div>
                  <div className="text-xs font-bold font-mono text-[#292824] flex items-center justify-end gap-1">
                    <span>{consensus?.laporanValid ?? 0} / 10</span>
                    {(consensus?.laporanValid ?? 0) >= 10 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#729B82]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6B45F]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Ketahanan Wilayah */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DA] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#77746C]">
                  <span>Ketahanan Wilayah</span>
                  <span className="font-bold text-xs text-[#292824] font-mono">62%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EAE8E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#729B82] rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RIWAYAT HARGA */}
          {activeTab === 'riwayat' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#77746C]">Rentang:</span>
                <div className="flex bg-[#EAE8E1] p-0.5 rounded-lg border border-[#E5E2DA] text-xs">
                  {([14, 30, 60] as const).map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setHistoryPeriod(days)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                        historyPeriod === days
                          ? 'bg-[#791D2A] text-white font-bold'
                          : 'text-[#77746C] hover:text-[#292824]'
                      }`}
                    >
                      {days}H
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#F5F3ED] border border-[#E5E2DA] rounded-xl p-2">
                <div className="w-full h-28 relative">
                  <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full overflow-visible">
                    <line
                      x1={padL}
                      y1={getY(acuanRp)}
                      x2={chartW - padR}
                      y2={getY(acuanRp)}
                      stroke="#77746C"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                    <polyline
                      fill="none"
                      stroke="#292824"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsString}
                    />
                    <line
                      x1={lastHistoryX}
                      y1={lastHistoryY}
                      x2={forecastX}
                      y2={forecastY}
                      stroke="#791D2A"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                      strokeLinecap="round"
                    />
                    <circle cx={lastHistoryX} cy={lastHistoryY} r="3" fill="#292824" />
                    <circle cx={forecastX} cy={forecastY} r="3.5" fill="#791D2A" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#77746C] font-mono border-t border-[#E5E2DA] pt-1.5 mt-1">
                  <span>- Observasi</span>
                  <span className="text-[#791D2A]">--- H+7</span>
                  <span>-- Acuan</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CARD 2: DISTRIBUSI HARGA LAPORAN WARGA ================= */}
      <div className="bg-white/95 border border-[#E5E2DA] rounded-2xl shadow-xl backdrop-blur-sm p-3.5 shrink-0 pointer-events-auto">
        <CitizenReportPriceDistribution
          regionId={region.id}
          regionName={region.name}
          regionCentroid={region.centroid || null}
          commodity={selectedCommodity}
          embedded={true}
          height={85}
          bapanasPrice={bapanasPriceProp}
        />
      </div>
    </aside>
  );
};
