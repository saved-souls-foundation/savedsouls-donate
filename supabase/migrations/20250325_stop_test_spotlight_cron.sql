-- RPC om de 24h test cron job te stoppen (aan te roepen vanuit API).
CREATE OR REPLACE FUNCTION public.stop_test_spotlight_cron()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM cron.job WHERE jobname = 'test-spotlight-30min';
END;
$$;

COMMENT ON FUNCTION public.stop_test_spotlight_cron IS 'Verwijdert de cron job test-spotlight-30min (voor Stop 24h test).';
