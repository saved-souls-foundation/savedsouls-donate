-- Social media planner: geplande berichten (admin-only).
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'youtube', 'reddit', 'x')),
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  scheduled_at timestamptz,
  campaign_label text,
  status text NOT NULL DEFAULT 'concept' CHECK (status IN ('concept', 'gepland', 'geplaatst', 'mislukt')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE scheduled_posts IS 'Geplande sociale media berichten; admin-only.';

CREATE INDEX IF NOT EXISTS scheduled_posts_scheduled_at_idx ON scheduled_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS scheduled_posts_platform_idx ON scheduled_posts(platform);
CREATE INDEX IF NOT EXISTS scheduled_posts_status_idx ON scheduled_posts(status);

ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY scheduled_posts_admin_all ON scheduled_posts
  FOR ALL USING (public.is_admin());
