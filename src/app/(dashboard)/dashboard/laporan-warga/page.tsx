'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import {
  loadCitizenReports,
  saveCitizenReports,
  resetCitizenReports,
  type ApprovedCitizenReport,
} from '@/utils/dual-source-store';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Plus,
  RotateCcw,
} from 'lucide-react';

const numberFormat = new Intl.NumberFormat('id-ID');

export default function LaporanWargaPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>(
    'all'
  );
  const [reports, setReports] = useState<ApprovedCitizenReport[]>([]);

  useEffect(() => {
    const sync = () => setReports(loadCitizenReports());
    sync();
    window.addEventListener('radar-pangan-storage-update', sync);
    return () => window.removeEventListener('radar-pangan-storage-update', sync);
  }, []);

  const filteredClusters = useMemo(() => {
    if (filterStatus === 'all') return reports;
    return reports.filter((c) => c.statusApproval === filterStatus);
  }, [reports, filterStatus]);

  const counts = useMemo(() => {
    return {
      total: reports.length,
      approved: reports.filter((r) => r.statusApproval === 'approved').length,
      pending: reports.filter((r) => r.statusApproval === 'pending').length,
      rejected: reports.filter((r) => r.statusApproval === 'rejected').length,
    };
  }, [reports]);

  const handleUpdateStatus = (id: string, nextStatus: 'approved' | 'pending' | 'rejected') => {
    const next = reports.map((item) =>
      item.id === id
        ? {
            ...item,
            statusApproval: nextStatus,
            updatedAt: 'Baru saja diperbarui Admin',
          }
        : item
    );
    setReports(next);
    saveCitizenReports(next);
  };

  const handleSimulateNewReport = () => {
    const newReport: ApprovedCitizenReport = {
      id: `CLUST-SIM-${Date.now().toString().slice(-4)}`,
      ticketCode: `RP-2026-SBM${Math.floor(100 + Math.random() * 899)}`,
      regionId: '32.02',
      regionName: 'Kab. Sukabumi',
      commodityId: 'cabai_rawit_merah',
      commodityName: 'Cabai Rawit Merah',
      namaPasar: 'Pasar Pelita Sukabumi',
      hargaWargaRp: 52500,
      hargaResmiRp: 47800,
      jumlahLaporan: 11,
      radiusKm: 2.4,
      statusApproval: 'pending',
      updatedAt: 'Baru saja masuk (Simulasi)',
    };
    const next = [newReport, ...reports];
    setReports(next);
    saveCitizenReports(next);
  };

  const handleReset = () => {
    const defaults = resetCitizenReports();
    setReports(defaults);
  };

  return (
    <GISLayout>
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 border-b border-[#DED8CD] pb-6 xl:flex-row xl:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#67151D]">
            <ShieldCheck size={15} />
            Moderasi Laporan Warga &amp; Integritas Dual-Source (Non-Destructive)
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#24231F] sm:text-3xl">
            Persetujuan Laporan Harga Pasar Warga
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-[#706B62] sm:text-sm">
            Laporan warga yang disetujui Admin TPID tidak menimpa data resmi pemerintah, melainkan ditampilkan berdampingan pada Kartu Komparasi Dual-Source di Dashboard GIS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateNewReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#67151D]/30 bg-[#F4E8E9] px-3 py-2 text-xs font-bold text-[#67151D] transition hover:bg-[#EBD5D7]"
          >
            <Plus size={14} />
            <span>Simulasi Laporan Warga Masuk</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DED8CD] bg-white px-3 py-2 text-xs font-bold text-[#706B62] transition hover:border-[#67151D] hover:text-[#67151D]"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#67151D] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#4C0D15]"
          >
            <Layers size={14} />
            <span>Lihat di Peta GIS</span>
          </Link>
        </div>
      </section>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[#706B62]">Total Klaster Pasar</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#24231F]">
            {counts.total} Klaster
          </p>
          <p className="mt-0.5 text-[10px] text-[#898277]">Radius konsensus ≤ 3 km</p>
        </div>

        <div className="rounded-xl border border-[#27815A]/30 bg-[#E3F0E7] p-4 shadow-sm">
          <p className="text-xs font-semibold text-[#1B5B3F]">Disetujui (Tampil di GIS)</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#27815A]">
            {counts.approved} Klaster
          </p>
          <p className="mt-0.5 text-[10px] text-[#4D6655]">Tampil berdampingan dgn harga resmi</p>
        </div>

        <div className="rounded-xl border border-[#DED8CD] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[#96620A]">Menunggu Persetujuan</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#96620A]">
            {counts.pending} Klaster
          </p>
          <p className="mt-0.5 text-[10px] text-[#898277]">Siap ditinjau Admin TPID</p>
        </div>

        <div className="rounded-xl border border-[#DC4840]/30 bg-[#FBE7E4] p-4 shadow-sm">
          <p className="text-xs font-semibold text-[#B52D26]">Ditolak / Anomali</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#DC4840]">
            {counts.rejected} Klaster
          </p>
          <p className="mt-0.5 text-[10px] text-[#898277]">Tidak ditampilkan di publik/GIS</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DED8CD] bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#706B62]">
          <Filter size={14} className="text-[#67151D]" />
          <span>Filter Status Persetujuan:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Semua Klaster' },
            { id: 'approved', label: 'Disetujui (Dual-Source Aktif)' },
            { id: 'pending', label: 'Menunggu Approval' },
            { id: 'rejected', label: 'Ditolak' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filterStatus === tab.id
                  ? 'bg-[#67151D] text-white shadow-sm'
                  : 'bg-[#FBF9F4] text-[#706B62] hover:bg-[#F0ECE4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cluster Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredClusters.map((c) => {
          const isApproved = c.statusApproval === 'approved';
          const isRejected = c.statusApproval === 'rejected';
          const selisihPersen = Number(
            (((c.hargaWargaRp - c.hargaResmiRp) / Math.max(1, c.hargaResmiRp)) * 100).toFixed(1)
          );

          return (
            <div
              key={c.id}
              className="flex flex-col justify-between space-y-4 rounded-xl border border-[#DED8CD] bg-white p-5 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#898277]">
                      Tiket #{c.ticketCode} • Radius {c.radiusKm} km • {c.jumlahLaporan} laporan
                    </span>
                    <h3 className="mt-0.5 text-sm font-extrabold text-[#24231F]">
                      {c.namaPasar} — {c.regionName}
                    </h3>
                    <p className="text-xs font-bold text-[#67151D]">{c.commodityName}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      isApproved
                        ? 'bg-[#E3F0E7] text-[#287653]'
                        : isRejected
                        ? 'bg-[#FBE7E4] text-[#DC4840]'
                        : 'bg-[#FBF0D7] text-[#96620A]'
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <AlertTriangle size={11} />
                    )}
                    <span>
                      {isApproved
                        ? 'Disetujui (Tampil)'
                        : isRejected
                        ? 'Ditolak'
                        : 'Menunggu Approval'}
                    </span>
                  </span>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#F0ECE4] bg-[#FBF9F4] p-3 font-mono text-xs">
                  <div>
                    <span className="block font-sans text-[10px] text-[#898277]">
                      Harga Warga:
                    </span>
                    <strong className="text-[#24231F]">
                      Rp{numberFormat.format(c.hargaWargaRp)}
                    </strong>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] text-[#898277]">
                      Harga Resmi:
                    </span>
                    <strong className="text-[#706B62]">
                      Rp{numberFormat.format(c.hargaResmiRp)}
                    </strong>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] text-[#898277]">
                      Selisih:
                    </span>
                    <strong
                      className={selisihPersen > 5 ? 'text-[#DC4840]' : 'text-[#287653]'}
                    >
                      {selisihPersen > 0 ? `+${selisihPersen}%` : `${selisihPersen}%`}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#F0ECE4] pt-3 text-[11px] text-[#898277]">
                <span>{c.updatedAt}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.id, 'approved')}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 font-bold transition ${
                      isApproved
                        ? 'bg-[#287653] text-white'
                        : 'border border-[#DED8CD] bg-[#FBF9F4] text-[#287653] hover:bg-[#E3F0E7]'
                    }`}
                  >
                    <ThumbsUp size={11} />
                    <span>{isApproved ? 'Sudah Disetujui' : 'Setujui'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.id, 'rejected')}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 font-bold transition ${
                      isRejected
                        ? 'bg-[#DC4840] text-white'
                        : 'border border-[#DED8CD] bg-[#FBF9F4] text-[#DC4840] hover:bg-[#FBE7E4]'
                    }`}
                  >
                    <ThumbsDown size={11} />
                    <span>Tolak</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GISLayout>
  );
}
