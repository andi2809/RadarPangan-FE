import React from 'react';
import './landing.css';
import { LandingHeader } from '../../components/public/LandingHeader';
import { LandingFooter } from '../../components/public/LandingFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-shell min-h-screen flex flex-col bg-[#f8f4e9] text-[#1e221f] font-sans antialiased selection:bg-[#67151d] selection:text-white">
      <LandingHeader />
      <main className="flex-1 w-full">{children}</main>
      <LandingFooter />
    </div>
  );
}
