# Nieuwsbrief inschrijven – waar komt de fout vandaan?

## Waar wordt "Something went wrong" / "Er ging iets mis" getoond?

Er zijn **twee** plekken waar die melding (of een variant) kan verschijnen:

### 1. **Validatie vóór de API-aanroef (geen netwerkrequest)**

**Bestand:** `components/NewsletterSignup.tsx`  
**Regels:** na `e.preventDefault()`: controle op leeg e-mailadres en ongeldig formaat.

- Als het e-mailveld **leeg** is → `setErrorMessage(t("validationEmail"))` (nu: "Vul een geldig e-mailadres in." / "Please enter a valid email address.").
- Als het e-mailadres **ongeldig** is (geen match met `emailRegex`) → dezelfde validatiemelding.

**Belangrijk:** In deze paden wordt **geen** `fetch()` gedaan. In de Network-tab verschijnt dus **geen** request naar `/api/newsletter/subscribe`. De oude code gebruikte hier dezelfde key als bij API-fouten (`errorMessage`), daarom leek het alsof "Something went wrong" uit het niets kwam.

Sinds de aanpassing:
- Validatiefouten tonen een **aparte** melding (`validationEmail`).
- In development wordt in de console gelogd: `[NewsletterSignup] Geen request: e-mail is leeg (validation)` of `... ongeldig e-mailformaat (validation)`.

### 2. **Na de API-aanroef (wel netwerkrequest)**

**Bestand:** `components/NewsletterSignup.tsx`  
**Regels:** in de `try`-block na `await fetch(...)`.

- Als `!res.ok` → `setErrorMessage(apiError || t("errorMessage"))`. De API stuurt bij fouten een body `{ error: "..." }`; die wordt getoond. Anders de generieke `errorMessage`.
- In de `catch` (bij netwerkfout of exception) → `setErrorMessage(t("errorMessage"))`.

Als je hier "Something went wrong" ziet, staat in de Network-tab wél een request naar `/api/newsletter/subscribe` (status 4xx/5xx of failed).

---

## API-route

- **Pad:** `app/api/newsletter/subscribe/route.ts`
- **Methode:** `POST`
- Er zijn **geen** early returns die een request blokkeren; de frontend doet de validatie. Ontbrekende env-variabelen zorgen voor een **response** (503 of 500), geen "geen request".

---

## Vereiste environment-variabelen (newsletter)

| Variabele | Gebruik | In `.env.local`? |
|-----------|--------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project-URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin (insert/update subscribers) | ✅ |
| `RESEND_API_KEY` | Resend API (bevestigingsmail) | ❌ **ontbreekt** |
| `RESEND_FROM_EMAIL` of `RESEND_FROM` | Afzenderadres van de mail | ✅ (`RESEND_FROM_EMAIL`) |

Zonder `RESEND_API_KEY` kan de bevestigingsmail niet worden verstuurd. De API geeft dan een 500 met boodschap zoals "Email service is not configured." (zie `lib/sendMail.ts`). De **inschrijving** in de database slaagt wel; alleen de mail faalt.

---

## Samenvatting: geen request in Network-tab

Als er **geen** request naar `/api/newsletter/subscribe` in de Network-tab staat, komt de foutmelding altijd door **client-side validatie** (leeg of ongeldig e-mailveld). De fetch wordt dan bewust niet aangeroepen. Met de nieuwe teksten zie je nu "Please enter a valid email address" (of vertaling) in plaats van "Something went wrong". In development kun je in de console zien of het om "leeg" of "ongeldig formaat" ging.
