/**
 * Radar Pangan API Client (Client-Side & Server-Side Compatible)
 * Terhubung langsung ke Backend FastAPI: https://radar-pangan-server.vercel.app
 * Memenuhi kontrak data FE sesuai dokumen 'KONTRAK-FE.md' dan 'HANDOFF_ANDI_KEPUTUSAN.md'.
 * Dilengkapi dengan auto-timeout (4 detik) dan graceful fallback ke data offline lokal.
 */

import commoditiesData from '../data/mock/commodities.json';
import regionsData from '../data/mock/regions.json';
import telemetryData from '../data/mock/telemetry.json';
import { Commodity, Region, PriceStatus, DataSource, PriceType } from '../types/domain';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || 'https://radar-pangan-server.vercel.app';

export interface ApiMeta {
  tanggal_data?: string;
  diperbarui_pada?: string;
  sumber?: string[];
  is_simulasi?: boolean;
  mode_data?: string;
  peringatan_kualitas?: string[];
  cakupan_pasar?: string;
  cakupan_daerah?: string;
}

export interface EnvelopeResponse<T> {
  ok: boolean;
  data: T;
  meta?: ApiMeta;
}

export interface StatusPetaItemApi {
  region_id: string;
  region_name: string;
  commodity_id: string;
  harga_aktual_rp: number;
  harga_prediksi_h7_rp: number;
  harga_acuan_rp: number;
  jenis_acuan: string;
  selisih_persen: number;
  status: PriceStatus;
  ews_score: number;
  status_neraca: 'surplus' | 'seimbang' | 'defisit';
  sumber?: DataSource;
  jenis_harga?: PriceType;
}

export interface MetaKonsistensiItem {
  commodity_id: string;
  nama: string;
  harga_pihps_pasar: number;
  harga_sp2kp_acuan: number;
  selisih_rp: number;
  selisih_persen: number;
  keterangan: string;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * 1. GET /api/v1/publik/ringkasan-landing
 */
export async function getRingkasanLanding(): Promise<EnvelopeResponse<any>> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/publik/ringkasan-landing`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API Client] Ringkasan Landing offline, using fallback:', err);
  }

  return {
    ok: true,
    data: {
      total_kabkota: 27,
      kestabilan_wilayah_pct: 78.5,
      jumlah_aman: 18,
      jumlah_waspada: 6,
      jumlah_kritis: 3,
      komoditas_sorotan: 'Cabai Rawit Merah',
    },
    meta: {
      sumber: ['PIHPS BI', 'SP2KP Kemendag'],
      mode_data: 'fallback-cache',
      peringatan_kualitas: [],
      cakupan_pasar: '9/27 Kab/Kota',
      cakupan_daerah: '27/27 Kab/Kota',
    },
  };
}

/**
 * 2. GET /api/v1/komoditas
 */
export async function getKomoditas(): Promise<EnvelopeResponse<Commodity[]>> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/komoditas`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json;
      }
    }
  } catch (err) {
    console.warn('[API Client] Komoditas API offline, using fallback:', err);
  }

  return {
    ok: true,
    data: commoditiesData as unknown as Commodity[],
    meta: {
      sumber: ['PIHPS BI', 'SP2KP Kemendag'],
      mode_data: 'fallback-cache',
      peringatan_kualitas: [],
    },
  };
}

/**
 * 3. GET /api/v1/wilayah
 */
