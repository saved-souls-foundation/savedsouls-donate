-- AI-velden voor email-verwerking (incoming_emails = emails-tabel in dit project)
ALTER TABLE incoming_emails
  ADD COLUMN IF NOT EXISTS ai_category text,
  ADD COLUMN IF NOT EXISTS ai_urgency text,
  ADD COLUMN IF NOT EXISTS ai_language text,
  ADD COLUMN IF NOT EXISTS ai_suggested_reply text,
  ADD COLUMN IF NOT EXISTS ai_used_template boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_processed_at timestamptz;
