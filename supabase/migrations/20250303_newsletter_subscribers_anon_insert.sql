-- Allow anonymous INSERT on newsletter_subscribers so public subscribe form works
-- without requiring SUPABASE_SERVICE_ROLE_KEY. Admin remains via is_admin().
CREATE POLICY newsletter_subscribers_anon_insert ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);
