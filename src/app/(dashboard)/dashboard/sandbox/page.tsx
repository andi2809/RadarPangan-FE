'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { FlaskConical, Sliders, RotateCcw, TrendingDown, Layers, Truck, DollarSign } from 'lucide-react';
import { getAllRegions, getTelemetry } from '@/utils/geo-loader';
import { simulateIntervention } from '@/lib/engines/what-if';
import type { UnifiedRegionTelemetry } from '@/types/domain';

const numberFormat = new Intl.NumberFormat('id-ID');

export default function SandboxPage() {
  const [subsidyPercent, setSubsidyPercent] = useState<number>(25);
  const [tonnageGpm, setTonnageGpm] = useState<number>(80);
  const [routeIntervention, setRouteIntervention] = useState<boolean>(true);

  const baseTelemetry = useMemo<UnifiedRegionTelemetry | null>(() => {
    const region = getAllRegions().find((item) => item.id === '32.16');
    const telemetry = getTelemetry('cabai_rawit_merah', '32.16') as UnifiedRegionTelemetry | null;
    if (!region || !telemetry) return null;
    return { ...telemetry, region };
  }, []);

  const simulation = useMemo(() => {
    if (!baseTelemetry) return null;
    return simulateIntervention({
      baseTelemetry,
      transportSubsidyPercent: subsidyPercent,
      marketOperationTonnage: tonnageGpm,
      distributionIntervention: routeIntervention,
    });
  }, [baseTelemetry, subsidyPercent, tonnageGpm, routeIntervention]);

  const baselinePriceRp = baseTelemetry?.currentPrice.hargaAktualRp ?? 0;
  const simulatedPriceRp = simulation?.simulatedPriceRp ?? baselinePriceRp;
  const totalReductionPct = simulation?.reductionPercentage ?? 0;
  const estimatedCostRp = Math.round(
    (subsidyPercent * 1500000) + (tonnageGpm * 120000) + (routeIntervention ? 18000000 : 0)
  );

  const handleReset = () => {
    setSubsidyPercent(25);
    setTonnageGpm(80);
    setRouteIntervention(true);
  };

  return (
    <GISLayout>
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end border-b border-[#DED8CD] pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#67151D]">
            <FlaskConical size={15} />
            What-If Sandbox & Dukungan Keputusan (DSS)
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-[#24231F]">
            Simulasi Skenario Kebijakan Intervensi Pasar
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#706B62] max-w-2xl">
            Eksperimenkan dampak subsidi ongkos angkut APBD, tonase Gerakan Pangan Murah (GPM), dan pembukaan koridor distribusi dari daerah surplus sebelum menerbitkan SK intervensi TPID.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#67151D] text-white text-xs font-bold hover:bg-[#4C0D15] transition shadow-sm"
        >
          <Layers size={14} />
          <span>Kembali ke Peta Spasial</span>
        </Link>
      </section>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Controls */}
        <div className="rounded-xl border border-[#DED8CD] bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
            <h3 className="text-sm font-extrabold text-[#24231F] flex items-center gap-2">
              <Sliders size={16} className="text-[#67151D]" />
              Parameter Intervensi Kebijakan
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-[#706B62] hover:text-[#67151D] flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Subsidi Ongkos Angkut */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#24231F]">Subsidi Ongkos Angkut Logistik</span>
              <span className="font-mono font-bold text-[#67151D] text-sm">{subsidyPercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={subsidyPercent}
              onChange={(e) => setSubsidyPercent(Number(e.target.value))}
              className="w-full accent-[#67151D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#898277]">
              <span>0% (Mandiri Pasar)</span>
              <span>25% (Rekomendasi TPID)</span>
              <span>50% (Maksimal APBD)</span>
            </div>
          </div>

          {/* Slider 2: Tonase GPM */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#24231F]">Alokasi Pasokan Gerakan Pangan Murah (GPM)</span>
              <span className="font-mono font-bold text-[#67151D] text-sm">{tonnageGpm} Ton</span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={tonnageGpm}
              onChange={(e) => setTonnageGpm(Number(e.target.value))}
              className="w-full accent-[#67151D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#898277]">
              <span>0 Ton</span>
              <span>250 Ton</span>
              <span>500 Ton (Cadangan Penuh)</span>
            </div>
          </div>

          {/* Toggle: Buka Rute Distribusi */}
          <div className="space-y-2 border-t border-[#F0ECE4] pt-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#24231F] block">
                  Mobilisasi Koridor Pasokan Darurat
                </span>
                <span className="text-[11px] text-[#706B62] block">
                  Buka rute tol distribusi prioritas dari Kab. Garut menuju Kab. Bekasi
                </span>
              </div>
              <input
                type="checkbox"
                checked={routeIntervention}
                onChange={(e) => setRouteIntervention(e.target.checked)}
                className="size-5 accent-[#67151D] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right: Projected Impact Cards */}
        <div className="rounded-xl border border-[#DED8CD] bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-[#F0ECE4] pb-3">
            <h3 className="text-sm font-extrabold text-[#24231F]">
              Hasil Prediksi & Estimasi Dampak Pasar
            </h3>
            <p className="text-xs text-[#706B62] mt-0.5">
              Simulasi pergerakan harga Cabai Rawit Merah di Kab. Bekasi. Hasil bersifat simulasi, bukan data nyata.
            </p>
          </div>

          {/* Price Projection Card */}
          <div className="rounded-xl border border-[#27815A]/30 bg-[#E3F0E7] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#27815A] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown size={16} />
                Penurunan Harga yang Diharapkan
              </span>
              <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-white text-[#27815A]">
                -{totalReductionPct.toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono">
              <div>
                <span className="text-[11px] text-[#4D6655] font-sans block">Harga Saat Ini:</span>
                <span className="text-lg font-bold text-[#24231F] line-through opacity-70">
                  Rp {numberFormat.format(baselinePriceRp)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#4D6655] font-sans block">Hasil Simulasi Intervensi:</span>
                <span className="text-2xl font-extrabold text-[#27815A]">
                  Rp {numberFormat.format(simulatedPriceRp)}
                </span>
              </div>
            </div>
          </div>

          {/* Budget & Cost Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#DED8CD] bg-[#FBF9F4]">
              <div className="flex items-center gap-1.5 text-xs text-[#706B62] font-semibold">
                <DollarSign size={14} className="text-[#67151D]" />
                <span>Estimasi Biaya APBD</span>
              </div>
              <p className="mt-2 font-mono text-xl font-extrabold text-[#24231F]">
                Rp {numberFormat.format(estimatedCostRp)}
              </p>
              <p className="text-[10px] text-[#898277] mt-0.5">Termasuk subsidi angkut & logistik</p>
            </div>

            <div className="p-4 rounded-xl border border-[#DED8CD] bg-[#FBF9F4]">
              <div className="flex items-center gap-1.5 text-xs text-[#706B62] font-semibold">
                <Truck size={14} className="text-[#27815A]" />
                <span>Status Daya Beli UMK</span>
              </div>
              <p className="mt-2 font-mono text-xl font-extrabold text-[#27815A]">
                {baseTelemetry?.affordability.kategoriDayaBeli ?? 'TANPA DATA'}
              </p>
              <p className="text-[10px] text-[#898277] mt-0.5">
                {simulation
                  ? `Skor EWS ${baseTelemetry?.predictionH7.ewsScore ?? '—'} → ${simulation.simulatedEwsScore}`
                  : 'Data wilayah belum tersedia'}
              </p>
            </div>
          </div>

          {simulation ? (
            <p className="border-t border-[#F0ECE4] pt-3 text-[11px] leading-5 text-[#706B62]">
              {simulation.keteranganEfek}
            </p>
          ) : null}
        </div>
      </div>
    </GISLayout>
  );
}
