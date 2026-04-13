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
  tier: 'free' | 'pro' | 'premium';
  stripe_subscription_id: string;
  intro_consultation_required: boolean;
  accepting_new_clients: boolean;
  at_capacity: boolean;
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
  billing_type: 'one_time' | 'monthly';
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
  accepting_new_clients: boolean;
  at_capacity: boolean;
}

export interface ProfileListResponse {
  profiles: ProfileSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface ClientProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  city: string;
  birth_date: string | null;
  height_cm: number | null;
  activity_level: string;
  goals: string[];
  dietary_restrictions: string[];
  allergies: string[];
  created_at: string;
  updated_at: string;
}

export interface WeightEntry {
  id: string;
  user_id: string;
  weight_kg: number;
  recorded_at: string;
  created_at: string;
}

export interface ActivityEntry {
  id: string;
  user_id: string;
  activity_type: string;
  duration_minutes: number;
  recorded_at: string;
  created_at: string;
}

export interface Relationship {
  id: string;
  client_id: string;
  nutritionist_id: string;
  package_id: string;
  status: 'pending_intro' | 'active' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ClientRelationshipView {
  id: string;
  client_id: string;
  nutritionist_id: string;
  package_id: string;
  status: 'pending_intro' | 'active' | 'cancelled';
  client_display_name: string;
  client_email: string;
  created_at: string;
  updated_at: string;
}

export interface NutritionistRelationshipView {
  id: string;
  client_id: string;
  nutritionist_id: string;
  package_id: string;
  status: 'pending_intro' | 'active' | 'cancelled';
  nutritionist_display_name: string;
  nutritionist_slug: string;
  nutritionist_bio: string;
  nutritionist_city: string;
  nutritionist_specialties: string[];
  nutritionist_years_exp: number | null;
  nutritionist_tier: 'free' | 'pro' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntryView {
  id: string;
  client_id: string;
  client_display_name: string;
  created_at: string;
}
