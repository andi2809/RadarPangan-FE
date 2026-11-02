'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { PriceForecastChart } from '@/components/gis/analysis/PriceForecastChart';
import { getAllRegions, getAllCommodities, getTelemetry } from '@/utils/geo-loader';
import {
  calculateH7Forecast,
  SEASONAL_MULTIPLIERS,
  type SeasonalScenario,
} from '@/lib/engines/forecasting';
import {
  calculateCommodityUmkBurden,
  AVERAGE_JABAR_UMK_RP,
} from '@/lib/engines/affordability';
import {
  Database,
  Search,
  ArrowUpDown,
  Layers,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ChartNoAxesCombined,
} from 'lucide-react';
import type { Commodity, UnifiedRegionTelemetry } from '@/types/domain';

const numberFormat = new Intl.NumberFormat('id-ID');

export default function WilayahDanRiwayatPage() {
  const regions = useMemo(() => getAllRegions(), []);
  const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
  const avgJabarUmkRp = useMemo(() => {
    if (!regions.length) return AVERAGE_JABAR_UMK_RP;
    return Math.round(regions.reduce((sum, r) => sum + r.umk2026, 0) / regions.length);
  }, [regions]);

  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.09'); // Default Kab. Cirebon
  const [selectedCommodity, setSelectedCommodity] = useState<string>('cabai_rawit_merah');
  const [seasonalScenario, setSeasonalScenario] = useState<SeasonalScenario>('normal');
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'name' | 'umk' | 'price' | 'burden' | 'status'>('burden');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const rawTelemetry = useMemo(
    () => getTelemetry(selectedCommodity) as Record<string, UnifiedRegionTelemetry>,
    [selectedCommodity]
  );

  const selectedCommodityObj = useMemo(
    () => commodities.find((c) => c.id === selectedCommodity) || commodities[0],
    [commodities, selectedCommodity]
  );

  const enrichedRegions = useMemo(() => {
    return regions.map((r) => {
      const telem = rawTelemetry[r.id];
      const history = telem?.history14d ?? [];
      const hargaAcuanRp = telem?.currentPrice?.hargaAcuanRp ?? selectedCommodityObj?.hargaAcuanRp ?? 45000;
      const supplyStatus = telem?.supply?.statusNeraca ?? 'seimbang';

      let forecastBundle = null;
      if (history.length >= 2) {
        try {
          forecastBundle = calculateH7Forecast(history, hargaAcuanRp, selectedCommodity, {
            seasonalScenario,
            supplyStatus,
          });
        } catch {
          forecastBundle = null;
        }
      }

      const currentPriceRp = telem?.currentPrice?.hargaAktualRp ?? 45000;
      const forecastPriceRp =
        forecastBundle?.multiWindow.calibratedH7Rp ??
        telem?.predictionH7?.hargaPrediksiH7Rp ??
        currentPriceRp;
      const kenaikanH7Pct =
        forecastBundle?.multiWindow.kenaikanH7Pct ??
        Number((((forecastPriceRp - currentPriceRp) / Math.max(1, currentPriceRp)) * 100).toFixed(2));
      const status = forecastBundle?.finalH7.status ?? telem?.currentPrice?.status ?? 'aman';

      const umkBurden = calculateCommodityUmkBurden(
        r.umk2026,
        forecastPriceRp,
        kenaikanH7Pct,
        selectedCommodity,
        avgJabarUmkRp
      );

      return {
        ...r,
        currentPriceRp,
        forecastPriceRp,
        hargaAcuanRp,
        status,
        supplyStatus,
        kenaikanH7Pct,
        history,
        forecastBundle,
        umkBurden,
      };
    });
  }, [regions, rawTelemetry, selectedCommodity, selectedCommodityObj, seasonalScenario, avgJabarUmkRp]);

  const activeRegionData = useMemo(
    () => enrichedRegions.find((r) => r.id === selectedRegionId) || enrichedRegions[0],
    [enrichedRegions, selectedRegionId]
  );

  const filteredRegions = useMemo(() => {
    return enrichedRegions
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        let valA: number | string = a.name;
        let valB: number | string = b.name;
        if (sortField === 'umk') {
          valA = a.umk2026;
          valB = b.umk2026;
        } else if (sortField === 'price') {
          valA = a.forecastPriceRp;
          valB = b.forecastPriceRp;
        } else if (sortField === 'burden') {
          valA = a.umkBurden.skorTekananDayaBeli;
          valB = b.umkBurden.skorTekananDayaBeli;
        } else if (sortField === 'status') {
          valA = a.status;
          valB = b.status;
        }
        return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });
  }, [enrichedRegions, search, sortField, sortAsc]);

  const handleSort = (field: 'name' | 'umk' | 'price' | 'burden' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <GISLayout>
      {/* Header Terpadu */}
      <section className="flex flex-col justify-between gap-4 border-b border-[#DED8CD] pb-6 xl:flex-row xl:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#67151D]">
            <ChartNoAxesCombined size={15} />
            Halaman Terpadu · Eksplorasi Wilayah &amp; Riwayat Multi-Window
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#24231F] sm:text-3xl">
            Eksplorasi 27 Kab/Kota Jawa Barat &amp; Riwayat Deret Waktu
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-[#706B62] sm:text-sm">
            Analisis deret waktu Adaptive Multi-Window (7, 30, dan 60 hari), proyeksi H+7 terkalibrasi musiman, serta perbandingan beban keterjangkauan terhadap UMK lokal di seluruh Jawa Barat.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#67151D] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#4C0D15]"
        >
          <Layers size={14} />
          <span>Kembali ke Peta GIS</span>
        </Link>
      </section>

      {/* Kontrol Filter Terpadu */}
      <section className="grid grid-cols-1 gap-3 rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#706B62]">
            Pilih Wilayah Fokus Grafik:
          </label>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs font-bold text-[#24231F] outline-none focus:border-[#67151D]"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} (UMK Rp{numberFormat.format(r.umk2026)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#706B62]">
            Komoditas Pokok:
          </label>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs font-bold text-[#24231F] outline-none focus:border-[#67151D]"
          >
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#706B62]">
            Skenario Pengali Musiman (M_musim):
          </label>
          <div className="flex h-10 rounded-lg border border-[#D8D1C5] bg-[#F8F4E9] p-1">
            {(Object.keys(SEASONAL_MULTIPLIERS) as SeasonalScenario[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSeasonalScenario(key)}
                className={`flex-1 rounded-md text-[11px] font-bold transition ${
                  seasonalScenario === key
                    ? 'bg-[#67151D] text-white shadow-sm'
                    : 'text-[#706B62] hover:bg-[#F0EBDE]'
                }`}
              >
                {SEASONAL_MULTIPLIERS[key].shortLabel}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian Atas: Grafik Riwayat Multi-Window & Rincian Rumus Wilayah Terpilih */}
      {activeRegionData && (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PriceForecastChart
              history={activeRegionData.history}
              forecast={activeRegionData.forecastBundle?.points ?? []}
              hargaAcuanRp={activeRegionData.hargaAcuanRp}
              unit={selectedCommodityObj?.satuan === 'liter' ? 'Rp/liter' : 'Rp/kg'}
              multiWindow={activeRegionData.forecastBundle?.multiWindow ?? null}
            />
          </div>

          <div className="space-y-4 rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm">
            <div className="border-b border-[#F0ECE4] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#67151D]">
                Audit Rumus Deterministik &amp; Daya Beli
              </span>
              <h3 className="mt-1 text-base font-extrabold text-[#24231F]">
                {activeRegionData.name}
              </h3>
              <p className="text-xs text-[#706B62]">
                {selectedCommodityObj?.name} · Status Neraca: {activeRegionData.supplyStatus}
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-[#F0ECE4] pb-2">
                <span className="font-sans text-[#706B62]">Harga Hari Ini (P_t):</span>
                <strong className="text-[#24231F]">
                  Rp{numberFormat.format(activeRegionData.currentPriceRp)}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#F0ECE4] pb-2">
                <span className="font-sans text-[#706B62]">Laju 7 Hari (r):</span>
                <strong className="text-[#67151D]">
                  {activeRegionData.forecastBundle
                    ? `${activeRegionData.forecastBundle.multiWindow.dailyRatePct > 0 ? '+' : ''}${activeRegionData.forecastBundle.multiWindow.dailyRatePct}% / hari`
                    : '—'}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#F0ECE4] pb-2">
                <span className="font-sans text-[#706B62]">Baseline H+7 (P_baseline):</span>
                <strong>
                  Rp
                  {numberFormat.format(
                    activeRegionData.forecastBundle?.multiWindow.baselineH7Rp ??
                      activeRegionData.forecastPriceRp
                  )}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#F0ECE4] pb-2">
                <span className="font-sans text-[#706B62]">Proyeksi Terkalibrasi (P̂_t+7):</span>
                <strong className="text-sm text-[#B52D26]">
                  Rp{numberFormat.format(activeRegionData.forecastPriceRp)}
                </strong>
              </div>
              <div className="flex justify-between border-b border-[#F0ECE4] pb-2">
                <span className="font-sans text-[#706B62]">Rasio Beban UMK:</span>
                <strong className="text-[#67151D]">
                  {activeRegionData.umkBurden.rasioBebanUmkPct.toFixed(2)}% UMK
                </strong>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="font-sans text-[#706B62]">Skor Tekanan Daya Beli:</span>
                <strong className="text-[#B52D26]">
                  {activeRegionData.umkBurden.skorTekananDayaBeli.toFixed(2)} (
                  {activeRegionData.umkBurden.penggandaUmk}x)
                </strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bagian Bawah: Tabel Komparasi 27 Kabupaten/Kota Jawa Barat */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[#67151D]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#24231F]">
              Matriks 27 Kabupaten/Kota Jawa Barat (Klik baris untuk melihat grafik riwayat)
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898277]"
            />
            <input
              type="text"
              placeholder="Cari kabupaten / kota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#D8D1C5] bg-white pl-9 pr-3 text-xs text-[#24231F] outline-none focus:border-[#67151D]"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[11px] font-extrabold uppercase tracking-wider text-[#706B62]">
                  <th className="px-4 py-3.5">Kode</th>
                  <th
                    className="cursor-pointer px-4 py-3.5 hover:text-[#67151D]"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Kabupaten / Kota</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3.5 text-right hover:text-[#67151D]"
                    onClick={() => handleSort('umk')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>UMK 2026</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-right">Harga Hari Ini</th>
                  <th
                    className="cursor-pointer px-4 py-3.5 text-right hover:text-[#67151D]"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Proyeksi H+7</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3.5 text-right hover:text-[#67151D]"
                    onClick={() => handleSort('burden')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Beban UMK &amp; Tekanan</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3.5 text-center hover:text-[#67151D]"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Status EWS</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE4] text-xs">
                {filteredRegions.map((reg) => {
                  const isKritis = reg.status === 'kritis';
                  const isWaspada = reg.status === 'waspada';
                  const isSelected = reg.id === selectedRegionId;

                  return (
                    <tr
                      key={reg.id}
                      onClick={() => setSelectedRegionId(reg.id)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'bg-[#F4E8E9]/70 font-semibold'
                          : 'hover:bg-[#FBF9F4]'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-[#706B62]">
                        {reg.id}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#24231F]">{reg.name}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#4A4740]">
                        Rp{numberFormat.format(reg.umk2026)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#24231F]">
                        Rp{numberFormat.format(reg.currentPriceRp)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#67151D]">
                        Rp{numberFormat.format(reg.forecastPriceRp)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <span className="font-bold text-[#24231F]">
                          {reg.umkBurden.rasioBebanUmkPct.toFixed(2)}% UMK
                        </span>
                        <span className="ml-1.5 text-[10px] text-[#706B62]">
                          (Skor {reg.umkBurden.skorTekananDayaBeli.toFixed(1)})
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            isKritis
                              ? 'bg-[#FBE7E4] text-[#DC4840]'
                              : isWaspada
                              ? 'bg-[#FBF0D7] text-[#96620A]'
                              : 'bg-[#E3F0E7] text-[#287653]'
                          }`}
                        >
                          {isKritis ? (
                            <ShieldAlert size={11} />
                          ) : isWaspada ? (
                            <AlertCircle size={11} />
                          ) : (
                            <CheckCircle2 size={11} />
                          )}
                          <span>{reg.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </GISLayout>
  );
}
