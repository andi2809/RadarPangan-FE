'use client';

import React, { useState } from 'react';
import { evaluateCrowdsourceConsensus } from '../../lib/engines/consensus';
import { ShieldCheck, AlertOctagon, PlusCircle, UserCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface CrowdsourceAuditPanelProps {
  initialClusters: any[];
  onClose: () => void;
}

export const CrowdsourceAuditPanel: React.FC<CrowdsourceAuditPanelProps> = ({
  initialClusters,
  onClose
}) => {
  const [clusters, setClusters] = useState(initialClusters);
  const [activeClusterIdx, setActiveClusterIdx] = useState(0);

  const selectedCluster = clusters[activeClusterIdx];
  const consensusResult = selectedCluster
    ? evaluateCrowdsourceConsensus(
        selectedCluster.laporan,
        selectedCluster.officialHap,
        selectedCluster.clusterId
      )
    : null;

  // Handler: Add valid citizen report
  const handleAddValidReport = () => {
    if (!selectedCluster) return;
    const newReport = {
      id: `cr-new-${Date.now()}`,
      hargaRp: selectedCluster.consensusMedianHarga + Math.round((Math.random() - 0.5) * 800),
      isOutlier: false,
      reporterId: `dev-user-${Math.floor(Math.random() * 900 + 100)}`,
      timestamp: new Date().toISOString()
    };
    const updated = [...clusters];
    updated[activeClusterIdx].laporan = [newReport, ...updated[activeClusterIdx].laporan];
    setClusters(updated);
  };

  // Handler: Inject rogue speculator report (+50% abnormal)
  const handleInjectSpeculator = () => {
    if (!selectedCluster) return;
    const rogueReport = {
      id: `cr-spec-${Date.now()}`,
      hargaRp: Math.round(selectedCluster.consensusMedianHarga * 1.52),
      isOutlier: true,
      reason: 'MAD Z-Score > 3.0 (Percobaan Manipulasi Harga)',
      reporterId: `bot-speculator-x`,
      timestamp: new Date().toISOString()
    };
    const updated = [...clusters];
    updated[activeClusterIdx].laporan = [rogueReport, ...updated[activeClusterIdx].laporan];
    setClusters(updated);
  };

  return (
    <div className="fixed top-20 left-4 bottom-6 z-40 w-[440px] max-w-[calc(100vw-32px)] bg-slate-900/95 border border-sky-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md overflow-y-auto select-none text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-600/40 text-sky-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              KONSENSUS ANTI-SPEKULAN
            </h2>
            <p className="text-[11px] text-sky-400 font-mono">
              Audit Crowdsource Warga & Isolasi Outlier MAD
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs"
        >
          &times;
        </button>
      </div>

      {/* Cluster Selector Pills */}
      <div className="flex gap-2 mb-3">
        {clusters.map((c, i) => (
          <button
            key={c.clusterId}
            onClick={() => setActiveClusterIdx(i)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono transition-colors text-center border ${
              activeClusterIdx === i
                ? 'bg-sky-700 text-white border-sky-500 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {c.namaPasar}
          </button>
        ))}
      </div>

      {/* Cluster Overview Card */}
      {selectedCluster && consensusResult && (
        <>
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {selectedCluster.namaPasar} ({selectedCluster.regionName})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                Radius {selectedCluster.radiusKm} km
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Median Terverifikasi</div>
                <div className="text-base font-bold font-mono text-white tabular-nums">
                  Rp {consensusResult.medianHargaRp.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-mono">Status Konsensus</div>
                <div className="text-xs font-bold font-mono text-emerald-400 flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kuorum Sah ({consensusResult.validReportsCount} lap.)</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {consensusResult.keterangan}
            </p>
          </div>

          {/* Interactive Simulation Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={handleAddValidReport}
              className="py-2 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Laporan Warga Sah</span>
            </button>
            <button
              onClick={handleInjectSpeculator}
              className="py-2 px-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>+ Suntik Spekulan</span>
            </button>
          </div>

          {/* Submissions Feed */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Daftar Laporan Terkini ({selectedCluster.laporan.length} Entri)
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {selectedCluster.laporan.map((lap: any) => (
                <div
                  key={lap.id}
                  className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between border ${
                    lap.isOutlier
                      ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold tabular-nums">
                        Rp {lap.hargaRp.toLocaleString('id-ID')}
                      </span>
                      {lap.isOutlier && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-900 text-rose-200 border border-rose-700 font-bold uppercase">
                          Spekulan Terdeteksi
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ID: {lap.reporterId} &bull; {lap.timestamp.slice(11, 16)} WIB
                    </div>
                  </div>
                  <div>
                    {lap.isOutlier ? (
                      <span className="text-rose-400 text-[10px] font-bold">Ditolak MAD</span>
                    ) : (
                      <span className="text-emerald-400 text-[10px] font-bold">&check; Valid</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
