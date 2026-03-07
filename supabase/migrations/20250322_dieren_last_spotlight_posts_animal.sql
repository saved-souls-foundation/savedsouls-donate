-- Voor blog spotlight generator: wanneer dier laatst in spotlight stond
ALTER TABLE dieren
  ADD COLUMN IF NOT EXISTS last_spotlight timestamptz;

-- Optioneel: koppel blogpost aan dier (voor spotlights)
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS animal_id uuid REFERENCES dieren(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS type text DEFAULT 'nieuws';

COMMENT ON COLUMN dieren.last_spotlight IS 'Laatste keer in blog spotlight gebruikt (voor roulatie).';
COMMENT ON COLUMN posts.animal_id IS 'Bij spotlight: welk dier.';
COMMENT ON COLUMN posts.type IS 'Type: nieuws, spotlight, etc.';
