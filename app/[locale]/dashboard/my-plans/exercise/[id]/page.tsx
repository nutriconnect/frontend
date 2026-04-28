// frontend/app/[locale]/dashboard/my-plans/exercise/[id]/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useExercisePlan } from '@/lib/plans';
import { useMyRelationships } from '@/lib/hiring';
import { ExercisePlanView } from '../../components/PlanViews';
import api from '@/lib/api';

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
    try {
      setDownloading(true);
      const response = await api.get(`/plans/exercise/${params.id}/pdf`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href={`/${params.locale}/dashboard/my-plans`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--nc-stone)',
              fontSize: 14,
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--nc-ink)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--nc-stone)';
            }}
          >
            ← {t('back_to_list')}
          </Link>
        </div>
        <div className="dash-topbar-title">
          <div>{plan.title}</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: 'var(--nc-stone)',
              marginTop: 4,
            }}
          >
            {t('by_nutritionist', { name: nutritionistName })}
          </div>
        </div>
        <div className="dash-topbar-right">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="nc-btn-secondary print-hide"
          >
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
