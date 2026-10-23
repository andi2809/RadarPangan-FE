export type PriceStatus = 'aman' | 'waspada' | 'kritis' | 'turun' | 'tidak_ada_data';
export type AcuanType = 'HET' | 'HAP' | 'DINAMIS_MEDIAN_90H';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
export type SupplyStatus = 'surplus' | 'seimbang' | 'defisit';

export interface Region {
  id: string; // Kode Kemendagri e.g. "32.01", "32.73"
  codeBps: string; // "3201", "3273"
  name: string; // "Kab. Bandung", "Kota Bandung"
  type: 'KABUPATEN' | 'KOTA';
  provinceId: string; // "32"
  provinceName: string; // "Jawa Barat"
  umk2026: number; // UMK Rp (e.g. 5,136,638)
  garisKemiskinan: number; // Rp per kapita
  populasi: number;
  centroid: {
    lat: number;
    lng: number;
  };
}

export interface Commodity {
  id: 'beras_medium' | 'cabai_rawit_merah' | 'bawang_merah' | 'telur_ayam_ras' | 'minyakita';
  name: string;
  category: string;
  satuan: 'kg' | 'liter';
  jenisAcuan: AcuanType;
  hargaAcuanRp: number;
  deskripsi: string;
}

export interface PriceRecord {
  regionId: string;
  commodityId: string;
  date: string; // YYYY-MM-DD
  hargaAktualRp: number;
  hargaAcuanRp: number;
  selisihRp: number;
  selisihPersen: number;
  status: PriceStatus;
  movingAvg7d: number;
}

export interface EwsPrediction {
  regionId: string;
  commodityId: string;
  targetDate: string; // YYYY-MM-DD H+7
  horizonDay: number; // 7
  hargaPrediksiH7Rp: number;
  selisihPersen: number;
  status: PriceStatus;
  ewsScore: number; // 0 - 100
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
  coordinates: [number, number][]; // [lng, lat] format for MapLibre/GeoJSON
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

export interface MbgSourcingRecommendation {
  id: string;
  sppgId: string;
  sppgName: string;
  targetRegionId: string;
  targetRegionName: string;
  commodityId: string;
  kebutuhanTonPerBulan: number;
  recommendedSourceRegionId: string;
  recommendedSourceRegionName: string;
  potensiHematPersen: number;
  statusSourcing: 'OPTIMAL' | 'MODERATE' | 'CRITICAL';
}

export interface WhatIfParameters {
  transportSubsidyPercent: number; // 0 - 50%
  marketOperationTonnage: number; // 0 - 500 Ton
  distributionIntervention: boolean;
}

export interface UnifiedRegionTelemetry {
  region: Region;
  currentPrice: PriceRecord;
  history14d: { date: string; hargaRp: number }[];
  predictionH7: EwsPrediction;
  supply: SupplyBalance;
  affordability: {
    umkRatioBasketPercent: number; // % of UMK needed for monthly food basket
    povertyBasketRatioPercent: number;
    riskIndex: number; // 0 - 100
    kategoriDayaBeli: 'TERJANGKAU' | 'RENTAN' | 'DARURAT';
    uraianBeban?: string;
  };
}
