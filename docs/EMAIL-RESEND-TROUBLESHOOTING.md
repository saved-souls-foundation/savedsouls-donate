# Resend: mail komt niet aan (formulieren)

Als het contactformulier / volunteer / adopt-inquiry succesvol lijkt te versturen maar de mail niet aankomt bij info@savedsouls-foundation.com of .org:

## 1. Vercel-logs controleren

Na een test (formulier invullen en verzenden):

1. Vercel-dashboard → jouw project → **Logs** (of **Functions** → logs).
2. Zoek naar `[Resend]` in de logs.

- **"Mail sent"** met een id → Resend heeft de mail geaccepteerd. Ga naar stap 2 en 3.
- **"sendMail error"** of **"send error: 403"** + "domain is not verified" → domein in Resend niet geverifieerd. Ga naar stap 2.
- **"Email service is not configured"** → `RESEND_API_KEY` ontbreekt in Vercel Environment Variables (Production).

## 2. Domein in Resend controleren

1. [Resend](https://resend.com) → **Domains**.
2. Staat **savedsouls-foundation.com** in de lijst?
3. Staat de status op **Verified** (groen vinkje)?

Zo niet:

- Voeg het domein toe en voer de DNS-records in die Resend toont (bij je domeinprovider: SPF, DKIM, eventueel MX).
- Wacht tot de status **Verified** is (kan even duren).

Je mag alleen **verzenden vanaf** een adres op dat domein (bijv. `info@savedsouls-foundation.com`). Staat het domein niet op Verified, dan geeft Resend een fout (bijv. 403) of levert niet af.

## 3. Resend-dashboard: Emails → Sending

1. Resend → **Emails** → tab **Sending**.
2. Verstuurt je een test via het formulier, dan zou hier een regel moeten verschijnen.

- **Staat de mail er wel, status "Delivered"?** → Waarschijnlijk spam of verkeerde inbox. Controleer spam bij info@… en of je op het juiste adres kijkt (.com vs .org).
- **Staat de mail er niet?** → De API-aanroep komt niet aan of faalt. Controleer opnieuw de Vercel-logs (stap 1).

## 4. Spam / juiste inbox

- Controleer de **spam-map** van info@savedsouls-foundation.com en info@savedsouls-foundation.org.
- Controleer of je in de juiste mailbox kijkt (welk adres gebruikt jullie voor het formulier: .com of .org? Beide staan in de code als ontvanger.)

## 5. Mail ontvangen / forwarder (Porkbun)

Als de **auto-reply** wél aankomt bij de bezoeker maar de **notificatiemail** (naar info@savedsouls-foundation.com) niet bij jullie forwarder aankomt:

- Resend **verstuurt** de mail naar info@…; waar die mail **aankomt** wordt bepaald door de **MX-records** van savedsouls-foundation.com.
- In **Porkbun** moet **ontvangen** van mail voor dat domein goed staan:
  1. **MX-records** voor `savedsouls-foundation.com` moeten wijzen naar de mailservers die de post ontvangen (bijv. Porkbun’s eigen servers als je daar forwarding gebruikt). Zonder juiste MX komt binnenkomende mail niet bij Porkbun.
  2. **Forwarder** instellen: info@savedsouls-foundation.com → jullie Gmail (of ander eindadres).

Porkbun-docs: Email Forwarding en MX-records voor het domein. Zodra MX naar de juiste ontvangende server wijst en de forwarder aan staat, zou de notificatiemail bij de forwarder binnen moeten komen.

## DMARC (aanbevolen voor betere levering)

In Porkbun: DNS voor savedsouls-foundation.com → TXT-record voor host `_dmarc` aanpassen.

**Aanbevolen waarde (quarantine i.p.v. none):**
```text
v=DMARC1; p=quarantine; rua=mailto:info@savedsouls-foundation.com
```

- `p=quarantine` – mail die DMARC faalt komt in spam/quarantine (beter voor reputatie dan `p=none`).
- `rua=` – rapporten gaan naar info@.com.

## Environment variables (Vercel)

- **RESEND_API_KEY** – verplicht; moet in **Production** (en eventueel Preview) staan.
- **RESEND_FROM** – optioneel; default in de code is `Saved Souls Website <info@savedsouls-foundation.com>`.
- **RESEND_WEBHOOK_SECRET** – voor inkomende mail via Resend Inbound: signing secret (format `whsec_...`) van de webhook in het Resend-dashboard. Zonder deze waarde weigert `POST /api/webhooks/resend` alle webhook-requests (500).

Na wijziging van env vars: opnieuw deployen (of wachten op automatische redeploy).

## Inkomende mail (Resend Inbound + webhook)

Om inkomende e-mail in het admin-dashboard (E-mailassistent) te tonen:

1. **Resend-dashboard** → **Webhooks** → **Add Webhook**.
2. **Endpoint URL:** `https://<jouw-domein>/api/webhooks/resend` (bijv. `https://savedsouls-foundation.org/api/webhooks/resend`).
3. **Events:** vink **email.received** aan.
4. Na aanmaken: kopieer het **Signing Secret** (`whsec_...`) en zet dat in Vercel als **RESEND_WEBHOOK_SECRET**.
5. Zonder **RESEND_WEBHOOK_SECRET** geeft de route 500; zonder **RESEND_API_KEY** kan de body van de mail niet worden opgehaald (alleen metadata wordt opgeslagen).
