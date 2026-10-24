import React from 'react';
import { HeroSection } from '../../components/public/HeroSection';
import { ChallengeSection } from '../../components/public/ChallengeSection';
import { GisMapSection } from '../../components/public/GisMapSection';
import { InstrumentsSection } from '../../components/public/InstrumentsSection';
import { SynergySection } from '../../components/public/SynergySection';
import { CrowdsourceSection } from '../../components/public/CrowdsourceSection';
import { QuickModulesSection } from '../../components/public/QuickModulesSection';
import { TrustSection } from '../../components/public/TrustSection';
import { CtaSection } from '../../components/public/CtaSection';

export const metadata = {
  title: 'Radar Pangan — Sistem Data & Peringatan Dini Harga Pangan Nasional',
  description:
    'Sistem EWS stabilitas pasokan pangan, deteksi disparitas harga riil, dan orkestrasi rantai pasok Jawa Barat & Nasional.'
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Challenge Section */}
      <ChallengeSection />

      {/* 3. Disparity Map Showcase */}
      <GisMapSection />

      {/* 4. Core Instruments */}
      <InstrumentsSection />

      {/* 5. Supply Chain Synergy (Garut -> Bekasi & Inter-Agency) */}
      <SynergySection />

      {/* 6. Crowdsource & Multi-User Section */}
      <CrowdsourceSection />

      {/* 7. Quick Modules Cards */}
      <QuickModulesSection />

      {/* 8. Trust & Accountability Pillars */}
      <TrustSection />

      {/* 9. Final CTA Banner */}
      <CtaSection />
    </div>
  );
}
