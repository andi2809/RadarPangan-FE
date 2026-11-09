'use client';

import React from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  ShieldAlert,
  MapPin,
  TrendingUp,
  Scale,
} from 'lucide-react';
import type { Commodity } from '@/types/domain';

const numberFormat = new Intl.NumberFormat('id-ID');

export interface EnrichedRegionReportItem {
  id: string;
  name: string;
  umk2026: number;
  currentPriceRp: number;
  forecastPriceRp: number;
  hargaAcuanRp: number;
  status: string;
  supplyStatus: string;
  kenaikanH7Pct: number;
  deviasiHapPct: number;
  umkBurden: {
    rasioBebanUmkPct: number;
    penggandaUmk: number;
    skorTekananDayaBeli: number;
    statusKeterjangkauan: string;
  };
}

export interface DecisionSupportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: EnrichedRegionReportItem;
  commodity: Commodity;
  allRegions: EnrichedRegionReportItem[];
  seasonalScenarioLabel: string;
  periodDays: number;
  lastUpdatedText: string;
}

export function DecisionSupportReportModal({
  isOpen,
  onClose,
  activeRegion,
  commodity,
  allRegions,
  seasonalScenarioLabel,
  periodDays,
  lastUpdatedText,
}: DecisionSupportReportModalProps) {
  if (!isOpen) return null;

  // Sorting analysis for DSS summary
  const sortedByDeviation = [...allRegions].sort((a, b) => b.deviasiHapPct - a.deviasiHapPct);
  const sortedByBurden = [...allRegions].sort(
    (a, b) => b.umkBurden.rasioBebanUmkPct - a.umkBurden.rasioBebanUmkPct
  );
  const sortedByPrice = [...allRegions].sort((a, b) => b.currentPriceRp - a.currentPriceRp);

  const highestPriceRegion = sortedByPrice[0] || activeRegion;
  const lowestPriceRegion = sortedByPrice[sortedByPrice.length - 1] || activeRegion;
  const priceDisparityRp = highestPriceRegion.currentPriceRp - lowestPriceRegion.currentPriceRp;
  const disparityPct = Number(
    ((priceDisparityRp / Math.max(1, lowestPriceRegion.currentPriceRp)) * 100).toFixed(1)
  );

  const avgJabarPriceRp = Math.round(
    allRegions.reduce((sum, r) => sum + r.currentPriceRp, 0) / Math.max(1, allRegions.length)
  );
  const avgBurdenPct = Number(
    (
      allRegions.reduce((sum, r) => sum + r.umkBurden.rasioBebanUmkPct, 0) /
      Math.max(1, allRegions.length)
    ).toFixed(2)
  );

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = [
      'No',
      'Kode Wilayah',
      'Kabupaten / Kota',
      'UMK 2026 (Rp)',
      'Harga Observasi (Rp)',
      'Estimasi H+7 (Rp)',
      'Deviasi HAP/HET (%)',
      'Beban UMK (%)',
      'Skor Tekanan',
      'Status Keterjangkauan',
      'Status Neraca Pasokan',
    ];

    const rows = allRegions.map((r, idx) => [
      idx + 1,
      r.id,
      `"${r.name}"`,
      r.umk2026,
      r.currentPriceRp,
      r.forecastPriceRp,
      `${r.deviasiHapPct > 0 ? '+' : ''}${r.deviasiHapPct}%`,
      `${r.umkBurden.rasioBebanUmkPct}%`,
      r.umkBurden.skorTekananDayaBeli,
      `"${r.umkBurden.statusKeterjangkauan}"`,
      `"${r.supplyStatus}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeDate = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `laporan_dss_disparitas_${commodity?.id || 'pangan'}_${safeDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#DED8CD] bg-[#FFFDF7] shadow-2xl">
        {/* Sticky Modal Top Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-[#DED8CD] bg-[#F7F4EB] px-5 py-3.5 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#67151D] text-white">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#24231F]">
                Pratinjau Dokumen Pendukung Keputusan (Decision Support System)
              </h2>
              <p className="text-[11px] text-[#706B62]">
                Sintesis disparitas harga &amp; beban daya beli 27 Kabupaten/Kota Jawa Barat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DED8CD] bg-white px-3 py-1.5 text-xs font-bold text-[#24231F] transition hover:bg-[#F0EBDE]"
            >
              <Download size={14} />
              <span>Ekspor CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#67151D] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#4C0D15]"
            >
              <Printer size={14} />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DED8CD] p-1.5 text-[#706B62] transition hover:bg-[#F0EBDE]"
              title="Tutup"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-[#24231F]">
          <div className="print-report space-y-6">
            {/* Header Dokumen Resmi */}
            <div className="border-b-2 border-[#24231F] pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#67151D]">
                    PEMERINTAH PROVINSI JAWA BARAT · TIM PENGENDALI INFLASI DAERAH (TPID)
                  </span>
                  <h1 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-[#24231F]">
                    LAPORAN INTELIJEN HARGA PANGAN &amp; DISPARITAS WILAYAH
                  </h1>
                  <p className="text-xs text-[#706B62]">
                    Instrumen Sistem Pendukung Keputusan (Decision Support System - DSS) Berbasis Bukti Empiris
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono text-[11px] text-[#706B62] border-l-2 sm:border-l-0 sm:border-r-2 border-[#67151D] pl-3 sm:pl-0 sm:pr-3">
                  <span className="block font-bold text-[#24231F]">Nomor: DSS-JBR/2026/LP-27</span>
                  <span>Diperbarui: {lastUpdatedText}</span>
                  <span className="block text-[#67151D] font-bold">Klasifikasi: Terbatas / Bahan Telaah</span>
                </div>
              </div>
            </div>

            {/* MANDATORY DSS DISCLAIMER BOX (Decision Support vs Decision Making) */}
            <div className="rounded-xl border border-[#67151D]/40 bg-[#FFF5F5] p-4 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-[#67151D]" />
                <div className="space-y-1">
                  <strong className="block text-[11px] font-extrabold uppercase tracking-wider text-[#67151D]">
                    Protokol Sistem Pendukung Keputusan (Decision Support Protocol)
                  </strong>
                  <p className="text-[#4A4740] leading-relaxed">
                    Dokumen ini berkedudukan murni sebagai <strong>Sistem Pendukung Keputusan (Decision Support)</strong> dan secara tegas <strong>BUKAN Pembuat Keputusan Otomatis (Decision Making)</strong>. Dokumen ini menyajikan agregasi data observasi pasar riil, deviasi terhadap acuan regulasi (HAP/HET), estimasi tren jangka pendek (H+7), dan rasio beban keterjangkauan terhadap upah minimum wilayah (UMK 2026). Segala pertimbangan tindakan, intervensi pasar, fasilitasi logistik, maupun kebijakan stabilisasi pangan sepenuhnya berada di bawah diskresi dan kewenangan institusional Tim Pengendali Inflasi Daerah (TPID), Satgas Pangan, dan Pemerintah Kabupaten/Kota terkait.
                  </p>
                </div>
              </div>
            </div>

            {/* Parameter Analisis Terpilih */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-[#DED8CD] bg-[#FBF9F4] p-3.5 text-xs font-mono">
              <div>
                <span className="block font-sans text-[10px] font-bold text-[#706B62] uppercase">Komoditas Pokok</span>
                <strong className="text-[#24231F] font-sans">{commodity?.name || 'Komoditas'}</strong>
                <span className="block text-[10px] text-[#706B62]">
                  Acuan {commodity?.jenisAcuan || 'HAP'}: Rp{numberFormat.format(commodity?.hargaAcuanRp || 45000)}/{commodity?.satuan || 'kg'}
                </span>
              </div>
              <div>
                <span className="block font-sans text-[10px] font-bold text-[#706B62] uppercase">Wilayah Fokus</span>
                <strong className="text-[#24231F] font-sans">{activeRegion.name}</strong>
                <span className="block text-[10px] text-[#706B62]">
                  UMK 2026: Rp{numberFormat.format(activeRegion.umk2026)}
                </span>
              </div>
              <div>
                <span className="block font-sans text-[10px] font-bold text-[#706B62] uppercase">Skenario Pasar</span>
                <strong className="text-[#67151D] font-sans">{seasonalScenarioLabel}</strong>
                <span className="block text-[10px] text-[#706B62]">Jendela: {periodDays} Hari Observasi</span>
              </div>
              <div>
                <span className="block font-sans text-[10px] font-bold text-[#706B62] uppercase">Disparitas Jawa Barat</span>
                <strong className="text-[#67151D]">Rp{numberFormat.format(priceDisparityRp)}</strong>
                <span className="block text-[10px] text-[#706B62]">{disparityPct}% antarwilayah</span>
              </div>
            </div>

            {/* Bagian 1: Indikator Analitis Wilayah Fokus */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#DED8CD] pb-2">
                <MapPin size={15} className="text-[#67151D]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24231F]">
                  Bagian 1 - Profil Analitis Wilayah Fokus: {activeRegion.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 font-mono text-xs">
                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Harga Observasi</span>
                  <strong className="mt-1 block text-sm text-[#24231F]">
                    Rp{numberFormat.format(activeRegion.currentPriceRp)}
                  </strong>
                  <span className="block text-[10px] text-[#706B62]">per {commodity?.satuan || 'kg'}</span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Laju 7 Hari</span>
                  <strong
                    className={`mt-1 block text-sm ${
                      activeRegion.kenaikanH7Pct >= 0 ? 'text-[#67151D]' : 'text-[#287653]'
                    }`}
                  >
                    {activeRegion.kenaikanH7Pct > 0 ? '+' : ''}
                    {(activeRegion.kenaikanH7Pct / 7).toFixed(2)}% / hari
                  </strong>
                  <span className="block text-[10px] text-[#706B62]">tren harian</span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Estimasi H+7</span>
                  <strong className="mt-1 block text-sm text-[#67151D]">
                    Rp{numberFormat.format(activeRegion.forecastPriceRp)}
                  </strong>
                  <span className="block text-[10px] text-[#706B62]">proyeksi terkalibrasi</span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Deviasi Acuan</span>
                  <strong
                    className={`mt-1 block text-sm ${
                      activeRegion.deviasiHapPct > 0 ? 'text-[#67151D]' : 'text-[#287653]'
                    }`}
                  >
                    {activeRegion.deviasiHapPct > 0 ? '+' : ''}
                    {activeRegion.deviasiHapPct.toFixed(1)}%
                  </strong>
                  <span className="block text-[10px] text-[#706B62]">vs {commodity?.jenisAcuan || 'HAP'}</span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Rasio Beban UMK</span>
                  <strong className="mt-1 block text-sm text-[#24231F]">
                    {activeRegion.umkBurden.rasioBebanUmkPct.toFixed(2)}%
                  </strong>
                  <span className="block text-[10px] text-[#706B62]">porsi upah lokal</span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Skor Tekanan</span>
                  <strong className="mt-1 block text-sm text-[#67151D]">
                    {activeRegion.umkBurden.skorTekananDayaBeli.toFixed(2)}
                  </strong>
                  <span className="block text-[10px] text-[#706B62]">
                    {activeRegion.umkBurden.penggandaUmk}x rata-rata
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-[#DED8CD] bg-[#FBF9F4] p-3 text-xs leading-relaxed text-[#4A4740]">
                <strong>Catatan Faktual Wilayah:</strong> Di {activeRegion.name}, komoditas {commodity?.name || 'pangan'} berada pada level harga Rp{numberFormat.format(activeRegion.currentPriceRp)}/{commodity?.satuan || 'kg'}. Terhadap acuan regulasi {commodity?.jenisAcuan || 'HAP'} (Rp{numberFormat.format(commodity?.hargaAcuanRp || 45000)}), harga ini mencatatkan deviasi {activeRegion.deviasiHapPct > 0 ? `di atas acuan sebesar +${activeRegion.deviasiHapPct.toFixed(1)}%` : `di bawah acuan sebesar ${activeRegion.deviasiHapPct.toFixed(1)}%`}. Dengan besaran UMK 2026 Rp{numberFormat.format(activeRegion.umk2026)}, beban pengeluaran komoditas ini mengonsumsi {activeRegion.umkBurden.rasioBebanUmkPct.toFixed(2)}% dari upah minimum bulanan pekerja lokal.
              </div>
            </section>

            {/* Bagian 2: Sintesis Disparitas & Fakta Agregat Jawa Barat */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#DED8CD] pb-2">
                <Scale size={15} className="text-[#67151D]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24231F]">
                  Bagian 2 - Fakta Disparitas &amp; Agregat Se-Jawa Barat
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Harga Terendah Jabar</span>
                  <strong className="block text-sm text-[#287653]">
                    Rp{numberFormat.format(lowestPriceRegion.currentPriceRp)}
                  </strong>
                  <span className="block font-sans text-[10px] text-[#706B62] truncate">
                    {lowestPriceRegion.name}
                  </span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Harga Rata-Rata Jabar</span>
                  <strong className="block text-sm text-[#24231F]">
                    Rp{numberFormat.format(avgJabarPriceRp)}
                  </strong>
                  <span className="block font-sans text-[10px] text-[#706B62]">27 Kabupaten / Kota</span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Harga Tertinggi Jabar</span>
                  <strong className="block text-sm text-[#67151D]">
                    Rp{numberFormat.format(highestPriceRegion.currentPriceRp)}
                  </strong>
                  <span className="block font-sans text-[10px] text-[#706B62] truncate">
                    {highestPriceRegion.name}
                  </span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">Rerata Beban UMK Jabar</span>
                  <strong className="block text-sm text-[#24231F]">{avgBurdenPct}%</strong>
                  <span className="block font-sans text-[10px] text-[#706B62]">terhadap UMK rerata</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-[#DED8CD] bg-white p-3 space-y-1.5">
                  <span className="font-bold text-[11px] text-[#67151D] uppercase">
                    5 Wilayah Deviasi Harga Tertinggi vs Acuan:
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 font-mono text-[11px]">
                    {sortedByDeviation.slice(0, 5).map((r) => (
                      <li key={r.id}>
                        <span className="font-sans font-medium">{r.name}</span>: Rp
                        {numberFormat.format(r.currentPriceRp)}{' '}
                        <span className="text-[#67151D] font-bold">
                          (+{r.deviasiHapPct.toFixed(1)}%)
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3 space-y-1.5">
                  <span className="font-bold text-[11px] text-[#67151D] uppercase">
                    5 Wilayah Beban Upah (UMK) Paling Signifikan:
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 font-mono text-[11px]">
                    {sortedByBurden.slice(0, 5).map((r) => (
                      <li key={r.id}>
                        <span className="font-sans font-medium">{r.name}</span>: UMK Rp
                        {numberFormat.format(r.umk2026)}{' '}
                        <span className="text-[#67151D] font-bold">
                          (Beban: {r.umkBurden.rasioBebanUmkPct.toFixed(2)}%)
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* Bagian 3: Matriks Lengkap 27 Kabupaten/Kota Jawa Barat */}
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#DED8CD] pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-[#67151D]" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#24231F]">
                    Bagian 3 - Matriks Komparasi 27 Kabupaten/Kota Se-Jawa Barat
                  </h3>
                </div>
                <span className="text-[10px] text-[#706B62] font-mono">Total: 27 Daerah Otonom</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#DED8CD] bg-white">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[10px] font-extrabold uppercase tracking-wider text-[#706B62]">
                      <th className="px-3 py-2 text-center">No.</th>
                      <th className="px-3 py-2">Kabupaten / Kota</th>
                      <th className="px-3 py-2 text-right">UMK 2026</th>
                      <th className="px-3 py-2 text-right">Harga Terakhir</th>
                      <th className="px-3 py-2 text-right">Estimasi H+7</th>
                      <th className="px-3 py-2 text-right">Deviasi HAP</th>
                      <th className="px-3 py-2 text-right">Beban UMK</th>
                      <th className="px-3 py-2 text-right">Skor Tekanan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4] font-mono text-[11px]">
                    {allRegions.map((r, index) => {
                      const isHighDev = r.deviasiHapPct >= 20;
                      return (
                        <tr
                          key={r.id}
                          className={r.id === activeRegion.id ? 'bg-[#F4E8E9]/50 font-semibold' : ''}
                        >
                          <td className="px-3 py-2 text-center text-[#706B62]">{index + 1}</td>
                          <td className="px-3 py-2 font-sans font-bold text-[#24231F]">{r.name}</td>
                          <td className="px-3 py-2 text-right text-[#4A4740]">
                            Rp{numberFormat.format(r.umk2026)}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-[#24231F]">
                            Rp{numberFormat.format(r.currentPriceRp)}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-[#67151D]">
                            Rp{numberFormat.format(r.forecastPriceRp)}
                          </td>
                          <td
                            className={`px-3 py-2 text-right font-bold ${
                              isHighDev ? 'text-[#67151D]' : 'text-[#287653]'
                            }`}
                          >
                            {r.deviasiHapPct > 0 ? '+' : ''}
                            {r.deviasiHapPct.toFixed(1)}%
                          </td>
                          <td className="px-3 py-2 text-right">
                            {r.umkBurden.rasioBebanUmkPct.toFixed(2)}%
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-[#24231F]">
                            {r.umkBurden.skorTekananDayaBeli.toFixed(1)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bagian 4: Provenansi Data & Legalitas */}
            <section className="rounded-xl border border-[#DED8CD] bg-[#FBF9F4] p-4 text-[11px] text-[#706B62] space-y-1.5">
              <strong className="block font-sans text-xs font-bold text-[#24231F] uppercase">
                Bagian 4 - Landasan Data &amp; Integritas Penyelenggaraan:
              </strong>
              <p>
                1. <strong>Sumber Data Harga Resmi:</strong> Panel Harga Pangan Badan Pangan Nasional (Bapanas - panelharga.badanpangan.go.id) pada tingkat pedagang eceran pasar rakyat terdaftar.
              </p>
              <p>
                2. <strong>Regulasi Batas Acuan:</strong> Peraturan Badan Pangan Nasional (Perbadan) No. 6 Tahun 2023 &amp; No. 17 Tahun 2023 tentang Harga Acuan Penjualan di Tingkat Konsumen.
              </p>
              <p>
                3. <strong>Standar Upah Minimum Wilayah:</strong> Keputusan Gubernur Jawa Barat tentang Upah Minimum Kabupaten/Kota (UMK) Tahun 2026 melalui JDIH Pemprov Jawa Barat.
              </p>
              <p>
                4. <strong>Netralitas &amp; Independensi:</strong> Data diolah secara murni deterministik multi-window tanpa pencantuman nama merek dagang komersial guna menjaga obyektivitas tata kelola pangan publik.
              </p>
            </section>

            {/* Bagian 5: Kolom Validasi & Verifikasi Pemangku Kebijakan */}
            <section className="border-t border-[#DED8CD] pt-5">
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div className="space-y-12">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#706B62]">
                      Disiapkan oleh:
                    </span>
                    <strong className="block text-[#24231F]">Tim Analis Data Radar Pangan Jawa Barat</strong>
                    <span className="text-[10px] text-[#706B62]">Platform EWS &amp; Decision Support System</span>
                  </div>
                  <div className="border-b border-[#DED8CD] w-48" />
                  <span className="block text-[10px] text-[#706B62]">Paraf / Tanggal Telaah Sistem</span>
                </div>

                <div className="space-y-12 text-right">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#706B62]">
                      Diterima untuk Bahan Pertimbangan:
                    </span>
                    <strong className="block text-[#24231F]">
                      Tim Pengendali Inflasi Daerah (TPID) / Satgas Pangan
                    </strong>
                    <span className="text-[10px] text-[#706B62]">Pemerintah Daerah Provinsi Jawa Barat</span>
                  </div>
                  <div className="border-b border-[#DED8CD] w-48 ml-auto" />
                  <span className="block text-[10px] text-[#706B62]">Tanda Tangan Pejabat Berwenang</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
