// frontend/lib/types.ts

export interface NutritionistProfile {
  id: string;
  user_id: string;
  slug: string;
  display_name: string;
  bio: string;
  city: string;
  years_exp: number | null;
  specialties: string[];
  languages: string[];
  certifications: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  packages: ServicePackage[];
}

export interface ServicePackage {
  id: string;
  profile_id: string;
  name: string;
  description: string;
  price_cents: number;
  sessions: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileSummary {
  id: string;
  slug: string;
  display_name: string;
  city: string;
  years_exp: number | null;
  specialties: string[];
  languages: string[];
  lowest_price_cents: number | null;
}

export interface ProfileListResponse {
  profiles: ProfileSummary[];
  total: number;
  page: number;
  limit: number;
}
