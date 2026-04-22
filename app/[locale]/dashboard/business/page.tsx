// frontend/app/dashboard/business/page.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useBusinessDashboard } from '@/lib/hiring';
import { ContractedValueOverview } from './contracted-value-overview';
import { RevenueBreakdown } from './revenue-breakdown';
import { ContractHistoryTable } from './contract-history-table';
import { NutriRedCostsPanel } from './nutri-red-costs-panel';

export default function BusinessDashboardPage() {
  const t = useTranslations('dashboard.business');
  const { data, isLoading, error } = useBusinessDashboard();

  if (isLoading) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ color: 'var(--nc-stone)', fontSize: 14 }}>{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ color: '#cd5c5c', fontSize: 14 }}>{t('error')}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--nc-stone)', marginBottom: 8 }}>
          {t('title')}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--nc-stone)' }}>
          {t('subtitle')}
        </p>
      </div>

      <ContractedValueOverview data={data} />
      <RevenueBreakdown data={data} />
      <ContractHistoryTable contracts={data.contracts} />
      <NutriRedCostsPanel data={data} />
    </div>
  );
}
