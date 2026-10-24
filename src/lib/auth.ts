export interface SsoUser {
  id: string;
  name: string;
  nip: string;
  agency: string;
  role: 'tpid' | 'satgas' | 'bapanas';
  provider: 'jds' | 'asn_jabar' | 'bapanas' | 'satgas_polri';
  email: string;
  avatarUrl?: string;
  token: string;
  issuedAt: number;
}

export interface SsoProvider {
  id: 'jds' | 'asn_jabar' | 'bapanas' | 'satgas_polri';
  name: string;
  shortName: string;
  authority: string;
  description: string;
  badge: string;
  iconBg: string;
  defaultUser: Omit<SsoUser, 'token' | 'issuedAt'>;
}

export const SSO_PROVIDERS: SsoProvider[] = [
  {
    id: 'jds',
    name: 'Jawa Barat Digital Service (JDS)',
    shortName: 'JDS SSO',
    authority: 'Pemerintah Daerah Provinsi Jawa Barat',
    description: 'Satu akun terintegrasi untuk pimpinan daerah, sekretariat TPID, dan analis Satu Data Jabar.',
    badge: 'Resmi Pemprov Jabar',
    iconBg: '#16a34a',
    defaultUser: {
      id: 'usr-jds-001',
      name: 'Dr. Ir. Mohamad Arifin, M.Si',
      nip: '19750814 199903 1 002',
      agency: 'Sekretariat TPID & DKPP Jawa Barat',
      role: 'tpid',
      provider: 'jds',
      email: 'sekretariat.tpid@jabarprov.go.id'
    }
  },
  {
    id: 'asn_jabar',
    name: 'SIAP Jabar (SSO ASN Pemprov)',
    shortName: 'ASN Jabar SSO',
    authority: 'Badan Kepegawaian Daerah Jawa Barat',
    description: 'Autentikasi terverifikasi ASN Pemprov Jabar untuk pengawas harga dan enumerator pasar.',
    badge: 'BKD Jabar',
    iconBg: '#0284c7',
    defaultUser: {
      id: 'usr-asn-002',
      name: 'Siti Nurhaliza, S.STP, M.AP',
      nip: '19820412 200501 2 004',
      agency: 'Dinas Perindustrian dan Perdagangan Jabar',
      role: 'tpid',
      provider: 'asn_jabar',
      email: 'siti.nurhaliza@disperindag.jabarprov.go.id'
    }
  },
  {
    id: 'bapanas',
    name: 'Badan Pangan Nasional (Bapanas)',
    shortName: 'Bapanas SSO',
    authority: 'Republik Indonesia',
    description: 'Akses OIDC terpusat analis stabilisasi pasokan dan cadangan pangan pemerintah.',
    badge: 'Nasional',
    iconBg: '#b45309',
    defaultUser: {
      id: 'usr-bap-003',
      name: 'Ahmad Fauzi, S.P., M.Sc.',
      nip: '19790218 200212 1 001',
      agency: 'Deputi Ketersediaan & Stabilisasi Pangan Bapanas',
      role: 'bapanas',
      provider: 'bapanas',
      email: 'ahmad.fauzi@bapanas.go.id'
    }
  },
  {
    id: 'satgas_polri',
    name: 'Satgas Pangan POLDA Jabar',
    shortName: 'Satgas Pangan SSO',
    authority: 'Kepolisian Daerah Jawa Barat',
    description: 'Portal penegakan kepatuhan HET/HAP dan investigasi dugaan penimbunan spekulan.',
    badge: 'Ditreskrimsus',
    iconBg: '#dc2626',
    defaultUser: {
      id: 'usr-pol-004',
      name: 'Kompol Hendra Kusuma, S.I.K., M.Si.',
      nip: 'NRP 82061142',
      agency: 'Subdit Indag Ditreskrimsus Polda Jawa Barat',
      role: 'satgas',
      provider: 'satgas_polri',
      email: 'satgas.pangan@polda.jabar.polri.go.id'
    }
  }
];

export function createSsoSession(providerId: SsoProvider['id']): SsoUser {
  const provider = SSO_PROVIDERS.find((p) => p.id === providerId) || SSO_PROVIDERS[0];
  const now = Date.now();
  const token = `sso_${provider.id}_${now}_${Math.random().toString(36).substring(2, 9)}`;

  const user: SsoUser = {
    ...provider.defaultUser,
    token,
    issuedAt: now
  };

  if (typeof document !== 'undefined') {
    // Write cookie matching middleware
    document.cookie = `tpid_session=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
    localStorage.setItem('tpid_sso_session', JSON.stringify(user));
  }

  return user;
}

export function getCurrentSession(): SsoUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('tpid_sso_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof document !== 'undefined') {
    document.cookie = 'tpid_session=; path=/; max-age=0; SameSite=Lax';
    localStorage.removeItem('tpid_sso_session');
  }
}
