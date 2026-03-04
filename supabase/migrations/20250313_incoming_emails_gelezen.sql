-- DRY-RUN: Bekijk deze query voordat je de migration uitvoert.
-- Voegt kolom 'gelezen' toe voor badge-teller (alleen ongelezen in_behandeling tellen).
-- Geen bestaande logica gewijzigd; alleen uitbreiding.

ALTER TABLE incoming_emails
  ADD COLUMN IF NOT EXISTS gelezen boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN incoming_emails.gelezen IS 'Of de mail door admin is geopend; badge toont alleen in_behandeling waar gelezen = false';
