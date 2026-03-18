-- GoFundMe campaign stats: opgehaald bedrag, doel, donaties (cron-scraper vult aan)
CREATE TABLE IF NOT EXISTS campaign_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raised_eur integer NOT NULL DEFAULT 0,
  goal_eur integer NOT NULL DEFAULT 120000,
  donations jsonb NOT NULL DEFAULT '[]'::jsonb,
  gofundme_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE campaign_stats IS 'Laatste gescrapete GoFundMe-statistieken; cron upsert op vaste id';
COMMENT ON COLUMN campaign_stats.donations IS 'Array van { name, amount, currency }';
