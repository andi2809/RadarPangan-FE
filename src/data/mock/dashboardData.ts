import {
  TopRiskRegionItem,
  OtherCommoditySparkline,
  MarketComparisonItem,
  CrisisScenario,
  KpiMetrics,
  SupplyRoute
} from '../../types/domain';

export const KPI_METRICS_DATA: KpiMetrics = {
  totalWilayah: 27, // 27 Kab/Kota Jawa Barat
  komoditasDipantau: 5, // Bahan Pokok Kritis Bapanas
  wilayahRisikoTinggi: 3, // Kab. Bekasi, Kab. Subang, Kab. Pangandaran
  wilayahSurplus: 12, // Sentra surplus (Garut, Indramayu, Ciamis, dll.)
  stabilitasNasionalPct: 68.4
};

export const TOP_5_RISK_REGIONS: TopRiskRegionItem[] = [
  {
    rank: 1,
    regionId: '32.16',
    name: 'Kab. Bekasi',
    burdenUmkPercent: 9.2,
    status: 'kritis',
    statusLabel: 'Rentan',
    deviationPct: 8.7,
    currentPriceRp: 78200,
    forecastPriceRp: 88600
  },
  {
    rank: 2,
    regionId: '32.13',
    name: 'Kab. Subang',
    burdenUmkPercent: 8.9,
    status: 'kritis',
    statusLabel: 'Rentan',
    deviationPct: 6.1,
    currentPriceRp: 72400,
    forecastPriceRp: 79200
  },
  {
    rank: 3,
    regionId: '32.71',
    name: 'Kota Bogor',
    burdenUmkPercent: 8.4,
    status: 'waspada',
    statusLabel: 'Waspada',
    deviationPct: 5.8,
    currentPriceRp: 71000,
    forecastPriceRp: 75500
  },
  {
    rank: 4,
    regionId: '32.15',
    name: 'Kab. Karawang',
    burdenUmkPercent: 7.8,
    status: 'waspada',
    statusLabel: 'Waspada',
    deviationPct: 4.4,
    currentPriceRp: 68000,
    forecastPriceRp: 71800
  },
  {
    rank: 5,
    regionId: '32.12',
    name: 'Kab. Indramayu',
    burdenUmkPercent: 7.1,
    status: 'waspada',
    statusLabel: 'Waspada',
    deviationPct: 3.5,
    currentPriceRp: 63500,
    forecastPriceRp: 66200
  }
];

export const OTHER_COMMODITY_SPARKLINES: OtherCommoditySparkline[] = [
  {
    id: 'bawang_merah',
    name: 'Bawang Merah',
    changePct: 3.7,
    isIncrease: true,
    currentPriceRp: 32500,
    unit: '/kg',
    sparklinePoints: [28, 29, 29.5, 30.5, 31.8, 32.5]
  },
  {
    id: 'cabai_merah',
    name: 'Cabai Merah Keriting',
    changePct: 6.8,
    isIncrease: true,
    currentPriceRp: 42000,
    unit: '/kg',
    sparklinePoints: [36, 37.5, 38, 39.2, 40.8, 42]
  },
  {
    id: 'minyak_goreng',
    name: 'Minyak Kemasan (HET)',
    changePct: 5.4,
    isIncrease: true,
    currentPriceRp: 16500,
    unit: '/liter',
    sparklinePoints: [15.2, 15.5, 15.7, 16.0, 16.2, 16.5]
  },
  {
    id: 'tepung_terigu',
    name: 'Tepung Terigu',
    changePct: 2.1,
    isIncrease: true,
    currentPriceRp: 13200,
    unit: '/kg',
    sparklinePoints: [12.8, 12.9, 13.0, 13.0, 13.1, 13.2]
  },
  {
    id: 'gula_pasir',
    name: 'Gula Pasir',
    changePct: 4.8,
    isIncrease: true,
    currentPriceRp: 17500,
    unit: '/kg',
    sparklinePoints: [16.5, 16.8, 17.0, 17.1, 17.3, 17.5]
  }
];

export const MARKET_COMPARISON_DATA: MarketComparisonItem[] = [
  {
    commodityName: 'Cabai Rawit Merah',
    unit: 'Rp/kg',
    prices: {
      bekasi: 78200,
      subang: 72400,
      garut: 54100
    }
  },
  {
    commodityName: 'Bawang Merah',
    unit: 'Rp/kg',
    prices: {
      bekasi: 32000,
      subang: 28500,
      garut: 25700
    }
  },
  {
    commodityName: 'Beras Medium',
    unit: 'Rp/kg',
    prices: {
      bekasi: 14800,
      subang: 13200,
      garut: 12500
    }
  },
  {
    commodityName: 'Minyak Kemasan',
    unit: 'Rp/liter',
    prices: {
      bekasi: 17200,
      subang: 16000,
      garut: 15500
    }
  }
];

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'lebaran',
    name: 'Lonjakan Musiman (Hari Raya)',
    description: 'Lonjakan permintaan agregat pangan 35-45% menjelang hari besar keagamaan.',
    defaultSubsidyPercent: 30,
    defaultGpmTonnage: 200,
    projectedImpactPct: 18.3
  },
  {
    id: 'cuaca',
    name: 'Gagal Panen (El Niño / Banjir Pantura)',
    description: 'Penurunan suplai cabai & bawang merah hingga 40% dari sentra sentral.',
    defaultSubsidyPercent: 40,
    defaultGpmTonnage: 350,
    projectedImpactPct: 24.5
  },
  {
    id: 'distribusi',
    name: 'Disrupsi Rantai Pasok Logistik',
    description: 'Kenaikan biaya angkut BBM dan hambatan koridor jalan lintas provinsi.',
    defaultSubsidyPercent: 25,
    defaultGpmTonnage: 120,
    projectedImpactPct: 12.8
  }
];

export const DEFAULT_SUPPLY_CORRIDOR: SupplyRoute = {
  id: 'route-garut-to-bekasi',
  sourceRegionId: '32.05',
  sourceRegionName: 'Kab. Garut',
  targetRegionId: '32.16',
  targetRegionName: 'Kab. Bekasi',
  commodityId: 'cabai_rawit_merah',
  surplusAvailableTon: 8.0,
  defisitNeededTon: 8.0,
  jarakKm: 184,
  estimasiWaktuJam: 4.2,
  modeTransport: 'DARAT',
  biayaTransportEstRp: 4710400,
  // [lng, lat] coordinates from Garut through Bandung/Cipularang to Bekasi
  coordinates: [
    [107.904, -7.214],
    [107.750, -7.050],
    [107.619, -6.917],
    [107.450, -6.750],
    [107.250, -6.500],
    [107.100, -6.350],
    [106.989, -6.238]
  ]
};
