-- Rooster-module: vrijwilligers voor het weekrooster + shifts (admin-only).
-- Let op: tabel "volunteers" is voor rooster-toewijzingen; volunteer_onboarding is aparte flow.
CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  color text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roster_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid REFERENCES volunteers(id) ON DELETE SET NULL,
  volunteer_name text,
  volunteer_color text,
  zone text NOT NULL,
  task text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time_slot text NOT NULL,
  week_start date NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS roster_shifts_week_start_idx ON roster_shifts(week_start);
CREATE INDEX IF NOT EXISTS roster_shifts_zone_idx ON roster_shifts(zone);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY volunteers_admin_all ON volunteers
  FOR ALL USING (public.is_admin());

CREATE POLICY roster_shifts_admin_all ON roster_shifts
  FOR ALL USING (public.is_admin());

COMMENT ON TABLE volunteers IS 'Vrijwilligers voor weekrooster (naam, kleur); admin-only.';
COMMENT ON TABLE roster_shifts IS 'Shifts per week (vrijwilliger, zone, taak, dag, tijdslot); admin-only.';
