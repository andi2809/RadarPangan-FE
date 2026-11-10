"use client";

import React, { useState, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { GISLayout } from "@/components/gis/layout/GISLayout";
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
	Building2,
	MapPin,
	Check,
} from "lucide-react";
import {
	getMarketSummaryById,
	getMarketDetailConsensus,
	COMMODITY_CONSENSUS_CONFIGS,
	type AuditReportItem,
	type MarketMultiCommoditySummary,
	type MarketDetailConsensusData,
} from "@/data/mock/marketConsensus";

const numberFormat = new Intl.NumberFormat("id-ID");
const LAST_UPDATED_TEXT = "24 Okt 2026, 09:27 WIB";

function DetailLaporanPasarContent() {
	const params = useParams();
	const searchParams = useSearchParams();

	const marketId = (params?.marketId as string) || "psr-bekasikab-01";
	const paramCommodity = searchParams?.get("komoditas") || "Cabai Rawit Merah";

	// Filters state
	const [selectedCommodity, setSelectedCommodity] =
		useState<string>(paramCommodity);
	const [tableFilter, setTableFilter] = useState<
		"all" | "valid" | "outlier" | "radius_invalid"
	>("all");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 5;

	// Ref untuk smooth scroll ke panel audit saat kartu komoditas diklik
	const auditSectionRef = useRef<HTMLDivElement | null>(null);

	// Accordion state for 3 verification steps
	const [openStep, setOpenStep] = useState<number | null>(null);

	const toggleStep = (stepNumber: number) => {
		setOpenStep(openStep === stepNumber ? null : stepNumber);
	};

	// 1. Data Ringkasan Makro Pasar (Single Source of Truth untuk 6 Komoditas)
	const marketSummary: MarketMultiCommoditySummary = useMemo(() => {
		return getMarketSummaryById(marketId);
	}, [marketId]);

	// 2. Data Audit Mendalam untuk Komoditas Terpilih
	const detailData: MarketDetailConsensusData = useMemo(() => {
		return getMarketDetailConsensus(marketId, selectedCommodity);
	}, [marketId, selectedCommodity]);

	// Handler saat kartu komoditas diklik di papan 6 komoditas
	const handleSelectCommodity = (commodityName: string) => {
		setSelectedCommodity(commodityName);
		setCurrentPage(1);
		setTableFilter("all");
		if (auditSectionRef.current) {
			auditSectionRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	// Filtered reports for individual audit table
	const filteredReports = useMemo(() => {
		if (tableFilter === "all") return detailData.auditReports;
		if (tableFilter === "valid")
			return detailData.auditReports.filter((r) => r.status === "valid");
		if (tableFilter === "outlier")
			return detailData.auditReports.filter((r) => r.status === "outlier");
		if (tableFilter === "radius_invalid")
			return detailData.auditReports.filter(
				(r) => r.status === "radius_invalid" || r.status === "duplicate",
			);
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
			valid: detailData.auditReports.filter((r) => r.status === "valid").length,
			outlier: detailData.auditReports.filter((r) => r.status === "outlier")
				.length,
			radius_invalid: detailData.auditReports.filter(
				(r) => r.status === "radius_invalid",
			).length,
			duplicate: detailData.auditReports.filter((r) => r.status === "duplicate")
				.length,
		};
	}, [detailData.auditReports]);

	const isTercapai = detailData.kpi.statusKuorum === "tercapai";
	const isMenunggu = detailData.kpi.statusKuorum === "menunggu";

	// Maksimum frekuensi untuk skala tinggi histogram
	const maxBinCount = useMemo(() => {
		if (!detailData.histogramBins.length) return 5;
		return Math.max(5, ...detailData.histogramBins.map((b) => b.count));
	}, [detailData.histogramBins]);

	const marketReadinessPct = marketSummary.quorumCoverage.percentage;
	const isHighReadiness = marketSummary.quorumCoverage.reached >= 3;
	const isZeroReadiness = marketSummary.quorumCoverage.reached === 0;

	return (
		<GISLayout>
			{/* Top Header Bar */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#DED8CD] pb-3 text-xs">
				<div className="flex items-center gap-1.5 font-sans">
					<span className="font-extrabold tracking-wider text-[#67151D]">
						RADAR PANGAN
					</span>
					<span className="text-[#898277]">|</span>
					<span className="text-[#706B62]">
						Konsol Analisis Pasar · Provinsi Jawa Barat
					</span>
				</div>
				<div className="mt-1 sm:mt-0 text-[#706B62] flex items-center gap-2">
					<span>
						Periode aktif: <strong className="text-[#24231F]">Hari ini</strong>
					</span>
					<span className="text-[#DED8CD]">|</span>
					<span>
						Diperbarui:{" "}
						<strong className="text-[#24231F]">{LAST_UPDATED_TEXT}</strong>
					</span>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* HERO SECTION: PROFIL PASAR & KESIAPAN KONSENSUS WILAYAH                  */}
			{/* ========================================================================= */}
			<section className="space-y-4 pt-1">
				{/* Navigation Breadcrumb */}
				<div>
					<Link
						href="/dashboard/laporan-warga"
						className="inline-flex items-center gap-1.5 text-xs font-bold text-[#67151D] hover:underline"
					>
						<ArrowLeft size={14} />
						<span>
							Kembali ke Daftar Pasar Jawa Barat ({marketSummary.kabupatenKota})
						</span>
					</Link>
				</div>

				{/* Hero Card Profil Pasar */}
				<div className="rounded-2xl border border-[#DED8CD] bg-gradient-to-br from-white via-[#FDFBF7] to-[#F7F3EB] p-5 sm:p-6 shadow-sm">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						{/* Info Kiri: Nama Pasar, Kecamatan, & Pengelola */}
						<div className="space-y-1.5">
							{marketSummary.isAnchorMarket && (
								<div className="flex items-center gap-2">
									<span className="rounded-full bg-[#FDF2F4] text-[#67151D] border border-[#F5C2C7] px-2.5 py-0.5 text-[10px] font-bold">
										Pasar Induk Acuan TPID
									</span>
								</div>
							)}

							<h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#24231F]">
								{marketSummary.namaPasar}
							</h1>

							<div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#706B62] pt-0.5">
								<div className="flex items-center gap-1.5">
									<MapPin size={13} className="text-[#67151D] shrink-0" />
									<span>
										{marketSummary.kecamatan
											? `Kec. ${marketSummary.kecamatan}, `
											: ""}
										<strong className="text-[#24231F]">
											{marketSummary.kabupatenKota}
										</strong>
									</span>
								</div>
								<span className="text-[#DED8CD]">&bull;</span>
								<span>
									ID:{" "}
									<span className="font-mono text-[#4A4740]">
										{marketSummary.id}
									</span>
								</span>
								<span className="text-[#DED8CD]">&bull;</span>
								<div className="flex items-center gap-1.5">
									<Building2 size={13} className="text-[#898277] shrink-0" />
									<span>
										Pengelola: {marketSummary.pengelola || "Dinas Perdagangan"}
									</span>
								</div>
							</div>
						</div>

						{/* Metrik Kanan: Kesiapan Kuorum & Volume Laporan Pasar */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto flex-shrink-0">
							{/* Metrik 1: Kesiapan Kuorum */}
							<div className="rounded-xl border border-[#DED8CD] bg-white p-3.5 shadow-xs space-y-1.5 min-w-[170px]">
								<span className="block text-[11px] font-bold text-[#706B62]">
									Kesiapan Kuorum Pasar
								</span>
								<div className="flex items-baseline justify-between">
									<span
										className={`text-xl font-black ${
											isHighReadiness
												? "text-[#15803D]"
												: isZeroReadiness
													? "text-[#898277]"
													: "text-[#D97706]"
										}`}
									>
										{marketSummary.quorumCoverage.reached} / 6
									</span>
									<span className="font-mono text-xs font-bold text-[#706B62]">
										{marketReadinessPct}%
									</span>
								</div>
								<div className="h-1.5 w-full rounded-full bg-[#EFEAE1] overflow-hidden">
									<div
										className={`h-full rounded-full transition-all duration-300 ${
											isHighReadiness
												? "bg-[#15803D]"
												: isZeroReadiness
													? "bg-transparent"
													: "bg-[#D97706]"
										}`}
										style={{ width: `${marketReadinessPct}%` }}
									/>
								</div>
								<span
									className={`inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
										isHighReadiness
											? "bg-[#E3F0E7] text-[#15803D]"
											: isZeroReadiness
												? "bg-[#F0ECE4] text-[#706B62]"
												: "bg-[#FFFBEB] text-[#D97706]"
									}`}
								>
									{isHighReadiness
										? "Kesiapan Tinggi"
										: isZeroReadiness
											? "Belum Ada Kuorum"
											: "Sebagian Kuorum"}
								</span>
							</div>

							{/* Metrik 2: Total Laporan Masuk */}
							<div className="rounded-xl border border-[#DED8CD] bg-white p-3.5 shadow-xs space-y-1 min-w-[150px]">
								<span className="block text-[11px] font-bold text-[#706B62]">
									Total Laporan Masuk
								</span>
								<span className="block text-xl font-black text-[#67151D]">
									{marketSummary.totalLaporanMasuk}{" "}
									<span className="text-xs font-normal text-[#706B62]">
										lap
									</span>
								</span>
								<span className="block text-[10px] text-[#898277]">
									Akumulasi seluruh komoditas
								</span>
							</div>

							{/* Metrik 3: Total Laporan Valid */}
							<div className="rounded-xl border border-[#DED8CD] bg-white p-3.5 shadow-xs space-y-1 min-w-[150px]">
								<span className="block text-[11px] font-bold text-[#706B62]">
									Lolos Saringan (Valid)
								</span>
								<span className="block text-xl font-black text-[#15803D]">
									{marketSummary.totalLaporanValid}{" "}
									<span className="text-xs font-normal text-[#706B62]">
										lap
									</span>
								</span>
								<span className="block text-[10px] text-[#898277]">
									{marketSummary.totalLaporanMasuk > 0
										? `${Math.round((marketSummary.totalLaporanValid / marketSummary.totalLaporanMasuk) * 100)}% tingkat validitas`
										: "Belum ada laporan"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ========================================================================= */}
			{/* PAPAN KONSENSUS KOMODITAS: TAMPILAN LEGA & INTERAKTIF                     */}
			{/* ========================================================================= */}
			<section className="space-y-3 pt-2">
				<div>
					<h2 className="text-lg font-extrabold text-[#24231F]">
						Papan Konsensus Komoditas
					</h2>
					<p className="text-xs text-[#706B62]">
						Perbandingan harga konsensus warga terhadap acuan HAP/HET Pemerintah
						untuk seluruh komoditas di {marketSummary.namaPasar}.
					</p>
				</div>

				{/* 6 Cards Grid (Tampilan Lega) */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
					{COMMODITY_CONSENSUS_CONFIGS.map((cfg) => {
						const commData = marketSummary.commodities[cfg.id];
						const isSelected =
							selectedCommodity.toLowerCase() === cfg.name.toLowerCase();
						const isQuorum = commData?.statusKuorum === "tercapai";
						const isPending = commData?.statusKuorum === "menunggu";
						const hasData = (commData?.laporanMasuk || 0) > 0;

						return (
							<div
								key={cfg.id}
								onClick={() => handleSelectCommodity(cfg.name)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleSelectCommodity(cfg.name);
									}
								}}
								className={`group relative rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
									isSelected
										? "border-2 border-[#67151D] bg-[#FDF8F8] shadow-md ring-2 ring-[#67151D]/15"
										: "border border-[#DED8CD] bg-white hover:border-[#B3ABA0] hover:shadow-sm hover:bg-[#FCFBF8]"
								}`}
							>
								{/* Card Top: Commodity Name, Benchmark, and Subtle Active Dot */}
								<div className="space-y-1">
									<div className="flex items-start justify-between gap-1.5">
										<h3
											className={`font-extrabold text-xs leading-snug transition-colors ${
												isSelected
													? "text-[#67151D]"
													: "text-[#24231F] group-hover:text-[#67151D]"
											}`}
										>
											{cfg.name}
										</h3>
										{isSelected ? (
											<span
												className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#67151D] text-white shadow-xs"
												title="Komoditas Aktif Diaudit"
											>
												<Check size={11} strokeWidth={3} />
											</span>
										) : (
											<span className="text-[10px] font-mono text-[#898277] whitespace-nowrap">
												/{cfg.satuan}
											</span>
										)}
									</div>

									<div className="text-[10px] text-[#706B62] flex items-center justify-between">
										<span>
											{cfg.jenisAcuan}:{" "}
											<strong className="font-bold text-[#24231F]">
												Rp{numberFormat.format(cfg.hargaAcuanRp)}
											</strong>
										</span>
										{isSelected && (
											<span className="text-[10px] font-mono text-[#898277]">
												/{cfg.satuan}
											</span>
										)}
									</div>
								</div>

								{/* Card Middle: Price & Quorum Status */}
								<div className="mt-3 pt-2.5 border-t border-[#F0ECE4] space-y-1.5">
									{isQuorum ? (
										<div>
											<span className="block text-lg font-black tracking-tight text-[#24231F]">
												Rp{numberFormat.format(commData.hargaWargaRp || 0)}
											</span>
											<span className="inline-flex items-center gap-1 rounded-full bg-[#E3F0E7] px-2 py-0.5 text-[10px] font-bold text-[#15803D]">
												<CheckCircle2 size={10} />
												<span>Kuorum Sah ({commData.laporanValid} lap)</span>
											</span>
										</div>
									) : isPending ? (
										<div>
											<span className="block text-base font-bold tracking-tight text-[#706B62] italic">
												{commData.hargaWargaRp
													? `Rp${numberFormat.format(commData.hargaWargaRp)}`
													: "-"}
											</span>
											<span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[10px] font-bold text-[#D97706]">
												<Clock size={10} />
												<span>
													Belum Cukup Laporan ({commData.laporanValid}/10)
												</span>
											</span>
										</div>
									) : (
										<div>
											<span className="block font-mono text-base font-bold text-[#898277] opacity-40">
												-
											</span>
											<span className="inline-flex items-center gap-1 rounded-full bg-[#F0ECE4] px-2 py-0.5 text-[10px] font-bold text-[#706B62]">
												<Info size={10} />
												<span>Belum Ada Data</span>
											</span>
										</div>
									)}

									{/* Disparity vs HAP/HET */}
									{commData?.selisihPct !== null &&
									commData?.selisihPct !== undefined ? (
										<div className="text-[10.5px] font-mono flex items-center justify-between pt-0.5">
											<span className="text-[#706B62]">Disparitas:</span>
											<strong
												className={
													commData.selisihPct > 0
														? "text-[#B91C1C]"
														: "text-[#15803D]"
												}
											>
												{commData.selisihPct > 0
													? `+${commData.selisihPct}%`
													: `${commData.selisihPct}%`}
											</strong>
										</div>
									) : (
										<div className="text-[10px] text-[#898277] italic pt-0.5">
											{hasData
												? "Konsensus belum disahkan"
												: "0 partisipasi warga"}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* ========================================================================= */}
			{/* PANEL AUDIT MENDALAM KOMODITAS TERPILIH                                   */}
			{/* ========================================================================= */}
			<section
				ref={auditSectionRef}
				className="space-y-4 pt-4 border-t border-[#DED8CD]"
			>
				{/* Panel Section Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<div>
						<div className="flex items-center gap-2">
							<h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#24231F]">
								Audit Saringan: {detailData.commodity.name}
							</h2>
							{/* Tooltip Info Saringan */}
							<div className="relative group inline-block">
								<button
									type="button"
									aria-label="Informasi alur saringan verifikasi"
									className="flex h-5 w-5 items-center justify-center rounded-full text-[#706B62] hover:bg-[#EFEAE1] hover:text-[#24231F] transition"
								>
									<Info size={15} />
								</button>
								<div className="pointer-events-none absolute left-0 top-full mt-1.5 z-30 hidden w-72 rounded-lg border border-[#DED8CD] bg-[#24231F] p-3 text-[11px] text-white shadow-lg group-hover:block sm:left-auto sm:right-0">
									<div className="font-bold text-[#F5C2C7] mb-1">
										Alur Verifikasi 3 Saringan:
									</div>
									<ol className="list-decimal pl-4 space-y-1 text-[#E5E2DA]">
										<li>Deduplikasi Fingerprint perangkat unik</li>
										<li>Geofence radius &le; 3 km dari koordinat pasar</li>
										<li>
											Deteksi &amp; eliminasi outlier harga ekstrem (MAD
											toleransi 10%)
										</li>
									</ol>
								</div>
							</div>
						</div>
						<p className="mt-0.5 text-xs text-[#706B62]">
							Verifikasi bertingkat untuk memastikan integritas dan akurasi data
							harga di {detailData.market.namaPasar} sebelum konsensus disahkan.
						</p>
					</div>
				</div>

				{/* 5 Corong KPI Cards (Strict Subtractive Funnel Math) */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#DED8CD] rounded-xl border border-[#DED8CD] bg-white p-3.5 shadow-sm text-xs">
					{/* 1. Laporan Masuk */}
					<div className="px-3.5 py-1.5 first:pl-1">
						<span className="block text-[11px] font-bold text-[#706B62]">
							1. Laporan Masuk
						</span>
						<strong className="mt-1 block text-2xl font-black text-[#24231F]">
							{detailData.kpi.laporanMasuk}
						</strong>
						<span className="block text-[10px] text-[#898277] mt-0.5">
							100% total diterima
						</span>
					</div>

					{/* 2. Perangkat Unik */}
					<div className="px-3.5 py-1.5">
						<span className="block text-[11px] font-bold text-[#706B62]">
							2. Perangkat Unik
						</span>
						<strong className="mt-1 block text-2xl font-black text-[#1D4ED8]">
							{detailData.kpi.perangkatUnik}
						</strong>
						<span className="block text-[10px] mt-0.5">
							{detailData.kpi.laporanMasuk - detailData.kpi.perangkatUnik >
							0 ? (
								<span className="text-[#DC2626] font-medium">
									-{detailData.kpi.laporanMasuk - detailData.kpi.perangkatUnik}{" "}
									duplikat dicegah
								</span>
							) : (
								<span className="text-[#898277]">100% perangkat unik</span>
							)}
						</span>
					</div>

					{/* 3. Dalam Radius <= 3 km */}
					<div className="px-3.5 py-1.5">
						<span className="block text-[11px] font-bold text-[#706B62]">
							3. Radius &le; 3 km
						</span>
						<strong className="mt-1 block text-2xl font-black text-[#15803D]">
							{detailData.kpi.radiusValid}
						</strong>
						<span className="block text-[10px] mt-0.5">
							{detailData.kpi.diLuarRadius > 0 ? (
								<span className="text-[#DC2626] font-medium">
									-{detailData.kpi.diLuarRadius} di luar radius (&gt;3km)
								</span>
							) : (
								<span className="text-[#898277]">Semua dalam radius</span>
							)}
						</span>
					</div>

					{/* 4. Lolos Saringan MAD */}
					<div className="px-3.5 py-1.5">
						<span className="block text-[11px] font-bold text-[#706B62]">
							4. Lolos Saringan MAD
						</span>
						<strong className="mt-1 block text-2xl font-black text-[#15803D]">
							{detailData.kpi.laporanValid}
						</strong>
						<span className="block text-[10px] mt-0.5">
							{detailData.kpi.outlierMad > 0 ? (
								<span className="text-[#D97706] font-medium">
									-{detailData.kpi.outlierMad} outlier ekstrem
								</span>
							) : (
								<span className="text-[#898277]">Lolos validasi</span>
							)}
						</span>
					</div>

					{/* 5. Status Kuorum */}
					<div className="px-3.5 py-1.5 last:pr-1 col-span-2 sm:col-span-1">
						<span className="block text-[11px] font-bold text-[#706B62]">
							5. Status Kuorum
						</span>
						<div
							className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
								isTercapai
									? "bg-[#E3F0E7] text-[#15803D]"
									: isMenunggu
										? "bg-[#FFFBEB] text-[#D97706]"
										: "bg-[#F0ECE4] text-[#706B62]"
							}`}
						>
							{isTercapai ? (
								<>
									<CheckCircle2 size={13} />
									<span>Kuorum Sah ({detailData.kpi.laporanValid}/10)</span>
								</>
							) : isMenunggu ? (
								<>
									<Clock size={13} />
									<span>Belum Cukup ({detailData.kpi.laporanValid}/10)</span>
								</>
							) : (
								<>
									<Info size={13} />
									<span>0/10 Belum ada data</span>
								</>
							)}
						</div>
						<span className="block text-[10px] text-[#898277] mt-1">
							Ambang batas: min. 10 lap
						</span>
					</div>
				</div>

				{/* Detail 2 Columns */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
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
										Rp{numberFormat.format(detailData.hargaAcuanRp)} /
										{detailData.commodity.satuan}
									</strong>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-[#706B62]">Selisih terhadap acuan</span>
									<strong
										className={`font-mono font-bold ${
											detailData.selisihPct !== null &&
											detailData.selisihPct > 0
												? "text-[#67151D]"
												: "text-[#15803D]"
										}`}
									>
										{detailData.selisihPct !== null
											? `${detailData.selisihPct > 0 ? "+" : ""}${detailData.selisihPct.toFixed(1)}%`
											: "-"}
									</strong>
								</div>
							</div>

							{!isTercapai && detailData.kpi.laporanValid > 0 ? (
								<div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] p-2.5 text-[11px] text-[#92400E] flex items-center gap-2">
									<Clock size={14} className="shrink-0 text-[#D97706]" />
									<span>
										Membutuhkan minimal 10 laporan valid untuk mengesahkan harga
										konsensus resmi TPID.
									</span>
								</div>
							) : isTercapai ? (
								<div className="rounded-lg bg-[#E3F0E7] border border-[#BBF7D0] p-2.5 text-[11px] text-[#15803D] flex items-center gap-2">
									<CheckCircle2 size={14} className="shrink-0 text-[#15803D]" />
									<span>
										Kuorum tercapai. Harga konsensus telah disahkan sebagai
										rujukan resmi TPID.
									</span>
								</div>
							) : (
								<div className="rounded-lg bg-[#F0ECE4] p-2.5 text-[11px] text-[#706B62] flex items-center gap-2">
									<Info size={14} className="shrink-0 text-[#898277]" />
									<span>
										Belum ada laporan terverifikasi untuk komoditas ini.
									</span>
								</div>
							)}
						</div>

						{/* Card 2: Alur Pemeriksaan Laporan (Interactive Steps) */}
						<div className="rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm space-y-4">
							<div>
								<h3 className="text-base font-extrabold text-[#24231F]">
									Alur Pemeriksaan Laporan
								</h3>
								<p className="mt-0.5 text-xs text-[#706B62]">
									Evaluasi 3 saringan untuk komoditas{" "}
									{detailData.commodity.name}:
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
													detailData.kpi.radiusValid > 0
														? "bg-[#15803D]"
														: "bg-[#706B62]"
												}`}
											>
												<CheckCircle2 size={13} />
											</div>
											<div>
												<span className="font-bold text-[#24231F]">
													1. Satu Perangkat &amp; Radius Pasar
												</span>
												<span className="block text-[11px] text-[#706B62]">
													Lolos: {detailData.kpi.radiusValid} dari{" "}
													{detailData.kpi.laporanMasuk} laporan
												</span>
											</div>
										</div>
										{openStep === 1 ? (
											<ChevronUp size={14} />
										) : (
											<ChevronDown size={14} />
										)}
									</div>
									{openStep === 1 && (
										<div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740] space-y-1">
											<p>
												&bull; Deduplikasi fingerprint:{" "}
												{detailData.kpi.laporanMasuk -
													detailData.kpi.perangkatUnik}{" "}
												duplikat diblokir.
											</p>
											<p>
												&bull; Geofencing: {detailData.kpi.diLuarRadius} laporan
												berjarak &gt; 3 km dari pasar ditolak.
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
											<div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15803D] text-white">
												<CheckCircle2 size={13} />
											</div>
											<div>
												<span className="font-bold text-[#24231F]">
													2. Pembuangan Harga Ekstrem (MAD)
												</span>
												<span className="block text-[11px] text-[#706B62]">
													Dikeluarkan: {detailData.kpi.outlierMad} laporan
													(deviasi &gt; 10%)
												</span>
											</div>
										</div>
										{openStep === 2 ? (
											<ChevronUp size={14} />
										) : (
											<ChevronDown size={14} />
										)}
									</div>
									{openStep === 2 && (
										<div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740]">
											<p>
												{detailData.kpi.outlierMad > 0
													? `${detailData.kpi.outlierMad} laporan terdeteksi menyimpang ekstrem dari median wajar dan dikeluarkan.`
													: "Tidak ada laporan yang terdeteksi menyimpang ekstrem di luar toleransi MAD."}
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
											<div
												className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${
													isTercapai
														? "bg-[#15803D]"
														: isMenunggu
															? "bg-[#D97706]"
															: "bg-[#706B62]"
												}`}
											>
												{isTercapai ? (
													<CheckCircle2 size={13} />
												) : (
													<Clock size={13} />
												)}
											</div>
											<div>
												<span className="font-bold text-[#24231F]">
													3. Kuorum Konsensus (Target &ge; 10 Laporan)
												</span>
												<span className="block text-[11px] text-[#706B62]">
													{isTercapai
														? `Tercapai: ${detailData.kpi.laporanValid} laporan valid`
														: `Belum Cukup: ${detailData.kpi.laporanValid} dari minimal 10 laporan`}
												</span>
											</div>
										</div>
										{openStep === 3 ? (
											<ChevronUp size={14} />
										) : (
											<ChevronDown size={14} />
										)}
									</div>
									{openStep === 3 && (
										<div className="mt-2.5 border-t border-[#DED8CD] pt-2 text-[11px] text-[#4A4740]">
											<p>
												{isTercapai
													? `Syarat kuorum (≥ 10 laporan terverifikasi) terpenuhi dengan ${detailData.kpi.laporanValid} laporan independen.`
													: `Syarat kuorum belum terpenuhi. Baru terkumpul ${detailData.kpi.laporanValid} dari ambang batas 10 laporan valid.`}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Notice Callout */}
							<div className="flex items-start gap-2 rounded-lg bg-[#F0F4F8] p-3 text-[11px] text-[#4A4740]">
								<Info
									size={14}
									className="mt-0.5 flex-shrink-0 text-[#1D4ED8]"
								/>
								<span>
									Hanya laporan hari ini yang diproses. Laporan dari hari
									sebelumnya berstatus kedaluwarsa dan tidak masuk ke dalam
									kuorum aktif.
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
									Distribusi Harga Laporan Valid ({detailData.kpi.laporanValid}{" "}
									laporan) &bull; {detailData.commodity.name}
								</h3>
								{detailData.hargaWargaRp && (
									<span className="font-mono text-xs font-bold text-[#67151D] bg-[#FDF2F2] px-2.5 py-1 rounded-md border border-[#FADBD8]">
										Median: Rp{numberFormat.format(detailData.hargaWargaRp)}/
										{detailData.commodity.satuan}
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
										Belum ada laporan warga yang lolos verifikasi untuk
										komoditas <strong>{detailData.commodity.name}</strong> di{" "}
										{detailData.market.namaPasar} hari ini.
									</p>
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
											const barHeightPct =
												maxBinCount > 0 ? (bin.count / maxBinCount) * 100 : 0;
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
																bin.isMedian ? "bg-[#8A1C24]" : "bg-[#E8A59E]"
															}`}
															style={{
																height: `${Math.max(4, (barHeightPct / 100) * 110)}px`,
															}}
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
										setTableFilter("all");
										setCurrentPage(1);
									}}
									className={`pb-2.5 font-bold transition ${
										tableFilter === "all"
											? "border-b-2 border-[#67151D] text-[#67151D]"
											: "text-[#706B62] hover:text-[#24231F]"
									}`}
								>
									Daftar Laporan ({counts.all})
								</button>

								<button
									type="button"
									onClick={() => {
										setTableFilter("valid");
										setCurrentPage(1);
									}}
									className={`pb-2.5 font-bold transition ${
										tableFilter === "valid"
											? "border-b-2 border-[#67151D] text-[#67151D]"
											: "text-[#706B62] hover:text-[#24231F]"
									}`}
								>
									Laporan Valid ({counts.valid})
								</button>

								<button
									type="button"
									onClick={() => {
										setTableFilter("outlier");
										setCurrentPage(1);
									}}
									className={`pb-2.5 font-bold transition ${
										tableFilter === "outlier"
											? "border-b-2 border-[#67151D] text-[#67151D]"
											: "text-[#706B62] hover:text-[#24231F]"
									}`}
								>
									Outlier ({counts.outlier})
								</button>

								<button
									type="button"
									onClick={() => {
										setTableFilter("radius_invalid");
										setCurrentPage(1);
									}}
									className={`pb-2.5 font-bold transition ${
										tableFilter === "radius_invalid"
											? "border-b-2 border-[#67151D] text-[#67151D]"
											: "text-[#706B62] hover:text-[#24231F]"
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
												<th className="px-4 py-2.5 text-right">
													Harga (Rp/{detailData.commodity.satuan})
												</th>
												<th className="px-4 py-2.5 text-center">
													Status Pemeriksaan
												</th>
												<th className="px-4 py-2.5">Keterangan</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-[#F0ECE4] text-xs">
											{paginatedReports.map((r) => {
												const isValid = r.status === "valid";
												const isOutlier = r.status === "outlier";

												return (
													<tr
														key={r.id}
														className="hover:bg-[#FBF9F4] transition"
													>
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
														<td className="px-4 py-3 text-[#706B62]">
															{r.keterangan}
														</td>
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
										Menampilkan {paginatedReports.length} dari{" "}
										{filteredReports.length} laporan
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

										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											(page) => (
												<button
													key={page}
													type="button"
													onClick={() => setCurrentPage(page)}
													className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold transition ${
														currentPage === page
															? "bg-[#67151D] text-white shadow-sm"
															: "border border-[#DED8CD] text-[#706B62] hover:bg-[#F0EBDE]"
													}`}
												>
													{page}
												</button>
											),
										)}

										<button
											type="button"
											disabled={currentPage === totalPages}
											onClick={() =>
												setCurrentPage((p) => Math.min(totalPages, p + 1))
											}
											className="flex h-7 w-7 items-center justify-center rounded border border-[#DED8CD] text-xs font-bold text-[#706B62] disabled:opacity-30 hover:bg-[#F0EBDE]"
										>
											&gt;
										</button>
									</div>
								</div>
							)}
						</div>
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
					Memuat data pasar dan konsensus...
				</div>
			}
		>
			<DetailLaporanPasarContent />
		</Suspense>
	);
}
