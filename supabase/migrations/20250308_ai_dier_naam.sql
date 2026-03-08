-- Diernaam uit adoptie-email extraheren (AI/processor) opslaan voor {{dier}} in templates.
ALTER TABLE incoming_emails
  ADD COLUMN IF NOT EXISTS ai_dier_naam text;
