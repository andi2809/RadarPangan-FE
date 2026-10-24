'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MarketSample {
  name: string;
  priceRp: number;
  change: string;
  isHigher: boolean;
  type: string;
}

const REGIONS = [
  { id: '32.16', name: 'Kab. Bekasi' },
  { id: '32.75', name: 'Kota Bekasi' },
  { id: '32.15', name: 'Kab. Karawang' },
  { id: '32.13', name: 'Kab. Subang' },
  { id: '32.73', name: 'Kota Bandung' },
  { id: '32.04', name: 'Kab. Bandung' },
  { id: '32.05', name: 'Kab. Garut' },
  { id: '32.71', name: 'Kota Bogor' }
];

const COMMODITIES = [
  { id: 'cabai_rawit_merah', name: 'Cabai Rawit Merah', hap: 57000 },
  { id: 'beras_medium', name: 'Beras Medium', hap: 12500 },
  { id: 'bawang_merah', name: 'Bawang Merah', hap: 36500 },
  { id: 'daging_ayam_ras', name: 'Daging Ayam Ras', hap: 36750 },
  { id: 'minyakita', name: 'Minyakita (HET)', hap: 15700 }
];

const SAMPLES: Record<string, MarketSample[]> = {
  '32.16': [
    { name: 'Pasar Cikarang Pusat', priceRp: 78500, change: '+9,2%', isHigher: true, type: 'Pasar Tradisional Utama' },
    { name: 'Pasar Tambun', priceRp: 77900, change: '+8,1%', isHigher: true, type: 'Pasar Rakyat' },
    { name: 'Pasar Sukatani', priceRp: 78200, change: '+8,7%', isHigher: true, type: 'Pasar Sub-Regional' }
  ],
  '32.73': [
    { name: 'Pasar Ciroyom', priceRp: 69500, change: '+5,4%', isHigher: true, type: 'Pasar Induk Sayur' },
    { name: 'Pasar Baru Bandung', priceRp: 70200, change: '+6,2%', isHigher: true, type: 'Pasar Ritel' },
    { name: 'Pasar Kosambi', priceRp: 69800, change: '+5,8%', isHigher: true, type: 'Pasar Wilayah' }
  ],
  '32.05': [
    { name: 'Pasar Guntur Garut', priceRp: 54000, change: '-4,1%', isHigher: false, type: 'Pasar Induk Produsen' },
    { name: 'Pasar Wanaraja', priceRp: 53500, change: '-5,2%', isHigher: false, type: 'Pasar Sentra Panen' },
    { name: 'Pasar Tarogong', priceRp: 54500, change: '-3,8%', isHigher: false, type: 'Pasar Konsumsi' }
  ]
};

