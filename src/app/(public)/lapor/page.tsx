'use client';

import React, { useMemo, useState } from 'react';
import commoditiesData from '../../../data/mock/commodities.json';
import regionsData from '../../../data/mock/regions.json';
import { OFFICIAL_MARKETS_BY_REGION } from '../../../data/mock/officialMarkets';
import { loadCitizenReports, saveCitizenReports } from '../../../utils/dual-source-store';
import { getMarketConsensusByCommodity } from '../../../data/mock/marketConsensus';

type LocationType = 'pasar' | 'warung';

// Filter komoditas eceran harian masyarakat tanpa penyebutan merek/program khusus
const PUBLIC_COMMODITIES = commoditiesData.filter((c) => c.id !== 'beras_sphp');

export default function LaporPage() {
  const sortedRegions = useMemo(
    () => [...regionsData].sort((a, b) => a.name.localeCompare(b.name, 'id')),
    []
  );

  const [selectedRegionId, setSelectedRegionId] = useState<string>('32.73'); // Default: Kota Bandung
  const [locationType, setLocationType] = useState<LocationType>('pasar');
  const [selectedMarketName, setSelectedMarketName] = useState<string>('Pasar Ciroyom');
  const [warungAreaNote, setWarungAreaNote] = useState<string>('');
  const [commodity, setCommodity] = useState<string>('cabai_rawit_merah');
  const [price, setPrice] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [searchTicket, setSearchTicket] = useState<string>('');
  const [ticketResult, setTicketResult] = useState<{
    id: string;
    commodity: string;
    market: string;
    price: number;
    quorum: number;
    status: 'Dalam Pemeriksaan Pembanding' | 'Terverifikasi' | 'Ditandai Tidak Wajar';
  } | null>(null);

  const activeRegion = useMemo(
    () => sortedRegions.find((r) => r.id === selectedRegionId) || sortedRegions[0],
    [sortedRegions, selectedRegionId]
  );

  const regionMarketDir = useMemo(
    () =>
      OFFICIAL_MARKETS_BY_REGION[selectedRegionId] || {
        regionId: selectedRegionId,
        regionName: activeRegion?.name || 'Kota Bandung',
        instansiPengelola: 'UPTD Pasar Dinas Perdagangan Setempat',
        markets: [],
      },
    [selectedRegionId, activeRegion]
  );

  const selectedComm = useMemo(
    () => PUBLIC_COMMODITIES.find((c) => c.id === commodity) || PUBLIC_COMMODITIES[0],
    [commodity]
  );

  const handleRegionChange = (newRegionId: string) => {
    setSelectedRegionId(newRegionId);
    const dir = OFFICIAL_MARKETS_BY_REGION[newRegionId];
    if (dir && dir.markets.length > 0) {
      setSelectedMarketName(dir.markets[0].name);
    } else {
      setSelectedMarketName('');
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya izinkan karakter angka murni (0-9)
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setPrice(digitsOnly);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseInt(price.replace(/\D/g, ''), 10);
    if (!numericPrice || numericPrice <= 0) return;

    setIsSubmitting(true);

    const locationLabel =
      locationType === 'pasar'
        ? selectedMarketName || regionMarketDir.markets[0]?.name || 'Pasar Rakyat Resmi'
        : warungAreaNote.trim()
        ? `Warung / Toko Eceran (${warungAreaNote.trim()})`
        : 'Warung / Toko Eceran Setempat';

    const generatedCode = 'TKT-20261024-' + Math.floor(1000 + Math.random() * 9000);

    // Hitung kuorum dinamis untuk pasar & komoditas yang dilaporkan
    const marketsData = getMarketConsensusByCommodity(selectedComm.id);
    const targetMarket = marketsData.find(
      (m) =>
        m.namaPasar.toLowerCase() === locationLabel.toLowerCase() ||
        m.regionId === activeRegion.id
    );
    const currentCount = targetMarket ? targetMarket.laporanValid + 1 : 1;
    const isQuorumReached = currentCount >= 10;

    const existing = loadCitizenReports();
    saveCitizenReports([
      {
        id: `CLUST-${Date.now()}`,
        ticketCode: generatedCode,
        regionId: activeRegion.id,
        regionName: activeRegion.name,
        commodityId: selectedComm.id,
        commodityName: selectedComm.name,
        namaPasar: locationLabel,
        hargaWargaRp: numericPrice,
        hargaResmiRp: selectedComm.hargaAcuanRp || 45000,
        jumlahLaporan: currentCount,
        radiusKm: locationType === 'pasar' ? 1.8 : 2.4,
        statusApproval: isQuorumReached ? 'approved' : 'pending',
        updatedAt: 'Baru saja dikirim warga',
      },
      ...existing,
    ]);

    setTicketId(generatedCode);
    setIsSubmitting(false);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicket.trim()) return;
    const code = searchTicket.trim().toUpperCase();
    const matched = loadCitizenReports().find(
      (item) => item.ticketCode.toUpperCase() === code || item.id.toUpperCase() === code
    );
    if (matched) {
      setTicketResult({
        id: matched.ticketCode,
        commodity: matched.commodityName,
        market: `${matched.namaPasar}, ${matched.regionName}`,
        price: matched.hargaWargaRp,
        quorum: matched.jumlahLaporan,
        status:
          matched.statusApproval === 'approved'
            ? 'Terverifikasi'
            : matched.statusApproval === 'rejected'
            ? 'Ditandai Tidak Wajar'
            : 'Dalam Pemeriksaan Pembanding',
      });
      return;
    }
    setTicketResult({
      id: code,
      commodity: 'Cabai Rawit Merah',
      market: 'Pasar Ciroyom, Kota Bandung',
      price: 48000,
      quorum: 8,
      status: 'Dalam Pemeriksaan Pembanding',
    });
  };

  const formattedPricePreview = useMemo(() => {
    const num = parseInt(price, 10);
    if (!num || isNaN(num)) return null;
    return `Rp ${num.toLocaleString('id-ID')} / ${selectedComm.satuan}`;
  }, [price, selectedComm.satuan]);

  return (
    <div className="py-12 md:py-16 bg-[#f8f4e9]">
      <div className="public-container max-w-5xl space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider border border-[#d6cebe]">
            Partisipasi Masyarakat &bull; Pelaporan Terbuka
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Laporkan Harga Belanjaan Pasar
          </h1>
          <p className="text-base sm:text-lg text-[#4a4b44] leading-relaxed">
            Sampaikan informasi harga eceran yang Anda temukan di pasar rakyat resmi atau warung setempat. Setiap laporan akan melewati tahapan pemeriksaan lokasi dan perbandingan sebelum ditampilkan sebagai informasi publik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[#e5dfd0] flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-extrabold text-[#1e221f]">
                Formulir Laporan Harga Warga
              </h2>
              <span className="text-xs font-mono text-[#2d6a4f] bg-[#e0f0e2] px-2.5 py-1 rounded-md font-bold">
                ● Pemeriksaan Lokasi Aktif
              </span>
            </div>

            {ticketId ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#e0f0e2]/70 border border-[#badfc4] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#4b9d73] text-white flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#1e221f]">
                    Laporan Berhasil Diterima
                  </h3>
                  <p className="text-sm text-[#4a4b44]">
                    Simpan kode tiket berikut untuk memeriksa status perbandingan laporan Anda:
                  </p>
                  <div className="font-mono text-xl sm:text-2xl font-black text-[#67151d] bg-[#fffdf7] py-2.5 px-5 rounded-xl border border-[#badfc4] inline-block">
                    {ticketId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTicketId(null);
                    setPrice('');
                    setNotes('');
                    setWarungAreaNote('');
                  }}
                  className="py-2.5 px-5 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-sm transition-colors"
                >
                  Kirim Laporan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                {/* 1. Pilih Wilayah Kabupaten / Kota */}
                <div>
                  <label htmlFor="laporRegion" className="block text-[#1e221f] mb-1.5 font-bold">
                    1. Wilayah Kabupaten / Kota (Jawa Barat)
                  </label>
                  <div className="relative">
                    <select
                      id="laporRegion"
                      value={selectedRegionId}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      className="w-full appearance-none pl-4 pr-11 py-3 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none transition-colors"
                    >
                      {sortedRegions.map((reg) => (
                        <option key={reg.id} value={reg.id}>
                          {reg.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="w-5 h-5 text-[#67151d] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* 2. Pilih Jenis Tempat Pembelian (Tombol Pasar Resmi vs Warung) */}
                <div>
                  <span className="block text-[#1e221f] mb-1.5 font-bold">
                    2. Jenis Tempat Pembelian
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Jenis Tempat Pembelian">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={locationType === 'pasar'}
                      onClick={() => setLocationType('pasar')}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                        locationType === 'pasar'
                          ? 'bg-[#67151d] text-white border-[#67151d] shadow-sm'
                          : 'bg-[#f8f4e9] hover:bg-[#f0ebde] text-[#1e221f] border-[#bfb7a6]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          locationType === 'pasar' ? 'border-white bg-white/20' : 'border-[#5c5b52]'
                        }`}
                      >
                        {locationType === 'pasar' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </span>
                      <div>
                        <span className="font-extrabold text-sm block leading-snug">
                          Pasar Rakyat Terdata
                        </span>
                        <span
                          className={`text-xs block mt-0.5 ${
                            locationType === 'pasar' ? 'text-[#f2d6d3]' : 'text-[#5c5b52]'
                          }`}
                        >
                          Pasar tradisional resmi ({regionMarketDir.markets.length} titik di {activeRegion.name})
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={locationType === 'warung'}
                      onClick={() => setLocationType('warung')}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                        locationType === 'warung'
                          ? 'bg-[#67151d] text-white border-[#67151d] shadow-sm'
                          : 'bg-[#f8f4e9] hover:bg-[#f0ebde] text-[#1e221f] border-[#bfb7a6]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          locationType === 'warung' ? 'border-white bg-white/20' : 'border-[#5c5b52]'
                        }`}
                      >
                        {locationType === 'warung' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </span>
                      <div>
                        <span className="font-extrabold text-sm block leading-snug">
                          Warung / Toko Eceran
                        </span>
                        <span
                          className={`text-xs block mt-0.5 ${
                            locationType === 'warung' ? 'text-[#f2d6d3]' : 'text-[#5c5b52]'
                          }`}
                        >
                          Warung sembako atau toko kelontong lingkungan warga
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. Pilih Nama Pasar (Hanya tampil jika memilih Pasar Rakyat Terdata) */}
                {locationType === 'pasar' ? (
                  <div>
                    <label htmlFor="laporMarket" className="block text-[#1e221f] mb-1.5 font-bold">
                      3. Nama Pasar Rakyat Resmi di {activeRegion.name}
                    </label>
                    <div className="relative">
                      <select
                        id="laporMarket"
                        value={selectedMarketName}
                        onChange={(e) => setSelectedMarketName(e.target.value)}
                        className="w-full appearance-none pl-4 pr-11 py-3 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none transition-colors"
                      >
                        {regionMarketDir.markets.map((mkt) => (
                          <option key={mkt.id} value={mkt.name}>
                            {mkt.name} — Kec. {mkt.kecamatan}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-5 h-5 text-[#67151d] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-[#5c5b52] mt-1.5 block">
                      Daftar di atas hanya memuat pasar rakyat permanen yang terdata resmi pada{' '}
                      <strong className="text-[#1e221f]">{regionMarketDir.instansiPengelola}</strong> (bukan pasar kaget).
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#f0ebde] border border-[#d6cebe] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#67151d] block">
                          Pelaporan Tingkat Warung / Eceran Warga
                        </span>
                        <p className="text-xs sm:text-sm text-[#4a4b44] mt-0.5">
                          Anda tidak perlu memilih daftar pasar. Laporan akan langsung dicatat sebagai harga transaksi warung di wilayah{' '}
                          <strong className="text-[#1e221f]">{activeRegion.name}</strong>.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="laporWarungArea" className="block text-xs font-bold text-[#1e221f] mb-1">
                        Kecamatan / Kelurahan Lokasi Warung (Opsional)
                      </label>
                      <input
                        id="laporWarungArea"
                        type="text"
                        placeholder={`Contoh: Kec. Coblong, ${activeRegion.name}`}
                        value={warungAreaNote}
                        onChange={(e) => setWarungAreaNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#fffdf7] border border-[#bfb7a6] focus:border-[#67151d] text-xs sm:text-sm text-[#1e221f] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Komoditas Pangan Pokok */}
                <div>
                  <label htmlFor="laporComm" className="block text-[#1e221f] mb-1.5 font-bold">
                    {locationType === 'pasar' ? '4.' : '3.'} Komoditas Pangan Pokok
                  </label>
                  <div className="relative">
                    <select
                      id="laporComm"
                      value={commodity}
                      onChange={(e) => setCommodity(e.target.value)}
                      className="w-full appearance-none pl-4 pr-11 py-3 rounded-xl bg-[#f8f4e9] hover:bg-[#f0ebde] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] cursor-pointer focus:outline-none transition-colors"
                    >
                      {PUBLIC_COMMODITIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (Satuan: /{c.satuan})
                        </option>
                      ))}
                    </select>
                    <svg
                      className="w-5 h-5 text-[#67151d] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-[#5c5b52] mt-1.5 block">
                    Referensi acuan pemerintah ({selectedComm.jenisAcuan === 'HET' ? 'HET' : 'HAP'}):{' '}
                    <strong className="font-mono text-[#1e221f]">
                      Rp {selectedComm.hargaAcuanRp.toLocaleString('id-ID')}/{selectedComm.satuan}
                    </strong>
                  </span>
                </div>

                {/* 5. Harga Eceran yang Ditemukan (Tanpa Spinner & Bebas Perubahan Scroll Trackpad) */}
                <div>
                  <label htmlFor="laporPrice" className="block text-[#1e221f] mb-1.5 font-bold">
                    {locationType === 'pasar' ? '5.' : '4.'} Harga Eceran yang Ditemukan (Rp)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-mono font-bold text-sm sm:text-base text-[#5c5b52] pointer-events-none select-none">
                      Rp
                    </span>
                    <input
                      id="laporPrice"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      required
                      placeholder={`Contoh: ${selectedComm.hargaAcuanRp}`}
                      value={price}
                      onChange={handlePriceChange}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-full pl-11 pr-20 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] font-mono text-base font-bold text-[#1e221f] focus:outline-none"
                    />
                    <span className="absolute right-4 font-mono text-xs sm:text-sm font-bold text-[#5c5b52] pointer-events-none select-none">
                      /{selectedComm.satuan}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 text-xs text-[#5c5b52]">
                    <span>Masukkan angka harga per {selectedComm.satuan} tanpa titik atau koma.</span>
                    {formattedPricePreview && (
                      <span className="font-mono font-bold text-[#67151d] bg-[#f0ebde] px-2 py-0.5 rounded">
                        Terbaca: {formattedPricePreview}
                      </span>
                    )}
                  </div>
                </div>

                {/* 6. Keterangan Tambahan */}
                <div>
                  <label htmlFor="laporNotes" className="block text-[#1e221f] mb-1.5 font-bold">
                    Keterangan Tambahan (Opsional)
                  </label>
                  <textarea
                    id="laporNotes"
                    rows={3}
                    placeholder={
                      locationType === 'pasar'
                        ? 'Contoh: Harga di blok pedagang eceran pintu timur.'
                        : 'Contoh: Harga beli eceran di warung sembako RT setempat.'
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm text-[#1e221f] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Memproses Laporan...</span>
                  ) : (
                    <>
                      <span>Kirim Laporan Harga {locationType === 'pasar' ? 'Pasar' : 'Warung'}</span>
                      <span aria-hidden="true">&rarr;</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Ticket Tracker & Plain-Language Verification Steps (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#fffdf7] border border-[#d6cebe] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-[#1e221f] pb-2.5 border-b border-[#e5dfd0]">
                Periksa Status Kode Tiket Laporan
              </h2>
              <form onSubmit={handleLookup} className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Contoh: TKT-20261024-8842"
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#f8f4e9] border border-[#bfb7a6] font-mono font-bold text-sm uppercase"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-sm transition-colors"
                >
                  Cek
                </button>
              </form>

              {ticketResult && (
                <div className="p-4 rounded-xl bg-[#f8f4e9] border border-[#d6cebe] text-sm space-y-2">
                  <div className="flex justify-between font-mono font-bold">
                    <span>{ticketResult.id}</span>
                    <span className="text-[#92400e]">{ticketResult.status}</span>
                  </div>
                  <div className="text-xs text-[#5c5b52]">
                    {ticketResult.commodity} &bull; {ticketResult.market}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#e5dfd0] text-xs">
                    <span>Jumlah Laporan Pembanding:</span>
                    <strong className="font-mono text-[#67151d]">
                      {ticketResult.quorum} dari 10 Laporan
                    </strong>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#f0ebde] border border-[#d6cebe] rounded-2xl p-6 space-y-4 text-sm text-[#4a4b44]">
              <h3 className="text-lg font-extrabold text-[#1e221f]">
                Bagaimana Laporan Warga Diperiksa?
              </h3>
              <ol className="space-y-3 leading-relaxed">
                <li>
                  <strong className="text-[#1e221f] block">1. Lokasi Diperiksa</strong>
                  Sistem memeriksa kesesuaian lokasi laporan dengan area pasar rakyat resmi atau wilayah kecamatan warung yang dipilih (radius koordinat maksimal 3 km).
                </li>
                <li>
                  <strong className="text-[#1e221f] block">2. Laporan Dibandingkan</strong>
                  Laporan dari warga lain pada pasar/wilayah dan periode waktu yang sama digunakan sebagai pembanding (ketentuan minimal 10 laporan independen).
                </li>
                <li>
                  <strong className="text-[#1e221f] block">3. Harga Tidak Wajar Diperiksa</strong>
                  Laporan yang berbeda jauh dari laporan lain (melampaui batas toleransi deviasi 10%) ditandai untuk diperiksa lebih lanjut.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
