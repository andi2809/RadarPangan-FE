'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Map,
  Wheat,
  AlertTriangle,
  ShieldCheck,
  Upload,
  RotateCcw,
  Printer,
  Sparkles,
  FileSpreadsheet,
  X,
  Truck,
} from 'lucide-react';
import type { FeatureCollection } from 'geojson';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { GISPageHeader } from '@/components/gis/overview/GISPageHeader';
import { GISStatsSection, type StatItem } from '@/components/gis/overview/GISStatCard';
import { GISMapWorkspace } from '@/components/gis/map/GISMapWorkspace';
import { GISMapCanvas } from '@/components/gis/map/GISMapCanvas';
import { RegionInsightPanel } from '@/components/gis/analysis/RegionInsightPanel';
import { RegionDetailSection } from '@/components/gis/detail/RegionDetailSection';
import { PriceForecastChart } from '@/components/gis/analysis/PriceForecastChart';
import {
  CommodityPriceTable,
  type CommodityPriceRow,
} from '@/components/gis/detail/CommodityPriceTable';
import { AffordabilityIndicator } from '@/components/gis/detail/AffordabilityIndicator';
import {
  loadIndonesiaGeoJson,
  getTelemetry,
  getAllRegions,
  getAllCommodities,
} from '@/utils/geo-loader';
import {
  calculateH7Forecast,
  SEASONAL_MULTIPLIERS,
  type SeasonalScenario,
} from '@/lib/engines/forecasting';
import {
  calculateCommodityUmkBurden,
  AVERAGE_JABAR_UMK_RP,
} from '@/lib/engines/affordability';
import { findOptimalSupplyRoutes } from '@/lib/engines/supply-matcher';
import {
  loadCitizenReports,
  loadCsvOverrides,
  saveCsvOverrides,
  clearCsvOverrides,
  resetCitizenReports,
  CIREBON_60D_DEMO_OVERRIDE,
  type ApprovedCitizenReport,
  type CustomRegionOverride,
} from '@/utils/dual-source-store';
import { UnifiedRegionTelemetry, Commodity, PriceStatus, SupplyStatus } from '@/types/domain';

const numberFormat = new Intl.NumberFormat('id-ID');

