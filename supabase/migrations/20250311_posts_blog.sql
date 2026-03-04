-- Blog posts table (website blog + Facebook sync).
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  body text,
  body_en text,
  body_th text,
  category text DEFAULT 'nieuws',
  status text DEFAULT 'concept',
  source text DEFAULT 'manual',
  slug text,
  meta_description text,
  facebook_post_id text UNIQUE,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts(published_at);
CREATE INDEX IF NOT EXISTS posts_facebook_post_id_idx ON posts(facebook_post_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_admin_all ON posts
  FOR ALL
  USING (public.is_admin());

COMMENT ON TABLE posts IS 'Blog posts (manual + Facebook webhook sync); admin-only.';

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
