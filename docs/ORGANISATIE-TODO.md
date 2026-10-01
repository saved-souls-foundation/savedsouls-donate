# TODO-lijst voor Saved Souls Foundation – toegang & integraties

Overzicht van wat de organisatie moet regelen om de website volledig te laten werken. **Jij hebt toegang nodig** voor alle onderstaande punten.

---

## 1. Adoptie-dieren (`/adopt`) en sponsor-API

**Status:** `/adopt` haalt honden en katten **uitsluitend** op uit `db.savedsouls-foundation.org` (`/api/dogs.php` en `/api/cats.php`), via `lib/animals-api.ts` en `GET /api/animals`. Geen vast array, geen Supabase.

**Belangrijk — twee losse systemen:**

| Bron | Waar | Wat het voedt |
|------|------|----------------|
| PHP-database `db.savedsouls-foundation.org` | Extern, niet in deze repo | Publieke adoptiepagina `/adopt` + detailpagina’s |
| Supabase-tabel `dieren` + admin `/admin/dieren` | Deze Next.js-app | Intern beheer (gezondheid, status in_opvang/foster/…). **Niet gekoppeld aan `/adopt`.** Een dier toevoegen in admin verschijnt **niet** op de adoptiepagina. |

De beheerder van de PHP-database is **nog niet vastgesteld**. CRUD (toevoegen/wijzigen/verwijderen van adoptiedieren) gebeurt in dat PHP-systeem, niet in deze repo.

**Cache:** Next.js cache’t de PHP-fetch 1 uur (tag `animals`). Direct legen: `POST /api/revalidate` met `REVALIDATE_SECRET` (Vercel env). Zet die secret in Vercel.

**Sponsor-API:** aparte PHP-endpoints (`website_sponsor_dogs.php` / `website_sponsor_cats.php`).

**Actie:** achterhaal wie `db.savedsouls-foundation.org` beheert, en kies daarna één lijn:

### Optie A — PHP blijft de bron van `/adopt`

- Vraag API-documentatie en toegang.
- Laat de PHP-API een statusveld toevoegen (`status` / `available` / `adopted` / `deceased` / `is_active`). De site filtert die velden al defensief; zonder veld blijft het huidige gedrag.
- Voordeel: bestaande opvang-workflow blijft; website volgt de database die al in gebruik is.
- Nadeel: twee systemen blijven naast elkaar; admin `/admin/dieren` is geen echte adoptie-CMS; afhankelijk van een externe server waarvan de beheerder nog onbekend is.

### Optie B — overstappen op Supabase `dieren`

- `/adopt` lezen uit de tabel die admin al beheert; PHP-API afbouwen.
- Voordeel: één bron, CRUD in het bestaande admin-scherm, cache/revalidate in eigen hand.
- Nadeel: migratie van ~200+ dieren, foto’s (`/Uploads/…`), verhalen en IDs; tot die tijd twee waarheden.

**Sponsor:** vraag of er een sponsor-endpoint is; zo niet: specificaties voor een nieuw endpoint of dezelfde keuze (PHP vs Supabase).

---

## 2. Facebook token (blog-sync)

**Status:** Script bestaat (`npm run sync-facebook-blog`), maar heeft `FB_ACCESS_TOKEN` nodig.

