-- Saved Souls – Vrijwilliger onboarding: tabel + storage voor formulier en documenten
-- Draai na 20250301_profiles_portal.sql

-- 1. Tabel volunteer_onboarding (één rij per gebruiker)
CREATE TABLE IF NOT EXISTS volunteer_onboarding (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  voornaam text,
  achternaam text,
  email text,
  phone text,
  city text,
  area text,
  motivation text,
  call_preference text,
  language text,
  step integer NOT NULL DEFAULT 1 CHECK (step >= 1 AND step <= 4),
  id_doc_paths text[] DEFAULT '{}',
  vog_doc_paths text[] DEFAULT '{}',
  certs_doc_paths text[] DEFAULT '{}',
  extra_doc_paths text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE volunteer_onboarding IS 'Vrijwilligers-onboarding: formuliergegevens en paden naar geüploade documenten (Storage).';

-- 2. RLS
ALTER TABLE volunteer_onboarding ENABLE ROW LEVEL SECURITY;

-- Eigen rij lezen/schrijven
CREATE POLICY volunteer_onboarding_select_own ON volunteer_onboarding
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY volunteer_onboarding_insert_own ON volunteer_onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY volunteer_onboarding_update_own ON volunteer_onboarding
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin mag alles zien (zelfde rol-check als profiles)
CREATE POLICY volunteer_onboarding_admin_all ON volunteer_onboarding
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 3. updated_at trigger
CREATE OR REPLACE FUNCTION volunteer_onboarding_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS volunteer_onboarding_updated_at ON volunteer_onboarding;
CREATE TRIGGER volunteer_onboarding_updated_at
  BEFORE UPDATE ON volunteer_onboarding
  FOR EACH ROW EXECUTE FUNCTION volunteer_onboarding_updated_at();

-- 4. Storage bucket: maak handmatig in Dashboard → Storage → New bucket
--    Naam: volunteer-docs, Private, max 10 MB, MIME: application/pdf
--    Daarna gelden de onderstaande policies.

-- 5. Storage RLS: gebruiker mag alleen in eigen map (user_id) uploaden/lezen/verwijderen
-- Padconventie: {user_id}/id/..., {user_id}/vog/..., {user_id}/certs/..., {user_id}/extra/...
CREATE POLICY volunteer_docs_insert_own ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'volunteer-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY volunteer_docs_select_own ON storage.objects
  FOR SELECT USING (
    bucket_id = 'volunteer-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY volunteer_docs_update_own ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'volunteer-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY volunteer_docs_delete_own ON storage.objects
  FOR DELETE USING (
    bucket_id = 'volunteer-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin mag alle objecten in volunteer-docs zien
CREATE POLICY volunteer_docs_admin_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'volunteer-docs'
    AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
