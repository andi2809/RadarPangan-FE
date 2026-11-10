/**
 * Distribusi Harga Laporan Warga — lapisan logika murni (tanpa React).
 *
 * Prinsip:
 * - Backend adalah sumber kebenaran untuk validitas laporan, status outlier,
 *   radius, duplikasi perangkat, dan status kuorum. Modul ini TIDAK menjalankan
 *   ulang aturan validasi; ia hanya membaca flag yang dikirim backend.
 * - Field yang tidak dikirim backend direpresentasikan sebagai `null`
 *   ("tidak dilaporkan"), bukan 0, agar UI tidak menampilkan angka palsu.
 * - Laporan di luar periode aktif (hari ini, Asia/Jakarta) diperlakukan sebagai
 *   arsip dan tidak pernah masuk kuorum, histogram, maupun median.
 */

export const QUORUM_MIN = 10;
export const RADIUS_MAX_KM = 3;
const TZ = 'Asia/Jakarta';

/** Bentuk item dari GET /api/v1/laporan-warga/sekitar (field opsional = belum tentu dikirim backend). */
export interface CitizenReportApiItem {
  id: string;
  region_id: string;
  commodity_id: string;
  harga_rp: number;
  nama_pasar: string;
  lat?: number;
  lng?: number;
  created_at: string;
  verified?: boolean;
  status_konsensus?: string;
  // Field validasi yang didukung bila backend mengirimkannya:
  device_id?: string;
  reporter_id?: string;
  status_validasi?: string;
  is_outlier?: boolean;
  is_duplicate?: boolean;
  dalam_radius?: boolean | null;
  median_konsensus_rp?: number | null;
}

export interface MarketRef {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
}

/** `null` = backend tidak melaporkan metrik tersebut. */
export interface ValidationBreakdown {
  receivedActive: number;
  uniqueDevices: number | null;
  duplicates: number | null;
  withinRadius: number | null;
  outsideRadius: number | null;
  radiusUnverified: number | null;
  anomalies: number | null;
  rejectedOther: number;
  valid: number;
  historical: number;
}

export interface PriceStats {
  prices: number[];
  median: number;
  min: number;
  max: number;
}

export type DistributionState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'no-market' }
  | { kind: 'no-active-reports'; breakdown: ValidationBreakdown }
  | { kind: 'expired-only'; breakdown: ValidationBreakdown }
  | { kind: 'no-valid-reports'; breakdown: ValidationBreakdown }
  | {
      kind: 'insufficient-quorum';
      breakdown: ValidationBreakdown;
      stats: PriceStats;
      /** true bila ≥10 laporan valid namun backend belum menetapkan konsensus. */
      awaitingBackendConfirmation: boolean;
    }
  | {
      kind: 'quorum-reached';
      breakdown: ValidationBreakdown;
      stats: PriceStats;
      medianSource: 'backend' | 'computed';
    };

/** Status konsensus dari backend yang dianggap "kuorum terpenuhi". */
const BACKEND_QUORUM_REACHED = new Set([
  'KUORUM_TERPENUHI',
  'KONSENSUS_TERCAPAI',
  'VERIFIED',
  'VERIFIED_NORMAL',
  'VERIFIED_SPIKE',
]);

