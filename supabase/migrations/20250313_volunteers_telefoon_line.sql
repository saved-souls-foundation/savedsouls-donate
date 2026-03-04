-- Optionele telefoon en LINE ID voor vrijwilligers (rooster).
ALTER TABLE volunteers
  ADD COLUMN IF NOT EXISTS telefoon text,
  ADD COLUMN IF NOT EXISTS line_id text;
