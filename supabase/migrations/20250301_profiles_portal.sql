-- Saved Souls – Portal: extend profiles for role, steps, notes
-- Run in Supabase SQL Editor. Realtime: enable in Dashboard → Database → Replication → profiles.

-- 1. Add new columns to profiles (keep existing id, email for backward compatibility)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS voornaam text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS achternaam text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS huidige_stap integer DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notities text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aangemeld_op timestamptz DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Constrain role if not already present (optional: add check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'profiles' AND constraint_name LIKE 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
      CHECK (role IS NULL OR role IN ('vrijwilliger', 'adoptant', 'admin'));
  END IF;
END $$;

-- Migrate existing user_type to role where applicable
UPDATE profiles
SET role = CASE
  WHEN user_type = 'adopt' THEN 'adoptant'
  WHEN user_type = 'volunteer' THEN 'vrijwilliger'
  ELSE role
END
WHERE user_type IN ('adopt', 'volunteer') AND (role IS NULL OR role = '');

-- 2. RLS is already enabled; add/update policies for portal and admin

-- Drop old policies if they exist (by name), so we can recreate
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- User reads own profile
CREATE POLICY "Gebruiker leest eigen profiel"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- User can update own profile (e.g. voornaam, achternaam)
CREATE POLICY "Gebruiker updatet eigen profiel"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admin reads all profiles (admin is identified by role = 'admin' on their own row)
CREATE POLICY "Admin leest alle profielen"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Admin updates all profiles
CREATE POLICY "Admin updatet alle profielen"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Allow insert for new signups (handle_new_user or app)
CREATE POLICY "Service of eigen insert"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Trigger to set updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Ensure handle_new_user creates row with new columns (role set by app on registration)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type, role, huidige_stap, aangemeld_op)
  VALUES (NEW.id, NEW.email, NULL, NULL, 1, now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Realtime: enable in Supabase Dashboard → Database → Replication → toggle "profiles"
