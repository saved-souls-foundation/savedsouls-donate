# Staat van het project — Overzicht voor Claude AI

**Project:** savedsouls-donate  
**Laatste update:** maart 2025  
**Doel:** Website voor Saved Souls Foundation (dierenopvang Thailand): donaties, adoptie, vrijwilligers, nieuwsbrief, admin-panel.

---

## 1. Tech stack

| Onderdeel | Technologie |
|-----------|-------------|
| Framework | Next.js 16 (App Router), React 19 |
| Taal | TypeScript |
| Styling | Tailwind CSS 4 |
| i18n | next-intl (locales: nl, en, de, es, th, ru, fr) |
| Database / Auth | Supabase (PostgreSQL, RLS, Auth) |
| E-mail | Resend |
| Betalingen | Mollie, Stripe, PayPal (webhooks) |
| Overig | Lucide icons, TipTap (editor), @dnd-kit (drag-and-drop), jsPDF |

**Belangrijke paden:**
- App-routes: `app/[locale]/...` (alle pagina’s onder locale)
- Admin (nieuw): `app/[locale]/admin/(nieuw)/...`
- API: `app/api/...`
- Lib: `lib/` (o.a. Supabase-clients, e-mail, services)
- Vertalingen: `messages/{nl,en,de,es,th,ru,fr}.json`

---

## 2. Routing & locale

- **Default locale:** nl  
- **URL-vorm:** `/[locale]/pad` (bijv. `/nl/donate`, `/en/contact`)  
- **Link-component:** `import { Link } from "@/i18n/navigation"` (locale blijft behouden)  
- **Config:** `i18n/routing.ts` — `defineRouting({ locales: ["nl","en","de","es","th","ru","fr"], defaultLocale: "nl", localePrefix: "always" })`

---

## 3. Supabase

### 3.1 Clients

- **Server (met sessie):** `import { createClient } from "@/lib/supabase/server"` — gebruikt cookies, voor RLS met ingelogde gebruiker.
- **Admin (bypass RLS):** `import { createAdminClient } from "@/lib/supabase/admin"` — gebruikt `SUPABASE_SERVICE_ROLE_KEY`, alleen op server (API routes, server components die alles mogen zien).
- **Browser:** `import { createClient } from "@/lib/supabase/client"` — voor client components.

**Env:**  
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (voor admin).

### 3.2 Belangrijke tabellen (public)

| Tabel | Doel |
|-------|------|
| **profiles** | Gebruikers: role (admin, vrijwilliger, adoptant), is_admin, voornaam, achternaam, huidige_stap, e.d. |
| **volunteer_onboarding** | Vrijwilligersaanmeldingen, stappen, documenten |
| **adoption_applications** | Adoptieaanvragen |
| **newsletter_subscribers** | Nieuwsbrief: email, voornaam, achternaam, type (persoon/bedrijf), language, actief, unsubscribe_token, aangemeld_op, uitgeschreven_op |
| **newsletter_templates** | Voorbeeld-/sjabloon-nieuwsbrieven (titel, subject_nl/en, body_nl/en, volgorde) |
| **newsletter_sends** | Historie verzonden nieuwsbrieven |
| **email_templates** | E-mailtemplates (naam, categorie, onderwerp, inhoud per taal) |
| **incoming_emails** | Binnenkomende mails (e-mailassistent), status: in_behandeling, verstuurd, genegeerd |
| **sent_emails** | Verzonden mails (historie) |
| **members** | Leden (voornaam, achternaam, email, status actief/inactief, type persoon/bedrijf) |
| **donors** / **donations** / **recurring_donations** | Donateurs en donaties (Mollie/Stripe) |
| **sponsors** | Sponsoren, contract_periode, status |
| **berichten** | Berichten vrijwilliger ↔ coördinator (afzender_id, ontvanger_id, voor_iedereen, inhoud, gelezen) |
| **calendar_events** | Agenda (titel, start/end, categorie, dier, bijlagen) |
| **volunteers** / **roster_shifts** | Rooster: vrijwilligers en shifts (zone, task, day_of_week, time_slot, week_start) |
| **scheduled_posts** | Social media planner (geplande posts) |

RLS: veel tabellen gebruiken `public.is_admin()` (functie op basis van `profiles.role` / `profiles.is_admin`).  
Nieuwsbrief: anon mag INSERT op `newsletter_subscribers` (policy voor aanmelding formulier).

### 3.3 Migraties

Staan in `supabase/migrations/` (datum-prefix, bijv. `20250301_admin_expansion.sql`).  
Lokaal of in Supabase SQL Editor uitvoeren; volgorde respecteren.

---

## 4. Admin-panel

- **Login:** `/[locale]/admin/login`  
- **Layout:** `app/[locale]/admin/(nieuw)/layout.tsx` + `AdminLayoutClient.tsx` (sidebar, uitloggen).
- **Toegang:** Alleen als `profiles.role === 'admin'` of `profiles.is_admin === true`.

**Sidebar (hoofdroutes):**

- Dashboard → `/admin/dashboard`
- Adoptanten → `/admin/adoptanten`
- Vrijwilligers → `/admin/vrijwilligers`
- Documenten → `/admin/documenten`
- **Mensen:** Leden → `/admin/leden`
- **Mensen:** Nieuwsbrief → `/admin/nieuwsbrief` (abonnees, opstellen, versturen)
- **Financiën:** Donateurs → `/admin/donateurs`, Sponsoren → `/admin/sponsoren`
- **Planning:** Agenda → `/admin/agenda`, Rooster → `/admin/rooster`
- **Communicatie:** E-mailassistent → `/admin/emails`, Sociale media → `/admin/sociale-media`

