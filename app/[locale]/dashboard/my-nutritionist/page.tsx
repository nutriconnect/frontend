// frontend/app/dashboard/my-nutritionist/page.tsx
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useMyRelationships, cancelRelationship } from '@/lib/hiring';
import Link from 'next/link';
import { toastError } from '@/lib/toast';

export default function MyNutritionistPage() {
  const locale = useLocale();
  const t = useTranslations('dashboard.my_nutritionist');
  const { relationships, isLoading } = useMyRelationships();
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Format time since connection with i18n
  const formatTimeSince = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days === 0) return t('time_today');
    if (days < 30) return t('time_days', { days });
    const months = Math.floor(days / 30);
    return t('time_months', { months });
  };

  const active = relationships.filter(
    (r) => r.status === 'active' || r.status === 'pending_intro',
  );
  const past = relationships.filter(
    (r) => r.status === 'cancelled',
  );

  async function handleCancel(id: string) {
    if (!confirm(t('confirm_cancel'))) return;
    setCancelling(id);
    try {
      await cancelRelationship(id);
    } catch {
      toastError(t('cancel_error'));
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
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--nc-ink)', marginBottom: 8, fontWeight: 400 }}>
        {t('title')}
      </h1>
      <p style={{ color: 'var(--nc-stone)', fontSize: 14, marginBottom: 32, fontWeight: 300 }}>
        {t('subtitle')}
      </p>

      {active.length === 0 && past.length === 0 && (
        <div style={{
          background: 'white',
          border: '1px solid var(--nc-border)',
          borderRadius: 12,
          padding: '48px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 48,
            marginBottom: 16
          }}>🥗</div>
          <p style={{
            color: 'var(--nc-ink)',
            fontWeight: 500,
            fontSize: 16,
            marginBottom: 8
          }}>{t('no_programmes')}</p>
          <p style={{
            color: 'var(--nc-stone)',
            fontWeight: 300,
            fontSize: 14,
            marginBottom: 24
          }}>
            Explora nuestro directorio y encuentra al nutricionista perfecto para ti.
          </p>
          <Link
            href={`/${locale}/nutritionists`}
            className="nc-btn-contact"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--nc-forest)',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            {t('browse_nutritionists')}
          </Link>
        </div>
      )}

      {active.map((rel) => (
        <div key={rel.id} style={{
          background: 'white',
          border: '1px solid var(--nc-border)',
          borderRadius: 12,
          padding: '24px',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12
          }}>
            <div>
              <div style={{
                fontWeight: 600,
                fontSize: 18,
                color: 'var(--nc-ink)',
                marginBottom: 4
              }}>
                {rel.nutritionist_display_name}
              </div>
              {rel.status === 'pending_intro' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#b48c3c',
                  background: 'rgba(180,140,60,0.1)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  marginTop: 4
                }}>
                  <span>⏳</span> {t('pending')}
                </div>
              )}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 100,
              background: rel.nutritionist_tier === 'free' ? 'rgba(139,115,85,0.12)' : 'rgba(74,124,89,0.12)',
              color: rel.nutritionist_tier === 'free' ? 'var(--nc-stone)' : 'var(--nc-forest)'
            }}>
              {rel.nutritionist_tier}
            </span>
          </div>
          <div style={{
            fontSize: 13,
            color: 'var(--nc-stone)',
            marginBottom: 12,
            fontWeight: 300
          }}>
            📍 {rel.nutritionist_city} · {t('connected')} {formatTimeSince(rel.created_at)}
          </div>
          {rel.nutritionist_bio && (
            <p style={{
              fontSize: 14,
              color: 'var(--nc-stone)',
              fontWeight: 300,
              lineHeight: 1.6,
              marginBottom: 12,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {rel.nutritionist_bio}
            </p>
          )}
          {rel.nutritionist_specialties && rel.nutritionist_specialties.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 16
            }}>
              {rel.nutritionist_specialties.slice(0, 3).map(s => (
                <span key={s} style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'rgba(74,124,89,0.08)',
                  color: 'var(--nc-forest)',
                  fontWeight: 500
                }}>{s}</span>
              ))}
            </div>
          )}
          <div style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            paddingTop: 16,
            borderTop: '1px solid var(--nc-border)'
          }}>
            {rel.status === 'active' && (
              <Link
                href={`/${locale}/dashboard/appointments/book?relationship_id=${rel.id}&nutritionist_id=${rel.nutritionist_id}`}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: '8px 16px',
                  background: 'var(--nc-forest)',
                  color: 'white',
                  borderRadius: 6,
                  transition: 'all 0.2s'
                }}
              >
                {t('book_appointment')}
              </Link>
            )}
            <Link
              href={`/${locale}/nutritionists/${rel.nutritionist_slug}`}
              target="_blank"
              style={{
                fontSize: 13,
                color: 'var(--nc-terra)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              {t('view_profile')} ↗
            </Link>
            {rel.status !== 'cancelled' && (
              <button
                onClick={() => handleCancel(rel.id)}
                disabled={cancelling === rel.id}
                style={{
                  fontSize: 13,
                  color: '#b94a3a',
                  background: 'transparent',
                  border: 'none',
                  cursor: cancelling === rel.id ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 400,
                  marginLeft: 'auto'
                }}
              >
                {cancelling === rel.id ? `${t('cancel')}...` : t('cancel')}
              </button>
            )}
          </div>
        </div>
      ))}

      {past.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--nc-ink)', marginTop: 32, marginBottom: 16, fontWeight: 400 }}>
            Past programmes
          </h2>
          {past.map((rel) => (
            <div key={rel.id} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 20, marginBottom: 16, background: 'var(--nc-cream)', opacity: 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--nc-ink)' }}>
                  {rel.nutritionist_display_name}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 100,
                  background: 'rgba(185,74,58,0.1)', color: '#b94a3a' }}>
                  Cancelado
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--nc-stone)' }}>
                {rel.nutritionist_city} · Finalizado {new Date(rel.updated_at).toLocaleDateString('es-ES')}
              </div>
              <div style={{ marginTop: 8 }}>
                <a href={`/nutritionists/${rel.nutritionist_slug}`} target="_blank"
                   style={{ fontSize: 12, color: 'var(--nc-terra)', textDecoration: 'none' }}>
                  {t('view_profile')} ↗
                </a>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
