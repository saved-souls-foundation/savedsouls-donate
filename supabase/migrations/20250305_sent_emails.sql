-- Log van verzonden mails (stap-notificaties, auto-replies) voor admin-overzicht
CREATE TABLE IF NOT EXISTS sent_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('step_notify', 'email_assistant', 'other')),
  to_email text NOT NULL,
  subject text NOT NULL,
  body_preview text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  reference_id uuid,
  reference_type text,
  meta jsonb DEFAULT '{}'
);

COMMENT ON TABLE sent_emails IS 'Log van verzonden mails voor admin: stap-notificaties, e-mailassistent-antwoorden, etc.';
CREATE INDEX IF NOT EXISTS sent_emails_sent_at_idx ON sent_emails(sent_at DESC);
CREATE INDEX IF NOT EXISTS sent_emails_type_idx ON sent_emails(type);

ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY sent_emails_admin_all ON sent_emails FOR ALL USING (public.is_admin());
