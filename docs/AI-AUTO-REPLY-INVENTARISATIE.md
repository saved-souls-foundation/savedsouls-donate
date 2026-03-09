# AI Auto-Reply Systeem – Inventarisatie (STAP 1)

## Geen Supabase Edge Function

Het automatische AI-antwoord draait **niet** als Supabase Edge Function maar volledig in **Next.js API routes**. Er is geen map `supabase/functions/` voor auto-reply.

## Keten

1. **Resend webhook**  
   `app/api/webhooks/resend/route.ts`  
   - Ontvangt `email.received` van Resend, haalt inhoud op, slaat op in `incoming_emails` met `status: "in_behandeling"`, `bron: "inkomend"`.  
   - **Geen** directe trigger voor auto-reply.

2. **Cron (pg_cron)**  
   `supabase/migrations/20250323_cron_jobs.sql`  
   - Job `daily-email-processing`: schedule **`0 2 * * *`** (elke dag 02:00 UTC).  
   - Roept aan: `POST https://savedsouls-foundation.com/api/ai/process-pending-emails`  
   - Header: `Authorization: Bearer Golden54321%`  
   - **Mogelijke fout:** `CRON_SECRET` in de app moet exact overeenkomen met dit token.

3. **Process pending emails**  
   `app/api/ai/process-pending-emails/route.ts`  
   - Controleert `CRON_SECRET`.  
   - Haalt tot 10 rijen op: `incoming_emails` waar `ai_processed_at IS NULL` en `status = 'in_behandeling'`.  
   - Voor elke rij: `POST {origin}/api/ai/email-processor` met `{ emailId }` en Bearer token.  
   - **Mogelijke fout:** `origin` uit `request.url` kan lokaal/dev zijn i.p.v. productie-URL.

4. **Email processor (AI + verzenden)**  
   `app/api/ai/email-processor/route.ts`  
   - Controleert `CRON_SECRET`.  
   - Haalt e-mail op, classificeert met Claude (`callClaude`), genereert antwoord, stuurt via `sendMail` (Resend).  
   - Bij succes: update `incoming_emails` met `status: 'verstuurd'`, `beantwoord_op`, `ai_processed_at`, `ai_automatisch_verstuurd`.  
   - **Mogelijke fouten:**  
     - `ANTHROPIC_API_KEY` niet gezet (voor Claude).  
     - `RESEND_API_KEY` / `RESEND_FROM_EMAIL` niet gezet (voor sendMail).  
     - Kolom `beantwoord_op` ontbreekt in DB → update faalt (wordt opgevangen, status blijft onjuist).

## Tabel incoming_emails (relevante structuur)

- **Basis** (20250301_admin_expansion.sql):  
  `id`, `van_email`, `van_naam`, `onderwerp`, `inhoud`, `ontvangen_op`, `ai_categorie`, `ai_suggestie_template_id`, `ai_confidence`, `status` (CHECK: `in_behandeling`, `verstuurd`, `geneigeerd`), `updated_at`
- **Uitbreidingen:**  
  bron, ai_gegenereerd_antwoord, taal, verwerkt_door, verwerkt_op (20250303);  
  gelezen (20250313);  
  ai_automatisch_verstuurd (20250317);  
  ai_category, ai_urgency, ai_language, ai_suggested_reply, ai_used_template, ai_processed_at (20250321);  
  ai_dier_naam (20250308).  
- **beantwoord_op:** wordt in code gezet maar staat in **geen** migratie → waarschijnlijk ontbreekt in DB.

## Webhook handler (resend/route.ts)

- Verifieert Svix-handtekening met `RESEND_WEBHOOK_SECRET`.  
- Bij `email.received`: fetcht inhoud via Resend API (`RESEND_API_KEY`), schrijft rij in `incoming_emails`.  
- Geen verdere logging van “waar de keten faalt”; dat moet in process-pending-emails en email-processor.

## Welke stap kan falen?

| Stap | Mogelijke oorzaak |
|------|--------------------|
| Cron roept process-pending-emails aan | 401 als `CRON_SECRET !== "Golden54321%"` (of token in cron anders). |
| process-pending-emails haalt e-mails op | 500 bij Supabase-fout; 0 rijen als alles al `ai_processed_at` heeft. |
| process-pending-emails → email-processor | 401 verkeerde token; 404 e-mail niet gevonden; origin verkeerd (lokaal). |
| email-processor: Claude | 500 als `ANTHROPIC_API_KEY` ontbreekt of call faalt. |
| email-processor: sendMail | Geen 500 maar `result.success === false` als Resend faalt. |
| email-processor: update status | Update faalt als kolom `beantwoord_op` ontbreekt; status blijft `in_behandeling`. |

---

## STAP 3 – Aanpassingen

- **Migratie:** `supabase/migrations/20250328_incoming_emails_beantwoord_op.sql` voegt kolom `beantwoord_op` toe zodat de status-update na auto-reply niet faalt.
- **Status na succes:** blijft `verstuurd` (DB constraint heeft alleen `in_behandeling`, `verstuurd`, `geneigeerd`). Kolom `beantwoord_op` wordt gezet.
- **Cron:** Huidige schedule is **`0 2 * * *`** (elke dag 02:00 UTC). Formaat **`0 * * * *`** = elk uur op minuut 0. Voor elk uur de cron-job in `20250323_cron_jobs.sql` aanpassen naar `'0 * * * *'`.
