'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SSO_PROVIDERS, createSsoSession, SsoProvider } from '../../../lib/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('from') || '/dashboard';

  const [authMode, setAuthMode] = useState<'sso' | 'credential'>('sso');
  const [selectedSso, setSelectedSso] = useState<SsoProvider | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);

  // Credential form state
  const [role, setRole] = useState<'tpid' | 'satgas' | 'bapanas'>('tpid');
  const [username, setUsername] = useState('tpid.jabar@jabarprov.go.id');
  const [password, setPassword] = useState('••••••••');
  const [isCredentialSubmitting, setIsCredentialSubmitting] = useState(false);

  // Handle SSO click
  const handleTriggerSso = (provider: SsoProvider) => {
    setSelectedSso(provider);
    setIsAuthorizing(true);
    setAuthProgress(20);

    const timer1 = setTimeout(() => setAuthProgress(60), 300);
    const timer2 = setTimeout(() => {
      setAuthProgress(100);
      createSsoSession(provider.id);
      router.push(redirectTarget);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  // Handle manual credential submit
  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCredentialSubmitting(true);

    setTimeout(() => {
      const mockUser = {
        id: 'usr-cred-999',
        name: role === 'satgas' ? 'Kompol Hendra Kusuma' : role === 'bapanas' ? 'Ahmad Fauzi, M.Sc.' : 'Dr. Ir. Mohamad Arifin',
        nip: '19750814 199903 1 002',
        agency: role === 'satgas' ? 'Polda Jabar' : role === 'bapanas' ? 'Badan Pangan Nasional' : 'TPID Jabar',
        role,
        provider: 'jds' as const,
        email: username,
        token: `mock_cred_${Date.now()}`,
        issuedAt: Date.now()
      };

      document.cookie = `tpid_session=${encodeURIComponent(JSON.stringify(mockUser))}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('tpid_sso_session', JSON.stringify(mockUser));
      router.push(redirectTarget);
    }, 600);
  };

  return (
    <div className="login-page py-12 px-4 sm:px-6 bg-[#f8f4e9] min-h-[80vh] flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#fffdf7] border border-[#ded8c8] rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#67151d] text-white flex items-center justify-center font-black text-sm">
              RP
            </div>
            <span className="font-black text-lg text-[#1e221f] tracking-tight">RADAR PANGAN</span>
          </Link>
          <h1 className="text-2xl font-black text-[#1e221f] tracking-tight">
            Portal Masuk Stakeholder &amp; Pimpinan
          </h1>
          <p className="text-xs text-[#68685e]">
            Akses sistem terproteksi Early Warning System (EWS) untuk TPID, Satgas Pangan, dan Bapanas.
          </p>
        </div>

        {/* Tab Switcher: SSO vs Kredensial */}
        <div className="flex rounded-xl bg-[#f0ebde] p-1 border border-[#ded8c8] text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('sso')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'sso'
                ? 'bg-[#67151d] text-white shadow-sm font-extrabold'
                : 'text-[#68685e] hover:text-[#1e221f]'
            }`}
          >
            <span>Single Sign-On (SSO)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white uppercase">Resmi</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('credential')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'credential'
                ? 'bg-[#67151d] text-white shadow-sm font-extrabold'
                : 'text-[#68685e] hover:text-[#1e221f]'
            }`}
          >
            <span>Kredensial Manual</span>
          </button>
        </div>

        {/* Tab 1: Single Sign-On (SSO) Providers */}
        {authMode === 'sso' && (
          <div className="space-y-4">
            <div className="text-xs text-[#68685e] text-center pb-1">
              Silakan pilih gerbang SSO sesuai instansi resmi Anda:
            </div>

            <div className="space-y-3">
              {SSO_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  disabled={isAuthorizing}
                  onClick={() => handleTriggerSso(provider)}
                  className="w-full text-left p-4 rounded-xl border border-[#ded8c8] bg-[#f8f4e9] hover:bg-[#f0ebde] hover:border-[#67151d] transition-all flex items-start gap-3.5 group shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: provider.iconBg }}
                  >
                    {provider.shortName.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <strong className="text-sm font-bold text-[#1e221f] group-hover:text-[#67151d] transition-colors truncate">
                        {provider.name}
                      </strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#fffdf7] border border-[#ded8c8] text-[#67151d] font-bold shrink-0 ml-2">
                        {provider.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68685e] leading-snug line-clamp-2">
                      {provider.description}
                    </p>
                    <div className="text-[10px] font-mono text-[#8a6212] font-semibold mt-1.5 flex items-center gap-1">
                      <span>Login otomatis: {provider.defaultUser.name}</span>
                      <span>&rarr;</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Authorizing Modal Overlay */}
            {isAuthorizing && selectedSso && (
              <div className="p-4 rounded-xl bg-[#e0f0e2] border border-[#badfc4] text-center space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#1e6534]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-ping" />
                  <span>Mengautentikasi via {selectedSso.name}...</span>
                </div>
                <div className="w-full bg-[# badfc4] h-1.5 rounded-full overflow-hidden bg-[#badfc4]">
                  <div
                    className="bg-[#16a34a] h-full transition-all duration-300"
                    style={{ width: `${authProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#68685e]">
                  Mengarahkan ke Dashboard Konsol EWS...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manual Credentials */}
        {authMode === 'credential' && (
          <form onSubmit={handleCredentialSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-[#1e221f] mb-1.5 font-bold">Instansi / Peran</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs font-bold text-[#1e221f] focus:outline-none"
              >
                <option value="tpid">Sekretariat TPID Jawa Barat</option>
                <option value="satgas">Satgas Pangan POLDA Jawa Barat</option>
                <option value="bapanas">Badan Pangan Nasional (Bapanas)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1e221f] mb-1.5 font-bold">Email Kedinasan / NIP</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs font-bold text-[#1e221f] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#1e221f] mb-1.5 font-bold">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f4e9] border border-[#ded8c8] text-xs font-mono font-bold text-[#1e221f] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isCredentialSubmitting}
              className="btn btn-primary w-full py-3 rounded-lg bg-[#67151d] hover:bg-[#4c0d15] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCredentialSubmitting ? 'Memverifikasi Kredensial...' : 'Masuk ke Konsol EWS →'}
            </button>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="pt-4 border-t border-[#ded8c8] text-center text-[10px] text-[#68685e] space-y-1">
          <p>
            Portal Terproteksi &bull; Enkripsi TLS 1.3 &bull; Khusus Pejabat &amp; Aparatur Berwenang
          </p>
          <Link href="/" className="text-[#67151d] font-bold hover:underline">
            &larr; Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-[#68685e]">Memuat Portal SSO...</div>}>
      <LoginContent />
    </Suspense>
  );
}
