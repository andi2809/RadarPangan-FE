import React from 'react';
import Link from 'next/link';

export const ChallengeSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#fffdf7] border-b border-[#ded8c8]">
      <div className="public-container">
        {/* Section Header (Badge "Tantangan Kita" removed) */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight leading-[1.15]">
            Tiga Celah Pemantauan Saat Ini
          </h2>
          <p className="text-base sm:text-lg text-[#4a4b44] mt-3 leading-relaxed">
            Memantau perkembangan harga pangan membutuhkan lebih dari sekadar angka tunggal. Masyarakat dan pengambil kebijakan sering kali menghadapi tiga keterbatasan informasi berikut saat membaca data harga di lapangan.
          </p>
        </div>

        {/* Editorial 3-Column Layout (2 cols on tablet, 3 cols on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 pt-8 border-t border-[#d6cebe]">
          {/* Column 01 */}
          <article className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#67151d] leading-none">
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f] leading-snug">
                Informasi Harga Perlu Konteks yang Jelas
              </h3>
              <p className="text-base text-[#4a4b44] leading-relaxed">
                Masyarakat perlu mengetahui sumber data, tanggal observasi, cakupan wilayah, dan jadwal pembaruan agar bisa menilai apakah informasi harga masih relevan.
              </p>
            </div>

            {/* Supporting Editorial Visual */}
            <div className="bg-[#f8f4e9] border-l-4 border-[#67151d] rounded-r-xl p-4 space-y-2.5 text-sm">
              <div className="font-bold text-[#1e221f] text-xs font-mono uppercase tracking-wider">
                Atribut Konteks yang Disertakan:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#fffdf7] p-2.5 rounded-lg border border-[#e2dcd0]">
                  <span className="text-[#5c5b52] block">Sumber &amp; Acuan</span>
                  <strong className="text-[#1e221f] font-semibold">Bapanas / PIHPS BI</strong>
                </div>
                <div className="bg-[#fffdf7] p-2.5 rounded-lg border border-[#e2dcd0]">
                  <span className="text-[#5c5b52] block">Tanggal Observasi</span>
                  <strong className="text-[#1e221f] font-mono">Tertera per Periode</strong>
                </div>
                <div className="bg-[#fffdf7] p-2.5 rounded-lg border border-[#e2dcd0]">
                  <span className="text-[#5c5b52] block">Level Geografis</span>
                  <strong className="text-[#1e221f] font-semibold">Kabupaten / Kota</strong>
                </div>
                <div className="bg-[#fffdf7] p-2.5 rounded-lg border border-[#e2dcd0]">
                  <span className="text-[#5c5b52] block">Pembanding</span>
                  <strong className="text-[#67151d] font-semibold">Standar HAP / HET</strong>
                </div>
              </div>
            </div>
          </article>

          {/* Column 02 */}
          <article className="flex flex-col justify-between space-y-6 md:border-l md:border-[#e2dcd0] md:pl-8 lg:pl-10">
            <div className="space-y-3">
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#67151d] leading-none">
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f] leading-snug">
                Harga Rata-Rata Tidak Selalu Sama dengan Harga Lokal
              </h3>
              <p className="text-base text-[#4a4b44] leading-relaxed">
                Harga rata-rata tingkat nasional atau daerah tidak selalu sama dengan harga yang ditemukan di pasar atau warung tertentu.
              </p>
            </div>

            {/* Supporting Editorial Visual: Regional vs Local Comparison */}
            <div className="bg-[#f8f4e9] border-l-4 border-[#e69b39] rounded-r-xl p-4 space-y-3 text-sm">
              <div className="font-bold text-[#1e221f] text-xs font-mono uppercase tracking-wider">
                Contoh Variasi Cabai Rawit Antarwilayah:
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#4a4b44] font-medium">Kab. Garut (Sentra Produksi)</span>
                    <strong className="font-mono tabular-nums text-[#347b56]">Rp 41.900/kg</strong>
                  </div>
                  <div className="h-2 bg-[#e5dfd0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4b9d73] rounded-full w-[68%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#4a4b44] font-medium">Kota Bandung (Rata-rata Kota)</span>
                    <strong className="font-mono tabular-nums text-[#92400e]">Rp 47.700/kg</strong>
                  </div>
                  <div className="h-2 bg-[#e5dfd0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#e69b39] rounded-full w-[78%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#4a4b44] font-medium">Kota Bekasi (Daerah Konsumsi)</span>
                    <strong className="font-mono tabular-nums text-[#a83c32]">Rp 53.700/kg</strong>
                  </div>
                  <div className="h-2 bg-[#e5dfd0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#e85b4f] rounded-full w-[90%]" />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Column 03 */}
          <article className="flex flex-col justify-between space-y-6 md:col-span-2 lg:col-span-1 lg:border-l lg:border-[#e2dcd0] lg:pl-10">
            <div className="space-y-3">
              <div className="font-mono text-3xl sm:text-4xl font-black text-[#67151d] leading-none">
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e221f] leading-snug">
                Belum Tentu Ada Saluran Pelaporan yang Terintegrasi
              </h3>
              <p className="text-base text-[#4a4b44] leading-relaxed">
                Ketika menemukan perbedaan harga di lapangan, masyarakat membutuhkan mekanisme pelaporan yang jelas dan informasi mengenai bagaimana laporan tersebut diperiksa.
              </p>
            </div>

            {/* Supporting Editorial Visual: Verification Flow */}
            <div className="bg-[#f8f4e9] border-l-4 border-[#4b9d73] rounded-r-xl p-4 space-y-3 text-sm">
              <div className="font-bold text-[#1e221f] text-xs font-mono uppercase tracking-wider">
                Alur Pelaporan &amp; Pemeriksaan Terbuka:
              </div>
              <ol className="space-y-1.5 text-xs text-[#4a4b44]">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#67151d] text-white font-mono font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <span>Warga memilih pasar &amp; mengirim harga temuan</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#67151d] text-white font-mono font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <span>Sistem memeriksa lokasi &amp; membandingkan laporan</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#4b9d73] text-white font-mono font-bold flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <span>Status pemeriksaan dapat dilacak dengan kode tiket</span>
                </li>
              </ol>
              <div className="pt-1">
                <Link
                  href="/lapor"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#67151d] hover:underline"
                >
                  <span>Pelajari &amp; Kirim Laporan Warga</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
