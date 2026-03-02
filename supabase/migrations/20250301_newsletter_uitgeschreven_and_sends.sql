-- Newsletter: uitgeschreven_op on subscribers + newsletter_sends table
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS uitgeschreven_op timestamptz;

COMMENT ON COLUMN newsletter_subscribers.uitgeschreven_op IS 'When the subscriber unsubscribed (actief set to false).';

-- newsletter_sends: store each newsletter send for history
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_nl text,
  subject_en text,
  subject_es text,
  subject_ru text,
  subject_th text,
  subject_de text,
  subject_fr text,
  body_nl text,
  body_en text,
  body_es text,
  body_ru text,
  body_th text,
  body_de text,
  body_fr text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  sent_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'partial'))
);

COMMENT ON TABLE newsletter_sends IS 'History of sent newsletters; admin-only.';

ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY newsletter_sends_admin_all ON newsletter_sends
  FOR ALL USING (public.is_admin());
