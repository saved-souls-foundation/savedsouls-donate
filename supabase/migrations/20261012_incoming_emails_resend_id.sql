-- Dubbele webhooks van Resend niet meer dubbel opslaan.
-- Bestaande rijen houden NULL (meerdere NULLs mogen in een unieke index).
ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS resend_email_id text;
CREATE UNIQUE INDEX IF NOT EXISTS incoming_emails_resend_email_id_key ON incoming_emails (resend_email_id);
