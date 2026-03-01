# Portal & Admin Dashboard – Setup

## 1. Database (Supabase)

**Verplicht:** Voer de migratie uit in **Supabase SQL Editor** (Project → SQL Editor → New query):

- Kopieer de inhoud van: `supabase/migrations/20250301_profiles_portal.sql`
- Plak in de SQL Editor en klik **Run**
- Dit voegt o.a. de kolommen `role`, `voornaam`, `huidige_stap`, `notities` toe aan de tabel `profiles`

**Als je de fout ziet:** *"Could not find the 'huidige_stap' column of 'profiles' in the schema cache"*:
1. Controleer of de migratie hierboven succesvol is uitgevoerd (geen rode foutmelding).
2. Vernieuw het schema-cache: **Supabase Dashboard → Settings → API** → onderaan **"Reload schema cache"** (of wacht 1–2 minuten).
3. Vernieuw de portal-pagina en probeer opnieuw.

Voer daarna ook de migratie **`supabase/migrations/20250301_adoption_applications_extra_and_rls.sql`** uit (zelfde SQL Editor). Die voegt de kolom `extra_animals` toe aan `adoption_applications` en een RLS-policy zodat adoptanten hun eigen adoptieaanvragen kunnen zien in het portaal.

Daarna in **Supabase Dashboard → Database → Replication**: zet **Realtime** aan voor de tabel `profiles`, zodat gebruikers live updates zien wanneer de admin hun stap wijzigt.

**Eerste admin-account:** Zet voor minimaal één gebruiker in de tabel `profiles` de kolom `role` op `'admin'` (bijv. via SQL of Table Editor), zodat die gebruiker toegang krijgt tot `/admin/dashboard`.

### Waar zie ik of iemand admin is? (Supabase)

1. **Supabase Dashboard** → **Table Editor** → tabel **`profiles`**.
2. Zoek de rij van de gebruiker (op **email** of op **id**; **id** moet overeenkomen met de **User UID** uit Authentication).
3. Kijk naar de kolommen:
   - **`role`** = **`admin`** → gebruiker is admin, of
   - **`is_admin`** = **true** (vinkje) → gebruiker is admin.
4. Als geen van beide is ingesteld, krijgt de gebruiker na inloggen de melding "Je hebt geen toegang tot het beheerpaneel" en wordt uitgelogd.

**Let op:** Admin-rechten worden pas gecontroleerd **nadat** het inloggen is gelukt. De fout **"Invalid login credentials"** betekent dat Supabase Auth het e-mail/wachtwoord-combo niet herkent (verkeerd wachtwoord of dit e-mailadres bestaat nog niet in **Authentication → Users**). Controleer in **Supabase → Authentication → Users** of het e-mailadres daar staat; zo niet, log eerst eenmalig in via **Dashboard login** (`/dashboard/login`) om het account aan te maken, of maak de gebruiker aan in Authentication. Daarna in **profiles** de bijbehorende rij zoeken (zelfde **id** als in Auth) en **role** = `admin` of **is_admin** = true zetten.

## 2. Login & doorverwijzing

- **Portaal-login:** `/[locale]/dashboard/login` – twee kaarten (Vrijwilliger / Adoptant), daarna hetzelfde e-mail/wachtwoord-formulier.
- **Admin-login:** `/[locale]/admin/login` – direct inloggen met e-mail en wachtwoord. Alleen accounts met `profiles.role = 'admin'` of `profiles.is_admin = true` krijgen toegang; anderen worden uitgelogd. Op de admin-loginpagina staat ook **Wachtwoord vergeten?** (herstellink naar e-mail).  
  **Als de herstellink naar de homepage gaat (puinhoop):** Supabase stuurt alleen naar een URL die **exact** in de allowlist staat. Doe het volgende:
  1. **Supabase → Authentication → URL Configuration → Redirect URLs:** voeg exact deze URLs toe (zelfde host als hieronder):
     - `https://savedsouls-foundation.com/nl/dashboard/update-password`
     - `https://savedsouls-foundation.com/en/dashboard/update-password`
     - Lokaal: `http://localhost:3000/nl/dashboard/update-password` en `http://localhost:3000/en/dashboard/update-password`
  2. **Vercel (of .env.production):** zet de variabele **`NEXT_PUBLIC_SITE_URL`** op precies dezelfde basis als in stap 1, **zonder** trailing slash, bijv. `https://savedsouls-foundation.com`. (Als je in Supabase wél `https://www.savedsouls-foundation.com` gebruikt, zet dan `NEXT_PUBLIC_SITE_URL=https://www.savedsouls-foundation.com`.)
  3. **Redeploy** na het zetten van de env var, zodat de herstellink in de mail naar de juiste URL wijst. Zonder match tussen Redirect URL en `NEXT_PUBLIC_SITE_URL` gaat Supabase naar de Site URL (homepage).
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

