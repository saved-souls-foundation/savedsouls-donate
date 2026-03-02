-- Add UNIQUE on email_templates.naam so seed can use ON CONFLICT (naam) DO NOTHING.
-- Run after 20250303_emails_assistant.sql.

ALTER TABLE email_templates
  DROP CONSTRAINT IF EXISTS email_templates_naam_key;

ALTER TABLE email_templates
  ADD CONSTRAINT email_templates_naam_key UNIQUE (naam);
