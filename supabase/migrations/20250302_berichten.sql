-- Berichten: vrijwilliger ↔ coördinator (admin). Vrijwilliger ziet eigen berichten + voor_iedereen.
CREATE TABLE IF NOT EXISTS berichten (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  afzender_id uuid NOT NULL,
  ontvanger_id uuid,
  ontvanger_rol text,
  voor_iedereen boolean NOT NULL DEFAULT false,
  inhoud text NOT NULL,
  gelezen boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE berichten IS 'Berichten tussen vrijwilligers en coördinatoren; ontvanger_id = specifieke user, voor_iedereen = broadcast.';

CREATE INDEX IF NOT EXISTS berichten_ontvanger_id_idx ON berichten(ontvanger_id);
CREATE INDEX IF NOT EXISTS berichten_voor_iedereen_idx ON berichten(voor_iedereen) WHERE voor_iedereen = true;
CREATE INDEX IF NOT EXISTS berichten_created_at_idx ON berichten(created_at DESC);

ALTER TABLE berichten ENABLE ROW LEVEL SECURITY;

-- Vrijwilliger: mag eigen verzonden berichten lezen (voor overzicht), mag lezen waar ontvanger_id = zichzelf OF voor_iedereen
CREATE POLICY berichten_volunteer_select ON berichten
  FOR SELECT
  USING (
    afzender_id = auth.uid()
    OR ontvanger_id = auth.uid()
    OR (voor_iedereen = true)
  );

-- Vrijwilliger: mag alleen inserten met afzender_id = zichzelf (bericht naar coördinator)
CREATE POLICY berichten_volunteer_insert ON berichten
  FOR INSERT
  WITH CHECK (afzender_id = auth.uid());

-- Admin: volledige toegang (lezen alle inkomende, updaten gelezen)
CREATE POLICY berichten_admin_all ON berichten
  FOR ALL
  USING (public.is_admin());
