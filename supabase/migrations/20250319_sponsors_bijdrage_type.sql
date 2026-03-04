-- Zorg dat bijdrage_type bestaat (als 20250303 niet of gedeeltelijk is uitgevoerd).
ALTER TABLE sponsors
  ADD COLUMN IF NOT EXISTS bijdrage_type text CHECK (bijdrage_type IS NULL OR bijdrage_type IN ('geld', 'producten', 'diensten', 'combinatie'));
COMMENT ON COLUMN sponsors.bijdrage_type IS 'geld, producten, diensten, combinatie';
