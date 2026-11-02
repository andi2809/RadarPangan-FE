import { redirect } from 'next/navigation';

export default function LaporanRedirectPage() {
  redirect('/dashboard?report=1');
}