## 5. Vrijwilliger-onboarding (formulier + documenten)

De 4-stappen flow op `/[locale]/portal/onboarding/volunteer` slaat gegevens op in de tabel `volunteer_onboarding` en PDF’s in een Storage-bucket. **Je moet twee dingen eenmalig doen:**

### Stap A: Migratie uitvoeren

1. Ga in Supabase naar **SQL Editor** (linkermenu) → **New query**.
2. Open in dit project het bestand `supabase/migrations/20250301_volunteer_onboarding.sql`, kopieer de volledige inhoud en plak die in de query-editor.
3. Klik op **Run** (of Ctrl/Cmd+Enter).
4. Controleer dat er geen rode foutmelding verschijnt. De migratie maakt de tabel `volunteer_onboarding` aan en de RLS-policies voor die tabel en voor Storage.

### Stap B: Storage-bucket aanmaken

1. Ga in Supabase naar **Storage** (linkermenu) → **New bucket**.
2. Vul in:
   - **Name:** `volunteer-docs` (exact zo, zonder spaties)
   - **Public bucket:** uit (private)
   - **File size limit:** `10` MB (of 10485760 bytes)
   - **Allowed MIME types:** `application/pdf` (één type is voldoende)
3. Sla de bucket op. De rechten (wie mag wat uploaden/lezen) worden al door de migratie geregeld: gebruikers alleen in hun eigen map, admins kunnen alles in de bucket zien.

Daarna werkt de flow: formulier en stap (1–4) in `volunteer_onboarding`, PDF’s (ID, VOG, certificaten, overig) in de bucket; de app laadt bestaande data bij het openen van de flow.

## 6. Kleur

Portal en login gebruiken de huisstijlkleur **#2d5a27** (groen).

## 7. Checklist: zie ik nog de oude portal-pagina?

Als `/portal/vrijwilliger` of `/portal/adoptant` nog de oude versie toont (geen keuzebalk, geen rode Doneren-knop, geen achtergrond):

1. **Browser-cache:** Hard refresh: **Ctrl+Shift+R** (Windows/Linux) of **Cmd+Shift+R** (Mac). Of open de URL in een **incognito/privévenster**.
2. **force-dynamic:** Staat zowel op de **portal layout** (`app/[locale]/portal/layout.tsx`: `export const dynamic = "force-dynamic"`) als op de **page** (`app/[locale]/portal/vrijwilliger/page.tsx`: zelfde export). Zo wordt de route niet statisch gecached.
3. **Oude dev-server:** Draait er nog een eerdere `npm run dev`? Stop die (of `kill -9` op poort 3000) en start **één** keer opnieuw: `npm run dev`.
4. **Bestanden opgeslagen:** Controleer in Cursor of alle wijzigingen zijn opgeslagen (geen onopgeslagen wijzigingen in de portal- en login-bestanden).
5. **.next verwijderd terwijl server draaide?** Als je `.next` hebt verwijderd terwijl `npm run dev` nog liep, moet de dev-server **daarna** opnieuw gestart worden. Anders blijft de oude build in het geheugen.  
   - Stappen: stop de server (Ctrl+C) → eventueel `rm -rf .next` → `npm run dev`.

Na een schone herstart en harde refresh zou je o.a. moeten zien: **"Kies hier: Vrijwilliger of Adoptant"**, de amber keuzebalk en de rode **♥ Doneren**-knop.
