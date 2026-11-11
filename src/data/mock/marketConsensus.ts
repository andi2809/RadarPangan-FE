import { OFFICIAL_MARKETS_BY_REGION, type OfficialMarket, type RegionMarketDirectory } from './officialMarkets';

export interface MarketConsensusItem {
  id: string;
  regionId: string;
  namaPasar: string;
  kabupatenKota: string;
  laporanMasuk: number;
  perangkatUnik: number;
  radiusValid: number;
  outlierMad: number;
  laporanValid: number;
  hargaWargaRp: number | null;
  hargaAcuanRp: number;
  selisihPct: number | null;
  statusKuorum: 'tercapai' | 'menunggu' | 'belum_ada';
  updatedAt?: string;
  commodityId?: string;
  commodityName?: string;
  satuan?: string;
  quorumCoverage?: { reached: number; total: number };
}

export const MOCK_MARKET_CONSENSUS: MarketConsensusItem[] = [
  {
    id: 'psr-bekasikab-01',
    regionId: '32.16',
    namaPasar: 'Pasar Baru Cikarang',
    kabupatenKota: 'Kab. Bekasi',
    laporanMasuk: 18,
    perangkatUnik: 17,
    radiusValid: 16,
    outlierMad: 1,
    laporanValid: 15,
    hargaWargaRp: 49500,
    hargaAcuanRp: 48200,
    selisihPct: 2.7,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:15 WIB',
  },
  {
    id: 'psr-bdgkot-01',
    regionId: '32.73',
    namaPasar: 'Pasar Induk Caringin',
    kabupatenKota: 'Kota Bandung',
    laporanMasuk: 24,
    perangkatUnik: 23,
    radiusValid: 21,
    outlierMad: 2,
    laporanValid: 19,
    hargaWargaRp: 51300,
    hargaAcuanRp: 48200,
    selisihPct: 6.4,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:30 WIB',
  },
  {
    id: 'psr-bgrkab-01',
    regionId: '32.01',
    namaPasar: 'Pasar Cibinong',
    kabupatenKota: 'Kab. Bogor',
    laporanMasuk: 8,
    perangkatUnik: 8,
    radiusValid: 7,
    outlierMad: 1,
    laporanValid: 6,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:45 WIB',
  },
  {
    id: 'psr-garutkab-01',
    regionId: '32.05',
    namaPasar: 'Pasar Guntur Ciawitali',
    kabupatenKota: 'Kab. Garut',
    laporanMasuk: 14,
    perangkatUnik: 13,
    radiusValid: 12,
    outlierMad: 1,
    laporanValid: 11,
    hargaWargaRp: 48900,
    hargaAcuanRp: 48200,
    selisihPct: 1.5,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:10 WIB',
  },
  {
    id: 'psr-bekasikot-01',
    regionId: '32.75',
    namaPasar: 'Pasar Baru Bekasi',
    kabupatenKota: 'Kota Bekasi',
    laporanMasuk: 20,
    perangkatUnik: 19,
    radiusValid: 18,
    outlierMad: 2,
    laporanValid: 16,
    hargaWargaRp: 50400,
    hargaAcuanRp: 48200,
    selisihPct: 4.6,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:20 WIB',
  },
  {
    id: 'psr-depokkot-01',
    regionId: '32.76',
    namaPasar: 'Pasar Kemiri Muka',
    kabupatenKota: 'Kota Depok',
    laporanMasuk: 19,
    perangkatUnik: 18,
    radiusValid: 17,
    outlierMad: 1,
    laporanValid: 16,
    hargaWargaRp: 51200,
    hargaAcuanRp: 48200,
    selisihPct: 6.2,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:25 WIB',
  },
  {
    id: 'psr-bogorkot-01',
    regionId: '32.71',
    namaPasar: 'Pasar Anyar Bogor',
    kabupatenKota: 'Kota Bogor',
    laporanMasuk: 16,
    perangkatUnik: 15,
    radiusValid: 14,
    outlierMad: 1,
    laporanValid: 13,
    hargaWargaRp: 49800,
    hargaAcuanRp: 48200,
    selisihPct: 3.3,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:05 WIB',
  },
  {
    id: 'psr-tasikkt-01',
    regionId: '32.78',
    namaPasar: 'Pasar Cikurubuk',
    kabupatenKota: 'Kota Tasikmalaya',
    laporanMasuk: 15,
    perangkatUnik: 14,
    radiusValid: 13,
    outlierMad: 1,
    laporanValid: 12,
    hargaWargaRp: 47900,
    hargaAcuanRp: 48200,
    selisihPct: -0.6,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 07:55 WIB',
  },
  {
    id: 'psr-krwkab-01',
    regionId: '32.15',
    namaPasar: 'Pasar Johar Karawang',
    kabupatenKota: 'Kab. Karawang',
    laporanMasuk: 17,
    perangkatUnik: 16,
    radiusValid: 15,
    outlierMad: 1,
    laporanValid: 14,
    hargaWargaRp: 49200,
    hargaAcuanRp: 48200,
    selisihPct: 2.1,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:12 WIB',
  },
  {
    id: 'psr-crbnhkb-01',
    regionId: '32.09',
    namaPasar: 'Pasar Sumber',
    kabupatenKota: 'Kab. Cirebon',
    laporanMasuk: 15,
    perangkatUnik: 14,
    radiusValid: 13,
    outlierMad: 1,
    laporanValid: 12,
    hargaWargaRp: 46800,
    hargaAcuanRp: 48200,
    selisihPct: -2.9,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 07:50 WIB',
  },
  {
    id: 'psr-crbkot-01',
    regionId: '32.74',
    namaPasar: 'Pasar Kanoman',
    kabupatenKota: 'Kota Cirebon',
    laporanMasuk: 13,
    perangkatUnik: 12,
    radiusValid: 12,
    outlierMad: 1,
    laporanValid: 11,
    hargaWargaRp: 48500,
    hargaAcuanRp: 48200,
    selisihPct: 0.6,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:00 WIB',
  },
  {
    id: 'psr-cmhkot-01',
    regionId: '32.77',
    namaPasar: 'Pasar Atas Cimahi',
    kabupatenKota: 'Kota Cimahi',
    laporanMasuk: 13,
    perangkatUnik: 12,
    radiusValid: 12,
    outlierMad: 1,
    laporanValid: 11,
    hargaWargaRp: 50800,
    hargaAcuanRp: 48200,
    selisihPct: 5.4,
    statusKuorum: 'tercapai',
    updatedAt: '31 Okt 2026, 08:18 WIB',
  },
  {
    id: 'psr-pwkkab-01',
    regionId: '32.14',
    namaPasar: 'Pasar Simpang Purwakarta',
    kabupatenKota: 'Kab. Purwakarta',
    laporanMasuk: 9,
    perangkatUnik: 8,
    radiusValid: 8,
    outlierMad: 1,
    laporanValid: 7,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:35 WIB',
  },
  {
    id: 'psr-sbgkab-01',
    regionId: '32.13',
    namaPasar: 'Pasar Pujasera Subang',
    kabupatenKota: 'Kab. Subang',
    laporanMasuk: 9,
    perangkatUnik: 8,
    radiusValid: 8,
    outlierMad: 1,
    laporanValid: 7,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:40 WIB',
  },
  {
    id: 'psr-indramayu-01',
    regionId: '32.12',
    namaPasar: 'Pasar Karangampel',
    kabupatenKota: 'Kab. Indramayu',
    laporanMasuk: 8,
    perangkatUnik: 7,
    radiusValid: 7,
    outlierMad: 1,
    laporanValid: 6,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:30 WIB',
  },
  {
    id: 'psr-bdgkab-01',
    regionId: '32.04',
    namaPasar: 'Pasar Baleendah',
    kabupatenKota: 'Kab. Bandung',
    laporanMasuk: 9,
    perangkatUnik: 9,
    radiusValid: 8,
    outlierMad: 1,
    laporanValid: 7,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:52 WIB',
  },
  {
    id: 'psr-kbb-01',
    regionId: '32.17',
    namaPasar: 'Pasar Panorama Lembang',
    kabupatenKota: 'Kab. Bandung Barat',
    laporanMasuk: 7,
    perangkatUnik: 7,
    radiusValid: 6,
    outlierMad: 0,
    laporanValid: 6,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:22 WIB',
  },
  {
    id: 'psr-cianjur-01',
    regionId: '32.03',
    namaPasar: 'Pasar Induk Cianjur',
    kabupatenKota: 'Kab. Cianjur',
    laporanMasuk: 8,
    perangkatUnik: 8,
    radiusValid: 7,
    outlierMad: 1,
    laporanValid: 6,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:48 WIB',
  },
  {
    id: 'psr-smikab-01',
    regionId: '32.02',
    namaPasar: 'Pasar Cisaat',
    kabupatenKota: 'Kab. Sukabumi',
    laporanMasuk: 6,
    perangkatUnik: 6,
    radiusValid: 5,
    outlierMad: 0,
    laporanValid: 5,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:15 WIB',
  },
  {
    id: 'psr-smikot-01',
    regionId: '32.72',
    namaPasar: 'Pasar Pelita Sukabumi',
    kabupatenKota: 'Kota Sukabumi',
    laporanMasuk: 5,
    perangkatUnik: 5,
    radiusValid: 5,
    outlierMad: 0,
    laporanValid: 5,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:10 WIB',
  },
  {
    id: 'psr-mjl-01',
    regionId: '32.10',
    namaPasar: 'Pasar Kadipaten',
    kabupatenKota: 'Kab. Majalengka',
    laporanMasuk: 6,
    perangkatUnik: 6,
    radiusValid: 5,
    outlierMad: 0,
    laporanValid: 5,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'menunggu',
    updatedAt: '31 Okt 2026, 07:20 WIB',
  },
  {
    id: 'psr-smd-01',
    regionId: '32.11',
    namaPasar: 'Pasar Inpres Sumedang',
    kabupatenKota: 'Kab. Sumedang',
    laporanMasuk: 0,
    perangkatUnik: 0,
    radiusValid: 0,
    outlierMad: 0,
    laporanValid: 0,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'belum_ada',
  },
  {
    id: 'psr-cms-01',
    regionId: '32.07',
    namaPasar: 'Pasar Manis Ciamis',
    kabupatenKota: 'Kab. Ciamis',
    laporanMasuk: 0,
    perangkatUnik: 0,
    radiusValid: 0,
    outlierMad: 0,
    laporanValid: 0,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'belum_ada',
  },
  {
    id: 'psr-kng-01',
    regionId: '32.08',
    namaPasar: 'Pasar Kepuh Kuningan',
    kabupatenKota: 'Kab. Kuningan',
    laporanMasuk: 0,
    perangkatUnik: 0,
    radiusValid: 0,
    outlierMad: 0,
    laporanValid: 0,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'belum_ada',
  },
  {
    id: 'psr-tsm-01',
    regionId: '32.06',
    namaPasar: 'Pasar Singaparna',
    kabupatenKota: 'Kab. Tasikmalaya',
    laporanMasuk: 0,
    perangkatUnik: 0,
    radiusValid: 0,
    outlierMad: 0,
    laporanValid: 0,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'belum_ada',
  },
  {
    id: 'psr-bjr-01',
    regionId: '32.79',
    namaPasar: 'Pasar Banjar',
    kabupatenKota: 'Kota Banjar',
    laporanMasuk: 0,
    perangkatUnik: 0,
    radiusValid: 0,
    outlierMad: 0,
    laporanValid: 0,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'belum_ada',
  },
  {
    id: 'psr-pgd-01',
    regionId: '32.18',
    namaPasar: 'Pasar Kalipucang',
    kabupatenKota: 'Kab. Pangandaran',
    laporanMasuk: 0,
    perangkatUnik: 0,
    radiusValid: 0,
    outlierMad: 0,
    laporanValid: 0,
    hargaWargaRp: null,
    hargaAcuanRp: 48200,
    selisihPct: null,
    statusKuorum: 'belum_ada',
  },
];

