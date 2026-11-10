"use client";

import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";
import type { FeatureCollection } from "geojson";
import { GISLayout } from "@/components/gis/layout/GISLayout";
import { GISPageHeader } from "@/components/gis/overview/GISPageHeader";
import { GISMapWorkspace } from "@/components/gis/map/GISMapWorkspace";
import { GISMapCanvas } from "@/components/gis/map/GISMapCanvas";
import { RegionInsightPanel } from "@/components/gis/analysis/RegionInsightPanel";
import { RegionDetailSection } from "@/components/gis/detail/RegionDetailSection";
import { PriceForecastChart } from "@/components/gis/analysis/PriceForecastChart";
import {
	CommodityPriceTable,
	type CommodityPriceRow,
} from "@/components/gis/detail/CommodityPriceTable";
import { AffordabilityIndicator } from "@/components/gis/detail/AffordabilityIndicator";
import {
	loadIndonesiaGeoJson,
	getTelemetry,
	getAllRegions,
	getAllCommodities,
} from "@/utils/geo-loader";
import { calculateH7Forecast } from "@/lib/engines/forecasting";
import {
	calculateCommodityUmkBurden,
	AVERAGE_JABAR_UMK_RP,
} from "@/lib/engines/affordability";
import {
	loadCitizenReports,
	type ApprovedCitizenReport,
} from "@/utils/dual-source-store";
import { UnifiedRegionTelemetry, Commodity, PriceStatus } from "@/types/domain";

const numberFormat = new Intl.NumberFormat("id-ID");

