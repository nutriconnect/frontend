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
    <div className="nc-container">
      <div className="nc-topbar">
        <h1 className="text-2xl font-bold">Mis ejercicios</h1>
        <button
          onClick={() => router.push('/dashboard/my-exercises/new')}
          className="nc-btn-primary"
        >
          Nuevo ejercicio
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Buscar ejercicios..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="dash-input flex-1"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ExerciseCategory | 'all')}
          className="dash-input w-48"
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500 py-12">Cargando ejercicios...</div>
      )}

      {error && (
        <div className="nc-card bg-red-50 border-red-200 text-red-700 p-4">
          Error al cargar ejercicios. Intenta de nuevo.
        </div>
      )}

      {isEmpty && !isFiltered && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aún no tienes ejercicios en tu biblioteca.</p>
          <button
            onClick={() => router.push('/dashboard/my-exercises/new')}
            className="nc-btn-primary"
          >
            Crear tu primer ejercicio
          </button>
        </div>
      )}

      {isEmpty && isFiltered && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron ejercicios con esos filtros.</p>
        </div>
      )}

      {!isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const primaryPhoto = template.photos.find(p => p.is_primary);
            return (
              <div
                key={template.id}
                onClick={() => router.push(`/dashboard/my-exercises/${template.id}`)}
                className="nc-card cursor-pointer hover:shadow-md transition-shadow"
              >
                {primaryPhoto ? (
                  <img
                    src={primaryPhoto.photo_url}
                    alt={template.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">◈</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${CATEGORY_COLORS[template.category]}`}>
                      {CATEGORY_LABELS[template.category]}
                    </span>
                  </div>
                  {template.muscle_groups && (
                    <p className="text-sm text-gray-600 truncate">{template.muscle_groups}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
