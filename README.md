# Radar Pangan — Early Warning System & Decision Support Stabilisasi Harga Pangan Berbasis GIS

> Platform *Geographic Information System (GIS) Early Warning System* dan *Decision Support System* untuk memetakan disparitas harga bahan pokok di Jawa Barat, memproyeksikan lonjakan harga 7 hari ke depan (H+7) berbasis *Deterministic Multi-Window Forecasting*, mengukur beban keterjangkauan terhadap daya beli lokal (UMK), menyandingkan harga resmi vs laporan warga (*Dual-Source Non-Destructive*), serta memberikan rekomendasi rute distribusi pasokan antar-daerah.

---

## 1. Ikhtisar & Arsitektur MVP

Platform ini dirancang dengan **Dual-Lens Architecture**:
1. **Lensa Publik (`/`, `/harga`, `/lapor`, `/metodologi`):** Bagi masyarakat umum & UMKM untuk memantau harga eceran hari ini, melihat riwayat harga wilayah, dan melaporkan harga pasar lokal dengan **Protokol Anti-Panic Buying** (menyembunyikan angka prediksi H+7 dan status darurat dari publik).
2. **Lensa Internal / Admin TPID & Satgas Pangan (`/dashboard`):** Menampilkan **5 Blok Informasi Utama** (Peta GIS Jawa Barat + Garis Rute Distribusi, Kartu Komparasi Dual-Source, Kartu Daya Beli UMK, Grafik Tren Multi-Window & Proyeksi H+7, serta Panel Utilitas Admin & Testing: Upload CSV, Reset Data, Toggle Musiman Normal/H-7 Lebaran/Cuaca Ekstrem, dan Modal Cetak Laporan Kebijakan TPID).

### Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript (Strict)
- **Styling & Design System:** Tailwind CSS v3 + `tokens.css` dengan palet *Warm Paper* (`#F8F4E9`), *Surface* (`#FFFDF7`), *Burgundy* (`#67151D`), dan *Dark Ink* (`#202521`).
- **Font:** `IBM Plex Sans` & `IBM Plex Mono` (`tabular-nums`, self-hosted via `@fontsource`).
- **GIS & Geospasial:** MapLibre GL JS v6 dengan poligon 27 Kabupaten/Kota Jawa Barat (`jabar-27-kabkota.geojson`) dan 507 Kabupaten/Kota Nasional (`indonesia-kabkota.geojson`).
- **Mesin Analisis Deterministik (`src/lib/engines/`):**
  - *Adaptive Multi-Window Forecasting* (7, 30, dan 60 hari: $r$, $P_{\text{baseline}}$, $M_{\text{musim}}$, $M_{\text{stok}}$, $MA_7$, $MA_{30}$, batas anomali $\mu + 2\sigma$).
  - Kalkulasi Rasio Beban Pangan terhadap UMK & Skor Tekanan Daya Beli.
  - *Smart Supply Matchmaker* (rute distribusi dari wilayah surplus terdekat ke wilayah defisit/kritis).
  - Konsensus Laporan Warga (*Dual-Source Non-Destructive* & filter outlier MAD).

---

## 2. Struktur Navigasi & Sitemap Web (Bebas Redundansi)

Struktur halaman aplikasi dioptimalkan sesuai ketentuan lomba untuk menghindari duplikasi fungsi dan memisahkan akses publik dari instrumen pengambil keputusan:

