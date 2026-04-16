'use client';
// frontend/app/dashboard/my-recipes/new/page.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';
import { createRecipe, updateRecipe } from '@/lib/recipes';
import type { RecipePayload } from '@/lib/recipes';

export default function NewRecipePage() {
  const router = useRouter();
  const [autoSavedId, setAutoSavedId] = useState<string | null>(null);

  const handleAutoSave = async (payload: RecipePayload): Promise<{ id: string }> => {
    const result = await createRecipe(payload);
    setAutoSavedId(result.id);
    return result;
  };

  const handleSubmit = async (payload: RecipePayload) => {
    if (autoSavedId) {
      // Recipe was auto-saved during photo upload - update it
      await updateRecipe(autoSavedId, payload);
      router.push(`/dashboard/my-recipes/${autoSavedId}`);
    } else {
      // Normal creation flow
      const result = await createRecipe(payload);
      router.push(`/dashboard/my-recipes/${result.id}`);
    }
  };

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-topbar-title">Nueva receta</div>
      </div>
      <div className="dash-content">
        <RecipeForm
          onSubmit={handleSubmit}
          onAutoSave={handleAutoSave}
          submitLabel="Crear receta"
        />
      </div>
    </>
  );
}