Dashboardkaarten linken naar deze routes (bijv. “Nieuwsbriefabonnees” → `/admin/nieuwsbrief`).  
Extra kaarten: “Automatische antwoorden” en “Nieuwsbrieven” (templates) openen een modal met lijst en CRUD.

---

## 5. Portaal (vrijwilliger / adoptant)

- **Login:** `/[locale]/dashboard/login` (keuze Vrijwilliger / Adoptant, daarna inloggen).
- **Onboarding:** `/[locale]/portal/onboarding` (rol + voornaam), daarna doorverwijzing.
- **Vrijwilliger:** `/[locale]/portal/vrijwilliger` — voortgang (thermometer), link naar adoptantenportaal, **Berichten**-sectie (berichten aan coördinator, lijst van berichten).
- **Adoptant:** `/[locale]/portal/adoptant` — voortgang, adoptieaanvragen, links naar dierpagina’s.

Data uit `profiles`, `volunteer_onboarding`, `adoption_applications`; berichten uit `berichten` (API: `app/api/portal/berichten`).

---

## 6. API (kern)

- **Auth:** Admin-routes gebruiken vaak `requireAdmin()` (server createClient voor user + profile, daarna createAdminClient voor data).
- **Nieuwsbrief:**  
  - `POST /api/newsletter/subscribe` — aanmelding (anon of admin client), schrijft in `newsletter_subscribers`, stuurt bevestigingsmail via `lib/newsletterConfirmation.ts` (Resend).  
  - `GET/POST /api/admin/newsletter` — lijst abonnees (met debug-log), toevoegen abonnee; tabel `newsletter_subscribers`.  
  - `DELETE /api/admin/newsletter/[id]` — soft delete (actief = false).  
  - `DELETE /api/admin/newsletter/[id]/delete` — definitief verwijderen.
- **E-mail:** Resend via `lib/sendMail.ts`; from-adres o.a. `RESEND_FROM_EMAIL` of `Saved Souls Foundation <info@savedsouls-foundation.com>`.
- **Overige:** Donaties (Mollie/Stripe/PayPal webhooks), portal (notify-step, welcome-complete, send-travel-plan, berichten), agenda, rooster, sociale-media, e-mailassistent.

---

## 7. E-mail (Resend)

- **Config:** `lib/sendMail.ts` — `RESEND_API_KEY`, `RESEND_FROM_EMAIL` of `RESEND_FROM`.
- **Nieuwsbriefbevestiging:** `lib/newsletterConfirmation.ts` — directe Resend-aanroep, signatuur `sendNewsletterConfirmation({ email, naam?: string })`, log `=== MAIL RESULT ===` / `=== MAIL ERROR ===`.
- **Huisstijl:** `lib/emailLayout.ts` — `wrapAutoReplyEmail` voor header/footer/donatieknop/socials (niet gebruikt in de huidige eenvoudige nieuwsbriefbevestiging).

---

## 8. i18n

- Namespaces in `messages/*.json` (bijv. `admin`, `admin.newsletter`, `dashboard`).
- Gebruik: `useTranslations("admin")`, `t("newsletter.title")`; server: `getTranslations("admin")`.
- Admin-nieuwsbrief: o.a. `deleteButton`, `deleteConfirm`, `addSubscriber`, `emailExistsError`.

---

## 9. Conventies voor ontwikkelaars / AI

- **Locale in URLs:** Altijd `/[locale]/...`; links via `@/i18n/navigation`.
- **Supabase:** Server + RLS = `createClient()` (server); admin/API die alles moet zien = `createAdminClient()` (service role). Geen service role key → admin API kan 503/throw geven.
- **Nieuwsbrief:** Eén tabel `newsletter_subscribers`; actieve abonnees: `actief = true`. Dashboard en admin-lijst moeten dezelfde logica gebruiken (zelfde tabel + filter).
- **Wijzigingen in schema:** Nieuwe migratie in `supabase/migrations/` toevoegen en (lokaal of in dashboard) uitvoeren.
- **Geen dieren-tabel in Supabase:** Dieren komen uit externe API; `animal_id` in o.a. agenda is losse UUID.

---

## 10. Handige bestanden

| Bestand | Doel |
|---------|------|
| `lib/supabase/server.ts` | Server Supabase client (cookies) |
| `lib/supabase/admin.ts` | Admin client (service role) |
| `lib/supabase/client.ts` | Browser client |
| `lib/sendMail.ts` | Resend-wrapper, NOTIFICATION_EMAILS |
| `lib/newsletterConfirmation.ts` | Nieuwsbriefbevestigingsmail (Resend) |
| `lib/emailLayout.ts` | Huisstijl e-mail (wrapAutoReplyEmail) |
| `app/[locale]/admin/(nieuw)/layout.tsx` | Admin layout (sidebar, auth) |
| `app/[locale]/admin/(nieuw)/AdminLayoutClient.tsx` | Sidebar-navigatie |
| `docs/OVERZICHT-USER-ADMIN-FRONT-BACKEND.md` | Gedetailleerd overzicht portaal + admin |

---

*Dit document is bedoeld om snel de huidige stand van het project te begrijpen bij verder bouwen of debuggen (o.a. voor Claude AI).*
