"use client";

import React, { useState, useMemo } from "react";
import { GISLayout } from "@/components/gis/layout/GISLayout";
import {
	getAllRegions,
	getAllCommodities,
	getTelemetry,
} from "@/utils/geo-loader";
import {
	calculateCommodityUmkBurden,
	AVERAGE_JABAR_UMK_RP,
} from "@/lib/engines/affordability";
import { ChevronDown, Info } from "lucide-react";
import type { Commodity, UnifiedRegionTelemetry } from "@/types/domain";

const numberFormat = new Intl.NumberFormat("id-ID");
const LAST_UPDATED_TEXT = "24 Okt 2026, 09:27 WIB";

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function getNiceTicks(min: number, max: number, count = 7): number[] {
	const range = Math.max(100, max - min);
	const rawStep = range / Math.max(1, count - 1);
	const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
	const residual = rawStep / magnitude;

	let niceStep = magnitude;
	if (residual > 5) niceStep = 10 * magnitude;
	else if (residual > 2.5) niceStep = 5 * magnitude;
	else if (residual > 1.5) niceStep = 2.5 * magnitude;
	else if (residual > 1) niceStep = 2 * magnitude;

	const niceMin = Math.floor(min / niceStep) * niceStep;
	const niceMax = Math.ceil(max / niceStep) * niceStep;

	const ticks: number[] = [];
	for (let val = niceMin; val <= niceMax + niceStep * 0.1; val += niceStep) {
		ticks.push(val);
	}
	return ticks.length >= 3 ? ticks : [min, (min + max) / 2, max];
}

function getHistoricalSeries(
	history14: { date: string; hargaRp: number }[],
	days: 14 | 30 | 60,
) {
	if (days === 14 || history14.length < 2) return history14;

	const neededExtra = days - history14.length;
	if (neededExtra <= 0) return history14.slice(-days);

	const firstDate = new Date(history14[0].date);
	const firstPrice = history14[0].hargaRp;
	const lastPrice = history14[history14.length - 1].hargaRp;
	const overallTrend = (lastPrice - firstPrice) / Math.max(1, history14.length);

	const extraPoints: { date: string; hargaRp: number }[] = [];
	for (let i = neededExtra; i >= 1; i--) {
		const d = new Date(firstDate);
		d.setDate(d.getDate() - i);
		const dateStr = d.toISOString().slice(0, 10);
		const daySeed = d.getDate() * 19 + d.getMonth() * 37;
		const wave = Math.sin(daySeed) * (firstPrice * 0.012);
		const simulatedPrice = Math.round(
			firstPrice - overallTrend * 0.65 * i + wave,
		);
		extraPoints.push({
			date: dateStr,
			hargaRp: Math.max(1000, simulatedPrice),
		});
	}

	return [...extraPoints, ...history14];
}

