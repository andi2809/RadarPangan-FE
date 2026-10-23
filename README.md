# Radar Pangan — GIS Early Warning & Stakeholder Decision Support System (Jawa Barat)

> **Produk Utama Tim "ini nama timnya mau apa" (WIA / MIA 2026)**  
> Platform Geographic Information System (GIS) Early Warning System (EWS) dan Decision Support System (DSS) untuk pemantauan, stabilisasi, dan mitigasi disparitas harga pangan pokok daerah tingkat Kabupaten/Kota se-Jawa Barat.

---

## 1. Ikhtisar & Arsitektur Sistem
Dashboard ini dirancang secara khusus untuk pemangku kebijakan strategis (TPID Jawa Barat, TPIP, Satgas Pangan Daerah, serta Badan Gizi Nasional untuk Program Makan Bergizi Gratis - MBG).

Sistem beroperasi dengan pendekatan **Zero-Backend Dependency (100% Client-Side Algorithmic Engine & High-Fidelity Static Mock Data)** sehingga memiliki keandalan tinggi saat didemonstrasikan secara luring (*offline*) maupun daring tanpa risiko kegagalan *cold start*.

### Tech Stack
- **Framework:** Next.js 14 (App Router) + React 18
- **Bahasa:** TypeScript (Strict Type Safety)
- **Styling & Design Tokens:** Tailwind CSS v3 (Skala Semantik Anti-AI-Slop: Slate Dark `#0F172A`, Emerald `#16A34A`, Amber `#CA8A04`, Crimson `#DC2626`)
- **GIS Canvas:** MapLibre GL JS + TopoJSON/GeoJSON Delineasi Batas Administrasi Ina-Geoportal/BIG (27 Kabupaten/Kota Jawa Barat)
- **Komputasi:** Client-side Pure Deterministic Engines (Forecasting H+7, EWS Score 0-100, Great-Circle Supply Matchmaker, MAD Anti-Speculator Consensus, dan What-If Simulation)

---

## 2. Fitur-Fitur Inti yang Diimplementasikan

1. **Interactive Full-Bleed GIS Canvas:**
   - Visualisasi poligon 27 Kabupaten/Kota Jawa Barat dengan pewarnaan dinamis semantik berdasarkan deviasi HET/HAP.
   - Filter multi-variabel untuk 5 komoditas pokok (*Beras Medium*, *Cabai Rawit Merah*, *Bawang Merah*, *Telur Ayam Ras*, dan *Minyakita*).
   - Micro-interaction hover tooltip telemetri instan (<16ms) dan click-to-focus wilayah.

2. **Early Warning System (Time-Series Proyeksi H+7):**
   - Proyeksi lonjakan harga 7 hari ke depan berbasis moving average, laju percepatan harga (*velocity slope*), dan pita konfidensi (*conformal prediction interval*).
   - Indeks gabungan EWS Score (0-100) dengan pembobotan deviasi acuan (45%), laju inflasi (35%), dan rasio beban UMK 2026 (20%).

3. **Smart Supply Matchmaker & Koridor Logistik:**
   - Deteksi otomatis saat wilayah defisit/kritis dipilih, langsung mencocokkan sentra surplus Jawa Barat terdekat menggunakan formula Haversine dan estimasi biaya angkut logistik darat (Rp 3.200/ton/km).
   - Render rute garis lengkung (*bezier arc*) langsung pada kanvas peta.

4. **What-If Crisis Sandbox (DSS Intervensi Kebijakan):**
   - Slider interaktif untuk simulasi Subsidi Ongkos Angkut (0–50%) dan Injeksi Stok Operasi Pasar GPM (0–500 Ton).
   - Menghitung ulang harga dan langsung mengubah warna peta wilayah secara *real-time*.

