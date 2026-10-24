'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GISLayout } from '@/components/gis/layout/GISLayout';
import { getAllRegions, getAllCommodities, getTelemetry } from '@/utils/geo-loader';
import { Database, Search, ArrowUpDown, ChevronRight, Layers, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WilayahPage() {
  const regions = useMemo(() => getAllRegions(), []);
  const commodities = useMemo(() => getAllCommodities(), []);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('cabai_rawit_merah');
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'name' | 'umk' | 'price' | 'status'>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const rawTelemetry = useMemo(
    () => getTelemetry(selectedCommodity) as Record<string, any>,
    [selectedCommodity]
  );

  const filteredRegions = useMemo(() => {
    return regions
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
      .map((r) => {
        const telem = rawTelemetry[r.id];
        return {
          ...r,
          currentPriceRp: telem?.currentPrice?.hargaAktualRp || 45000,
          forecastPriceRp: telem?.predictionH7?.hargaPrediksiH7Rp || 47000,
          status: telem?.currentPrice?.status || 'aman',
          selisihPersen: telem?.currentPrice?.selisihPersen || 0,
        };
      })
      .sort((a, b) => {
        let valA: any = a.name;
        let valB: any = b.name;
        if (sortField === 'umk') {
          valA = a.umk2026;
          valB = b.umk2026;
        } else if (sortField === 'price') {
          valA = a.currentPriceRp;
          valB = b.currentPriceRp;
        } else if (sortField === 'status') {
          valA = a.status;
          valB = b.status;
        }
        return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });
  }, [regions, search, rawTelemetry, sortField, sortAsc]);

  const handleSort = (field: 'name' | 'umk' | 'price' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <GISLayout>
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end border-b border-[#DED8CD] pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#74151C]">
            <Database size={15} />
            Data Wilayah & Disparitas Spasial
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-[#24231F]">
            Basis Data Pemantauan 27 Kab/Kota Jawa Barat
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#706B62] max-w-2xl">
            Tabel komprehensif disparitas harga pangan harian, standar UMK, status neraca pasokan, dan klasifikasi Early Warning System per daerah.
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

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-[#DED8CD] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-3 text-[#898277]" />
          <input
            type="text"
            placeholder="Cari nama kabupaten atau kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#D8D1C5] text-xs font-medium outline-none focus:border-[#74151C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#706B62]">Komoditas:</span>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="h-10 rounded-lg border border-[#D8D1C5] bg-white px-3 text-xs font-bold text-[#24231F] outline-none focus:border-[#74151C]"
          >
            <option value="cabai_rawit_merah">Cabai Rawit Merah</option>
            <option value="bawang_merah">Bawang Merah</option>
            <option value="beras_medium">Beras Medium</option>
            <option value="telur_ayam_ras">Telur Ayam Ras</option>
            <option value="minyakita">Minyakita</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-[#DED8CD] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F4] border-b border-[#DED8CD] text-[11px] font-bold text-[#706B62] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:text-[#24231F]" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Wilayah</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4">Tipe & Provinsi</th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#24231F]" onClick={() => handleSort('umk')}>
                  <div className="flex items-center gap-1">
                    <span>UMK 2026</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#24231F]" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">
                    <span>Harga Riil</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4">Proyeksi H+7</th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#24231F]" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    <span>Status EWS</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4] font-medium text-[12px]">
              {filteredRegions.map((r) => {
                const isKritis = r.status === 'kritis';
                const isWaspada = r.status === 'waspada';
                const statusBadge = isKritis ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBE7E4] text-[#DC4840] border border-[#DC4840]/30">
                    <ShieldAlert size={12} /> Kritis
                  </span>
                ) : isWaspada ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBF0D7] text-[#96620A] border border-[#E9B949]/40">
                    <AlertCircle size={12} /> Waspada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E3F0E7] text-[#287653] border border-[#27815A]/30">
                    <CheckCircle2 size={12} /> Terkendali
                  </span>
                );

                return (
                  <tr key={r.id} className="hover:bg-[#FAF6EE] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#24231F]">
                      {r.name}
                      <span className="text-[10px] text-[#898277] font-mono block">{r.id}</span>
                    </td>
                    <td className="py-3 px-4 text-[#706B62]">
                      {r.type === 'KOTA' ? 'Kota' : 'Kabupaten'} &bull; Jawa Barat
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#24231F]">
                      Rp {r.umk2026.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#24231F]">
                      Rp {r.currentPriceRp.toLocaleString('id-ID')}/kg
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={isKritis ? 'text-[#DC4840]' : 'text-[#24231F]'}>
                        Rp {r.forecastPriceRp.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="py-3 px-4">{statusBadge}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard?region=${r.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#74151C] hover:underline"
                      >
                        <span>Fokus Peta</span>
                        <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </GISLayout>
  );
}
