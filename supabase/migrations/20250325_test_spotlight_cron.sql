-- Cron job elke 30 minuten voor 24-uurs test (48 spotlights)
SELECT cron.schedule(
  'test-spotlight-30min',
  '*/30 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://savedsouls-foundation.com/api/ai/test-spotlight',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer Golden54321%'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Dit handmatig uitvoeren na 24 uur om de cron te stoppen:
-- SELECT cron.unschedule('test-spotlight-30min');
