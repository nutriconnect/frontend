// frontend/app/dashboard/clients/[clientId]/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useClientProfile, useNutritionPlans, useExercisePlans } from '@/lib/plans';
import type { NutritionPlan, ExercisePlan, PlanStatus } from '@/lib/types';

function PlanStatusBadge({ status }: { status: PlanStatus }) {
  const styles: Record<PlanStatus, { bg: string; color: string; label: string }> = {
    draft:    { bg: 'rgba(139,115,85,0.1)',  color: 'var(--nc-stone)',  label: 'Borrador' },
    active:   { bg: 'rgba(74,124,89,0.1)',   color: '#4a7c59',          label: 'Activo'   },
    archived: { bg: 'rgba(0,0,0,0.06)',       color: 'var(--nc-stone)',  label: 'Archivado'},
  };
  const s = styles[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
      background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

function NutritionSection({ clientId, plans, isLoading }: {
  clientId: string;
  plans: NutritionPlan[];
  isLoading: boolean;
}) {
  return (
    <div className="dash-section">
      <div className="dash-section-head">
        <div className="dash-section-title">Planes de nutrición</div>
        <div className="dash-section-sub">Crea y gestiona los planes de alimentación del cliente</div>
      </div>
      <div className="dash-section-body">
        {isLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300, fontSize: 13 }}>Cargando…</div>
        ) : plans.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 12 }}>
            No hay planes de nutrición para este cliente.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: 'var(--nc-cream)',
                border: '1px solid var(--nc-border)', borderRadius: 6,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)' }}>
                  {plan.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PlanStatusBadge status={plan.status} />
                  <Link
                    href={`/dashboard/clients/${clientId}/plans/nutrition/${plan.id}`}
                    style={{ fontSize: 12, color: 'var(--nc-terra)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Ver/editar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href={`/dashboard/clients/${clientId}/plans/nutrition/new`}
          style={{
            display: 'inline-block', fontSize: 13, fontWeight: 500,
            color: 'var(--nc-forest)', border: '1.5px dashed var(--nc-border)',
            borderRadius: 6, padding: '8px 16px', textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          + Crear nuevo plan de nutrición
        </Link>
      </div>
    </div>
  );
}

function ExerciseSection({ clientId, plans, isLoading }: {
  clientId: string;
  plans: ExercisePlan[];
  isLoading: boolean;
}) {
  return (
    <div className="dash-section">
      <div className="dash-section-head">
        <div className="dash-section-title">Planes de ejercicio</div>
        <div className="dash-section-sub">Crea y gestiona los planes de entrenamiento del cliente</div>
      </div>
      <div className="dash-section-body">
        {isLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300, fontSize: 13 }}>Cargando…</div>
        ) : plans.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 12 }}>
            No hay planes de ejercicio para este cliente.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: 'var(--nc-cream)',
                border: '1px solid var(--nc-border)', borderRadius: 6,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)' }}>
                  {plan.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PlanStatusBadge status={plan.status} />
                  <Link
                    href={`/dashboard/clients/${clientId}/plans/exercise/${plan.id}`}
                    style={{ fontSize: 12, color: 'var(--nc-terra)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Ver/editar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href={`/dashboard/clients/${clientId}/plans/exercise/new`}
          style={{
            display: 'inline-block', fontSize: 13, fontWeight: 500,
            color: 'var(--nc-forest)', border: '1.5px dashed var(--nc-border)',
            borderRadius: 6, padding: '8px 16px', textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          + Crear nuevo plan de ejercicio
        </Link>
      </div>
    </div>
  );
}

export default function ClientDetailPage() {
  const params = useParams<{ clientId: string }>();
  const clientId = params.clientId;

  const { profile, isLoading: profileLoading } = useClientProfile(clientId);
  const { plans: nutritionPlans, isLoading: nutritionLoading } = useNutritionPlans(clientId);
  const { plans: exercisePlans, isLoading: exerciseLoading } = useExercisePlans(clientId);

  return (
    <>
      <div className="dash-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/dashboard/clients"
            style={{ fontSize: 13, color: 'var(--nc-stone)', textDecoration: 'none' }}
          >
            ← Mis clientes
          </Link>
          <div className="dash-topbar-title">
            {profileLoading ? '…' : (profile?.display_name ?? 'Cliente')}
          </div>
        </div>
      </div>
      <div className="dash-content">
        {/* Client info card */}
        {!profileLoading && profile && (
          <div style={{
            background: 'white', border: '1px solid var(--nc-border)',
            borderRadius: 10, padding: '20px 24px', marginBottom: 24,
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--nc-ink)', marginBottom: 4 }}>
              {profile.display_name}
            </div>
            {profile.city && (
              <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 8 }}>
                {profile.city}
              </div>
            )}
            {profile.bio && (
              <div style={{
                fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300,
                lineHeight: 1.5, marginBottom: 12,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {profile.bio}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {profile.goals.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--nc-stone)', marginBottom: 4 }}>
                    Objetivos
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {profile.goals.map((g) => (
                      <span key={g} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(26,51,41,0.07)', color: 'var(--nc-forest)', fontWeight: 500,
                      }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.dietary_restrictions.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--nc-stone)', marginBottom: 4 }}>
                    Restricciones
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {profile.dietary_restrictions.map((r) => (
                      <span key={r} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(196,98,45,0.08)', color: 'var(--nc-terra)', fontWeight: 500,
                      }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.allergies.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--nc-stone)', marginBottom: 4 }}>
                    Alergias
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {profile.allergies.map((a) => (
                      <span key={a} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(139,115,85,0.1)', color: 'var(--nc-stone)', fontWeight: 500,
                      }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <NutritionSection clientId={clientId} plans={nutritionPlans} isLoading={nutritionLoading} />
        <ExerciseSection clientId={clientId} plans={exercisePlans} isLoading={exerciseLoading} />
      </div>
    </>
  );
}
