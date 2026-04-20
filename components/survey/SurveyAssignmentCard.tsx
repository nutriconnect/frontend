'use client';

import Link from 'next/link';
import type { SurveyAssignmentDetail } from '@/lib/types';

interface SurveyAssignmentCardProps {
  assignment: SurveyAssignmentDetail | null;
  relationshipId: string;
  isLoading: boolean;
  onAssign: () => void;
  /** If true, show the nutritionist view (review button, response viewer link). */
  isNutritionist?: boolean;
  onReview?: () => void;
  onViewResponses?: () => void;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: 'rgba(184,134,11,0.1)', color: '#b8860b', label: 'Pendiente' },
    completed: { bg: 'rgba(74,124,89,0.1)', color: '#4a7c59', label: 'Completada' },
    reviewed: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Revisada' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
      background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

export default function SurveyAssignmentCard({
  assignment,
  relationshipId,
  isLoading,
  onAssign,
  isNutritionist = false,
  onReview,
  onViewResponses,
}: SurveyAssignmentCardProps) {
  if (isLoading) {
    return (
      <div className="dash-section">
        <div className="dash-section-head">
          <div className="dash-section-title">Encuesta de intake</div>
        </div>
        <div className="dash-section-body">
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300, fontSize: 13 }}>Cargando...</div>
        </div>
      </div>
    );
  }

  // No assignment yet
  if (!assignment) {
    return (
      <div className="dash-section">
        <div className="dash-section-head">
          <div className="dash-section-title">Encuesta de intake</div>
          <div className="dash-section-sub">Recopila informacion relevante del cliente</div>
        </div>
        <div className="dash-section-body">
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 12 }}>
            No hay encuesta asignada para este cliente.
          </div>
          {isNutritionist && (
            <button
              type="button"
              onClick={onAssign}
              style={{
                display: 'inline-block', fontSize: 13, fontWeight: 500,
                color: 'var(--nc-forest)', border: '1.5px dashed var(--nc-border)',
                borderRadius: 6, padding: '8px 16px', background: 'none',
                cursor: 'pointer',
              }}
            >
              + Asignar encuesta
            </button>
          )}
        </div>
      </div>
    );
  }

  // Calculate progress
  const total = assignment.responses.length;
  const answered = assignment.responses.filter((r) => {
    return (r.answer_text != null && r.answer_text !== '') ||
           r.answer_numeric != null ||
           (r.answer_file_url != null && r.answer_file_url !== '');
  }).length;
  const progressPercent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="dash-section">
      <div className="dash-section-head">
        <div className="dash-section-title">Encuesta de intake</div>
        <div className="dash-section-sub">
          Recopila informacion relevante del cliente
        </div>
      </div>
      <div className="dash-section-body">
        {/* Status row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <StatusBadge status={assignment.status} />
          <span style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300 }}>
            {answered}/{total} preguntas respondidas
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%', height: 6, background: 'var(--nc-cream)',
          borderRadius: 3, overflow: 'hidden', marginBottom: 14,
        }}>
          <div style={{
            width: `${progressPercent}%`, height: '100%',
            background: assignment.status === 'reviewed' ? '#3b82f6' : 'var(--nc-forest)',
            borderRadius: 3, transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Client link to complete/view survey */}
          {!isNutritionist && assignment.status !== 'reviewed' && (
            <Link
              href={`/dashboard/survey/${relationshipId}`}
              style={{
                fontSize: 13, fontWeight: 500, color: 'white',
                background: 'var(--nc-forest)', borderRadius: 6,
                padding: '8px 16px', textDecoration: 'none',
              }}
            >
              {assignment.status === 'pending' ? 'Completar encuesta' : 'Editar respuestas'}
            </Link>
          )}

          {!isNutritionist && assignment.status === 'reviewed' && (
            <Link
              href={`/dashboard/survey/${relationshipId}`}
              style={{
                fontSize: 13, fontWeight: 500, color: 'var(--nc-forest)',
                border: '1px solid var(--nc-border)', borderRadius: 6,
                padding: '8px 16px', textDecoration: 'none',
              }}
            >
              Ver respuestas
            </Link>
          )}

          {/* Nutritionist actions */}
          {isNutritionist && (assignment.status === 'completed' || assignment.status === 'reviewed') && (
            <button
              type="button"
              onClick={onViewResponses}
              style={{
                fontSize: 13, fontWeight: 500, color: 'var(--nc-forest)',
                border: '1px solid var(--nc-border)', borderRadius: 6,
                padding: '8px 16px', background: 'white', cursor: 'pointer',
              }}
            >
              Ver respuestas
            </button>
          )}

          {isNutritionist && assignment.status === 'completed' && (
            <button
              type="button"
              onClick={onReview}
              style={{
                fontSize: 13, fontWeight: 500, color: 'white',
                background: 'var(--nc-forest)', borderRadius: 6,
                padding: '8px 16px', border: 'none', cursor: 'pointer',
              }}
            >
              Marcar como revisada
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