/** Kunci tanggal YYYY-MM-DD dalam zona Asia/Jakarta. */
export function jakartaDateKey(value: Date | string): string | null {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function formatJakartaLongDate(value: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TZ,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value);
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Hanya laporan untuk pasar + komoditas yang sama persis. Tidak pernah mencampur pasar. */
export function filterReportsForMarket(
  reports: CitizenReportApiItem[],
  market: MarketRef,
  commodityId: string
): CitizenReportApiItem[] {
  const target = normalize(market.name);
  return reports.filter(
    (r) =>
      r.commodity_id === commodityId &&
      r.region_id === market.regionId &&
      normalize(r.nama_pasar || '') === target
  );
}

type Rejection = 'duplicate' | 'outside' | 'unverified-location' | 'anomaly' | 'other' | null;

function rejectionOf(r: CitizenReportApiItem): Rejection {
  const sv = (r.status_validasi || '').toUpperCase();
  if (r.is_duplicate || sv === 'DUPLIKAT' || sv === 'DUPLICATE') return 'duplicate';
  if (r.dalam_radius === false || sv === 'DI_LUAR_RADIUS') return 'outside';
  if (r.dalam_radius === null || sv === 'LOKASI_TIDAK_TERVERIFIKASI') return 'unverified-location';
  if (r.is_outlier || sv === 'OUTLIER' || sv === 'ANOMALI') return 'anomaly';
  if (r.verified !== true) return 'other';
  return null;
}

/**
 * Menurunkan state UI dari laporan yang SUDAH difilter untuk satu pasar + komoditas.
 * Tidak menangani loading / error / no-market (itu urusan hook).
 */
export function deriveDistributionState(
  reports: CitizenReportApiItem[],
  todayKey: string
): Exclude<DistributionState, { kind: 'loading' } | { kind: 'error' } | { kind: 'no-market' }> {
  const active = reports.filter((r) => jakartaDateKey(r.created_at) === todayKey);
  const historical = reports.length - active.length;

  const has = (pred: (r: CitizenReportApiItem) => boolean) => active.some(pred);
  const reportsDevice = has((r) => Boolean(r.device_id || r.reporter_id));
  const reportsDuplicate = has((r) => r.is_duplicate !== undefined || Boolean(r.status_validasi));
  const reportsRadius = has((r) => r.dalam_radius !== undefined || Boolean(r.status_validasi));
  const reportsOutlier = has((r) => r.is_outlier !== undefined || Boolean(r.status_validasi));

  const counts = { duplicate: 0, outside: 0, 'unverified-location': 0, anomaly: 0, other: 0 };
  const validReports: CitizenReportApiItem[] = [];
  for (const r of active) {
    const rej = rejectionOf(r);
    if (rej) counts[rej] += 1;
    else validReports.push(r);
  }

  const breakdown: ValidationBreakdown = {
    receivedActive: active.length,
    uniqueDevices: reportsDevice
      ? new Set(active.map((r) => r.device_id || r.reporter_id).filter(Boolean)).size
      : null,
    duplicates: reportsDuplicate ? counts.duplicate : null,
    withinRadius: reportsRadius
      ? active.length - counts.outside - counts['unverified-location']
      : null,
    outsideRadius: reportsRadius ? counts.outside : null,
    radiusUnverified: reportsRadius ? counts['unverified-location'] : null,
    anomalies: reportsOutlier ? counts.anomaly : null,
    rejectedOther: counts.other,
    valid: validReports.length,
    historical,
  };

  if (active.length === 0) {
    return historical > 0
      ? { kind: 'expired-only', breakdown }
      : { kind: 'no-active-reports', breakdown };
  }
  if (validReports.length === 0) return { kind: 'no-valid-reports', breakdown };

  const prices = validReports.map((r) => r.harga_rp).sort((a, b) => a - b);
  const backendMedian = validReports.find((r) => typeof r.median_konsensus_rp === 'number')
    ?.median_konsensus_rp;
  const stats: PriceStats = {
    prices,
    median: backendMedian ?? median(prices),
    min: prices[0],
    max: prices[prices.length - 1],
  };

  const backendSaysReached = validReports.some((r) =>
    BACKEND_QUORUM_REACHED.has((r.status_konsensus || '').toUpperCase())
  );

  if (validReports.length >= QUORUM_MIN && backendSaysReached) {
    return {
      kind: 'quorum-reached',
      breakdown,
      stats,
      medianSource: typeof backendMedian === 'number' ? 'backend' : 'computed',
    };
  }

  return {
    kind: 'insufficient-quorum',
    breakdown,
    stats,
    awaitingBackendConfirmation: validReports.length >= QUORUM_MIN,
  };
}

export interface HistogramBin {
  from: number;
  to: number;
  count: number;
  containsMedian: boolean;
}

function niceStep(raw: number): number {
  const candidates = [100, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000];
  return candidates.find((c) => c >= raw) ?? Math.ceil(raw / 50000) * 50000;
}

/**
 * Interval konsisten dari data aktual: jumlah kelas ≈ √n + 1 (3–8 kelas),
 * lebar dibulatkan ke angka rupiah yang mudah dibaca. Kelas dibatasi rentang
 * data sehingga tidak ada interval kosong di tepi.
 */
export function buildHistogram(prices: number[], med: number): HistogramBin[] {
  if (prices.length === 0) return [];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) {
    return [{ from: min, to: min, count: prices.length, containsMedian: true }];
  }
  const k = Math.min(8, Math.max(3, Math.ceil(Math.sqrt(prices.length)) + 1));
  const step = niceStep((max - min) / k);
  const start = Math.floor(min / step) * step;
  const binCount = Math.floor((max - start) / step) + 1;
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => ({
    from: start + i * step,
    to: start + (i + 1) * step,
    count: 0,
    containsMedian: false,
  }));
  for (const p of prices) {
    const idx = Math.min(binCount - 1, Math.floor((p - start) / step));
    bins[idx].count += 1;
  }
  const medIdx = Math.min(binCount - 1, Math.max(0, Math.floor((med - start) / step)));
  bins[medIdx].containsMedian = true;
  return bins;
}

