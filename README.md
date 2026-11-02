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

### Dokumentasi Lengkap
- Konteks Teknis Inti MVP: [`../docs/From-Andi/CONTEXT_SUMMARY/TECHNICAL_PROJECT_CONTEXT.md`](../docs/From-Andi/CONTEXT_SUMMARY/TECHNICAL_PROJECT_CONTEXT.md)
- Konteks Umum & Sitemap: [`../docs/From-Andi/CONTEXT_SUMMARY/GENERAL_PROJECT_CONTEXT.md`](../docs/From-Andi/CONTEXT_SUMMARY/GENERAL_PROJECT_CONTEXT.md)
- Panduan Ekosistem & Demo: [`../docs/From-Andi/must-read/PANDUAN_EKOSISTEM_DAN_RUNNING.md`](../docs/From-Andi/must-read/PANDUAN_EKOSISTEM_DAN_RUNNING.md)
- Spesifikasi Teknis Front-End: [`../docs/From-Andi/spec/FRONTEND_SPEC.md`](../docs/From-Andi/spec/FRONTEND_SPEC.md)

---

## 2. Cara Menjalankan Proyek Secara Lokal

```bash
cd "Dashboard - Pangan Radar"
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### Build Produksi
```bash
npm run build
npm run start
```
