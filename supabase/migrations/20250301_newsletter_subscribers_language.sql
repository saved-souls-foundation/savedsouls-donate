-- Add language column for newsletter subscribers (nl, en, es, ru, th, de)
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'nl';

COMMENT ON COLUMN newsletter_subscribers.language IS 'Preferred language: nl, en, es, ru, th, de';
