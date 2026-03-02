-- Add CHECK constraint for newsletter_subscribers.language (valid: nl, en, es, ru, th, de, fr)
ALTER TABLE newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_language_check;

ALTER TABLE newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_language_check
  CHECK (language IS NULL OR language IN ('nl', 'en', 'es', 'ru', 'th', 'de', 'fr'));

COMMENT ON COLUMN newsletter_subscribers.language IS 'Preferred language: nl, en, es, ru, th, de, fr';
