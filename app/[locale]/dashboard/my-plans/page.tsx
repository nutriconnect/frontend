// frontend/app/dashboard/my-plans/page.tsx
'use client';

import { useMemo } from 'react';
import { useMyActiveAllPlans } from '@/lib/plans';
import { useMyRelationships } from '@/lib/hiring';
import type { NutritionPlan, ExercisePlan } from '@/lib/types';
import { NutritionPlanView, ExercisePlanView } from './components/PlanViews';

// ─── Page ──────────────────────────────────────────────────────────────────────

interface GroupedPlans {
  relationshipId: string;
  nutritionistName: string;
  nutritionistAvatar: string | null;
  nutritionPlan: NutritionPlan | null;
  exercisePlan: ExercisePlan | null;
}

export default function MyPlansPage() {
  const { nutritionPlans, exercisePlans, isLoading } = useMyActiveAllPlans();
  const { relationships } = useMyRelationships();

  const handlePrint = () => {
    window.print();
  };

  // Group plans by relationship_id
  const groupedPlans = useMemo((): GroupedPlans[] => {
    const groupMap = new Map<string, GroupedPlans>();

    // Add nutrition plans
    for (const plan of nutritionPlans) {
      if (!groupMap.has(plan.relationship_id)) {
        const rel = relationships.find(r => r.id === plan.relationship_id);
        groupMap.set(plan.relationship_id, {
          relationshipId: plan.relationship_id,
          nutritionistName: rel?.nutritionist_display_name ?? 'Nutricionista desconocido',
          nutritionistAvatar: null, // relationships don't have avatar field yet
          nutritionPlan: plan,
          exercisePlan: null,
        });
      } else {
        groupMap.get(plan.relationship_id)!.nutritionPlan = plan;
      }
    }

    // Add exercise plans
    for (const plan of exercisePlans) {
      if (!groupMap.has(plan.relationship_id)) {
        const rel = relationships.find(r => r.id === plan.relationship_id);
        groupMap.set(plan.relationship_id, {
          relationshipId: plan.relationship_id,
          nutritionistName: rel?.nutritionist_display_name ?? 'Nutricionista desconocido',
          nutritionistAvatar: null,
          nutritionPlan: null,
          exercisePlan: plan,
        });
      } else {
        groupMap.get(plan.relationship_id)!.exercisePlan = plan;
      }
    }

    return Array.from(groupMap.values());
  }, [nutritionPlans, exercisePlans, relationships]);

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Mis planes</div>
        <div className="dash-topbar-right">
          <button
            onClick={handlePrint}
            className="print-hide"
            style={{
              height: 34, padding: '0 16px',
              border: '1px solid var(--nc-border)', borderRadius: 6,
              background: 'transparent', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--nc-stone)',
            }}
          >
            Descargar PDF
          </button>
        </div>
      </div>
      <div className="dash-content">
        {isLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>Cargando planes…</div>
        ) : groupedPlans.length === 0 ? (
          <div style={{
            background: 'white', border: '1px solid rgba(139,115,85,0.12)',
            borderRadius: 8, padding: 32, textAlign: 'center',
            color: 'var(--nc-stone)', fontWeight: 300, fontSize: 14,
          }}>
            <div style={{ marginBottom: 8, fontSize: 16 }}>No tienes planes activos</div>
            <div>Tus nutricionistas te asignarán planes en breve.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {groupedPlans.map((group) => (
              <div key={group.relationshipId}>
                {group.nutritionPlan && (
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--nc-ink)' }}>📋</span>
                      <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--nc-ink)' }}>
                        Plan de Nutrición por {group.nutritionistName}
                      </span>
                    </div>
                    <NutritionPlanView plan={group.nutritionPlan} />
                  </div>
                )}
                {group.exercisePlan && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--nc-ink)' }}>🏋️</span>
                      <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--nc-ink)' }}>
                        Plan de Ejercicio por {group.nutritionistName}
                      </span>
                    </div>
                    <ExercisePlanView plan={group.exercisePlan} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
