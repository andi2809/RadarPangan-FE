'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import {
  Search,
  ChevronDown,
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutGrid,
  Filter,
  BarChart3,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  getAllMarketsMultiCommoditySummary,
  getMarketConsensusByCommodity,
  COMMODITY_CONSENSUS_CONFIGS,
  type MarketMultiCommoditySummary,
  type MarketConsensusItem,
} from '@/data/mock/marketConsensus';

const numberFormat = new Intl.NumberFormat('id-ID');

export default function LaporanWargaPage() {
  // Mode tampilan: 'matrix' (Semua Komoditas per Pasar) vs 'single' (Fokus 1 Komoditas dengan Corong Saringan)
  const [viewMode, setViewMode] = useState<'matrix' | 'single'>('matrix');

  const [search, setSearch] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Cabai Rawit Merah');
  const [coverageFilter, setCoverageFilter] = useState<'all' | 'high' | 'medium' | 'none'>('all');
  const [activeTabSingle, setActiveTabSingle] = useState<'all' | 'tercapai' | 'menunggu' | 'belum_ada'>('all');

  const [selectedMarketForModal, setSelectedMarketForModal] = useState<MarketMultiCommoditySummary | null>(null);

  // 1. Data Matriks Multi-Komoditas (27 Pasar x 6 Komoditas)
  const allMarketsMulti = useMemo(() => {
    return getAllMarketsMultiCommoditySummary();
  }, []);

  // Filter matriks berdasarkan pencarian & tingkat kesiapan kuorum pasar
  const filteredMatrixMarkets = useMemo(() => {
    return allMarketsMulti.filter((item) => {
      const matchSearch =
        item.namaPasar.toLowerCase().includes(search.toLowerCase()) ||
        item.kabupatenKota.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (coverageFilter === 'all') return true;
      if (coverageFilter === 'high') return item.quorumCoverage.reached >= 3;
      if (coverageFilter === 'medium') return item.quorumCoverage.reached === 1 || item.quorumCoverage.reached === 2;
      if (coverageFilter === 'none') return item.quorumCoverage.reached === 0;
      return true;
    });
  }, [allMarketsMulti, search, coverageFilter]);

  // 2. Data Single Komoditas (Fokus 1 Komoditas Tertentu)
  const marketsForSingleCommodity = useMemo(() => {
    return getMarketConsensusByCommodity(selectedCommodity);
  }, [selectedCommodity]);

  const filteredSingleMarkets = useMemo(() => {
    return marketsForSingleCommodity.filter((item) => {
      const matchSearch =
        item.namaPasar.toLowerCase().includes(search.toLowerCase()) ||
        item.kabupatenKota.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (activeTabSingle === 'all') return true;
      return item.statusKuorum === activeTabSingle;
    });
  }, [marketsForSingleCommodity, search, activeTabSingle]);

  // Tab counts untuk single commodity view
  const singleCounts = useMemo(() => {
    return {
      all: marketsForSingleCommodity.length,
      tercapai: marketsForSingleCommodity.filter((m) => m.statusKuorum === 'tercapai').length,
      menunggu: marketsForSingleCommodity.filter((m) => m.statusKuorum === 'menunggu').length,
      belum_ada: marketsForSingleCommodity.filter((m) => m.statusKuorum === 'belum_ada').length,
    };
  }, [marketsForSingleCommodity]);

  // Corong agregat Jawa Barat untuk single commodity
  const funnelTotals = useMemo(() => {
    return marketsForSingleCommodity.reduce(
      (acc, m) => {
        const diLuar = Math.max(0, m.perangkatUnik - m.radiusValid);
        const duplikasi = Math.max(0, m.laporanMasuk - m.perangkatUnik);
        return {
          masuk: acc.masuk + m.laporanMasuk,
          unik: acc.unik + m.perangkatUnik,
          radius: acc.radius + m.radiusValid,
          valid: acc.valid + m.laporanValid,
          outlier: acc.outlier + m.outlierMad,
          duplikasi: acc.duplikasi + duplikasi,
          diLuar: acc.diLuar + diLuar,
        };
      },
      { masuk: 0, unik: 0, radius: 0, valid: 0, outlier: 0, duplikasi: 0, diLuar: 0 }
    );
  }, [marketsForSingleCommodity]);

  // Statistik Ringkasan Eksekutif se-Jawa Barat
  const headlineStats = useMemo(() => {
    const totalReports = allMarketsMulti.reduce((acc, m) => acc + m.totalLaporanMasuk, 0);
    const totalValid = allMarketsMulti.reduce((acc, m) => acc + m.totalLaporanValid, 0);
    const readyMarkets = allMarketsMulti.filter((m) => m.quorumCoverage.reached >= 3).length;
    const blankMarkets = allMarketsMulti.filter((m) => m.quorumCoverage.reached === 0).length;
    return {
      totalReports,
      totalValid,
      readyMarkets,
      blankMarkets,
    };
  }, [allMarketsMulti]);

  return (
    <GISLayout>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DED8CD] pb-3 text-xs">
        <div className="flex items-center gap-1.5 font-sans">
          <span className="font-extrabold tracking-wider text-[#67151D]">RADAR PANGAN</span>
          <span className="text-[#898277]">|</span>
          <span className="text-[#706B62]">Konsol Analisis &bull; Provinsi Jawa Barat</span>
        </div>
        <div className="mt-1 sm:mt-0 text-[#706B62] flex items-center gap-2">
          <span>
            Periode aktif: <strong className="text-[#24231F]">Hari ini</strong>
          </span>
          <span className="text-[#DED8CD]">|</span>
          <span>
            Diperbarui: <strong className="text-[#24231F]">24 Okt 2026, 09:27 WIB</strong>
          </span>
        </div>
      </div>

      {/* Main Page Title Section */}
      <section className="space-y-1 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#67151D]">
              TRANSPARANSI KONSENSUS HARGA WARGA
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24231F]">
              Pemantauan Partisipasi &amp; Kuorum Pasar
            </h1>
            <p className="text-xs sm:text-sm text-[#706B62] mt-0.5">
              Evaluasi konsensus harga warga tingkat pasar. Kuorum dinilai secara independen per jenis komoditas.
            </p>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="inline-flex rounded-xl border border-[#DED8CD] bg-[#FBF9F4] p-1 text-xs font-bold shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition ${
                viewMode === 'matrix'
                  ? 'bg-[#67151D] text-white shadow-sm'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Matriks Pasar (Semua Komoditas)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition ${
                viewMode === 'single'
                  ? 'bg-[#67151D] text-white shadow-sm'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              <Filter size={14} />
              <span>Audit Fokus per Komoditas</span>
            </button>
          </div>
        </div>
      </section>

      {/* Edukasi Konseptual: Mengapa Kuorum Dinilai per Komoditas, Bukan per Pasar? */}
      <section className="rounded-xl border border-[#BADFC4] bg-[#F2FBF4] p-4 text-xs text-[#1E3A27] leading-relaxed shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] text-white mt-0.5">
            <Info size={16} />
          </div>
          <div className="space-y-1">
            <span className="font-extrabold block text-sm text-[#1E3A27]">
              Konsep Metodologi: Laporan Warga Bersifat Atomik per Komoditas
            </span>
            <p className="text-[#365A42]">
              Seorang warga di pasar melaporkan harga <strong>satu komoditas spesifik</strong> (misal Cabai Rawit). Oleh karena itu, syarat kuorum (minimal 10 laporan independen valid) dihitung <strong>per komoditas</strong>. Di pasar yang sama, komoditas Cabai bisa jadi sudah mencapai kuorum, sementara Beras atau Minyak masih menunggu laporan tambahan. Sebuah pasar tidak dapat diberi label kuorum tunggal tanpa melihat rincian komoditasnya.
            </p>
          </div>
        </div>
      </section>

      {/* Top 4 Executive KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#DED8CD] rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm text-xs">
        {/* Metric 1 */}
        <div className="px-4 py-2 first:pl-0">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            TOTAL LAPORAN MASUK
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#67151D]">
            {headlineStats.totalReports.toLocaleString('id-ID')}
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            {headlineStats.totalValid.toLocaleString('id-ID')} lolos 3 saringan
          </span>
        </div>

        {/* Metric 2 */}
        <div className="px-4 py-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            PASAR TERPANTAU
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#1E40AF]">
            {allMarketsMulti.length} Pasar
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            27 Kabupaten/Kota Jawa Barat
          </span>
        </div>

        {/* Metric 3 */}
        <div className="px-4 py-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            PASAR SIAP PANTAU (&ge; 50% KUORUM)
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#15803D]">
            {headlineStats.readyMarkets} Pasar
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            Minimal 3 dari 6 komoditas sah
          </span>
        </div>

        {/* Metric 4 */}
        <div className="px-4 py-2 last:pr-0">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            PASAR BELUM MEMILIKI KUORUM
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#B45309]">
            {headlineStats.blankMarkets} Pasar
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            Memerlukan ajakan pelaporan warga
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAMPILAN 1: MATRIKS SEMUA KOMODITAS PER PASAR (REKOMENDASI UTAMA)         */}
      {/* ========================================================================= */}
      {viewMode === 'matrix' && (
        <section className="space-y-4 pt-1">
          {/* Header & Filter Bar Matriks */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#24231F]">
                  Matriks Kesiapan Konsensus Pasar Jawa Barat
                </h2>
                <span className="rounded-full bg-[#E3F0E7] px-2.5 py-0.5 text-xs font-mono font-bold text-[#15803D]">
                  6 Bahan Pangan Pokok
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#706B62]">
                Setiap baris pasar menampilkan status kuorum dan harga konsensus untuk seluruh komoditas secara berdampingan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pasar atau kabupaten/kota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-64 rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs text-[#24231F] outline-none transition focus:border-[#67151D]"
                />
              </div>

              {/* Filter Cakupan */}
              <div className="flex items-center rounded-lg border border-[#D8D1C5] bg-white p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCoverageFilter('all')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    coverageFilter === 'all' ? 'bg-[#67151D] text-white' : 'text-[#706B62] hover:text-[#24231F]'
                  }`}
                >
                  Semua ({allMarketsMulti.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCoverageFilter('high')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    coverageFilter === 'high' ? 'bg-[#67151D] text-white' : 'text-[#706B62] hover:text-[#24231F]'
                  }`}
                >
                  Kesiapan Tinggi &ge;50% ({allMarketsMulti.filter((m) => m.quorumCoverage.reached >= 3).length})
                </button>
                <button
                  type="button"
                  onClick={() => setCoverageFilter('none')}
                  className={`px-2.5 py-1.5 rounded-md transition ${
                    coverageFilter === 'none' ? 'bg-[#67151D] text-white' : 'text-[#706B62] hover:text-[#24231F]'
                  }`}
                >
                  Belum Kuorum ({allMarketsMulti.filter((m) => m.quorumCoverage.reached === 0).length})
                </button>
              </div>
            </div>
          </div>

          {/* Tabel Matriks */}
          <div className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[10px] font-extrabold uppercase tracking-wider text-[#706B62]">
                    <th className="px-4 py-3 min-w-[210px]">PASAR &amp; WILAYAH</th>
                    <th className="px-3 py-3 text-center min-w-[150px]">KESIAPAN KUORUM PASAR</th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      🌶️ CABAI RAWIT
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp48.200</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      🌾 BERAS MEDIUM
                      <span className="block font-normal text-[9px] text-[#898277]">HET Rp13.500</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      🧅 BAWANG MERAH
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp32.000</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      🥚 TELUR AYAM
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp27.000</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      🧴 MINYAK KEMASAN
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp17.500</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      🛢️ MINYAK CURAH
                      <span className="block font-normal text-[9px] text-[#898277]">HET Rp15.700</span>
                    </th>
                    <th className="px-4 py-3 text-right">AUDIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] text-xs">
                  {filteredMatrixMarkets.map((market) => {
                    const pct = market.quorumCoverage.percentage;
                    const isHigh = market.quorumCoverage.reached >= 3;
                    const isZero = market.quorumCoverage.reached === 0;

                    return (
                      <tr key={market.id} className="hover:bg-[#FBF9F4] transition">
                        {/* PASAR & WILAYAH */}
                        <td className="px-4 py-3.5">
                          <span className="block font-bold text-sm text-[#24231F]">
                            {market.namaPasar}
                          </span>
                          <span className="block text-[11px] text-[#706B62]">
                            {market.kabupatenKota}
                          </span>
                          <span className="block text-[10px] font-mono text-[#898277] mt-0.5">
                            {market.totalLaporanMasuk} laporan masuk ({market.totalLaporanValid} valid)
                          </span>
                        </td>

                        {/* KESIAPAN KUORUM PASAR */}
                        <td className="px-3 py-3.5 text-center">
                          <div className="space-y-1 inline-block text-left w-full max-w-[130px]">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span
                                className={
                                  isHigh ? 'text-[#15803D]' : isZero ? 'text-[#898277]' : 'text-[#D97706]'
                                }
                              >
                                {market.quorumCoverage.reached} / 6 Kuorum
                              </span>
                              <span className="font-mono text-[10px] text-[#706B62]">{pct}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-[#EFEAE1] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isHigh ? 'bg-[#15803D]' : isZero ? 'bg-transparent' : 'bg-[#D97706]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span
                              className={`inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
                                isHigh
                                  ? 'bg-[#E3F0E7] text-[#15803D]'
                                  : isZero
                                  ? 'bg-[#F0ECE4] text-[#706B62]'
                                  : 'bg-[#FFFBEB] text-[#D97706]'
                              }`}
                            >
                              {isHigh ? 'Kesiapan Tinggi' : isZero ? 'Belum Ada Kuorum' : 'Sebagian Kuorum'}
                            </span>
                          </div>
                        </td>

                        {/* 6 KOLOM KOMODITAS */}
                        {COMMODITY_CONSENSUS_CONFIGS.map((cfg) => {
                          const commData = market.commodities[cfg.id];
                          const isQuorum = commData?.statusKuorum === 'tercapai';
                          const isPending = commData?.statusKuorum === 'menunggu';

                          return (
                            <td key={cfg.id} className="px-3 py-3.5 text-center">
                              <Link
                                href={`/dashboard/laporan-warga/${market.id}?komoditas=${encodeURIComponent(cfg.name)}`}
                                className="block p-1.5 rounded-lg hover:bg-white hover:shadow-xs transition border border-transparent hover:border-[#DED8CD]"
                                title={`Klik untuk melihat audit ${cfg.name} di ${market.namaPasar}`}
                              >
                                {isQuorum ? (
                                  <div className="space-y-0.5">
                                    <span className="font-mono font-black text-xs text-[#24231F] block">
                                      Rp{numberFormat.format(commData.hargaWargaRp || 0)}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F0E7] px-2 py-0.5 text-[10px] font-bold text-[#15803D]">
                                      <CheckCircle2 size={10} />
                                      <span>✓ {commData.laporanValid} lap</span>
                                    </span>
                                  </div>
                                ) : isPending ? (
                                  <div className="space-y-0.5">
                                    <span className="font-mono font-medium text-[11px] text-[#706B62] block italic">
                                      Rp{numberFormat.format(commData.hargaWargaRp || 0)}
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFFBEB] px-1.5 py-0.5 text-[9.5px] font-bold text-[#D97706]">
                                      <Clock size={9} />
                                      <span>{commData.laporanValid}/10</span>
                                    </span>
                                  </div>
                                ) : (
                                  <div className="space-y-0.5 opacity-40">
                                    <span className="font-mono text-xs text-[#898277] block">-</span>
                                    <span className="text-[9.5px] text-[#898277] block">0 lap</span>
                                  </div>
                                )}
                              </Link>
                            </td>
                          );
                        })}

                        {/* DETAIL ACTION */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <Link
                            href={`/dashboard/laporan-warga/${market.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#67151D] hover:underline"
                          >
                            <span>Rincian</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-xs text-[#706B62]">
            <p>
              Badge hijau (<span className="text-[#15803D] font-bold">✓</span>) menandakan kuorum &ge; 10 laporan terpenuhi dan harga konsensus disahkan. Badge kuning (<span className="text-[#D97706] font-bold">⏳</span>) menandakan laporan sedang dikumpulkan.
            </p>
            <span className="whitespace-nowrap font-medium text-[#24231F]">
              Menampilkan {filteredMatrixMarkets.length} dari {allMarketsMulti.length} pasar
            </span>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAMPILAN 2: AUDIT FOKUS PER KOMODITAS TUNGGAL (CORONG 3 SARINGAN)         */}
      {/* ========================================================================= */}
      {viewMode === 'single' && (
        <section className="space-y-4 pt-1">
          {/* Funnel Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#DED8CD] rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm">
            <div className="px-4 py-2 first:pl-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
                1. LAPORAN MASUK
              </span>
              <strong className="mt-1.5 block text-3xl font-black text-[#67151D]">
                {funnelTotals.masuk}
              </strong>
            </div>

            <div className="px-4 py-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
                2. PERANGKAT UNIK
              </span>
              <strong className="mt-1.5 block text-3xl font-black text-[#1E40AF]">
                {funnelTotals.unik}
              </strong>
              <span className="mt-1 block text-xs text-[#706B62]">
                {funnelTotals.duplikasi} duplikasi ditahan
              </span>
            </div>

            <div className="px-4 py-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
                3. DALAM RADIUS 3 KM
              </span>
              <strong className="mt-1.5 block text-3xl font-black text-[#15803D]">
                {funnelTotals.radius}
              </strong>
              <span className="mt-1 block text-xs text-[#706B62]">
                {funnelTotals.diLuar} di luar radius
              </span>
            </div>

            <div className="px-4 py-2 last:pr-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
                4. LOLOS FILTER MAD
              </span>
              <strong className="mt-1.5 block text-3xl font-black text-[#24231F]">
                {funnelTotals.valid}
              </strong>
              <span className="mt-1 block text-xs text-[#706B62]">
                {funnelTotals.outlier} outlier dikeluarkan
              </span>
            </div>
          </div>

          {/* Section Header & Filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#24231F]">
                Konsensus Pasar Khusus Komoditas &bull; {selectedCommodity}
              </h2>
              <p className="mt-0.5 text-xs text-[#706B62]">
                Menampilkan hasil 3 saringan konsensus anti-spekulan untuk {selectedCommodity} di seluruh pasar Jawa Barat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pasar atau kabupaten/kota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-60 rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs text-[#24231F] outline-none transition focus:border-[#67151D]"
                />
              </div>

              {/* Dropdown Komoditas */}
              <div className="relative">
                <select
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                  className="h-9 appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D]"
                >
                  {COMMODITY_CONSENSUS_CONFIGS.map((cfg) => (
                    <option key={cfg.id} value={cfg.dropdownLabel}>
                      {cfg.dropdownLabel} ({cfg.satuan})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#706B62]"
                />
              </div>
            </div>
          </div>

          {/* Underline Tabs */}
          <div className="flex items-center gap-6 border-b border-[#DED8CD] text-xs">
            <button
              type="button"
              onClick={() => setActiveTabSingle('all')}
              className={`pb-2.5 font-bold transition ${
                activeTabSingle === 'all'
                  ? 'border-b-2 border-[#67151D] text-[#67151D]'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              Semua pasar <span className="ml-1 font-mono font-normal">{singleCounts.all}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabSingle('tercapai')}
              className={`pb-2.5 font-bold transition ${
                activeTabSingle === 'tercapai'
                  ? 'border-b-2 border-[#67151D] text-[#67151D]'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              Kuorum tercapai <span className="ml-1 font-mono font-normal">{singleCounts.tercapai}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabSingle('menunggu')}
              className={`pb-2.5 font-bold transition ${
                activeTabSingle === 'menunggu'
                  ? 'border-b-2 border-[#67151D] text-[#67151D]'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              Menunggu kuorum <span className="ml-1 font-mono font-normal">{singleCounts.menunggu}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabSingle('belum_ada')}
              className={`pb-2.5 font-bold transition ${
                activeTabSingle === 'belum_ada'
                  ? 'border-b-2 border-[#67151D] text-[#67151D]'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              Belum ada laporan <span className="ml-1 font-mono font-normal">{singleCounts.belum_ada}</span>
            </button>
          </div>

          {/* Single Table */}
          <div className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[10px] font-extrabold uppercase tracking-wider text-[#706B62]">
                    <th className="px-4 py-3">PASAR / WILAYAH</th>
                    <th className="px-3 py-3 text-center">LAPORAN MASUK</th>
                    <th className="px-3 py-3 text-center">PERANGKAT UNIK</th>
                    <th className="px-3 py-3 text-center">RADIUS VALID</th>
                    <th className="px-3 py-3 text-center">OUTLIER MAD</th>
                    <th className="px-3 py-3 text-center">LAPORAN VALID</th>
                    <th className="px-4 py-3">STATUS KUORUM</th>
                    <th className="px-3 py-3 text-right">HARGA WARGA</th>
                    <th className="px-3 py-3 text-right">HARGA ACUAN</th>
                    <th className="px-3 py-3 text-center">SELISIH</th>
                    <th className="px-4 py-3 text-right">DETAIL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] text-xs">
                  {filteredSingleMarkets.map((m) => {
                    const isTercapai = m.statusKuorum === 'tercapai';
                    const isMenunggu = m.statusKuorum === 'menunggu';
                    const unitLabel = m.satuan ? `/${m.satuan}` : '/kg';

                    return (
                      <tr key={m.id} className="hover:bg-[#FBF9F4] transition">
                        {/* PASAR / WILAYAH */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="block font-bold text-[#24231F]">{m.namaPasar}</span>
                            {m.quorumCoverage && (
                              <span
                                className="inline-flex items-center rounded-full bg-[#F0ECE4] px-2 py-0.5 text-[10px] font-mono font-medium text-[#706B62]"
                                title={`Total ${m.quorumCoverage.reached} dari 6 komoditas mencapai kuorum di pasar ini`}
                              >
                                {m.quorumCoverage.reached}/6 kuorum
                              </span>
                            )}
                          </div>
                          <span className="block text-[11px] text-[#706B62]">{m.kabupatenKota}</span>
                        </td>

                        {/* LAPORAN MASUK */}
                        <td className="px-3 py-3.5 text-center font-mono font-bold text-[#B91C1C]">
                          {m.laporanMasuk}
                        </td>

                        {/* PERANGKAT UNIK */}
                        <td className="px-3 py-3.5 text-center font-mono font-bold text-[#1D4ED8]">
                          {m.perangkatUnik}
                        </td>

                        {/* RADIUS VALID */}
                        <td className="px-3 py-3.5 text-center font-mono font-bold text-[#15803D]">
                          {m.radiusValid}
                        </td>

                        {/* OUTLIER MAD */}
                        <td className="px-3 py-3.5 text-center font-mono font-bold text-[#B45309]">
                          {m.outlierMad}
                        </td>

                        {/* LAPORAN VALID */}
                        <td className="px-3 py-3.5 text-center font-mono font-extrabold text-[#24231F]">
                          {m.laporanValid}
                        </td>

                        {/* KUORUM PROGRESS BAR */}
                        <td className="px-4 py-3.5 w-44">
                          <div className="space-y-1">
                            <span
                              className={`block text-[11px] font-bold ${
                                isTercapai
                                  ? 'text-[#15803D]'
                                  : isMenunggu
                                  ? 'text-[#D97706]'
                                  : 'text-[#898277]'
                              }`}
                            >
                              {isTercapai
                                ? `${m.laporanValid} / 10 · Tercapai`
                                : isMenunggu
                                ? `${m.laporanValid} / 10 · Menunggu`
                                : '0 / 10 · Belum ada'}
                            </span>
                            <div className="h-1.5 w-full rounded-full bg-[#EFEAE1] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isTercapai
                                    ? 'bg-[#15803D]'
                                    : isMenunggu
                                    ? 'bg-[#D97706]'
                                    : 'bg-transparent'
                                }`}
                                style={{
                                  width: isTercapai
                                    ? '100%'
                                    : isMenunggu
                                    ? `${Math.min(100, (m.laporanValid / 10) * 100)}%`
                                    : '0%',
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* HARGA WARGA */}
                        <td className="px-3 py-3.5 text-right font-mono font-extrabold text-[#24231F]">
                          {m.hargaWargaRp ? (
                            <>
                              Rp{numberFormat.format(m.hargaWargaRp)}
                              <span className="text-[10px] font-normal text-[#706B62] block">
                                {unitLabel}
                              </span>
                            </>
                          ) : (
                            <span className="font-sans font-normal italic text-[#706B62]">
                              Belum terbentuk
                            </span>
                          )}
                        </td>

                        {/* HARGA ACUAN */}
                        <td className="px-3 py-3.5 text-right font-mono text-[#4A4740]">
                          Rp{numberFormat.format(m.hargaAcuanRp)}
                          <span className="text-[10px] font-normal text-[#706B62] block">
                            {unitLabel}
                          </span>
                        </td>

                        {/* SELISIH */}
                        <td className="px-3 py-3.5 text-center font-mono font-bold">
                          {m.selisihPct !== null ? (
                            <span className={m.selisihPct > 0 ? 'text-[#67151D]' : 'text-[#15803D]'}>
                              {m.selisihPct > 0 ? '+' : ''}
                              {m.selisihPct.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-[#898277] font-sans font-normal">-</span>
                          )}
                        </td>

                        {/* DETAIL LINK */}
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/dashboard/laporan-warga/${m.id}?komoditas=${encodeURIComponent(selectedCommodity)}`}
                            className="text-xs font-bold text-[#67151D] hover:underline whitespace-nowrap"
                          >
                            Buka detail &rarr;
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-xs text-[#706B62]">
            <p>
              Status kuorum di atas dihitung khusus untuk komoditas <strong>{selectedCommodity}</strong> pada masing-masing pasar berdasarkan 3 saringan konsensus aktif hari ini.
            </p>
            <span className="whitespace-nowrap font-medium text-[#24231F]">
              Menampilkan {filteredSingleMarkets.length} dari {marketsForSingleCommodity.length} pasar
            </span>
          </div>
        </section>
      )}
    </GISLayout>
  );
}