export function getMarketConsensusForRegion(
  regionId: string,
  regionName?: string
): MarketConsensusItem | undefined {
  if (regionId) {
    const direct = MOCK_MARKET_CONSENSUS.find((item) => item.regionId === regionId);
    if (direct) return direct;
  }

  if (regionName) {
    const cleanTarget = regionName.toLowerCase().replace(/^(kab\.|kota)\s*/, '').trim();
    return MOCK_MARKET_CONSENSUS.find((item) => {
      const cleanItem = item.kabupatenKota.toLowerCase().replace(/^(kab\.|kota)\s*/, '').trim();
      return cleanItem === cleanTarget;
    });
  }

  return undefined;
}

// ============================================================================
// SISTEM KONSENSUS MULTI-KOMODITAS PER PASAR (KOMODITAS-AWARE QUORUM ENGINE)
// ============================================================================

export interface CommodityConsensusConfig {
  id: string;
  name: string;
  dropdownLabel: string;
  satuan: string;
  hargaAcuanRp: number;
  jenisAcuan: 'HET' | 'HAP';
}

export const COMMODITY_CONSENSUS_CONFIGS: CommodityConsensusConfig[] = [
  {
    id: 'cabai_rawit_merah',
    name: 'Cabai Rawit Merah',
    dropdownLabel: 'Cabai Rawit Merah',
    satuan: 'kg',
    hargaAcuanRp: 48200,
    jenisAcuan: 'HAP',
  },
  {
    id: 'beras_medium',
    name: 'Beras Medium',
    dropdownLabel: 'Beras Medium',
    satuan: 'kg',
    hargaAcuanRp: 13500,
    jenisAcuan: 'HET',
  },
  {
    id: 'bawang_merah',
    name: 'Bawang Merah',
    dropdownLabel: 'Bawang Merah',
    satuan: 'kg',
    hargaAcuanRp: 32000,
    jenisAcuan: 'HAP',
  },
  {
    id: 'telur_ayam_ras',
    name: 'Telur Ayam Ras',
    dropdownLabel: 'Telur Ayam Ras',
    satuan: 'kg',
    hargaAcuanRp: 27000,
    jenisAcuan: 'HAP',
  },
  {
    id: 'minyak_goreng_kemasan',
    name: 'Minyak Kemasan',
    dropdownLabel: 'Minyak Kemasan',
    satuan: 'liter',
    hargaAcuanRp: 17500,
    jenisAcuan: 'HAP',
  },
  {
    id: 'minyak_goreng_curah',
    name: 'Minyak Curah',
    dropdownLabel: 'Minyak Curah',
    satuan: 'liter',
    hargaAcuanRp: 15700,
    jenisAcuan: 'HET',
  },
];

