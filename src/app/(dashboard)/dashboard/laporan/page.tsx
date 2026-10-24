'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { FileText, Download, Printer, Filter, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';

export default function LaporanPage() {
  const [selectedBulan, setSelectedBulan] = useState<string>('okt-2026');

  const bulletins = [
    {
      id: 'BAP-JB-2026-W4',
      title: 'Buletin Mingguan EWS Pangan Jawa Barat (Minggu ke-4 Oktober 2026)',
      date: '24 Oktober 2026',
      publisher: 'Sekretariat TPID Provinsi Jawa Barat & Bank Indonesia',
      status: 'Resmi',
      pages: 14,
      fileSize: '2.4 MB',
      kategori: 'Mingguan',
    },
    {
      id: 'BAP-JB-2026-W3',
      title: 'Buletin Peringatan Dini Lonjakan Cabai Rawit & Bawang Merah (Minggu ke-3)',
      date: '17 Oktober 2026',
      publisher: 'Dinas Ketahanan Pangan dan Peternakan Provinsi Jawa Barat',
      status: 'Resmi',
      pages: 10,
      fileSize: '1.8 MB',
      kategori: 'Tematik',
    },
    {
      id: 'BAP-JB-2026-M09',
      title: 'Laporan Agregat Disparitas Spasial dan Indeks Keterjangkauan September 2026',
      date: '30 September 2026',
      publisher: 'Badan Pangan Nasional (Bapanas) Regional II',
      status: 'Terarsip',
      pages: 28,
      fileSize: '4.6 MB',
      kategori: 'Bulanan',
    },
    {
      id: 'BAP-JB-2026-W2',
      title: 'Evaluasi Pasokan dan Neraca Distribusi Pangan Wilayah Pantauan EWS',
      date: '10 Oktober 2026',
      publisher: 'Biro Perekonomian Setda Jawa Barat',
      status: 'Resmi',
      pages: 12,
      fileSize: '1.9 MB',
      kategori: 'Mingguan',
    },
  ];

  return (
    <GISLayout>
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end border-b border-[#DED8CD] pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#74151C]">
            <FileText size={15} />
            Laporan Resmi Disparitas & Stabilitas
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-[#24231F]">
            Arsip & Buletin Eksekutif TPID Nasional
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#706B62] max-w-2xl">
            Unduh laporan berkala, risalah pemantauan disparitas antar-daerah, dan dokumen rekomendasi intervensi operasi pasar bersumber dari Bapanas, PIHPS Bank Indonesia, dan BPS.
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[#DED8CD] bg-white shadow-sm">
          <p className="text-xs text-[#706B62] font-semibold">Total Laporan Terbit</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#24231F]">48 Edisi</p>
          <p className="text-[10px] text-[#898277] mt-0.5">Tahun Anggaran 2026</p>
        </div>

        <div className="p-4 rounded-xl border border-[#DED8CD] bg-white shadow-sm">
          <p className="text-xs text-[#706B62] font-semibold">Status Keterkinian</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#27815A]">Aktif (Harian)</p>
          <p className="text-[10px] text-[#898277] mt-0.5">Sinkronisasi otomatis Bapanas</p>
        </div>

        <div className="p-4 rounded-xl border border-[#DED8CD] bg-white shadow-sm">
          <p className="text-xs text-[#706B62] font-semibold">Tingkat Validitas Kuorum</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#74151C]">99,4%</p>
          <p className="text-[10px] text-[#898277] mt-0.5">Terverifikasi silang 3 lembaga</p>
        </div>
      </div>

      {/* Bulletin List */}
      <div className="rounded-xl border border-[#DED8CD] bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 bg-[#FBF9F4] border-b border-[#DED8CD] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#24231F]">
            Daftar Dokumen Laporan Siap Unduh
          </h3>
          <span className="text-[11px] font-mono text-[#706B62]">Format: PDF Digital Terverifikasi</span>
        </div>

        <div className="divide-y divide-[#F0ECE4]">
          {bulletins.map((b) => (
            <div key={b.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF6EE] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0E5E0] text-[#74151C]">
                    {b.id}
                  </span>
                  <span className="text-[10px] font-semibold text-[#898277]">{b.kategori}</span>
                  <span className="text-[10px] font-bold text-[#27815A] bg-[#E3F0E7] px-1.5 py-0.5 rounded">
                    {b.status}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[#24231F]">{b.title}</h4>
                <p className="text-xs text-[#706B62]">
                  Penerbit: <strong>{b.publisher}</strong> &bull; Terbit: {b.date} ({b.pages} Halaman, {b.fileSize})
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh berkas laporan: ${b.title}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DED8CD] bg-white text-[#24231F] hover:bg-[#F0ECE4] text-xs font-bold transition shadow-sm"
                >
                  <Download size={13} />
                  <span>Unduh PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GISLayout>
  );
}
