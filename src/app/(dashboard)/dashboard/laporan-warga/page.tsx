"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { GISLayout } from "@/components/gis/layout/GISLayout";
import {
	Search,
	ChevronDown,
	X,
	CheckCircle2,
	Clock,
	LayoutGrid,
	Filter,
	ArrowRight,
	Building2,
	Store,
	Layers,
	Check,
	ChevronsDown,
	ChevronsUp,
} from "lucide-react";
import {
	getAllRegionConsensusGroups,
	getAllMarketsMultiCommoditySummary,
	getAllOfficialMarketsConsensusByCommodity,
	COMMODITY_CONSENSUS_CONFIGS,
	type RegionConsensusGroup,
	type MarketMultiCommoditySummary,
	type MarketConsensusItem,
} from "@/data/mock/marketConsensus";

const numberFormat = new Intl.NumberFormat("id-ID");

export default function LaporanWargaPage() {
	// Mode tampilan:
	// 1. 'accordion': Hierarki Wilayah (27 Kabupaten/Kota -> 133 Pasar Tradisional) - REKOMENDASI UTAMA
	// 2. 'matrix': Matriks Komparasi Datar (Seluruh 133 Pasar)
	// 3. 'single': Audit Corong 3 Saringan (Fokus 1 Komoditas Tertentu)
	const [viewMode, setViewMode] = useState<"accordion" | "matrix" | "single">(
		"accordion",
	);

	const [search, setSearch] = useState<string>("");
	const [selectedRegionFilter, setSelectedRegionFilter] =
		useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "verified" | "unverified"
	>("all");

	// Single commodity mode state
	const [selectedCommodity, setSelectedCommodity] =
		useState<string>("Cabai Rawit Merah");
	const [activeTabSingle, setActiveTabSingle] = useState<
		"all" | "tercapai" | "belum_terverifikasi"
	>("all");

	// Data 1: Grup Hirarkis per Kabupaten/Kota (27 Wilayah & 133 Pasar Resmi)
	const allRegionGroups = useMemo(() => {
		return getAllRegionConsensusGroups();
	}, []);

	// Set Akordion Terbuka (Default: Buka 3 wilayah pertama: Kab. Bogor, Kab. Sukabumi, Kab. Bekasi)
	const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
		() => new Set(["32.01", "32.16", "32.73"]),
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

	// Filter Grup Wilayah berdasarkan Pencarian, Dropdown Wilayah & Status Kuorum
	const filteredRegionGroups = useMemo(() => {
		const q = search.trim().toLowerCase();

		return allRegionGroups
			.map((group) => {
				// Filter dropdown wilayah spesifik
				if (
					selectedRegionFilter !== "all" &&
					group.regionId !== selectedRegionFilter
				) {
					return null;
				}

				// Saring pasar dalam wilayah berdasarkan statusFilter
				const statusMatchedMarkets = group.markets.filter((m) => {
					if (statusFilter === "verified") {
						return m.quorumCoverage.reached > 0;
					}
					if (statusFilter === "unverified") {
						return m.quorumCoverage.reached === 0;
					}
					return true;
				});

				if (statusMatchedMarkets.length === 0) {
					return null;
				}

				// Filter pencarian teks (nama wilayah, nama pasar, atau kecamatan)
				if (!q) {
					return {
						...group,
						markets: statusMatchedMarkets,
					};
				}

				const regionMatch =
					group.regionName.toLowerCase().includes(q) ||
					group.regionId.includes(q) ||
					group.instansiPengelola.toLowerCase().includes(q);

				if (regionMatch) {
					return {
						...group,
						markets: statusMatchedMarkets,
					};
				}

				const textMatchedMarkets = statusMatchedMarkets.filter(
					(m) =>
						m.namaPasar.toLowerCase().includes(q) ||
						(m.kecamatan && m.kecamatan.toLowerCase().includes(q)),
				);

				if (textMatchedMarkets.length > 0) {
					return {
						...group,
						markets: textMatchedMarkets,
					};
				}

				return null;
			})
			.filter((g): g is RegionConsensusGroup => g !== null);
	}, [allRegionGroups, selectedRegionFilter, statusFilter, search]);

	// Data 2: Daftar Datar Seluruh 133 Pasar (untuk Mode Matriks)
	const allFlatMarkets = useMemo(() => {
		return allRegionGroups.flatMap((g) => g.markets);
	}, [allRegionGroups]);

	const filteredFlatMarkets = useMemo(() => {
		const q = search.trim().toLowerCase();

		return allFlatMarkets.filter((item) => {
			if (
				selectedRegionFilter !== "all" &&
				item.regionId !== selectedRegionFilter
			)
				return false;

			const matchSearch =
				!q ||
				item.namaPasar.toLowerCase().includes(q) ||
				item.kabupatenKota.toLowerCase().includes(q) ||
				(item.kecamatan && item.kecamatan.toLowerCase().includes(q));

			if (!matchSearch) return false;

			if (statusFilter === "all") return true;
			if (statusFilter === "verified") return item.quorumCoverage.reached > 0;
			if (statusFilter === "unverified") return item.quorumCoverage.reached === 0;

			return true;
		});
	}, [allFlatMarkets, selectedRegionFilter, statusFilter, search]);

	// Metrik Agregasi Status Kuorum (Terverifikasi vs Belum Terverifikasi)
	const verifiedMarketsCount = useMemo(() => {
		return allFlatMarkets.filter((m) => m.quorumCoverage.reached > 0).length;
	}, [allFlatMarkets]);

	const unverifiedMarketsCount = useMemo(() => {
		return allFlatMarkets.filter((m) => m.quorumCoverage.reached === 0).length;
	}, [allFlatMarkets]);

	// Status Buka/Tutup Seluruh Akordion Wilayah
	const isAllExpanded = useMemo(() => {
		if (filteredRegionGroups.length === 0) return false;
		return filteredRegionGroups.every((g) => expandedRegions.has(g.regionId));
	}, [filteredRegionGroups, expandedRegions]);

	const isAllCollapsed = useMemo(() => {
		if (filteredRegionGroups.length === 0) return false;
		return filteredRegionGroups.every((g) => !expandedRegions.has(g.regionId));
	}, [filteredRegionGroups, expandedRegions]);

	// Data 3: Data Single Komoditas (133 Pasar Resmi untuk Komoditas Terpilih)
	const marketsForSingleCommodity = useMemo(() => {
		return getAllOfficialMarketsConsensusByCommodity(selectedCommodity);
	}, [selectedCommodity]);

	const filteredSingleMarkets = useMemo(() => {
		const q = search.trim().toLowerCase();

		return marketsForSingleCommodity.filter((item) => {
			if (
				selectedRegionFilter !== "all" &&
				item.regionId !== selectedRegionFilter
			)
				return false;

			const matchSearch =
				!q ||
				item.namaPasar.toLowerCase().includes(q) ||
				item.kabupatenKota.toLowerCase().includes(q);

			if (!matchSearch) return false;

			if (activeTabSingle === "all") return true;
			if (activeTabSingle === "tercapai") return item.statusKuorum === "tercapai";
			if (activeTabSingle === "belum_terverifikasi")
				return item.statusKuorum !== "tercapai";
			return true;
		});
	}, [
		marketsForSingleCommodity,
		selectedRegionFilter,
		search,
		activeTabSingle,
	]);

	// Tab counts untuk single commodity view
	const singleCounts = useMemo(() => {
		const tercapai = marketsForSingleCommodity.filter(
			(m) => m.statusKuorum === "tercapai",
		).length;
		const belumTerverifikasi = marketsForSingleCommodity.filter(
			(m) => m.statusKuorum !== "tercapai",
		).length;
		return {
			all: marketsForSingleCommodity.length,
			tercapai,
			belumTerverifikasi,
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
			{
				masuk: 0,
				unik: 0,
				radius: 0,
				valid: 0,
				outlier: 0,
				duplikasi: 0,
				diLuar: 0,
			},
		);
	}, [marketsForSingleCommodity]);

	// Statistik Ringkasan Eksekutif se-Jawa Barat (133 Pasar di 27 Kab/Kota)
	const headlineStats = useMemo(() => {
		const totalReports = allRegionGroups.reduce(
			(acc, g) => acc + g.totalLaporanMasuk,
			0,
		);
		const totalValid = allRegionGroups.reduce(
			(acc, g) => acc + g.totalLaporanValid,
			0,
		);
		const readyMarkets = allFlatMarkets.filter(
			(m) => m.quorumCoverage.reached >= 3,
		).length;
		const partialMarkets = allFlatMarkets.filter(
			(m) => m.quorumCoverage.reached === 1 || m.quorumCoverage.reached === 2,
		).length;
		const blankMarkets = allFlatMarkets.filter(
			(m) => m.quorumCoverage.reached === 0,
		).length;

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
			<div className="space-y-4">
				{/* ========================================================================= */}
				{/* 1. TOP HEADER BAR (GOVTECH INSTITUTIONAL)                                */}
				{/* ========================================================================= */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 text-xs text-slate-500">
					<div className="flex items-center gap-2 font-sans">
						<span className="font-bold tracking-wider text-slate-900">
							RADAR PANGAN
						</span>
						<span className="text-slate-300">/</span>
						<span className="text-slate-600 font-medium">
							Konsol Pemantauan Kuorum Pasar Jawa Barat
						</span>
					</div>
					<div className="mt-1 sm:mt-0 flex items-center gap-2 text-slate-500">
						<span>
							Periode:{" "}
							<strong className="text-slate-900 font-medium">Hari ini</strong>
						</span>
						<span className="text-slate-300">|</span>
						<span>
							Diperbarui:{" "}
							<strong className="text-slate-900 font-medium">
								24 Okt 2026, 09:27 WIB
							</strong>
						</span>
					</div>
				</div>

				{/* ========================================================================= */}
				{/* 2. MAIN PAGE HEADING & MODE SWITCHER                                      */}
				{/* ========================================================================= */}
				<section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-1">
					<div className="space-y-1">
						<h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
							Pemantauan Partisipasi &amp; Kuorum Pasar
						</h1>
						<p className="text-xs lg:text-sm text-slate-500 max-w-3xl">
							Direktori resmi 133 pasar rakyat di 27 Kabupaten/Kota. Kuorum
							dihitung secara independen per jenis komoditas berdasarkan batas
							ambang minimal 10 laporan warga terverifikasi.
						</p>
					</div>

					{/* Understated Segmented Mode Switcher */}
					<div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium shrink-0 self-start md:self-auto">
						<button
							type="button"
							onClick={() => setViewMode("accordion")}
							className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
								viewMode === "accordion"
									? "bg-white text-slate-900 font-semibold shadow-xs"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<Building2 size={13} />
							<span>Hierarki Wilayah (27 Kab/Kota)</span>
						</button>

						<button
							type="button"
							onClick={() => setViewMode("matrix")}
							className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
								viewMode === "matrix"
									? "bg-white text-slate-900 font-semibold shadow-xs"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<LayoutGrid size={13} />
							<span>Matriks Lengkap (133 Pasar)</span>
						</button>

						<button
							type="button"
							onClick={() => setViewMode("single")}
							className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
								viewMode === "single"
									? "bg-white text-slate-900 font-semibold shadow-xs"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<Filter size={13} />
							<span>Corong Saringan</span>
						</button>
					</div>
				</section>

				{/* ========================================================================= */}
				{/* 3. INTERACTIVE FILTER CARDS: TAMPILKAN SEMUA | TERVERIFIKASI | BELUM TERVERIFIKASI */}
				{/* ========================================================================= */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
					{/* Card 1: Tampilkan Semua */}
					<button
						type="button"
						onClick={() => setStatusFilter("all")}
						className={`group text-left rounded-xl border p-4 transition-all duration-150 relative cursor-pointer ${
							statusFilter === "all"
								? "border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-sm"
								: "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
						}`}
					>
						<div className="flex items-start justify-between gap-2">
							<div className="space-y-1">
								<span className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500">
									Tampilkan Semua
								</span>
								<div className="flex items-baseline gap-2">
									<span className="text-2xl lg:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
										{allFlatMarkets.length}
									</span>
									<span className="text-xs font-medium text-slate-500">
										Pasar Pantauan
									</span>
								</div>
							</div>
							{statusFilter === "all" ? (
								<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
									<Check size={12} className="text-slate-900" />
									<span>Dipilih</span>
								</span>
							) : (
								<span className="text-[11px] text-slate-400 font-medium group-hover:text-slate-600 transition shrink-0">
									Klik untuk filter
								</span>
							)}
						</div>

						<div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
							<span>27 Kab/Kota se-Jawa Barat</span>
							<span className="font-mono text-slate-700 font-medium tabular-nums">
								{headlineStats.totalReports.toLocaleString("id-ID")} lap masuk
							</span>
						</div>
					</button>

					{/* Card 2: Terverifikasi */}
					<button
						type="button"
						onClick={() => setStatusFilter("verified")}
						className={`group text-left rounded-xl border p-4 transition-all duration-150 relative cursor-pointer ${
							statusFilter === "verified"
								? "border-emerald-600 bg-emerald-50/25 ring-2 ring-emerald-600/20 shadow-sm"
								: "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-xs"
						}`}
					>
						<div className="flex items-start justify-between gap-2">
							<div className="space-y-1">
								<div className="flex items-center gap-1.5">
									<span className="h-2 w-2 rounded-full bg-emerald-500" />
									<span className="block text-[11px] font-semibold tracking-wider uppercase text-emerald-800">
										Terverifikasi
									</span>
								</div>
								<div className="flex items-baseline gap-2">
									<span className="text-2xl lg:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
										{verifiedMarketsCount}
									</span>
									<span className="text-xs font-medium text-slate-500">
										Pasar Kuorum
									</span>
								</div>
							</div>
							{statusFilter === "verified" ? (
								<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 shrink-0">
									<Check size={12} className="text-emerald-800" />
									<span>Dipilih</span>
								</span>
							) : (
								<span className="text-[11px] text-emerald-700/80 font-medium group-hover:text-emerald-800 transition shrink-0">
									{Math.round(
										(verifiedMarketsCount / allFlatMarkets.length) * 100,
									)}
									% total
								</span>
							)}
						</div>

						<div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
							<span className="text-emerald-700 font-medium">
								Kuorum tercapai (&ge;10 lap sah)
							</span>
							<span className="font-mono text-slate-700 font-medium tabular-nums">
								{headlineStats.totalValid.toLocaleString("id-ID")} valid
							</span>
						</div>
					</button>

					{/* Card 3: Belum Terverifikasi */}
					<button
						type="button"
						onClick={() => setStatusFilter("unverified")}
						className={`group text-left rounded-xl border p-4 transition-all duration-150 relative cursor-pointer ${
							statusFilter === "unverified"
								? "border-amber-600 bg-amber-50/25 ring-2 ring-amber-600/20 shadow-sm"
								: "border-slate-200 bg-white hover:border-amber-200 hover:shadow-xs"
						}`}
					>
						<div className="flex items-start justify-between gap-2">
							<div className="space-y-1">
								<div className="flex items-center gap-1.5">
									<span className="h-2 w-2 rounded-full bg-amber-500" />
									<span className="block text-[11px] font-semibold tracking-wider uppercase text-amber-800">
										Belum Terverifikasi
									</span>
								</div>
								<div className="flex items-baseline gap-2">
									<span className="text-2xl lg:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
										{unverifiedMarketsCount}
									</span>
									<span className="text-xs font-medium text-slate-500">
										Perlu Partisipasi
									</span>
								</div>
							</div>
							{statusFilter === "unverified" ? (
								<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 shrink-0">
									<Check size={12} className="text-amber-800" />
									<span>Dipilih</span>
								</span>
							) : (
								<span className="text-[11px] text-amber-700/80 font-medium group-hover:text-amber-800 transition shrink-0">
									{Math.round(
										(unverifiedMarketsCount / allFlatMarkets.length) * 100,
									)}
									% pantauan
								</span>
							)}
						</div>

						<div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
							<span className="text-amber-700 font-medium">
								Belum kuorum (&lt;10 lap)
							</span>
							<span className="text-slate-500">
								Menunggu laporan warga
							</span>
						</div>
					</button>
				</section>

				{/* ========================================================================= */}
				{/* 4. UNIFIED CONTROL & FILTER TOOLBAR (LINEAR / GOVTECH STYLE)             */}
				{/* ========================================================================= */}
				{(viewMode === "accordion" || viewMode === "matrix") && (
					<section className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2.5 text-xs">
						{/* Left Cluster: Search & Region Dropdown */}
						<div className="flex flex-wrap items-center gap-2">
							{/* Search Input */}
							<div className="relative">
								<Search
									size={14}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
								/>
								<input
									type="text"
									placeholder="Cari pasar, kecamatan, atau daerah..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="h-9 w-60 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-7 text-xs text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white placeholder:text-slate-400"
								/>
								{search && (
									<button
										type="button"
										onClick={() => setSearch("")}
										className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
									>
										<X size={13} />
									</button>
								)}
							</div>

							{/* Dropdown Filter 27 Wilayah */}
							<div className="relative">
								<select
									value={selectedRegionFilter}
									onChange={(e) => setSelectedRegionFilter(e.target.value)}
									className="h-9 appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white cursor-pointer"
								>
									<option value="all">
										Semua Wilayah ({headlineStats.totalRegionsCount} Kab/Kota)
									</option>
									{allRegionGroups.map((g) => (
										<option key={g.regionId} value={g.regionId}>
											{g.regionName} ({g.totalMarkets} Pasar)
										</option>
									))}
								</select>
								<ChevronDown
									size={14}
									className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
								/>
							</div>
						</div>

						{/* Right Cluster: Segmented Filter & Accordion Controller */}
						<div className="flex flex-wrap items-center gap-2.5 self-start xl:self-auto">
							{/* Segmented Status Filter: 3 Pilihan Sesuai Permintaan */}
							<div className="inline-flex rounded-lg border border-slate-200/80 bg-slate-100 p-0.5 text-xs font-medium">
								<button
									type="button"
									onClick={() => setStatusFilter("all")}
									className={`px-3 py-1.5 rounded-md transition ${
										statusFilter === "all"
											? "bg-white text-slate-900 font-semibold shadow-2xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									Tampilkan Semua ({allFlatMarkets.length})
								</button>
								<button
									type="button"
									onClick={() => setStatusFilter("verified")}
									className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
										statusFilter === "verified"
											? "bg-white text-emerald-800 font-semibold shadow-2xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
									<span>Terverifikasi ({verifiedMarketsCount})</span>
								</button>
								<button
									type="button"
									onClick={() => setStatusFilter("unverified")}
									className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
										statusFilter === "unverified"
											? "bg-white text-amber-800 font-semibold shadow-2xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
									<span>Belum Terverifikasi ({unverifiedMarketsCount})</span>
								</button>
							</div>

							{/* Refined Accordion Expand/Collapse Controller */}
							{viewMode === "accordion" && (
								<div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
									<button
										type="button"
										onClick={expandAllRegions}
										className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
											isAllExpanded
												? "bg-white text-slate-900 font-semibold shadow-2xs"
												: "text-slate-600 hover:text-slate-900 hover:bg-white/50"
										}`}
										title="Buka seluruh 27 akordion wilayah"
									>
										<ChevronsDown size={13} className="text-slate-500" />
										<span>Buka Semua</span>
									</button>
									<button
										type="button"
										onClick={collapseAllRegions}
										className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
											isAllCollapsed
												? "bg-white text-slate-900 font-semibold shadow-2xs"
												: "text-slate-600 hover:text-slate-900 hover:bg-white/50"
										}`}
										title="Tutup seluruh akordion wilayah"
									>
										<ChevronsUp size={13} className="text-slate-500" />
										<span>Tutup Semua</span>
									</button>
								</div>
							)}
						</div>
					</section>
				)}

				{/* ========================================================================= */}
				{/* TAMPILAN 1: HIERARKI WILAYAH (AKORDION 27 KAB/KOTA x 133 PASAR)          */}
				{/* ========================================================================= */}
				{viewMode === "accordion" && (
					<section className="space-y-3 pt-1">
						{filteredRegionGroups.length === 0 ? (
							<div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-xs text-slate-500">
								<Store className="mx-auto h-8 w-8 text-slate-400 mb-2 opacity-50" />
								<p className="font-bold text-sm text-slate-900">
									Tidak ada wilayah atau pasar yang cocok
								</p>
								<p className="mt-1">
									Silakan sesuaikan kata kunci pencarian atau ubah filter
									kesiapan kuorum.
								</p>
							</div>
						) : (
							filteredRegionGroups.map((group) => {
								const isExpanded = expandedRegions.has(group.regionId);
								const readinessPct = Math.round(
									(group.activeQuorumMarkets / group.totalMarkets) * 100,
								);
								const isHighRegion =
									group.highReadinessMarkets >= 2 || readinessPct >= 40;
								const isZeroRegion = group.activeQuorumMarkets === 0;

								return (
									<div
										key={group.regionId}
										className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all duration-200"
									>
										{/* Accordion Region Header */}
										<button
											type="button"
											onClick={() => toggleRegion(group.regionId)}
											className={`w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3.5 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left ${
												isExpanded ? "border-b border-slate-200" : ""
											}`}
										>
											{/* Left: Administrative Code & Region Name */}
											<div className="flex items-center gap-3">
												<span className="font-mono text-[10.5px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
													{group.regionId}
												</span>
												<div>
													<div className="flex items-baseline gap-2 flex-wrap">
														<h3 className="text-sm lg:text-base font-bold text-slate-900">
															{group.regionName}
														</h3>
														<span className="text-xs text-slate-500 font-normal">
															&bull; {group.totalMarkets} pasar resmi
														</span>
													</div>
													<p className="text-[11px] text-slate-500 truncate mt-0.5">
														{group.instansiPengelola}
													</p>
												</div>
											</div>

											{/* Right: Reports & Refined Progress Track */}
											<div className="flex items-center justify-between sm:justify-end gap-5 text-xs shrink-0">
												{/* Reports Count */}
												<div className="text-right hidden sm:block">
													<span className="font-mono font-semibold text-xs text-slate-900 tabular-nums">
														{group.totalLaporanMasuk} lap
													</span>
													<span className="block text-[10.5px] text-slate-500 tabular-nums">
														{group.totalLaporanValid} valid
													</span>
												</div>

												{/* Refined Slender Progress Track */}
												<div className="w-32 lg:w-40 text-right space-y-1">
													<div className="flex items-center justify-between text-[11px]">
														<span
															className={`font-medium tabular-nums ${
																isHighRegion
																	? "text-emerald-700"
																	: isZeroRegion
																		? "text-slate-400"
																		: "text-amber-700"
															}`}
														>
															{group.activeQuorumMarkets} / {group.totalMarkets}{" "}
															aktif
														</span>
														<span className="font-mono text-[10.5px] text-slate-500 tabular-nums">
															{readinessPct}%
														</span>
													</div>
													<div className="h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
														<div
															className={`h-full rounded-full transition-all duration-300 ${
																isHighRegion
																	? "bg-emerald-600"
																	: isZeroRegion
																		? "bg-transparent"
																		: "bg-amber-500"
															}`}
															style={{ width: `${readinessPct}%` }}
														/>
													</div>
												</div>

												{/* Chevron Icon */}
												<div className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-slate-700 transition">
													<ChevronDown
														size={16}
														className={`transition-transform duration-200 ease-in-out ${
															isExpanded
																? "rotate-180 text-slate-900"
																: "rotate-0"
														}`}
													/>
												</div>
											</div>
										</button>

										{/* Accordion Region Expanded Body with CSS Grid Animation */}
										<div
											className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out ${
												isExpanded
													? "grid-rows-[1fr] opacity-100"
													: "grid-rows-[0fr] opacity-0 pointer-events-none"
											}`}
										>
											<div className="overflow-hidden min-h-0">
												<div className="overflow-x-auto">
													<table className="w-full border-collapse text-left text-xs">
														<thead>
															<tr className="border-b border-slate-200 bg-slate-50/60 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
																<th className="px-4 py-2.5 min-w-[200px]">
																	PASAR &amp; KECAMATAN
																</th>
																<th className="px-3 py-2.5 text-center min-w-[130px]">
																	STATUS PASAR
																</th>
																<th className="px-3 py-2.5 text-right min-w-[120px]">
																	CABAI RAWIT MERAH
																	<span className="block font-normal text-[9px] text-slate-400 lowercase">
																		hap rp 48.200
																	</span>
																</th>
																<th className="px-3 py-2.5 text-right min-w-[120px]">
																	BERAS MEDIUM
																	<span className="block font-normal text-[9px] text-slate-400 lowercase">
																		het rp 13.500
																	</span>
																</th>
																<th className="px-3 py-2.5 text-right min-w-[120px]">
																	BAWANG MERAH
																	<span className="block font-normal text-[9px] text-slate-400 lowercase">
																		hap rp 32.000
																	</span>
																</th>
																<th className="px-3 py-2.5 text-right min-w-[120px]">
																	TELUR AYAM RAS
																	<span className="block font-normal text-[9px] text-slate-400 lowercase">
																		hap rp 27.000
																	</span>
																</th>
																<th className="px-3 py-2.5 text-right min-w-[120px]">
																	MINYAK KEMASAN
																	<span className="block font-normal text-[9px] text-slate-400 lowercase">
																		hap rp 17.500
																	</span>
																</th>
																<th className="px-3 py-2.5 text-right min-w-[120px]">
																	MINYAK CURAH
																	<span className="block font-normal text-[9px] text-slate-400 lowercase">
																		het rp 15.700
																	</span>
																</th>
																<th className="px-4 py-2.5 text-right min-w-[110px]">
																	AKSI
																</th>
															</tr>
														</thead>
														<tbody className="divide-y divide-slate-100">
															{group.markets.map((market) => {
																const isHigh =
																	market.quorumCoverage.reached >= 3;
																const isZero =
																	market.quorumCoverage.reached === 0;

																return (
																	<tr
																		key={market.id}
																		className="hover:bg-slate-50/70 transition-colors"
																	>
																		{/* PASAR & KECAMATAN */}
																		<td className="px-4 py-3">
																			<div className="flex items-center gap-1.5 flex-wrap">
																				<span className="font-semibold text-xs lg:text-sm text-slate-900">
																					{market.namaPasar}
																				</span>
																				{market.isAnchorMarket && (
																					<span className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[9px] font-medium border border-slate-200">
																						Pasar Induk
																					</span>
																				)}
																			</div>
																			<span className="block text-[11px] text-slate-500 mt-0.5">
																				{market.kecamatan
																					? `Kec. ${market.kecamatan}`
																					: market.kabupatenKota}{" "}
																				&bull;{" "}
																				<span className="font-mono text-[10px] text-slate-400 tabular-nums">
																					{market.totalLaporanMasuk} lap (
																					{market.totalLaporanValid} valid)
																				</span>
																			</span>
																		</td>

																		{/* KESIAPAN KUORUM PASAR */}
																		<td className="px-3 py-3 text-center">
																			<div className="inline-block text-left w-full max-w-[110px] space-y-1">
																				<div className="flex items-center justify-between text-[10.5px]">
																					<span
																						className={`font-semibold tabular-nums ${
																							isHigh
																								? "text-emerald-700"
																								: isZero
																									? "text-slate-400"
																									: "text-amber-700"
																						}`}
																					>
																						{market.quorumCoverage.reached} / 6
																						Kuorum
																					</span>
																					<span className="font-mono text-[9px] text-slate-400 tabular-nums">
																						{market.quorumCoverage.percentage}%
																					</span>
																				</div>
																				<div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
																					<div
																						className={`h-full rounded-full ${
																							isHigh
																								? "bg-emerald-600"
																								: isZero
																									? "bg-transparent"
																									: "bg-amber-500"
																						}`}
																						style={{
																							width: `${market.quorumCoverage.percentage}%`,
																						}}
																					/>
																				</div>
																			</div>
																		</td>

																		{/* 6 KOLOM KOMODITAS (SCANNING OPTIMIZATION) */}
																		{COMMODITY_CONSENSUS_CONFIGS.map((cfg) => {
																			const commData =
																				market.commodities[cfg.id];
																			const isQuorum =
																				commData?.statusKuorum === "tercapai";
																			const isPending =
																				commData?.statusKuorum === "menunggu";

																			return (
																				<td
																					key={cfg.id}
																					className="px-3 py-3 text-right"
																				>
																					<Link
																						href={`/dashboard/laporan-warga/${market.id}?komoditas=${encodeURIComponent(
																							cfg.name,
																						)}`}
																						className="block py-0.5 px-1 rounded hover:bg-slate-100/80 transition"
																						title={`Buka audit saringan ${cfg.name} di ${market.namaPasar}`}
																					>
																						{isQuorum ? (
																							<div className="space-y-0.5">
																								<span className="font-mono font-bold text-xs text-slate-900 tabular-nums block">
																									Rp
																									{numberFormat.format(
																										commData.hargaWargaRp || 0,
																									)}
																								</span>
																								<span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono tabular-nums">
																									<span>
																										{commData.laporanValid} lap
																									</span>
																								</span>
																							</div>
																						) : isPending ? (
																							<div className="space-y-0.5">
																								<span className="font-mono font-medium text-[11px] text-slate-500 tabular-nums block italic">
																									{commData.hargaWargaRp
																										? `Rp${numberFormat.format(commData.hargaWargaRp)}`
																										: "—"}
																								</span>
																								<span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-mono tabular-nums">
																									<span>
																										{commData.laporanValid}/10
																										lap
																									</span>
																								</span>
																							</div>
																						) : (
																							<div className="space-y-0.5">
																								<span className="font-mono text-xs text-slate-300 block">
																									—
																								</span>
																								<span className="text-[10px] text-slate-400 font-mono block">
																									0 lap
																								</span>
																							</div>
																						)}
																					</Link>
																				</td>
																			);
																		})}

																		{/* DETAIL ACTION BUTTON */}
																		<td className="px-4 py-3 text-right whitespace-nowrap">
																			<Link
																				href={`/dashboard/laporan-warga/${market.id}`}
																				className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition"
																			>
																				<span>Detail Pasar</span>
																				<ArrowRight
																					size={11}
																					className="text-slate-400"
																				/>
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

						{/* Footer Status Bar */}
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-xs text-slate-500">
							<p>
								Dot hijau (
								<span className="text-emerald-600 font-bold">&bull;</span>)
								menandakan kuorum &ge;10 laporan terpenuhi dan konsensus harga
								sah. Dot kuning (
								<span className="text-amber-500 font-bold">&bull;</span>)
								menandakan proses pengumpulan data.
							</p>
							<span className="whitespace-nowrap font-medium text-slate-700 font-mono tabular-nums">
								Menampilkan {filteredRegionGroups.length} dari{" "}
								{allRegionGroups.length} Kabupaten/Kota (
								{headlineStats.totalMarketsCount} pasar resmi)
							</span>
						</div>
					</section>
				)}

				{/* ========================================================================= */}
				{/* TAMPILAN 2: MATRIKS KOMPARASI LENGKAP (133 PASAR TRADISIONAL DATAR)       */}
				{/* ========================================================================= */}
				{viewMode === "matrix" && (
					<section className="space-y-3 pt-1">
						<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
							<div className="overflow-x-auto">
								<table className="w-full border-collapse text-left text-xs">
									<thead>
										<tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
											<th className="px-4 py-3 min-w-[210px]">
												PASAR &amp; WILAYAH
											</th>
											<th className="px-3 py-3 text-center min-w-[140px]">
												STATUS KESIAPAN
											</th>
											<th className="px-3 py-3 text-right min-w-[120px]">
												CABAI RAWIT MERAH
												<span className="block font-normal text-[9px] text-slate-400 lowercase">
													hap rp 48.200
												</span>
											</th>
											<th className="px-3 py-3 text-right min-w-[120px]">
												BERAS MEDIUM
												<span className="block font-normal text-[9px] text-slate-400 lowercase">
													het rp 13.500
												</span>
											</th>
											<th className="px-3 py-3 text-right min-w-[120px]">
												BAWANG MERAH
												<span className="block font-normal text-[9px] text-slate-400 lowercase">
													hap rp 32.000
												</span>
											</th>
											<th className="px-3 py-3 text-right min-w-[120px]">
												TELUR AYAM RAS
												<span className="block font-normal text-[9px] text-slate-400 lowercase">
													hap rp 27.000
												</span>
											</th>
											<th className="px-3 py-3 text-right min-w-[120px]">
												MINYAK KEMASAN
												<span className="block font-normal text-[9px] text-slate-400 lowercase">
													hap rp 17.500
												</span>
											</th>
											<th className="px-3 py-3 text-right min-w-[120px]">
												MINYAK CURAH
												<span className="block font-normal text-[9px] text-slate-400 lowercase">
													het rp 15.700
												</span>
											</th>
											<th className="px-4 py-3 text-right min-w-[110px]">
												AKSI
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100 text-xs">
										{filteredFlatMarkets.map((market) => {
											const isHigh = market.quorumCoverage.reached >= 3;
											const isZero = market.quorumCoverage.reached === 0;

											return (
												<tr
													key={market.id}
													className="hover:bg-slate-50/70 transition-colors"
												>
													{/* PASAR & WILAYAH */}
													<td className="px-4 py-3">
														<span className="block font-semibold text-xs lg:text-sm text-slate-900">
															{market.namaPasar}
														</span>
														<span className="block text-[11px] text-slate-500">
															{market.kabupatenKota}{" "}
															{market.kecamatan ? `(${market.kecamatan})` : ""}
														</span>
														<span className="block text-[10px] font-mono text-slate-400 mt-0.5 tabular-nums">
															{market.totalLaporanMasuk} lap (
															{market.totalLaporanValid} valid)
														</span>
													</td>

													{/* KESIAPAN KUORUM PASAR */}
													<td className="px-3 py-3 text-center">
														<div className="inline-block text-left w-full max-w-[110px] space-y-1">
															<div className="flex items-center justify-between text-[10.5px]">
																<span
																	className={`font-semibold tabular-nums ${
																		isHigh
																			? "text-emerald-700"
																			: isZero
																				? "text-slate-400"
																				: "text-amber-700"
																	}`}
																>
																	{market.quorumCoverage.reached} / 6 Kuorum
																</span>
																<span className="font-mono text-[9px] text-slate-400 tabular-nums">
																	{market.quorumCoverage.percentage}%
																</span>
															</div>
															<div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
																<div
																	className={`h-full rounded-full ${
																		isHigh
																			? "bg-emerald-600"
																			: isZero
																				? "bg-transparent"
																				: "bg-amber-500"
																	}`}
																	style={{
																		width: `${market.quorumCoverage.percentage}%`,
																	}}
																/>
															</div>
														</div>
													</td>

													{/* 6 KOLOM KOMODITAS */}
													{COMMODITY_CONSENSUS_CONFIGS.map((cfg) => {
														const commData = market.commodities[cfg.id];
														const isQuorum =
															commData?.statusKuorum === "tercapai";
														const isPending =
															commData?.statusKuorum === "menunggu";

														return (
															<td key={cfg.id} className="px-3 py-3 text-right">
																<Link
																	href={`/dashboard/laporan-warga/${market.id}?komoditas=${encodeURIComponent(
																		cfg.name,
																	)}`}
																	className="block py-0.5 px-1 rounded hover:bg-slate-100/80 transition"
																	title={`Lihat audit ${cfg.name} di ${market.namaPasar}`}
																>
																	{isQuorum ? (
																		<div className="space-y-0.5">
																			<span className="font-mono font-bold text-xs text-slate-900 tabular-nums block">
																				Rp
																				{numberFormat.format(
																					commData.hargaWargaRp || 0,
																				)}
																			</span>
																			<span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono tabular-nums">
																				<span>{commData.laporanValid} lap</span>
																			</span>
																		</div>
																	) : isPending ? (
																		<div className="space-y-0.5">
																			<span className="font-mono font-medium text-[11px] text-slate-500 tabular-nums block italic">
																				{commData.hargaWargaRp
																					? `Rp${numberFormat.format(commData.hargaWargaRp)}`
																					: "—"}
																			</span>
																			<span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-mono tabular-nums">
																				<span>
																					{commData.laporanValid}/10 lap
																				</span>
																			</span>
																		</div>
																	) : (
																		<div className="space-y-0.5">
																			<span className="text-[10px] text-slate-400 font-mono block">
																				0 lap
																			</span>
																		</div>
																	)}
																</Link>
															</td>
														);
													})}

													{/* ACTION BUTTON */}
													<td className="px-4 py-3 text-right whitespace-nowrap">
														<Link
															href={`/dashboard/laporan-warga/${market.id}`}
															className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition"
														>
															<span>Detail Pasar</span>
															<ArrowRight
																size={11}
																className="text-slate-400"
															/>
														</Link>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1 text-xs text-slate-500 font-mono tabular-nums">
							<p>
								Menampilkan {filteredFlatMarkets.length} dari{" "}
								{allFlatMarkets.length} pasar tradisional resmi Jawa Barat.
							</p>
						</div>
					</section>
				)}

				{/* ========================================================================= */}
				{/* TAMPILAN 3: AUDIT FOKUS PER KOMODITAS TUNGGAL (CORONG 3 SARINGAN)         */}
				{/* ========================================================================= */}
				{viewMode === "single" && (
					<section className="space-y-3 pt-1">
						{/* Funnel Metrics Bar (Consistent Slate Numerics) */}
						<div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
							<div className="px-4 py-2 first:pl-0 space-y-1">
								<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									1. Laporan Masuk
								</span>
								<strong className="block text-2xl lg:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
									{funnelTotals.masuk}
								</strong>
								<span className="block text-[11px] text-slate-400">
									100% total diterima
								</span>
							</div>

							<div className="px-4 py-2 space-y-1">
								<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									2. Perangkat Unik
								</span>
								<strong className="block text-2xl lg:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
									{funnelTotals.unik}
								</strong>
								<span className="block text-[11px] text-slate-500">
									{funnelTotals.duplikasi} duplikasi ditahan
								</span>
							</div>

							<div className="px-4 py-2 space-y-1">
								<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									3. Dalam Radius &le; 3 km
								</span>
								<strong className="block text-2xl lg:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
									{funnelTotals.radius}
								</strong>
								<span className="block text-[11px] text-slate-500">
									{funnelTotals.diLuar} di luar radius
								</span>
							</div>

							<div className="px-4 py-2 last:pr-0 space-y-1">
								<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									4. Lolos Filter MAD
								</span>
								<strong className="block text-2xl lg:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
									{funnelTotals.valid}
								</strong>
								<span className="block text-[11px] text-slate-500">
									{funnelTotals.outlier} outlier dibuang
								</span>
							</div>
						</div>

						{/* Section Header & Filters */}
						<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
							<div>
								<h2 className="text-sm lg:text-base font-bold text-slate-900">
									Konsensus Khusus: {selectedCommodity}
								</h2>
								<p className="text-xs text-slate-500">
									Evaluasi 3 saringan konsensus anti-spekulan untuk{" "}
									{selectedCommodity} di 133 pasar Jawa Barat.
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								{/* Search */}
								<div className="relative">
									<Search
										size={14}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
									/>
									<input
										type="text"
										placeholder="Cari pasar atau wilayah..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className="h-9 w-52 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
									/>
								</div>

								{/* Dropdown Komoditas */}
								<div className="relative">
									<select
										value={selectedCommodity}
										onChange={(e) => setSelectedCommodity(e.target.value)}
										className="h-9 appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white cursor-pointer"
									>
										{COMMODITY_CONSENSUS_CONFIGS.map((cfg) => (
											<option key={cfg.id} value={cfg.dropdownLabel}>
												{cfg.dropdownLabel} ({cfg.satuan})
											</option>
										))}
									</select>
									<ChevronDown
										size={14}
										className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
									/>
								</div>
							</div>
						</div>

						{/* Neutral Underline Tabs: 3 Pilihan Terpadu */}
						<div className="flex items-center gap-4 border-b border-slate-200 text-xs">
							<button
								type="button"
								onClick={() => setActiveTabSingle("all")}
								className={`pb-2.5 font-medium transition ${
									activeTabSingle === "all"
										? "border-b-2 border-slate-900 text-slate-900 font-semibold"
										: "text-slate-500 hover:text-slate-800"
								}`}
							>
								Tampilkan Semua ({singleCounts.all})
							</button>
							<button
								type="button"
								onClick={() => setActiveTabSingle("tercapai")}
								className={`pb-2.5 font-medium transition flex items-center gap-1.5 ${
									activeTabSingle === "tercapai"
										? "border-b-2 border-slate-900 text-slate-900 font-semibold"
										: "text-slate-500 hover:text-slate-800"
								}`}
							>
								<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
								<span>Terverifikasi ({singleCounts.tercapai})</span>
							</button>
							<button
								type="button"
								onClick={() => setActiveTabSingle("belum_terverifikasi")}
								className={`pb-2.5 font-medium transition flex items-center gap-1.5 ${
									activeTabSingle === "belum_terverifikasi"
										? "border-b-2 border-slate-900 text-slate-900 font-semibold"
										: "text-slate-500 hover:text-slate-800"
								}`}
							>
								<span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
								<span>
									Belum Terverifikasi ({singleCounts.belumTerverifikasi})
								</span>
							</button>
						</div>

						{/* Table Single Commodity */}
						<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
							<div className="overflow-x-auto">
								<table className="w-full border-collapse text-left text-xs">
									<thead>
										<tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
											<th className="px-4 py-3">PASAR &amp; KAB/KOTA</th>
											<th className="px-3 py-3 text-right">LAPORAN MASUK</th>
											<th className="px-3 py-3 text-right">PERANGKAT UNIK</th>
											<th className="px-3 py-3 text-right">RADIUS &le; 3 KM</th>
											<th className="px-3 py-3 text-right">LOLOS MAD</th>
											<th className="px-4 py-3 text-right">HARGA WARGA</th>
											<th className="px-3 py-3 text-center">STATUS KUORUM</th>
											<th className="px-4 py-3 text-right">AKSI</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{filteredSingleMarkets.map((item) => {
											const isQuorum = item.statusKuorum === "tercapai";
											const isPending = item.statusKuorum === "menunggu";

											return (
												<tr
													key={item.id}
													className="hover:bg-slate-50/70 transition-colors"
												>
													<td className="px-4 py-3">
														<span className="font-semibold text-slate-900 block">
															{item.namaPasar}
														</span>
														<span className="text-[11px] text-slate-500 block">
															{item.kabupatenKota}
														</span>
													</td>
													<td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
														{item.laporanMasuk}
													</td>
													<td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
														{item.perangkatUnik}
													</td>
													<td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
														{item.radiusValid}
													</td>
													<td className="px-3 py-3 text-right font-mono tabular-nums font-semibold text-slate-900">
														{item.laporanValid}
													</td>
													<td className="px-4 py-3 text-right font-mono tabular-nums">
														{item.hargaWargaRp ? (
															<span className="font-bold text-slate-900">
																Rp{numberFormat.format(item.hargaWargaRp)}
															</span>
														) : (
															<span className="text-slate-300">—</span>
														)}
													</td>
													<td className="px-3 py-3 text-center">
														{isQuorum ? (
															<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
																<Check size={11} />
																<span>Kuorum Sah</span>
															</span>
														) : isPending ? (
															<span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200/60">
																<Clock size={10} />
																<span>{item.laporanValid} / 10 lap</span>
															</span>
														) : (
															<span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-200">
																0 / 10 lap
															</span>
														)}
													</td>
													<td className="px-4 py-3 text-right whitespace-nowrap">
														<Link
															href={`/dashboard/laporan-warga/${item.id}?komoditas=${encodeURIComponent(
																selectedCommodity,
															)}`}
															className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition"
														>
															<span>Detail Pasar</span>
															<ArrowRight
																size={11}
																className="text-slate-400"
															/>
														</Link>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</section>
				)}
			</div>
		</GISLayout>
	);
}
