import { SupplyStatus } from '../types/domain';

export interface ApprovedCitizenReport {
  id: string;
  ticketCode: string;
  regionId: string;
  regionName: string;
  commodityId: string;
  commodityName: string;
  namaPasar: string;
  hargaWargaRp: number;
  hargaResmiRp: number;
  jumlahLaporan: number;
  radiusKm: number;
  statusApproval: 'approved' | 'pending' | 'rejected';
  updatedAt: string;
}

export interface CustomRegionOverride {
  regionId: string;
  commodityId: string;
  pt: number;
  ptMinus7: number;
  ma30?: number;
  mean60?: number;
  stdDev60?: number;
  supplyStatus?: SupplyStatus;
  hargaAcuanRp?: number;
  labelDataset?: string;
}

const CITIZEN_REPORTS_KEY = 'radar_pangan_citizen_reports_v1';
const CSV_OVERRIDE_KEY = 'radar_pangan_csv_overrides_v1';

export const DEFAULT_CITIZEN_REPORTS: ApprovedCitizenReport[] = [
  {
    id: 'CLUST-CRB-01',
    ticketCode: 'RP-2026-CRB09',
    regionId: '32.09',
    regionName: 'Kab. Cirebon',
    commodityId: 'cabai_rawit_merah',
    commodityName: 'Cabai Rawit Merah',
    namaPasar: 'Pasar Sumber & Pasar Kue Weru',
    hargaWargaRp: 79500,
    hargaResmiRp: 78000,
    jumlahLaporan: 16,
    radiusKm: 2.3,
    statusApproval: 'approved',
    updatedAt: '31 Okt 2026, 09:10 WIB',
  },
  {
    id: 'CLUST-BKS-01',
    ticketCode: 'RP-2026-BKS16',
    regionId: '32.16',
    regionName: 'Kab. Bekasi',
    commodityId: 'cabai_rawit_merah',
    commodityName: 'Cabai Rawit Merah',
    namaPasar: 'Pasar Baru Cikarang',
    hargaWargaRp: 49500,
    hargaResmiRp: 48200,
    jumlahLaporan: 18,
    radiusKm: 2.1,
    statusApproval: 'approved',
    updatedAt: '31 Okt 2026, 08:30 WIB',
  },
  {
    id: 'CLUST-BDG-02',
    ticketCode: 'RP-2026-BDG73',
    regionId: '32.73',
    regionName: 'Kota Bandung',
    commodityId: 'bawang_merah',
    commodityName: 'Bawang Merah',
    namaPasar: 'Pasar Induk Caringin',
    hargaWargaRp: 33000,
    hargaResmiRp: 32000,
    jumlahLaporan: 24,
    radiusKm: 1.8,
    statusApproval: 'approved',
    updatedAt: '31 Okt 2026, 09:15 WIB',
  },
  {
    id: 'CLUST-BGR-03',
    ticketCode: 'RP-2026-BGR01',
    regionId: '32.01',
    regionName: 'Kab. Bogor',
    commodityId: 'beras_medium',
    commodityName: 'Beras Medium',
    namaPasar: 'Pasar Cibinong',
    hargaWargaRp: 14200,
    hargaResmiRp: 13800,
    jumlahLaporan: 12,
    radiusKm: 2.5,
    statusApproval: 'pending',
    updatedAt: '31 Okt 2026, 07:45 WIB',
  },
  {
    id: 'CLUST-GRT-04',
    ticketCode: 'RP-2026-GRT05',
    regionId: '32.05',
    regionName: 'Kab. Garut',
    commodityId: 'cabai_rawit_merah',
    commodityName: 'Cabai Rawit Merah',
    namaPasar: 'Pasar Guntur Ciawitali',
    hargaWargaRp: 43500,
    hargaResmiRp: 44100,
    jumlahLaporan: 14,
    radiusKm: 1.9,
    statusApproval: 'approved',
    updatedAt: '31 Okt 2026, 08:50 WIB',
  },
];

// Preset Skenario Konkret 60 Hari Kabupaten Cirebon sesuai TECHNICAL_PROJECT_CONTEXT.md §4.D
export const CIREBON_60D_DEMO_OVERRIDE: CustomRegionOverride = {
  regionId: '32.09',
  commodityId: 'cabai_rawit_merah',
  pt: 78000,
  ptMinus7: 68000,
  ma30: 65000,
  mean60: 58000,
  stdDev60: 7500,
  supplyStatus: 'defisit',
  hargaAcuanRp: 57000,
  labelDataset: 'Dataset Uji 60 Hari Kab. Cirebon (TECHNICAL_PROJECT_CONTEXT §4.D)',
};

export function loadCitizenReports(): ApprovedCitizenReport[] {
  if (typeof window === 'undefined') return DEFAULT_CITIZEN_REPORTS;
  try {
    const raw = window.localStorage.getItem(CITIZEN_REPORTS_KEY);
    if (!raw) return DEFAULT_CITIZEN_REPORTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CITIZEN_REPORTS;
  } catch {
    return DEFAULT_CITIZEN_REPORTS;
  }
}

export function saveCitizenReports(reports: ApprovedCitizenReport[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CITIZEN_REPORTS_KEY, JSON.stringify(reports));
    window.dispatchEvent(new Event('radar-pangan-storage-update'));
  } catch (err) {
    console.warn('Failed to save citizen reports:', err);
  }
}

export function resetCitizenReports(): ApprovedCitizenReport[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CITIZEN_REPORTS_KEY);
    window.dispatchEvent(new Event('radar-pangan-storage-update'));
  }
  return DEFAULT_CITIZEN_REPORTS;
}

export function loadCsvOverrides(): Record<string, CustomRegionOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CSV_OVERRIDE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function saveCsvOverrides(overrides: Record<string, CustomRegionOverride>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CSV_OVERRIDE_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new Event('radar-pangan-storage-update'));
  } catch (err) {
    console.warn('Failed to save CSV overrides:', err);
  }
}

export function clearCsvOverrides(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CSV_OVERRIDE_KEY);
  window.dispatchEvent(new Event('radar-pangan-storage-update'));
}
