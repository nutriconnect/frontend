'use client';

import type { QuestionType } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionRendererProps {
  questionText: string;
  questionType: QuestionType;
  options: unknown;
  isRequired: boolean;
  answerText: string | null;
  answerNumeric: number | null;
  answerFileUrl: string | null;
  onChange: (answer: { text?: string | null; numeric?: number | null; fileUrl?: string | null }) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({
  questionText,
  questionType,
  options,
  isRequired,
  answerText,
  answerNumeric,
  answerFileUrl,
  onChange,
  disabled = false,
}: QuestionRendererProps) {
  return (
    <div style={{
      border: '1px solid var(--nc-border)', borderRadius: 8,
      padding: 16, background: 'white',
    }}>
      <div style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--nc-ink)' }}>
          {questionText}
        </span>
        {isRequired && (
          <span style={{ color: '#cd5c5c', marginLeft: 4, fontSize: 14 }}>*</span>
        )}
      </div>

      {questionType === 'short_text' && (
        <input
          type="text"
          value={answerText ?? ''}
          onChange={(e) => onChange({ text: e.target.value || null })}
          disabled={disabled}
          placeholder="Tu respuesta..."
          style={{
            width: '100%', padding: '8px 12px', fontSize: 13, fontFamily: 'inherit',
            border: '1px solid var(--nc-border)', borderRadius: 6,
            background: disabled ? 'var(--nc-cream)' : 'white',
          }}
        />
      )}

      {questionType === 'long_text' && (
        <textarea
          value={answerText ?? ''}
          onChange={(e) => onChange({ text: e.target.value || null })}
          disabled={disabled}
          placeholder="Tu respuesta..."
          rows={4}
          style={{
            width: '100%', padding: '8px 12px', fontSize: 13, fontFamily: 'inherit',
            border: '1px solid var(--nc-border)', borderRadius: 6, resize: 'vertical',
            background: disabled ? 'var(--nc-cream)' : 'white',
          }}
        />
      )}

      {questionType === 'multiple_choice' && (() => {
        const choices = Array.isArray(options) ? (options as string[]) : [];
        return (
          <RadioGroup
            value={answerText ?? ''}
            onValueChange={(val) => onChange({ text: val || null })}
            disabled={disabled}
          >
            {choices.map((choice, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RadioGroupItem value={choice} id={`choice-${i}`} />
                <Label
                  htmlFor={`choice-${i}`}
                  style={{ fontSize: 13, fontWeight: 400, color: 'var(--nc-ink)', cursor: disabled ? 'default' : 'pointer' }}
                >
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      })()}

      {questionType === 'numeric_scale' && (() => {
        const scaleOpts = (options && typeof options === 'object' && !Array.isArray(options))
          ? (options as { min: number; max: number; label?: string })
          : { min: 1, max: 10 };
        const min = scaleOpts.min ?? 1;
        const max = scaleOpts.max ?? 10;
        const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

        return (
          <div>
            {scaleOpts.label && (
              <div style={{ fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 8 }}>
                {scaleOpts.label}
              </div>
            )}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {values.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => !disabled && onChange({ numeric: val })}
                  disabled={disabled}
                  style={{
                    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 500, borderRadius: 6,
                    border: answerNumeric === val
                      ? '2px solid var(--nc-forest)'
                      : '1px solid var(--nc-border)',
                    background: answerNumeric === val ? 'rgba(74,124,89,0.1)' : 'white',
                    color: answerNumeric === val ? 'var(--nc-forest)' : 'var(--nc-ink)',
                    cursor: disabled ? 'default' : 'pointer',
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--nc-stone)' }}>
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
        );
      })()}

      {questionType === 'file_upload' && (
        <div>
          {answerFileUrl ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', background: 'var(--nc-cream)',
              border: '1px solid var(--nc-border)', borderRadius: 6,
            }}>
              <span style={{ fontSize: 13, color: 'var(--nc-ink)', fontWeight: 300, flex: 1 }}>
                Archivo subido
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onChange({ fileUrl: null })}
                  style={{
                    fontSize: 12, color: '#cd5c5c', background: 'none',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  Eliminar
                </button>
              )}
            </div>
          ) : (
            <div style={{
              padding: '20px 16px', textAlign: 'center',
              border: '1.5px dashed var(--nc-border)', borderRadius: 6,
              fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300,
            }}>
              Subida de archivos disponible proximamente
            </div>
          )}
        </div>
      )}
    </div>
  );
}
