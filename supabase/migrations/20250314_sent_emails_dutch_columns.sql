-- Hernoem sent_emails-kolommen naar Nederlands (aan, onderwerp, inhoud, verstuurd_op)
-- zodat insert/select overeenkomen met de applicatie.

ALTER TABLE sent_emails RENAME COLUMN to_email TO aan;
ALTER TABLE sent_emails RENAME COLUMN subject TO onderwerp;
ALTER TABLE sent_emails RENAME COLUMN body_preview TO inhoud;
ALTER TABLE sent_emails RENAME COLUMN sent_at TO verstuurd_op;

COMMENT ON COLUMN sent_emails.aan IS 'Aan (ontvanger e-mail)';
COMMENT ON COLUMN sent_emails.onderwerp IS 'Onderwerp van de mail';
COMMENT ON COLUMN sent_emails.inhoud IS 'Inhoud (preview of volledige body)';
COMMENT ON COLUMN sent_emails.verstuurd_op IS 'Tijdstip van verzenden';

-- Index blijft werken (bestond op sent_at)
DROP INDEX IF EXISTS sent_emails_sent_at_idx;
CREATE INDEX IF NOT EXISTS sent_emails_verstuurd_op_idx ON sent_emails(verstuurd_op DESC);
