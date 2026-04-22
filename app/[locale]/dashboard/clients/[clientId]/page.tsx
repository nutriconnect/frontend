// frontend/app/dashboard/clients/[clientId]/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useClientProfile, useNutritionPlans, useExercisePlans } from '@/lib/plans';
import { useEnhancedClient } from '@/lib/enhanced-clients';
import { completeRelationship, reactivateRelationship, activateRelationship } from '@/lib/hiring';
import { useSurveyAssignment, reviewSurveyAssignment } from '@/lib/survey';
import HealthTrackingSection from './components/HealthTrackingSection';
import SurveyAssignmentCard from '@/components/survey/SurveyAssignmentCard';
import AssignSurveyModal from '@/components/survey/AssignSurveyModal';
import SurveyResponseViewer from '@/components/survey/SurveyResponseViewer';
import { BMIBadge } from '@/components/BMIBadge';
import type { NutritionPlan, ExercisePlan, PlanStatus } from '@/lib/types';

function PlanStatusBadge({ status }: { status: PlanStatus }) {
  const t = useTranslations('dashboard.clients');
  const labels: Record<PlanStatus, string> = {
    draft:    t('plan_status_draft'),
    active:   t('plan_status_active'),
    archived: t('plan_status_archived'),
  };
  const styles: Record<PlanStatus, { bg: string; color: string }> = {
    draft:    { bg: 'rgba(139,115,85,0.1)',  color: 'var(--nc-stone)' },
    active:   { bg: 'rgba(74,124,89,0.1)',   color: '#4a7c59' },
    archived: { bg: 'rgba(0,0,0,0.06)',       color: 'var(--nc-stone)' },
  };
  const s = styles[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
      background: s.bg, color: s.color,
    }}>
      {labels[status]}
    </span>
  );
}

function RelationshipStatusBadge({ status }: { status: string }) {
  const t = useTranslations('dashboard.clients');
  const labels: Record<string, string> = {
    pending_intro: t('pending_intro'),
    active: t('active'),
    completed: t('completed'),
    cancelled: t('cancelled'),
  };
  const styles: Record<string, { bg: string; color: string }> = {
    pending_intro: { bg: 'rgba(184,134,11,0.1)', color: '#b8860b' },
    active: { bg: 'rgba(74,124,89,0.1)', color: '#4a7c59' },
    completed: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    cancelled: { bg: 'rgba(139,115,85,0.1)', color: 'var(--nc-stone)' },
  };
  const s = styles[status] || styles.pending_intro;
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 4,
      background: s.bg, color: s.color,
    }}>
      {labels[status] || labels.pending_intro}
    </span>
  );
}

