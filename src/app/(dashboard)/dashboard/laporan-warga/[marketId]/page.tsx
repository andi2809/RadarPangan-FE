'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Info,
  BarChart2,
} from 'lucide-react';
import {
  getMarketDetailConsensus,
  COMMODITY_CONSENSUS_CONFIGS,
  type AuditReportItem,
} from '@/data/mock/marketConsensus';

const numberFormat = new Intl.NumberFormat('id-ID');
const LAST_UPDATED_TEXT = '24 Okt 2026, 09:27 WIB';

function DetailLaporanPasarContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const marketId = (params?.marketId as string) || 'psr-bekasikab-01';
  const paramCommodity = searchParams?.get('komoditas') || 'Cabai Rawit Merah';

  // Filters state
  const [selectedCommodity, setSelectedCommodity] = useState<string>(paramCommodity);
  const [tableFilter, setTableFilter] = useState<'all' | 'valid' | 'outlier' | 'radius_invalid'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Accordion state for 3 verification steps
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setOpenStep(openStep === stepNumber ? null : stepNumber);
  };

  // Ambil data konsensus dan audit deterministik untuk (marketId, selectedCommodity)
  const detailData = useMemo(() => {
    return getMarketDetailConsensus(marketId, selectedCommodity);
  }, [marketId, selectedCommodity]);

  // Filtered reports for individual audit table
  const filteredReports = useMemo(() => {
    if (tableFilter === 'all') return detailData.auditReports;
    if (tableFilter === 'valid') return detailData.auditReports.filter((r) => r.status === 'valid');
    if (tableFilter === 'outlier') return detailData.auditReports.filter((r) => r.status === 'outlier');
    if (tableFilter === 'radius_invalid')
      return detailData.auditReports.filter((r) => r.status === 'radius_invalid' || r.status === 'duplicate');
    return detailData.auditReports;
  }, [detailData.auditReports, tableFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage]);

  const counts = useMemo(() => {
    return {
      all: detailData.auditReports.length,
      valid: detailData.auditReports.filter((r) => r.status === 'valid').length,
      outlier: detailData.auditReports.filter((r) => r.status === 'outlier').length,
      radius_invalid: detailData.auditReports.filter((r) => r.status === 'radius_invalid').length,
      duplicate: detailData.auditReports.filter((r) => r.status === 'duplicate').length,
    };
  }, [detailData.auditReports]);

  const isTercapai = detailData.kpi.statusKuorum === 'tercapai';
  const isMenunggu = detailData.kpi.statusKuorum === 'menunggu';

  // Maksimum frekuensi untuk skala tinggi histogram
  const maxBinCount = useMemo(() => {
    if (!detailData.histogramBins.length) return 5;
    return Math.max(5, ...detailData.histogramBins.map((b) => b.count));
  }, [detailData.histogramBins]);

  return (
    <GISLayout>
      {/* Top Header Bar */}
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
            <div className="flex items-center gap-2">
              <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#67151D]">
                VALIDASI LAPORAN WARGA
              </span>
              <span className="inline-flex items-center rounded-full bg-[#F0ECE4] px-2 py-0.5 text-[10px] font-mono font-bold text-[#706B62]">
                {detailData.quorumCoverage.reached} dari {detailData.quorumCoverage.total} komoditas kuorum
              </span>
            </div>
            <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24231F]">
              Detail Laporan {detailData.market.namaPasar}
            </h1>
            <p className="mt-1 text-xs text-[#706B62]">
              {detailData.market.kabupatenKota} &bull; Laporan aktif hari ini (24 Okt 2026)
            </p>
          </div>

          <div className="w-full sm:w-60">
            <label className="mb-1 block text-[11px] font-bold text-[#706B62]">
              Pilih Komoditas yang Diaudit
            </label>
            <div className="relative">
              <select
                value={selectedCommodity}
                onChange={(e) => {
                  setSelectedCommodity(e.target.value);
                  setCurrentPage(1);
                  setTableFilter('all');
                }}
                className="h-9 w-full appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D]"
              >
                {COMMODITY_CONSENSUS_CONFIGS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.satuan})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#706B62]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7 KPI Stat Metrics in 1 Row */}
      <section className="grid grid-cols-2 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-[#DED8CD] rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm text-xs">
        {/* 1. Laporan masuk */}
        <div className="px-3 py-1 first:pl-0">
          <span className="block text-[11px] text-[#706B62]">Laporan masuk</span>
          <strong className="mt-1 block text-2xl font-black text-[#B91C1C]">
            {detailData.kpi.laporanMasuk}
          </strong>
        </div>

        {/* 2. Perangkat unik */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Perangkat unik</span>
          <strong className="mt-1 block text-2xl font-black text-[#1D4ED8]">
            {detailData.kpi.perangkatUnik}
          </strong>
        </div>

        {/* 3. Dalam radius <= 3 km */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Dalam radius ≤ 3 km</span>
          <strong className="mt-1 block text-2xl font-black text-[#15803D]">
            {detailData.kpi.radiusValid}
          </strong>
        </div>

        {/* 4. Di luar radius */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Di luar radius</span>
          <strong className="mt-1 block text-2xl font-black text-[#24231F]">
            {detailData.kpi.diLuarRadius}
          </strong>
        </div>

        {/* 5. Outlier (MAD) */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Outlier (MAD)</span>
          <strong className="mt-1 block text-2xl font-black text-[#B45309]">
            {detailData.kpi.outlierMad}
          </strong>
        </div>

        {/* 6. Laporan valid */}
        <div className="px-3 py-1">
          <span className="block text-[11px] text-[#706B62]">Laporan valid</span>
          <strong className="mt-1 block text-2xl font-black text-[#24231F]">
            {detailData.kpi.laporanValid}
          </strong>
        </div>

        {/* 7. Status kuorum */}
        <div className="px-3 py-1 last:pr-0 col-span-2 md:col-span-1">
          <span className="block text-[11px] text-[#706B62]">Status kuorum</span>
          <div
            className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isTercapai
                ? 'bg-[#E3F0E7] text-[#15803D]'
                : isMenunggu
                ? 'bg-[#FFFBEB] text-[#D97706]'
                : 'bg-[#F0ECE4] text-[#706B62]'
            }`}
          >
            {isTercapai ? (
              <>
                <CheckCircle2 size={13} />
                <span>Tercapai ({detailData.kpi.laporanValid} / 10)</span>
              </>
            ) : isMenunggu ? (
              <>
                <Clock size={13} />
                <span>Menunggu ({detailData.kpi.laporanValid} / 10)</span>
              </>
            ) : (
              <>
                <Info size={13} />
                <span>0 / 10 · Belum ada</span>
              </>
            )}
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
                Hasil 3 saringan otomatis untuk {detailData.commodity.name}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {detailData.hargaWargaRp ? (
                <>
                  <span className="text-3xl font-black tracking-tight text-[#67151D]">
                    Rp{numberFormat.format(detailData.hargaWargaRp)}
                    <span className="text-sm font-normal text-[#706B62]">
                      /{detailData.commodity.satuan}
                    </span>
                  </span>
                  {isTercapai ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F0E7] px-2.5 py-0.5 text-xs font-bold text-[#15803D]">
                      <CheckCircle2 size={12} />
                      <span>Valid</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-xs font-bold text-[#D97706]">
                      <Clock size={12} />
                      <span>Indikatif Sementara</span>
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xl font-bold italic text-[#706B62]">
                  Belum terbentuk
                </span>
              )}
            </div>

            <div className="border-t border-[#F0ECE4] pt-3 space-y-2.5 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-[#706B62]">
                  Harga acuan pemerintah ({detailData.commodity.jenisAcuan})
                </span>
                <strong className="font-mono text-[#24231F]">
                  Rp{numberFormat.format(detailData.hargaAcuanRp)} /{detailData.commodity.satuan}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#706B62]">Selisih terhadap acuan</span>
                <strong
                  className={`font-mono font-bold ${
                    detailData.selisihPct !== null && detailData.selisihPct > 0
                      ? 'text-[#67151D]'
                      : 'text-[#15803D]'
                  }`}
                >
                  {detailData.selisihPct !== null
                    ? `${detailData.selisihPct > 0 ? '+' : ''}${detailData.selisihPct.toFixed(1)}%`
                    : '-'}
                </strong>
              </div>
            </div>

            {!isTercapai && detailData.kpi.laporanValid > 0 && (
              <p className="rounded-lg bg-[#FFFBEB] p-2.5 text-[11px] text-[#92400E] leading-relaxed">
                Harga ini dihitung dari nilai tengah (median) sementara {detailData.kpi.laporanValid} laporan valid. Belum disahkan sebagai konsensus resmi TPID karena kuorum minimal 10 laporan belum tercapai.
              </p>
            )}
          </div>

          {/* Card 2: Alur Pemeriksaan Laporan */}
          <div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#24231F]">
                Alur Pemeriksaan Laporan
              </h3>
              <p className="mt-0.5 text-xs text-[#706B62]">
                Evaluasi 3 saringan untuk komoditas {detailData.commodity.name}:
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
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${
                        detailData.kpi.radiusValid > 0 ? 'bg-[#15803D]' : 'bg-[#706B62]'
                      }`}
                    >
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-[#24231F]">
                        1. Satu Perangkat &amp; Radius Pasar
                      </span>
                      <span className="block text-[11px] text-[#706B62]">
                        Lolos: {detailData.kpi.radiusValid} dari {detailData.kpi.laporanMasuk} laporan
                      </span>
                    </div>
                  </div>
                  {openStep === 1 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openStep === 1 && (
                  <div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740] space-y-1">
                    <p>
                      &bull; Deduplikasi fingerprint: {detailData.kpi.laporanMasuk - detailData.kpi.perangkatUnik} duplikat diblokir.
                    </p>
                    <p>
                      &bull; Geofencing: {detailData.kpi.diLuarRadius} laporan berjarak &gt; 3 km dari pasar ditolak.
                    </p>
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
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${
                        isTercapai ? 'bg-[#15803D]' : isMenunggu ? 'bg-[#D97706]' : 'bg-[#706B62]'
                      }`}
                    >
                      {isTercapai ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                    </div>
                    <div>
                      <span className="font-bold text-[#24231F]">
                        2. Kuorum Minimal 10 Laporan
                      </span>
                      <span className="block text-[11px] text-[#706B62]">
                        {isTercapai
                          ? `Tercapai: ${detailData.kpi.laporanValid} laporan valid`
                          : `Menunggu: ${detailData.kpi.laporanValid} dari minimal 10 laporan`}
                      </span>
                    </div>
                  </div>
                  {openStep === 2 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openStep === 2 && (
                  <div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740]">
                    <p>
                      {isTercapai
                        ? `Syarat kuorum (≥ 10 laporan terverifikasi) terpenuhi dengan ${detailData.kpi.laporanValid} laporan independen.`
                        : `Syarat kuorum belum terpenuhi. Baru terkumpul ${detailData.kpi.laporanValid} dari ambang batas 10 laporan.`}
                    </p>
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
                        Dikeluarkan: {detailData.kpi.outlierMad} laporan (deviasi &gt; 10%)
                      </span>
                    </div>
                  </div>
                  {openStep === 3 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openStep === 3 && (
                  <div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740]">
                    <p>
                      {detailData.kpi.outlierMad > 0
                        ? `${detailData.kpi.outlierMad} laporan terdeteksi menyimpang ekstrem dari median wajar dan dikeluarkan.`
                        : 'Tidak ada laporan yang terdeteksi menyimpang ekstrem di luar toleransi MAD.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notice Callout */}
            <div className="flex items-start gap-2 rounded-lg bg-[#F0F4F8] p-3 text-[11px] text-[#4A4740]">
              <Info size={14} className="mt-0.5 flex-shrink-0 text-[#1D4ED8]" />
              <span>
                Hanya laporan hari ini yang diproses. Laporan dari hari sebelumnya berstatus kedaluwarsa dan tidak masuk ke dalam kuorum aktif.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Histogram & Audit Table (~65% width) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card 1: Distribusi Harga Laporan Valid */}
          <div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#24231F]">
                Distribusi Harga Laporan Valid ({detailData.kpi.laporanValid} laporan) &bull; {detailData.commodity.name}
              </h3>
              {detailData.hargaWargaRp && (
                <span className="font-mono text-xs font-bold text-[#67151D] bg-[#FDF2F2] px-2.5 py-1 rounded-md border border-[#FADBD8]">
                  Median: Rp{numberFormat.format(detailData.hargaWargaRp)}/{detailData.commodity.satuan}
                </span>
              )}
            </div>

            {detailData.kpi.laporanValid === 0 ? (
              <div className="rounded-xl border border-dashed border-[#DED8CD] bg-[#FBF9F4] p-8 text-center space-y-2">
                <BarChart2 className="w-10 h-10 text-[#898277] mx-auto opacity-50" />
                <p className="text-sm font-bold text-[#24231F]">
                  Belum Ada Laporan Terverifikasi
                </p>
                <p className="text-xs text-[#706B62] max-w-md mx-auto">
                  Belum ada laporan warga yang lolos verifikasi untuk komoditas <strong>{detailData.commodity.name}</strong> di {detailData.market.namaPasar} hari ini.
                </p>
                <div className="pt-2">
                  <Link
                    href="/lapor"
                    className="inline-block py-2 px-4 rounded-lg bg-[#67151D] hover:bg-[#4C0D15] text-white text-xs font-bold transition"
                  >
                    Kirim Laporan Harga Sekarang &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              /* Histogram Chart */
              <div className="w-full pt-6 pb-2">
                <div className="relative h-44 w-full flex items-end justify-between gap-1 px-8 pb-7 border-b border-[#DED8CD]">
                  {/* Y-Axis Label */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-[#706B62] font-sans">
                    Jumlah laporan
                  </div>

                  {/* Horizontal Guide Lines */}
                  {[1, 2, 3, 4, 5].map((level) => {
                    const stepPx = 110 / 5;
                    return (
                      <div
                        key={level}
                        className="absolute left-6 right-2 border-b border-[#F0ECE4] pointer-events-none"
                        style={{ bottom: `${28 + level * stepPx}px` }}
                      >
                        <span className="absolute -left-5 -top-2 text-[9px] text-[#898277] font-mono">
                          {Math.round((level / 5) * maxBinCount)}
                        </span>
                      </div>
                    );
                  })}

                  {/* Histogram Bars */}
                  {detailData.histogramBins.map((bin) => {
                    const barHeightPct = maxBinCount > 0 ? (bin.count / maxBinCount) * 100 : 0;
                    return (
                      <div
                        key={bin.label}
                        className="relative flex-1 flex flex-col items-center justify-end h-full"
                      >
                        {/* Median Pointer */}
                        {bin.isMedian && (
                          <div className="absolute -top-7 flex flex-col items-center z-10">
                            <span className="rounded-md bg-[#FADBD8] px-2 py-0.5 text-[9.5px] font-bold text-[#67151D] shadow-sm whitespace-nowrap">
                              Median Rp{bin.label}
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
                            style={{ height: `${Math.max(4, (barHeightPct / 100) * 110)}px` }}
                          />
                        )}

                        {/* X-axis tick label */}
                        <span className="absolute -bottom-6 text-[9px] font-mono text-[#706B62] whitespace-nowrap">
                          {bin.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Sumbu X Caption */}
                <div className="text-center pt-3 text-[11px] font-bold text-[#706B62]">
                  Harga (Rp/{detailData.commodity.satuan})
                </div>
              </div>
            )}
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
                Di Luar Radius ({counts.radius_invalid + counts.duplicate})
              </button>
            </div>

            {/* Table */}
            {filteredReports.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#706B62]">
                Tidak ada laporan yang sesuai dengan kriteria saringan ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[11px] font-extrabold text-[#706B62]">
                      <th className="px-4 py-2.5">ID Tiket</th>
                      <th className="px-4 py-2.5">Waktu Lapor</th>
                      <th className="px-4 py-2.5 text-right">Harga (Rp/{detailData.commodity.satuan})</th>
                      <th className="px-4 py-2.5 text-center">Status Pemeriksaan</th>
                      <th className="px-4 py-2.5">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4] text-xs">
                    {paginatedReports.map((r) => {
                      const isValid = r.status === 'valid';
                      const isOutlier = r.status === 'outlier';

                      return (
                        <tr key={r.id} className="hover:bg-[#FBF9F4] transition">
                          <td className="px-4 py-3 font-mono font-bold text-[#67151D]">
                            {r.id}
                          </td>
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
                                <span>Tidak Valid</span>
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
            )}

            {/* Pagination Controls */}
            {filteredReports.length > 0 && (
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
            )}
          </div>
        </div>
      </section>
    </GISLayout>
  );
}

export default function DetailLaporanPasarPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#FBF9F4] text-xs text-[#706B62]">
          Memuat data audit konsensus...
        </div>
      }
    >
      <DetailLaporanPasarContent />
    </Suspense>
  );
}
