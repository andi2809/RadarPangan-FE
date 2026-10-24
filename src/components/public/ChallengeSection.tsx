'use client';

import React from 'react';

export const ChallengeSection: React.FC = () => {
  return (
    <section className="challenge-section py-14 bg-[#fffdf7] border-b border-[#ded8c8]">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <span className="section-label inline-block px-3 py-1 rounded-full bg-[#f0ebde] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
            Tantangan Kita
          </span>
          <h2 className="section-heading text-3xl sm:text-4xl font-black text-[#1e221f] tracking-tight">
            Tiga Celah Pemantauan Saat Ini
          </h2>
          <p className="section-desc text-sm sm:text-base text-[#68685e] mt-2 leading-relaxed">
            Portal dan tabel harga konvensional belum cukup untuk membaca sinyal krusial yang membuat respon kebijakan sering terlambat, meskipun data sudah tersedia.
          </p>
        </div>

        <div className="challenge-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Challenge 01 */}
          <article className="challenge bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="challenge-head mb-6">
              <span className="challenge-number font-mono text-xs font-black text-[#67151d] px-2 py-0.5 rounded bg-[#f4e8e9] border border-[#dfc7b8] inline-block mb-3">
                01
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#1e221f] mb-1">Terlambat</h3>
                <p className="text-xs text-[#68685e] leading-relaxed">
                  Portal resmi umumnya bersifat retrospektif dan reaktif. Hanya mencatat tabel pasif tanpa sistem peringatan dini sebelum kelangkaan meluas.
                </p>
              </div>
            </div>

            <div className="challenge-art bg-[#fffdf7] p-3.5 rounded-lg border border-[#ded8c8] text-xs space-y-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#68685e]">Data rilis resmi:</span>
                  <strong className="font-mono text-[#e85b4f] font-bold">H+3 baru tersedia</strong>
                </div>
                <div className="h-2 bg-[#e6e2d2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#e85b4f] rounded-full w-[85%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#68685e]">Target deteksi dini:</span>
                  <strong className="font-mono text-[#4b9d73] font-bold">H+0 real-time</strong>
                </div>
                <div className="h-2 bg-[#e6e2d2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4b9d73] rounded-full w-[25%]" />
                </div>
              </div>
            </div>
          </article>

          {/* Challenge 02 */}
          <article className="challenge bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="challenge-head mb-6">
              <span className="challenge-number font-mono text-xs font-black text-[#67151d] px-2 py-0.5 rounded bg-[#f4e8e9] border border-[#dfc7b8] inline-block mb-3">
                02
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#1e221f] mb-1">Tidak Setara</h3>
                <p className="text-xs text-[#68685e] leading-relaxed">
                  Kenaikan nominal yang sama memiliki dampak berbeda di setiap daerah, bergantung pada daya beli buruh dan tingkat UMK lokal.
                </p>
              </div>
            </div>

            <div className="challenge-art bg-[#fffdf7] p-3.5 rounded-lg border border-[#ded8c8] text-xs space-y-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#68685e]">Kota UMK Tinggi (Rp5,3 Jt):</span>
                  <strong className="font-mono text-[#4b9d73] font-bold">Beban Pangan: 4,1%</strong>
                </div>
                <div className="h-2 bg-[#e6e2d2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4b9d73] rounded-full w-[28%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#68685e]">Kab. UMK Rendah (Rp2,1 Jt):</span>
                  <strong className="font-mono text-[#e85b4f] font-bold">Beban Pangan: 11,4%</strong>
                </div>
                <div className="h-2 bg-[#e6e2d2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#e85b4f] rounded-full w-[78%]" />
                </div>
              </div>
            </div>
          </article>

          {/* Challenge 03 */}
          <article className="challenge bg-[#f8f4e9] border border-[#ded8c8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="challenge-head mb-6">
              <span className="challenge-number font-mono text-xs font-black text-[#67151d] px-2 py-0.5 rounded bg-[#f4e8e9] border border-[#dfc7b8] inline-block mb-3">
                03
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#1e221f] mb-1">Tidak Terwakili</h3>
                <p className="text-xs text-[#68685e] leading-relaxed">
                  Harga pasar induk pedagang besar sering kali berselisih jauh dengan harga riil yang dibayar warga di lapak pasar dan warung eceran.
                </p>
              </div>
            </div>

            <div className="challenge-art bg-[#fffdf7] p-3.5 rounded-lg border border-[#ded8c8] text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[#68685e]">Pasar Induk (Grosir):</span>
                <strong className="font-mono text-[#1e221f] text-sm font-bold">Rp 48.000/kg</strong>
              </div>
              <div className="h-[1px] bg-[#ded8c8]" />
              <div className="flex justify-between items-center">
                <span className="text-[#68685e]">Warung Rakyat (Eceran):</span>
                <strong className="font-mono text-[#e85b4f] text-sm font-bold">Rp 62.000/kg</strong>
              </div>
              <div className="p-2 rounded bg-[#f4e8e9] text-[#67151d] text-[11px] font-bold flex items-center gap-1.5 border border-[#dfc7b8]">
                <span>Disparitas Ritel: +29,2% dari harga grosir</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
