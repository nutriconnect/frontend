'use client';

import useSWR from 'swr';
import { api, ApiRequestError } from './api';

export interface AuthUser {
  id: string;
  email: string;
  role: 'client' | 'nutritionist';
  email_verified: boolean;
}

async function fetchMe(): Promise<AuthUser | null> {
  try {
    return await api.get<AuthUser>('/auth/me');
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) return null;
    throw err;
  }
}

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<AuthUser | null>(
    '/auth/me',
    fetchMe,
    { revalidateOnFocus: false },
  );
  return {
    user: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