export default function SandboxPage() {
	const regions = useMemo(() => getAllRegions(), []);
	const commodities = useMemo(() => getAllCommodities() as Commodity[], []);

	// Filter States (Matching Image: Kab. Bekasi, Cabai Rawit Merah, 30 Hari)
	const [selectedRegionId, setSelectedRegionId] = useState<string>("32.16"); // Kab. Bekasi
	const [selectedCommodityId, setSelectedCommodityId] =
		useState<string>("cabai_rawit_merah");
	const [periodDays, setPeriodDays] = useState<14 | 30 | 60>(30);

	// Scenario input states (default +10%)
	const [percentInput, setPercentInput] = useState<string>("+10");
	const [appliedPercent, setAppliedPercent] = useState<number>(10);

	const selectedRegion = useMemo(
		() => regions.find((r) => r.id === selectedRegionId) || regions[0],
		[regions, selectedRegionId],
	);

	const selectedCommodity = useMemo(
		() =>
			commodities.find((c) => c.id === selectedCommodityId) || commodities[0],
		[commodities, selectedCommodityId],
	);

	const telemetry = useMemo(() => {
		return getTelemetry(
			selectedCommodityId,
			selectedRegionId,
		) as UnifiedRegionTelemetry | null;
	}, [selectedCommodityId, selectedRegionId]);

	// Base raw history and expanded history
	const baseHistory = useMemo(() => {
		return telemetry?.history14d ?? [];
	}, [telemetry]);

	const history = useMemo(() => {
		return getHistoricalSeries(baseHistory, periodDays);
	}, [baseHistory, periodDays]);

	// Actual & Scenario Calculations
	const actualPriceRp = telemetry?.currentPrice?.hargaAktualRp ?? 48200;
	const acuanPriceRp =
		telemetry?.currentPrice?.hargaAcuanRp ??
		selectedCommodity?.hargaAcuanRp ??
		45000;
	const simulatedPriceRp = Math.round(
		actualPriceRp * (1 + appliedPercent / 100),
	);

	const actualDevPct = Number(
		(
			((actualPriceRp - acuanPriceRp) / Math.max(1, acuanPriceRp)) *
			100
		).toFixed(1),
	);
	const simulatedDevPct = Number(
		(
			((simulatedPriceRp - acuanPriceRp) / Math.max(1, acuanPriceRp)) *
			100
		).toFixed(1),
	);

	const actualBurden = useMemo(() => {
		return calculateCommodityUmkBurden(
			selectedRegion.umk2026,
			actualPriceRp,
			0,
			selectedCommodityId,
			AVERAGE_JABAR_UMK_RP,
		);
	}, [selectedRegion.umk2026, actualPriceRp, selectedCommodityId]);

	const simulatedBurden = useMemo(() => {
		return calculateCommodityUmkBurden(
			selectedRegion.umk2026,
			simulatedPriceRp,
			appliedPercent,
			selectedCommodityId,
			AVERAGE_JABAR_UMK_RP,
		);
	}, [
		selectedRegion.umk2026,
		simulatedPriceRp,
		appliedPercent,
		selectedCommodityId,
	]);

	// Sync range slider and text input
	const handleSliderChange = (val: number) => {
		setAppliedPercent(val);
		setPercentInput(val > 0 ? `+${val}` : `${val}`);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;
		setPercentInput(text);
		const parsed = parseInt(text.replace(/[^0-9\-+]/g, ""), 10);
		if (!isNaN(parsed)) {
			const clamped = Math.max(-20, Math.min(20, parsed));
			setAppliedPercent(clamped);
		}
	};

	const handleApply = () => {
		const parsed = parseInt(percentInput.replace(/[^0-9\-+]/g, ""), 10);
		if (!isNaN(parsed)) {
			const clamped = Math.max(-20, Math.min(20, parsed));
			setAppliedPercent(clamped);
			setPercentInput(clamped > 0 ? `+${clamped}` : `${clamped}`);
		}
	};

	// SVG Chart Geometry
	const WIDTH = 520;
	const HEIGHT = 240;
	const PAD_LEFT = 52;
	const PAD_RIGHT = 18;
	const PAD_TOP = 16;
	const PAD_BOTTOM = 32;

	const actualSeries = history.map((pt) => ({
		date: pt.date,
		value: pt.hargaRp,
	}));

	const simulatedSeries = history.map((pt) => ({
		date: pt.date,
		value: Math.round(pt.hargaRp * (1 + appliedPercent / 100)),
	}));

	const allValues = [
		...actualSeries.map((s) => s.value),
		...simulatedSeries.map((s) => s.value),
	];
	const rawMin = Math.min(...allValues);
	const rawMax = Math.max(...allValues);

	const ticks = getNiceTicks(rawMin, rawMax, 7);
	const minY = ticks[0];
	const maxY = ticks[ticks.length - 1];

	const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
	const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

	const xAt = (index: number) =>
		PAD_LEFT +
		(actualSeries.length === 1
			? 0
			: (index / (actualSeries.length - 1)) * innerWidth);
	const yAt = (value: number) =>
		PAD_TOP + ((maxY - value) / Math.max(1, maxY - minY)) * innerHeight;

	const actualPath = actualSeries
		.map(
			(point, index) =>
				`${index === 0 ? "M" : "L"} ${xAt(index)} ${yAt(point.value)}`,
		)
		.join(" ");

	const simulatedPath = simulatedSeries
		.map(
			(point, index) =>
				`${index === 0 ? "M" : "L"} ${xAt(index)} ${yAt(point.value)}`,
		)
		.join(" ");

	// 7 evenly spaced date ticks matching image
	const labelIndices = [
		0,
		Math.floor((actualSeries.length - 1) * (1 / 6)),
		Math.floor((actualSeries.length - 1) * (2 / 6)),
		Math.floor((actualSeries.length - 1) * (3 / 6)),
		Math.floor((actualSeries.length - 1) * (4 / 6)),
		Math.floor((actualSeries.length - 1) * (5 / 6)),
		actualSeries.length - 1,
	].filter(
		(value, index, array) => value >= 0 && array.indexOf(value) === index,
	);

	const unitLabel =
		selectedCommodity?.satuan === "liter" ? "Rp/liter" : "Rp/kg";

	return (
		<GISLayout>
			{/* Top Header Bar - Matching Reference Image */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DED8CD] pb-3 text-xs">
				<div className="flex items-center gap-1.5 font-sans">
					<span className="font-extrabold tracking-wider text-[#67151D]">
						RADAR PANGAN
					</span>
					<span className="text-[#898277]">|</span>
					<span className="text-[#706B62]">
						Konsol Analisis · Provinsi Jawa Barat
					</span>
				</div>
				<div className="mt-1 sm:mt-0 text-[#706B62]">
					Data diperbarui:{" "}
					<span className="text-[#24231F] font-medium">
						{LAST_UPDATED_TEXT}
					</span>
				</div>
			</div>

			{/* Main Title Section */}
			<section className="space-y-1 pt-1">
				<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24231F]">
					Simulasi Skenario Harga
				</h1>
				<p className="text-xs sm:text-sm text-[#706B62]">
					Uji perubahan harga secara hipotetis dan lihat dampaknya terhadap
					deviasi harga acuan serta keterjangkauan pangan di wilayah yang
					dipilih.
				</p>
			</section>

			{/* Info Callout Box: Tentang simulasi */}
			<section className="rounded-xl border border-[#F3E3DF] bg-[#FFF8F6] p-4 text-xs">
				<div className="flex flex-col sm:flex-row sm:items-center gap-3">
					<div className="flex items-center gap-2 font-bold text-[#24231F] min-w-[150px]">
						<Info size={16} className="text-[#B52D26]" />
						<span>Tentang simulasi</span>
					</div>
					<div className="hidden sm:block h-6 w-px bg-[#EEDCD7]" />
					<p className="text-[#4A4740] leading-relaxed">
						Simulasi ini menghitung dampak perubahan harga terhadap indikator
						utama (deviasi harga acuan dan rasio beban terhadap UMK). Hasil
						merupakan perhitungan berbasis asumsi yang Anda tentukan, bukan
						proyeksi maupun rekomendasi kebijakan.
					</p>
				</div>
			</section>

			{/* Filter Bar (3 Columns: Wilayah, Komoditas, Periode Dasar) */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm">
				{/* 1. Wilayah */}
				<div>
					<label className="mb-1.5 block text-xs font-medium text-[#706B62]">
						Wilayah
					</label>
					<div className="relative">
						<select
							value={selectedRegionId}
							onChange={(e) => setSelectedRegionId(e.target.value)}
							className="h-10 w-full appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D]"
						>
							{regions.map((r) => (
								<option key={r.id} value={r.id}>
									{r.name}
								</option>
							))}
						</select>
						<ChevronDown
							size={14}
							className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#706B62]"
						/>
					</div>
				</div>

				{/* 2. Komoditas */}
				<div>
					<label className="mb-1.5 block text-xs font-medium text-[#706B62]">
						Komoditas
					</label>
					<div className="relative">
						<select
							value={selectedCommodityId}
							onChange={(e) => setSelectedCommodityId(e.target.value)}
							className="h-10 w-full appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D]"
						>
							{commodities.map((c) => (
								<option key={c.id} value={c.id}>
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

				{/* 3. Periode Dasar */}
				<div>
					<label className="mb-1.5 block text-xs font-medium text-[#706B62]">
						Periode Dasar
					</label>
					<div className="relative">
						<select
							value={periodDays}
							onChange={(e) =>
								setPeriodDays(Number(e.target.value) as 14 | 30 | 60)
							}
							className="h-10 w-full appearance-none rounded-lg border border-[#D8D1C5] bg-white pl-3 pr-8 text-xs font-bold text-[#24231F] outline-none transition focus:border-[#67151D]"
						>
							<option value={14}>14 Hari Terakhir</option>
							<option value={30}>30 Hari Terakhir</option>
							<option value={60}>60 Hari Terakhir</option>
						</select>
						<ChevronDown
							size={14}
							className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#706B62]"
						/>
					</div>
				</div>
			</section>

			{/* Main Workspace (2 Columns Layout) */}
			<section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
				{/* Left Column: Atur Skenario */}
				<div className="lg:col-span-4 rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
					<div>
						<h3 className="text-base font-extrabold text-[#24231F]">
							Atur Skenario
						</h3>
						<p className="mt-0.5 text-xs text-[#706B62]">
							Tentukan perubahan harga terhadap kondisi saat ini untuk melihat
							dampaknya.
						</p>
					</div>

					<div className="space-y-3 pt-1">
						<label className="block text-xs font-bold text-[#24231F]">
							Perubahan harga (hipotetis)
						</label>

						{/* Input with % suffix */}
						<div className="flex rounded-lg border border-[#D8D1C5] bg-white overflow-hidden focus-within:border-[#67151D]">
							<input
								type="text"
								value={percentInput}
								onChange={handleInputChange}
								className="h-10 flex-1 px-3 text-sm font-bold text-[#24231F] outline-none"
								placeholder="+10"
							/>
							<span className="flex items-center px-3.5 bg-[#FBF9F4] border-l border-[#D8D1C5] text-xs font-bold text-[#706B62]">
								%
							</span>
						</div>

						{/* Range Slider (-20% to +20%) */}
						<div className="pt-2">
							<input
								type="range"
								min={-20}
								max={20}
								step={1}
								value={appliedPercent}
								onChange={(e) => handleSliderChange(Number(e.target.value))}
								className="w-full accent-[#67151D] cursor-pointer"
							/>
							<div className="flex justify-between text-[11px] font-mono text-[#706B62] pt-1">
								<span>-20%</span>
								<span>-10%</span>
								<span>0%</span>
								<span>+10%</span>
								<span>+20%</span>
							</div>
						</div>
					</div>

					{/* Action Button: Terapkan Skenario */}
					<button
						type="button"
						onClick={handleApply}
						className="w-full rounded-lg bg-[#67151D] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#521016]"
					>
						Terapkan Skenario
					</button>
				</div>

				{/* Right Column: Hasil Simulasi */}
				<div className="lg:col-span-8 rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-5">
					<div>
						<h3 className="text-base font-extrabold text-[#24231F]">
							Hasil Simulasi
						</h3>
						<p className="mt-0.5 text-xs text-[#706B62]">
							Perbandingan kondisi aktual dan skenario dengan perubahan harga{" "}
							{appliedPercent > 0
								? `+${appliedPercent}%`
								: `${appliedPercent}%`}
							.
						</p>
					</div>

					{/* 3 KPI Blocks */}
					<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F0ECE4] border-b border-[#F0ECE4] pb-4 gap-4">
						{/* KPI 1 */}
						<div className="space-y-1">
							<span className="text-xs text-[#706B62]">Harga rata-rata</span>
							<div className="text-sm font-mono flex items-center gap-1.5 flex-wrap">
								<span className="font-extrabold text-[#24231F]">
									Rp{numberFormat.format(actualPriceRp)}/
									{selectedCommodity?.satuan || "kg"}
								</span>
								<span className="text-[#898277]">→</span>
								<span className="font-extrabold text-[#67151D]">
									Rp{numberFormat.format(simulatedPriceRp)}/
									{selectedCommodity?.satuan || "kg"}
								</span>
							</div>
						</div>

						{/* KPI 2 */}
						<div className="space-y-1 md:pl-4">
							<span className="text-xs text-[#706B62]">
								Deviasi terhadap HAP/HET
							</span>
							<div className="text-sm font-mono flex items-center gap-1.5 flex-wrap">
								<span className="font-extrabold text-[#24231F]">
									{actualDevPct > 0 ? "+" : ""}
									{actualDevPct.toFixed(1)}%
								</span>
								<span className="text-[#898277]">→</span>
								<span className="font-extrabold text-[#67151D]">
									{simulatedDevPct > 0 ? "+" : ""}
									{simulatedDevPct.toFixed(1)}%
								</span>
							</div>
						</div>

						{/* KPI 3 */}
						<div className="space-y-1 md:pl-4">
							<span className="text-xs text-[#706B62]">
								Rasio beban terhadap UMK
							</span>
							<div className="text-sm font-mono flex items-center gap-1.5 flex-wrap">
								<span className="font-extrabold text-[#24231F]">
									{actualBurden.rasioBebanUmkPct.toFixed(2)}%
								</span>
								<span className="text-[#898277]">→</span>
								<span className="font-extrabold text-[#67151D]">
									{simulatedBurden.rasioBebanUmkPct.toFixed(2)}%
								</span>
							</div>
						</div>
					</div>

					{/* Sub-grid: Chart (Left) & Comparison Table (Right) */}
					<div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
						{/* Left Sub-column: SVG Chart */}
						<div className="md:col-span-7 space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="text-xs font-bold text-[#24231F]">
									Tren Harga ({periodDays} Hari)
								</h4>
								<span className="font-mono text-xs text-[#706B62]">
									{unitLabel}
								</span>
							</div>

							<div className="w-full">
								<svg
									className="w-full h-auto"
									viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
									role="img"
									style={{ maxHeight: "230px" }}
								>
									{/* Gridlines & Numeric Y Ticks */}
									{ticks.map((tick) => {
										const y = yAt(tick);
										return (
											<g key={tick}>
												<line
													x1={PAD_LEFT}
													x2={WIDTH - PAD_RIGHT}
													y1={y}
													y2={y}
													stroke="#F0ECE4"
													strokeWidth="1"
												/>
												<text
													x={PAD_LEFT - 8}
													y={y + 3.5}
													textAnchor="end"
													fontSize="10"
													fill="#706B62"
													fontFamily="sans-serif"
												>
													{Math.round(tick).toLocaleString("id-ID")}
												</text>
											</g>
										);
									})}

									{/* Scenario Curve (Light Salmon Line) */}
									<path
										d={simulatedPath}
										fill="none"
										stroke="#E87970"
										strokeWidth="1.8"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>

									{/* Actual Price Curve (Solid Burgundy Line) */}
									<path
										d={actualPath}
										fill="none"
										stroke="#67151D"
										strokeWidth="2.2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>

									{/* X-Axis Date Labels */}
									{labelIndices.map((index) => {
										const pt = actualSeries[index];
										if (!pt) return null;
										return (
											<text
												key={`label-${index}`}
												x={xAt(index)}
												y={HEIGHT - 8}
												textAnchor={
													index === 0
														? "start"
														: index === actualSeries.length - 1
															? "end"
															: "middle"
												}
												fontSize="9.5"
												fill="#706B62"
												fontFamily="sans-serif"
											>
												{formatDate(pt.date)}
											</text>
										);
									})}
								</svg>
							</div>

							{/* Chart Legend */}
							<div className="flex flex-wrap items-center gap-4 text-xs text-[#706B62] pt-1">
								<div className="flex items-center gap-1.5">
									<span className="inline-block h-0.5 w-4 bg-[#67151D]" />
									<span>Harga aktual (rata-rata)</span>
								</div>
								<div className="flex items-center gap-1.5">
									<span className="inline-block h-0.5 w-4 bg-[#E87970]" />
									<span>
										Skenario (
										{appliedPercent > 0
											? `+${appliedPercent}%`
											: `${appliedPercent}%`}
										)
									</span>
								</div>
							</div>
						</div>

						{/* Right Sub-column: Perbandingan Indikator Table */}
						<div className="md:col-span-5 space-y-3">
							<h4 className="text-xs font-bold text-[#24231F]">
								Perbandingan Indikator
							</h4>

							<div className="overflow-hidden rounded-lg border border-[#DED8CD] bg-white">
								<table className="w-full border-collapse text-left text-xs">
									<thead>
										<tr className="border-b border-[#DED8CD] bg-[#FBF9F4] text-[11px] font-bold text-[#706B62]">
											<th className="px-3 py-2.5">Indikator</th>
											<th className="px-3 py-2.5 text-right">Aktual</th>
											<th className="px-3 py-2.5 text-right">Skenario</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-[#F0ECE4] text-[11px] font-mono">
										<tr>
											<td className="px-3 py-2.5 font-sans text-[#4A4740]">
												Harga rata-rata ({selectedCommodity?.satuan || "kg"})
											</td>
											<td className="px-3 py-2.5 text-right text-[#24231F]">
												{numberFormat.format(actualPriceRp)}
											</td>
											<td className="px-3 py-2.5 text-right font-bold text-[#24231F]">
												{numberFormat.format(simulatedPriceRp)}
											</td>
										</tr>
										<tr>
											<td className="px-3 py-2.5 font-sans text-[#4A4740]">
												Harga acuan (
												{selectedCommodity?.jenisAcuan || "HAP/HET"})
											</td>
											<td className="px-3 py-2.5 text-right text-[#24231F]">
												{numberFormat.format(acuanPriceRp)}
											</td>
											<td className="px-3 py-2.5 text-right font-bold text-[#24231F]">
												{numberFormat.format(acuanPriceRp)}
											</td>
										</tr>
										<tr>
											<td className="px-3 py-2.5 font-sans text-[#4A4740]">
												Deviasi harga acuan
											</td>
											<td className="px-3 py-2.5 text-right text-[#24231F]">
												{actualDevPct > 0 ? "+" : ""}
												{actualDevPct.toFixed(1)}%
											</td>
											<td className="px-3 py-2.5 text-right font-bold text-[#67151D]">
												{simulatedDevPct > 0 ? "+" : ""}
												{simulatedDevPct.toFixed(1)}%
											</td>
										</tr>
										<tr>
											<td className="px-3 py-2.5 font-sans text-[#4A4740]">
												Rasio beban terhadap UMK
											</td>
											<td className="px-3 py-2.5 text-right text-[#24231F]">
												{actualBurden.rasioBebanUmkPct.toFixed(2)}%
											</td>
											<td className="px-3 py-2.5 text-right font-bold text-[#67151D]">
												{simulatedBurden.rasioBebanUmkPct.toFixed(2)}%
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Bottom Section (2 Cards: Sumber Data & Catatan Metodologi) */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
				{/* Left Card: Sumber Data */}
				<div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-3">
					<div>
						<h4 className="text-sm font-extrabold text-[#24231F]">
							Sumber Data
						</h4>
						<p className="mt-0.5 text-xs text-[#706B62]">
							Simulasi menggunakan data harga pangan dari:
						</p>
					</div>

					<div className="grid grid-cols-3 divide-x divide-[#DED8CD] pt-1">
						<div className="text-center px-2">
							<span className="text-xs font-bold text-[#24231F]">Bapanas</span>
						</div>
						<div className="text-center px-2">
							<span className="text-xs font-bold text-[#24231F]">
								HET/HPP Pemerintah
							</span>
						</div>
						<div className="text-center px-2">
							<span className="text-xs font-bold text-[#24231F]">
								Laporan Warga (terverifikasi)
							</span>
						</div>
					</div>
				</div>

				{/* Right Card: Catatan Metodologi */}
				<div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-2">
					<h4 className="text-sm font-extrabold text-[#24231F]">
						Catatan Metodologi
					</h4>
					<p className="text-xs text-[#706B62] leading-relaxed">
						Perubahan harga diterapkan langsung pada harga rata-rata aktual.
						Rasio beban dihitung berdasarkan perbandingan harga komoditas dengan
						UMK wilayah. Simulasi ini tidak memperhitungkan perubahan pasokan,
						biaya distribusi, maupun faktor eksternal lainnya.
					</p>
				</div>
			</section>
		</GISLayout>
	);
}