```text
Radar Pangan (EWS & Decision Support Stabilisasi Harga Pangan Berbasis GIS)
│
├── 🌐 Lensa Publik (Protokol Anti-Panic Buying: Tanpa Prediksi H+7 / Label Darurat)
│   ├── /                     Landing Page & Peta Harga Aktual Hari Ini
│   ├── /harga                Eksplorasi harga pangan harian & grafik riwayat publik
│   ├── /metodologi           Transparansi rumus deterministik multi-window & rasio daya beli UMK
│   ├── /lapor                Form partisipasi pelaporan harga pasar warga + pelacakan nomor tiket
│   └── /login                Portal masuk Single Sign-On (Demo SSO TPID, Bapanas, & Satgas Polri)
│
└── 🏛️ Lensa Internal / Admin TPID & Satgas Pangan
    ├── /dashboard            Ruang Kendali Utama GIS (5 Blok Informasi Terpadu):
    │                         • Kanvas Peta GIS 27 Kab/Kota & Garis Panah Rute Distribusi
    │                         • Kartu Komparasi Dual-Source (Harga Resmi vs Laporan Warga)
    │                         • Kartu Analisis Beban Upah Minimum Daerah (UMK)
    │                         • Grafik Deret Waktu Multi-Window & Proyeksi 7 Hari (H+7)
    │                         • Panel Uji Juri (Upload CSV, Reset Data, & Toggle Musiman)
    ├── /dashboard/wilayah    Halaman Terpadu Eksplorasi & Riwayat Wilayah (27 Kab/Kota Jawa Barat)
    ├── /dashboard/laporan-warga  Meja Moderasi & Approval Tiket Warga (Dual-Source Non-Destructive)
    ├── /dashboard/sandbox    What-If Crisis Sandbox (Simulasi Subsidi Angkut & Operasi Pasar GPM)
    └── /dashboard/laporan    Arsip & Template Dokumen Rekomendasi Kebijakan TPID (Print-Ready PDF)
```

| Rute URL | Akses / Peran | Deskripsi & Nilai Fungsional Lomba |
|---|---|---|
| `/` | Publik | **Landing Page Editorial:** Memperkenalkan urgensi disparitas pangan, 4 sumber data resmi, dan peta sebaran harga terkini. |
| `/harga` | Publik | **Eksplorasi Harga Publik:** Pemantauan harga 5 komoditas pokok di 27 Kab/Kota Jawa Barat tanpa memicu spekulasi pasar. |
| `/metodologi` | Publik | **Transparansi Algoritma:** Penjelasan terbuka mengenai rumus deterministik, bobot EWS, dan data UMK BPS. |
| `/lapor` | Publik | **Civic Crowdsourcing:** Partisipasi warga mencatat harga pasar riil dengan kode tiket pelacakan unik (`RP-2026-XXXX`). |
| `/login` | Publik / Auth | **Demo SSO Kedinasan:** 4 profil instansi resmi (JDS Pemprov Jabar, SIAP ASN Jabar, Bapanas, dan Satgas Pangan POLDA Jabar). |
| `/dashboard` | TPID / Satgas | **Executive GIS Cockpit:** Menyatukan visualisasi peringatan dini H+7, rute logistik, komparasi harga, dan panel testing juri. |
| `/dashboard/wilayah` | TPID / Satgas | **Riwayat & Profil Wilayah:** Menggabungkan tabel peringkat 27 kabupaten/kota dan analisis deret waktu multi-window. |
| `/dashboard/laporan-warga` | TPID / Satgas | **Moderasi Konsensus:** Verifikasi laporan warga berbasis kerumunan pasar (kuorum 10 laporan) dan filter outlier MAD. |
| `/dashboard/sandbox` | TPID / Satgas | **Simulasi What-If:** Menguji efektivitas intervensi subsidi logistik dan operasi pasar murah sebelum anggaran dikucurkan. |
| `/dashboard/laporan` | TPID / Satgas | **Cetak Nota Kebijakan:** Otomasi pembuatan draf surat rekomendasi kebijakan TPID siap cetak ke format PDF. |

*(Catatan: Rute `/dashboard/gis` secara otomatis diarahkan ke `/dashboard`, dan `/dashboard/tren` digabungkan ke `/dashboard/wilayah` untuk memastikan efisiensi kode dan kejelasan arsitektur).*

---

## 3. Cara Menjalankan Proyek Secara Lokal

```bash
cd "Dashboard - Pangan Radar"

# Menjalankan server pengembangan
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### Build Produksi
```bash
npm run build
npm run start
```
