'use client';
// frontend/app/dashboard/my-exercises/new/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createExerciseTemplate } from '@/lib/exercise-templates';
import type { ExerciseCategory } from '@/lib/types';

const CATEGORY_OPTIONS: { value: ExerciseCategory; label: string }[] = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibilidad' },
  { value: 'balance', label: 'Equilibrio' },
];

export default function NewExercisePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('strength');
  const [muscleGroups, setMuscleGroups] = useState('');
  const [equipment, setEquipment] = useState('');
  const [instructions, setInstructions] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createExerciseTemplate({
        name: name.trim(),
        description: description.trim(),
        category,
        muscle_groups: muscleGroups.trim(),
        equipment: equipment.trim(),
        instructions: instructions.trim(),
        demo_video_url: demoVideoUrl.trim() || null,
      });
      router.push(`/dashboard/my-exercises/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Error al crear ejercicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Nuevo ejercicio</div>
        <div className="dash-topbar-right">
          <button onClick={() => router.back()} className="dash-btn-plain">
            Cancelar
          </button>
        </div>
      </div>

      <div className="dash-content">
        <form onSubmit={handleSubmit} style={{ maxWidth: 820 }}>
          {error && (
            <div
              style={{
                background: 'rgba(196,98,45,0.08)',
                color: 'var(--nc-terra)',
                padding: '12px 16px',
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <div className="dash-section">
            <div className="dash-section-head">
              <div className="dash-section-title">Información básica</div>
            </div>
            <div className="dash-section-body">
              <div className="dash-row single">
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
                    required
                  />
                </div>
              </div>

              <div className="dash-row single">
                <div className="dash-field">
                  <label className="dash-label">Descripción</label>
                  <textarea
                    className="dash-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    placeholder="Breve descripción del ejercicio..."
                  />
                </div>
              </div>

              <div className="dash-row">
                <div className="dash-field">
                  <label className="dash-label">
                    Categoría <span style={{ color: 'var(--nc-terra)' }}>*</span>
                  </label>
                  <select
                    className="dash-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
                    required
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="dash-row">
                <div className="dash-field">
                  <label className="dash-label">Grupos musculares</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={muscleGroups}
                    onChange={(e) => setMuscleGroups(e.target.value)}
                    maxLength={500}
                    placeholder="ej. Pectorales, Tríceps, Core"
                  />
                </div>
                <div className="dash-field">
                  <label className="dash-label">Equipamiento</label>
                  <input
                    type="text"
                    className="dash-input"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    maxLength={500}
                    placeholder="ej. Barra, Banco plano"
                  />
                </div>
              </div>

              <div className="dash-row single">
                <div className="dash-field">
                  <label className="dash-label">Instrucciones</label>
                  <textarea
                    className="dash-textarea"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    maxLength={5000}
                    rows={6}
                    placeholder="Instrucciones paso a paso..."
                  />
                </div>
              </div>

              <div className="dash-row single">
                <div className="dash-field">
                  <label className="dash-label">URL de video de demostración</label>
                  <input
                    type="url"
                    className="dash-input"
                    value={demoVideoUrl}
                    onChange={(e) => setDemoVideoUrl(e.target.value)}
                    maxLength={500}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button type="submit" disabled={loading} className="dash-btn-publish" style={{ flex: 1 }}>
              {loading ? 'Guardando...' : 'Guardar ejercicio'}
            </button>
            <button type="button" onClick={() => router.back()} className="dash-btn-plain" style={{ flex: 1 }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
