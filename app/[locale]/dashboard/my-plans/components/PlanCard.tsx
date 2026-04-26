// frontend/app/[locale]/dashboard/my-plans/components/PlanCard.tsx
import Link from 'next/link';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import type { NutritionPlan, ExercisePlan } from '@/lib/types';

interface PlanCardProps {
  plan: NutritionPlan | ExercisePlan;
  nutritionistName: string;
  type: 'nutrition' | 'exercise';
  locale: string;
}

export default function PlanCard({ plan, nutritionistName, type, locale }: PlanCardProps) {
  const t = useTranslations('plans');

  // Calculate stats based on plan type
  const stats = (() => {
    if (type === 'nutrition') {
      const nutritionPlan = plan as NutritionPlan;
      if (nutritionPlan.plan_style === 'flexible') {
        const slotCount = nutritionPlan.slots.length;
        const suppCount = nutritionPlan.include_supplements ? nutritionPlan.supplements.length : 0;
        const parts = [
          t('time_slots', { count: slotCount })
        ];
        if (suppCount > 0) {
          parts.push(t('supplements', { count: suppCount }));
        }
        return parts.join(' • ');
      } else {
        const dayCount = nutritionPlan.days.length;
        const mealCount = nutritionPlan.days.reduce((sum, day) => sum + day.meals.length, 0);
        const suppCount = nutritionPlan.include_supplements ? nutritionPlan.supplements.length : 0;
        const parts = [
          t('days', { count: dayCount }),
          t('meals', { count: mealCount })
        ];
        if (suppCount > 0) {
          parts.push(t('supplements', { count: suppCount }));
        }
        return parts.join(' • ');
      }
    } else {
      const exercisePlan = plan as ExercisePlan;
      const dayCount = exercisePlan.days.length;
      const workoutDays = exercisePlan.days.filter(d => d.day_type !== 'rest').length;
      const restDays = exercisePlan.days.filter(d => d.day_type === 'rest').length;
      return [
        t('days', { count: dayCount }),
        t('workout_days', { count: workoutDays }),
        t('rest_days', { count: restDays })
      ].join(' • ');
    }
  })();

  // Format date
  const dateLocale = locale === 'es' ? es : enUS;
  const formattedDate = format(new Date(plan.created_at), 'dd MMM yyyy', { locale: dateLocale });

  // Status badge
  const statusColor = plan.status === 'active'
    ? 'var(--nc-forest)'
    : 'var(--nc-stone)';
  const statusBg = plan.status === 'active'
    ? 'rgba(26,51,41,0.1)'
    : 'rgba(139,115,85,0.1)';
  const statusText = plan.status === 'active'
    ? t('status_active')
    : plan.status === 'archived'
    ? t('status_archived')
    : t('status_draft');

  // Emoji
  const emoji = type === 'nutrition' ? '📋' : '🏋️';

  return (
    <Link
      href={`/${locale}/dashboard/my-plans/${type}/${plan.id}`}
      style={{
        display: 'block',
        background: 'white',
        border: '1px solid var(--nc-border)',
        borderRadius: 10,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = 'rgba(139,115,85,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--nc-border)';
      }}
    >
      {/* Title with emoji */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--nc-ink)',
          margin: 0,
        }}>
          {plan.title}
        </h3>
      </div>

      {/* Nutritionist name */}
      <div style={{
        fontSize: 14,
        color: 'var(--nc-stone)',
        marginBottom: 10,
        fontWeight: 400,
      }}>
        {nutritionistName}
      </div>

      {/* Stats */}
      <div style={{
        fontSize: 13,
        color: 'var(--nc-stone)',
        marginBottom: 10,
        fontWeight: 300,
      }}>
        {stats}
      </div>

      {/* Date */}
      <div style={{
        fontSize: 12,
        color: 'rgba(139,115,85,0.6)',
        marginBottom: 12,
        fontWeight: 300,
      }}>
        {t('created_on', { date: formattedDate })}
      </div>

      {/* Status badge */}
      <span style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 500,
        color: statusColor,
        background: statusBg,
      }}>
        {statusText}
      </span>
    </Link>
  );
}
