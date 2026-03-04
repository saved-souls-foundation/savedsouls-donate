-- Nieuwsbrief inplannen: datum/tijd waarop automatisch verzenden
ALTER TABLE newsletter_drafts
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS verstuurd_op timestamptz;
COMMENT ON COLUMN newsletter_drafts.scheduled_at IS 'Gepland verzendmoment; cron stuurt dan automatisch';
COMMENT ON COLUMN newsletter_drafts.verstuurd_op IS 'Tijdstip waarop door cron verzonden (null = nog niet)';
