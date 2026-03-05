# Resend Inbound – setup en test

## Wat er in code is gedaan

1. **lib/sendMail.ts** – Elke uitgaande mail krijgt standaard `reply_to: reply@woonjonie.resend.app` (of `RESEND_INBOUND_REPLY_TO` uit env). Zo gaan antwoorden van ontvangers naar Resend Inbound.
2. **app/api/webhooks/resend/route.ts** – Webhook verwerkt expliciet:
   - **email.sent** → alleen bevestigen (200), geen verdere actie
   - **email.received** → opslaan in `incoming_emails`, AI-analyse, optioneel auto-reply

---

## Resend-dashboard

1. Ga naar [Resend](https://resend.com) → **Webhooks**.
2. Maak een webhook aan (of pas de bestaande aan):
   - **Endpoint URL:** `https://savedsouls-foundation.com/api/webhooks/resend`
   - **Events:** vink **email.received** aan (en eventueel **email.sent** als je die ook wilt ontvangen).
3. Na opslaan: kopieer het **Signing Secret** (`whsec_...`).
4. Zet dat in **Vercel** → Project → Settings → Environment Variables als **RESEND_WEBHOOK_SECRET** (Production en eventueel Preview).
5. **Inbound:** Controleer onder Resend → **Inbound** (of **Domains** → Inbound) dat het adres `reply@woonjonie.resend.app` (of `<anything>@woonjonie.resend.app`) actief is en aan hetzelfde project/team gekoppeld is.

---

## Porkbun DNS – MX voor @woonjonie.resend.app

**Je hoeft voor reply@woonjonie.resend.app geen MX bij Porkbun aan te passen.**

- `woonjonie.resend.app` is een **Resend-subdomein**. Resend regelt daar zelf de MX; mail die naar `reply@woonjonie.resend.app` gaat, komt bij Resend binnen en triggert de webhook.
- De huidige MX voor **savedsouls-foundation.com** (bijv. `inbound-smtp.eu-west-1.amazonaws.com`) gaat over mail die **rechtstreeks naar jouw domein** gaat (bijv. info@savedsouls-foundation.com). Die MX gebruik je alleen als je op dat eigen domein wilt ontvangen. Voor de flow “antwoorden op onze mails → reply@woonjonie.resend.app → webhook” is **geen MX-wijziging** nodig.

**Directe mail naar info@savedsouls-foundation.com in het dashboard (minimale DNS-wijziging)**

Als de MX-record nu naar `inbound-smtp.eu-west-1.amazonaws.com` (of een andere AWS-host) wijst en je krijgt "Relay access denied", ontvangt die server de mail maar staat geen relay toe. Om directe mails op info@ in het dashboard te krijgen met minimale wijziging:

1. **Resend Dashboard → Inbound / Domains**
   - Voeg het domein **savedsouls-foundation.com** toe voor Inbound (of gebruik een subdomein zoals `mail.savedsouls-foundation.com` als je de root-MX niet wilt aanpassen).
   - Resend toont het **MX-record** dat je moet gebruiken (bijv. `inbound-smtp.us-east-1.amazonaws.com` of de host die Resend aangeeft, prioriteit meestal 10).

2. **Porkbun DNS**
   - Verwijder of pas de bestaande MX voor `savedsouls-foundation.com` aan.
   - Voeg het door Resend getoonde MX-record toe (zelfde prioriteit als Resend aangeeft, bijv. 10). Zo gaat alle mail naar jouw domein naar Resend in plaats van naar de oude AWS-host.

3. **Webhook**
   - De webhook-URL `https://savedsouls-foundation.com/api/webhooks/resend` met event **email.received** staat al goed. Resend stuurt ontvangen mail naar deze endpoint; de app slaat ze op in `incoming_emails` met `bron: "inkomend"` en ze verschijnen in de E-mailassistent.

4. **Verificatie**
   - Na het wijzigen van de MX kan het 5–30 minuten duren tot DNS is doorgepropageerd. Stuur daarna een testmail naar info@savedsouls-foundation.com; die zou in Resend → Receiving en in het dashboard onder E-mail moeten verschijnen.

**Als je de root-MX niet wilt wijzigen** (bijv. omdat je daar al andere mail afhandelt), gebruik dan een subdomein voor Inbound (bijv. `mail.savedsouls-foundation.com`) en zet alleen voor dat subdomein een MX naar Resend. Mail naar info@savedsouls-foundation.com gaat dan nog naar de oude server; alleen mail naar `iets@mail.savedsouls-foundation.com` komt in Resend. Voor info@ op het hoofddomein is het vervangen van de bestaande MX door Resends MX de eenvoudigste oplossing.

---

## Test van de volledige flow

1. **Deploy** – Zorg dat de laatste code (incl. `replyTo` in sendMail en webhook) op Vercel staat.
2. **Webhook-secret** – Controleer dat **RESEND_WEBHOOK_SECRET** in Vercel gelijk is aan het Signing Secret uit het Resend-dashboard.
3. **Testmail versturen** – In het admin-dashboard: **E-mail** → “Nieuwe mail opstellen” → stuur een mail naar een eigen adres waar je antwoord vanaf kunt geven (bijv. Gmail).
4. **Antwoorden** – Open die mail in je mailbox en klik **Antwoorden**. Het antwoord moet naar `reply@woonjonie.resend.app` gaan (Reply-To).
5. **Controleren** – Binnen korte tijd:
   - In Resend → **Emails** → **Receiving**: de ontvangen reply zou zichtbaar moeten zijn.
   - In **Supabase** → tabel **incoming_emails**: een nieuwe rij met `bron = 'inkomend'`, met de inhoud van de reply.
   - In het **admin-dashboard** → **E-mail**: dezelfde mail verschijnt in de inbox.
6. **Logs** – Bij problemen: Vercel → **Logs** → filter op `/api/webhooks/resend`. Daar zie je of het webhook-verzoek binnenkomt en of er errors zijn (signature, Supabase, enz.).

---

## Korte checklist

- [ ] `RESEND_WEBHOOK_SECRET` in Vercel gezet (Signing Secret uit Resend).
- [ ] Webhook-URL in Resend: `https://savedsouls-foundation.com/api/webhooks/resend`, event **email.received** (en optioneel **email.sent**) aangevinkt.
- [ ] Resend Inbound actief voor `@woonjonie.resend.app`.
- [ ] Geen MX-wijziging nodig in Porkbun voor reply@woonjonie.resend.app.
- [ ] Test: mail vanuit dashboard → reply in mailbox → reply verschijnt in dashboard-inbox en in `incoming_emails`.
