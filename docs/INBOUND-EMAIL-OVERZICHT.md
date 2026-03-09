# Inbound email processing – antwoorden uit de codebase

## 1. Is there already a webhook endpoint for incoming emails?

**Ja.** Het endpoint is:

- **Route:** `POST /api/webhooks/resend`
- **Bestand:** `app/api/webhooks/resend/route.ts`

Resend stuurt hier `email.received`-events naartoe (Svix-signature). De route:

- Verifieert de webhook-signatuur met `RESEND_WEBHOOK_SECRET`
- Haalt de mailbody op via Resend API (`emails.receiving.get`)
- Slaat de mail op in Supabase-tabel `incoming_emails`
- Roept AI-analyse aan (`analyzeIncomingEmail`) en kan bij voldoende confidence een auto-reply sturen

---

## 2. Incoming_emails table structure (Supabase)

Definitie in migraties (basis in `20250301_admin_expansion.sql`, uitbreidingen in o.a. `20250303_emails_assistant.sql`, `20250313_incoming_emails_gelezen.sql`, `20250317_incoming_emails_ai_automatisch.sql`):

```sql
-- Basis (20250301_admin_expansion.sql)
CREATE TABLE IF NOT EXISTS incoming_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  van_email text,
  van_naam text,
  onderwerp text,
  inhoud text,
  ontvangen_op timestamptz NOT NULL DEFAULT now(),
  ai_categorie text,
  ai_suggestie_template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  ai_confidence numeric,
  status text NOT NULL DEFAULT 'in_behandeling' CHECK (status IN ('in_behandeling', 'verstuurd', 'genegeerd')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Later toegevoegd:
-- bron text (contact_formulier, inkomend, aanvraag, etc.)
-- ai_gegenereerd_antwoord text, taal text, verwerkt_door uuid, verwerkt_op timestamptz
-- gelezen boolean NOT NULL DEFAULT false
-- ai_automatisch_verstuurd boolean DEFAULT false
```

---

## 3. How are outgoing emails sent via Resend?

**Bestand:** `lib/sendMail.ts`

- Gebruikt de Resend SDK: `new Resend(process.env.RESEND_API_KEY)`
- `sendMail({ to, subject, text, html?, replyTo?, from? })` → `client.emails.send(...)`
- From-adres: `RESEND_FROM_EMAIL` / `RESEND_FROM` of default `Saved Souls Website <info@savedsouls-foundation.com>`

Verzenden vanuit de app gaat overal via deze `sendMail()` (contact, donate, volunteer, adopt, admin reply, portal notify, webhook auto-reply).

---

## 4. How should a reply be linked to the original email or conversation?

**Huidige koppeling (uitgaand → log):**

- Bij **versturen** van een antwoord vanuit het dashboard (`POST /api/admin/emails/[id]/send`) wordt het bijbehorende `incoming_emails`-rij geüpdatet (`status: 'verstuurd'`, `verwerkt_door`, `verwerkt_op`) en wordt een regel in `sent_emails` gezet met `reference_id = incoming_emails.id` en `reference_type: 'incoming_email'`.

**Ontbrekende koppeling (inkomende reply → vorige mail):**

- Als iemand **reageert** op een door ons verstuurde mail, komt die reply binnen via Resend Inbound → webhook → **nieuwe** rij in `incoming_emails`. Er is nu **geen** veld dat deze nieuwe rij koppelt aan de oorspronkelijke `incoming_emails`- of `sent_emails`-regel (geen thread/conversation-id).

**Aanbeveling om replies te koppelen:**

- Optioneel kolom in `incoming_emails` toevoegen, bijv. `parent_incoming_id uuid REFERENCES incoming_emails(id)` of `reply_to_sent_id uuid REFERENCES sent_emails(id)`.
- In de webhook: als de inkomende mail een `In-Reply-To` / `References` header heeft die we kunnen matchen met een bestaande `sent_emails` of `incoming_emails` (bijv. via Message-Id die we bij verzenden kunnen opslaan), dan bij het inserten van de nieuwe `incoming_emails`-rij dit veld zetten. Zo kun je in het dashboard een conversatiedraad tonen.

---

## 5. Is there already AI processing of incoming emails?

**Ja.** Op twee plekken:

**A) Webhook (direct bij binnenkomst)**  
`app/api/webhooks/resend/route.ts`:

- Na insert in `incoming_emails` wordt `analyzeIncomingEmail(van_naam, van_email, onderwerp, inhoud, templateList)` aangeroepen (uit `@/lib/claudeAnalyze`).
- Bij confidence ≥ 0.6 wordt automatisch een reply gestuurd, en de rij geüpdatet o.a. met `ai_automatisch_verstuurd: true`.

**B) Dashboard (handmatige analyse)**  
`app/api/admin/emails/[id]/analyze/route.ts`:

- `POST /api/admin/emails/[id]/analyze` laadt de `incoming_emails`-rij en roept `analyzeIncomingEmail` aan.
- Resultaat (categorie, template, confidence, taal, personalisatie) wordt op de rij opgeslagen; optioneel kan de admin een auto-reply sturen (zelfde drempel).

Beide gebruiken dezelfde `analyzeIncomingEmail`-functie (waarschijnlijk Claude/API) en templates uit `email_templates`.

---

## Best approach (geen beta, Vercel + Supabase, minimale DNS)

- **Inbound:** Blijf **Resend Inbound** gebruiken; die is productie-ready, werkt met Vercel (webhook) en vereist alleen MX (of Inbound-adres) voor het ontvangstadres (bijv. info@savedsouls-foundation.com).
- **Verwerking:** Huidige flow is goed: webhook → `incoming_emails` → AI → optionele auto-reply; dashboard toont inbox en antwoorden.
- **Verbetering voor “replies to sent emails”:**  
  - In `incoming_emails`: optioneel `parent_incoming_id` of `reply_to_sent_id` toevoegen (migratie).  
  - In `app/api/webhooks/resend/route.ts`: bij nieuwe inkomende mail headers `In-Reply-To` / `References` (en evt. opgeslagen Message-Ids in `sent_emails`) gebruiken om de nieuwe rij te koppelen aan de juiste eerdere mail; daarna in het dashboard een “conversatie”-view bouwen die op dit veld filtert/grouped.

Geen AWS nodig; Resend + bestaande webhook + Supabase volstaan.

**DNS (Porkbun, huidige situatie):** Zie **docs/EMAIL-DNS-PORKBUN-OUTLOOK.md** voor de actuele records. Kort: SPF op root (`include:amazonses.com`, `include:_spf.porkbun.com`, `include:resend.com`), DKIM `resend._domainkey` (geverifieerd via Resend), DMARC `_dmarc` met **p=none** (niet wijzigen naar p=quarantine – dat brak levering naar Outlook/Hotmail), MX voor inbound: `@` → `inbound-smtp.eu-west-1.amazonaws.com` prioriteit 9.
