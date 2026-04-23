// frontend/app/[locale]/dashboard/components/ClientActivityCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import type { ClientActivity, ClientCheckin, ClientJoined } from '@/lib/types';

interface ClientActivityCardProps {
  recentlyActive: ClientActivity[];
  dueForCheckin: ClientCheckin[];
  recentlyJoined: ClientJoined[];
  isLoading: boolean;
}

export function ClientActivityCard({
  recentlyActive,
  dueForCheckin,
  recentlyJoined,
  isLoading,
}: ClientActivityCardProps) {
  const t = useTranslations('dashboard.home');
  const locale = useLocale();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div style={{
        background: 'white',
        border: '1px solid var(--nc-border)',
        borderRadius: 10,
        padding: '20px 24px',
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--nc-ink)', marginBottom: 16 }}>
          {t('client_activity')}
        </div>
        <div style={{ color: 'var(--nc-stone)', fontSize: 13, fontWeight: 300 }}>
          {t('loading')}
        </div>
      </div>
    );
  }

  // Handle undefined/null data
  const safeRecentlyActive = recentlyActive || [];
  const safeDueForCheckin = dueForCheckin || [];
  const safeRecentlyJoined = recentlyJoined || [];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--nc-border)',
      borderRadius: 10,
      padding: '20px 24px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--nc-ink)' }}>
          {t('client_activity')}
        </div>
        <Link
          href={`/${locale}/dashboard/clients`}
          style={{
            fontSize: 12,
            color: 'var(--nc-terra)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          {t('view_all_clients')}
        </Link>
      </div>

      {/* Metric boxes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 20,
      }}>
        {/* Recently Active */}
        <div
          onClick={() => safeRecentlyActive.length > 0 && toggleSection('active')}
          style={{
            padding: '16px',
            border: '1px solid var(--nc-border)',
            borderRadius: 8,
            cursor: safeRecentlyActive.length > 0 ? 'pointer' : 'default',
            background: expandedSection === 'active' ? 'var(--nc-cream)' : 'white',
          }}
        >
          <div style={{
            fontSize: 24,
            fontWeight: 600,
            color: 'var(--nc-forest)',
            marginBottom: 4,
          }}>
            {safeRecentlyActive.length}
          </div>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--nc-stone)',
            marginBottom: 2,
          }}>
            {t('recently_active')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--nc-stone)', fontWeight: 300 }}>
            {t('clients_active_week')}
          </div>
        </div>

        {/* Due for Check-in */}
        <div
          onClick={() => safeDueForCheckin.length > 0 && toggleSection('checkin')}
          style={{
            padding: '16px',
            border: `1px solid ${safeDueForCheckin.length > 0 ? 'rgba(196,98,45,0.3)' : 'var(--nc-border)'}`,
            borderRadius: 8,
            cursor: safeDueForCheckin.length > 0 ? 'pointer' : 'default',
            background: expandedSection === 'checkin'
              ? 'rgba(196,98,45,0.05)'
              : safeDueForCheckin.length > 0
                ? 'rgba(196,98,45,0.02)'
                : 'white',
          }}
        >
          <div style={{
            fontSize: 24,
            fontWeight: 600,
            color: safeDueForCheckin.length > 0 ? 'var(--nc-terra)' : 'var(--nc-stone)',
            marginBottom: 4,
          }}>
            {safeDueForCheckin.length}
          </div>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--nc-stone)',
            marginBottom: 2,
          }}>
            {t('due_for_checkin')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--nc-stone)', fontWeight: 300 }}>
            {t('not_contacted')}
          </div>
        </div>

        {/* Recently Joined */}
        <div
          onClick={() => safeRecentlyJoined.length > 0 && toggleSection('joined')}
          style={{
            padding: '16px',
            border: '1px solid var(--nc-border)',
            borderRadius: 8,
            cursor: safeRecentlyJoined.length > 0 ? 'pointer' : 'default',
            background: expandedSection === 'joined' ? 'var(--nc-cream)' : 'white',
          }}
        >
          <div style={{
            fontSize: 24,
            fontWeight: 600,
            color: 'var(--nc-ink)',
            marginBottom: 4,
          }}>
            {safeRecentlyJoined.length}
          </div>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--nc-stone)',
            marginBottom: 2,
          }}>
            {t('recently_joined')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--nc-stone)', fontWeight: 300 }}>
            {t('new_clients_month')}
          </div>
        </div>
      </div>

      {/* Expanded client lists */}
      {expandedSection === 'active' && safeRecentlyActive.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--nc-border)',
          paddingTop: 16,
          marginTop: 8,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {safeRecentlyActive.slice(0, 5).map((client) => (
              <Link
                key={client.client_id}
                href={`/${locale}/dashboard/clients/${client.client_id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid var(--nc-border)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)' }}>
                  {client.client_name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--nc-stone)', fontWeight: 300 }}>
                  {new Date(client.last_activity_at).toLocaleDateString(locale, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {expandedSection === 'checkin' && safeDueForCheckin.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--nc-border)',
          paddingTop: 16,
          marginTop: 8,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {safeDueForCheckin.slice(0, 5).map((client) => (
              <Link
                key={client.client_id}
                href={`/${locale}/dashboard/clients/${client.client_id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid rgba(196,98,45,0.2)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: 'inherit',
                  background: 'rgba(196,98,45,0.03)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)' }}>
                  {client.client_name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--nc-terra)', fontWeight: 500 }}>
                  {client.days_since_contact} days
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {expandedSection === 'joined' && safeRecentlyJoined.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--nc-border)',
          paddingTop: 16,
          marginTop: 8,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {safeRecentlyJoined.slice(0, 5).map((client) => (
              <Link
                key={client.client_id}
                href={`/${locale}/dashboard/clients/${client.client_id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid var(--nc-border)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)' }}>
                  {client.client_name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--nc-stone)', fontWeight: 300 }}>
                  {new Date(client.activated_at).toLocaleDateString(locale, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
