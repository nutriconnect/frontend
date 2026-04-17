'use client';
// frontend/app/dashboard/my-exercises/page.tsx

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { useExerciseTemplates } from '@/lib/exercise-templates';
import type { ExerciseCategory } from '@/lib/types';

const CATEGORY_LABELS: Record<ExerciseCategory | 'all', string> = {
  all: 'Todas',
  strength: 'Fuerza',
  cardio: 'Cardio',
  flexibility: 'Flexibilidad',
  balance: 'Equilibrio',
};

const CATEGORY_COLORS: Record<ExerciseCategory, string> = {
  strength: 'bg-green-100 text-green-800',
  cardio: 'bg-orange-100 text-orange-800',
  flexibility: 'bg-blue-100 text-blue-800',
  balance: 'bg-purple-100 text-purple-800',
};

export default function MyExercisesPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | 'all'>('all');
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const { templates, isLoading, error } = useExerciseTemplates(
    categoryFilter === 'all' ? undefined : categoryFilter,
    debouncedSearch,
  );

  const isEmpty = !isLoading && templates.length === 0;
  const isFiltered = debouncedSearch !== '' || categoryFilter !== 'all';

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Mis ejercicios</div>
        <div className="dash-topbar-right">
          <button onClick={() => router.push('/dashboard/my-exercises/new')} className="dash-btn-publish">
            Nuevo ejercicio
          </button>
        </div>
      </div>

      <div className="dash-content" style={{ maxWidth: 1200 }}>
        {/* Filters */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar ejercicios..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="dash-input"
            style={{ width: 280 }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ExerciseCategory | 'all')}
            className="dash-input"
            style={{ width: 180 }}
          >
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div style={{ color: 'var(--nc-stone)', fontWeight: 300 }}>Cargando ejercicios...</div>
        ) : error ? (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: 16,
              color: 'rgb(185,28,28)',
            }}
          >
            Error al cargar ejercicios. Intenta de nuevo.
          </div>
        ) : isEmpty && !isFiltered ? (
          <div
            style={{
              background: 'white',
              border: '1px solid rgba(139,115,85,0.12)',
              borderRadius: 8,
              padding: 48,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: 'var(--nc-stone)',
                fontWeight: 300,
                marginBottom: 16,
              }}
            >
              Aún no tienes ejercicios en tu biblioteca.
            </div>
            <button onClick={() => router.push('/dashboard/my-exercises/new')} className="dash-btn-publish">
              Crear tu primer ejercicio
            </button>
          </div>
        ) : isEmpty && isFiltered ? (
          <div
            style={{
              background: 'white',
              border: '1px solid rgba(139,115,85,0.12)',
              borderRadius: 8,
              padding: 48,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, color: 'var(--nc-stone)', fontWeight: 300 }}>
              No se encontraron ejercicios con esos filtros.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {templates.map((template) => {
              const primaryPhoto = template.photos.find(p => p.is_primary);
              return (
                <div
                  key={template.id}
                  onClick={() => router.push(`/dashboard/my-exercises/${template.id}`)}
                  style={{
                    background: 'white',
                    border: '1px solid rgba(139,115,85,0.12)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {primaryPhoto ? (
                    <img
                      src={primaryPhoto.photo_url}
                      alt={template.name}
                      style={{ width: '100%', height: 192, objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: 192,
                        background:
                          template.category === 'strength' ? '#f0fdf4' :
                          template.category === 'cardio' ? '#fff7ed' :
                          template.category === 'flexibility' ? '#eff6ff' :
                          '#faf5ff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="40" cy="26" r="16" fill="rgba(139,115,85,0.12)" />
                        <rect x="35" y="42" width="10" height="22" rx="1" fill="rgba(139,115,85,0.12)" />
                        <rect x="27" y="48" width="8" height="3" rx="1" fill="rgba(139,115,85,0.12)" />
                        <rect x="45" y="48" width="8" height="3" rx="1" fill="rgba(139,115,85,0.12)" />
                        <circle cx="36" cy="24" r="2" fill="rgba(139,115,85,0.25)" />
                        <circle cx="44" cy="24" r="2" fill="rgba(139,115,85,0.25)" />
                        <path d="M 35 30 Q 40 34 45 30" stroke="rgba(139,115,85,0.25)" strokeWidth="1.5" fill="none" />
                      </svg>
                      <div style={{ fontSize: 11, color: 'rgba(139,115,85,0.4)', fontWeight: 300 }}>
                        Sin foto
                      </div>
                    </div>
                  )}
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h3 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>{template.name}</h3>
                      <span
                        style={{
                          fontSize: 12,
                          padding: '4px 8px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                          ...(template.category === 'strength' && { background: '#dcfce7', color: '#166534' }),
                          ...(template.category === 'cardio' && { background: '#fed7aa', color: '#9a3412' }),
                          ...(template.category === 'flexibility' && { background: '#dbeafe', color: '#1e40af' }),
                          ...(template.category === 'balance' && { background: '#e9d5ff', color: '#6b21a8' }),
                        }}
                      >
                        {CATEGORY_LABELS[template.category]}
                      </span>
                    </div>
                    {template.muscle_groups && (
                      <p
                        style={{
                          fontSize: 14,
                          color: '#6b7280',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {template.muscle_groups}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
