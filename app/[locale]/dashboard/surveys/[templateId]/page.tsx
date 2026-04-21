'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import SurveyBuilder from '@/components/survey/SurveyBuilder';
import { useSurveyTemplate, updateSurveyTemplate } from '@/lib/survey';
import type { TemplateQuestion } from '@/lib/types';

export default function EditSurveyTemplatePage() {
  const params = useParams<{ templateId: string }>();
  const templateId = params.templateId;
  const { template, isLoading, error } = useSurveyTemplate(templateId);

  const handleSave = async (data: { title: string; description: string; questions: TemplateQuestion[] }) => {
    await updateSurveyTemplate(templateId, data);
  };

  return (
    <>
      <div className="dash-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/dashboard/surveys"
            style={{ fontSize: 13, color: 'var(--nc-stone)', textDecoration: 'none' }}
          >
            &larr; Encuestas
          </Link>
          <div className="dash-topbar-title">
            {isLoading ? '...' : (template?.title ?? 'Editar encuesta')}
          </div>
        </div>
      </div>
      <div className="dash-content">
        {isLoading && (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300, fontSize: 13 }}>Cargando...</div>
        )}

        {error && (
          <div style={{
            background: 'rgba(205,92,92,0.1)', border: '1px solid rgba(205,92,92,0.2)',
            borderRadius: 6, padding: 12, fontSize: 13, color: '#cd5c5c',
          }}>
            Error al cargar la encuesta.
          </div>
        )}

        {!isLoading && template && (
          <SurveyBuilder
            initialTitle={template.title}
            initialDescription={template.description}
            initialQuestions={template.questions}
            onSave={handleSave}
            isEdit
          />
        )}

        {!isLoading && !template && !error && (
          <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300 }}>
            Encuesta no encontrada.
          </div>
        )}
      </div>
    </>
  );
}
