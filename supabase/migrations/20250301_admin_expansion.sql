-- Saved Souls Foundation – Admin expansion: members, newsletter, donors, donations,
-- recurring_donations, sponsors, email_templates, incoming_emails.
-- Alleen admin (profiles.role = 'admin' OR profiles.is_admin = true) mag lezen/schrijven.
-- Draai na 20250301_profiles_portal.sql (profiles.role en profiles.is_admin bestaan).

-- Helper: admin check (gebruikt in alle RLS-policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.is_admin = true)
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================================================
-- 1. members
-- =============================================================================
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voornaam text,
  achternaam text,
  email text,
  telefoon text,
  type text CHECK (type IS NULL OR type IN ('persoon', 'bedrijf')),
  bedrijfsnaam text,
  status text NOT NULL DEFAULT 'actief' CHECK (status IN ('actief', 'inactief')),
  lid_sinds date,
  notities text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE members IS 'Leden (persoon of bedrijf); admin-only.';

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY members_admin_all ON members
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- 2. newsletter_subscribers
-- =============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  voornaam text,
  achternaam text,
  type text CHECK (type IS NULL OR type IN ('persoon', 'bedrijf')),
  actief boolean NOT NULL DEFAULT true,
  aangemeld_op timestamptz NOT NULL DEFAULT now(),
  unsubscribe_token text UNIQUE
);

COMMENT ON TABLE newsletter_subscribers IS 'Nieuwsbrief-abonnees; admin-only.';

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY newsletter_subscribers_admin_all ON newsletter_subscribers
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- 3. donors
-- =============================================================================
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voornaam text,
  achternaam text,
  email text,
  type text CHECK (type IS NULL OR type IN ('persoon', 'bedrijf')),
  bedrijfsnaam text,
  land text
);

COMMENT ON TABLE donors IS 'Donateurs; admin-only.';

ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY donors_admin_all ON donors
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- 4. donations
-- =============================================================================
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(id) ON DELETE SET NULL,
  bedrag numeric NOT NULL,
  valuta text NOT NULL DEFAULT 'EUR',
  methode text,
  status text,
  donatie_datum timestamptz,
  betalingskenmerk text,
  anoniem boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE donations IS 'Eenmalige donaties; admin-only.';

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY donations_admin_all ON donations
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- 5. recurring_donations
-- =============================================================================
CREATE TABLE IF NOT EXISTS recurring_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  bedrag numeric NOT NULL,
  frequentie text,
  provider_subscription_id text,
  status text NOT NULL DEFAULT 'actief' CHECK (status IN ('actief', 'gepauzeerd', 'gestopt', 'betalingsprobleem')),
  start_datum date,
  volgende_betaling_datum date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE recurring_donations IS 'Doorlopende donaties; admin-only.';

ALTER TABLE recurring_donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY recurring_donations_admin_all ON recurring_donations
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- 6. sponsors
-- =============================================================================
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bedrijfsnaam text,
  contactpersoon_naam text,
  contactpersoon_email text,
  logo_url text,
  niveau text CHECK (niveau IS NULL OR niveau IN ('bronze', 'silver', 'gold', 'platinum')),
  bedrag_per_maand numeric,
  contract_start date,
  contract_eind date,
  status text NOT NULL DEFAULT 'actief' CHECK (status IN ('actief', 'inactief', 'verlopen')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE sponsors IS 'Sponsors (bedrijven); admin-only.';

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY sponsors_admin_all ON sponsors
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- 7. email_templates
-- =============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam text,
  categorie text,
  onderwerp text,
  inhoud_nl text,
  inhoud_en text,
  actief boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE email_templates IS 'E-mailtemplates voor uitgaande mails; admin-only.';

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY email_templates_admin_all ON email_templates
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- 8. incoming_emails
-- =============================================================================
CREATE TABLE IF NOT EXISTS incoming_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  van_email text,
  van_naam text,
  onderwerp text,
  inhoud text,
  ontvangen_op timestamptz NOT NULL DEFAULT now(),
  ai_categorie text,
  ai_suggestie_template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  ai_confidence numeric,
  status text NOT NULL DEFAULT 'in_behandeling' CHECK (status IN ('in_behandeling', 'verstuurd', 'genegeerd')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE incoming_emails IS 'Binnenkomende e-mails + AI-categorisatie; admin-only.';

ALTER TABLE incoming_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY incoming_emails_admin_all ON incoming_emails
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- Triggers: updated_at voor tabellen die dat hebben
-- =============================================================================
CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER recurring_donations_updated_at
  BEFORE UPDATE ON recurring_donations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER incoming_emails_updated_at
  BEFORE UPDATE ON incoming_emails
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
