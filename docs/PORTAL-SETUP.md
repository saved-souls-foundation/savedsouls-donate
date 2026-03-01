# Portal & Admin Dashboard – Setup

## 1. Database (Supabase)

Voer de migratie uit in **Supabase SQL Editor**:

- Bestand: `supabase/migrations/20250301_profiles_portal.sql`

Daarna in **Supabase Dashboard → Database → Replication**: zet **Realtime** aan voor de tabel `profiles`, zodat gebruikers live updates zien wanneer de admin hun stap wijzigt.

**Eerste admin-account:** Zet voor minimaal één gebruiker in de tabel `profiles` de kolom `role` op `'admin'` (bijv. via SQL of Table Editor), zodat die gebruiker toegang krijgt tot `/admin/dashboard`.

## 2. Login & doorverwijzing

- **Login:** `/[locale]/dashboard/login` – twee kaarten (Vrijwilliger / Adoptant), daarna hetzelfde e-mail/wachtwoord-formulier.
- **Rol bij registratie:** De gekozen kaart bepaalt de rol in `profiles` (vrijwilliger of adoptant).
- **Na inloggen:** Doorverwijzing op basis van `profiles.role`:
  - `admin` → `/[locale]/admin/dashboard`
  - `vrijwilliger` → `/[locale]/portal/vrijwilliger`
  - `adoptant` → `/[locale]/portal/adoptant`
  - geen profiel/geen rol → `/[locale]/portal/onboarding`

## 3. Beveiligde routes

In `proxy.ts` worden deze routes alleen voor ingelogde gebruikers toegankelijk gemaakt; anders redirect naar login:

- `/[locale]/portal/*`
- `/[locale]/admin/dashboard`

Het bestaande CMS (`/[locale]/admin`) blijft zoals het is (eigen cookie-auth).

## 4. E-mail bij stapwijziging

Bij wijziging van de stap in het admin-dashboard wordt een notificatie verstuurd via **Resend** (bestaande configuratie: `RESEND_API_KEY`, `RESEND_FROM`). Endpoint: `POST /api/portal/notify-step` met body `{ email, naam, stepLabel, role }`.

## 5. Kleur

Portal en login gebruiken de huisstijlkleur **#2d5a27** (groen).
