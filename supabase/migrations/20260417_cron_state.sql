CREATE TABLE IF NOT EXISTS cron_state (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamptz DEFAULT NOW()
);