export default function DashboardPage() {
  const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
  const allRegions = useMemo(() => getAllRegions(), []);
  const avgJabarUmkRp = useMemo(() => {
    if (!allRegions.length) return AVERAGE_JABAR_UMK_RP;
    return Math.round(
      allRegions.reduce((sum, reg) => sum + reg.umk2026, 0) / allRegions.length
    );
  }, [allRegions]);

  const [commodity, setCommodity] = useState<string>('cabai_rawit_merah');
  const [period, setPeriod] = useState<'today' | 'forecast'>('today');
  const [seasonalScenario, setSeasonalScenario] = useState<SeasonalScenario>('normal');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.16');
  const [viewScope, setViewScope] = useState<'jabar' | 'indonesia'>('jabar');
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);

  // Dual-source citizen reports & CSV overrides state
  const [citizenReports, setCitizenReports] = useState<ApprovedCitizenReport[]>([]);
  const [csvOverrides, setCsvOverrides] = useState<Record<string, CustomRegionOverride>>({});
  const [uploadBanner, setUploadBanner] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('report') === '1') {
      setIsReportModalOpen(true);
    }
  }, []);

  useEffect(() => {
    loadIndonesiaGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error('Failed to load GeoJSON in /dashboard:', err));
  }, []);

  useEffect(() => {
    const syncStore = () => {
      setCitizenReports(loadCitizenReports());
      setCsvOverrides(loadCsvOverrides());
    };
    syncStore();
    window.addEventListener('radar-pangan-storage-update', syncStore);
    window.addEventListener('storage', syncStore);
    return () => {
      window.removeEventListener('radar-pangan-storage-update', syncStore);
      window.removeEventListener('storage', syncStore);
    };
  }, []);

  const rawTelemetry = useMemo(
    () => getTelemetry(commodity) as Record<string, UnifiedRegionTelemetry>,
    [commodity]
  );

  // Recalculate all 27 Jabar regions dynamically with Deterministic Multi-Window Engine + Seasonal/Stock Multipliers + CSV Overrides
  const allTelemetry = useMemo(() => {
    const result: Record<string, UnifiedRegionTelemetry> = {};

    allRegions.forEach((reg) => {
      const baseTelem = rawTelemetry[reg.id];
      if (!baseTelem) return;

      const overrideKey = `${reg.id}:${commodity}`;
      const override = csvOverrides[overrideKey];

      let history = baseTelem.history14d.map((pt) => ({ ...pt }));
      let hargaAcuanRp = baseTelem.currentPrice.hargaAcuanRp;
      let supplyStatus: SupplyStatus = baseTelem.supply.statusNeraca;

      if (override && history.length >= 8) {
        hargaAcuanRp = override.hargaAcuanRp ?? hargaAcuanRp;
        supplyStatus = override.supplyStatus ?? supplyStatus;
        const lastIdx = history.length - 1;
        const idxMinus7 = Math.max(0, lastIdx - 7);
        history = history.map((item, idx) => {
          if (idx === lastIdx) return { ...item, hargaRp: override.pt };
          if (idx === idxMinus7) return { ...item, hargaRp: override.ptMinus7 };
          const ratio = idx / Math.max(1, lastIdx);
          const interp = Math.round(
            (override.ptMinus7 * 0.92 + (override.pt - override.ptMinus7 * 0.92) * ratio) / 100
          ) * 100;
          return { ...item, hargaRp: interp };
        });
      }

      const pt = history[history.length - 1]?.hargaRp ?? baseTelem.currentPrice.hargaAktualRp;
      const currentSelisihRp = pt - hargaAcuanRp;
      const currentSelisihPersen = Number(((currentSelisihRp / hargaAcuanRp) * 100).toFixed(2));

      let currentStatus: PriceStatus = 'aman';
      if (supplyStatus === 'defisit' || currentSelisihPersen > 10) currentStatus = 'kritis';
      else if (currentSelisihPersen > 5) currentStatus = 'waspada';
      else if (currentSelisihPersen < -5) currentStatus = 'turun';

      try {
        const forecastOut = calculateH7Forecast(history, hargaAcuanRp, commodity, {
          seasonalScenario,
          supplyStatus,
          overrideMa30: override?.ma30,
          overrideMean60: override?.mean60,
          overrideStdDev60: override?.stdDev60,
        });

        result[reg.id] = {
          ...baseTelem,
          region: reg,
          history14d: history,
          currentPrice: {
            ...baseTelem.currentPrice,
            hargaAktualRp: pt,
            hargaAcuanRp,
            selisihRp: currentSelisihRp,
            selisihPersen: currentSelisihPersen,
            status: currentStatus,
            movingAvg7d: forecastOut.multiWindow.ma7,
          },
          predictionH7: {
            ...baseTelem.predictionH7,
            ...forecastOut.finalH7,
            regionId: reg.id,
          },
          supply: {
            ...baseTelem.supply,
            statusNeraca: supplyStatus,
            surplusDefisitTon:
              supplyStatus === 'defisit'
                ? -Math.abs(baseTelem.supply.surplusDefisitTon || 1200)
                : baseTelem.supply.surplusDefisitTon,
          },
        };
      } catch {
        result[reg.id] = { ...baseTelem, region: reg };
      }
    });

    return result;
  }, [allRegions, rawTelemetry, commodity, seasonalScenario, csvOverrides]);

  const activeRegionTelemetry = allTelemetry[selectedRegionId];
  const hasData = Boolean(activeRegionTelemetry?.currentPrice);

  const activeRegionName =
    activeRegionTelemetry?.region?.name ||
    (selectedRegionId === '32.16' ? 'Kab. Bekasi' : 'Wilayah Pantauan');

  const currentPriceRp = activeRegionTelemetry?.currentPrice?.hargaAktualRp ?? 0;
  const forecastPriceRp = activeRegionTelemetry?.predictionH7?.hargaPrediksiH7Rp ?? 0;
  const changePercent =
    activeRegionTelemetry?.predictionH7?.selisihPersen ??
    activeRegionTelemetry?.currentPrice?.selisihPersen ??
    0;

  const rawStatus: PriceStatus | undefined =
    period === 'today'
      ? activeRegionTelemetry?.currentPrice?.status
      : activeRegionTelemetry?.predictionH7?.status;

  const activeStatus: 'terkendali' | 'waspada' | 'kritis' | 'tanpa_data' =
    !hasData || rawStatus === 'tidak_ada_data'
      ? 'tanpa_data'
      : rawStatus === 'kritis'
      ? 'kritis'
      : rawStatus === 'waspada'
      ? 'waspada'
      : 'terkendali';

  const riskStatusLabel: 'KRITIS' | 'WASPADA' | 'TERKENDALI' =
    activeStatus === 'kritis'
      ? 'KRITIS'
      : activeStatus === 'waspada'
      ? 'WASPADA'
      : 'TERKENDALI';

  const selectedCommodityObj = useMemo(
    () => commodities.find((c) => c.id === commodity) || commodities[1] || commodities[0],
    [commodities, commodity]
  );

  // Forecast & Multi-Window Analysis for Active Region
  const activeForecastBundle = useMemo(() => {
    if (!activeRegionTelemetry) return null;
    const override = csvOverrides[`${selectedRegionId}:${commodity}`];
    try {
      return calculateH7Forecast(
        activeRegionTelemetry.history14d,
        activeRegionTelemetry.currentPrice.hargaAcuanRp,
        commodity,
        {
          seasonalScenario,
          supplyStatus: activeRegionTelemetry.supply.statusNeraca,
          overrideMa30: override?.ma30,
          overrideMean60: override?.mean60,
          overrideStdDev60: override?.stdDev60,
        }
      );
    } catch {
      return null;
    }
  }, [activeRegionTelemetry, selectedRegionId, commodity, seasonalScenario, csvOverrides]);

  // UMK Burden & Purchasing Power Pressure Score (TECHNICAL_PROJECT_CONTEXT §4.C)
  const activeCommodityUmkBurden = useMemo(() => {
    if (!activeRegionTelemetry || !activeForecastBundle) return null;
    return calculateCommodityUmkBurden(
      activeRegionTelemetry.region.umk2026,
      activeForecastBundle.multiWindow.calibratedH7Rp,
      activeForecastBundle.multiWindow.kenaikanH7Pct,
      commodity,
      avgJabarUmkRp
    );
  }, [activeRegionTelemetry, activeForecastBundle, commodity, avgJabarUmkRp]);

  // Dual-Source Citizen Reports for Active Region.
  // Semua laporan yang sudah di-ACC pada hari/wilayah/komoditas yang sama
  // digabung dan ditampilkan sebagai nilai tengah (median) terbaru.
  const activeCitizenReports = useMemo(
    () =>
      citizenReports.filter(
        (r) => r.regionId === selectedRegionId && r.commodityId === commodity
      ),
    [citizenReports, selectedRegionId, commodity]
  );

  const activeCitizenReport = useMemo<ApprovedCitizenReport | null>(() => {
    const approved = activeCitizenReports.filter((r) => r.statusApproval === 'approved');
    if (approved.length > 0) {
      const sortedPrices = approved.map((r) => r.hargaWargaRp).sort((a, b) => a - b);
      const mid = Math.floor(sortedPrices.length / 2);
      const median =
        sortedPrices.length % 2 !== 0
          ? sortedPrices[mid]
          : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
      const latest = [...approved].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
      return {
        ...latest,
        id: approved.length > 1 ? `MERGED-${latest.regionId}-${latest.commodityId}` : latest.id,
        hargaWargaRp: Math.round(median),
        jumlahLaporan: approved.reduce((sum, r) => sum + r.jumlahLaporan, 0),
      };
    }
    return (
      activeCitizenReports.find((r) => r.statusApproval === 'pending') ||
      activeCitizenReports[0] ||
      null
    );
  }, [activeCitizenReports]);

  // Supply Matchmaker Routes for Active Region (drawn on GIS Map!)
  const activeSupplyRoutes = useMemo(() => {
    if (!activeRegionTelemetry) return [];
    const isNeedSupply =
      activeStatus === 'kritis' ||
      activeStatus === 'waspada' ||
      activeRegionTelemetry.supply.statusNeraca === 'defisit';
    if (!isNeedSupply) return [];
    const defisitTon = Math.max(
      120,
      Math.abs(activeRegionTelemetry.supply.surplusDefisitTon || 250)
    );
    return findOptimalSupplyRoutes(
      activeRegionTelemetry.region,
      defisitTon,
      allRegions,
      allTelemetry,
      commodity
    );
  }, [activeRegionTelemetry, activeStatus, allRegions, allTelemetry, commodity]);

  const stats = useMemo<StatItem[]>(() => {
    const telemetryList = Object.values(allTelemetry);
    const statusOf = (telem: UnifiedRegionTelemetry) =>
      period === 'today' ? telem.currentPrice.status : telem.predictionH7.status;

    const highRisk = telemetryList.filter((telem) => statusOf(telem) === 'kritis').length;
    const surplus = telemetryList.filter(
      (telem) => telem.supply.statusNeraca === 'surplus' || statusOf(telem) === 'turun'
    ).length;

    return [
      {
        label: 'Cakupan Wilayah MVP',
        value: String(allRegions.length),
        description: 'Kab/Kota Jawa Barat',
        icon: Map,
      },
      {
        label: 'Komoditas Strategis',
        value: '5 Inti',
        description: `${commodities.length} varian terpantau`,
        icon: Wheat,
      },
      {
        label: 'Wilayah Kritis',
        value: String(highRisk),
        description:
          period === 'today'
            ? 'Status kritis hari ini'
            : `Proyeksi H+7 (${SEASONAL_MULTIPLIERS[seasonalScenario].shortLabel})`,
        icon: AlertTriangle,
        tone: 'warning',
      },
      {
        label: 'Sentra Surplus',
        value: String(surplus),
        description: 'Siap memasok daerah defisit',
        icon: ShieldCheck,
        tone: 'success',
      },
    ];
  }, [allRegions.length, allTelemetry, commodities.length, period, seasonalScenario]);

  const commodityRows = useMemo<CommodityPriceRow[]>(
    () =>
      commodities.map((item) => {
        const telemetryMap = getTelemetry(item.id) as Record<string, UnifiedRegionTelemetry>;
        const telem =
          item.id === commodity
            ? allTelemetry[selectedRegionId]
            : telemetryMap[selectedRegionId];
        return {
          name: item.name,
          unit: item.satuan,
          currentPriceRp: telem?.currentPrice?.hargaAktualRp ?? null,
          forecastPriceRp: telem?.predictionH7?.hargaPrediksiH7Rp ?? null,
          changePct: telem?.predictionH7?.selisihPersen ?? null,
          status: telem?.currentPrice?.status ?? 'tidak_ada_data',
        };
      }),
    [commodities, commodity, allTelemetry, selectedRegionId]
  );

  // Critical Regions List for TPID Policy Report Modal
  const criticalRegionsSummary = useMemo(() => {
    return Object.values(allTelemetry)
      .filter((t) => t.predictionH7.status === 'kritis' || t.currentPrice.status === 'kritis')
      .sort((a, b) => b.predictionH7.selisihPersen - a.predictionH7.selisihPersen);
  }, [allTelemetry]);

  const affordability = activeRegionTelemetry?.affordability;

  const handleSelectRegion = useCallback((regionId: string) => {
    setSelectedRegionId(regionId);
  }, []);

  // Load 60-Day Concrete Case Study (Kab. Cirebon - Cabai Rawit Merah)
  const handleLoadCirebonCaseStudy = () => {
    const nextOverrides = {
      ...csvOverrides,
      '32.09:cabai_rawit_merah': CIREBON_60D_DEMO_OVERRIDE,
    };
    setCsvOverrides(nextOverrides);
    saveCsvOverrides(nextOverrides);
    setCommodity('cabai_rawit_merah');
    setSelectedRegionId('32.09');
    setSeasonalScenario('lebaran');
    setPeriod('forecast');
    setUploadBanner(
      'Kasus Uji 60 Hari Kab. Cirebon dimuat: P_60=Rp78.000, P_53=Rp68.000, MA_30=Rp65.000, μ_60=Rp58.000, σ_60=Rp7.500, H-7 Lebaran (1,15x) & Defisit (1,10x) → Proyeksi H+7 = Rp113.200/kg.'
    );
  };

  // Parse Uploaded CSV File
  const handleCsvFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '').trim();
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return;

      const nextOverrides: Record<string, CustomRegionOverride> = { ...csvOverrides };
      let importedCount = 0;
      let firstRegionId: string | null = null;
      let firstCommodityId: string | null = null;

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        if (cols.length < 4) continue;
        const [regId, commId, ptStr, pt7Str, ma30Str, mean60Str, std60Str, stokStr, hapStr] = cols;
        const ptVal = Number(ptStr);
        const pt7Val = Number(pt7Str);
        if (!regId || !commId || Number.isNaN(ptVal) || Number.isNaN(pt7Val)) continue;

        const key = `${regId}:${commId}`;
        nextOverrides[key] = {
          regionId: regId,
          commodityId: commId,
          pt: ptVal,
          ptMinus7: pt7Val,
          ma30: ma30Str ? Number(ma30Str) : undefined,
          mean60: mean60Str ? Number(mean60Str) : undefined,
          stdDev60: std60Str ? Number(std60Str) : undefined,
          supplyStatus:
            stokStr === 'defisit' || stokStr === 'surplus' || stokStr === 'seimbang'
              ? stokStr
              : 'defisit',
          hargaAcuanRp: hapStr ? Number(hapStr) : undefined,
          labelDataset: file.name,
        };
        importedCount++;
        if (!firstRegionId) {
          firstRegionId = regId;
          firstCommodityId = commId;
        }
      }

      if (importedCount > 0) {
        setCsvOverrides(nextOverrides);
        saveCsvOverrides(nextOverrides);
        if (firstRegionId) setSelectedRegionId(firstRegionId);
        if (firstCommodityId) setCommodity(firstCommodityId);
        setPeriod('forecast');
        setUploadBanner(
          `Berhasil mengunggah ${importedCount} baris data uji dari "${file.name}". Rumus deterministik H+7 telah dihitung ulang.`
        );
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleResetDefaultData = () => {
    clearCsvOverrides();
    resetCitizenReports();
    setCsvOverrides({});
    setSeasonalScenario('normal');
    setPeriod('today');
    setSelectedRegionId('32.16');
    setUploadBanner(null);
  };

  return (
    <GISLayout>
      {/* Header Judul Halaman */}
      <GISPageHeader />

      {/* BLOK 5: PANEL UTILITAS ADMIN & TESTING (Upload CSV, Reset Data, Toggle Musiman, Cetak Laporan TPID) */}
      <section className="rounded-xl border border-[#DED8CD] bg-[#FFFDF7] p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#67151D]">
              Blok 5 · Panel Utilitas Admin &amp; Pengujian Rumus Deterministik
            </span>
            <h2 className="mt-0.5 text-sm font-extrabold text-[#24231F]">
              Simulasi Musiman (M_musim), Upload Dataset CSV Uji &amp; Cetak Rekomendasi TPID
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Toggle Skenario Musiman (M_musim) */}
            <div className="flex items-center rounded-lg border border-[#DED8CD] bg-[#F8F4E9] p-1 text-xs">
              {(Object.keys(SEASONAL_MULTIPLIERS) as SeasonalScenario[]).map((key) => {
                const item = SEASONAL_MULTIPLIERS[key];
                const isActive = seasonalScenario === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSeasonalScenario(key);
                      if (key !== 'normal') setPeriod('forecast');
                    }}
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition ${
                      isActive
                        ? 'bg-[#67151D] text-white shadow-sm'
                        : 'text-[#625E56] hover:bg-[#F0EBDE]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* 2. Tombol Uji Kasus 60H Cirebon & Upload CSV */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleLoadCirebonCaseStudy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#67151D]/30 bg-[#F4E8E9] px-3 py-2 text-xs font-bold text-[#67151D] transition hover:bg-[#EBD5D7]"
              title="Muat skenario perhitungan konkret 60 hari data Kab. Cirebon sesuai dokumen teknis"
            >
              <Sparkles size={14} />
              <span>Uji Kasus 60H Cirebon</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DED8CD] bg-white px-3 py-2 text-xs font-bold text-[#24231F] transition hover:bg-[#F0EBDE]"
            >
              <Upload size={14} className="text-[#67151D]" />
              <span>Upload CSV</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaultData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DED8CD] bg-white px-3 py-2 text-xs font-bold text-[#706B62] transition hover:border-[#67151D] hover:text-[#67151D]"
            >
              <RotateCcw size={13} />
              <span>Reset Data</span>
            </button>

            {/* 3. Tombol Cetak / Lihat Template Laporan TPID */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#67151D] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#4C0D15]"
            >
              <Printer size={14} />
              <span>Cetak Template Laporan TPID</span>
            </button>
          </div>
        </div>

        {uploadBanner && (
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-[#287653]/30 bg-[#E3F0E7] px-3 py-2 text-xs text-[#1B5B3F]">
            <div className="flex items-center gap-2 font-medium">
              <FileSpreadsheet size={15} className="shrink-0 text-[#287653]" />
              <span>{uploadBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadBanner(null)}
              className="text-xs font-bold text-[#1B5B3F] hover:underline"
            >
              Tutup
            </button>
          </div>
        )}
      </section>

      {/* Ringkasan Statistik 4 KPI Teratas */}
      <GISStatsSection stats={stats} />

      {/* BLOK 1 (Peta GIS + Rute Distribusi) & BLOK 2 (Kartu Komparasi Harga & Dual-Source) */}
      <GISMapWorkspace
        commodity={commodity}
        setCommodity={setCommodity}
        period={period}
        setPeriod={setPeriod}
        selectedRegionId={selectedRegionId}
        onSelectRegion={handleSelectRegion}
        viewScope={viewScope}
        onSelectViewScope={setViewScope}
        showGisLink={false}
        activeRegionName={activeRegionName}
        activeStatus={activeStatus}
        currentPriceRp={currentPriceRp}
        forecastPriceRp={forecastPriceRp}
        umkBurdenPercent={
          activeCommodityUmkBurden?.rasioBebanUmkPct ??
          affordability?.umkRatioBasketPercent ??
          0
        }
        map={
          <GISMapCanvas
            geoJson={geoJson}
            allTelemetry={allTelemetry}
            activeHorizon={period === 'today' ? 'aktual' : 'h7'}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
            activeSupplyRoutes={activeSupplyRoutes}
            viewScope={viewScope}
            onViewScopeChange={setViewScope}
            mode="preview"
          />
        }
        insight={
          <RegionInsightPanel
            region={activeRegionName}
            commodity={selectedCommodityObj?.name || 'Cabai Rawit Merah'}
            unit={selectedCommodityObj?.satuan || 'kg'}
            currentPrice={currentPriceRp}
            hargaAcuanRp={activeRegionTelemetry?.currentPrice?.hargaAcuanRp}
            jenisAcuan={selectedCommodityObj?.jenisAcuan || 'HAP'}
            forecastPrice={forecastPriceRp}
            changePercent={changePercent}
            risk={riskStatusLabel}
            hasData={hasData}
            citizenReport={activeCitizenReport}
            multiWindow={activeForecastBundle?.multiWindow ?? null}
            supplyRoutes={activeSupplyRoutes}
          />
        }
      />

      {/* BLOK 4 (Grafik Tren Multi-Window) & BLOK 3 (Kartu Daya Beli & Keterjangkauan UMK) */}
      <RegionDetailSection
        title={`Analisis Multi-Window, Tren H+7 & Daya Beli UMK — ${activeRegionName}`}
        description="Evaluasi terpadu riwayat harga 14–30 hari, batas anomali 60 hari (μ+2σ), proyeksi H+7 terkalibrasi musiman & stok, serta rasio beban terhadap UMK lokal."
      >
        <PriceForecastChart
          history={activeRegionTelemetry?.history14d ?? []}
          forecast={activeForecastBundle?.points ?? []}
          hargaAcuanRp={activeRegionTelemetry?.currentPrice?.hargaAcuanRp}
          unit={selectedCommodityObj?.satuan === 'liter' ? 'Rp/liter' : 'Rp/kg'}
          multiWindow={activeForecastBundle?.multiWindow ?? null}
        />
        <CommodityPriceTable items={commodityRows} />
        <AffordabilityIndicator
          regionName={activeRegionName}
          commodityName={selectedCommodityObj?.name || 'Komoditas'}
          unit={selectedCommodityObj?.satuan || 'kg'}
          population={
            activeRegionTelemetry?.region?.populasi
              ? `${numberFormat.format(activeRegionTelemetry.region.populasi)} jiwa`
              : '—'
          }
          umkRp={activeRegionTelemetry?.region?.umk2026 ?? 0}
          umkRatioBasketPercent={affordability?.umkRatioBasketPercent ?? 0}
          povertyBasketRatioPercent={affordability?.povertyBasketRatioPercent ?? 0}
          kategoriDayaBeli={affordability?.kategoriDayaBeli ?? 'TIDAK_ADA_DATA'}
          commodityBurden={activeCommodityUmkBurden}
          hasData={hasData}
        />
      </RegionDetailSection>

      {/* MODAL TEMPLATE LAPORAN KEBIJAKAN TPID (Print-Ready PDF) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="print-report relative w-full max-w-3xl rounded-xl border border-[#DED8CD] bg-[#FFFDF7] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#DED8CD] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#67151D]">
                  Dokumen Pendukung Keputusan (Decision Support System)
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-[#24231F]">
                  Nota Dinas &amp; Rekomendasi Intervensi Stabilisasi Harga Pangan TPID
                </h3>
                <p className="text-xs text-[#706B62]">
                  Provinsi Jawa Barat · Komoditas: {selectedCommodityObj?.name} · Skenario:{" "}
                  {SEASONAL_MULTIPLIERS[seasonalScenario].label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="no-print rounded-lg border border-[#DED8CD] p-1.5 text-[#706B62] hover:bg-[#F0EBDE]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-[#24231F]">
              {/* Ringkasan Wilayah Terpilih */}
              <div className="rounded-lg border border-[#DED8CD] bg-white p-4">
                <h4 className="font-bold uppercase tracking-wider text-[#67151D]">
                  1. Fokus Evaluasi Wilayah: {activeRegionName}
                </h4>
                <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono">
                  <div>
                    <span className="block font-sans text-[10px] text-[#706B62]">Harga Resmi (P_t)</span>
                    <strong className="text-sm">Rp{numberFormat.format(currentPriceRp)}</strong>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] text-[#706B62]">Proyeksi H+7 (P̂_t+7)</span>
                    <strong className="text-sm text-[#B52D26]">
                      Rp{numberFormat.format(forecastPriceRp)}
                    </strong>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] text-[#706B62]">UMK Daerah</span>
                    <strong className="text-sm">
                      Rp{numberFormat.format(activeRegionTelemetry?.region?.umk2026 ?? 0)}
                    </strong>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] text-[#706B62]">Rasio Beban UMK</span>
                    <strong className="text-sm text-[#67151D]">
                      {activeCommodityUmkBurden
                        ? `${activeCommodityUmkBurden.rasioBebanUmkPct}% (${activeCommodityUmkBurden.statusKeterjangkauan})`
                        : '—'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Tabel Wilayah Prioritas Intervensi */}
              <div className="rounded-lg border border-[#DED8CD] bg-white p-4">
                <h4 className="font-bold uppercase tracking-wider text-[#67151D]">
                  2. Daftar Wilayah Prioritas Intervensi H+7 ({criticalRegionsSummary.length} Kab/Kota Kritis)
                </h4>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-[#DED8CD] text-[10px] text-[#706B62]">
                        <th className="py-1.5">Wilayah</th>
                        <th className="py-1.5">Harga Saat Ini</th>
                        <th className="py-1.5">Proyeksi H+7</th>
                        <th className="py-1.5">Deviasi HAP/HET</th>
                        <th className="py-1.5">UMK Wilayah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0ECE4] font-mono">
                      {criticalRegionsSummary.slice(0, 6).map((item) => (
                        <tr key={item.region.id}>
                          <td className="py-1.5 font-sans font-bold">{item.region.name}</td>
                          <td className="py-1.5">
                            Rp{numberFormat.format(item.currentPrice.hargaAktualRp)}
                          </td>
                          <td className="py-1.5 font-bold text-[#B52D26]">
                            Rp{numberFormat.format(item.predictionH7.hargaPrediksiH7Rp)}
                          </td>
                          <td className="py-1.5 text-[#B52D26]">
                            +{item.predictionH7.selisihPersen}%
                          </td>
                          <td className="py-1.5">
                            Rp{numberFormat.format(item.region.umk2026)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instruksi Rute Pengiriman Pasokan */}
              <div className="rounded-lg border border-[#287653]/30 bg-[#EAF2EA] p-4">
                <h4 className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#287653]">
                  <Truck size={14} />
                  3. Rekomendasi Kerjasama Antar Daerah (KAD) &amp; Rute Pasokan
                </h4>
                {activeSupplyRoutes.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {activeSupplyRoutes.map((route, i) => (
                      <li key={route.id} className="font-medium">
                        {i + 1}. Kirim pasokan dari <strong>{route.sourceRegionName}</strong> (Surplus{" "}
                        {route.surplusAvailableTon} ton) menuju <strong>{route.targetRegionName}</strong>{" "}
                        — Jarak {route.jarakKm} km (~{route.estimasiWaktuJam} jam), estimasi biaya logistik Rp
                        {numberFormat.format(route.biayaTransportEstRp)}.
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-xs text-[#4D6655]">
                    Pilih wilayah berstatus Waspada/Kritis pada peta untuk menampilkan koridor pengiriman pasokan otomatis.
                  </p>
                )}
              </div>
            </div>

            <div className="no-print mt-5 flex items-center justify-end gap-2.5 border-t border-[#DED8CD] pt-4">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="rounded-lg border border-[#DED8CD] bg-white px-4 py-2 text-xs font-bold text-[#706B62] hover:bg-[#F0EBDE]"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#67151D] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4C0D15]"
              >
                <Printer size={14} />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </GISLayout>
  );
}
