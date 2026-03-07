-- Welke dieren (externe API) zijn al in een blog-spotlight gebruikt (roulatie).
CREATE TABLE IF NOT EXISTS spotlight_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id text NOT NULL,
  animal_type text NOT NULL CHECK (animal_type IN ('dog', 'cat')),
  spotted_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS spotlight_log_animal_type_idx ON spotlight_log(animal_type);
CREATE INDEX IF NOT EXISTS spotlight_log_animal_id_type_idx ON spotlight_log(animal_id, animal_type);

COMMENT ON TABLE spotlight_log IS 'Log van dieren (externe API id) die al in een blog spotlight zijn gebruikt.';

-- posts.animal_id: van uuid (dieren.id) naar text voor externe API id (blog-generator gebruikt geen dieren meer).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'animal_id'
  ) THEN
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_animal_id_fkey;
    ALTER TABLE posts ALTER COLUMN animal_id TYPE text USING (animal_id::text);
  END IF;
END $$;
