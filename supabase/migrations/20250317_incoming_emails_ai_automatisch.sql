-- Flag: mail automatisch beantwoord door AI (confidence >= 60%)
ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS ai_automatisch_verstuurd boolean DEFAULT false;
COMMENT ON COLUMN incoming_emails.ai_automatisch_verstuurd IS 'True if auto-reply was sent by webhook (AI match >= 60%)';
