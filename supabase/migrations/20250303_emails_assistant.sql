-- AI Email Assistant: extra columns for incoming_emails and email_templates.
-- Run after 20250301_admin_expansion.sql.

-- incoming_emails: bron, ai_gegenereerd_antwoord, taal, verwerkt_door, verwerkt_op
ALTER TABLE incoming_emails
  ADD COLUMN IF NOT EXISTS bron text,
  ADD COLUMN IF NOT EXISTS ai_gegenereerd_antwoord text,
  ADD COLUMN IF NOT EXISTS taal text,
  ADD COLUMN IF NOT EXISTS verwerkt_door uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verwerkt_op timestamptz;

COMMENT ON COLUMN incoming_emails.bron IS 'Source: contact_formulier, manual, etc.';
COMMENT ON COLUMN incoming_emails.ai_gegenereerd_antwoord IS 'Generated reply body (HTML or plain) from template + placeholders';
COMMENT ON COLUMN incoming_emails.taal IS 'Detected or chosen language: nl, en, es, ru, th, de, fr';
COMMENT ON COLUMN incoming_emails.verwerkt_door IS 'Admin user id who sent/ignored';
COMMENT ON COLUMN incoming_emails.verwerkt_op IS 'When status was set to verstuurd or genegeerd';

-- email_templates: 7 languages for subject + content (nl/en already exist as onderwerp, inhoud_nl, inhoud_en)
ALTER TABLE email_templates
  ADD COLUMN IF NOT EXISTS onderwerp_nl text,
  ADD COLUMN IF NOT EXISTS onderwerp_en text,
  ADD COLUMN IF NOT EXISTS onderwerp_es text,
  ADD COLUMN IF NOT EXISTS onderwerp_ru text,
  ADD COLUMN IF NOT EXISTS onderwerp_th text,
  ADD COLUMN IF NOT EXISTS onderwerp_de text,
  ADD COLUMN IF NOT EXISTS onderwerp_fr text,
  ADD COLUMN IF NOT EXISTS inhoud_es text,
  ADD COLUMN IF NOT EXISTS inhoud_ru text,
  ADD COLUMN IF NOT EXISTS inhoud_th text,
  ADD COLUMN IF NOT EXISTS inhoud_de text,
  ADD COLUMN IF NOT EXISTS inhoud_fr text;

-- Backfill: copy existing single onderwerp to onderwerp_nl and onderwerp_en if needed
-- (optional one-time; app will read onderwerp_xx by language)