function DashboardContent() {
	const searchParams = useSearchParams();
	const urlRegion = searchParams.get("region");

	const commodities = useMemo(() => getAllCommodities() as Commodity[], []);
	const allRegions = useMemo(() => getAllRegions(), []);
	const avgJabarUmkRp = useMemo(() => {
		if (!allRegions.length) return AVERAGE_JABAR_UMK_RP;
		return Math.round(
			allRegions.reduce((sum, reg) => sum + reg.umk2026, 0) / allRegions.length,
		);
	}, [allRegions]);

	const totalJabarPopulation = useMemo(() => {
		return allRegions.reduce((sum, reg) => sum + (reg.populasi || 0), 0);
	}, [allRegions]);

	const [commodity, setCommodity] = useState<string>("cabai_rawit_merah");
	const [period, setPeriod] = useState<"today" | "forecast">("today");
	const [selectedRegionId, setSelectedRegionId] = useState<string>(
		urlRegion || "all_jabar",
	);
	const [viewScope, setViewScope] = useState<"jabar" | "indonesia">("jabar");
	const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
	const [citizenReports, setCitizenReports] = useState<ApprovedCitizenReport[]>(
		[],
	);

	useEffect(() => {
		if (urlRegion) {
			setSelectedRegionId(urlRegion);
		}
	}, [urlRegion]);

	useEffect(() => {
		loadIndonesiaGeoJson()
			.then((data) => setGeoJson(data))
			.catch((err) =>
				console.error("Failed to load GeoJSON in /dashboard:", err),
			);
	}, []);

	useEffect(() => {
		const syncStore = () => {
			setCitizenReports(loadCitizenReports());
		};
		syncStore();
		window.addEventListener("radar-pangan-storage-update", syncStore);
		window.addEventListener("storage", syncStore);
		return () => {
			window.removeEventListener("radar-pangan-storage-update", syncStore);
			window.removeEventListener("storage", syncStore);
		};
	}, []);

	const rawTelemetry = useMemo(
		() => getTelemetry(commodity) as Record<string, UnifiedRegionTelemetry>,
		[commodity],
	);

	// Recalculate telemetry for all 27 Jabar regions with baseline model
	const allTelemetry = useMemo(() => {
		const result: Record<string, UnifiedRegionTelemetry> = {};

		allRegions.forEach((reg) => {
			const baseTelem = rawTelemetry[reg.id];
			if (!baseTelem) return;

			const history = baseTelem.history14d.map((pt) => ({ ...pt }));
			const hargaAcuanRp = baseTelem.currentPrice.hargaAcuanRp;
			const supplyStatus = baseTelem.supply.statusNeraca;

			const pt =
				history[history.length - 1]?.hargaRp ??
				baseTelem.currentPrice.hargaAktualRp;
			const currentSelisihRp = pt - hargaAcuanRp;
			const currentSelisihPersen = Number(
				((currentSelisihRp / hargaAcuanRp) * 100).toFixed(2),
			);

			let currentStatus: PriceStatus = "aman";
			if (supplyStatus === "defisit" || currentSelisihPersen > 10)
				currentStatus = "kritis";
			else if (currentSelisihPersen > 5) currentStatus = "waspada";
			else if (currentSelisihPersen < -5) currentStatus = "turun";

			try {
				const forecastOut = calculateH7Forecast(
					history,
					hargaAcuanRp,
					commodity,
					{
						seasonalScenario: "normal",
						supplyStatus,
					},
				);

				result[reg.id] = {
					...baseTelem,
					region: reg,
					history14d: history,
					currentPrice: {
						...baseTelem.currentPrice,
						hargaAktualRp: pt,
						hargaAcuanRp,
						selisihRp: currentSelisihRp,
						selisihPersen: currentSelisihPersen,
						status: currentStatus,
						movingAvg7d: forecastOut.multiWindow.ma7,
					},
					predictionH7: {
						...baseTelem.predictionH7,
						...forecastOut.finalH7,
						regionId: reg.id,
					},
				};
			} catch {
				result[reg.id] = { ...baseTelem, region: reg };
			}
		});

		return result;
	}, [allRegions, rawTelemetry, commodity]);

	const selectedCommodityObj = useMemo(
		() => commodities.find((c) => c.id === commodity) || commodities[0],
		[commodities, commodity],
	);

	// Check if viewing aggregated Jawa Barat or a specific region
	const isAllJabar = selectedRegionId === "all_jabar" || !selectedRegionId;
	const activeRegionTelemetry = !isAllJabar
		? allTelemetry[selectedRegionId]
		: null;

	// Determine if valid data exists for the selected view
	const hasData = isAllJabar
		? Object.keys(allTelemetry).length > 0
		: Boolean(activeRegionTelemetry?.currentPrice);

	const activeRegionName = isAllJabar
		? "Jawa Barat (27 Wilayah)"
		: activeRegionTelemetry?.region?.name || "Wilayah Pantauan";

	// Aggregate telemetry calculation across all Jabar regions
	const telemetryList = useMemo(
		() => Object.values(allTelemetry),
		[allTelemetry],
	);

	const jabarAggregates = useMemo(() => {
		if (!telemetryList.length) {
			return {
				avgCurrentPriceRp: 0,
				avgForecastPriceRp: 0,
				avgChangePercent: 0,
				effectiveHistory: [],
				forecastPoints: [],
				status: "aman" as PriceStatus,
			};
		}

		const totalCurrent = telemetryList.reduce(
			(sum, t) => sum + (t.currentPrice?.hargaAktualRp || 0),
			0,
		);
		const avgCurrentPriceRp = Math.round(totalCurrent / telemetryList.length);

		const totalForecast = telemetryList.reduce(
			(sum, t) => sum + (t.predictionH7?.hargaPrediksiH7Rp || 0),
			0,
		);
		const avgForecastPriceRp = Math.round(totalForecast / telemetryList.length);

		const acuan = selectedCommodityObj?.hargaAcuanRp || 45000;
		const avgChangePercent = Number(
			(((avgCurrentPriceRp - acuan) / Math.max(1, acuan)) * 100).toFixed(1),
		);

		// Calculate aggregated daily history
		const sampleHistory = telemetryList[0]?.history14d || [];
		const effectiveHistory = sampleHistory.map((pt, idx) => {
			const sumDay = telemetryList.reduce(
				(sum, t) => sum + (t.history14d[idx]?.hargaRp || pt.hargaRp),
				0,
			);
			return {
				date: pt.date,
				hargaRp: Math.round(sumDay / telemetryList.length),
			};
		});

		// Run baseline forecast for the aggregated Jabar series
		let forecastPoints: {
			date: string;
			hargaPrediksiRp: number;
			confidenceLowerRp: number;
			confidenceUpperRp: number;
		}[] = [];
		try {
			const fcBundle = calculateH7Forecast(effectiveHistory, acuan, commodity, {
				seasonalScenario: "normal",
				supplyStatus: "seimbang",
			});
			forecastPoints = fcBundle.points;
		} catch {
			forecastPoints = [];
		}

		// Determine overall Jabar status
		const criticalCount = telemetryList.filter(
			(t) =>
				(period === "today"
					? t.currentPrice?.status
					: t.predictionH7?.status) === "kritis",
		).length;
		const warningCount = telemetryList.filter(
			(t) =>
				(period === "today"
					? t.currentPrice?.status
					: t.predictionH7?.status) === "waspada",
		).length;

		let status: PriceStatus = "aman";
		if (criticalCount >= 5) status = "kritis";
		else if (warningCount >= 5) status = "waspada";

		return {
			avgCurrentPriceRp,
			avgForecastPriceRp,
			avgChangePercent,
			effectiveHistory,
			forecastPoints,
			status,
		};
	}, [telemetryList, selectedCommodityObj, commodity, period]);

	// Active prices, forecasts, and status depending on scope
	const currentPriceRp = isAllJabar
		? jabarAggregates.avgCurrentPriceRp
		: (activeRegionTelemetry?.currentPrice?.hargaAktualRp ?? 0);

	const forecastPriceRp = isAllJabar
		? jabarAggregates.avgForecastPriceRp
		: (activeRegionTelemetry?.predictionH7?.hargaPrediksiH7Rp ?? 0);

	const changePercent = isAllJabar
		? jabarAggregates.avgChangePercent
		: (activeRegionTelemetry?.predictionH7?.selisihPersen ??
			activeRegionTelemetry?.currentPrice?.selisihPersen ??
			0);

	const rawStatus: PriceStatus | undefined = isAllJabar
		? jabarAggregates.status
		: period === "today"
			? activeRegionTelemetry?.currentPrice?.status
			: activeRegionTelemetry?.predictionH7?.status;

	const activeStatus: "terkendali" | "waspada" | "kritis" | "tanpa_data" =
		!hasData || rawStatus === "tidak_ada_data"
			? "tanpa_data"
			: rawStatus === "kritis"
				? "kritis"
				: rawStatus === "waspada"
					? "waspada"
					: "terkendali";

	const riskStatusLabel: "KRITIS" | "WASPADA" | "TERKENDALI" =
		activeStatus === "kritis"
			? "KRITIS"
			: activeStatus === "waspada"
				? "WASPADA"
				: "TERKENDALI";

	const effectiveHargaAcuanRp =
		activeRegionTelemetry?.currentPrice?.hargaAcuanRp ??
		selectedCommodityObj?.hargaAcuanRp ??
		45000;

	const effectiveHistory = isAllJabar
		? jabarAggregates.effectiveHistory
		: (activeRegionTelemetry?.history14d ?? []);

	// Forecast bundle for specific region or null if Jabar aggregate
	const activeForecastBundle = useMemo(() => {
		if (isAllJabar) {
			return {
				points: jabarAggregates.forecastPoints,
				multiWindow: null,
			};
		}
		if (!activeRegionTelemetry) return null;
		try {
			return calculateH7Forecast(
				activeRegionTelemetry.history14d,
				activeRegionTelemetry.currentPrice.hargaAcuanRp,
				commodity,
				{
					seasonalScenario: "normal",
					supplyStatus: activeRegionTelemetry.supply.statusNeraca,
				},
			);
		} catch {
			return null;
		}
	}, [
		isAllJabar,
		jabarAggregates.forecastPoints,
		activeRegionTelemetry,
		commodity,
	]);

	// UMK Burden Calculation
	const effectiveUmkRp = isAllJabar
		? avgJabarUmkRp
		: (activeRegionTelemetry?.region?.umk2026 ?? avgJabarUmkRp);

	const effectivePopulation = isAllJabar
		? `${numberFormat.format(totalJabarPopulation)} jiwa`
		: activeRegionTelemetry?.region?.populasi
			? `${numberFormat.format(activeRegionTelemetry.region.populasi)} jiwa`
			: "—";

	const activeCommodityUmkBurden = useMemo(() => {
		if (!hasData) return null;
		const targetPrice = forecastPriceRp || currentPriceRp;
		return calculateCommodityUmkBurden(
			effectiveUmkRp,
			targetPrice,
			changePercent,
			commodity,
			avgJabarUmkRp,
		);
	}, [
		hasData,
		forecastPriceRp,
		currentPriceRp,
		changePercent,
		commodity,
		effectiveUmkRp,
		avgJabarUmkRp,
	]);

	// Dual-source Citizen Reports for active selection
	const activeCitizenReports = useMemo(() => {
		return citizenReports.filter((r) => {
			const matchCommodity = r.commodityId === commodity;
			if (isAllJabar) return matchCommodity;
			return matchCommodity && r.regionId === selectedRegionId;
		});
	}, [citizenReports, commodity, isAllJabar, selectedRegionId]);

	const activeCitizenReport = useMemo<ApprovedCitizenReport | null>(() => {
		const approved = activeCitizenReports.filter(
			(r) => r.statusApproval === "approved",
		);
		if (approved.length > 0) {
			const sortedPrices = approved
				.map((r) => r.hargaWargaRp)
				.sort((a, b) => a - b);
			const mid = Math.floor(sortedPrices.length / 2);
			const median =
				sortedPrices.length % 2 !== 0
					? sortedPrices[mid]
					: (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
			const latest = [...approved].sort((a, b) =>
				b.updatedAt.localeCompare(a.updatedAt),
			)[0];
			return {
				...latest,
				id:
					approved.length > 1
						? `MERGED-${latest.regionId}-${latest.commodityId}`
						: latest.id,
				namaPasar: isAllJabar ? "Konsensus Pasar Jawa Barat" : latest.namaPasar,
				hargaWargaRp: Math.round(median),
				jumlahLaporan: approved.reduce((sum, r) => sum + r.jumlahLaporan, 0),
			};
		}
		return (
			activeCitizenReports.find((r) => r.statusApproval === "pending") ||
			activeCitizenReports[0] ||
			null
		);
	}, [activeCitizenReports, isAllJabar]);

	// Commodity price list for bottom table
	const commodityRows = useMemo<CommodityPriceRow[]>(() => {
		return commodities.map((item) => {
			if (isAllJabar) {
				const itemTelemMap = getTelemetry(item.id) as Record<
					string,
					UnifiedRegionTelemetry
				>;
				const list = Object.values(itemTelemMap || {});
				if (!list.length) {
					return {
						name: item.name,
						unit: item.satuan,
						currentPriceRp: null,
						forecastPriceRp: null,
						changePct: null,
						status: "tidak_ada_data",
					};
				}
				const avgCurr = Math.round(
					list.reduce(
						(sum, t) => sum + (t.currentPrice?.hargaAktualRp || 0),
						0,
					) / list.length,
				);
				const avgFc = Math.round(
					list.reduce(
						(sum, t) => sum + (t.predictionH7?.hargaPrediksiH7Rp || 0),
						0,
					) / list.length,
				);
				const diff = Number(
					(((avgCurr - item.hargaAcuanRp) / item.hargaAcuanRp) * 100).toFixed(
						1,
					),
				);
				return {
					name: item.name,
					unit: item.satuan,
					currentPriceRp: avgCurr,
					forecastPriceRp: avgFc,
					changePct: diff,
					status: diff > 10 ? "kritis" : diff > 5 ? "waspada" : "aman",
				};
			}

			const telemetryMap = getTelemetry(item.id) as Record<
				string,
				UnifiedRegionTelemetry
			>;
			const telem =
				item.id === commodity
					? allTelemetry[selectedRegionId]
					: telemetryMap?.[selectedRegionId];

			return {
				name: item.name,
				unit: item.satuan,
				currentPriceRp: telem?.currentPrice?.hargaAktualRp ?? null,
				forecastPriceRp: telem?.predictionH7?.hargaPrediksiH7Rp ?? null,
				changePct: telem?.predictionH7?.selisihPersen ?? null,
				status: telem?.currentPrice?.status ?? "tidak_ada_data",
			};
		});
	}, [commodities, isAllJabar, commodity, allTelemetry, selectedRegionId]);

	const affordability = activeRegionTelemetry?.affordability;

	// Top 5 regions with highest price pressure vs HAP (EWS Shortcut)
	const topPressureRegions = useMemo(() => {
		return Object.values(allTelemetry)
			.filter((t) => t.region && t.currentPrice?.hargaAktualRp)
			.map((t) => {
				const price = t.currentPrice.hargaAktualRp;
				const acuan =
					t.currentPrice.hargaAcuanRp ||
					selectedCommodityObj?.hargaAcuanRp ||
					45000;
				const deviasiPct = Number(
					(((price - acuan) / Math.max(1, acuan)) * 100).toFixed(1),
				);
				return {
					id: t.region.id,
					name: t.region.name,
					currentPriceRp: price,
					hargaAcuanRp: acuan,
					deviasiPct,
					status: t.currentPrice.status,
				};
			})
			.sort((a, b) => b.deviasiPct - a.deviasiPct)
			.slice(0, 5);
	}, [allTelemetry, selectedCommodityObj]);

	// Map-first selection callback: clicking selected region again resets to All Jabar
	const handleSelectRegion = useCallback((regionId: string) => {
		setSelectedRegionId((prev) => (prev === regionId ? "all_jabar" : regionId));
	}, []);

	return (
		<GISLayout>
			{/* Header Judul Halaman */}
			<GISPageHeader />

			{/* Bagian Atas: Peta Interaktif Sebagai Elemen Utama */}
			<GISMapWorkspace
				commodity={commodity}
				setCommodity={setCommodity}
				period={period}
				setPeriod={setPeriod}
				selectedRegionId={selectedRegionId}
				onSelectRegion={handleSelectRegion}
				viewScope={viewScope}
				onSelectViewScope={setViewScope}
				showGisLink={false}
				activeRegionName={activeRegionName}
				activeStatus={activeStatus}
				currentPriceRp={currentPriceRp}
				forecastPriceRp={forecastPriceRp}
				umkBurdenPercent={
					activeCommodityUmkBurden?.rasioBebanUmkPct ??
					affordability?.umkRatioBasketPercent ??
					0
				}
				map={
					<GISMapCanvas
						geoJson={geoJson}
						allTelemetry={allTelemetry}
						activeHorizon={period === "today" ? "aktual" : "h7"}
						selectedRegionId={selectedRegionId}
						onSelectRegion={handleSelectRegion}
						viewScope={viewScope}
						onViewScopeChange={setViewScope}
						mode="preview"
					/>
				}
				insight={
					<RegionInsightPanel
						region={activeRegionName}
						commodity={selectedCommodityObj?.name || "Cabai Rawit Merah"}
						unit={selectedCommodityObj?.satuan || "kg"}
						currentPrice={currentPriceRp}
						hargaAcuanRp={effectiveHargaAcuanRp}
						jenisAcuan={selectedCommodityObj?.jenisAcuan || "HAP"}
						forecastPrice={forecastPriceRp}
						changePercent={changePercent}
						risk={riskStatusLabel}
						hasData={hasData}
						citizenReport={activeCitizenReport}
						multiWindow={activeForecastBundle?.multiWindow ?? null}
						topPressureRegions={topPressureRegions}
						selectedRegionId={selectedRegionId}
						onSelectRegion={handleSelectRegion}
					/>
				}
			/>

			{/* Bagian Bawah: Detail Komoditas Terpadu (Map-First Continuity) */}
			{!hasData ? (
				<section className="rounded-xl border border-[#DED8CD] bg-white p-8 text-center shadow-sm">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B]">
						<MapPin size={24} />
					</div>
					<h3 className="mt-3 text-base font-bold text-[#24231F]">
						Data Harga untuk {activeRegionName} Belum Tersedia
					</h3>
					<p className="mx-auto mt-1 max-w-md text-xs text-[#706B62]">
						Data harga untuk wilayah ini belum tersedia di basis data resmi
						Bapanas. Silakan pilih kabupaten/kota lain di Jawa Barat pada peta.
					</p>
					<button
						type="button"
						onClick={() => setSelectedRegionId("all_jabar")}
						className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#67151D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#521016]"
					>
						Tampilkan Agregasi Jawa Barat
					</button>
				</section>
			) : (
				<RegionDetailSection>
					{/* 1. Tren Harga + Estimasi */}
					<PriceForecastChart
						history={effectiveHistory}
						forecast={activeForecastBundle?.points ?? []}
						hargaAcuanRp={effectiveHargaAcuanRp}
						unit={
							selectedCommodityObj?.satuan === "liter" ? "Rp/liter" : "Rp/kg"
						}
						multiWindow={activeForecastBundle?.multiWindow ?? null}
						regionName={activeRegionName}
						periodDays={7}
					/>

					{/* 2. Daftar Harga Komoditas */}
					<CommodityPriceTable items={commodityRows} />

					{/* 3. Daya Beli & Rasio Beban UMK */}
					<AffordabilityIndicator
						regionName={activeRegionName}
						commodityName={selectedCommodityObj?.name || "Komoditas"}
						unit={selectedCommodityObj?.satuan || "kg"}
						population={effectivePopulation}
						umkRp={effectiveUmkRp}
						umkRatioBasketPercent={affordability?.umkRatioBasketPercent ?? 0}
						povertyBasketRatioPercent={
							affordability?.povertyBasketRatioPercent ?? 0
						}
						kategoriDayaBeli={
							affordability?.kategoriDayaBeli ?? "TIDAK_ADA_DATA"
						}
						commodityBurden={activeCommodityUmkBurden}
						hasData={hasData}
					/>
				</RegionDetailSection>
			)}
		</GISLayout>
	);
}

export default function DashboardPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-[#F7F5EF] p-8 text-center text-xs font-bold text-[#706B62]">
					Memuat Peta &amp; Data Pangan...
				</div>
			}
		>
			<DashboardContent />
		</Suspense>
	);
}