export async function getWilayah(): Promise<EnvelopeResponse<Region[]>> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/wilayah`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json;
      }
    }
  } catch (err) {
    console.warn('[API Client] Wilayah API offline, using fallback:', err);
  }

  return {
    ok: true,
    data: regionsData as unknown as Region[],
    meta: {
      sumber: ['Kemendagri', 'BPS'],
      mode_data: 'fallback-cache',
    },
  };
}

/**
 * 4. GET /api/v1/peta/status?komoditas=...&layer=...&sumber=...
 * Mendukung filter sumber='pihps' (9 pasar riil) atau sumber='sp2kp' (27 pemantauan daerah)
 */
export async function getPetaStatus(params?: {
  komoditas?: string;
  layer?: 'aktual' | 'h7';
  sumber?: DataSource;
}): Promise<EnvelopeResponse<StatusPetaItemApi[]>> {
  const kom = params?.komoditas || 'cabai_rawit_merah';
  const lay = params?.layer || 'aktual';
  const src = params?.sumber || 'pihps';

  try {
    const url = `${API_BASE_URL}/api/v1/peta/status?komoditas=${encodeURIComponent(
      kom
    )}&layer=${encodeURIComponent(lay)}&sumber=${encodeURIComponent(src)}`;
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        return json;
      }
    }
  } catch (err) {
    console.warn('[API Client] Peta Status API offline, using fallback:', err);
  }

  // Fallback: Olah dari telemetry local
  const rawComm = (telemetryData as Record<string, Record<string, any>>)[kom] || {};
  const pihpsActiveIds = new Set(['32.73', '32.75', '32.76', '32.01', '32.16', '32.05', '32.12', '32.13', '32.71']);

  const fallbackData: StatusPetaItemApi[] = (regionsData as Region[]).map((r) => {
    const t = rawComm[r.id];
    const isPihpsCovered = pihpsActiveIds.has(r.id);

    // Jika filter PIHPS dan wilayah di luar 9 kab/kota, kembalikan status tidak_ada_data / netral
    let status: PriceStatus = t?.currentPrice?.status || 'aman';
    if (src === 'pihps' && !isPihpsCovered) {
      status = 'tidak_ada_data';
    }

    return {
      region_id: r.id,
      region_name: r.name,
      commodity_id: kom,
      harga_aktual_rp: t?.currentPrice?.hargaAktualRp || 13500,
      harga_prediksi_h7_rp: t?.predictionH7?.hargaPrediksiH7Rp || 13700,
      harga_acuan_rp: t?.currentPrice?.hargaAcuanRp || 13500,
      jenis_acuan: 'HET',
      selisih_persen: t?.currentPrice?.selisihPersen || 0,
      status: status,
      ews_score: t?.predictionH7?.ewsScore || 25,
      status_neraca: (t?.supply?.statusNeraca as any) || 'seimbang',
      sumber: src,
      jenis_harga: src === 'pihps' ? 'pasar' : 'acuan',
    };
  });

  return {
    ok: true,
    data: fallbackData,
    meta: {
      sumber: src === 'pihps' ? ['PIHPS BI (Harga Pasar)'] : ['SP2KP Kemendag (Pemantauan Daerah)'],
      mode_data: 'fallback-cache',
      cakupan_pasar: '9/27 Titik Pantau',
      cakupan_daerah: '27/27 Wilayah Lengkap',
      peringatan_kualitas:
        src === 'pihps'
          ? ['PIHPS mencakup 9 wilayah utama pasar bebas. 18 wilayah lain belum memiliki koresponden pasar BI.']
          : ['SP2KP mencakup 27 wilayah, namun komoditas beras/minyakita cenderung konvergen pada acuan HET.'],
    },
  };
}

/**
 * 5. GET /api/v1/wilayah/{kode}/ringkasan?komoditas=...
 */
export async function getWilayahRingkasan(
  kodeWilayah: string,
  komoditas = 'beras_medium'
): Promise<EnvelopeResponse<any>> {
  try {
    const url = `${API_BASE_URL}/api/v1/wilayah/${encodeURIComponent(
      kodeWilayah
    )}/ringkasan?komoditas=${encodeURIComponent(komoditas)}`;
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[API Client] Ringkasan wilayah ${kodeWilayah} offline, using fallback:`, err);
  }

  const rawComm = (telemetryData as Record<string, Record<string, any>>)[komoditas] || {};
  const t = rawComm[kodeWilayah];

  return {
    ok: true,
    data: t || null,
    meta: {
      sumber: ['PIHPS BI', 'Bapanas'],
      mode_data: 'fallback-cache',
    },
  };
}

/**
 * 6. POST /api/v1/laporan-warga (Crowdsource)
 */
export async function submitLaporanWarga(payload: {
  region_id: string;
  commodity_id: string;
  harga_rp: number;
  nama_pasar: string;
  lat?: number;
  lng?: number;
  bukti_foto_url?: string;
}): Promise<EnvelopeResponse<any>> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/laporan-warga`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API Client] Submit laporan warga API offline, using local response:', err);
  }

  return {
    ok: true,
    data: {
      id: `rep-local-${Date.now()}`,
      status: 'DITERIMA',
      pesan: 'Laporan tercatat di sistem audit konsensus crowdsource EWS Jawa Barat.',
    },
    meta: {
      is_simulasi: true,
    },
  };
}

/**
 * 7. GET /api/v1/meta/konsistensi (PIHPS vs SP2KP)
 */
export async function getMetaKonsistensi(): Promise<EnvelopeResponse<MetaKonsistensiItem[]>> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/meta/konsistensi`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API Client] Meta konsistensi API offline, using fallback:', err);
  }

  return {
    ok: true,
    data: [
      {
        commodity_id: 'beras_medium',
        nama: 'Beras Medium',
        harga_pihps_pasar: 15650,
        harga_sp2kp_acuan: 13500,
        selisih_rp: 2150,
        selisih_persen: 15.9,
        keterangan: 'Harga pasar PIHPS berada di atas HET; SP2KP menempel HET',
      },
      {
        commodity_id: 'cabai_rawit_merah',
        nama: 'Cabai Rawit Merah',
        harga_pihps_pasar: 48200,
        harga_sp2kp_acuan: 47800,
        selisih_rp: 400,
        selisih_persen: 0.83,
        keterangan: 'Kedua sumber bergerak dinamis dan konsisten',
      },
      {
        commodity_id: 'minyakita',
        nama: 'Minyakita vs Curah',
        harga_pihps_pasar: 22350,
        harga_sp2kp_acuan: 15700,
        selisih_rp: 6650,
        selisih_persen: 42.3,
        keterangan: 'PIHPS memantau minyak goreng curah pasar, SP2KP memantau Minyakita HET',
      },
    ],
  };
}
