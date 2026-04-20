'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { QuestionType, TemplateQuestion } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuestionDraft {
  key: string; // local key for React list
  question_text: string;
  question_type: QuestionType;
  options: unknown;
  is_required: boolean;
  display_order: number;
}

interface SurveyBuilderProps {
  initialTitle?: string;
  initialDescription?: string;
  initialQuestions?: TemplateQuestion[];
  onSave: (data: { title: string; description: string; questions: TemplateQuestion[] }) => Promise<void>;
  isEdit?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_text: 'Texto corto',
  long_text: 'Texto largo',
  multiple_choice: 'Opcion multiple',
  numeric_scale: 'Escala numerica',
  file_upload: 'Subida de archivo',
};

function generateKey(): string {
  return Math.random().toString(36).substring(2, 10);
}

function defaultOptions(type: QuestionType): unknown {
  switch (type) {
    case 'multiple_choice':
      return ['Opcion 1', 'Opcion 2'];
    case 'numeric_scale':
      return { min: 1, max: 10, label: '' };
    default:
      return null;
  }
}

function createEmptyQuestion(order: number): QuestionDraft {
  return {
    key: generateKey(),
    question_text: '',
    question_type: 'short_text',
    options: null,
    is_required: false,
    display_order: order,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MultipleChoiceEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (opts: string[]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--nc-stone)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Opciones
      </div>
      {options.map((opt, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="text"
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={`Opcion ${i + 1}`}
            style={{
              flex: 1, padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
              border: '1px solid var(--nc-border)', borderRadius: 6,
            }}
          />
          {options.length > 1 && (
            <button
              type="button"
              onClick={() => onChange(options.filter((_, j) => j !== i))}
              style={{
                fontSize: 12, color: '#cd5c5c', background: 'none', border: 'none',
                cursor: 'pointer', padding: '4px 8px',
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...options, `Opcion ${options.length + 1}`])}
        style={{
          alignSelf: 'flex-start', fontSize: 12, fontWeight: 500,
          color: 'var(--nc-forest)', background: 'none', border: '1px dashed var(--nc-border)',
          borderRadius: 6, padding: '4px 12px', cursor: 'pointer',
        }}
      >
        + Agregar opcion
      </button>
    </div>
  );
}

function NumericScaleEditor({
  options,
  onChange,
}: {
  options: { min: number; max: number; label: string };
  onChange: (opts: { min: number; max: number; label: string }) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--nc-stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Minimo
        </div>
        <input
          type="number"
          value={options.min}
          onChange={(e) => onChange({ ...options, min: Number(e.target.value) })}
          style={{
            width: 80, padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
            border: '1px solid var(--nc-border)', borderRadius: 6,
          }}
        />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--nc-stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Maximo
        </div>
        <input
          type="number"
          value={options.max}
          onChange={(e) => onChange({ ...options, max: Number(e.target.value) })}
          style={{
            width: 80, padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
            border: '1px solid var(--nc-border)', borderRadius: 6,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 150 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--nc-stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Etiqueta (opcional)
        </div>
        <input
          type="text"
          value={options.label}
          onChange={(e) => onChange({ ...options, label: e.target.value })}
          placeholder="Ej: Nivel de actividad"
          style={{
            width: '100%', padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
            border: '1px solid var(--nc-border)', borderRadius: 6,
          }}
        />
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  total,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  question: QuestionDraft;
  index: number;
  total: number;
  onUpdate: (q: QuestionDraft) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const handleTypeChange = (type: QuestionType) => {
    onUpdate({
      ...question,
      question_type: type,
      options: defaultOptions(type),
    });
  };

  return (
    <div style={{
      border: '1px solid var(--nc-border)', borderRadius: 8,
      padding: 16, background: 'white',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--nc-stone)' }}>
          Pregunta {index + 1}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            style={{
              fontSize: 14, padding: '2px 8px', background: 'none',
              border: '1px solid var(--nc-border)', borderRadius: 4,
              cursor: index === 0 ? 'not-allowed' : 'pointer',
              opacity: index === 0 ? 0.3 : 1,
              color: 'var(--nc-stone)',
            }}
          >
            &uarr;
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            style={{
              fontSize: 14, padding: '2px 8px', background: 'none',
              border: '1px solid var(--nc-border)', borderRadius: 4,
              cursor: index === total - 1 ? 'not-allowed' : 'pointer',
              opacity: index === total - 1 ? 0.3 : 1,
              color: 'var(--nc-stone)',
            }}
          >
            &darr;
          </button>
          <button
            type="button"
            onClick={onDelete}
            style={{
              fontSize: 12, padding: '2px 10px', background: 'none',
              border: '1px solid rgba(205,92,92,0.3)', borderRadius: 4,
              cursor: 'pointer', color: '#cd5c5c',
            }}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Question text */}
      <input
        type="text"
        value={question.question_text}
        onChange={(e) => onUpdate({ ...question, question_text: e.target.value })}
        placeholder="Escribe la pregunta..."
        style={{
          width: '100%', padding: '8px 12px', fontSize: 13, fontFamily: 'inherit',
          border: '1px solid var(--nc-border)', borderRadius: 6, marginBottom: 10,
        }}
      />

      {/* Type selector + required checkbox */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 200 }}>
          <Select
            value={question.question_type}
            onValueChange={(val) => handleTypeChange(val as QuestionType)}
          >
            <SelectTrigger style={{ height: 36, fontSize: 13 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Checkbox
            id={`required-${question.key}`}
            checked={question.is_required}
            onCheckedChange={(checked) =>
              onUpdate({ ...question, is_required: checked === true })
            }
          />
          <Label
            htmlFor={`required-${question.key}`}
            style={{ fontSize: 12, fontWeight: 400, color: 'var(--nc-stone)', cursor: 'pointer' }}
          >
            Obligatoria
          </Label>
        </div>
      </div>

      {/* Type-specific options */}
      {question.question_type === 'multiple_choice' && (
        <MultipleChoiceEditor
          options={Array.isArray(question.options) ? question.options : ['Opcion 1', 'Opcion 2']}
          onChange={(opts) => onUpdate({ ...question, options: opts })}
        />
      )}

      {question.question_type === 'numeric_scale' && (
        <NumericScaleEditor
          options={
            question.options && typeof question.options === 'object' && !Array.isArray(question.options)
              ? (question.options as { min: number; max: number; label: string })
              : { min: 1, max: 10, label: '' }
          }
          onChange={(opts) => onUpdate({ ...question, options: opts })}
        />
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SurveyBuilder({
  initialTitle = '',
  initialDescription = '',
  initialQuestions = [],
  onSave,
  isEdit = false,
}: SurveyBuilderProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [questions, setQuestions] = useState<QuestionDraft[]>(() =>
    initialQuestions.length > 0
      ? initialQuestions.map((q, i) => ({
          key: generateKey(),
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          is_required: q.is_required,
          display_order: q.display_order || i + 1,
        }))
      : [createEmptyQuestion(1)],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = useCallback((index: number, updated: QuestionDraft) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? updated : q)));
  }, []);

  const deleteQuestion = useCallback((index: number) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.map((q, i) => ({ ...q, display_order: i + 1 }));
    });
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createEmptyQuestion(prev.length + 1)]);
  }, []);

  const moveQuestion = useCallback((from: number, to: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next.map((q, i) => ({ ...q, display_order: i + 1 }));
    });
  }, []);

  const handleSubmit = async () => {
    setError(null);

    // Validate
    if (!title.trim()) {
      setError('El titulo es obligatorio');
      return;
    }

    if (questions.length === 0) {
      setError('Necesitas al menos una pregunta');
      return;
    }

    const emptyQuestions = questions.filter((q) => !q.question_text.trim());
    if (emptyQuestions.length > 0) {
      setError('Todas las preguntas deben tener texto');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q) => ({
          question_text: q.question_text.trim(),
          question_type: q.question_type,
          options: q.options,
          is_required: q.is_required,
          display_order: q.display_order,
        })),
      };
      await onSave(payload);
      router.push('/dashboard/surveys');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar la encuesta');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Info box */}
      <div style={{
        background: 'rgba(74,124,89,0.06)', border: '1px solid rgba(74,124,89,0.15)',
        borderRadius: 8, padding: '12px 16px', marginBottom: 24,
        fontSize: 13, color: 'var(--nc-ink)', fontWeight: 300, lineHeight: 1.5,
      }}>
        Recuerda que la informacion basica del cliente (peso, altura, nivel de actividad, etc.)
        ya se recopila en su perfil de cliente. Usa esta encuesta para preguntas adicionales
        especificas a tu metodo de trabajo.
      </div>

      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--nc-ink)',
          marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Titulo de la encuesta
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Encuesta inicial de habitos alimenticios"
          maxLength={200}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit',
            border: '1px solid var(--nc-border)', borderRadius: 6,
          }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: 24 }}>
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--nc-ink)',
          marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Descripcion (opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descripcion de lo que preguntas en esta encuesta..."
          rows={3}
          maxLength={1000}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 13, fontFamily: 'inherit',
            border: '1px solid var(--nc-border)', borderRadius: 6, resize: 'vertical',
          }}
        />
      </div>

      {/* Questions */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: 'var(--nc-ink)',
          marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Preguntas ({questions.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {questions.map((q, i) => (
            <QuestionCard
              key={q.key}
              question={q}
              index={i}
              total={questions.length}
              onUpdate={(updated) => updateQuestion(i, updated)}
              onDelete={() => deleteQuestion(i)}
              onMoveUp={() => moveQuestion(i, i - 1)}
              onMoveDown={() => moveQuestion(i, i + 1)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          style={{
            marginTop: 12, fontSize: 13, fontWeight: 500,
            color: 'var(--nc-forest)', border: '1.5px dashed var(--nc-border)',
            borderRadius: 6, padding: '10px 16px', background: 'none',
            cursor: 'pointer', width: '100%',
          }}
        >
          + Agregar pregunta
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(205,92,92,0.1)', border: '1px solid rgba(205,92,92,0.2)',
          borderRadius: 6, padding: 12, marginBottom: 16,
          fontSize: 13, color: '#cd5c5c',
        }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          style={{
            padding: '10px 24px', fontSize: 13, fontWeight: 500,
            color: 'white', background: 'var(--nc-forest)',
            border: 'none', borderRadius: 6,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          {isSaving
            ? 'Guardando...'
            : isEdit
              ? 'Guardar cambios'
              : 'Crear encuesta'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/surveys')}
          disabled={isSaving}
          style={{
            padding: '10px 24px', fontSize: 13, fontWeight: 500,
            color: 'var(--nc-stone)', background: 'white',
            border: '1px solid var(--nc-border)', borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
