// frontend/app/[locale]/dashboard/my-plans/exercise/[id]/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useExercisePlan } from '@/lib/plans';
import { useMyRelationships } from '@/lib/hiring';
import { ExercisePlanView } from '../../components/PlanViews';
import { apiClient } from '@/lib/api';

export default function ExercisePlanDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('plans');
  const { plan, isLoading, error } = useExercisePlan(params.id as string);
  const { relationships } = useMyRelationships();

  // Match nutritionist name
  const nutritionistName = relationships.find(
    (r) => r.id === plan?.relationship_id
  )?.nutritionist_display_name ?? 'Nutricionista desconocido';

  // Download PDF handler
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!plan) return;

    try {
      setDownloading(true);
      const blob = await apiClient.downloadBlob(`/plans/exercise/${params.id}/pdf`);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${plan.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed:', error);
      // TODO: Show error toast/notification
    } finally {
      setDownloading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="dash-topbar">
          <div className="dash-topbar-title">{t('loading')}</div>
        </div>
        <div className="dash-content">
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>
            {t('loading')}
          </div>
        </div>
      </>
    );
  }

  // Not found
  if (error || !plan) {
    return (
      <>
        <div className="dash-topbar">
          <div className="dash-topbar-title">{t('not_found')}</div>
        </div>
        <div className="dash-content">
          <div
            style={{
              background: 'white',
              border: '1px solid rgba(139,115,85,0.12)',
              borderRadius: 8,
              padding: 32,
              textAlign: 'center',
              color: 'var(--nc-stone)',
              fontWeight: 300,
              fontSize: 14,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 500,
                color: 'var(--nc-ink)',
                marginBottom: 12,
              }}
            >
              {t('not_found')}
            </h2>
            <p style={{ marginBottom: 20 }}>{t('not_found_description')}</p>
            <Link
              href={`/${locale}/dashboard/my-plans`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--nc-forest)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              ← {t('back_to_list')}
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-topbar">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href={`/${params.locale}/dashboard/my-plans`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--nc-stone)',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              padding: '6px 12px',
              borderRadius: 8,
              marginLeft: -12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--nc-forest)';
              e.currentTarget.style.background = 'rgba(90, 138, 64, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--nc-stone)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: 16 }}>←</span>
            {t('back_to_list')}
          </Link>
        </div>
        <div style={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--nc-ink)',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}>
            {plan.title}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: 'var(--nc-stone)',
              marginTop: 4,
            }}
          >
            {t('by_nutritionist', { name: nutritionistName })}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: downloading ? 'var(--nc-stone)' : 'var(--nc-forest)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              cursor: downloading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: downloading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!downloading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(90, 138, 64, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? t('generating_pdf') : t('download_pdf')}
          </button>
        </div>
      </div>
      <div className="dash-content">
        <ExercisePlanView plan={plan} />
      </div>
    </>
  );
}
