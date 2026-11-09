'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Calendar,
  RotateCw,
} from 'lucide-react';

const numberFormat = new Intl.NumberFormat('id-ID');
const LAST_UPDATED_TEXT = '24 Okt 2026, 09:27 WIB';

export interface AuditReportItem {
  id: string;
  waktuLapor: string;
  hargaRp: number;
  jarakKm: number;
  status: 'valid' | 'outlier' | 'radius_invalid' | 'duplicate';
  keterangan: string;
}

// 18 Individual Citizen Reports for Pasar Baru Cikarang (Cabai Rawit Merah)
// Exactly matching the math, counts, and distribution in the design brief:
// 18 Total Reports:
// - 1 Duplikat Perangkat ditolak -> 17 Perangkat Unik
// - 1 Di Luar Radius (> 3 km) ditolak -> 16 Dalam Radius
// - 1 Outlier MAD (> 10% deviasi) dikeluarkan -> 15 Laporan Valid
// 15 Laporan Valid: median = Rp49.500 (Kuorum Tercapai 15/10)
const MOCK_AUDIT_REPORTS: AuditReportItem[] = [
  {
    id: 'RPT-CKR-001',
    waktuLapor: '24 Okt 2026, 09:14',
    hargaRp: 49500,
    jarakKm: 1.2,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-002',
    waktuLapor: '24 Okt 2026, 09:02',
    hargaRp: 50000,
    jarakKm: 0.8,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-003',
    waktuLapor: '24 Okt 2026, 08:57',
    hargaRp: 49000,
    jarakKm: 1.9,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-004',
    waktuLapor: '24 Okt 2026, 08:41',
    hargaRp: 56000,
    jarakKm: 2.1,
    status: 'outlier',
    keterangan: 'Deviasi +13,1% dari median (> 10%)',
  },
  {
    id: 'RPT-CKR-005',
    waktuLapor: '24 Okt 2026, 08:37',
    hargaRp: 48500,
    jarakKm: 0.6,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-006',
    waktuLapor: '24 Okt 2026, 08:30',
    hargaRp: 49500,
    jarakKm: 1.4,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-007',
    waktuLapor: '24 Okt 2026, 08:24',
    hargaRp: 50500,
    jarakKm: 2.5,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-008',
    waktuLapor: '24 Okt 2026, 08:18',
    hargaRp: 49500,
    jarakKm: 0.4,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-009',
    waktuLapor: '24 Okt 2026, 08:11',
    hargaRp: 48000,
    jarakKm: 1.7,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-010',
    waktuLapor: '24 Okt 2026, 08:05',
    hargaRp: 51000,
    jarakKm: 2.8,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-011',
    waktuLapor: '24 Okt 2026, 07:58',
    hargaRp: 49500,
    jarakKm: 1.1,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-012',
    waktuLapor: '24 Okt 2026, 07:49',
    hargaRp: 49000,
    jarakKm: 0.9,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-013',
    waktuLapor: '24 Okt 2026, 07:42',
    hargaRp: 50000,
    jarakKm: 2.2,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-014',
    waktuLapor: '24 Okt 2026, 07:35',
    hargaRp: 52000,
    jarakKm: 1.6,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-015',
    waktuLapor: '24 Okt 2026, 07:28',
    hargaRp: 47000,
    jarakKm: 2.7,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-016',
    waktuLapor: '24 Okt 2026, 07:20',
    hargaRp: 48500,
    jarakKm: 1.5,
    status: 'valid',
    keterangan: 'Masuk radius, dalam rentang wajar',
  },
  {
    id: 'RPT-CKR-017',
    waktuLapor: '24 Okt 2026, 07:12',
    hargaRp: 49000,
    jarakKm: 4.8,
    status: 'radius_invalid',
    keterangan: 'Jarak 4.8 km dari pasar (> 3 km)',
  },
  {
    id: 'RPT-CKR-018',
    waktuLapor: '24 Okt 2026, 07:05',
    hargaRp: 49500,
    jarakKm: 1.0,
    status: 'duplicate',
    keterangan: 'Duplikasi perangkat: Perangkat telah melapor hari ini',
  },
];

