'use client';

import Link from 'next/link';
import SurveyBuilder from '@/components/survey/SurveyBuilder';
import { createSurveyTemplate } from '@/lib/survey';
import type { TemplateQuestion } from '@/lib/types';

export default function NewSurveyTemplatePage() {
  const handleSave = async (data: { title: string; description: string; questions: TemplateQuestion[] }) => {
    await createSurveyTemplate(data);
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
          <div className="dash-topbar-title">Nueva encuesta</div>
        </div>
      </div>
      <div className="dash-content">
        <SurveyBuilder onSave={handleSave} />
      </div>
    </>
  );
}
