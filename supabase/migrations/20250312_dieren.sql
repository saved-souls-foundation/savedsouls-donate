-- Dieren (shelter animals) voor admin beheer.
CREATE TABLE IF NOT EXISTS dieren (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam text,
  soort text DEFAULT 'hond',
  ras text,
  leeftijd text,
  geslacht text,
  status text DEFAULT 'in_opvang' CHECK (status IN ('in_opvang', 'foster', 'geadopteerd', 'overleden')),
  foto_url text,
  beschrijving text,
  locatie text,
  medisch_urgent boolean DEFAULT false,
  aangemeld_op timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dieren_status_idx ON dieren(status);
CREATE INDEX IF NOT EXISTS dieren_soort_idx ON dieren(soort);

ALTER TABLE dieren ENABLE ROW LEVEL SECURITY;

CREATE POLICY dieren_admin_all ON dieren
  FOR ALL
  USING (public.is_admin());

COMMENT ON TABLE dieren IS 'Dieren in opvang; admin-only.';

CREATE TRIGGER dieren_updated_at
  BEFORE UPDATE ON dieren
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
