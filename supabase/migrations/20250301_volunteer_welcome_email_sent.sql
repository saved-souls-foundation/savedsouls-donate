-- Kolom om te voorkomen dat welkomstmail + teammail dubbel worden verstuurd
ALTER TABLE volunteer_onboarding
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at timestamptz;

COMMENT ON COLUMN volunteer_onboarding.welcome_email_sent_at IS 'Tijdstip waarop welkomstmail naar vrijwilliger en notificatie naar team zijn verstuurd (na voltooien stap 4).';