| Stap | Wat te doen |
|------|-------------|
| 1 | Ga naar [developers.facebook.com](https://developers.facebook.com) |
| 2 | Maak een app (of gebruik bestaande) |
| 3 | Voeg "Facebook Login" en "Page Public Content Access" toe |
| 4 | Genereer een **Page Access Token** voor de pagina Saved Souls Foundation |
| 5 | Zet in Vercel: `FB_ACCESS_TOKEN=...` (Environment Variables) |

**Let op:** User tokens verlopen. Voor productie: **System User Token** of **Page Access Token** met lange geldigheid.

**Actie:** Wie heeft admin-rechten op de Facebook-pagina? Die persoon moet de token aanmaken.

---

## 3. E-mail – formulieren & auto-reply koppelen aan savedsouls-foundation.org

**Status:** Formulieren gebruiken Resend. Notificaties gaan naar info@savedsouls-foundation.com, info@savedsouls-foundation.org en mike@savedsouls-foundation.org (monitor).

| Wat | Huidige situatie | Toegang nodig |
|-----|------------------|---------------|
| **Resend-account** | API verstuurt e-mails | Account op [resend.com](https://resend.com) |
| **RESEND_API_KEY** | Moet in Vercel staan | API key uit Resend-dashboard |
| **RESEND_FROM** | Nu: `onboarding@resend.dev` (Resend test-domein) | Voor productie: `noreply@savedsouls-foundation.org` of `website@savedsouls-foundation.org` |
| **ADMIN_EMAIL** | Optioneel (fallback: info@savedsouls-foundation.org) | E-mailadres voor Stripe-webhook-notificaties (betalingsprobleem, abonnement gestopt). Zet in `.env.local` / Vercel indien anders dan fallback. |
| **Domeinverificatie** | Voor `@savedsouls-foundation.org` als afzender | DNS-toegang (TXT/SPF/DKIM records) |

**Formulieren die e-mail sturen:**
- Contactformulier → `info@savedsouls-foundation.org` + auto-reply naar bezoeker
- Adoptie-aanvraag → `info@savedsouls-foundation.org` + auto-reply
- Vrijwilliger aanmelding → `info@savedsouls-foundation.org` + auto-reply

**Waarom komt mail niet aan (wel zichtbaar in Resend)?**  
Met het testdomein `onboarding@resend.dev` accepteert Resend de mail (je ziet hem in het dashboard), maar **levert alleen naar het e-mailadres dat in je Resend-account geverifieerd is**. Andere ontvangers (info@, volunteer@, formulier-indieners) krijgen niets. Oplossing: eigen domein verifiëren en `RESEND_FROM` zetten.

**Actie:**
1. Resend-account aanmaken (of bestaande gebruiken)
2. Domein `savedsouls-foundation.org` toevoegen in Resend
3. DNS-records instellen (Resend geeft instructies: TXT/SPF/DKIM)
4. In Vercel: `RESEND_API_KEY` en `RESEND_FROM` zetten, bijv. `RESEND_FROM=Saved Souls Website <noreply@savedsouls-foundation.org>`

---

## 4. Betalingen (Mollie)

**Status:** iDEAL/Wero werkt via Mollie. Zonder key wordt alleen PayPal getoond.

| Wat | Toegang nodig |
|-----|---------------|
| **MOLLIE_API_KEY** | Mollie-account op [mollie.com](https://mollie.com) |
| **Live key** | Na testfase: live API key voor echte betalingen |

**Actie:** Mollie-account aanmaken of koppelen aan Saved Souls Foundation. Live key in Vercel zetten.

---

## 5. CMS / admin-login (optioneel)

**Status:** Er is een CMS-gedeelte. Zonder variabelen is login uitgeschakeld.

| Wat | Toegang nodig |
|-----|---------------|
| **ADMIN_USERNAME** | Zelf te kiezen |
| **ADMIN_PASSWORD** | Sterk wachtwoord |

**Actie:** Alleen nodig als het CMS gebruikt wordt. Zet in Vercel Environment Variables.

---

## 6. Vercel-dashboard

**Status:** Site draait op Vercel. Environment variables worden daar ingesteld.

| Wat | Toegang nodig |
|-----|---------------|
| **Vercel-account** | [vercel.com](https://vercel.com) – project savedsouls-donate |
| **Environment Variables** | Alle keys (RESEND, MOLLIE, FB, ADMIN, `REVALIDATE_SECRET` voor adoptie-cache) |

**Actie:** Zorg dat de juiste persoon(s) toegang hebben tot het Vercel-project.

---

## 7. Overige toegang

| Item | Waarvoor |
|------|----------|
| **GitHub** | Code-aanpassingen, deploys (al gekoppeld) |
| **Domein savedsouls-foundation.org** | DNS voor e-mail (Resend), eventueel custom domain op Vercel |
| **E-mailadressen** | `info@`, `volunteer@`, `noreply@` of `website@` – moeten bestaan en bereikbaar zijn |

---

## Samenvatting – checklist

- [ ] **API sponsor:** Toegang/ specificaties voor sponsor-honden/katten API
- [ ] **Facebook:** Page Access Token voor blog-sync
- [ ] **Resend:** Account + domeinverificatie + `RESEND_API_KEY` + `RESEND_FROM`
- [ ] **Mollie:** Account + `MOLLIE_API_KEY` (live)
- [ ] **Vercel:** Toegang + alle environment variables invullen
- [ ] **DNS:** Toegang voor e-mailverificatie (TXT/SPF/DKIM)
- [ ] **E-mailadressen:** Controleren dat info@ en volunteer@ werken

---

## Waar zet ik de keys?

Alle **Environment Variables** komen in **Vercel**:

1. Ga naar [vercel.com](https://vercel.com) → project savedsouls-donate
2. Settings → Environment Variables
3. Voeg toe: `RESEND_API_KEY`, `MOLLIE_API_KEY`, `FB_ACCESS_TOKEN`, `RESEND_FROM`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
4. Kies Environment: Production (en eventueel Preview)
5. Redeploy na het toevoegen
