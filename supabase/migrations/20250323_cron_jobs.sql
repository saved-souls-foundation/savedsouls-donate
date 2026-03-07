-- Activeer pg_cron en pg_net extensies
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Dagelijkse email verwerking (elke dag 09:00 Thai tijd = 02:00 UTC)
SELECT cron.schedule(
  'daily-email-processing',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://savedsouls-foundation.com/api/ai/process-pending-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer Golden54321%'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 2. Wekelijkse blog spotlight (elke maandag 08:00 Thai tijd = 01:00 UTC)
SELECT cron.schedule(
  'weekly-blog-spotlight',
  '0 1 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://savedsouls-foundation.com/api/ai/blog-generator',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer Golden54321%'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 3. Dagelijkse agenda reminders check (elke dag 07:00 Thai = 00:00 UTC)
SELECT cron.schedule(
  'daily-agenda-reminders',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://savedsouls-foundation.com/api/ai/agenda-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer Golden54321%'
    ),
    body := '{}'::jsonb
  );
  $$
);

