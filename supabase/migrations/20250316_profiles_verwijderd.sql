-- Soft-delete voor adoptanten (en evt. andere rollen): profiles.verwijderd
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verwijderd boolean DEFAULT false;
COMMENT ON COLUMN profiles.verwijderd IS 'Soft-delete: true = niet tonen in admin-lijsten';
