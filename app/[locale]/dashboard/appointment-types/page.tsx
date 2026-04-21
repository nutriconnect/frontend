'use client';
// frontend/app/dashboard/appointment-types/page.tsx

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useAppointmentTypes, createAppointmentType, updateAppointmentType, deleteAppointmentType } from '@/lib/calendar';
import type { AppointmentType } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AppointmentTypesPage() {
  const { user } = useAuth();
  const { types, isLoading, mutate } = useAppointmentTypes();

  // Nutritionist-only page
  if (user?.role !== 'nutritionist') {
    return null;
  }
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);

  const [name, setName] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const openCreateDialog = () => {
    setEditingType(null);
    setName('');
    setDurationMinutes(30);
    setDescription('');
    setError('');
    setDialogOpen(true);
  };

  const openEditDialog = (type: AppointmentType) => {
    setEditingType(type);
    setName(type.name);
    setDurationMinutes(type.duration_minutes);
    setDescription(type.description);
    setError('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (durationMinutes < 1 || durationMinutes > 240) {
      setError('La duración debe estar entre 1 y 240 minutos');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingType) {
        await updateAppointmentType(editingType.id, {
          name: name.trim(),
          duration_minutes: durationMinutes,
          description: description.trim(),
          video_link: '',
        });
      } else {
        await createAppointmentType({
          name: name.trim(),
          duration_minutes: durationMinutes,
          description: description.trim(),
          video_link: '',
        });
      }
      setDialogOpen(false);
      await mutate();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el tipo de cita');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (typeId: string, typeName: string) => {
    if (!confirm(`¿Eliminar el tipo de cita "${typeName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteAppointmentType(typeId);
      await mutate();
    } catch (err: any) {
      alert(err?.message ?? 'Error al eliminar el tipo de cita.');
    }
  };

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Tipos de citas</div>
        <div className="dash-topbar-right">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={openCreateDialog} className="dash-btn-publish">
                + Nuevo tipo de cita
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingType ? 'Editar tipo de cita' : 'Nuevo tipo de cita'}</DialogTitle>
                <DialogDescription>
                  Define los tipos de citas que ofreces a tus clientes.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
                {error && (
                  <div
                    style={{
                      background: 'rgba(196,98,45,0.08)',
                      color: 'var(--nc-terra)',
                      padding: '12px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="dash-field">
                    <label className="dash-label">
                      Nombre <span style={{ color: 'var(--nc-terra)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="dash-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={200}
                      placeholder="ej. Consulta inicial, Seguimiento mensual"
                      required
                    />
                  </div>

                  <div className="dash-field">
                    <label className="dash-label">
                      Duración (minutos) <span style={{ color: 'var(--nc-terra)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="dash-input"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                      min={1}
                      max={240}
                      required
                    />
                  </div>

                  <div className="dash-field">
                    <label className="dash-label">Descripción</label>
                    <textarea
                      className="dash-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={2000}
                      rows={3}
                      placeholder="Describe brevemente qué incluye esta cita..."
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="dash-btn-publish"
                    style={{ flex: 1 }}
                  >
                    {submitting ? 'Guardando...' : editingType ? 'Guardar cambios' : 'Crear tipo de cita'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className="dash-btn-plain"
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="dash-content">
        {isLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>Cargando tipos de citas...</div>
        ) : types.length === 0 ? (
          <div style={{
            background: 'var(--nc-forest-pale)',
            border: '1px solid rgba(26,51,41,0.12)',
            borderRadius: 10,
            padding: '32px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--nc-forest)', marginBottom: 8 }}>
              No hay tipos de citas configurados
            </div>
            <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300, marginBottom: 16 }}>
              Define los tipos de citas que ofreces para que tus clientes puedan agendar contigo.
            </div>
            <button onClick={openCreateDialog} className="dash-btn-publish">
              + Crear primer tipo de cita
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {types.map((type) => (
              <div
                key={type.id}
                style={{
                  background: 'white',
                  border: '1px solid var(--nc-border)',
                  borderRadius: 10,
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--nc-ink)', marginBottom: 4 }}>
                      {type.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--nc-stone)', fontWeight: 300 }}>
                      {type.duration_minutes} minutos
                    </div>
                  </div>
                </div>

                {type.description && (
                  <div style={{ fontSize: 13, color: 'var(--nc-stone)', lineHeight: 1.5 }}>
                    {type.description}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--nc-border)' }}>
                  <button
                    onClick={() => openEditDialog(type)}
                    className="dash-btn-plain"
                    style={{ flex: 1, fontSize: 13, padding: '8px 12px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(type.id, type.name)}
                    className="dash-btn-plain"
                    style={{ flex: 1, fontSize: 13, padding: '8px 12px', color: 'var(--nc-terra)' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
