-- Newsletter templates: pre-written templates for the compose page (nl + en)
CREATE TABLE IF NOT EXISTS newsletter_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titel text NOT NULL,
  subject_nl text NOT NULL,
  subject_en text NOT NULL,
  body_nl text NOT NULL,
  body_en text NOT NULL,
  volgorde smallint NOT NULL DEFAULT 0,
  UNIQUE(volgorde)
);

COMMENT ON TABLE newsletter_templates IS 'Pre-written newsletter templates for admin compose (load sample).';

ALTER TABLE newsletter_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY newsletter_templates_admin_all ON newsletter_templates
  FOR ALL USING (public.is_admin());

-- Newsletter drafts: optional saved drafts (admin only)
CREATE TABLE IF NOT EXISTS newsletter_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titel text,
  subject_nl text,
  subject_en text,
  body_nl text,
  body_en text,
  aangemaakt_op timestamptz NOT NULL DEFAULT now(),
  aangemaakt_door uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE newsletter_drafts IS 'Saved newsletter drafts; admin only.';

ALTER TABLE newsletter_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY newsletter_drafts_admin_all ON newsletter_drafts
  FOR ALL USING (public.is_admin());
