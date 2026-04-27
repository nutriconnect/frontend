// frontend/app/[locale]/dashboard/my-plans/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useMyActiveAllPlans } from '@/lib/plans';
import { useMyRelationships } from '@/lib/hiring';
import PlanCard from './components/PlanCard';
import type { NutritionPlan, ExercisePlan } from '@/lib/types';

type TabType = 'active' | 'archived';

interface PlanWithType {
  plan: NutritionPlan | ExercisePlan;
  type: 'nutrition' | 'exercise';
  nutritionistName: string;
}

export default function MyPlansListPage() {
  const t = useTranslations('plans');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const { nutritionPlans, exercisePlans, isLoading, error } = useMyActiveAllPlans();
  const { relationships } = useMyRelationships();

  // Combine all plans with their types and nutritionist names
  const allPlans = useMemo((): PlanWithType[] => {
    const plans: PlanWithType[] = [];

    // Add nutrition plans
    for (const plan of nutritionPlans) {
      const rel = relationships.find(r => r.id === plan.relationship_id);
      plans.push({
        plan,
        type: 'nutrition',
        nutritionistName: rel?.nutritionist_display_name ?? 'Nutricionista desconocido',
      });
    }

    // Add exercise plans
    for (const plan of exercisePlans) {
      const rel = relationships.find(r => r.id === plan.relationship_id);
      plans.push({
        plan,
        type: 'exercise',
        nutritionistName: rel?.nutritionist_display_name ?? 'Nutricionista desconocido',
      });
    }

    // Sort by created_at descending (newest first)
    plans.sort((a, b) => new Date(b.plan.created_at).getTime() - new Date(a.plan.created_at).getTime());

    return plans;
  }, [nutritionPlans, exercisePlans, relationships]);

  // Filter plans by active tab
  const filteredPlans = useMemo(() => {
    return allPlans.filter(({ plan }) => {
      if (activeTab === 'active') {
        return plan.status === 'active';
      } else {
        return plan.status === 'archived';
      }
    });
  }, [allPlans, activeTab]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="dash-topbar">
          <div className="dash-topbar-title">{t('my_plans')}</div>
        </div>
        <div className="dash-content">
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>
            {t('loading')}
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="dash-topbar">
          <div className="dash-topbar-title">{t('my_plans')}</div>
        </div>
        <div className="dash-content">
          <div style={{
            background: 'white',
            border: '1px solid rgba(139,115,85,0.12)',
            borderRadius: 8,
            padding: 32,
            textAlign: 'center',
            color: 'var(--nc-stone)',
            fontWeight: 300,
            fontSize: 14,
          }}>
            {t('error')}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">{t('my_plans')}</div>
        <div className="dash-topbar-right">
          {/* Active/Archived tabs */}
          <div style={{
            display: 'flex',
            gap: 8,
            background: 'rgba(139,115,85,0.05)',
            borderRadius: 8,
            padding: 4,
          }}>
            <button
              onClick={() => setActiveTab('active')}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: 6,
                background: activeTab === 'active' ? 'white' : 'transparent',
                color: activeTab === 'active' ? 'var(--nc-ink)' : 'var(--nc-stone)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: activeTab === 'active' ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t('active')}
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: 6,
                background: activeTab === 'archived' ? 'white' : 'transparent',
                color: activeTab === 'archived' ? 'var(--nc-ink)' : 'var(--nc-stone)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: activeTab === 'archived' ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t('archived')}
            </button>
          </div>
        </div>
      </div>
      <div className="dash-content">
        {filteredPlans.length === 0 ? (
          <div style={{
            background: 'white',
            border: '1px solid rgba(139,115,85,0.12)',
            borderRadius: 8,
            padding: 32,
            textAlign: 'center',
            color: 'var(--nc-stone)',
            fontWeight: 300,
            fontSize: 14,
          }}>
            <div style={{ marginBottom: 8, fontSize: 16 }}>
              {activeTab === 'active' ? t('no_active_plans') : t('no_archived_plans')}
            </div>
            {activeTab === 'active' && (
              <div>{t('no_active_plans_description')}</div>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {filteredPlans.map(({ plan, type, nutritionistName }) => (
              <PlanCard
                key={`${type}-${plan.id}`}
                plan={plan}
                nutritionistName={nutritionistName}
                type={type}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
