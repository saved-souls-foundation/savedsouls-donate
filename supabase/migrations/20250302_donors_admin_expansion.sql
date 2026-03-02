-- Donors admin: extra columns for donors, donations, recurring_donations

-- donors: telefoon, notities, soft delete
ALTER TABLE donors
  ADD COLUMN IF NOT EXISTS telefoon text,
  ADD COLUMN IF NOT EXISTS notities text,
  ADD COLUMN IF NOT EXISTS verwijderd boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN donors.verwijderd IS 'Soft delete; when true donor is hidden from default lists.';

-- donations: campagne
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS campagne text;

-- recurring_donations: webhook + display fields
ALTER TABLE recurring_donations
  ADD COLUMN IF NOT EXISTS valuta text DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS methode text,
  ADD COLUMN IF NOT EXISTS laatste_betaling_datum date,
  ADD COLUMN IF NOT EXISTS mislukte_betalingen integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS eind_datum date;

COMMENT ON COLUMN recurring_donations.laatste_betaling_datum IS 'Last successful payment date (from webhook).';
COMMENT ON COLUMN recurring_donations.mislukte_betalingen IS 'Consecutive failed payments; 3+ sets status to betalingsprobleem.';
COMMENT ON COLUMN recurring_donations.eind_datum IS 'When subscription ended (e.g. from Stripe).';
