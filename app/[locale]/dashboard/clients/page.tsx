// frontend/app/dashboard/clients/page.tsx
'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import QuickStatsPanel from '@/components/QuickStatsPanel';
import SearchFilterBar from '@/components/SearchFilterBar';
import ClientCard from '@/components/ClientCard';
import { useQuickStats, useEnhancedClients } from '@/lib/enhanced-clients';
import { useNutritionistOverview } from '@/lib/nutritionist';
import { useAuth } from '@/lib/auth';
import { PendingIntrosBanner } from '@/components/PendingIntrosBanner';
import { acceptPendingIntro, declinePendingIntro } from '@/lib/hiring';
import { toastSuccess, toastError } from '@/lib/toast';
import type { EnhancedClient } from '@/lib/types';

function PendingClientRow({
  client,
  onAccept,
  onDecline,
  locale,
}: {
  client: EnhancedClient;
  onAccept: (id: string) => Promise<void>;
  onDecline: (id: string, reason?: string) => Promise<void>;
  locale: string;
}) {
  const t = useTranslations('dashboard.clients');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept(client.relationship_id);
      toastSuccess(t('accept_success'));
      setShowAcceptModal(false);
    } catch (error) {
      toastError(t('accept_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await onDecline(client.relationship_id, reason);
      toastSuccess(t('decline_success'));
      setShowDeclineModal(false);
    } catch (error) {
      toastError(t('decline_error'));
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(client.created_at), {
    addSuffix: true,
    locale: locale === 'es' ? es : enUS
  });

  return (
    <>
      <div
        style={{
          padding: 16,
          border: '1px solid var(--nc-border)',
          borderRadius: 8,
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--nc-ink)', marginBottom: 4 }}>
            {client.client_display_name || client.client_email}
          </div>
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300 }}>
            {client.client_email}
          </div>
          <div style={{ fontSize: 12, color: 'var(--nc-stone)', marginTop: 4 }}>
            {t('requested_time', { time: timeAgo })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowAcceptModal(true)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: 'var(--nc-forest)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {t('accept')}
          </button>
          <button
            onClick={() => setShowDeclineModal(true)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: 'white',
              color: '#cd5c5c',
              border: '1px solid #cd5c5c',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {t('decline')}
          </button>
        </div>
      </div>

      {/* Accept modal */}
      {showAcceptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAcceptModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 24,
              maxWidth: 400,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--nc-ink)' }}>
              {t('accept_confirm', { name: client.client_display_name })}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--nc-stone)', marginBottom: 20, lineHeight: 1.5 }}>
              {t('accept_confirm_description')}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAcceptModal(false)}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  color: 'var(--nc-stone)',
                  border: '1px solid var(--nc-border)',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  background: 'var(--nc-forest)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? t('activating') : t('accept')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline modal */}
      {showDeclineModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowDeclineModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 24,
              maxWidth: 500,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              {t('decline_modal_title')}
            </h3>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500 }}>
              {t('decline_reason_label')}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('decline_reason_placeholder')}
              rows={4}
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid var(--nc-border)',
                borderRadius: 6,
                fontSize: 13,
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeclineModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  color: 'var(--nc-stone)',
                  border: '1px solid var(--nc-border)',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDecline}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  background: '#cd5c5c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {t('decline_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function MyClientsPage() {
  const t = useTranslations('dashboard.clients');
  const locale = useLocale();
  const { user } = useAuth();
  const { overview } = useNutritionistOverview();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const { stats, isLoading: statsLoading } = useQuickStats();
  const { clients, isLoading: clientsLoading, error, mutate } = useEnhancedClients({
    search,
    status,
    sort,
  });

  const hasFilters = search !== '' || status !== '';

  const handleAcceptPendingIntro = async (relationshipId: string) => {
    await acceptPendingIntro(relationshipId);
    mutate(); // Refresh client list
  };

  const handleDeclinePendingIntro = async (relationshipId: string, reason?: string) => {
    await declinePendingIntro(relationshipId, reason);
    mutate(); // Refresh client list
  };

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">{t('title')}</div>
      </div>
      <div className="dash-content">
        {user?.role === 'nutritionist' && overview && (
          <PendingIntrosBanner count={overview.pending_intros_count} locale={locale} />
        )}

        <QuickStatsPanel stats={stats} isLoading={statsLoading} />

        <SearchFilterBar
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortChange={setSort}
          initialSearch={search}
          initialStatus={status}
          initialSort={sort}
        />

        {clientsLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>
            {t('loading')}
          </div>
        ) : error ? (
          <div style={{
            background: 'white',
            border: '1px solid rgba(205,92,92,0.2)',
            borderRadius: 8,
            padding: 24,
            color: '#cd5c5c',
          }}>
            {t('error')}
          </div>
        ) : clients.length === 0 ? (
          <div style={{
            background: 'white',
            border: '1px solid rgba(139,115,85,0.12)',
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            color: 'var(--nc-stone)',
            fontWeight: 300,
          }}>
            {hasFilters ? (
              <>
                <div style={{ marginBottom: 12 }}>
                  {t('no_results')}
                </div>
                <button
                  onClick={() => {
                    setSearch('');
                    setStatus('');
                    setSort('newest');
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--nc-terra)',
                    background: 'rgba(196,98,45,0.08)',
                    border: '1px solid rgba(196,98,45,0.2)',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  {t('clear_filters')}
                </button>
              </>
            ) : (
              t('no_clients')
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {clients.map((client) => {
              if (client.status === 'pending_intro') {
                return (
                  <PendingClientRow
                    key={client.relationship_id}
                    client={client}
                    onAccept={handleAcceptPendingIntro}
                    onDecline={handleDeclinePendingIntro}
                    locale={locale}
                  />
                );
              }
              return <ClientCard key={client.relationship_id} client={client} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}
