// frontend/app/dashboard/billing/page.tsx
'use client';

import { useNutritionistRelationships, subscribeToTier, openBillingPortal } from '@/lib/hiring';
import { useMyProfile } from '@/lib/profile';
import { useState } from 'react';

function statusLabel(status: string): { text: string; color: string } {
  switch (status) {
    case 'active': return { text: 'Active', color: '#4a7c59' };
    case 'pending_intro': return { text: 'Awaiting intro', color: '#b8860b' };
    case 'cancelled': return { text: 'Cancelled', color: '#b94a3a' };
    default: return { text: status, color: 'var(--nc-stone)' };
  }
}

export default function BillingPage() {
  const { relationships, isLoading } = useNutritionistRelationships();
  const { profile } = useMyProfile();
  const [subscribing, setSubscribing] = useState(false);
  const [portaling, setPortaling] = useState(false);

  async function handleSubscribe(tier: 'pro' | 'premium') {
    setSubscribing(true);
    try {
      const url = await subscribeToTier(tier);
      window.location.href = url;
    } catch {
      setSubscribing(false);
      alert('Failed to start subscription checkout. Please try again.');
    }
  }

  async function handleBillingPortal() {
    setPortaling(true);
    try {
      const url = await openBillingPortal();
      window.location.href = url;
    } catch {
      setPortaling(false);
      alert('Failed to open billing portal. Please try again.');
    }
  }

  const currentTier = profile?.tier ?? 'free';

  return (
    <div style={{ maxWidth: 720, padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--nc-font-serif)', fontSize: 24, color: 'var(--nc-ink)', marginBottom: 8, fontWeight: 400 }}>
        Billing & Plan
      </h1>
      <p style={{ color: 'var(--nc-stone)', fontSize: 14, marginBottom: 32, fontWeight: 300 }}>
        Manage your subscription tier and view client relationships.
      </p>

      {/* Current plan */}
      <div style={{ background: 'white', border: '1px solid rgba(139,115,85,0.15)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--nc-ink)', marginBottom: 8 }}>Current plan</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--nc-terra)', marginBottom: 12, textTransform: 'capitalize' }}>
          {currentTier}
        </div>
        {currentTier === 'free' ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSubscribe('pro')}
              className="nc-btn-contact"
              style={{ fontSize: 13 }}
              disabled={subscribing}
            >
              {subscribing ? 'Redirecting…' : 'Upgrade to Pro (€29/mo)'}
            </button>
            <button
              onClick={() => handleSubscribe('premium')}
              className="nc-btn-contact"
              style={{ fontSize: 13 }}
              disabled={subscribing}
            >
              {subscribing ? 'Redirecting…' : 'Upgrade to Premium (€59/mo)'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleBillingPortal}
            className="nc-btn-contact"
            style={{ fontSize: 13 }}
            disabled={portaling}
          >
            {portaling ? 'Redirecting…' : 'Manage subscription'}
          </button>
        )}
      </div>

      {/* Client list */}
      <h2 style={{ fontFamily: 'var(--nc-font-serif)', fontSize: 16, color: 'var(--nc-ink)', marginBottom: 16, fontWeight: 400 }}>
        All clients
      </h2>

      {isLoading ? (
        <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>Loading…</div>
      ) : relationships.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid rgba(139,115,85,0.12)', borderRadius: 8, padding: 24, color: 'var(--nc-stone)', fontWeight: 300, textAlign: 'center' }}>
          No clients yet. Share your profile to get started.
        </div>
      ) : (
        relationships.map((rel) => {
          const { text, color } = statusLabel(rel.status);
          return (
            <div key={rel.id} style={{
              background: 'white',
              border: '1px solid rgba(139,115,85,0.12)',
              borderRadius: 8,
              padding: '16px 20px',
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300 }}>
                Started {new Date(rel.created_at).toLocaleDateString('es-ES')}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color, padding: '2px 8px', borderRadius: 4, background: `${color}18` }}>
                {text}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
