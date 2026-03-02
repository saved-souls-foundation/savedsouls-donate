-- Sponsors: extra columns and status values for admin module.
-- Run after 20250301_admin_expansion.sql (sponsors table exists).

ALTER TABLE sponsors
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS contactpersoon_telefoon text,
  ADD COLUMN IF NOT EXISTS bijdrage_type text CHECK (bijdrage_type IS NULL OR bijdrage_type IN ('geld', 'producten', 'diensten', 'combinatie')),
  ADD COLUMN IF NOT EXISTS omschrijving text,
  ADD COLUMN IF NOT EXISTS notities text,
  ADD COLUMN IF NOT EXISTS herinnering_verstuurd boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN sponsors.website IS 'Company website URL';
COMMENT ON COLUMN sponsors.contactpersoon_telefoon IS 'Contact person phone';
COMMENT ON COLUMN sponsors.bijdrage_type IS 'geld, producten, diensten, combinatie';
COMMENT ON COLUMN sponsors.omschrijving IS 'Description of sponsorship';
COMMENT ON COLUMN sponsors.notities IS 'Internal notes';
COMMENT ON COLUMN sponsors.herinnering_verstuurd IS 'Reminder email sent for expiring contract';

-- Extend status to include in_onderhandeling and verwijderd (soft delete)
ALTER TABLE sponsors DROP CONSTRAINT IF EXISTS sponsors_status_check;
ALTER TABLE sponsors ADD CONSTRAINT sponsors_status_check
  CHECK (status IN ('actief', 'inactief', 'verlopen', 'in_onderhandeling', 'verwijderd'));

-- Default for new rows can stay actief; app uses in_onderhandeling for new creates per spec.
