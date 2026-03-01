-- Extra dieren per aanvraag + adoptant mag eigen aanvragen zien in portaal
-- Run in Supabase SQL Editor.

-- 1. Optioneel 2e/3e dier per aanvraag (optioneel)
ALTER TABLE adoption_applications
  ADD COLUMN IF NOT EXISTS extra_animals jsonb DEFAULT '[]';
COMMENT ON COLUMN adoption_applications.extra_animals IS 'Optionele extra dieren: [{"animalName":"...","animalId":"..."}, ...]';

-- 2. Adoptant kan eigen aanvragen lezen (koppeling op e-mail met profiel)
-- Gebruiker ziet alleen rijen waar adoption_applications.email = eigen e-mail (uit profiles).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'adoption_applications' AND policyname = 'Adoptant leest eigen aanvragen'
  ) THEN
    CREATE POLICY "Adoptant leest eigen aanvragen"
    ON adoption_applications FOR SELECT
    USING (
      email = (SELECT p.email FROM profiles p WHERE p.id = auth.uid())
    );
  END IF;
END $$;
