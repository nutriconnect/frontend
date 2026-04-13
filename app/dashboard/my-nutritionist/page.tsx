// frontend/app/dashboard/my-nutritionist/page.tsx
'use client';

import { useState } from 'react';
import { useMyRelationships, cancelRelationship } from '@/lib/hiring';

function statusLabel(status: string): { text: string; color: string } {
  switch (status) {
    case 'active': return { text: 'Active', color: '#4a7c59' };
    case 'pending_intro': return { text: 'Awaiting intro consultation', color: '#b8860b' };
    case 'cancelled': return { text: 'Cancelled', color: '#b94a3a' };
    default: return { text: status, color: 'var(--nc-stone)' };
  }
}

export default function MyNutritionistPage() {
  const { relationships, isLoading } = useMyRelationships();
  const [cancelling, setCancelling] = useState<string | null>(null);

  const active = relationships.filter(
    (r) => r.status === 'active' || r.status === 'pending_intro',
  );
  const past = relationships.filter(
    (r) => r.status === 'cancelled',
  );

  async function handleCancel(id: string) {
    if (!confirm('Cancel your programme? This cannot be undone.')) return;
    setCancelling(id);
    try {
      await cancelRelationship(id);
    } catch {
      alert('Could not cancel programme. Please try again.');
    } finally {
      setCancelling(null);
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '32px 24px', color: 'var(--nc-stone)', fontWeight: 300 }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--nc-font-serif)', fontSize: 24, color: 'var(--nc-ink)', marginBottom: 8, fontWeight: 400 }}>
        My Nutritionist
      </h1>
      <p style={{ color: 'var(--nc-stone)', fontSize: 14, marginBottom: 32, fontWeight: 300 }}>
        Manage your active programme.
      </p>

      {active.length === 0 && past.length === 0 && (
        <div style={{ background: 'white', border: '1px solid rgba(139,115,85,0.15)', borderRadius: 8, padding: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>You have no active programmes.</p>
          <a href="/nutritionists" className="nc-btn-contact" style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', fontSize: 13 }}>
            Browse nutritionists
          </a>
        </div>
      )}

      {active.map((rel) => {
        const { text, color } = statusLabel(rel.status);
        const canCancel = rel.status === 'active';

        return (
          <div key={rel.id} style={{ background: 'white', border: '1px solid rgba(139,115,85,0.15)', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--nc-ink)', marginBottom: 4 }}>
                  Active programme
                </div>
                <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300 }}>
                  Started {new Date(rel.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color, padding: '2px 8px', borderRadius: 4, background: `${color}15` }}>
                {text}
              </span>
            </div>

            {canCancel && (
              <button
                onClick={() => handleCancel(rel.id)}
                disabled={cancelling === rel.id}
                style={{ fontSize: 12, padding: '6px 14px', border: '1px solid rgba(185,74,58,0.4)', borderRadius: 5, background: 'transparent', color: '#b94a3a', cursor: 'pointer' }}
              >
                {cancelling === rel.id ? 'Cancelling…' : 'Cancel programme'}
              </button>
            )}
          </div>
        );
      })}

      {past.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--nc-font-serif)', fontSize: 16, color: 'var(--nc-ink)', marginTop: 32, marginBottom: 16, fontWeight: 400 }}>
            Past programmes
          </h2>
          {past.map((rel) => {
            const { text, color } = statusLabel(rel.status);
            return (
              <div key={rel.id} style={{ background: 'white', border: '1px solid rgba(139,115,85,0.1)', borderRadius: 8, padding: '16px 24px', marginBottom: 12, opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--nc-ink)' }}>
                    Programme — ended {new Date(rel.updated_at).toLocaleDateString('es-ES')}
                  </div>
                  <span style={{ fontSize: 11, color }}>{text}</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
