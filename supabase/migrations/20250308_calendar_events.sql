-- Agenda-module: kalender events (admin-only).
-- animal_id is optioneel; geen FK naar animals (dieren kunnen uit externe API komen).
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  location text,
  animal_id uuid,
  animal_name text,
  assigned_to text,
  attachment_url text,
  lab_result_status text,
  lab_result_notes text,
  is_recurring boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE calendar_events IS 'Agenda-events; admin-only.';

CREATE INDEX IF NOT EXISTS calendar_events_start_time_idx ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS calendar_events_category_idx ON calendar_events(category);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY calendar_events_admin_all ON calendar_events
  FOR ALL USING (public.is_admin());
