-- UNIQUE constraints for batch upsert in admin import (sponsoren, donateurs).
-- Run after admin_expansion and sponsors_expansion.

ALTER TABLE donors DROP CONSTRAINT IF EXISTS donors_email_key;
ALTER TABLE donors ADD CONSTRAINT donors_email_key UNIQUE (email);

ALTER TABLE sponsors DROP CONSTRAINT IF EXISTS sponsors_contactpersoon_email_key;
ALTER TABLE sponsors ADD CONSTRAINT sponsors_contactpersoon_email_key UNIQUE (contactpersoon_email);
