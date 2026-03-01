# Overzicht: huidige staat + vervolgprompt Admin Dashboard

**Doel:** Dit document geeft de actuele stand van het project. Gebruik het samen met het volledige prompt-document (`cursor-prompt-admin-dashboard.md`) zodat Claude (of een andere agent) het admin-gedeelte kan bouwen zonder bestaande onderdelen te breken.

---

## 1. Wat er nu staat (klaar / niet aanpassen)

### Database (Supabase)

- **Migratie `20250301_profiles_portal.sql`** — uitgevoerd.
  - Tabel `profiles`: `id`, `role` ('vrijwilliger'|'adoptant'|'admin'), `voornaam`, `achternaam`, `huidige_stap` (1–4), `notities`, `aangemeld_op`, `updated_at`, `is_admin`, evt. `user_type`/`email`.
- **Migratie `20250301_volunteer_onboarding.sql`** — uitgevoerd.
  - Tabel `volunteer_onboarding`: `user_id`, `voornaam`, `achternaam`, `email`, `phone`, `city`, `area`, `motivation`, `call_preference`, `language`, `step` (1–4), `id_doc_paths`, `vog_doc_paths`, `certs_doc_paths`, `extra_doc_paths`, `created_at`, `updated_at`.
  - RLS op `volunteer_onboarding` en op `storage.objects` voor bucket `volunteer-docs`.

### Storage

- Bucket **`volunteer-docs`** — aangemaakt (private, 10 MB, MIME: application/pdf).
- Padstructuur: `{user_id}/id/`, `{user_id}/vog/`, `{user_id}/certs/`, `{user_id}/extra/`.

### Frontend (portal + vrijwilliger)

- **Login (portaal):** `app/[locale]/dashboard/login/page.tsx` — rolkeuze (Vrijwilliger/Adoptant), Supabase `signInWithPassword`, doorverwijzing op basis van `profiles.role`.
- **Onboarding:**  
  - `app/[locale]/portal/onboarding/page.tsx` — eerste stap (rol + naam), update `profiles`.  
  - `app/[locale]/portal/onboarding/volunteer/page.tsx` — 4-stappen vrijwilliger-flow, rendert `VolunteerOnboarding`.
- **Dashboards:**  
  - `app/[locale]/portal/vrijwilliger/page.tsx` — vrijwilligersdashboard.  
  - `app/[locale]/portal/adoptant/page.tsx` — adoptantdashboard.
- **Component:** `app/components/VolunteerOnboarding.tsx` — 4 stappen, formulier + PDF-upload; gebruikt `lib/volunteerOnboarding.ts` voor laden/opslaan/upload. **Alleen stap 3 teksten/hints/Thailand-context mogen worden aangepast; upload- en lib-logica niet.**

### API

- **`app/api/portal/notify-step/route.ts`** — POST, body: `{ email, naam?, stepLabel, role? }`. Verstuurt e-mail via Resend bij stapwijziging. **Niet aanpassen.**

### Lib (niet aanpassen)

- `lib/volunteerOnboarding.ts` — `loadOnboarding`, `saveOnboardingStep`, `uploadOnboardingFiles`.
- `lib/supabase/client.ts` — `createClient()` (browser).
- `lib/supabase/server.ts` — server client.
- `lib/supabase/admin.ts` — service role client (o.a. voor signed URLs in admin).

### Beveiliging (nu)

- **`proxy.ts`** (fungeert als Next.js middleware):  
  - Beschermt `/[locale]/portal/*` en `/[locale]/admin/dashboard`.  
  - Geen sessie → redirect naar `/[locale]/dashboard/login` (portaal-login).  
  - Er is **geen** aparte admin-login; admin/dashboard gebruikt dezelfde portaal-login en checkt daarna `role === 'admin'` in de pagina.

### Bestaande admin-routes (let op)

- **`app/[locale]/admin/page.tsx`** — **oud CMS**: cookie-auth via `/api/auth/login`, dieren + aanvragen (adopt/volunteer/sponsor). Geen Supabase auth. Blijf dit bestand laten bestaan; de nieuwe admin-flow komt ernaast (eigen login + layout + dashboard/vrijwilligers/adoptanten/documenten).
- **`app/[locale]/admin/dashboard/page.tsx`** — **Supabase-based** dashboard: laadt `profiles`, tabs vrijwilliger/adoptant, checkt `role === 'admin'`, redirect naar `/dashboard/login`. Geen `volunteer_onboarding`-join, geen statkaartjes, geen aparte pagina’s. Het **vervolgprompt** vraagt om dit dashboard te **vervangen/uitbreiden** volgens de spec (4 kaartjes, 2 tabellen, daarna doorlink naar aparte pagina’s).

### Admin-user (voorbeeld)

