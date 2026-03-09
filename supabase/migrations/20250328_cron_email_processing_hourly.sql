-- Auto-reply elk uur i.p.v. 1x per dag (0 * * * * = elk uur op minuut 0).
SELECT cron.unschedule('daily-email-processing');
SELECT cron.schedule(
  'daily-email-processing',
  '0 * * * *',
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
