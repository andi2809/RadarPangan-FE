import React from "react";

export default function MetodologiPage() {
	return (
		<div className="py-12 md:py-16 bg-[#f8f4e9]">
			<div className="public-container max-w-4xl space-y-10">
				{/* Header */}
				<div className="space-y-3">
					<h1 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
						Metodologi Pemantauan &amp; Standar Acuan Harga
					</h1>
					<p className="text-base sm:text-lg text-[#4a4b44] leading-relaxed">
						Penjelasan terbuka mengenai sumber data yang digunakan, cara
						perbandingan harga terhadap acuan pemerintah (HAP/HET), metode
						estimasi tren, serta tahapan pemeriksaan laporan masyarakat.
					</p>
				</div>

				{/* Section 1: Data Sources */}
				<article className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
					<div className="flex items-center gap-3 pb-3 border-b border-[#e5dfd0]">
						<span className="w-8 h-8 rounded-lg bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center">
							1
						</span>
						<h2 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
							Sumber Data Terbuka yang Digunakan
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#4a4b44] leading-relaxed">
						<div className="p-4 rounded-xl bg-[#f8f4e9] border border-[#e2dcd0] space-y-1">
							<strong className="text-[#1e221f] text-base block">
								1. Badan Pangan Nasional (Bapanas)
							</strong>
							<p>
								Satu-satunya sumber resmi harga pangan dan komoditas harian
								tingkat konsumen di 27 Kabupaten/Kota Jawa Barat melalui Panel
								Harga Pangan, serta ketetapan resmi Harga Acuan Penjualan (HAP)
								dan Harga Eceran Tertinggi (HET).
							</p>
						</div>
						<div className="p-4 rounded-xl bg-[#f8f4e9] border border-[#e2dcd0] space-y-1">
							<strong className="text-[#1e221f] text-base block">
								2. Pemprov Jabar (JDIH &amp; Galura Jabarprov)
							</strong>
							<p>
								Rujukan regulasi resmi Keputusan Gubernur Jawa Barat terkait
								penetapan Upah Minimum Kabupaten/Kota (UMK 2026) di 27 daerah
								yang dipublikasikan melalui JDIH Pemprov Jabar dan warta resmi
								Galura Jabarprov untuk analisis rasio beban daya beli
								masyarakat.
							</p>
						</div>
						<div className="p-4 rounded-xl bg-[#f8f4e9] border border-[#e2dcd0] space-y-1">
							<strong className="text-[#1e221f] text-base block">
								3. Badan Informasi Geospasial (BIG)
							</strong>
							<p>
								Sumber data geospasial batas wilayah administrasi 27
								kabupaten/kota di Jawa Barat (GeoJSON) berbasis layanan resmi
								Ina-Geoportal / geoservice.big.go.id untuk visualisasi pemetaan
								persebaran harga Early Warning System.
							</p>
						</div>
						<div className="p-4 rounded-xl bg-[#f8f4e9] border border-[#e2dcd0] space-y-1">
							<strong className="text-[#1e221f] text-base block">
								4. Pelaporan Masyarakat Terverifikasi
							</strong>
							<p>
								Data aduan harga aktual pasar dari warga yang telah melewati 3
								saringan konsensus (1 perangkat 1 suara, kuorum radius pasar,
								dan uji outlier MAD) sebagai pembanding lapangan (Dual-Source).
							</p>
						</div>
					</div>
				</article>

				{/* Section 2: Indikator Perbandingan Harga */}
				<article className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
					<div className="flex items-center gap-3 pb-3 border-b border-[#e5dfd0]">
						<span className="w-8 h-8 rounded-lg bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center">
							2
						</span>
						<h2 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
							Klasifikasi Indikator Warna pada Peta
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
						<div className="p-4 rounded-xl bg-[#e0f0e2]/70 border border-[#badfc4] space-y-1">
							<strong className="text-[#166534] font-extrabold block text-base">
								Sesuai / Di Bawah Acuan (&le; +5% thd. HAP/HET)
							</strong>
							<p className="text-[#4a4b44] leading-relaxed">
								Harga rata-rata komoditas berada di bawah atau dalam batas wajar
								terhadap standar acuan pemerintah.
							</p>
						</div>

						<div className="p-4 rounded-xl bg-[#fef3c7] border border-[#fde68a] space-y-1">
							<strong className="text-[#92400e] font-extrabold block text-base">
								Fluktuasi Sedang (+5% s.d. +10% thd. HAP/HET)
							</strong>
							<p className="text-[#4a4b44] leading-relaxed">
								Terjadi kenaikan harga moderat di atas acuan yang perlu dipantau
								perkembangannya pada periode berikutnya.
							</p>
						</div>

						<div className="p-4 rounded-xl bg-[#f8ded8] border border-[#f0bfb7] space-y-1">
							<strong className="text-[#991b1b] font-extrabold block text-base">
								Di Atas Acuan (&gt; +10% thd. HAP/HET)
							</strong>
							<p className="text-[#4a4b44] leading-relaxed">
								Harga komoditas melampaui batas acuan lebih dari 10%, menandakan
								perlunya perhatian pada ketersediaan pasokan lokal.
							</p>
						</div>

						<div className="p-4 rounded-xl bg-[#f0ebde] border border-[#cfc8b8] space-y-1">
							<strong className="text-[#1e221f] font-extrabold block text-base">
								Belum Tersedia Data Telemetri
							</strong>
							<p className="text-[#4a4b44] leading-relaxed">
								Ditampilkan dengan warna netral yang berbeda dari status aman
								untuk wilayah yang belum termasuk dalam dataset sampel harian.
							</p>
						</div>
					</div>
				</article>

				{/* Section 3: Formula Indeks Kewaspadaan & Pemeriksaan Laporan */}
				<article className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
					<div className="flex items-center gap-3 pb-3 border-b border-[#e5dfd0]">
						<span className="w-8 h-8 rounded-lg bg-[#67151d] text-white font-mono font-bold text-sm flex items-center justify-center">
							3
						</span>
						<h2 className="text-xl sm:text-2xl font-extrabold text-[#1e221f]">
							Metode Indeks Kewaspadaan &amp; Pemeriksaan Laporan Warga
						</h2>
					</div>

					<p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
						Untuk membantu mengenali wilayah yang membutuhkan perhatian lebih
						awal, sistem menghitung skor gabungan (0–100) dari perbandingan
						terhadap HAP/HET, perubahan tren historis 14 hari, serta rasio beban
						pengeluaran terhadap UMK daerah:
					</p>

					<div className="p-4 rounded-xl bg-[#f0ebde] border border-[#d6cebe] font-mono text-xs sm:text-sm text-[#1e221f] space-y-2">
						<div className="font-bold text-[#67151d]">
							Skor_Kewaspadaan = (0.45 &times; Skor_Deviasi_Acuan) + (0.35
							&times; Skor_Laju_Tren) + (0.20 &times; Skor_Beban_UMK)
						</div>
					</div>

					<p className="text-sm sm:text-base text-[#4a4b44] leading-relaxed">
						Sementara itu, laporan harga dari masyarakat diperiksa melalui tiga
						aturan verifikasi: (1) pencocokan jarak lokasi terhadap titik
						koordinat pasar (&le; 3 km), (2) pembandingan minimal 10 laporan
						independen pada pasar yang sama, dan (3) penyaringan nilai ekstrem
						menggunakan metode <em>Median Absolute Deviation (MAD)</em>.
					</p>
				</article>
			</div>
		</div>
	);
}
