import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Radar Pangan Jabar — GIS Early Warning & Decision Support System',
  description:
    'Sistem Peringatan Dini dan Dukungan Keputusan Stabilisasi Harga Pangan Pokok Tingkat Kabupaten/Kota Jawa Barat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