export const formatRp = (v: number) => `Rp${Math.round(v).toLocaleString('id-ID')}`;


/**
 * Fallback generator untuk lingkungan lokal/offline saat NEXT_PUBLIC_ENABLE_MOCK_FALLBACK aktif.
 * Memetakan konsensus 27 pasar Jawa Barat ke dalam laporan individual berstempel hari ini.
 */
export function generateMockCitizenReports(commodityId = 'cabai_rawit_merah'): CitizenReportApiItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MOCK_MARKET_CONSENSUS } = require('../data/mock/marketConsensus');
  const nowIso = new Date().toISOString();
  const yesterdayIso = new Date(Date.now() - 86400000 * 2).toISOString();
  const reports: CitizenReportApiItem[] = [];

  for (const item of MOCK_MARKET_CONSENSUS) {
    if (item.laporanMasuk === 0) {
      // 1 pasar (misal Sumedang) diberi laporan kedaluwarsa untuk menguji State E (Expired Only)
      if (item.regionId === '32.11') {
        reports.push({
          id: `cr-exp-${item.id}-01`,
          region_id: item.regionId,
          commodity_id: commodityId,
          harga_rp: 48000,
          nama_pasar: item.namaPasar,
          created_at: yesterdayIso,
          verified: true,
          status_konsensus: 'EXPIRED',
          device_id: `dev-exp-01`,
        });
      }
      continue;
    }

    const baseMed = item.hargaWargaRp || 48200;
    const isQuorum = item.statusKuorum === 'tercapai';

    // Harga variasi di sekitar median
    const deltaTemplates = [
      -2500, -1500, -1000, -500, -500, -300, 0, 0, 0, 500, 500, 1000, 1500, 2500, 3500, 4000,
    ];

    // Laporan valid
    for (let i = 0; i < item.laporanValid; i++) {
      const delta = deltaTemplates[i % deltaTemplates.length] || 0;
      reports.push({
        id: `cr-${item.id}-v${i + 1}`,
        region_id: item.regionId,
        commodity_id: commodityId,
        harga_rp: baseMed + delta,
        nama_pasar: item.namaPasar,
        created_at: nowIso,
        verified: true,
        status_konsensus: isQuorum ? 'VERIFIED_SPIKE' : 'PENDING_QUORUM',
        status_validasi: 'VALID',
        dalam_radius: true,
        is_outlier: false,
        is_duplicate: false,
        device_id: `dev-${item.id}-${i + 1}`,
        reporter_id: `rep-${item.id}-${i + 1}`,
        median_konsensus_rp: isQuorum ? baseMed : null,
      });
    }

    // Outlier MAD
    for (let i = 0; i < item.outlierMad; i++) {
      reports.push({
        id: `cr-${item.id}-out${i + 1}`,
        region_id: item.regionId,
        commodity_id: commodityId,
        harga_rp: Math.round(baseMed * 1.35), // anomali 35% di atas median
        nama_pasar: item.namaPasar,
        created_at: nowIso,
        verified: false,
        status_konsensus: 'OUTLIER',
        status_validasi: 'OUTLIER',
        dalam_radius: true,
        is_outlier: true,
        is_duplicate: false,
        device_id: `dev-${item.id}-out-${i + 1}`,
      });
    }

    // Di luar radius
    const luarRadiusCount = Math.max(0, item.laporanMasuk - item.radiusValid);
    for (let i = 0; i < luarRadiusCount; i++) {
      reports.push({
        id: `cr-${item.id}-rad${i + 1}`,
        region_id: item.regionId,
        commodity_id: commodityId,
        harga_rp: baseMed + 500,
        nama_pasar: item.namaPasar,
        created_at: nowIso,
        verified: false,
        status_konsensus: 'REJECTED_RADIUS',
        status_validasi: 'DI_LUAR_RADIUS',
        dalam_radius: false,
        is_outlier: false,
        is_duplicate: false,
        device_id: `dev-${item.id}-rad-${i + 1}`,
      });
    }

    // Duplikasi perangkat
    const duplikatCount = Math.max(0, item.laporanMasuk - item.perangkatUnik);
    for (let i = 0; i < duplikatCount; i++) {
      reports.push({
        id: `cr-${item.id}-dup${i + 1}`,
        region_id: item.regionId,
        commodity_id: commodityId,
        harga_rp: baseMed,
        nama_pasar: item.namaPasar,
        created_at: nowIso,
        verified: false,
        status_konsensus: 'REJECTED_DUPLICATE',
        status_validasi: 'DUPLIKAT',
        dalam_radius: true,
        is_outlier: false,
        is_duplicate: true,
        device_id: `dev-${item.id}-1`, // ID sama dengan laporan valid pertama
      });
    }
  }

  return reports;
}
