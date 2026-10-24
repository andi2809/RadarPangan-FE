# Radar Pangan — Sistem Informasi, Pemantauan & Peringatan Dini Harga Pangan

> Platform Geographic Information System (GIS) dan Pemantauan Harga Pangan Pokok untuk mengeksplorasi persebaran harga komoditas menurut wilayah, membandingkan terhadap standar acuan pemerintah (HAP/HET), menganalisis keterjangkauan daerah, serta memfasilitasi pelaporan harga pasar oleh masyarakat.

---

## 1. Ikhtisar & Arsitektur Sistem
Platform ini dirancang untuk masyarakat umum, pelaku distribusi, serta pemangku kebijakan daerah (TPID & Pemerintah Daerah) guna meningkatkan transparansi informasi harga pangan pokok.

### Tech Stack
- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling & Design System:** Tailwind CSS v3 dengan palet *Warm Paper* (`#F8F4E9`), *Surface* (`#FFFDF7`), *Burgundy* (`#67151D`), dan *Dark Ink* (`#1E221F`).
- **GIS & Geospasial:** Batas administrasi resmi 38 Provinsi & 507 Kabupaten/Kota (`indonesia-kabkota.geojson`) serta 27 Kabupaten/Kota Jawa Barat (`jabar-27-kabkota.geojson`).
- **Mesin Analisis:** Perhitungan deviasi HAP/HET, tren historis 14 hari & proyeksi statistik H+7, matriks keterjangkauan terhadap UMK daerah, perbandingan pasokan antarwilayah, serta pemeriksaan laporan harga warga.

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
