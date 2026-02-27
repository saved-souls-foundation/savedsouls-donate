-- Saved Souls – Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Zet eerst Auth in: Authentication → Providers → Email: Enable, "Confirm email" uit indien gewenst.

-- Profielen (koppeling aan Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  user_type TEXT CHECK (user_type IN ('adopt', 'volunteer', 'sponsor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voortgang per user (voor dashboard-thermometer)
CREATE TABLE IF NOT EXISTS adoption_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  application_id TEXT,
  step INT DEFAULT 1,
  status JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS volunteer_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  application_id TEXT,
  todos JSONB,
  documents_submitted JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsor_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mollie_customer_id TEXT,
  total_amount_cents INT DEFAULT 0,
  animals JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aanvragen (formulierdata) – voor admin-overzicht en opslaan bij adopt/volunteer
CREATE TABLE IF NOT EXISTS adoption_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  experience TEXT NOT NULL,
  about TEXT NOT NULL,
  animal_name TEXT,
  animal_id TEXT,
  step INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  dates TEXT,
  experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  step INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optioneel: trigger om bij signup automatisch een profiel aan te maken
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type)
  VALUES (NEW.id, NEW.email, NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: anon/service role mag lezen/schrijven waar de app dat nodig heeft.
-- Admin en API gebruiken service_role (bypass RLS). Voor dashboard-login gebruik je anon + Auth.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Gebruikers mogen alleen eigen profiel zien
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Service role (backend) bypassed RLS; anon mag alleen wat Auth toestaat.
-- Geen extra policies voor adoption_applications/volunteer_applications: alleen service_role schrijft/leest (admin API).
