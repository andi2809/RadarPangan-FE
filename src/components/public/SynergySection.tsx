'use client';

import React from 'react';

export const SynergySection: React.FC = () => {
  return (
    <div className="synergy-section py-14 bg-[#f0ebde] border-b border-[#ded8c8]" id="sinergi">
      <div className="container">
        <div className="synergy-grid grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Smart Distribution Corridor */}
          <div>
            <span className="section-label inline-block px-3 py-1 rounded-full bg-[#fffdf7] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
              Dari Surplus ke Defisit
            </span>
            <h2 className="section-heading text-2xl sm:text-3xl font-black text-[#1e221f] tracking-tight">
              Distribusi yang Lebih Cerdas
            </h2>
            <p className="section-desc text-sm text-[#68685e] mt-1.5 mb-6 leading-relaxed">
              Hubungkan sentra penghasil panen dengan daerah yang mengalami tekanan pasokan melalui rekomendasi rute logistik tercepat dan terukur.
            </p>

            <div className="supply-illustration bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-5 shadow-sm space-y-3.5">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center text-xs">
                {/* Surplus Region */}
                <div className="bg-[#e0f0e2] border border-[#badfc4] rounded-lg p-3.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#4b9d73] mb-1">
                    SURPLUS
                  </div>
                  <div className="font-extrabold text-sm text-[#1e221f] mb-0.5">Kab. Garut</div>
                  <div className="text-[#68685e] text-[11px]">Cabai Rawit: Rp 54.000</div>
                  <div className="text-[#4b9d73] font-bold text-[11px]">Stok: +12 ton</div>
                </div>

                {/* Route Arrow Indicator */}
                <div className="text-center px-1">
                  <svg width="50" height="20" viewBox="0 0 50 20" className="mx-auto block mb-1">
                    <path d="M0 10 H42" stroke="#67151d" strokeWidth="2" strokeDasharray="4 3" fill="none" />
                    <path d="M38 5 L46 10 L38 15" fill="none" stroke="#67151d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-[11px] font-bold text-[#67151d]">8 ton</div>
                  <div className="text-[9px] text-[#68685e] font-mono">~185 km</div>
                </div>

                {/* Deficit Region */}
                <div className="bg-[#f8ded8] border border-[#f0bfb7] rounded-lg p-3.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#a83c32] mb-1">
                    DEFISIT
                  </div>
                  <div className="font-extrabold text-sm text-[#1e221f] mb-0.5">Kota Bekasi</div>
                  <div className="text-[#68685e] text-[11px]">Cabai Rawit: Rp 78.200</div>
                  <div className="text-[#a83c32] font-bold text-[11px]">Kebutuhan: +8 ton</div>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-3 rounded-lg bg-[#f0ebde] border border-[#ded8c8] text-xs text-[#68685e]">
                <strong className="text-[#1e221f] mr-1">Rekomendasi Kebijakan:</strong>
                Fasilitasi subsidi ongkos angkut 8 ton cabai rawit dari sentra panen Kab. Garut ke pasar induk Kota Bekasi untuk menekan disparitas harga sebesar 29,2%.
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Agency Synergy */}
          <div>
            <span className="section-label inline-block px-3 py-1 rounded-full bg-[#fffdf7] text-[#67151d] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#ded8c8]">
              Kolaborasi Lintas Instansi
            </span>
            <h2 className="section-heading text-2xl sm:text-3xl font-black text-[#1e221f] tracking-tight">
              Sinergi Kebijakan Pangan Nasional
            </h2>
            <p className="section-desc text-sm text-[#68685e] mt-1.5 mb-6 leading-relaxed">
              Satu ekosistem integrasi data harga, koordinasi intervensi pasar, dan transparansi distribusi antarlembaga.
            </p>

            <div className="partner-grid space-y-3">
              {/* Partner 1: MBG */}
              <article className="partner bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="partner-icon w-10 h-10 rounded-lg bg-[#f4e8e9] text-[#67151d] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1e221f] text-sm mb-0.5">Badan Gizi Nasional (MBG)</h4>
                  <p className="text-xs text-[#68685e] leading-relaxed">
                    Perencanaan pasokan bahan baku makanan bergizi gratis SPPG langsung dari sentra surplus lokal tanpa mengerek inflasi pasar rakyat.
                  </p>
                </div>
              </article>

              {/* Partner 2: TPID & BI */}
              <article className="partner bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="partner-icon w-10 h-10 rounded-lg bg-[#fef3c7] text-[#92400e] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1e221f] text-sm mb-0.5">TPID &amp; GNPIP Bank Indonesia</h4>
                  <p className="text-xs text-[#68685e] leading-relaxed">
                    Sinergi pemantauan harga mingguan, eksekusi Gerakan Pangan Murah (GPM), dan pengendalian ekspektasi inflasi daerah.
                  </p>
                </div>
              </article>

              {/* Partner 3: BPS & Kemenkeu */}
              <article className="partner bg-[#fffdf7] border border-[#ded8c8] rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="partner-icon w-10 h-10 rounded-lg bg-[#e0f0e2] text-[#4b9d73] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1e221f] text-sm mb-0.5">BPS, Bapanas &amp; Kemendagri</h4>
                  <p className="text-xs text-[#68685e] leading-relaxed">
                    Validasi statistik resmi, monitoring daya beli UMK, dan penilaian kinerja penanganan inflasi kepala daerah.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
