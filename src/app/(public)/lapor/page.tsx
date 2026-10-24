'use client';

import React, { useState } from 'react';
import commoditiesData from '../../../data/mock/commodities.json';

export default function LaporPage() {
  const [commodity, setCommodity] = useState('cabai_rawit_merah');
  const [market, setMarket] = useState('Pasar Ciroyom, Kota Bandung');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [searchTicket, setSearchTicket] = useState('');
  const [ticketResult, setTicketResult] = useState<{
    id: string;
    commodity: string;
    market: string;
    price: number;
    quorum: number;
    status: 'Dalam Pemeriksaan Pembanding' | 'Terverifikasi' | 'Ditandai Tidak Wajar';
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const generated = 'TKT-20261024-' + Math.floor(1000 + Math.random() * 9000);
      setTicketId(generated);
      setIsSubmitting(false);
    }, 500);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicket) return;
    setTicketResult({
      id: searchTicket.toUpperCase(),
      commodity: 'Cabai Rawit Merah',
      market: 'Pasar Ciroyom, Kota Bandung',
      price: 48000,
      quorum: 8,
      status: 'Dalam Pemeriksaan Pembanding',
    });
  };

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
            Sampaikan informasi harga eceran yang Anda temukan di pasar tradisional atau warung setempat. Setiap laporan akan melewati tahapan pemeriksaan lokasi dan perbandingan sebelum ditampilkan sebagai informasi publik.
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
                  }}
                  className="py-2.5 px-5 rounded-xl bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-sm transition-colors"
                >
                  Kirim Laporan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                <div>
                  <label htmlFor="laporComm" className="block text-[#1e221f] mb-1.5 font-bold">
                    Komoditas Pangan Pokok
                  </label>
                  <select
                    id="laporComm"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] focus:outline-none"
                  >
                    {commoditiesData.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Satuan: /{c.satuan})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="laporMarket" className="block text-[#1e221f] mb-1.5 font-bold">
                    Lokasi Pasar Rakyat
                  </label>
                  <select
                    id="laporMarket"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] text-sm sm:text-base font-bold text-[#1e221f] focus:outline-none"
                  >
                    <option value="Pasar Ciroyom, Kota Bandung">Pasar Ciroyom, Kota Bandung</option>
                    <option value="Pasar Baru, Kota Bandung">Pasar Baru, Kota Bandung</option>
                    <option value="Pasar Cikarang Pusat, Kab. Bekasi">Pasar Cikarang Pusat, Kab. Bekasi</option>
                    <option value="Pasar Kranji Baru, Kota Bekasi">Pasar Kranji Baru, Kota Bekasi</option>
                    <option value="Pasar Guntur, Kab. Garut">Pasar Guntur, Kab. Garut</option>
                    <option value="Pasar Johar, Kab. Karawang">Pasar Johar, Kab. Karawang</option>
                    <option value="Pasar Kebon Kembang, Kota Bogor">Pasar Kebon Kembang, Kota Bogor</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="laporPrice" className="block text-[#1e221f] mb-1.5 font-bold">
                    Harga Eceran yang Ditemukan (Rp)
                  </label>
                  <input
                    id="laporPrice"
                    type="number"
                    required
                    placeholder="Contoh: 48000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f4e9] border-2 border-[#bfb7a6] focus:border-[#67151d] font-mono text-base font-bold text-[#1e221f] focus:outline-none"
                  />
                  <span className="text-xs text-[#5c5b52] mt-1.5 block">
                    Masukkan harga per satuan komoditas sesuai yang Anda temukan di pasar hari ini.
                  </span>
                </div>

                <div>
                  <label htmlFor="laporNotes" className="block text-[#1e221f] mb-1.5 font-bold">
                    Keterangan Tambahan (Opsional)
                  </label>
                  <textarea
                    id="laporNotes"
                    rows={3}
                    placeholder="Contoh: Harga di blok pedagang eceran pintu timur."
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
                      <span>Kirim Laporan Harga Pasar</span>
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
                  Sistem memeriksa kesesuaian lokasi laporan dengan area pasar yang dipilih (radius koordinat maksimal 3 km).
                </li>
                <li>
                  <strong className="text-[#1e221f] block">2. Laporan Dibandingkan</strong>
                  Laporan dari warga lain pada pasar dan periode waktu yang sama digunakan sebagai pembanding (ketentuan minimal 10 laporan independen).
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