- E-mail: `mike@savedsouls-foundation.org`
- In `profiles`: `role = 'admin'` én `is_admin = true`
- User ID: `f5e24af4-9cb7-4901-84d1-025300b59c20`

---

## 2. Wat het vervolgprompt vraagt om te bouwen

(Volledige specificatie staat in `cursor-prompt-admin-dashboard.md`; hier alleen de koppen.)

1. **Admin Login** — `app/[locale]/admin/login/page.tsx`: Supabase inloggen, check `is_admin === true` of `role === 'admin'`; zo niet → signOut + foutmelding. Redirect naar `/[locale]/admin/dashboard`. Logo + “Admin” + subtitel Thailand.
2. **Middleware** — In `proxy.ts`: alle `/[locale]/admin/*` beveiligen; geen sessie → redirect naar `/[locale]/admin/login`. Optioneel: server-side check `is_admin` voor admin-routes. **Bestaande portal-bescherming intact laten.**
3. **Admin Layout** — `app/[locale]/admin/layout.tsx`: zijbalk (Dashboard, Adoptanten, Vrijwilligers, Documenten, Uitloggen). Uitloggen: `signOut` + redirect naar `/[locale]/admin/login`.
4. **Admin Dashboard** — `app/[locale]/admin/dashboard/page.tsx`: 4 statkaartjes (vrijwilligers totaal/voltooid stap 4, adoptanten totaal/voltooid stap 4), 2 tabellen “laatste 5” (vrijwilligers uit `volunteer_onboarding` + profiles, adoptanten uit `profiles`). Server component, `lib/supabase/server.ts`.
5. **Admin Vrijwilligers** — `app/[locale]/admin/vrijwilligers/page.tsx`: data uit `volunteer_onboarding` (join profiles voor e-mail), zoekbalk, tabel, modal/detail + “Stap bijwerken” (update `volunteer_onboarding.step` + aanroep `POST /api/portal/notify-step`).
6. **Admin Adoptanten** — `app/[locale]/admin/adoptanten/page.tsx`: data uit `profiles` waar `role = 'adoptant'`, zoekbalk, notities bewerken, “Stap bijwerken” (`profiles.huidige_stap` + notify-step).
7. **Admin Documenten** — `app/[locale]/admin/documenten/page.tsx`: documenten uit `volunteer_onboarding` (id/vog/certs/extra paden), flatten naar rijen per bestand, tabel + “Bekijken” = signed URL (60 s) via `lib/supabase/admin.ts`, bucket `volunteer-docs`. Informatieblok + link naar vrijwilligersbrochure-PDF.
8. **VolunteerOnboarding stap 3** — Alleen teksten/hints aanpassen: Thailand-context, nieuwe badge/titel/subtekst, brochurelink, nieuwe hints per uploadveld. **Geen wijzigingen in upload-logica of lib.**

Design tokens en fonts staan in het volledige prompt-document (o.a. `--adm-bg`, `--adm-sidebar`, `--adm-accent`, Playfair Display, DM Sans).

---

## 3. Samenvatting voor de agent

- **Niet wijzigen:** portal-routes, `lib/volunteerOnboarding.ts`, `lib/supabase/*`, `notify-step` API, upload-logica in `VolunteerOnboarding.tsx`. Bestaande `app/[locale]/admin/page.tsx` (oud CMS) laten bestaan.
- **Wel doen:** Admin-login, middleware voor `/admin/*`, admin layout met zijbalk, nieuw dashboard (kaartjes + tabellen), aparte pagina’s vrijwilligers/adoptanten/documenten, en alleen de **teksten** van VolunteerOnboarding stap 3 (Thailand + brochure).
- **Let op:** Er zijn twee “admin”-plekken: het oude CMS op `/[locale]/admin` (page.tsx, cookie-auth) en het nieuwe Supabase-admin (login, dashboard, vrijwilligers, adoptanten, documenten). De prompt gaat over het **nieuwe** Supabase-admin; het oude CMS blijft zoals het is.

---

## 4. Checklist (uit het prompt-document)

**Supabase (handmatig):**  
Migraties uitgevoerd, bucket `volunteer-docs` aangemaakt, Realtime voor `profiles` aan, admin-user heeft `role = 'admin'` en `is_admin = true`.

**Code:**  
Middleware uitbreiden; admin login; admin layout; dashboard (4 kaartjes + 2 tabellen); vrijwilligerspagina (tabel + modal + stap + e-mail); adoptantenpagina (tabel + modal + notities + stap + e-mail); documentenpagina (brochure + signed URL); VolunteerOnboarding alleen stap 3 teksten; responsive; NL-foutmeldingen.

---

*Gebruik dit overzicht samen met het volledige prompt-bestand om het admin-gedeelte eenduidig te implementeren.*
