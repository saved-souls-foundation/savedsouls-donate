-- Verzendhistorie voor e-mailtemplates (admin template-verstuurfunctionaliteit).
CREATE TABLE IF NOT EXISTS template_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
  ontvanger_email text NOT NULL,
  ontvanger_naam text,
  verstuurd_op timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'verstuurd' CHECK (status IN ('verstuurd', 'mislukt'))
);

COMMENT ON TABLE template_send_log IS 'Log van elke per template verstuurde e-mail (admin send-template).';

CREATE INDEX IF NOT EXISTS template_send_log_template_id_idx ON template_send_log(template_id);
CREATE INDEX IF NOT EXISTS template_send_log_verstuurd_op_idx ON template_send_log(verstuurd_op);

ALTER TABLE template_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY template_send_log_admin_all ON template_send_log
  FOR ALL USING (public.is_admin());