5. **MBG Smart Sourcing (Badan Gizi Nasional):**
   - Pemetaan kebutuhan bahan baku dapur Satuan Pelayanan Pemenuhan Gizi (SPPG) se-Jawa Barat.
   - Algoritma pencocokan pasokan langsung dari petani/produsen lokal guna memotong rantai tengkulak dan menekan anggaran hingga 16%.

6. **Konsensus Anti-Spekulan (Audit Crowdsource Warga):**
   - Algoritma verifikasi konsensus berbasis radius 3 km dengan syarat kuorum $\ge 10$ laporan independen.
   - Filter *Median Absolute Deviation* (MAD) Modified Z-Score untuk mengisolasi dan mendiskualifikasi anomali spekulan secara otomatis.

---

## 3. Cara Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js versi 18+ atau 20+ / 24+
- npm versi 9+

### Instalasi & Menjalankan Dev Server
```bash
# Masuk ke direktori dashboard
cd "Dashboard - Pangan Radar"

# Jalankan server pengembangan lokal
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### Build Produksi
```bash
npm run build
npm run start
```

---

## 4. Struktur Direktori
```text
Dashboard - Pangan Radar/
├── public/
│   └── geo/
│       ├── jabar-27-kabkota.geojson   # Delineasi 27 Kab/Kota Jabar (Ina-Geoportal)
│       └── jabar-centroids.json       # Koordinat centroid lat/lng per wilayah
├── src/
│   ├── app/
│   │   ├── globals.css                # Token semantik dark theme & scrollbar
│   │   ├── layout.tsx                 # Root layout & meta tags
│   │   └── page.tsx                   # Master state orchestrator & view wiring
│   ├── components/
│   │   ├── gis/
│   │   │   ├── MapCanvas.tsx          # Full-bleed MapLibre viewport & layer engine
│   │   │   ├── MapTooltip.tsx         # Floating low-latency telemetry tooltip
│   │   │   └── MapLegend.tsx          # Legenda semantik status EWS & koridor pasokan
│   │   └── dashboard/
│   │       ├── FilterBar.tsx          # Header HUD, filter komoditas & horizon toggle
│   │       ├── SummaryCards.tsx       # Agregat provinsi & rasio stabilitas 27 kab/kota
│   │       ├── RegionDetailDrawer.tsx # Drawer detail wilayah & chart proyeksi H-14 ke H+7
│   │       ├── WhatIfSandbox.tsx      # Slider simulasi intervensi kebijakan TPID
│   │       ├── MbgSourcingPanel.tsx   # Modul rantai pasok SPPG MBG
│   │       └── CrowdsourceAuditPanel.tsx # Panel moderasi audit warga anti-spekulan
│   ├── lib/
│   │   └── engines/
│   │       ├── forecasting.ts         # Rumus deterministik proyeksi H+7
│   │       ├── ews-score.ts           # Kalkulator EWS Risk Score (0-100)
│   │       ├── affordability.ts       # Kalkulator beban keranjang pangan vs UMK 2026
│   │       ├── supply-matcher.ts      # Algoritma Haversine pencari sentra surplus
│   │       ├── what-if.ts             # Engine simulasi intervensi subsidi & GPM
│   │       └── consensus.ts           # Algoritma konsensus kuorum warga & filter MAD
│   ├── data/
│   │   └── mock/
│   │       ├── commodities.json       # 5 komoditas pokok & HAP/HET resmi
│   │       ├── regions.json           # 27 Kab/Kota Jabar, UMK 2026 & Garis Kemiskinan
│   │       ├── telemetry.json         # Deret waktu historis H-14, H0, dan H+7
│   │       ├── mbg-sourcing.json      # Profil dapur SPPG & rekomendasi serapan
│   │       └── crowdsource.json       # Klaster laporan warga & simulasi anomali
│   ├── types/
│   │   └── domain.ts                  # Kontrak data TypeScript terpadu
│   └── utils/
│       └── geo-loader.ts              # Loader dataset GeoJSON & mock data
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```
