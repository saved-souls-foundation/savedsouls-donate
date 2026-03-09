-- Kolom beantwoord_op voor tijdstip automatisch antwoord (email-processor).
ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS beantwoord_op timestamptz;
COMMENT ON COLUMN incoming_emails.beantwoord_op IS 'Tijdstip waarop automatisch antwoord is verstuurd (AI auto-reply).';
