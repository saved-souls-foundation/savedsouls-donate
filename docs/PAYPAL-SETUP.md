# PayPal-donaties – Developer-account en webhook

## 1. Credentials en omgevingsvariabelen

### Stappen in het PayPal Developer-account

1. **Account**
   - Ga naar [developer.paypal.com](https://developer.paypal.com) en log in (of maak een developer-account aan).

2. **App aanmaken**
   - **Dashboard** → **My Apps & Credentials**.
   - Bij **REST API apps** → **Create App**.
   - Geef een naam (bijv. "SavedSouls Donate") en kies **Merchant** (of **Personal** voor test).

3. **Client ID en Secret**
   - Open de nieuwe app.
   - **Sandbox** (test): gebruik de **Client ID** en **Secret** uit het **Sandbox**-tabblad.
   - **Live**: schakel eerst over naar **Live** en gebruik de **Client ID** en **Secret** uit het **Live**-tabblad.

4. **Omgevingsvariabelen** (lokaal en Vercel)

   | Variabele | Beschrijving |
   |-----------|--------------|
   | `PAYPAL_CLIENT_ID` | Client ID (Sandbox of Live). |
   | `PAYPAL_CLIENT_SECRET` | Secret (Sandbox of Live). |
   | `PAYPAL_WEBHOOK_ID` | ID van de webhook (zie hieronder). |
   | `PAYPAL_MODE` | `sandbox` of `live`. |
   | `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Zelfde als `PAYPAL_CLIENT_ID` (voor de frontend). |
   | `NEXT_PUBLIC_PAYPAL_MODE` | `sandbox` of `live` (voor de frontend). |
   | `NEXT_PUBLIC_PAYPAL_PLAN_ID_MONTHLY` | (Optioneel) Plan ID voor maandelijkse donaties. |

   In **.env.local** (niet committen):

   ```
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   PAYPAL_WEBHOOK_ID=...
   PAYPAL_MODE=sandbox
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
   NEXT_PUBLIC_PAYPAL_MODE=sandbox
   NEXT_PUBLIC_PAYPAL_PLAN_ID_MONTHLY=
   ```

   In **Vercel**: Project → Settings → Environment Variables → dezelfde namen en waarden invullen.

---

## 2. Webhook aanmaken en events

1. **Webhooks**
   - In de app: **Webhooks** (of **Add Webhook**).
   - **Webhook URL**: `https://jouw-domein.nl/api/webhooks/paypal` (productie) of een ngrok/tunnel-URL voor lokaal testen.

2. **Events** die we verwerken (aanvinken):
   - **PAYMENT.CAPTURE.COMPLETED** – eenmalige donatie voltooid.
   - **BILLING.SUBSCRIPTION.ACTIVATED** – nieuwe maandelijkse donatie actief.
   - **BILLING.SUBSCRIPTION.CANCELLED** – maandelijkse donatie geannuleerd.
   - **PAYMENT.SALE.COMPLETED** – betaling voor een maandelijkse donatie ontvangen.
   - **BILLING.SUBSCRIPTION.PAYMENT.FAILED** – betaling voor maandelijkse donatie mislukt.

3. **Webhook ID**
   - Na opslaan toont PayPal een **Webhook ID**. Deze waarde in `PAYPAL_WEBHOOK_ID` zetten.

---

## 3. Maandelijkse donaties (subscription)

Voor de knop “Maandelijkse donatie” moet er een **Subscription plan** in PayPal bestaan:

1. **Plannen**
   - **Products** → **Create product** (bijv. “Maandelijkse donatie”).
   - Daarna een **Plan** aanmaken met o.a. bedrag en interval (maandelijks).
   - Het **Plan ID** (begint met `P-...`) in `NEXT_PUBLIC_PAYPAL_PLAN_ID_MONTHLY` zetten.

Zonder dit plan-ID wordt alleen de eenmalige donatie-knop getoond; de maandelijkse optie toont dan een korte uitleg.

---

## 4. Lokaal testen

1. **npm**
   - `npm install` (o.a. `@paypal/react-paypal-js`).
   - `PAYPAL_MODE=sandbox` en Sandbox-credentials gebruiken.

2. **Webhook lokaal**
   - Webhook-URL moet vanaf internet bereikbaar zijn. Gebruik bijv. [ngrok](https://ngrok.com):  
     `ngrok http 3000`  
   - De gegenereerde URL (bijv. `https://abc123.ngrok.io`) + `/api/webhooks/paypal` als Webhook URL in PayPal invullen.

3. **Donatiepagina**
   - `/donate` openen; onder iDEAL/bank staat de PayPal-sectie (eenmalig + optioneel maandelijks).

---

## 5. Overzicht code

- **Webhook**: `app/api/webhooks/paypal/route.ts` – verwerkt de vijf events, schrijft naar `donors`, `donations`, `recurring_donations` en stuurt bij annulering/fouten een mail naar `ADMIN_EMAIL`.
- **Create order (eenmalig)**: `app/api/payments/paypal/create-order/route.ts` – maakt een PayPal-order aan voor het gekozen bedrag.
- **PayPal-hulp**: `lib/paypal.ts` – token en webhook-signatuurverificatie.
- **Donate-pagina**: `components/PayPalDonate.tsx` + `app/[locale]/donate/page.tsx` – knoppen en bedankbericht.
