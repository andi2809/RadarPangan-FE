'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LaporPage() {
  const [commodity, setCommodity] = useState('cabai-rawit');
  const [market, setMarket] = useState('Pasar Ciroyom, Kota Bandung');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Ticket Lookup State
  const [searchTicket, setSearchTicket] = useState('');
  const [ticketResult, setTicketResult] = useState<{
    id: string;
    commodity: string;
    market: string;
    price: number;
    quorum: number;
    status: 'Menunggu Kuorum' | 'Tervalidasi' | 'Ditolak';
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const generated = 'TKT-20261024-' + Math.floor(1000 + Math.random() * 9000);
      setTicketId(generated);
      setIsSubmitting(false);
    }, 600);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicket) return;
    setTicketResult({
      id: searchTicket.toUpperCase(),
      commodity: 'Cabai Rawit Merah',
      market: 'Pasar Ciroyom, Kota Bandung',
      price: 54000,
      quorum: 8,
      status: 'Menunggu Kuorum'
    });
  };

  return (
    <div className="lapor-page py-12 bg-[#f8f4e9]">
      <div className="container max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="section-label inline-block px-3 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider border border-[#ded8c8]">
            Partisipasi Warga &bull; Crowdsource EWS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Laporkan Harga Belanjaan Pasar
          </h1>
          <p className="text-sm text-[#68685e] leading-relaxed">
            Bantu tetangga dan pemerintah daerah mendeteksi kelangkaan pasokan lebih cepat. Setiap laporan diverifikasi algoritma kuorum konsensus 10 warga sebelum dipublikasikan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Form (Col 7) */}
          <div className="lg:col-span-7 bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#1e221f] pb-3 border-b border-[#ded8c8] flex items-center justify-between">
              <span>Formulir Laporan Mandiri</span>
              <span className="text-[11px] font-mono text-[#4b9d73] flex items-center gap-1 font-bold">
                <span>●</span> GPS Geotag Aktif
              </span>
            </h2>

            {ticketId ? (
              <div className="p-6 rounded-xl bg-[#e0f0e2] border border-[#badfc4] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#4b9d73] text-white flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1e221f]">Laporan Berhasil Terkirim!</h3>
                  <p className="text-xs text-[#68685e] mt-1">
                    Simpan kode tiket di bawah untuk memantau status validasi kuorum konsensus:
                  </p>
                  <div className="font-mono text-xl font-black text-[#67151d] bg-[#fffdf7] p-2.5 rounded-lg border border-[#badfc4] my-3 inline-block">
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
                  className="btn btn-sm py-2 px-4 rounded-lg bg-[#67151d] text-white font-bold text-xs"
                >
                  Kirim Laporan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[#1e221f] mb-1.5 font-bold">Komoditas Pokok</label>
                  <select
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs font-bold text-[#1e221f] focus:outline-none"
                  >
                    <option value="cabai-rawit">Cabai Rawit Merah</option>
                    <option value="beras-medium">Beras Medium</option>
                    <option value="bawang-merah">Bawang Merah</option>
                    <option value="telur-ayam">Telur Ayam Ras</option>
                    <option value="minyakita">Minyak Goreng Minyakita</option>
                    <option value="daging-ayam">Daging Ayam Broiler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1e221f] mb-1.5 font-bold">Lokasi Pasar Rakyat</label>
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs font-bold text-[#1e221f] focus:outline-none"
                  >
                    <option value="Pasar Ciroyom, Kota Bandung">Pasar Ciroyom, Kota Bandung</option>
                    <option value="Pasar Baru Bandung, Kota Bandung">Pasar Baru, Kota Bandung</option>
                    <option value="Pasar Cikarang Pusat, Kab. Bekasi">Pasar Cikarang Pusat, Kab. Bekasi</option>
                    <option value="Pasar Tambun, Kab. Bekasi">Pasar Tambun, Kab. Bekasi</option>
                    <option value="Pasar Guntur, Kab. Garut">Pasar Guntur, Kab. Garut</option>
                    <option value="Pasar Johar, Kab. Karawang">Pasar Johar, Kab. Karawang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1e221f] mb-1.5 font-bold">Harga Transaksi Riil (Rp per satuan)</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 54000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] font-mono text-sm font-bold text-[#1e221f] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#68685e] mt-1 block">
                    *Masukkan nominal harga yang Anda bayar di lapak/pedagang hari ini.
                  </span>
                </div>

                <div>
                  <label className="block text-[#1e221f] mb-1.5 font-bold">Catatan Tambahan (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Pasokan agak sedikit di pedagang sayur sayap timur."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs text-[#1e221f] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-3 rounded-lg bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Mengirim Laporan...</span>
                  ) : (
                    <>
                      <span>Kirim Laporan Harga Pasar</span>
                      <span>&rarr;</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Ticket Tracker & Verification Guide (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ticket Tracker Box */}
            <div className="bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#1e221f] pb-2 border-b border-[#ded8c8]">
                Lacak Status Kode Tiket
              </h3>
              <form onSubmit={handleLookup} className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Contoh: TKT-20261024-8842"
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] font-mono font-bold text-xs uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#67151d] text-white font-bold text-xs hover:bg-[#4c0d15]"
                >
                  Cek
                </button>
              </form>

              {ticketResult && (
                <div className="p-3.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs space-y-2">
                  <div className="flex justify-between font-mono font-bold">
                    <span>{ticketResult.id}</span>
                    <span className="text-[#8a6212]">{ticketResult.status}</span>
                  </div>
                  <div className="text-[11px] text-[#68685e]">
                    {ticketResult.commodity} &bull; {ticketResult.market}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#ded8c8] text-[11px]">
                    <span>Kuorum Laporan:</span>
                    <strong className="font-mono text-[#67151d]">{ticketResult.quorum} / 10 Warga</strong>
                  </div>
                  <div className="h-1.5 bg-[#ded8c8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8a6212] rounded-full w-[80%]" />
                  </div>
                </div>
              )}
            </div>

            {/* Validation Rules */}
            <div className="bg-[#f0ebde] border border-[#ded8c8] rounded-xl p-5 text-xs text-[#68685e] space-y-3">
              <strong className="text-[#1e221f] block font-bold text-sm">
                Integritas Data Laporan
              </strong>
              <p className="leading-relaxed">
                Untuk mencegah manipulasi spekulan atau harga palsu:
              </p>
              <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                <li>Titik GPS wajib berada dalam radius maksimal 3 km dari pasar.</li>
                <li>Dibutuhkan 10 laporan independen dalam 24 jam untuk membentuk kuorum.</li>
                <li>Laporan dengan deviasi ekstrem &gt;10% otomatis tersaring oleh algoritma MAD.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
