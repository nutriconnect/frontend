// frontend/app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useMyClientProfile } from '@/lib/client-profile';

// Mounted only for clients — safe to call the hook unconditionally here.
function ClientNudge() {
  const { profile, isLoading, error } = useMyClientProfile();
  if (isLoading || error || (profile && profile.display_name?.trim())) return null;
  return (
    <div style={{
      background: 'var(--nc-cream)',
      border: '1px solid rgba(139,115,85,0.2)',
      borderRadius: 8,
      padding: '16px 20px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <span style={{ color: 'var(--nc-stone)', fontSize: 14 }}>
        Completa tu perfil para que tu nutricionista te conozca mejor
      </span>
      <Link
        href="/dashboard/client-profile"
        style={{
          color: 'var(--nc-terra)',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Completar perfil →
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Overview</div>
      </div>
      <div className="dash-content">
        {user?.role === 'client' && <ClientNudge />}
        <p style={{ color: 'var(--nc-stone)', fontSize: 14, fontWeight: 300 }}>
          Welcome back{user ? `, ${user.email.split('@')[0]}` : ''}.
        </p>
      </div>
    </>
  );
}