function StatusManagementSection({ relationshipId, status, completionNotes, onStatusChange }: {
  relationshipId: string;
  status: string;
  completionNotes: string;
  onStatusChange: () => void;
}) {
  const t = useTranslations('dashboard.clients');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const handleComplete = async () => {
    if (!notes.trim()) {
      setError(t('error_notes_required'));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await completeRelationship(relationshipId, notes);
      onStatusChange();
      setShowNotesInput(false);
      setNotes('');
    } catch (err) {
      setError(t('error_complete'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await reactivateRelationship(relationshipId);
      onStatusChange();
    } catch (err) {
      setError(t('error_reactivate'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await activateRelationship(relationshipId);
      onStatusChange();
    } catch (err) {
      setError(t('error_activate'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dash-section">
      <div className="dash-section-head">
        <div className="dash-section-title">{t('management_title')}</div>
        <div className="dash-section-sub">{t('management_desc')}</div>
      </div>
      <div className="dash-section-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)' }}>
            {t('status_label')}
          </div>
          <RelationshipStatusBadge status={status} />
        </div>

        {completionNotes && status === 'completed' && (
          <div style={{
            background: 'rgba(74,124,89,0.05)', border: '1px solid rgba(74,124,89,0.2)',
            borderRadius: 6, padding: 12, marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a7c59', marginBottom: 6 }}>
              {t('completion_notes')}
            </div>
            <div style={{ fontSize: 13, color: 'var(--nc-ink)', fontWeight: 300, lineHeight: 1.5 }}>
              {completionNotes}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(205,92,92,0.1)', border: '1px solid rgba(205,92,92,0.2)',
            borderRadius: 6, padding: 12, marginBottom: 16, fontSize: 13, color: '#cd5c5c',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {status === 'pending_intro' && (
            <button
              onClick={handleActivate}
              disabled={isLoading}
              style={{
                padding: '10px 16px', fontSize: 13, fontWeight: 500,
                color: 'white', background: '#4a7c59',
                border: 'none', borderRadius: 6, cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? t('activating') : t('activate_button')}
            </button>
          )}

          {status === 'active' && !showNotesInput && (
            <button
              onClick={() => setShowNotesInput(true)}
              disabled={isLoading}
              style={{
                padding: '10px 16px', fontSize: 13, fontWeight: 500,
                color: 'var(--nc-forest)', background: 'transparent',
                border: '1.5px solid var(--nc-border)', borderRadius: 6,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {t('mark_complete')}
            </button>
          )}

          {status === 'active' && showNotesInput && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('complete_notes_placeholder')}
                rows={4}
                style={{
                  width: '100%', padding: 10, fontSize: 13, fontFamily: 'inherit',
                  border: '1px solid var(--nc-border)', borderRadius: 6,
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleComplete}
                  disabled={isLoading || !notes.trim()}
                  style={{
                    padding: '10px 16px', fontSize: 13, fontWeight: 500,
                    color: 'white', background: '#4a7c59',
                    border: 'none', borderRadius: 6, cursor: (isLoading || !notes.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || !notes.trim()) ? 0.6 : 1,
                  }}
                >
                  {isLoading ? t('saving') : t('complete_button')}
                </button>
                <button
                  onClick={() => {
                    setShowNotesInput(false);
                    setNotes('');
                    setError(null);
                  }}
                  disabled={isLoading}
                  style={{
                    padding: '10px 16px', fontSize: 13, fontWeight: 500,
                    color: 'var(--nc-stone)', background: 'white',
                    border: '1px solid var(--nc-border)', borderRadius: 6, cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <button
              onClick={handleReactivate}
              disabled={isLoading}
              style={{
                padding: '10px 16px', fontSize: 13, fontWeight: 500,
                color: 'white', background: '#4a7c59',
                border: 'none', borderRadius: 6, cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? t('reactivating') : t('reactivate_button')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NutritionSection({ clientId, plans, isLoading, locale }: {
  clientId: string;
  plans: NutritionPlan[];
  isLoading: boolean;
  locale: string;
}) {
  const t = useTranslations('dashboard.clients');
  return (
    <div className="dash-section">
      <div className="dash-section-head">
        <div className="dash-section-title">{t('nutrition_plans_title')}</div>
        <div className="dash-section-sub">{t('nutrition_plans_desc')}</div>
      </div>
      <div className="dash-section-body">
        {isLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300, fontSize: 13 }}>{t('loading')}</div>
        ) : plans.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 12 }}>
            {t('no_nutrition_plans')}
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
                    href={`/${locale}/dashboard/clients/${clientId}/plans/nutrition/${plan.id}`}
                    style={{ fontSize: 12, color: 'var(--nc-terra)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {t('view_edit')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href={`/${locale}/dashboard/clients/${clientId}/plans/nutrition/new`}
          style={{
            display: 'inline-block', fontSize: 13, fontWeight: 500,
            color: 'var(--nc-forest)', border: '1.5px dashed var(--nc-border)',
            borderRadius: 6, padding: '8px 16px', textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          {t('create_nutrition')}
        </Link>
      </div>
    </div>
  );
}

function ExerciseSection({ clientId, plans, isLoading, locale }: {
  clientId: string;
  plans: ExercisePlan[];
  isLoading: boolean;
  locale: string;
}) {
  const t = useTranslations('dashboard.clients');
  return (
    <div className="dash-section">
      <div className="dash-section-head">
        <div className="dash-section-title">{t('exercise_plans_title')}</div>
        <div className="dash-section-sub">{t('exercise_plans_desc')}</div>
      </div>
      <div className="dash-section-body">
        {isLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300, fontSize: 13 }}>{t('loading')}</div>
        ) : plans.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 12 }}>
            {t('no_exercise_plans')}
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
                    href={`/${locale}/dashboard/clients/${clientId}/plans/exercise/${plan.id}`}
                    style={{ fontSize: 12, color: 'var(--nc-terra)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {t('view_edit')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href={`/${locale}/dashboard/clients/${clientId}/plans/exercise/new`}
          style={{
            display: 'inline-block', fontSize: 13, fontWeight: 500,
            color: 'var(--nc-forest)', border: '1.5px dashed var(--nc-border)',
            borderRadius: 6, padding: '8px 16px', textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          {t('create_exercise')}
        </Link>
      </div>
    </div>
  );
}

export default function ClientDetailPage() {
  const t = useTranslations('dashboard.clients');
  const locale = useLocale();
  const params = useParams<{ clientId: string }>();
  const clientId = params.clientId;

  const { profile, isLoading: profileLoading } = useClientProfile(clientId);
  const { plans: nutritionPlans, isLoading: nutritionLoading } = useNutritionPlans(clientId);
  const { plans: exercisePlans, isLoading: exerciseLoading } = useExercisePlans(clientId);
  const { client, isLoading: clientLoading, mutate: mutateClient } = useEnhancedClient(clientId);

  // Survey state
  const relationshipId = client?.relationship_id ?? null;
  const { assignment: surveyAssignment, isLoading: surveyLoading, mutate: mutateSurvey } = useSurveyAssignment(relationshipId);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResponseViewer, setShowResponseViewer] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReviewSurvey = async () => {
    if (!relationshipId) return;
    setIsReviewing(true);
    try {
      await reviewSurveyAssignment(relationshipId);
      mutateSurvey();
    } catch {
      // Error silently handled
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <>
      <div className="dash-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href={`/${locale}/dashboard/clients`}
            style={{ fontSize: 13, color: 'var(--nc-stone)', textDecoration: 'none' }}
          >
            {t('back_to_clients')}
          </Link>
          <div className="dash-topbar-title">
            {profileLoading ? t('client') : (profile?.display_name ?? t('client'))}
          </div>
        </div>
      </div>
      <div className="dash-content">
        {/* Client quick info */}
        {!profileLoading && profile && (
          <div style={{
            background: 'white', border: '1px solid var(--nc-border)',
            borderRadius: 8, padding: '12px 16px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              {profile.city && (
                <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300 }}>
                  📍 {profile.city}
                </div>
              )}
              {profile.activity_level && (
                <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300 }}>
                  🏃 {profile.activity_level.replace('_', ' ')}
                </div>
              )}
              {profile.bmi && (
                <BMIBadge
                  bmi={profile.bmi}
                  bmi_category={profile.bmi_category}
                />
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {profile.goals?.slice(0, 2).map((g) => (
                <span key={g} style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 20,
                  background: 'rgba(26,51,41,0.1)', color: 'var(--nc-forest)', fontWeight: 500,
                }}>
                  {g}
                </span>
              ))}
              {(profile.dietary_restrictions?.length ?? 0) > 0 && (
                <span style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 20,
                  background: 'rgba(196,98,45,0.1)', color: 'var(--nc-terra)', fontWeight: 500,
                }}>
                  {profile.dietary_restrictions![0]}
                  {profile.dietary_restrictions!.length > 1 && ` +${profile.dietary_restrictions!.length - 1}`}
                </span>
              )}
            </div>
          </div>
        )}

        {!clientLoading && client && (
          <>
            <StatusManagementSection
              relationshipId={client.relationship_id}
              status={client.status}
              completionNotes={client.completion_notes}
              onStatusChange={mutateClient}
            />
            <HealthTrackingSection
              clientId={clientId}
              relationshipStatus={client.status}
            />
          </>
        )}

        {/* Survey section */}
        {!clientLoading && client && (
          <>
            <SurveyAssignmentCard
              assignment={surveyAssignment}
              relationshipId={client.relationship_id}
              isLoading={surveyLoading}
              onAssign={() => setShowAssignModal(true)}
              isNutritionist
              onReview={handleReviewSurvey}
              onViewResponses={() => setShowResponseViewer(true)}
            />

            <AssignSurveyModal
              open={showAssignModal}
              onOpenChange={setShowAssignModal}
              relationshipId={client.relationship_id}
              onAssigned={() => mutateSurvey()}
            />

            {/* Response viewer section (inline, not modal) */}
            {showResponseViewer && surveyAssignment && (
              <div className="dash-section">
                <div className="dash-section-head">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="dash-section-title">{t('survey_responses')}</div>
                      <div className="dash-section-sub">{t('survey_responses_desc')}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowResponseViewer(false)}
                      style={{
                        fontSize: 12, fontWeight: 500, color: 'var(--nc-stone)',
                        background: 'white', border: '1px solid var(--nc-border)',
                        borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
                      }}
                    >
                      {t('close_button')}
                    </button>
                  </div>
                </div>
                <div className="dash-section-body">
                  <SurveyResponseViewer
                    responses={surveyAssignment.responses}
                    status={surveyAssignment.status}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <NutritionSection clientId={clientId} plans={nutritionPlans} isLoading={nutritionLoading} locale={locale} />
        <ExerciseSection clientId={clientId} plans={exercisePlans} isLoading={exerciseLoading} locale={locale} />
      </div>
    </>
  );
}
