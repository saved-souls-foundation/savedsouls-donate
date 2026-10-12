-- Cron-taken halen de sleutel voortaan uit Supabase Vault in plaats van een vaste waarde in de code.
-- De oude migraties bevatten de sleutel letterlijk; die sleutel moet daarom vervangen worden.
--
-- VOORAF (eenmalig, in de SQL editor, NIET in git):
--   SELECT vault.create_secret('<nieuwe CRON_SECRET>', 'cron_secret');
-- Dezelfde waarde zet je in Vercel als CRON_SECRET (en daarna opnieuw deployen).
-- Later vervangen: SELECT vault.update_secret(id, '<nieuw>') FROM vault.secrets WHERE name = 'cron_secret';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'cron_secret') THEN
    RAISE EXCEPTION 'Maak eerst het Vault-geheim cron_secret aan (zie bovenaan dit bestand).';
  END IF;
END $$;

-- Zelfde namen, tijden en adressen als nu; cron.schedule met een bestaande naam vervangt de taak.
SELECT cron.schedule(
  'daily-email-processing',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://savedsouls-foundation.com/api/ai/process-pending-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'weekly-blog-spotlight',
  '0 1 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://savedsouls-foundation.com/api/ai/blog-generator',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'daily-agenda-reminders',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://savedsouls-foundation.com/api/ai/agenda-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Controle: SELECT jobname, schedule, active FROM cron.job ORDER BY jobname;
-- Staat 'test-spotlight-30min' er nog (bedoeld voor één testdag)? Dan: SELECT cron.unschedule('test-spotlight-30min');
