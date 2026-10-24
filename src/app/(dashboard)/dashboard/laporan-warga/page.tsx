'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { ShieldCheck, CheckCircle2, AlertTriangle, Users, Filter, Layers, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function LaporanWargaPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'anomaly'>('all');

  const clusters = [
    {
      id: 'CLUST-BKS-01',
      pasar: 'Pasar Baru Cikarang, Kab. Bekasi',
      komoditas: 'Cabai Rawit Merah',
      hargaWargaRp: 49000,
      hargaResmiRp: 48200,
      selisihPersen: 1.66,
      jumlahLaporan: 18,
      radiusKm: 2.1,
      status: 'verified',
      timestamp: '24 Okt 2026, 08:30 WIB',
    },
    {
      id: 'CLUST-BDG-02',
      pasar: 'Pasar Induk Caringin, Kota Bandung',
      komoditas: 'Bawang Merah',
      hargaWargaRp: 32500,
      hargaResmiRp: 32000,
      selisihPersen: 1.56,
      jumlahLaporan: 24,
      radiusKm: 1.8,
      status: 'verified',
      timestamp: '24 Okt 2026, 09:15 WIB',
    },
    {
      id: 'CLUST-BGR-03',
      pasar: 'Pasar Cibinong, Kab. Bogor',
      komoditas: 'Beras Medium',
      hargaWargaRp: 15400,
      hargaResmiRp: 14800,
      selisihPersen: 4.05,
      jumlahLaporan: 9,
      radiusKm: 3.2,
      status: 'pending',
      timestamp: '24 Okt 2026, 07:45 WIB',
    },
    {
      id: 'CLUST-CRB-04',
      pasar: 'Pasar Kanoman, Kota Cirebon',
      komoditas: 'Minyakita',
      hargaWargaRp: 19500,
      hargaResmiRp: 15700,
      selisihPersen: 24.2,
      jumlahLaporan: 2,
      radiusKm: 4.5,
      status: 'anomaly',
      timestamp: '23 Okt 2026, 17:20 WIB',
    },
  ];

  const filteredClusters = clusters.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <GISLayout>
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end border-b border-[#DED8CD] pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#74151C]">
            <ShieldCheck size={15} />
            Laporan Warga & Verifikasi Konsensus
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-[#24231F]">
            Konsensus Partisipasi Warga (Crowdsourcing)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#706B62] max-w-2xl">
            Verifikasi kuorum independen warga masyarakat per pasar tradisional. Mencegah anomali spekulasi dengan ambang batas radius geospasial 3 km dan penyaringan MAD (Median Absolute Deviation).
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#74151C] text-white text-xs font-bold hover:bg-[#580F15] transition shadow-sm"
        >
          <Layers size={14} />
          <span>Kembali ke Peta Spasial</span>
        </Link>
      </section>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#DED8CD] bg-white shadow-sm">
          <p className="text-xs text-[#706B62] font-semibold">Total Laporan Warga</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#24231F]">1.428 Tiket</p>
          <p className="text-[10px] text-[#898277] mt-0.5">30 hari terakhir</p>
        </div>

        <div className="p-4 rounded-xl border border-[#27815A]/30 bg-[#E3F0E7] shadow-sm">
          <p className="text-xs text-[#1B5B3F] font-semibold">Kuorum Terverifikasi</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#27815A]">1.196 (83,7%)</p>
          <p className="text-[10px] text-[#4D6655] mt-0.5">Memenuhi syarat kuorum &ge;10</p>
        </div>

        <div className="p-4 rounded-xl border border-[#DED8CD] bg-white shadow-sm">
          <p className="text-xs text-[#96620A] font-semibold">Dalam Verifikasi</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#96620A]">142 Tiket</p>
          <p className="text-[10px] text-[#898277] mt-0.5">Menunggu kelengkapan sampel</p>
        </div>

        <div className="p-4 rounded-xl border border-[#DC4840]/30 bg-[#FBE7E4] shadow-sm">
          <p className="text-xs text-[#B52D26] font-semibold">Anomali Terfilter</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#DC4840]">90 (Spekulasi)</p>
          <p className="text-[10px] text-[#898277] mt-0.5">Dieliminasi filter outlier MAD</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#DED8CD] pb-3 text-xs font-bold">
        {[
          { key: 'all', label: 'Semua Laporan Warga' },
          { key: 'verified', label: 'Terverifikasi Konsensus' },
          { key: 'pending', label: 'Menunggu Kuorum' },
          { key: 'anomaly', label: 'Anomali Terfilter' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === tab.key
                ? 'bg-[#74151C] text-white shadow-sm'
                : 'text-[#706B62] hover:bg-[#F0ECE4]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cluster Cards */}
      <div className="space-y-3">
        {filteredClusters.map((c) => {
          const isVerified = c.status === 'verified';
          const isAnomaly = c.status === 'anomaly';

          return (
            <div
              key={c.id}
              className="p-4 sm:p-5 rounded-xl border border-[#DED8CD] bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0E5E0] text-[#74151C]">
                    {c.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isVerified
                        ? 'bg-[#E3F0E7] text-[#27815A]'
                        : isAnomaly
                        ? 'bg-[#FBE7E4] text-[#DC4840]'
                        : 'bg-[#FBF0D7] text-[#96620A]'
                    }`}
                  >
                    {isVerified ? 'Konsensus Sah' : isAnomaly ? 'Anomali Outlier' : 'Menunggu Kuorum'}
                  </span>
                  <span className="text-[10px] text-[#898277]">{c.timestamp}</span>
                </div>

                <h4 className="text-sm font-extrabold text-[#24231F]">{c.pasar}</h4>
                <p className="text-xs text-[#706B62]">
                  Komoditas: <strong className="text-[#24231F]">{c.komoditas}</strong> &bull; Radius Kluster:{' '}
                  <strong>{c.radiusKm} km</strong> &bull; Total Masukan Warga: <strong>{c.jumlahLaporan} orang</strong>
                </p>
              </div>

              {/* Price Comparo */}
              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#898277] block font-sans">Harga Warga:</span>
                  <strong className="text-base text-[#24231F]">
                    Rp {c.hargaWargaRp.toLocaleString('id-ID')}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-[#898277] block font-sans">Harga Resmi Bapanas:</span>
                  <span className="text-base text-[#706B62]">
                    Rp {c.hargaResmiRp.toLocaleString('id-ID')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#898277] block font-sans">Deviasi:</span>
                  <strong className={isAnomaly ? 'text-[#DC4840]' : 'text-[#27815A]'}>
                    +{c.selisihPersen}%
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => alert(`Laporan ${c.id} telah disetujui masuk indeks agregat.`)}
                  className="px-3 py-1.5 rounded-lg bg-[#E3F0E7] text-[#287653] hover:bg-[#cbe6d2] text-xs font-bold transition flex items-center gap-1"
                >
                  <ThumbsUp size={13} />
                  <span>Validasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Laporan ${c.id} ditandai untuk investigasi pasar lapangan.`)}
                  className="px-3 py-1.5 rounded-lg border border-[#DED8CD] hover:bg-[#F0ECE4] text-[#706B62] text-xs font-bold transition flex items-center gap-1"
                >
                  <ThumbsDown size={13} />
                  <span>Tandai</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </GISLayout>
  );
}
