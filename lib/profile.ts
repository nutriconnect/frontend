'use client';

import useSWR from 'swr';
import { api, ApiRequestError } from './api';
import type { NutritionistProfile, ProfileListResponse } from './types';

// Hook for a nutritionist to read their own profile.
export function useMyProfile() {
  const { data, error, isLoading, mutate } = useSWR<NutritionistProfile | null>(
    '/profile/me',
    () => api.get<NutritionistProfile>('/profile/me').catch((err) => {
      if (err instanceof ApiRequestError && err.status === 404) return null;
      throw err;
    }),
    { revalidateOnFocus: false },
  );
  return { profile: data ?? null, isLoading, error, mutate };
}

// Hook for the public listing page.
export function usePublicProfiles(page = 1, limit = 20) {
  const { data, error, isLoading } = useSWR<ProfileListResponse>(
    `/nutritionists?page=${page}&limit=${limit}`,
    () => api.get<ProfileListResponse>(`/nutritionists?page=${page}&limit=${limit}`),
    { revalidateOnFocus: false },
  );
  return {
    profiles: data?.profiles ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
  };
}

// Hook for a public profile page by slug.
export function usePublicProfile(slug: string) {
  const { data, error, isLoading } = useSWR<NutritionistProfile | null>(
    `/nutritionists/${slug}`,
    () => api.get<NutritionistProfile>(`/nutritionists/${slug}`).catch((err) => {
      if (err instanceof ApiRequestError && err.status === 404) return null;
      throw err;
    }),
    { revalidateOnFocus: false },
  );
  return { profile: data ?? null, isLoading, error };
}
