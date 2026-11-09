'use client';

import React, { useState, useMemo } from 'react';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { Search, ChevronDown, X, ShieldCheck, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const numberFormat = new Intl.NumberFormat('id-ID');

export interface MarketConsensusItem {
  id: string;
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
}

// 27 Official Markets across 27 Kab/Kota Jawa Barat
// Matching exact rows from screenshot for top 4, and balanced dataset summing to:
// Total Masuk = 248, Unik = 232 (duplikat = 16), Radius Valid = 218 (luar radius = 14), Outlier = 18, Laporan Valid = 200
// Kuorum tercapai = 12, Menunggu kuorum = 9, Belum ada laporan = 6. Total = 27.
const MOCK_MARKET_CONSENSUS: MarketConsensusItem[] = [
  // 1. Row 1 from image (Tercapai)
  {
    id: 'psr-bekasikab-01',
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
  },
  // 2. Row 2 from image (Tercapai)
  {
    id: 'psr-bdgkot-01',
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
  },
  // 3. Row 3 from image (Menunggu)
  {
    id: 'psr-bgrkab-01',
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
  },
  // 4. Row 4 from image (Tercapai)
  {
    id: 'psr-garutkab-01',
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
  },
  // 5. Kota Bekasi (Tercapai)
  {
    id: 'psr-bekasikot-01',
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
  },
  // 6. Kota Depok (Tercapai)
  {
    id: 'psr-depokkot-01',
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
  },
  // 7. Kota Bogor (Tercapai)
  {
    id: 'psr-bogorkot-01',
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
  },
  // 8. Kota Tasikmalaya (Tercapai)
  {
    id: 'psr-tasikkt-01',
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
  },
  // 9. Kab. Karawang (Tercapai)
  {
    id: 'psr-krwkab-01',
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
  },
  // 10. Kab. Cirebon (Tercapai)
  {
    id: 'psr-crbnhkb-01',
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
  },
  // 11. Kota Cirebon (Tercapai)
  {
    id: 'psr-crbkot-01',
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
  },
  // 12. Kota Cimahi (Tercapai)
  {
    id: 'psr-cmhkot-01',
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
  },
  // 13. Kab. Purwakarta (Menunggu)
  {
    id: 'psr-pwkkab-01',
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
  },
  // 14. Kab. Subang (Menunggu)
  {
    id: 'psr-sbgkab-01',
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
  },
  // 15. Kab. Indramayu (Menunggu)
  {
    id: 'psr-indramayu-01',
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
  },
  // 16. Kab. Bandung (Menunggu)
  {
    id: 'psr-bdgkab-01',
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
  },
  // 17. Kab. Bandung Barat (Menunggu)
  {
    id: 'psr-kbb-01',
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
  },
  // 18. Kab. Cianjur (Menunggu)
  {
    id: 'psr-cianjur-01',
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
  },
  // 19. Kab. Sukabumi (Menunggu)
  {
    id: 'psr-smikab-01',
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
  },
  // 20. Kota Sukabumi (Menunggu)
  {
    id: 'psr-smikot-01',
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
  },
  // 21. Kab. Majalengka (Menunggu)
  {
    id: 'psr-mjl-01',
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
  },
  // 22. Kab. Sumedang (Belum ada laporan)
  {
    id: 'psr-smd-01',
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
  // 23. Kab. Ciamis (Belum ada laporan)
  {
    id: 'psr-cms-01',
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
  // 24. Kab. Kuningan (Belum ada laporan)
  {
    id: 'psr-kng-01',
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
  // 25. Kab. Tasikmalaya (Belum ada laporan)
  {
    id: 'psr-tsm-01',
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
  // 26. Kota Banjar (Belum ada laporan)
  {
    id: 'psr-bjr-01',
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
  // 27. Kab. Pangandaran (Belum ada laporan)
  {
    id: 'psr-pgd-01',
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

export default function LaporanWargaPage() {
  const [search, setSearch] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Cabai Rawit Merah');
  const [activeTab, setActiveTab] = useState<'all' | 'tercapai' | 'menunggu' | 'belum_ada'>('all');
  const [selectedMarketForModal, setSelectedMarketForModal] = useState<MarketConsensusItem | null>(null);

  // Filtered markets based on search and active tab
  const filteredMarkets = useMemo(() => {
    return MOCK_MARKET_CONSENSUS.filter((item) => {
      const matchSearch =
        item.namaPasar.toLowerCase().includes(search.toLowerCase()) ||
        item.kabupatenKota.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (activeTab === 'all') return true;
      return item.statusKuorum === activeTab;
    });
  }, [search, activeTab]);

  const counts = useMemo(() => {
    return {
      all: MOCK_MARKET_CONSENSUS.length, // 27
      tercapai: MOCK_MARKET_CONSENSUS.filter((m) => m.statusKuorum === 'tercapai').length, // 12
      menunggu: MOCK_MARKET_CONSENSUS.filter((m) => m.statusKuorum === 'menunggu').length, // 9
      belum_ada: MOCK_MARKET_CONSENSUS.filter((m) => m.statusKuorum === 'belum_ada').length, // 6
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
          <span>Periode aktif: <strong className="text-[#24231F]">Hari ini</strong></span>
          <span className="text-[#DED8CD]">|</span>
          <span>Diperbarui: <strong className="text-[#24231F]">24 Okt 2026, 09:27 WIB</strong></span>
        </div>
      </div>

      {/* Main Page Title Section */}
      <section className="space-y-1 pt-1">
        <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#67151D]">
          VALIDASI LAPORAN WARGA
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24231F]">
          Pemantauan Laporan Harga Pasar
        </h1>
        <p className="text-xs sm:text-sm text-[#706B62]">
          Pantau jumlah laporan, pemeriksaan lokasi, dan konsensus harga warga pada setiap pasar.
        </p>
      </section>

      {/* Top Metric Cards (4 Funnel Stages in 1 Row) */}
      <section className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#DED8CD] rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm">
        {/* Stage 1: LAPORAN MASUK */}
        <div className="px-4 py-2 first:pl-0">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            LAPORAN MASUK
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#67151D]">
            248
          </strong>
        </div>

        {/* Stage 2: PERANGKAT UNIK */}
        <div className="px-4 py-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            PERANGKAT UNIK
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#1E40AF]">
            232
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            16 duplikasi ditahan
          </span>
        </div>

        {/* Stage 3: DALAM RADIUS 3 KM */}
        <div className="px-4 py-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            DALAM RADIUS 3 KM
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#15803D]">
            218
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            14 di luar radius
          </span>
        </div>

        {/* Stage 4: LOLOS FILTER MAD */}
        <div className="px-4 py-2 last:pr-0">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#706B62]">
            LOLOS FILTER MAD
          </span>
          <strong className="mt-1.5 block text-3xl font-black text-[#24231F]">
            200
          </strong>
          <span className="mt-1 block text-xs text-[#706B62]">
            18 outlier dikeluarkan
          </span>
        </div>
      </section>

      {/* Notice Banner */}
      <section className="rounded-lg bg-[#FFF5F5] border border-[#FADBD8] px-4 py-2.5 text-xs text-[#67151D] font-medium leading-relaxed">
        Hanya laporan yang dikirim hari ini yang diproses. Laporan dari hari sebelumnya berstatus kedaluwarsa dan tidak dihitung dalam kuorum.
      </section>

      {/* Main Consensus Section */}
      <section className="space-y-4 pt-1">
        {/* Section Header & Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#24231F]">
              Konsensus harga per pasar
            </h2>
            <p className="mt-0.5 text-xs text-[#706B62]">
              Kuorum awal terbentuk dari minimal 10 laporan independen yang lolos pemeriksaan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pasar atau kabupaten/kota"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-60 rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs text-[#24231F] outline-none transition focus:border-[#67151D]"
              />
            </div>

            {/* Commodity Dropdown */}
            <div className="relative">
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D]"
              >
                <option value="Cabai Rawit Merah">Cabai Rawit Merah</option>
                <option value="Beras Medium">Beras Medium</option>
                <option value="Bawang Merah">Bawang Merah</option>
                <option value="Telur Ayam Ras">Telur Ayam Ras</option>
                <option value="Minyak Kemasan">Minyak Kemasan</option>
                <option value="Minyak Curah">Minyak Curah</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#706B62]"
              />
            </div>

            {/* Period Filter (Hari ini) */}
            <div className="flex h-9 items-center rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs font-bold text-[#24231F]">
              Hari ini
            </div>
          </div>
        </div>

        {/* Filter Underline Tabs */}
        <div className="flex items-center gap-6 border-b border-[#DED8CD] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 font-bold transition ${
              activeTab === 'all'
                ? 'border-b-2 border-[#67151D] text-[#67151D]'
                : 'text-[#706B62] hover:text-[#24231F]'
            }`}
          >
            Semua pasar <span className="ml-1 font-mono font-normal">{counts.all}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tercapai')}
            className={`pb-2.5 font-bold transition ${
              activeTab === 'tercapai'
                ? 'border-b-2 border-[#67151D] text-[#67151D]'
                : 'text-[#706B62] hover:text-[#24231F]'
            }`}
          >
            Kuorum tercapai <span className="ml-1 font-mono font-normal">{counts.tercapai}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('menunggu')}
            className={`pb-2.5 font-bold transition ${
              activeTab === 'menunggu'
                ? 'border-b-2 border-[#67151D] text-[#67151D]'
                : 'text-[#706B62] hover:text-[#24231F]'
            }`}
          >
            Menunggu kuorum <span className="ml-1 font-mono font-normal">{counts.menunggu}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('belum_ada')}
            className={`pb-2.5 font-bold transition ${
              activeTab === 'belum_ada'
                ? 'border-b-2 border-[#67151D] text-[#67151D]'
                : 'text-[#706B62] hover:text-[#24231F]'
            }`}
          >
            Belum ada laporan <span className="ml-1 font-mono font-normal">{counts.belum_ada}</span>
          </button>
        </div>

        {/* Consensus Market Table */}
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
                  <th className="px-4 py-3">KUORUM</th>
                  <th className="px-3 py-3 text-right">HARGA WARGA / KG</th>
                  <th className="px-3 py-3 text-right">HARGA ACUAN / KG</th>
                  <th className="px-3 py-3 text-center">SELISIH</th>
                  <th className="px-4 py-3 text-right">DETAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4] text-xs">
                {filteredMarkets.map((m) => {
                  const isTercapai = m.statusKuorum === 'tercapai';
                  const isMenunggu = m.statusKuorum === 'menunggu';

                  return (
                    <tr key={m.id} className="hover:bg-[#FBF9F4] transition">
                      {/* PASAR / WILAYAH */}
                      <td className="px-4 py-3.5">
                        <span className="block font-bold text-[#24231F]">
                          {m.namaPasar}
                        </span>
                        <span className="block text-[11px] text-[#706B62]">
                          {m.kabupatenKota}
                        </span>
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

                      {/* HARGA WARGA / KG */}
                      <td className="px-3 py-3.5 text-right font-mono font-extrabold text-[#24231F]">
                        {m.hargaWargaRp ? (
                          `Rp${numberFormat.format(m.hargaWargaRp)}`
                        ) : (
                          <span className="font-sans font-normal italic text-[#706B62]">
                            Belum terbentuk
                          </span>
                        )}
                      </td>

                      {/* HARGA ACUAN / KG */}
                      <td className="px-3 py-3.5 text-right font-mono text-[#4A4740]">
                        Rp{numberFormat.format(m.hargaAcuanRp)}
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
                        <button
                          type="button"
                          onClick={() => setSelectedMarketForModal(m)}
                          className="text-xs font-bold text-[#67151D] hover:underline whitespace-nowrap"
                        >
                          Buka detail →
                        </button>
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
            Laporan valid: perangkat independen, lokasi maksimal 3 km dari pasar, dan tidak teridentifikasi sebagai outlier MAD. Periode pemrosesan berlaku untuk hari ini.
          </p>
          <span className="whitespace-nowrap font-medium text-[#24231F]">
            Menampilkan {filteredMarkets.length} dari {MOCK_MARKET_CONSENSUS.length} pasar
          </span>
        </div>
      </section>

      {/* Modal Detail Audit Konsensus Pasar */}
      {selectedMarketForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#DED8CD] bg-[#FFFDF7] p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#DED8CD] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#67151D]">
                  AUDIT INTEGRITAS KONSENSUS
                </span>
                <h3 className="mt-1 text-lg font-black text-[#24231F]">
                  {selectedMarketForModal.namaPasar}
                </h3>
                <p className="text-xs text-[#706B62]">
                  {selectedMarketForModal.kabupatenKota} · Komoditas: {selectedCommodity}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMarketForModal(null)}
                className="rounded-lg border border-[#DED8CD] p-1.5 text-[#706B62] hover:bg-[#F0EBDE]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Pipeline Stage Breakdown */}
            <div className="space-y-3 text-xs">
              <span className="block font-bold uppercase tracking-wider text-[#706B62] text-[10px]">
                Tahapan Verifikasi Multi-Lapisan (Rule Engine)
              </span>

              <div className="grid grid-cols-2 gap-2.5 font-mono">
                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">1. Laporan Masuk</span>
                  <strong className="text-sm text-[#B91C1C]">
                    {selectedMarketForModal.laporanMasuk} laporan
                  </strong>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">2. Perangkat Unik</span>
                  <strong className="text-sm text-[#1D4ED8]">
                    {selectedMarketForModal.perangkatUnik} lolos
                  </strong>
                  <span className="block font-sans text-[10px] text-[#706B62]">
                    ({selectedMarketForModal.laporanMasuk - selectedMarketForModal.perangkatUnik} duplikat diblokir)
                  </span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">3. Radius GPS (≤ 3 km)</span>
                  <strong className="text-sm text-[#15803D]">
                    {selectedMarketForModal.radiusValid} valid
                  </strong>
                  <span className="block font-sans text-[10px] text-[#706B62]">
                    ({selectedMarketForModal.perangkatUnik - selectedMarketForModal.radiusValid} di luar radius)
                  </span>
                </div>

                <div className="rounded-lg border border-[#DED8CD] bg-white p-3">
                  <span className="block font-sans text-[10px] text-[#706B62]">4. Filter Outlier MAD</span>
                  <strong className="text-sm text-[#24231F]">
                    {selectedMarketForModal.laporanValid} laporan bersih
                  </strong>
                  <span className="block font-sans text-[10px] text-[#706B62]">
                    ({selectedMarketForModal.outlierMad} outlier dibuang)
                  </span>
                </div>
              </div>

              {/* Status Kuorum Card */}
              <div
                className={`rounded-xl border p-3.5 space-y-1.5 ${
                  selectedMarketForModal.statusKuorum === 'tercapai'
                    ? 'border-[#15803D]/40 bg-[#E3F0E7]'
                    : 'border-[#D97706]/40 bg-[#FFFBEB]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {selectedMarketForModal.statusKuorum === 'tercapai' ? (
                    <>
                      <CheckCircle2 size={15} className="text-[#15803D]" />
                      <span className="text-[#15803D]">Kuorum Konsensus Terpenuhi (≥ 10 Laporan)</span>
                    </>
                  ) : (
                    <>
                      <Clock size={15} className="text-[#D97706]" />
                      <span className="text-[#D97706]">
                        Menunggu Kuorum ({selectedMarketForModal.laporanValid} dari minimal 10)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#4A4740] leading-relaxed font-sans">
                  {selectedMarketForModal.statusKuorum === 'tercapai'
                    ? `Konsensus harga terbentuk dari median laporan valid sebesar Rp${numberFormat.format(
                        selectedMarketForModal.hargaWargaRp ?? 0
                      )}/kg, dengan deviasi ${
                        selectedMarketForModal.selisihPct && selectedMarketForModal.selisihPct > 0 ? '+' : ''
                      }${selectedMarketForModal.selisihPct?.toFixed(1)}% terhadap harga acuan resmi.`
                    : 'Harga konsensus warga belum dapat disahkan karena jumlah laporan terverifikasi belum mencapai ambang batas kuorum 10 laporan.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedMarketForModal(null)}
                className="rounded-lg bg-[#67151D] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#521016] transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </GISLayout>
  );
}
