import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard EWS — Radar Pangan Jawa Barat',
  description:
    'Sistem Peringatan Dini dan Dukungan Keputusan Stabilisasi Harga Pangan Pokok Tingkat Kabupaten/Kota Jawa Barat',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#24231F] font-sans antialiased">
      {children}
    </div>
  );
}
