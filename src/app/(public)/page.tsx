import React from 'react';
import { HeroSection } from '../../components/public/HeroSection';
import { ChallengeSection } from '../../components/public/ChallengeSection';
import { GisMapSection } from '../../components/public/GisMapSection';
import { InstrumentsSection } from '../../components/public/InstrumentsSection';
import { SynergySection } from '../../components/public/SynergySection';
import { CrowdsourceSection } from '../../components/public/CrowdsourceSection';
import { TrustSection } from '../../components/public/TrustSection';
import { CtaSection } from '../../components/public/CtaSection';

export const metadata = {
  title: 'Radar Pangan — Sistem Pemantauan & Peringatan Dini Harga Pangan Nasional',
  description:
    'Eksplorasi persebaran harga pangan pokok menurut wilayah, perbandingan terhadap acuan pemerintah (HAP/HET), analisis keterjangkauan, dan pelaporan harga pasar oleh warga.'
};

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* 1. Hero Section & Open Data Sources */}
      <HeroSection />

      {/* 2. Three Monitoring Gaps Section */}
      <ChallengeSection />

      {/* 3. National Food Price Map & Historical Chart Section */}
      <GisMapSection />

      {/* 4. Four Core Instruments Section */}
      <InstrumentsSection />

      {/* 5. Smart Distribution & National Food Policy Synergy Section */}
      <SynergySection />

      {/* 6. Dual-User Interface & Citizen Report Verification Section */}
      <CrowdsourceSection />

      {/* 7. Accountability & Traceability Pillars */}
      <TrustSection />

      {/* 8. Final Public CTA Banner */}
      <CtaSection />
    </div>
  );
}
