'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import {
  Search,
  ChevronDown,
  ChevronUp,
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
  Building2,
  Store,
  MapPin,
  ChevronsUpDown,
  ListFilter,
  CheckSquare,
} from 'lucide-react';
import {
  getAllRegionConsensusGroups,
  getAllMarketsMultiCommoditySummary,
  getAllOfficialMarketsConsensusByCommodity,
  COMMODITY_CONSENSUS_CONFIGS,
  type RegionConsensusGroup,
  type MarketMultiCommoditySummary,
  type MarketConsensusItem,
} from '@/data/mock/marketConsensus';

const numberFormat = new Intl.NumberFormat('id-ID');

export default function LaporanWargaPage() {
  // Mode tampilan:
  // 1. 'accordion': Hierarki Wilayah (27 Kabupaten/Kota -> 133 Pasar Tradisional) - REKOMENDASI UTAMA
  // 2. 'matrix': Matriks Komparasi Datar (Seluruh 133 Pasar)
  // 3. 'single': Audit Corong 3 Saringan (Fokus 1 Komoditas Tertentu)
  const [viewMode, setViewMode] = useState<'accordion' | 'matrix' | 'single'>('accordion');

  const [search, setSearch] = useState<string>('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [readinessFilter, setReadinessFilter] = useState<'all' | 'high' | 'partial' | 'none'>('all');

  // Single commodity mode state
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Cabai Rawit Merah');
  const [activeTabSingle, setActiveTabSingle] = useState<'all' | 'tercapai' | 'menunggu' | 'belum_ada'>('all');

  // Data 1: Grup Hirarkis per Kabupaten/Kota (27 Wilayah & 133 Pasar Resmi)
  const allRegionGroups = useMemo(() => {
    return getAllRegionConsensusGroups();
  }, []);

  // Set Akordion Terbuka (Default: Buka 3 wilayah pertama: Kab. Bogor, Kab. Sukabumi, Kab. Bekasi)
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    () => new Set(['32.01', '32.16', '32.73'])
  );

  const toggleRegion = (regionId: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  const expandAllRegions = () => {
    setExpandedRegions(new Set(allRegionGroups.map((g) => g.regionId)));
  };

  const collapseAllRegions = () => {
    setExpandedRegions(new Set());
  };

  // Filter Grup Wilayah berdasarkan Pencarian, Dropdown Wilayah & Tingkat Kesiapan
  const filteredRegionGroups = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allRegionGroups
      .map((group) => {
        // Filter dropdown wilayah spesifik
        if (selectedRegionFilter !== 'all' && group.regionId !== selectedRegionFilter) {
          return null;
        }

        // Filter kesiapan kuorum wilayah
        if (readinessFilter === 'high' && group.highReadinessMarkets === 0) {
          return null;
        }
        if (
          readinessFilter === 'partial' &&
          (group.activeQuorumMarkets === 0 || group.highReadinessMarkets > 0)
        ) {
          return null;
        }
        if (readinessFilter === 'none' && group.activeQuorumMarkets > 0) {
          return null;
        }

        // Filter pencarian teks (nama wilayah, nama pasar, atau kecamatan)
        if (!q) return group;

        const regionMatch =
          group.regionName.toLowerCase().includes(q) ||
          group.regionId.includes(q) ||
          group.instansiPengelola.toLowerCase().includes(q);

        const matchingMarkets = group.markets.filter(
          (m) =>
            m.namaPasar.toLowerCase().includes(q) ||
            (m.kecamatan && m.kecamatan.toLowerCase().includes(q))
        );

        if (regionMatch) {
          return group;
        }

        if (matchingMarkets.length > 0) {
          return {
            ...group,
            markets: matchingMarkets,
          };
        }

        return null;
      })
      .filter((g): g is RegionConsensusGroup => g !== null);
  }, [allRegionGroups, selectedRegionFilter, readinessFilter, search]);

  // Data 2: Daftar Datar Seluruh 133 Pasar (untuk Mode Matriks)
  const allFlatMarkets = useMemo(() => {
    return allRegionGroups.flatMap((g) => g.markets);
  }, [allRegionGroups]);

  const filteredFlatMarkets = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allFlatMarkets.filter((item) => {
      if (selectedRegionFilter !== 'all' && item.regionId !== selectedRegionFilter) return false;

      const matchSearch =
        !q ||
        item.namaPasar.toLowerCase().includes(q) ||
        item.kabupatenKota.toLowerCase().includes(q) ||
        (item.kecamatan && item.kecamatan.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (readinessFilter === 'all') return true;
      if (readinessFilter === 'high') return item.quorumCoverage.reached >= 3;
      if (readinessFilter === 'partial')
        return item.quorumCoverage.reached === 1 || item.quorumCoverage.reached === 2;
      if (readinessFilter === 'none') return item.quorumCoverage.reached === 0;

      return true;
    });
  }, [allFlatMarkets, selectedRegionFilter, readinessFilter, search]);

  // Data 3: Data Single Komoditas (133 Pasar Resmi untuk Komoditas Terpilih)
  const marketsForSingleCommodity = useMemo(() => {
    return getAllOfficialMarketsConsensusByCommodity(selectedCommodity);
  }, [selectedCommodity]);

  const filteredSingleMarkets = useMemo(() => {
    const q = search.trim().toLowerCase();

    return marketsForSingleCommodity.filter((item) => {
      if (selectedRegionFilter !== 'all' && item.regionId !== selectedRegionFilter) return false;

      const matchSearch =
        !q ||
        item.namaPasar.toLowerCase().includes(q) ||
        item.kabupatenKota.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (activeTabSingle === 'all') return true;
      return item.statusKuorum === activeTabSingle;
    });
  }, [marketsForSingleCommodity, selectedRegionFilter, search, activeTabSingle]);

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

  // Statistik Ringkasan Eksekutif se-Jawa Barat (133 Pasar di 27 Kab/Kota)
  const headlineStats = useMemo(() => {
    const totalReports = allRegionGroups.reduce((acc, g) => acc + g.totalLaporanMasuk, 0);
    const totalValid = allRegionGroups.reduce((acc, g) => acc + g.totalLaporanValid, 0);
    const readyMarkets = allFlatMarkets.filter((m) => m.quorumCoverage.reached >= 3).length;
    const partialMarkets = allFlatMarkets.filter(
      (m) => m.quorumCoverage.reached === 1 || m.quorumCoverage.reached === 2
    ).length;
    const blankMarkets = allFlatMarkets.filter((m) => m.quorumCoverage.reached === 0).length;

    return {
      totalReports,
      totalValid,
      readyMarkets,
      partialMarkets,
      blankMarkets,
      totalMarketsCount: allFlatMarkets.length,
      totalRegionsCount: allRegionGroups.length,
    };
  }, [allRegionGroups, allFlatMarkets]);

  return (
    <GISLayout>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DED8CD] pb-3 text-xs">
        <div className="flex items-center gap-1.5 font-sans">
          <span className="font-extrabold tracking-wider text-[#67151D]">RADAR PANGAN</span>
          <span className="text-[#898277]">|</span>
          <span className="text-[#706B62]">Konsol Pemantauan &bull; Provinsi Jawa Barat</span>
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
              TRANSPARANSI KONSENSUS HARGA WARGA TINGKAT PASAR
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24231F]">
              Pemantauan Partisipasi &amp; Kuorum Pasar Jawa Barat
            </h1>
            <p className="text-xs sm:text-sm text-[#706B62] mt-0.5">
              Direktori resmi 133 pasar tradisional di 27 Kabupaten/Kota. Evaluasi kuorum dilakukan secara independen per jenis komoditas.
            </p>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="inline-flex rounded-xl border border-[#DED8CD] bg-[#FBF9F4] p-1 text-xs font-bold shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('accordion')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition ${
                viewMode === 'accordion'
                  ? 'bg-[#67151D] text-white shadow-sm'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              <Building2 size={14} />
              <span>Hierarki Wilayah (Akordion 27 Kab/Kota)</span>
            </button>

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
              <span>Matriks Lengkap (133 Pasar)</span>
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
              <span>Audit Corong per Komoditas</span>
            </button>
          </div>
        </div>
      </section>

      {/* Edukasi Konseptual: Mengapa Kuorum Dinilai per Komoditas dan Mengapa Dikelompokkan per Wilayah? */}
      <section className="rounded-xl border border-[#BADFC4] bg-[#F2FBF4] p-4 text-xs text-[#1E3A27] leading-relaxed shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F] text-white mt-0.5">
            <Info size={16} />
          </div>
          <div className="space-y-1">
            <span className="font-extrabold block text-sm text-[#1E3A27]">
              Hirarki Tata Kelola: Provinsi &rarr; 27 Kabupaten/Kota &rarr; 133 Pasar Rakyat &rarr; 6 Komoditas Pokok
            </span>
            <p className="text-[#365A42]">
              Setiap Kabupaten/Kota di Jawa Barat memiliki lebih dari satu pasar rakyat resmi pantauan TPID (rata-rata 4&ndash;7 pasar per daerah). Karena laporan warga bersifat <strong>atomik per komoditas</strong>, kuorum (minimal 10 laporan independen) dihitung terpisah untuk masing-masing komoditas. Di wilayah yang sama, pasar induk grosir (seperti Pasar Caringin atau Cibitung) bisa memiliki tingkat partisipasi lebih tinggi dibandingkan pasar kecamatan ritel. Pengelompokan berhirarki memudahkan pemerintah mendeteksi disparitas harga antar pasar dan mengidentifikasi pasar yang masih minim laporan warga.
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
            {headlineStats.totalValid.toLocaleString('id-ID')} lolos 3 saringan konsensus
          </span>
        </div>

        {/* Metric 2 */}
        <div className="px-4 py-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            CAKUPAN PASAR PANTAUAN
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#1E40AF]">
            {headlineStats.totalMarketsCount} Pasar
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            Tersebar di {headlineStats.totalRegionsCount} Kabupaten/Kota se-Jabar
          </span>
        </div>

        {/* Metric 3 */}
        <div className="px-4 py-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            PASAR KESIAPAN TINGGI (&ge;50% KUORUM)
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#15803D]">
            {headlineStats.readyMarkets} Pasar
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            Minimal 3 dari 6 komoditas sah kuorum
          </span>
        </div>

        {/* Metric 4 */}
        <div className="px-4 py-2 last:pr-0">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            PASAR BUTUH PENINGKATAN LAPORAN
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#B45309]">
            {headlineStats.blankMarkets} Pasar
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            0 kuorum komoditas (perlu ajakan pelaporan)
          </span>
        </div>
      </section>

      {/* Global Filter Bar for Accordion & Matrix Views */}
      {(viewMode === 'accordion' || viewMode === 'matrix') && (
        <section className="flex flex-col gap-3 rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pasar, kecamatan, atau daerah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-64 rounded-lg border border-[#D8D1C5] bg-[#FBF9F4] px-3 text-xs text-[#24231F] outline-none transition focus:border-[#67151D] focus:bg-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#706B62] hover:text-[#24231F]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dropdown Filter Wilayah (27 Kabupaten/Kota) */}
            <div className="relative">
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-[#D8D1C5] bg-[#FBF9F4] pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D] focus:bg-white"
              >
                <option value="all">Semua 27 Wilayah ({headlineStats.totalRegionsCount} Kab/Kota)</option>
                {allRegionGroups.map((g) => (
                  <option key={g.regionId} value={g.regionId}>
                    {g.regionName} ({g.totalMarkets} Pasar)
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#706B62]"
              />
            </div>

            {/* Filter Tingkat Kesiapan */}
            <div className="flex items-center rounded-lg border border-[#D8D1C5] bg-[#FBF9F4] p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setReadinessFilter('all')}
                className={`px-2.5 py-1.5 rounded-md transition ${
                  readinessFilter === 'all'
                    ? 'bg-[#67151D] text-white shadow-xs'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Semua Kesiapan
              </button>
              <button
                type="button"
                onClick={() => setReadinessFilter('high')}
                className={`px-2.5 py-1.5 rounded-md transition ${
                  readinessFilter === 'high'
                    ? 'bg-[#67151D] text-white shadow-xs'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Kesiapan Tinggi (&ge;50%)
              </button>
              <button
                type="button"
                onClick={() => setReadinessFilter('partial')}
                className={`px-2.5 py-1.5 rounded-md transition ${
                  readinessFilter === 'partial'
                    ? 'bg-[#67151D] text-white shadow-xs'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Sebagian Kuorum
              </button>
              <button
                type="button"
                onClick={() => setReadinessFilter('none')}
                className={`px-2.5 py-1.5 rounded-md transition ${
                  readinessFilter === 'none'
                    ? 'bg-[#67151D] text-white shadow-xs'
                    : 'text-[#706B62] hover:text-[#24231F]'
                }`}
              >
                Belum Kuorum
              </button>
            </div>
          </div>

          {/* Quick Accordion Expand/Collapse Controls */}
          {viewMode === 'accordion' && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#706B62]">
              <button
                type="button"
                onClick={expandAllRegions}
                className="rounded-lg border border-[#DED8CD] px-2.5 py-1.5 hover:bg-[#FBF9F4] hover:text-[#24231F] transition"
              >
                Buka Semua ({filteredRegionGroups.length})
              </button>
              <button
                type="button"
                onClick={collapseAllRegions}
                className="rounded-lg border border-[#DED8CD] px-2.5 py-1.5 hover:bg-[#FBF9F4] hover:text-[#24231F] transition"
              >
                Tutup Semua
              </button>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAMPILAN 1: HIERARKI WILAYAH (AKORDION 27 KABUPATEN/KOTA x 133 PASAR)    */}
      {/* ========================================================================= */}
      {viewMode === 'accordion' && (
        <section className="space-y-3.5 pt-1">
          {filteredRegionGroups.length === 0 ? (
            <div className="rounded-xl border border-[#DED8CD] bg-white p-8 text-center text-xs text-[#706B62]">
              <Store className="mx-auto h-8 w-8 text-[#898277] mb-2 opacity-50" />
              <p className="font-bold text-sm text-[#24231F]">Tidak ada wilayah atau pasar yang cocok</p>
              <p className="mt-1">Silakan sesuaikan kata kunci pencarian atau ubah filter kesiapan kuorum.</p>
            </div>
          ) : (
            filteredRegionGroups.map((group) => {
              const isExpanded = expandedRegions.has(group.regionId);
              const readinessPct = Math.round((group.highReadinessMarkets / group.totalMarkets) * 100);
              const isHighRegion = group.highReadinessMarkets >= 2 || readinessPct >= 40;
              const isZeroRegion = group.activeQuorumMarkets === 0;

              return (
                <div
                  key={group.regionId}
                  className="rounded-xl border border-[#DED8CD] bg-white shadow-sm overflow-hidden transition"
                >
                  {/* Accordion Region Header */}
                  <button
                    type="button"
                    onClick={() => toggleRegion(group.regionId)}
                    className={`w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-[#FBF9F4] hover:bg-[#F5F1E8] transition-colors duration-200 text-left ${
                      isExpanded ? 'border-b border-[#EFEAE1]' : ''
                    }`}
                  >
                    {/* Left Info: Region Name & Agency */}
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#67151D] text-white">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-extrabold text-[#24231F]">
                            {group.regionName}
                          </h3>
                          <span className="rounded bg-[#EFEAE1] px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#706B62]">
                            Kode {group.regionId}
                          </span>
                          <span className="rounded-full bg-[#E3F0E7] px-2 py-0.5 text-[10px] font-bold text-[#15803D]">
                            {group.totalMarkets} Pasar Terdaftar
                          </span>
                        </div>
                        <p className="text-[11px] text-[#706B62] mt-0.5">
                          {group.instansiPengelola}
                        </p>
                      </div>
                    </div>

                    {/* Right Summary: Reports & Readiness */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 text-xs">
                      {/* Laporan Stats */}
                      <div className="text-right hidden sm:block">
                        <span className="block font-extrabold text-sm text-[#24231F]">
                          {group.totalLaporanMasuk} Laporan
                        </span>
                        <span className="block text-[10px] text-[#706B62]">
                          {group.totalLaporanValid} lolos saringan
                        </span>
                      </div>

                      {/* Quorum Readiness Progress */}
                      <div className="w-36 text-right">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span
                            className={
                              isHighRegion
                                ? 'text-[#15803D]'
                                : isZeroRegion
                                ? 'text-[#898277]'
                                : 'text-[#D97706]'
                            }
                          >
                            {group.activeQuorumMarkets} / {group.totalMarkets} Pasar Aktif
                          </span>
                          <span className="font-mono text-[10px] text-[#706B62]">
                            {Math.round((group.activeQuorumMarkets / group.totalMarkets) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#E5DFD5] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isHighRegion
                                ? 'bg-[#15803D]'
                                : isZeroRegion
                                ? 'bg-transparent'
                                : 'bg-[#D97706]'
                            }`}
                            style={{
                              width: `${Math.round((group.activeQuorumMarkets / group.totalMarkets) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Chevron Toggle Icon with Smooth 300ms Rotation */}
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-[#DED8CD] text-[#706B62]">
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ease-in-out ${
                            isExpanded ? 'rotate-180 text-[#67151D]' : 'rotate-0 text-[#706B62]'
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Accordion Region Expanded Body with Smooth CSS Grid Animation */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#EFEAE1] bg-white text-[9.5px] font-extrabold uppercase tracking-wider text-[#706B62]">
                              <th className="px-4 py-2.5 min-w-[200px]">PASAR &amp; KECAMATAN</th>
                              <th className="px-3 py-2.5 text-center min-w-[140px]">KESIAPAN PASAR</th>
                              <th className="px-3 py-2.5 text-center min-w-[125px]">
                                CABAI RAWIT MERAH
                                <span className="block font-normal text-[8.5px] text-[#898277]">HAP Rp48.200</span>
                              </th>
                              <th className="px-3 py-2.5 text-center min-w-[125px]">
                                BERAS MEDIUM
                                <span className="block font-normal text-[8.5px] text-[#898277]">HET Rp13.500</span>
                              </th>
                              <th className="px-3 py-2.5 text-center min-w-[125px]">
                                BAWANG MERAH
                                <span className="block font-normal text-[8.5px] text-[#898277]">HAP Rp32.000</span>
                              </th>
                              <th className="px-3 py-2.5 text-center min-w-[125px]">
                                TELUR AYAM RAS
                                <span className="block font-normal text-[8.5px] text-[#898277]">HAP Rp27.000</span>
                              </th>
                              <th className="px-3 py-2.5 text-center min-w-[125px]">
                                MINYAK KEMASAN
                                <span className="block font-normal text-[8.5px] text-[#898277]">HAP Rp17.500</span>
                              </th>
                              <th className="px-3 py-2.5 text-center min-w-[125px]">
                                MINYAK CURAH
                                <span className="block font-normal text-[8.5px] text-[#898277]">HET Rp15.700</span>
                              </th>
                              <th className="px-4 py-2.5 text-right min-w-[120px]">DETAIL PASAR</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F0ECE4]">
                            {group.markets.map((market) => {
                              const isHigh = market.quorumCoverage.reached >= 3;
                              const isZero = market.quorumCoverage.reached === 0;

                              return (
                                <tr key={market.id} className="hover:bg-[#FBF9F4] transition">
                                  {/* PASAR & KECAMATAN */}
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-sm text-[#24231F] block">
                                        {market.namaPasar}
                                      </span>
                                      {market.isAnchorMarket && (
                                        <span className="rounded bg-[#FDF2F4] text-[#67151D] px-1.5 py-0.2 text-[9px] font-bold border border-[#F5C2C7]">
                                          Pasar Induk/Acuan
                                        </span>
                                      )}
                                    </div>
                                    <span className="block text-[11px] text-[#706B62] mt-0.5">
                                      {market.kecamatan ? `Kec. ${market.kecamatan}` : market.kabupatenKota} &bull;{' '}
                                      <span className="font-mono text-[10px] text-[#898277]">
                                        {market.totalLaporanMasuk} lap masuk ({market.totalLaporanValid} valid)
                                      </span>
                                    </span>
                                  </td>

                                  {/* KESIAPAN KUORUM PASAR */}
                                  <td className="px-3 py-3 text-center">
                                    <div className="space-y-1 inline-block text-left w-full max-w-[120px]">
                                      <div className="flex items-center justify-between text-[10.5px] font-bold">
                                        <span
                                          className={
                                            isHigh
                                              ? 'text-[#15803D]'
                                              : isZero
                                              ? 'text-[#898277]'
                                              : 'text-[#D97706]'
                                          }
                                        >
                                          {market.quorumCoverage.reached} / 6 Kuorum
                                        </span>
                                        <span className="font-mono text-[9.5px] text-[#706B62]">
                                          {market.quorumCoverage.percentage}%
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full bg-[#EFEAE1] overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all ${
                                            isHigh
                                              ? 'bg-[#15803D]'
                                              : isZero
                                              ? 'bg-transparent'
                                              : 'bg-[#D97706]'
                                          }`}
                                          style={{ width: `${market.quorumCoverage.percentage}%` }}
                                        />
                                      </div>
                                      <span
                                        className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                          isHigh
                                            ? 'bg-[#E3F0E7] text-[#15803D]'
                                            : isZero
                                            ? 'bg-[#F0ECE4] text-[#706B62]'
                                            : 'bg-[#FFFBEB] text-[#D97706]'
                                        }`}
                                      >
                                        {isHigh
                                          ? 'Kesiapan Tinggi'
                                          : isZero
                                          ? 'Belum Ada Kuorum'
                                          : 'Sebagian Kuorum'}
                                      </span>
                                    </div>
                                  </td>

                                  {/* 6 KOLOM KOMODITAS */}
                                  {COMMODITY_CONSENSUS_CONFIGS.map((cfg) => {
                                    const commData = market.commodities[cfg.id];
                                    const isQuorum = commData?.statusKuorum === 'tercapai';
                                    const isPending = commData?.statusKuorum === 'menunggu';

                                    return (
                                      <td key={cfg.id} className="px-3 py-3 text-center">
                                        <Link
                                          href={`/dashboard/laporan-warga/${market.id}?komoditas=${encodeURIComponent(
                                            cfg.name
                                          )}`}
                                          className="block p-1 rounded-md hover:bg-white hover:shadow-xs transition border border-transparent hover:border-[#DED8CD]"
                                          title={`Audit harga ${cfg.name} di ${market.namaPasar}`}
                                        >
                                          {isQuorum ? (
                                            <div className="space-y-0.5">
                                              <span className="font-mono font-black text-xs text-[#24231F] block">
                                                Rp{numberFormat.format(commData.hargaWargaRp || 0)}
                                              </span>
                                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F0E7] px-1.5 py-0.2 text-[9.5px] font-bold text-[#15803D]">
                                                <CheckCircle2 size={9} />
                                                <span>✓ {commData.laporanValid} lap</span>
                                              </span>
                                            </div>
                                          ) : isPending ? (
                                            <div className="space-y-0.5">
                                              <span className="font-mono font-medium text-[11px] text-[#706B62] block italic">
                                                {commData.hargaWargaRp
                                                  ? `Rp${numberFormat.format(commData.hargaWargaRp)}`
                                                  : '—'}
                                              </span>
                                              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFFBEB] px-1.5 py-0.2 text-[9px] font-bold text-[#D97706]">
                                                <Clock size={8} />
                                                <span>{commData.laporanValid}/10 lap</span>
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="space-y-0.5 opacity-40">
                                              <span className="font-mono text-xs text-[#898277] block">-</span>
                                              <span className="text-[9px] text-[#898277] block">0 lap</span>
                                            </div>
                                          )}
                                        </Link>
                                      </td>
                                    );
                                  })}

                                  {/* DETAIL ACTION */}
                                  <td className="px-4 py-3 text-right whitespace-nowrap">
                                    <Link
                                      href={`/dashboard/laporan-warga/${market.id}`}
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#DED8CD] bg-white px-2.5 py-1 text-xs font-bold text-[#67151D] shadow-xs hover:border-[#67151D] hover:bg-[#FDF2F4] transition"
                                    >
                                      <span>Detail Pasar</span>
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
                  </div>
                </div>
              );
            })
          )}

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-xs text-[#706B62]">
            <p>
              Badge hijau (<span className="text-[#15803D] font-bold">✓</span>) menandakan kuorum &ge; 10 laporan tercapai dan konsensus harga disahkan. Badge kuning (<span className="text-[#D97706] font-bold">⏳</span>) menandakan sedang pengumpulan data.
            </p>
            <span className="whitespace-nowrap font-medium text-[#24231F]">
              Menampilkan {filteredRegionGroups.length} dari {allRegionGroups.length} Kabupaten/Kota ({headlineStats.totalMarketsCount} pasar resmi)
            </span>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAMPILAN 2: MATRIKS KOMPARASI LENGKAP (133 PASAR TRADISIONAL DATAR)       */}
      {/* ========================================================================= */}
      {viewMode === 'matrix' && (
        <section className="space-y-4 pt-1">
          <div className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[10px] font-extrabold uppercase tracking-wider text-[#706B62]">
                    <th className="px-4 py-3 min-w-[210px]">PASAR &amp; WILAYAH</th>
                    <th className="px-3 py-3 text-center min-w-[150px]">KESIAPAN KUORUM PASAR</th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      CABAI RAWIT MERAH
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp48.200</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      BERAS MEDIUM
                      <span className="block font-normal text-[9px] text-[#898277]">HET Rp13.500</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      BAWANG MERAH
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp32.000</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      TELUR AYAM RAS
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp27.000</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      MINYAK KEMASAN
                      <span className="block font-normal text-[9px] text-[#898277]">HAP Rp17.500</span>
                    </th>
                    <th className="px-3 py-3 text-center min-w-[125px]">
                      MINYAK CURAH
                      <span className="block font-normal text-[9px] text-[#898277]">HET Rp15.700</span>
                    </th>
                    <th className="px-4 py-3 text-right min-w-[120px]">DETAIL PASAR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4] text-xs">
                  {filteredFlatMarkets.map((market) => {
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
                            {market.kabupatenKota} {market.kecamatan ? `(${market.kecamatan})` : ''}
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
                              <span className="font-mono text-[10px] text-[#706B62]">
                                {market.quorumCoverage.percentage}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-[#EFEAE1] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isHigh ? 'bg-[#15803D]' : isZero ? 'bg-transparent' : 'bg-[#D97706]'
                                }`}
                                style={{ width: `${market.quorumCoverage.percentage}%` }}
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
                                href={`/dashboard/laporan-warga/${market.id}?komoditas=${encodeURIComponent(
                                  cfg.name
                                )}`}
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
                                      {commData.hargaWargaRp
                                        ? `Rp${numberFormat.format(commData.hargaWargaRp)}`
                                        : '—'}
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
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DED8CD] bg-white px-2.5 py-1 text-xs font-bold text-[#67151D] shadow-xs hover:border-[#67151D] hover:bg-[#FDF2F4] transition"
                          >
                            <span>Detail Pasar</span>
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-xs text-[#706B62]">
            <p>
              Menampilkan {filteredFlatMarkets.length} dari {allFlatMarkets.length} pasar tradisional resmi Jawa Barat.
            </p>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAMPILAN 3: AUDIT FOKUS PER KOMODITAS TUNGGAL (CORONG 3 SARINGAN)         */}
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
              Semua ({singleCounts.all})
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSingle('tercapai')}
              className={`pb-2.5 font-bold transition flex items-center gap-1.5 ${
                activeTabSingle === 'tercapai'
                  ? 'border-b-2 border-[#15803D] text-[#15803D]'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              <CheckCircle2 size={13} />
              <span>Kuorum Tercapai ({singleCounts.tercapai})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSingle('menunggu')}
              className={`pb-2.5 font-bold transition flex items-center gap-1.5 ${
                activeTabSingle === 'menunggu'
                  ? 'border-b-2 border-[#D97706] text-[#D97706]'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              <Clock size={13} />
              <span>Menunggu ({singleCounts.menunggu})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSingle('belum_ada')}
              className={`pb-2.5 font-bold transition flex items-center gap-1.5 ${
                activeTabSingle === 'belum_ada'
                  ? 'border-b-2 border-[#898277] text-[#898277]'
                  : 'text-[#706B62] hover:text-[#24231F]'
              }`}
            >
              <span>Belum Ada ({singleCounts.belum_ada})</span>
            </button>
          </div>

          {/* Table Single Commodity */}
          <div className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[10px] font-extrabold uppercase tracking-wider text-[#706B62]">
                    <th className="px-4 py-3">PASAR &amp; KAB/KOTA</th>
                    <th className="px-3 py-3 text-center">LAPORAN MASUK</th>
                    <th className="px-3 py-3 text-center">PERANGKAT UNIK</th>
                    <th className="px-3 py-3 text-center">RADIUS &le; 3 KM</th>
                    <th className="px-3 py-3 text-center">LOLOS MAD</th>
                    <th className="px-4 py-3 text-right">HARGA WARGA</th>
                    <th className="px-4 py-3 text-right">HARGA ACUAN</th>
                    <th className="px-3 py-3 text-center">STATUS KUORUM</th>
                    <th className="px-4 py-3 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE4]">
                  {filteredSingleMarkets.map((market) => (
                    <tr key={market.id} className="hover:bg-[#FBF9F4] transition">
                      <td className="px-4 py-3">
                        <span className="block font-bold text-sm text-[#24231F]">
                          {market.namaPasar}
                        </span>
                        <span className="block text-[11px] text-[#706B62]">
                          {market.kabupatenKota}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center font-mono font-medium text-[#24231F]">
                        {market.laporanMasuk}
                      </td>

                      <td className="px-3 py-3 text-center font-mono font-medium text-[#24231F]">
                        {market.perangkatUnik}
                      </td>

                      <td className="px-3 py-3 text-center font-mono font-medium text-[#24231F]">
                        {market.radiusValid}
                      </td>

                      <td className="px-3 py-3 text-center font-mono font-bold text-[#15803D]">
                        {market.laporanValid}
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-black text-sm text-[#24231F]">
                        {market.hargaWargaRp
                          ? `Rp${numberFormat.format(market.hargaWargaRp)}`
                          : '—'}
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-xs text-[#706B62]">
                        Rp{numberFormat.format(market.hargaAcuanRp)}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {market.statusKuorum === 'tercapai' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F0E7] px-2 py-0.5 text-[10px] font-bold text-[#15803D]">
                            <CheckCircle2 size={11} />
                            <span>Tercapai</span>
                          </span>
                        )}
                        {market.statusKuorum === 'menunggu' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[10px] font-bold text-[#D97706]">
                            <Clock size={11} />
                            <span>Menunggu ({market.laporanValid}/10)</span>
                          </span>
                        )}
                        {market.statusKuorum === 'belum_ada' && (
                          <span className="inline-flex items-center rounded-full bg-[#F0ECE4] px-2 py-0.5 text-[10px] font-bold text-[#706B62]">
                            <span>Belum Ada</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link
                          href={`/dashboard/laporan-warga/${market.id}?komoditas=${encodeURIComponent(
                            selectedCommodity
                          )}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#67151D] hover:underline"
                        >
                          <span>Rincian</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </GISLayout>
  );
}