export default function DetailHargaPage() {
  const [selectedRegionId, setSelectedRegionId] = useState('32.16');
  const [selectedCommodityId, setSelectedCommodityId] = useState('cabai_rawit_merah');
  const [horizon, setHorizon] = useState<'7d' | '30d' | '90d'>('30d');

  const selectedRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];
  const selectedComm = COMMODITIES.find((c) => c.id === selectedCommodityId) || COMMODITIES[0];
  const marketSamples = SAMPLES[selectedRegionId] || SAMPLES['32.16'];

  const currentPrice = selectedRegionId === '32.05' ? 54000 : selectedRegionId === '32.73' ? 69800 : 78200;
  const deviasiPct = Math.round(((currentPrice - selectedComm.hap) / selectedComm.hap) * 100);

  return (
    <div className="detail-page py-10 bg-[#f8f4e9]">
      <div className="container space-y-8">
        {/* Top Control Bar */}
        <div className="picker-bar bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-5 shadow-sm">
          <div className="picker-grid grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div className="picker-field space-y-1.5">
              <label className="text-xs font-bold text-[#1e221f] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#67151d]" />
                <span>Pilih Wilayah Pantauan</span>
              </label>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs font-bold text-[#1e221f] focus:outline-none"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="picker-field space-y-1.5">
              <label className="text-xs font-bold text-[#1e221f] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8a6212]" />
                <span>Pilih Komoditas Pokok</span>
              </label>
              <select
                value={selectedCommodityId}
                onChange={(e) => setSelectedCommodityId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs font-bold text-[#1e221f] focus:outline-none"
              >
                {COMMODITIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-[#68685e] mb-1.5">Akses Konsol Cepat</div>
              <div className="flex items-center gap-2">
                <Link
                  href="/#peta"
                  className="btn btn-sm inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#f0ebde] hover:bg-[#ded8c8] text-[#1e221f] font-bold text-xs border border-[#ded8c8]"
                >
                  <span>Peta Spasial</span>
                </Link>
                <Link
                  href="/login"
                  className="btn btn-primary btn-sm inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#67151d] text-white font-bold text-xs"
                >
                  <span>Login TPID</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="detail-page-header space-y-2">
          <div className="detail-breadcrumb text-xs text-[#68685e] flex items-center gap-2">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <Link href="/#peta" className="hover:underline">Peta Jawa Barat</Link>
            <span>/</span>
            <span className="text-[#1e221f] font-bold">{selectedRegion.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Pantauan Harga: {selectedRegion.name} &bull; {selectedComm.name}
          </h1>
          <p className="text-sm text-[#68685e] max-w-2xl">
            Rincian data transaksi eceran pasar sampel, perbandingan terhadap Batas Acuan HAP Nasional (Rp {selectedComm.hap.toLocaleString('id-ID')}/kg), dan evaluasi daya beli masyarakat.
          </p>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-[#68685e] uppercase">Harga Eceran Rata-Rata</div>
            <div className="text-2xl font-black font-mono text-[#1e221f] mt-1">
              Rp {currentPrice.toLocaleString('id-ID')}/kg
            </div>
            <div className="text-xs text-[#e85b4f] font-bold mt-1">
              {deviasiPct > 0 ? `+${deviasiPct}% di atas HAP` : `${deviasiPct}% di bawah HAP`}
            </div>
          </div>

          <div className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-[#68685e] uppercase">Harga Acuan (HAP) Bapanas</div>
            <div className="text-2xl font-black font-mono text-[#8a6212] mt-1">
              Rp {selectedComm.hap.toLocaleString('id-ID')}/kg
            </div>
            <div className="text-xs text-[#68685e] mt-1">Batas acuan penjualan konsumen</div>
          </div>

          <div className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-[#68685e] uppercase">Status EWS Wilayah</div>
            <div className="text-xl font-bold mt-1.5 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${deviasiPct > 10 ? 'bg-[#e85b4f]' : deviasiPct > 0 ? 'bg-[#f0c94d]' : 'bg-[#4b9d73]'}`} />
              <span className="text-[#1e221f] font-black">{deviasiPct > 10 ? 'Defisit Kritis' : deviasiPct > 0 ? 'Waspada' : 'Pasokan Aman'}</span>
            </div>
            <div className="text-xs text-[#68685e] mt-1">Sinyal peringatan dini otomatis</div>
          </div>

          <div className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-[#68685e] uppercase">Rasio Beban thd. UMK</div>
            <div className="text-2xl font-black font-mono text-[#67151d] mt-1">
              {selectedRegionId === '32.16' ? '10,8%' : selectedRegionId === '32.73' ? '7,2%' : '4,1%'}
            </div>
            <div className="text-xs text-[#68685e] mt-1">Porsi pengeluaran buruh lokal</div>
          </div>
        </div>

        {/* Timeseries Chart Card */}
        <div className="chart-card bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ded8c8]">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#67151d] block mb-1">
                Deret Waktu Historis Riil
              </span>
              <h3 className="text-lg font-bold text-[#1e221f]">Tren Pergerakan Harga Konsumen</h3>
              <p className="text-xs text-[#68685e]">
                Garis marun menunjukkan harga transaksi eceran riil harian; garis oranye adalah Harga Acuan Penjualan (HAP).
              </p>
            </div>

            <div className="flex items-center rounded-lg bg-[#f0ebde] p-1 border border-[#ded8c8] text-xs font-bold">
              <button
                type="button"
                onClick={() => setHorizon('7d')}
                className={`px-3 py-1 rounded-md transition-all ${horizon === '7d' ? 'bg-[#67151d] text-white shadow-sm' : 'text-[#68685e]'}`}
              >
                7 Hari
              </button>
              <button
                type="button"
                onClick={() => setHorizon('30d')}
                className={`px-3 py-1 rounded-md transition-all ${horizon === '30d' ? 'bg-[#67151d] text-white shadow-sm' : 'text-[#68685e]'}`}
              >
                30 Hari
              </button>
              <button
                type="button"
                onClick={() => setHorizon('90d')}
                className={`px-3 py-1 rounded-md transition-all ${horizon === '90d' ? 'bg-[#67151d] text-white shadow-sm' : 'text-[#68685e]'}`}
              >
                3 Bulan
              </button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="p-4 bg-[#f8f4e9]/40 rounded-lg border border-[#ded8c8]">
            <svg viewBox="0 0 700 220" className="w-full h-auto">
              {/* Gridlines */}
              <g stroke="#ded8c8" strokeWidth="1">
                <line x1="40" y1="30" x2="680" y2="30" />
                <line x1="40" y1="75" x2="680" y2="75" />
                <line x1="40" y1="120" x2="680" y2="120" />
                <line x1="40" y1="165" x2="680" y2="165" />
              </g>
              {/* Y Axis */}
              <g fill="#858174" fontSize="10" fontFamily="monospace">
                <text x="0" y="34">90K</text>
                <text x="0" y="79">75K</text>
                <text x="0" y="124">60K</text>
                <text x="0" y="169">45K</text>
              </g>
              {/* HAP Reference Line (Dashed) */}
              <line x1="40" y1="130" x2="680" y2="130" stroke="#8a6212" strokeWidth="2" strokeDasharray="6 4" />
              <text x="600" y="125" fill="#8a6212" fontSize="9" fontWeight="bold">HAP Bapanas</text>

              {/* Price Line Curve */}
              <path
                d="M 40 145 Q 120 135 200 120 T 360 90 T 520 80 T 680 70"
                fill="none"
                stroke="#67151d"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="680" cy="70" r="5" fill="#67151d" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Market Samples Table */}
        <div className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ded8c8]">
            <div>
              <h3 className="text-lg font-bold text-[#1e221f]">Rincian Titik Pasar Pantauan Sampel</h3>
              <p className="text-xs text-[#68685e]">Hasil pencatatan enumerator harga di pasar rakyat resmi</p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#f4e8e9] text-[#67151d] border border-[#dfc7b8]">
              3 Titik Sampel Aktif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ded8c8] text-[#68685e]">
                  <th className="py-2.5">Nama Titik Pasar</th>
                  <th className="py-2.5">Klasifikasi</th>
                  <th className="py-2.5 text-right">Harga Transaksi</th>
                  <th className="py-2.5 text-right">Fluktuasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ded8c8]/60">
                {marketSamples.map((sample, idx) => (
                  <tr key={idx} className="hover:bg-[#f8f4e9]/50">
                    <td className="py-3 font-bold text-[#1e221f]">{sample.name}</td>
                    <td className="py-3 text-[#68685e]">{sample.type}</td>
                    <td className="py-3 text-right font-mono font-bold text-sm text-[#1e221f]">
                      Rp {sample.priceRp.toLocaleString('id-ID')}/kg
                    </td>
                    <td className={`py-3 text-right font-mono font-bold ${sample.isHigher ? 'text-[#e85b4f]' : 'text-[#4b9d73]'}`}>
                      {sample.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
