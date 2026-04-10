// frontend/app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useMyClientProfile } from '@/lib/client-profile';

function ClientOverview() {
  const { profile, isLoading } = useMyClientProfile();

  if (isLoading) return null;

  if (!profile || !profile.display_name?.trim()) {
    return (
      <div style={{
        background: 'var(--nc-forest-pale)',
        border: '1px solid rgba(26,51,41,0.12)',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <span style={{ color: 'var(--nc-forest)', fontSize: 14 }}>
          Complete your profile so your nutritionist can get to know you.
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
          Complete profile →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
      <div style={{
        background: 'white',
        border: '1px solid var(--nc-border)',
        borderRadius: 10,
        padding: '20px 24px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--nc-stone)', textTransform: 'uppercase', marginBottom: 8 }}>
          Your profile
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--nc-ink)', marginBottom: 4 }}>
          {profile.display_name}
        </div>
        {profile.city && (
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300 }}>📍 {profile.city}</div>
        )}
        <Link
          href="/dashboard/client-profile"
          style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--nc-terra)', fontWeight: 500, textDecoration: 'none' }}
        >
          Edit profile →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Link href="/dashboard/client-profile#weight" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            border: '1px solid var(--nc-border)',
            borderRadius: 10,
            padding: '18px 22px',
            cursor: 'pointer',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>⚖️</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--nc-ink)' }}>Weight log</div>
            <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300, marginTop: 2 }}>Track your progress</div>
          </div>
        </Link>
        <Link href="/dashboard/client-profile#activity" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            border: '1px solid var(--nc-border)',
            borderRadius: 10,
            padding: '18px 22px',
            cursor: 'pointer',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>🏃</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--nc-ink)' }}>Activity log</div>
            <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300, marginTop: 2 }}>Log your workouts</div>
          </div>
        </Link>
      </div>
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
        {user?.role === 'client' && <ClientOverview />}
        {user?.role === 'nutritionist' && (
          <p style={{ color: 'var(--nc-stone)', fontSize: 14, fontWeight: 300 }}>
            Welcome back, {user.email.split('@')[0]}. Head to{' '}
            <Link href="/dashboard/profile" style={{ color: 'var(--nc-terra)', textDecoration: 'none', fontWeight: 500 }}>
              My profile
            </Link>{' '}
            to manage your listings.
          </p>
        )}
      </div>
    </>
  );
}
