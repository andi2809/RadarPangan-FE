import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Radar Pangan — Sistem Pemantauan Harga Pangan & Kewaspadaan Pasokan',
  description:
    'Platform informasi harga pangan pokok, perbandingan harga acuan pemerintah (HAP/HET), pemetaan spasial wilayah, dan pelaporan harga pasar terbuka.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="/maplibre-gl.css" />
      </head>
      <body className="bg-[#f8f4e9] text-[#1e221f] antialiased">{children}</body>
    </html>
  );
}
