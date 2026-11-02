export type PriceStatus = 'aman' | 'waspada' | 'kritis' | 'turun' | 'tidak_ada_data';
export type ActiveScreen = 'overview' | 'command-center';
export type ActiveNavTab = 'gis' | 'analytics' | 'crowdsource' | 'settings';

export interface TopRiskRegionItem {
  rank: number;
  regionId: string;
  name: string;
  burdenUmkPercent: number;
  status: PriceStatus;
  statusLabel: string;
  deviationPct: number;
  currentPriceRp: number;
  forecastPriceRp: number;
}

export interface OtherCommoditySparkline {
  id: string;
  name: string;
  changePct: number;
  isIncrease: boolean;
  sparklinePoints: number[];
  currentPriceRp: number;
  unit: string;
}

export interface MarketComparisonItem {
  commodityName: string;
  unit: string;
  prices: {
    bekasi: number;
    subang: number;
    garut: number;
  };
}

export interface CrisisScenario {
  id: string;
  name: string;
  description: string;
  defaultSubsidyPercent: number;
  defaultGpmTonnage: number;
  projectedImpactPct: number;
}

export interface KpiMetrics {
  totalWilayah: number;
  komoditasDipantau: number;
  wilayahRisikoTinggi: number;
  wilayahSurplus: number;
  stabilitasNasionalPct: number;
}
export type AcuanType = 'HET' | 'HAP' | 'DINAMIS_MEDIAN_90H';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
export type SupplyStatus = 'surplus' | 'seimbang' | 'defisit';
export type DataSource = 'pihps' | 'sp2kp' | 'gabungan';
export type PriceType = 'pasar' | 'acuan';

export type CommodityId =
  | 'beras_medium'
  | 'beras_sphp'
  | 'cabai_rawit_merah'
  | 'bawang_merah'
  | 'telur_ayam_ras'
  | 'minyakita'
  | 'minyak_goreng_curah'
  | (string & {});

export interface Region {
  id: string;
  codeBps: string;
  name: string;
  type: 'KABUPATEN' | 'KOTA';
  provinceId: string;
  provinceName: string;
  umk2026: number;
  garisKemiskinan: number;
  populasi: number;
  centroid: {
    lat: number;
    lng: number;
  };
}

export interface Commodity {
  id: CommodityId;
  name: string;
  category: string;
  satuan: 'kg' | 'liter';
  jenisAcuan: AcuanType;
  hargaAcuanRp: number;
  deskripsi: string;
  sumberDefault?: DataSource;
  jenisHarga?: PriceType;
  subKomoditas?: 'medium' | 'sphp' | 'curah' | 'standar';
}

export interface PriceRecord {
  regionId: string;
  commodityId: string;
  date: string;
  hargaAktualRp: number;
  hargaAcuanRp: number;
  selisihRp: number;
  selisihPersen: number;
  status: PriceStatus;
  movingAvg7d: number;
  sumber?: DataSource;
  jenisHarga?: PriceType;
}

export interface EwsPrediction {
  regionId: string;
  commodityId: string;
  targetDate: string;
  horizonDay: number;
  hargaPrediksiH7Rp: number;
  selisihPersen: number;
  status: PriceStatus;
  ewsScore: number;
  riskLevel: RiskLevel;
  confidenceLowerRp: number;
  confidenceUpperRp: number;
  drivers: {
    deviasiHapScore: number;
    trendLajuScore: number;
    dayaBeliUmkScore: number;
  };
}

export interface SupplyBalance {
  regionId: string;
  commodityId: string;
  date: string;
  statusNeraca: SupplyStatus;
  stokTon: number;
  kebutuhanTon: number;
  surplusDefisitTon: number;
  hariKetahananStok: number;
}

export interface SupplyRoute {
  id: string;
  sourceRegionId: string;
  sourceRegionName: string;
  targetRegionId: string;
  targetRegionName: string;
  commodityId: string;
  surplusAvailableTon: number;
  defisitNeededTon: number;
  jarakKm: number;
  estimasiWaktuJam: number;
  modeTransport: 'DARAT';
  biayaTransportEstRp: number;
  coordinates: [number, number][];
}

export interface CitizenReport {
  id: string;
  regionId: string;
  regionName: string;
  commodityId: string;
  hargaRp: number;
  lat: number;
  lng: number;
  namaPasar: string;
  clusterId: string;
  isOutlier: boolean;
  statusVerifikasi: 'verified' | 'suspect' | 'pending';
  laporanKe: number;
  createdAt: string;
}

export interface WhatIfParameters {
  transportSubsidyPercent: number;
  marketOperationTonnage: number;
  distributionIntervention: boolean;
}

export interface UnifiedRegionTelemetry {
  region: Region;
  currentPrice: PriceRecord;
  history14d: { date: string; hargaRp: number }[];
  predictionH7: EwsPrediction;
  supply: SupplyBalance;
  sumber?: DataSource;
  jenisHarga?: PriceType;
  affordability: {
    umkRatioBasketPercent: number;
    povertyBasketRatioPercent: number;
    riskIndex: number;
    kategoriDayaBeli: 'TERJANGKAU' | 'RENTAN' | 'DARURAT';
    uraianBeban?: string;
  };
}
