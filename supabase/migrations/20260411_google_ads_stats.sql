CREATE TABLE google_ads_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name text NOT NULL,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  ctr numeric(5,2) DEFAULT 0,
  conversions integer DEFAULT 0,
  cost_per_conversion numeric(10,2) DEFAULT 0,
  week_start date NOT NULL,
  created_at timestamptz DEFAULT now()
);
