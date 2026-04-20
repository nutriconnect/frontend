'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useSurveyTemplates, assignSurveyToRelationship } from '@/lib/survey';
import type { SurveyTemplateListItem } from '@/lib/types';

interface AssignSurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relationshipId: string;
  onAssigned: () => void;
}

export default function AssignSurveyModal({
  open,
  onOpenChange,
  relationshipId,
  onAssigned,
}: AssignSurveyModalProps) {
  const { templates, isLoading } = useSurveyTemplates(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!selectedId) return;

    setError(null);
    setIsAssigning(true);
    try {
      await assignSurveyToRelationship(selectedId, relationshipId);
      onAssigned();
      onOpenChange(false);
      setSelectedId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('already has a survey')) {
          setError('Este cliente ya tiene una encuesta asignada');
        } else {
          setError(err.message);
        }
      } else {
        setError('Error al asignar la encuesta');
      }
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar encuesta de intake</DialogTitle>
          <DialogDescription>
            Selecciona una de tus plantillas para asignarla a este cliente
          </DialogDescription>
        </DialogHeader>

        <div style={{ maxHeight: 320, overflow: 'auto', margin: '8px 0' }}>
          {isLoading && (
            <div style={{ color: 'var(--nc-stone)', fontWeight: 300, fontSize: 13, padding: 16 }}>
              Cargando plantillas...
            </div>
          )}

          {!isLoading && templates.length === 0 && (
            <div style={{
              padding: 16, textAlign: 'center', fontSize: 13,
              color: 'var(--nc-stone)', fontWeight: 300,
            }}>
              No tienes plantillas activas. Crea una en la seccion de encuestas.
            </div>
          )}

          {!isLoading && templates.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {templates.map((template: SurveyTemplateListItem) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedId(template.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 14px', textAlign: 'left',
                    border: selectedId === template.id
                      ? '2px solid var(--nc-forest)'
                      : '1px solid var(--nc-border)',
                    borderRadius: 8,
                    background: selectedId === template.id ? 'rgba(74,124,89,0.04)' : 'white',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--nc-ink)', marginBottom: 2 }}>
                      {template.title}
                    </div>
                    {template.description && (
                      <div style={{
                        fontSize: 12, color: 'var(--nc-stone)', fontWeight: 300,
                        display: '-webkit-box', WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {template.description}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--nc-stone)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                    {template.question_count} {template.question_count === 1 ? 'pregunta' : 'preguntas'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: 'rgba(205,92,92,0.1)', border: '1px solid rgba(205,92,92,0.2)',
            borderRadius: 6, padding: 10, fontSize: 13, color: '#cd5c5c',
          }}>
            {error}
          </div>
        )}

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500,
              color: 'var(--nc-stone)', background: 'white',
              border: '1px solid var(--nc-border)', borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedId || isAssigning}
            style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500,
              color: 'white', background: 'var(--nc-forest)',
              border: 'none', borderRadius: 6,
              cursor: (!selectedId || isAssigning) ? 'not-allowed' : 'pointer',
              opacity: (!selectedId || isAssigning) ? 0.6 : 1,
            }}
          >
            {isAssigning ? 'Asignando...' : 'Asignar encuesta'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