// Histogram buckets for 15 valid reports:
// 47.000: 1, 48.000: 1, 48.500: 2, 49.000: 2, 49.500: 4 (median), 50.000: 2, 50.500: 1, 51.000: 1, 52.000: 1
const HISTOGRAM_BINS = [
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

export default function DetailLaporanPasarPage() {
  const params = useParams();
  const marketId = (params?.marketId as string) || 'psr-bekasikab-01';

  // Filters state
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Cabai Rawit Merah (kg)');
  const [tableFilter, setTableFilter] = useState<'all' | 'valid' | 'outlier' | 'radius_invalid'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Accordion state for 3 verification steps
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setOpenStep(openStep === stepNumber ? null : stepNumber);
  };

  // Filtered reports for individual audit table
  const filteredReports = useMemo(() => {
    if (tableFilter === 'all') return MOCK_AUDIT_REPORTS;
    if (tableFilter === 'valid') return MOCK_AUDIT_REPORTS.filter((r) => r.status === 'valid');
    if (tableFilter === 'outlier') return MOCK_AUDIT_REPORTS.filter((r) => r.status === 'outlier');
    if (tableFilter === 'radius_invalid')
      return MOCK_AUDIT_REPORTS.filter((r) => r.status === 'radius_invalid' || r.status === 'duplicate');
    return MOCK_AUDIT_REPORTS;
  }, [tableFilter]);

  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage]);

  const counts = useMemo(() => {
    return {
      all: MOCK_AUDIT_REPORTS.length, // 18
      valid: MOCK_AUDIT_REPORTS.filter((r) => r.status === 'valid').length, // 15
      outlier: MOCK_AUDIT_REPORTS.filter((r) => r.status === 'outlier').length, // 1
      radius_invalid: MOCK_AUDIT_REPORTS.filter((r) => r.status === 'radius_invalid').length, // 1
      duplicate: MOCK_AUDIT_REPORTS.filter((r) => r.status === 'duplicate').length, // 1
    };
  }, []);

  return (
    <GISLayout>
      {/* Top Header Bar - Matching Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DED8CD] pb-3 text-xs">
        <div className="flex items-center gap-1.5 font-sans">
          <span className="font-extrabold tracking-wider text-[#67151D]">RADAR PANGAN</span>
          <span className="text-[#898277]">|</span>
          <span className="text-[#706B62]">Konsol Analisis · Provinsi Jawa Barat</span>
        </div>
        <div className="mt-1 sm:mt-0 text-[#706B62] flex items-center gap-2">
          <span>
            Periode aktif: <strong className="text-[#24231F]">Hari ini</strong>
          </span>
          <span className="text-[#DED8CD]">|</span>
          <span>
            Diperbarui: <strong className="text-[#24231F]">{LAST_UPDATED_TEXT}</strong>
          </span>
        </div>
      </div>

      {/* Back Button & Main Header */}
      <section className="space-y-3 pt-1">
        <Link
          href="/dashboard/laporan-warga"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#67151D] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Daftar Pasar</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#67151D]">
              VALIDASI LAPORAN WARGA
            </span>
            <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24231F]">
              Detail Laporan Pasar Baru Cikarang
            </h1>
            <p className="mt-1 text-xs text-[#706B62]">
              Kabupaten Bekasi · Laporan hari ini (24 Okt 2026)
            </p>
          </div>

          <div className="w-full sm:w-56">
            <label className="mb-1 block text-[11px] font-bold text-[#706B62]">
              Komoditas
            </label>
            <div className="relative">
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D]"
              >
                <option value="Cabai Rawit Merah (kg)">Cabai Rawit Merah (kg)</option>
                <option value="Beras Medium (kg)">Beras Medium (kg)</option>
                <option value="Bawang Merah (kg)">Bawang Merah (kg)</option>
                <option value="Telur Ayam Ras (kg)">Telur Ayam Ras (kg)</option>
                <option value="Minyak Kemasan (liter)">Minyak Kemasan (liter)</option>
                <option value="Minyak Curah (liter)">Minyak Curah (liter)</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#706B62]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7 KPI Stat Metrics in 1 Row - Matching Reference Image */}
      <section className="grid grid-cols-2 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-[#DED8CD] rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm text-xs">
        {/* 1. Laporan masuk */}
        <div className="px-3 py-1 first:pl-0">
          <span className="block text-[11px] text-[#706B62]">Laporan masuk</span>
          <strong className="mt-1 block text-2xl font-black text-[#B91C1C]">18</strong>
        </div>

        {/* 2. Perangkat unik */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Perangkat unik</span>
          <strong className="mt-1 block text-2xl font-black text-[#1D4ED8]">17</strong>
        </div>

        {/* 3. Dalam radius <= 3 km */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Dalam radius ≤ 3 km</span>
          <strong className="mt-1 block text-2xl font-black text-[#15803D]">16</strong>
        </div>

        {/* 4. Di luar radius */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Di luar radius</span>
          <strong className="mt-1 block text-2xl font-black text-[#24231F]">1</strong>
        </div>

        {/* 5. Outlier (MAD) */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Outlier (MAD)</span>
          <strong className="mt-1 block text-2xl font-black text-[#B45309]">1</strong>
        </div>

        {/* 6. Laporan valid */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Laporan valid</span>
          <strong className="mt-1 block text-2xl font-black text-[#24231F]">15</strong>
        </div>

        {/* 7. Status kuorum */}
        <div className="px-3 py-1 last:pr-0 col-span-2 md:col-span-1">
          <span className="block text-[11px] text-[#706B62]">Status kuorum</span>
          <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#E3F0E7] px-3 py-1 text-xs font-bold text-[#15803D]">
            <CheckCircle2 size={13} />
            <span>Tercapai (15 / 10)</span>
          </div>
        </div>
      </section>

      {/* Middle Section: 2 Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Konsensus Harga Warga & Alur Pemeriksaan (~35% width) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Konsensus Harga Warga */}
          <div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#24231F]">
                Konsensus Harga Warga
              </h3>
              <p className="mt-0.5 text-xs text-[#706B62]">
                Hasil setelah melalui 3 saringan otomatis.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-black tracking-tight text-[#67151D]">
                Rp49.500<span className="text-sm font-normal text-[#706B62]">/kg</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F0E7] px-2.5 py-0.5 text-xs font-bold text-[#15803D]">
                <CheckCircle2 size={12} />
                <span>Valid</span>
              </span>
            </div>

            <div className="border-t border-[#F0ECE4] pt-3 space-y-2.5 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-[#706B62]">Harga acuan pemerintah (HET/HAP)</span>
                <strong className="font-mono text-[#24231F]">Rp48.200 /kg</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#706B62]">Selisih terhadap acuan</span>
                <strong className="font-mono font-bold text-[#67151D]">+2,7%</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Alur Pemeriksaan Laporan */}
          <div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#24231F]">
                Alur Pemeriksaan Laporan
              </h3>
              <p className="mt-0.5 text-xs text-[#706B62]">
                Setiap laporan melalui 3 saringan berurutan:
              </p>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="rounded-lg border border-[#DED8CD] bg-[#FBF9F4] p-3 text-xs">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleStep(1)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15803D] text-white">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-[#24231F]">
                        1. Satu Perangkat &amp; Radius Pasar
                      </span>
                      <span className="block text-[11px] text-[#706B62]">
                        Lolos: 16 dari 18 laporan
                      </span>
                    </div>
                  </div>
                  {openStep === 1 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openStep === 1 && (
                  <div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740] space-y-1">
                    <p>• Deduplikasi fingerprint: 1 duplikat diblokir.</p>
                    <p>• Geofencing: 1 laporan berjarak &gt; 3 km dari pasar ditolak.</p>
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border border-[#DED8CD] bg-[#FBF9F4] p-3 text-xs">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleStep(2)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15803D] text-white">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-[#24231F]">
                        2. Kuorum Minimal 10 Laporan
                      </span>
                      <span className="block text-[11px] text-[#706B62]">
                        Tercapai: 15 laporan valid
                      </span>
                    </div>
                  </div>
                  {openStep === 2 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openStep === 2 && (
                  <div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740]">
                    <p>Syarat kuorum (≥ 10 laporan terverifikasi) terpenuhi dengan 15 laporan independen.</p>
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className="rounded-lg border border-[#DED8CD] bg-[#FBF9F4] p-3 text-xs">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleStep(3)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15803D] text-white">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-[#24231F]">
                        3. Pembuangan Harga Ekstrem (MAD)
                      </span>
                      <span className="block text-[11px] text-[#706B62]">
                        Dikeluarkan: 1 laporan (deviasi &gt; 10%)
                      </span>
                    </div>
                  </div>
                  {openStep === 3 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openStep === 3 && (
                  <div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740]">
                    <p>1 laporan seharga Rp56.000 terdeteksi menyimpang +13,1% dari median wajar dan dikeluarkan.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notice Callout */}
            <div className="flex items-start gap-2 rounded-lg bg-[#F0F4F8] p-3 text-[11px] text-[#4A4740]">
              <Info size={14} className="mt-0.5 flex-shrink-0 text-[#1D4ED8]" />
              <span>
                Hanya laporan hari ini yang diproses. Laporan sebelum hari ini dinyatakan kedaluwarsa.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Histogram & Audit Table (~65% width) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card 1: Distribusi Harga Laporan Valid (15 laporan) */}
          <div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#24231F]">
              Distribusi Harga Laporan Valid (15 laporan)
            </h3>

            {/* Histogram Chart */}
            <div className="w-full pt-6 pb-2">
              <div className="relative h-44 w-full flex items-end justify-between gap-1 px-8 pb-7 border-b border-[#DED8CD]">
                {/* Y-Axis Label */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-[#706B62] font-sans">
                  Jumlah laporan
                </div>

                {/* Horizontal Guide Lines */}
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className="absolute left-6 right-2 border-b border-[#F0ECE4] pointer-events-none"
                    style={{ bottom: `${28 + level * 22}px` }}
                  >
                    <span className="absolute -left-5 -top-2 text-[9px] text-[#898277] font-mono">
                      {level}
                    </span>
                  </div>
                ))}

                {/* Histogram Bars */}
                {HISTOGRAM_BINS.map((bin) => {
                  const barHeight = bin.count * 22; // 22px per count
                  return (
                    <div
                      key={bin.label}
                      className="relative flex-1 flex flex-col items-center justify-end h-full"
                    >
                      {/* Median Pointer above the 49.500 bar */}
                      {bin.isMedian && (
                        <div className="absolute -top-6 flex flex-col items-center">
                          <span className="rounded-md bg-[#FADBD8] px-2 py-0.5 text-[10px] font-bold text-[#67151D] shadow-sm whitespace-nowrap">
                            Median Rp49.500
                          </span>
                          <div className="h-2 w-px border-l border-dashed border-[#67151D]" />
                        </div>
                      )}

                      {/* Bar */}
                      {bin.count > 0 && (
                        <div
                          className={`w-full max-w-[32px] rounded-t-sm transition-all ${
                            bin.isMedian ? 'bg-[#8A1C24]' : 'bg-[#E8A59E]'
                          }`}
                          style={{ height: `${barHeight}px` }}
                        />
                      )}

                      {/* X-axis tick label */}
                      <span className="absolute -bottom-6 text-[9.5px] font-mono text-[#706B62] whitespace-nowrap">
                        {bin.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sumbu X Caption */}
              <div className="text-center pt-3 text-[11px] font-bold text-[#706B62]">
                Harga (Rp/kg)
              </div>
            </div>
          </div>

          {/* Card 2: Tabel Audit Laporan Individual */}
          <div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-6 border-b border-[#DED8CD] text-xs">
              <button
                type="button"
                onClick={() => {
                  setTableFilter('all');
                  setCurrentPage(1);
                }}
                className={`pb-2.5 font-bold transition ${
                  tableFilter === 'all'
                    ? 'border-b-2 border-[#67151D] text-[#67151D]'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Daftar Laporan ({counts.all})
              </button>

              <button
                type="button"
                onClick={() => {
                  setTableFilter('valid');
                  setCurrentPage(1);
                }}
                className={`pb-2.5 font-bold transition ${
                  tableFilter === 'valid'
                    ? 'border-b-2 border-[#67151D] text-[#67151D]'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Laporan Valid ({counts.valid})
              </button>

              <button
                type="button"
                onClick={() => {
                  setTableFilter('outlier');
                  setCurrentPage(1);
                }}
                className={`pb-2.5 font-bold transition ${
                  tableFilter === 'outlier'
                    ? 'border-b-2 border-[#67151D] text-[#67151D]'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Outlier ({counts.outlier})
              </button>

              <button
                type="button"
                onClick={() => {
                  setTableFilter('radius_invalid');
                  setCurrentPage(1);
                }}
                className={`pb-2.5 font-bold transition ${
                  tableFilter === 'radius_invalid'
                    ? 'border-b-2 border-[#67151D] text-[#67151D]'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Di Luar Radius ({counts.radius_invalid})
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[11px] font-extrabold text-[#706B62]">
                    <th className="px-4 py-2.5">Waktu Lapor</th>
                    <th className="px-4 py-2.5 text-right">Harga (Rp/kg)</th>
                    <th className="px-4 py-2.5 text-center">Status Pemeriksaan</th>
                    <th className="px-4 py-2.5">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] text-xs">
                  {paginatedReports.map((r) => {
                    const isValid = r.status === 'valid';
                    const isOutlier = r.status === 'outlier';
                    const isRadius = r.status === 'radius_invalid';

                    return (
                      <tr key={r.id} className="hover:bg-[#FBF9F4] transition">
                        <td className="px-4 py-3 font-mono text-[#24231F]">
                          {r.waktuLapor}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-[#24231F]">
                          Rp{numberFormat.format(r.hargaRp)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isValid ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F0E7] px-2.5 py-0.5 text-[11px] font-bold text-[#15803D]">
                              <CheckCircle2 size={11} />
                              <span>Valid</span>
                            </span>
                          ) : isOutlier ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-[11px] font-bold text-[#D97706]">
                              <AlertTriangle size={11} />
                              <span>Outlier</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F2] px-2.5 py-0.5 text-[11px] font-bold text-[#DC2626]">
                              <XCircle size={11} />
                              <span>Di Luar Radius</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#706B62]">{r.keterangan}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs">
              <span className="text-[#706B62]">
                Menampilkan {paginatedReports.length} dari {filteredReports.length} laporan
              </span>

              <div className="flex items-center gap-1 self-center sm:self-auto">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded border border-[#DED8CD] text-xs font-bold text-[#706B62] disabled:opacity-30 hover:bg-[#F0EBDE]"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold transition ${
                      currentPage === page
                        ? 'bg-[#67151D] text-white shadow-sm'
                        : 'border border-[#DED8CD] text-[#706B62] hover:bg-[#F0EBDE]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded border border-[#DED8CD] text-xs font-bold text-[#706B62] disabled:opacity-30 hover:bg-[#F0EBDE]"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GISLayout>
  );
}