export function normalizeCommodityKey(labelOrId: string): string {
  const clean = (labelOrId || '').toLowerCase().replace(/\s*\([^)]*\)/g, '').trim();
  if (clean.includes('cabai')) return 'cabai_rawit_merah';
  if (clean.includes('beras')) return 'beras_medium';
  if (clean.includes('bawang')) return 'bawang_merah';
  if (clean.includes('telur')) return 'telur_ayam_ras';
  if (clean.includes('kemasan')) return 'minyak_goreng_kemasan';
  if (clean.includes('curah')) return 'minyak_goreng_curah';
  return 'cabai_rawit_merah';
}

export interface AuditReportItem {
  id: string;
  waktuLapor: string;
  hargaRp: number;
  jarakKm: number;
  status: 'valid' | 'outlier' | 'radius_invalid' | 'duplicate';
  keterangan: string;
}

// 18 Laporan Individual Default untuk Pasar Baru Cikarang (Cabai Rawit Merah)
export const DEFAULT_CIKARANG_CABAI_AUDIT_REPORTS: AuditReportItem[] = [
  { id: 'RPT-CKR-001', waktuLapor: '31 Okt 2026, 09:14', hargaRp: 49500, jarakKm: 1.2, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-002', waktuLapor: '31 Okt 2026, 09:02', hargaRp: 50000, jarakKm: 0.8, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-003', waktuLapor: '31 Okt 2026, 08:57', hargaRp: 49000, jarakKm: 1.9, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-004', waktuLapor: '31 Okt 2026, 08:41', hargaRp: 56000, jarakKm: 2.1, status: 'outlier', keterangan: 'Deviasi +13,1% dari median (> 10%)' },
  { id: 'RPT-CKR-005', waktuLapor: '31 Okt 2026, 08:37', hargaRp: 48500, jarakKm: 0.6, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-006', waktuLapor: '31 Okt 2026, 08:30', hargaRp: 49500, jarakKm: 1.4, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-007', waktuLapor: '31 Okt 2026, 08:24', hargaRp: 50500, jarakKm: 2.5, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-008', waktuLapor: '31 Okt 2026, 08:18', hargaRp: 49500, jarakKm: 0.4, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-009', waktuLapor: '31 Okt 2026, 08:11', hargaRp: 48000, jarakKm: 1.7, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-010', waktuLapor: '31 Okt 2026, 08:05', hargaRp: 51000, jarakKm: 2.8, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-011', waktuLapor: '31 Okt 2026, 07:58', hargaRp: 49500, jarakKm: 1.1, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-012', waktuLapor: '31 Okt 2026, 07:49', hargaRp: 49000, jarakKm: 0.9, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-013', waktuLapor: '31 Okt 2026, 07:42', hargaRp: 50000, jarakKm: 2.2, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-014', waktuLapor: '31 Okt 2026, 07:35', hargaRp: 52000, jarakKm: 1.6, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-015', waktuLapor: '31 Okt 2026, 07:28', hargaRp: 47000, jarakKm: 2.7, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-016', waktuLapor: '31 Okt 2026, 07:20', hargaRp: 48500, jarakKm: 1.5, status: 'valid', keterangan: 'Masuk radius, dalam rentang wajar' },
  { id: 'RPT-CKR-017', waktuLapor: '31 Okt 2026, 07:12', hargaRp: 49000, jarakKm: 4.8, status: 'radius_invalid', keterangan: 'Jarak 4.8 km dari pasar (> 3 km)' },
  { id: 'RPT-CKR-018', waktuLapor: '31 Okt 2026, 07:05', hargaRp: 49500, jarakKm: 1.0, status: 'duplicate', keterangan: 'Duplikasi perangkat: Perangkat telah melapor hari ini' },
];

// Matriks Konsensus Komoditas Non-Cabai per Pasar (27 Pasar)
type MarketCommodityMap = Record<string, Partial<Record<string, {
  masuk: number;
  unik: number;
  radius: number;
  outlier: number;
  valid: number;
  harga: number | null;
  status: 'tercapai' | 'menunggu' | 'belum_ada';
}>>>;

const MARKET_COMMODITY_MATRIX: MarketCommodityMap = {
  'psr-bekasikab-01': {
    beras_medium: { masuk: 20, unik: 19, radius: 18, outlier: 1, valid: 17, harga: 14100, status: 'tercapai' },
    bawang_merah: { masuk: 14, unik: 13, radius: 12, outlier: 1, valid: 11, harga: 33500, status: 'tercapai' },
    telur_ayam_ras: { masuk: 9, unik: 8, radius: 8, outlier: 1, valid: 7, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 6, unik: 6, radius: 5, outlier: 1, valid: 4, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 2, unik: 2, radius: 2, outlier: 0, valid: 2, harga: null, status: 'menunggu' },
  },
  'psr-bdgkot-01': {
    beras_medium: { masuk: 28, unik: 26, radius: 25, outlier: 2, valid: 23, harga: 14300, status: 'tercapai' },
    bawang_merah: { masuk: 22, unik: 21, radius: 19, outlier: 2, valid: 17, harga: 34200, status: 'tercapai' },
    telur_ayam_ras: { masuk: 16, unik: 15, radius: 14, outlier: 1, valid: 13, harga: 28500, status: 'tercapai' },
    minyak_goreng_kemasan: { masuk: 12, unik: 12, radius: 11, outlier: 1, valid: 10, harga: 18200, status: 'tercapai' },
    minyak_goreng_curah: { masuk: 7, unik: 7, radius: 6, outlier: 0, valid: 6, harga: null, status: 'menunggu' },
  },
  'psr-bgrkab-01': {
    beras_medium: { masuk: 14, unik: 13, radius: 12, outlier: 1, valid: 11, harga: 13900, status: 'tercapai' },
    bawang_merah: { masuk: 12, unik: 11, radius: 11, outlier: 1, valid: 10, harga: 33100, status: 'tercapai' },
    telur_ayam_ras: { masuk: 6, unik: 6, radius: 5, outlier: 0, valid: 5, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-garutkab-01': {
    beras_medium: { masuk: 17, unik: 16, radius: 15, outlier: 1, valid: 14, harga: 13800, status: 'tercapai' },
    bawang_merah: { masuk: 15, unik: 14, radius: 13, outlier: 1, valid: 12, harga: 32600, status: 'tercapai' },
    telur_ayam_ras: { masuk: 8, unik: 7, radius: 7, outlier: 1, valid: 6, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 4, unik: 4, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-bekasikot-01': {
    beras_medium: { masuk: 22, unik: 21, radius: 19, outlier: 1, valid: 18, harga: 14200, status: 'tercapai' },
    bawang_merah: { masuk: 17, unik: 16, radius: 15, outlier: 1, valid: 14, harga: 33800, status: 'tercapai' },
    telur_ayam_ras: { masuk: 13, unik: 12, radius: 12, outlier: 1, valid: 11, harga: 28200, status: 'tercapai' },
    minyak_goreng_kemasan: { masuk: 9, unik: 9, radius: 8, outlier: 0, valid: 8, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 4, unik: 4, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
  },
  'psr-depokkot-01': {
    beras_medium: { masuk: 21, unik: 20, radius: 18, outlier: 1, valid: 17, harga: 14400, status: 'tercapai' },
    bawang_merah: { masuk: 16, unik: 15, radius: 14, outlier: 1, valid: 13, harga: 34000, status: 'tercapai' },
    telur_ayam_ras: { masuk: 12, unik: 11, radius: 11, outlier: 1, valid: 10, harga: 28400, status: 'tercapai' },
    minyak_goreng_kemasan: { masuk: 8, unik: 8, radius: 7, outlier: 0, valid: 7, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 3, unik: 3, radius: 2, outlier: 0, valid: 2, harga: null, status: 'menunggu' },
  },
  'psr-bogorkot-01': {
    beras_medium: { masuk: 19, unik: 18, radius: 17, outlier: 1, valid: 16, harga: 14000, status: 'tercapai' },
    bawang_merah: { masuk: 14, unik: 13, radius: 12, outlier: 1, valid: 11, harga: 33400, status: 'tercapai' },
    telur_ayam_ras: { masuk: 9, unik: 9, radius: 8, outlier: 0, valid: 8, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 5, unik: 5, radius: 5, outlier: 0, valid: 5, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-tasikkt-01': {
    beras_medium: { masuk: 17, unik: 16, radius: 15, outlier: 1, valid: 14, harga: 13700, status: 'tercapai' },
    bawang_merah: { masuk: 12, unik: 11, radius: 11, outlier: 1, valid: 10, harga: 32700, status: 'tercapai' },
    telur_ayam_ras: { masuk: 8, unik: 8, radius: 7, outlier: 0, valid: 7, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 4, unik: 4, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-krwkab-01': {
    beras_medium: { masuk: 25, unik: 23, radius: 22, outlier: 1, valid: 21, harga: 13900, status: 'tercapai' },
    bawang_merah: { masuk: 10, unik: 9, radius: 9, outlier: 1, valid: 8, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 7, unik: 7, radius: 6, outlier: 0, valid: 6, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 4, unik: 4, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-crbnhkb-01': {
    beras_medium: { masuk: 16, unik: 15, radius: 15, outlier: 1, valid: 14, harga: 14000, status: 'tercapai' },
    bawang_merah: { masuk: 18, unik: 17, radius: 16, outlier: 1, valid: 15, harga: 33000, status: 'tercapai' },
    telur_ayam_ras: { masuk: 7, unik: 7, radius: 6, outlier: 0, valid: 6, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 3, unik: 3, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-crbkot-01': {
    beras_medium: { masuk: 15, unik: 14, radius: 14, outlier: 1, valid: 13, harga: 13900, status: 'tercapai' },
    bawang_merah: { masuk: 16, unik: 15, radius: 15, outlier: 1, valid: 14, harga: 32600, status: 'tercapai' },
    telur_ayam_ras: { masuk: 8, unik: 8, radius: 7, outlier: 0, valid: 7, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 4, unik: 4, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-cmhkot-01': {
    beras_medium: { masuk: 14, unik: 13, radius: 13, outlier: 1, valid: 12, harga: 14200, status: 'tercapai' },
    bawang_merah: { masuk: 9, unik: 8, radius: 8, outlier: 1, valid: 7, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 6, unik: 6, radius: 5, outlier: 0, valid: 5, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 3, unik: 3, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-pwkkab-01': {
    beras_medium: { masuk: 13, unik: 12, radius: 12, outlier: 1, valid: 11, harga: 13800, status: 'tercapai' },
    bawang_merah: { masuk: 6, unik: 6, radius: 5, outlier: 0, valid: 5, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-sbgkab-01': {
    beras_medium: { masuk: 15, unik: 14, radius: 14, outlier: 1, valid: 13, harga: 13600, status: 'tercapai' },
    bawang_merah: { masuk: 7, unik: 7, radius: 6, outlier: 0, valid: 6, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 4, unik: 4, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-indramayu-01': {
    beras_medium: { masuk: 19, unik: 17, radius: 17, outlier: 1, valid: 16, harga: 13500, status: 'tercapai' },
    bawang_merah: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 3, unik: 3, radius: 2, outlier: 0, valid: 2, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-bdgkab-01': {
    beras_medium: { masuk: 14, unik: 13, radius: 13, outlier: 1, valid: 12, harga: 14000, status: 'tercapai' },
    bawang_merah: { masuk: 7, unik: 7, radius: 6, outlier: 0, valid: 6, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-kbb-01': {
    beras_medium: { masuk: 12, unik: 11, radius: 11, outlier: 1, valid: 10, harga: 14100, status: 'tercapai' },
    bawang_merah: { masuk: 6, unik: 6, radius: 5, outlier: 0, valid: 5, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 4, unik: 4, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-cianjur-01': {
    beras_medium: { masuk: 16, unik: 15, radius: 15, outlier: 1, valid: 14, harga: 13800, status: 'tercapai' },
    bawang_merah: { masuk: 6, unik: 6, radius: 5, outlier: 0, valid: 5, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 4, unik: 4, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-smikab-01': {
    beras_medium: { masuk: 13, unik: 12, radius: 12, outlier: 1, valid: 11, harga: 13900, status: 'tercapai' },
    bawang_merah: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 3, unik: 3, radius: 2, outlier: 0, valid: 2, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-smikot-01': {
    beras_medium: { masuk: 13, unik: 12, radius: 12, outlier: 1, valid: 11, harga: 13900, status: 'tercapai' },
    bawang_merah: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 3, unik: 3, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-mjl-01': {
    beras_medium: { masuk: 12, unik: 11, radius: 11, outlier: 1, valid: 10, harga: 13700, status: 'tercapai' },
    bawang_merah: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 3, unik: 3, radius: 2, outlier: 0, valid: 2, harga: null, status: 'menunggu' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-smd-01': {
    beras_medium: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    bawang_merah: { masuk: 3, unik: 3, radius: 2, outlier: 0, valid: 2, harga: null, status: 'menunggu' },
    telur_ayam_ras: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-cms-01': {
    beras_medium: { masuk: 4, unik: 4, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    bawang_merah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    telur_ayam_ras: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-kng-01': {
    beras_medium: { masuk: 5, unik: 5, radius: 4, outlier: 0, valid: 4, harga: null, status: 'menunggu' },
    bawang_merah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    telur_ayam_ras: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-tsm-01': {
    beras_medium: { masuk: 4, unik: 4, radius: 3, outlier: 0, valid: 3, harga: null, status: 'menunggu' },
    bawang_merah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    telur_ayam_ras: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-bjr-01': {
    beras_medium: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    bawang_merah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    telur_ayam_ras: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
  'psr-pgd-01': {
    beras_medium: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    bawang_merah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    telur_ayam_ras: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_kemasan: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
    minyak_goreng_curah: { masuk: 0, unik: 0, radius: 0, outlier: 0, valid: 0, harga: null, status: 'belum_ada' },
  },
};

/**
 * Menghitung cakupan jumlah komoditas yang telah kuorum (tercapai) pada pasar tertentu.
 */
export function getMarketQuorumCoverage(marketId: string): { reached: number; total: number } {
  let reached = 0;
  // 1. Cek cabai_rawit_merah
  const cabaiItem = MOCK_MARKET_CONSENSUS.find((m) => m.id === marketId);
  if (cabaiItem && cabaiItem.statusKuorum === 'tercapai') {
    reached++;
  }
  // 2. Cek 5 komoditas lainnya
  const otherComm = MARKET_COMMODITY_MATRIX[marketId];
  if (otherComm) {
    for (const commKey of Object.keys(otherComm)) {
      if (otherComm[commKey]?.status === 'tercapai') {
        reached++;
      }
    }
  }
  return { reached, total: COMMODITY_CONSENSUS_CONFIGS.length };
}

/**
 * Mengambil daftar 27 pasar untuk komoditas tertentu.
 * Data kuorum, harga warga, selisih, dan acuan disesuaikan dengan komoditas tersebut.
 */
export function getMarketConsensusByCommodity(commodityKey: string): MarketConsensusItem[] {
  const normKey = normalizeCommodityKey(commodityKey);
  const cfg =
    COMMODITY_CONSENSUS_CONFIGS.find((c) => c.id === normKey) ||
    COMMODITY_CONSENSUS_CONFIGS[0];

  return MOCK_MARKET_CONSENSUS.map((base) => {
    const coverage = getMarketQuorumCoverage(base.id);

    if (normKey === 'cabai_rawit_merah') {
      return {
        ...base,
        commodityId: cfg.id,
        commodityName: cfg.name,
        satuan: cfg.satuan,
        hargaAcuanRp: cfg.hargaAcuanRp,
        quorumCoverage: coverage,
      };
    }

    const marketOverride = MARKET_COMMODITY_MATRIX[base.id]?.[normKey];
    if (!marketOverride) {
      return {
        ...base,
        commodityId: cfg.id,
        commodityName: cfg.name,
        satuan: cfg.satuan,
        laporanMasuk: 0,
        perangkatUnik: 0,
        radiusValid: 0,
        outlierMad: 0,
        laporanValid: 0,
        hargaWargaRp: null,
        hargaAcuanRp: cfg.hargaAcuanRp,
        selisihPct: null,
        statusKuorum: 'belum_ada',
        quorumCoverage: coverage,
      };
    }

    const selisih =
      marketOverride.harga && marketOverride.status === 'tercapai'
        ? Number((((marketOverride.harga - cfg.hargaAcuanRp) / cfg.hargaAcuanRp) * 100).toFixed(1))
        : null;

    return {
      id: base.id,
      regionId: base.regionId,
      namaPasar: base.namaPasar,
      kabupatenKota: base.kabupatenKota,
      laporanMasuk: marketOverride.masuk,
      perangkatUnik: marketOverride.unik,
      radiusValid: marketOverride.radius,
      outlierMad: marketOverride.outlier,
      laporanValid: marketOverride.valid,
      hargaWargaRp: marketOverride.harga,
      hargaAcuanRp: cfg.hargaAcuanRp,
      selisihPct: selisih,
      statusKuorum: marketOverride.status,
      updatedAt: base.updatedAt,
      commodityId: cfg.id,
      commodityName: cfg.name,
      satuan: cfg.satuan,
      quorumCoverage: coverage,
    };
  });
}

/**
 * Mengambil status konsensus satu komoditas tertentu untuk seluruh 133 pasar resmi di 27 Kabupaten/Kota Jawa Barat.
 */
export function getAllOfficialMarketsConsensusByCommodity(
  commodityKey: string
): MarketConsensusItem[] {
  const normKey = normalizeCommodityKey(commodityKey);
  const allGroups = getAllRegionConsensusGroups();
  const result: MarketConsensusItem[] = [];

  for (const group of allGroups) {
    for (const m of group.markets) {
      const comm = m.commodities[normKey];
      result.push({
        id: m.id,
        regionId: m.regionId,
        namaPasar: m.namaPasar,
        kabupatenKota: m.kabupatenKota,
        laporanMasuk: comm?.laporanMasuk || 0,
        perangkatUnik: comm && comm.laporanMasuk > 1 ? comm.laporanMasuk - 1 : comm?.laporanMasuk || 0,
        radiusValid: comm && comm.laporanMasuk > 2 ? comm.laporanMasuk - 2 : comm?.laporanMasuk || 0,
        outlierMad: comm?.statusKuorum === 'tercapai' ? 1 : 0,
        laporanValid: comm?.laporanValid || 0,
        hargaWargaRp: comm?.hargaWargaRp || null,
        hargaAcuanRp: comm?.hargaAcuanRp || 0,
        selisihPct: comm?.selisihPct || null,
        statusKuorum: comm?.statusKuorum || 'belum_ada',
        updatedAt: '31 Okt 2026, 09:15 WIB',
        commodityId: comm?.commodityId || normKey,
        commodityName: comm?.commodityName || '',
        satuan: comm?.satuan || '',
        quorumCoverage: {
          reached: m.quorumCoverage.reached,
          total: m.quorumCoverage.total,
        },
      });
    }
  }

  return result;
}

export interface MarketDetailConsensusData {
  market: {
    id: string;
    namaPasar: string;
    kabupatenKota: string;
    regionId: string;
    instansiPengelola: string;
  };
  commodity: CommodityConsensusConfig;
  kpi: {
    laporanMasuk: number;
    perangkatUnik: number;
    radiusValid: number;
    diLuarRadius: number;
    outlierMad: number;
    laporanValid: number;
    statusKuorum: 'tercapai' | 'menunggu' | 'belum_ada';
  };
  hargaWargaRp: number | null;
  hargaAcuanRp: number;
  selisihPct: number | null;
  histogramBins: Array<{ price: number; label: string; count: number; isMedian?: boolean }>;
  auditReports: AuditReportItem[];
  quorumCoverage: { reached: number; total: number };
}

export interface MarketMultiCommoditySummary {
  id: string;
  namaPasar: string;
  kecamatan?: string;
  pengelola?: string;
  kabupatenKota: string;
  regionId: string;
  isAnchorMarket?: boolean;
  totalLaporanMasuk: number;
  totalLaporanValid: number;
  quorumCoverage: { reached: number; total: number; percentage: number };
  commodities: Record<
    string,
    {
      commodityId: string;
      commodityName: string;
      satuan: string;
      hargaWargaRp: number | null;
      hargaAcuanRp: number;
      selisihPct: number | null;
      statusKuorum: 'tercapai' | 'menunggu' | 'belum_ada';
      laporanValid: number;
      laporanMasuk: number;
      duplikasiPerangkat?: number;
      diLuarRadius?: number;
      radiusValid?: number;
      outlierMad?: number;
      perangkatUnik?: number;
    }
  >;
}

export interface RegionConsensusGroup {
  regionId: string;
  regionName: string;
  instansiPengelola: string;
  totalMarkets: number;
  activeQuorumMarkets: number; // Jumlah pasar yang minimal 1 komoditasnya kuorum
  highReadinessMarkets: number; // Jumlah pasar yang minimal 3 komoditasnya kuorum (≥50%)
  totalLaporanMasuk: number;
  totalLaporanValid: number;
  markets: MarketMultiCommoditySummary[];
}

/**
 * Generator deterministik matriks multi-komoditas untuk pasar resmi (133 pasar di Jawa Barat).
 * Menjamin konsistensi matematis ketat pada setiap saringan:
 * Laporan Masuk = Perangkat Unik + Duplikasi
 * Perangkat Unik = Radius Valid + Di Luar Radius
 * Radius Valid = Laporan Valid + Outlier MAD
 */
export function getOfficialMarketCommoditySummary(
  market: OfficialMarket,
  regionDir: RegionMarketDirectory,
  indexInRegion?: number
): MarketMultiCommoditySummary {
  const actualIndex =
    indexInRegion !== undefined
      ? indexInRegion
      : Math.max(0, regionDir.markets.findIndex((m) => m.id === market.id));

  // Cek apakah pasar ini merupakan anchor market di MOCK_MARKET_CONSENSUS
  const anchor = MOCK_MARKET_CONSENSUS.find(
    (b) => b.id === market.id || b.namaPasar.toLowerCase() === market.name.toLowerCase()
  );

  if (anchor) {
    const coverage = getMarketQuorumCoverage(anchor.id);
    let totalMasuk = 0;
    let totalValid = 0;
    const commoditiesObj: MarketMultiCommoditySummary['commodities'] = {};

    for (const cfg of COMMODITY_CONSENSUS_CONFIGS) {
      if (cfg.id === 'cabai_rawit_merah') {
        const dup = Math.max(0, anchor.laporanMasuk - anchor.perangkatUnik);
        const diLuar = Math.max(0, anchor.perangkatUnik - anchor.radiusValid);
        totalMasuk += anchor.laporanMasuk;
        totalValid += anchor.laporanValid;
        commoditiesObj[cfg.id] = {
          commodityId: cfg.id,
          commodityName: cfg.name,
          satuan: cfg.satuan,
          hargaWargaRp: anchor.hargaWargaRp,
          hargaAcuanRp: cfg.hargaAcuanRp,
          selisihPct: anchor.selisihPct,
          statusKuorum: anchor.statusKuorum,
          laporanValid: anchor.laporanValid,
          laporanMasuk: anchor.laporanMasuk,
          duplikasiPerangkat: dup,
          diLuarRadius: diLuar,
          radiusValid: anchor.radiusValid,
          outlierMad: anchor.outlierMad,
          perangkatUnik: anchor.perangkatUnik,
        };
      } else {
        const item = MARKET_COMMODITY_MATRIX[anchor.id]?.[cfg.id];
        const masuk = item?.masuk || 0;
        const unik = item?.unik || masuk;
        const radius = item?.radius || unik;
        const outlier = item?.outlier || 0;
        const valid = item?.valid || 0;
        const harga = item?.harga || null;
        const status = item?.status || 'belum_ada';
        const selisih =
          harga && status === 'tercapai'
            ? Number((((harga - cfg.hargaAcuanRp) / cfg.hargaAcuanRp) * 100).toFixed(1))
            : null;

        totalMasuk += masuk;
        totalValid += valid;
        commoditiesObj[cfg.id] = {
          commodityId: cfg.id,
          commodityName: cfg.name,
          satuan: cfg.satuan,
          hargaWargaRp: harga,
          hargaAcuanRp: cfg.hargaAcuanRp,
          selisihPct: selisih,
          statusKuorum: status,
          laporanValid: valid,
          laporanMasuk: masuk,
          duplikasiPerangkat: Math.max(0, masuk - unik),
          diLuarRadius: Math.max(0, unik - radius),
          radiusValid: radius,
          outlierMad: outlier,
          perangkatUnik: unik,
        };
      }
    }

    return {
      id: anchor.id,
      namaPasar: market.name,
      kecamatan: market.kecamatan,
      pengelola: market.pengelola,
      kabupatenKota: regionDir.regionName,
      regionId: regionDir.regionId,
      isAnchorMarket: true,
      totalLaporanMasuk: totalMasuk,
      totalLaporanValid: totalValid,
      quorumCoverage: {
        reached: coverage.reached,
        total: coverage.total,
        percentage: Math.round((coverage.reached / coverage.total) * 100),
      },
      commodities: commoditiesObj,
    };
  }

  // Untuk pasar non-anchor dalam direktori resmi 133 pasar:
  const isWholesale = market.name.toLowerCase().includes('induk');
  let totalMasuk = 0;
  let totalValid = 0;
  let reachedQuorum = 0;
  const commoditiesObj: MarketMultiCommoditySummary['commodities'] = {};

  for (let cIdx = 0; cIdx < COMMODITY_CONSENSUS_CONFIGS.length; cIdx++) {
    const cfg = COMMODITY_CONSENSUS_CONFIGS[cIdx];
    let masuk = 0;
    let duplikasiPerangkat = 0;
    let diLuarRadius = 0;
    let outlierMad = 0;
    let valid = 0;
    let status: 'tercapai' | 'menunggu' | 'belum_ada' = 'belum_ada';
    let harga: number | null = null;
    let selisih: number | null = null;

    if (isWholesale) {
      // Pasar Induk sekunder (misal Pasar Induk Cibitung): volume tinggi
      if (cIdx < 4) {
        masuk = 20 - cIdx * 2 + (actualIndex % 3);
        duplikasiPerangkat = 1;
        diLuarRadius = 1;
        outlierMad = 1;
        valid = masuk - duplikasiPerangkat - diLuarRadius - outlierMad;
        status = 'tercapai';
        const priceOffset = ((cIdx % 3) - 1) * 300;
        harga = cfg.hargaAcuanRp + priceOffset;
        selisih = Number((((harga - cfg.hargaAcuanRp) / cfg.hargaAcuanRp) * 100).toFixed(1));
        reachedQuorum++;
      } else {
        masuk = Math.max(0, 6 - (cIdx - 4) * 2);
        duplikasiPerangkat = 0;
        diLuarRadius = masuk > 3 ? 1 : 0;
        outlierMad = 0;
        valid = masuk - duplikasiPerangkat - diLuarRadius - outlierMad;
        status = valid >= 10 ? 'tercapai' : (masuk > 0 ? 'menunggu' : 'belum_ada');
        if (status === 'tercapai') reachedQuorum++;
      }
    } else if (actualIndex === 1 || actualIndex === 2) {
      // Pasar kecamatan primer: 1-2 komoditas kuorum (Cabai atau Beras)
      if (cIdx === 0 && actualIndex === 1) {
        masuk = 12;
        duplikasiPerangkat = 1;
        diLuarRadius = 0;
        outlierMad = 1;
        valid = 10;
        status = 'tercapai';
        harga = Math.round((cfg.hargaAcuanRp * 1.025) / 100) * 100;
        selisih = 2.5;
        reachedQuorum++;
      } else if (cIdx === 1 && actualIndex === 2) {
        masuk = 12;
        duplikasiPerangkat = 1;
        diLuarRadius = 1;
        outlierMad = 0;
        valid = 10;
        status = 'tercapai';
        harga = Math.round((cfg.hargaAcuanRp * 1.02) / 100) * 100;
        selisih = 2.0;
        reachedQuorum++;
      } else if (cIdx < 3) {
        masuk = 6 - cIdx;
        duplikasiPerangkat = 0;
        diLuarRadius = 1;
        outlierMad = 0;
        valid = masuk - 1;
        status = 'menunggu';
      } else {
        masuk = 2 - (cIdx % 2);
        duplikasiPerangkat = 0;
        diLuarRadius = 0;
        outlierMad = 0;
        valid = masuk;
        status = masuk > 0 ? 'menunggu' : 'belum_ada';
      }
    } else {
      // Pasar kecamatan sekunder/pinggiran (actualIndex >= 3): laporan minim (0-4 laporan)
      if (cIdx === 0) {
        masuk = Math.max(0, 4 - actualIndex % 3);
        duplikasiPerangkat = 0;
        diLuarRadius = masuk > 2 ? 1 : 0;
        outlierMad = 0;
        valid = masuk - diLuarRadius;
        status = masuk > 0 ? 'menunggu' : 'belum_ada';
      } else if (cIdx === 1) {
        masuk = Math.max(0, 3 - actualIndex % 2);
        duplikasiPerangkat = 0;
        diLuarRadius = masuk > 2 ? 1 : 0;
        outlierMad = 0;
        valid = masuk - diLuarRadius;
        status = masuk > 0 ? 'menunggu' : 'belum_ada';
      } else {
        masuk = 0;
        valid = 0;
        status = 'belum_ada';
      }
    }

    const perangkatUnik = masuk - duplikasiPerangkat;
    const radiusValid = perangkatUnik - diLuarRadius;

    totalMasuk += masuk;
    totalValid += valid;

    commoditiesObj[cfg.id] = {
      commodityId: cfg.id,
      commodityName: cfg.name,
      satuan: cfg.satuan,
      hargaWargaRp: harga,
      hargaAcuanRp: cfg.hargaAcuanRp,
      selisihPct: selisih,
      statusKuorum: status,
      laporanValid: valid,
      laporanMasuk: masuk,
      duplikasiPerangkat,
      diLuarRadius,
      radiusValid,
      outlierMad,
      perangkatUnik,
    };
  }

  return {
    id: market.id,
    namaPasar: market.name,
    kecamatan: market.kecamatan,
    pengelola: market.pengelola,
    kabupatenKota: regionDir.regionName,
    regionId: regionDir.regionId,
    isAnchorMarket: false,
    totalLaporanMasuk: totalMasuk,
    totalLaporanValid: totalValid,
    quorumCoverage: {
      reached: reachedQuorum,
      total: COMMODITY_CONSENSUS_CONFIGS.length,
      percentage: Math.round((reachedQuorum / COMMODITY_CONSENSUS_CONFIGS.length) * 100),
    },
    commodities: commoditiesObj,
  };
}

/**
 * Mencari ringkasan multi-komoditas pasar berdasarkan ID secara akurat (baik anchor maupun seluruh 133 pasar).
 */
export function getMarketSummaryById(marketId: string): MarketMultiCommoditySummary {
  // 1. Cek anchor markets
  const anchor = MOCK_MARKET_CONSENSUS.find((b) => b.id === marketId);
  if (anchor) {
    const regDir = OFFICIAL_MARKETS_BY_REGION[anchor.regionId];
    const offMarket = regDir?.markets.find((m) => m.id === anchor.id) || {
      id: anchor.id,
      name: anchor.namaPasar,
      kecamatan: '',
      pengelola: `UPTD Pengelola ${anchor.namaPasar}`,
    };
    return getOfficialMarketCommoditySummary(
      offMarket,
      regDir || {
        regionId: anchor.regionId,
        regionName: anchor.kabupatenKota,
        instansiPengelola: `UPTD Pengelola ${anchor.namaPasar}`,
        markets: [offMarket],
      },
      0
    );
  }

  // 2. Cek di seluruh 133 pasar resmi
  for (const rKey of Object.keys(OFFICIAL_MARKETS_BY_REGION)) {
    const dir = OFFICIAL_MARKETS_BY_REGION[rKey];
    const idx = dir.markets.findIndex((m) => m.id === marketId);
    if (idx >= 0) {
      return getOfficialMarketCommoditySummary(dir.markets[idx], dir, idx);
    }
  }

  // Fallback ke pasar pertama (Pasar Baru Cikarang)
  const defaultDir = OFFICIAL_MARKETS_BY_REGION['32.16'];
  return getOfficialMarketCommoditySummary(defaultDir.markets[0], defaultDir, 0);
}

/**
 * Resolver komprehensif data audit halaman detail `[marketId]` berdasarkan komoditas aktif.
 * Menggunakan Single Source of Truth dari getMarketSummaryById sehingga 100% konsisten dengan tabel list.
 */
export function getMarketDetailConsensus(
  marketId: string,
  commodityKey: string
): MarketDetailConsensusData {
  const normKey = normalizeCommodityKey(commodityKey);
  const cfg =
    COMMODITY_CONSENSUS_CONFIGS.find((c) => c.id === normKey) ||
    COMMODITY_CONSENSUS_CONFIGS[0];

  const summary = getMarketSummaryById(marketId);
  const commData = summary.commodities[normKey];

  const laporanMasuk = commData.laporanMasuk;
  const duplikasiPerangkat = commData.duplikasiPerangkat ?? 0;
  const perangkatUnik = commData.perangkatUnik ?? (laporanMasuk - duplikasiPerangkat);
  const diLuarRadius = commData.diLuarRadius ?? 0;
  const radiusValid = commData.radiusValid ?? (perangkatUnik - diLuarRadius);
  const outlierMad = commData.outlierMad ?? 0;
  const laporanValid = commData.laporanValid;
  const statusKuorum = commData.statusKuorum;

  // 1. Audit Reports
  let auditReports: AuditReportItem[] = [];
  if (summary.id === 'psr-bekasikab-01' && normKey === 'cabai_rawit_merah') {
    auditReports = [...DEFAULT_CIKARANG_CABAI_AUDIT_REPORTS];
  } else if (laporanMasuk > 0) {
    const codePrefix = summary.id.replace('psr-', '').toUpperCase();
    const basePrice = commData.hargaWargaRp || cfg.hargaAcuanRp;
    const reports: AuditReportItem[] = [];
    const startHour = 9;
    const startMinute = 15;

    // A. Laporan Valid
    for (let i = 0; i < laporanValid; i++) {
      const minute = (startMinute - i * 4 + 60) % 60;
      const hour = startHour - Math.floor((i * 4) / 60);
      const timeStr = `31 Okt 2026, ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const delta = ((i % 5) - 2) * (cfg.satuan === 'kg' && cfg.hargaAcuanRp > 20000 ? 500 : 200);
      reports.push({
        id: `RPT-${codePrefix}-${String(i + 1).padStart(3, '0')}`,
        waktuLapor: timeStr,
        hargaRp: Math.round((basePrice + delta) / 100) * 100,
        jarakKm: Number((0.6 + (i % 5) * 0.4).toFixed(1)),
        status: 'valid',
        keterangan: 'Masuk radius ≤ 3 km, lolos saringan MAD',
      });
    }

    // B. Outlier MAD
    for (let i = 0; i < outlierMad; i++) {
      const idx = laporanValid + i + 1;
      const extremePrice = Math.round((basePrice * 1.15) / 100) * 100;
      reports.push({
        id: `RPT-${codePrefix}-${String(idx).padStart(3, '0')}`,
        waktuLapor: '31 Okt 2026, 08:44',
        hargaRp: extremePrice,
        jarakKm: 1.8,
        status: 'outlier',
        keterangan: `Deviasi +15.0% dari median (> batas toleransi 10%)`,
      });
    }

    // C. Di Luar Radius
    for (let i = 0; i < diLuarRadius; i++) {
      const idx = laporanValid + outlierMad + i + 1;
      reports.push({
        id: `RPT-${codePrefix}-${String(idx).padStart(3, '0')}`,
        waktuLapor: '31 Okt 2026, 07:18',
        hargaRp: basePrice,
        jarakKm: 4.5,
        status: 'radius_invalid',
        keterangan: 'Jarak 4.5 km dari koordinat pasar (> batas radius 3 km)',
      });
    }

    // D. Duplikasi Perangkat
    for (let i = 0; i < duplikasiPerangkat; i++) {
      const idx = laporanValid + outlierMad + diLuarRadius + i + 1;
      reports.push({
        id: `RPT-${codePrefix}-${String(idx).padStart(3, '0')}`,
        waktuLapor: '31 Okt 2026, 07:05',
        hargaRp: basePrice,
        jarakKm: 1.0,
        status: 'duplicate',
        keterangan: 'Duplikasi perangkat: Perangkat telah mengirim suara hari ini',
      });
    }

    auditReports = reports;
  }

  // 2. Histogram Bins
  let histogramBins: Array<{ price: number; label: string; count: number; isMedian?: boolean }> = [];
  if (summary.id === 'psr-bekasikab-01' && normKey === 'cabai_rawit_merah') {
    histogramBins = [
      { price: 47000, label: '47.000', count: 1 },
      { price: 47500, label: '47.500', count: 0 },
      { price: 48000, label: '48.000', count: 1 },
      { price: 48500, label: '48.500', count: 2 },
      { price: 49000, label: '49.000', count: 2 },
      { price: 49500, label: '49.500', count: 4, isMedian: true },
      { price: 50000, label: '50.000', count: 2 },
      { price: 50500, label: '50.500', count: 1 },
      { price: 51000, label: '51.000', count: 1 },
      { price: 51500, label: '51.500', count: 0 },
      { price: 52000, label: '52.000', count: 1 },
    ];
  } else if (laporanValid > 0) {
    const med = commData.hargaWargaRp || cfg.hargaAcuanRp;
    const step = cfg.hargaAcuanRp > 20000 ? 500 : 200;
    histogramBins = [
      { price: med - step * 2, label: (med - step * 2).toLocaleString('id-ID'), count: Math.max(1, Math.floor(laporanValid * 0.15)) },
      { price: med - step, label: (med - step).toLocaleString('id-ID'), count: Math.max(1, Math.floor(laporanValid * 0.25)) },
      { price: med, label: med.toLocaleString('id-ID'), count: Math.max(2, Math.floor(laporanValid * 0.4)), isMedian: true },
      { price: med + step, label: (med + step).toLocaleString('id-ID'), count: Math.max(1, Math.floor(laporanValid * 0.2)) },
    ];
  }

  return {
    market: {
      id: summary.id,
      namaPasar: summary.namaPasar,
      kabupatenKota: summary.kabupatenKota,
      regionId: summary.regionId,
      instansiPengelola: summary.pengelola || `UPTD Pengelola ${summary.namaPasar}`,
    },
    commodity: cfg,
    kpi: {
      laporanMasuk,
      perangkatUnik,
      radiusValid,
      diLuarRadius,
      outlierMad,
      laporanValid,
      statusKuorum,
    },
    hargaWargaRp: commData.hargaWargaRp,
    hargaAcuanRp: cfg.hargaAcuanRp,
    selisihPct: commData.selisihPct,
    histogramBins,
    auditReports,
    quorumCoverage: summary.quorumCoverage,
  };
}

/**
 * Mengambil seluruh grup wilayah (27 Kabupaten/Kota) dengan seluruh 133 pasar binaan di dalamnya.
 * Struktur hirarkis: Provinsi -> Kabupaten/Kota (27) -> Pasar Resmi (133) -> Komoditas (6).
 */
export function getAllRegionConsensusGroups(): RegionConsensusGroup[] {
  const regionKeys = Object.keys(OFFICIAL_MARKETS_BY_REGION).sort();

  return regionKeys.map((rKey) => {
    const dir = OFFICIAL_MARKETS_BY_REGION[rKey];
    const marketSummaries: MarketMultiCommoditySummary[] = dir.markets.map((m, idx) =>
      getOfficialMarketCommoditySummary(m, dir, idx)
    );

    const totalLaporanMasuk = marketSummaries.reduce((acc, m) => acc + m.totalLaporanMasuk, 0);
    const totalLaporanValid = marketSummaries.reduce((acc, m) => acc + m.totalLaporanValid, 0);
    const activeQuorumMarkets = marketSummaries.filter((m) => m.quorumCoverage.reached >= 1).length;
    const highReadinessMarkets = marketSummaries.filter((m) => m.quorumCoverage.reached >= 3).length;

    return {
      regionId: dir.regionId,
      regionName: dir.regionName,
      instansiPengelola: dir.instansiPengelola,
      totalMarkets: marketSummaries.length,
      activeQuorumMarkets,
      highReadinessMarkets,
      totalLaporanMasuk,
      totalLaporanValid,
      markets: marketSummaries,
    };
  });
}

/**
 * Mengambil ringkasan multi-komoditas dari 27 pasar induk acuan.
 */
export function getAllMarketsMultiCommoditySummary(): MarketMultiCommoditySummary[] {
  return MOCK_MARKET_CONSENSUS.map((base) => {
    const coverage = getMarketQuorumCoverage(base.id);
    let totalMasuk = 0;
    let totalValid = 0;
    const commoditiesObj: MarketMultiCommoditySummary['commodities'] = {};

    for (const cfg of COMMODITY_CONSENSUS_CONFIGS) {
      if (cfg.id === 'cabai_rawit_merah') {
        totalMasuk += base.laporanMasuk;
        totalValid += base.laporanValid;
        commoditiesObj[cfg.id] = {
          commodityId: cfg.id,
          commodityName: cfg.name,
          satuan: cfg.satuan,
          hargaWargaRp: base.hargaWargaRp,
          hargaAcuanRp: cfg.hargaAcuanRp,
          selisihPct: base.selisihPct,
          statusKuorum: base.statusKuorum,
          laporanValid: base.laporanValid,
          laporanMasuk: base.laporanMasuk,
        };
      } else {
        const item = MARKET_COMMODITY_MATRIX[base.id]?.[cfg.id];
        const masuk = item?.masuk || 0;
        const valid = item?.valid || 0;
        const harga = item?.harga || null;
        const status = item?.status || 'belum_ada';
        const selisih =
          harga && status === 'tercapai'
            ? Number((((harga - cfg.hargaAcuanRp) / cfg.hargaAcuanRp) * 100).toFixed(1))
            : null;

        totalMasuk += masuk;
        totalValid += valid;
        commoditiesObj[cfg.id] = {
          commodityId: cfg.id,
          commodityName: cfg.name,
          satuan: cfg.satuan,
          hargaWargaRp: harga,
          hargaAcuanRp: cfg.hargaAcuanRp,
          selisihPct: selisih,
          statusKuorum: status,
          laporanValid: valid,
          laporanMasuk: masuk,
        };
      }
    }

    return {
      id: base.id,
      namaPasar: base.namaPasar,
      kabupatenKota: base.kabupatenKota,
      regionId: base.regionId,
      isAnchorMarket: true,
      totalLaporanMasuk: totalMasuk,
      totalLaporanValid: totalValid,
      quorumCoverage: {
        reached: coverage.reached,
        total: coverage.total,
        percentage: Math.round((coverage.reached / coverage.total) * 100),
      },
      commodities: commoditiesObj,
    };
  });
}
