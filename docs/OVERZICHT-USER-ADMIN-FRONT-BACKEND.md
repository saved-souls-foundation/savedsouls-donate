# Overzicht: gebruikers- en admin-gedeelte (frontend & backend)

Documentatie voor Claude en ontwikkelaars: wat er is aan frontend en backend voor het “users”-gedeelte en hoe het is ingericht.

---

## 1. Rollen en toegang

| Rol        | Bepaling                         | Na inloggen gaat gebruiker naar      |
|-----------|-----------------------------------|---------------------------------------|
| **Admin** | `profiles.role = 'admin'` of `profiles.is_admin = true` | `/[locale]/admin/dashboard`           |
| **Vrijwilliger** | `profiles.role = 'vrijwilliger'`   | `/[locale]/portal/vrijwilliger`       |
| **Adoptant**    | `profiles.role = 'adoptant'`      | `/[locale]/portal/adoptant`           |
| Geen rol  | Nieuw account of rol nog niet gezet | `/[locale]/portal/onboarding` (kiezen: Vrijwilliger of Adoptant) |

Login gebeurt op **één** plek voor portaal: `/[locale]/dashboard/login`. Daar kiest de gebruiker **Vrijwilliger** of **Adoptant** (kaarten); die keuze wordt in `sessionStorage` bewaard en bepaalt na succesvolle login de redirect (tenzij het account admin is → dan altijd naar admin). Admin kan ook inloggen via `/[locale]/admin/login` (aparte pagina, alleen voor beheerders).

---

## 2. Frontend – wat gebruikers zien

### 2.1 Inloggen (portaal)

- **Route:** `/[locale]/dashboard/login`
- **Zichtbaar:** Twee kaarten “Vrijwilliger” en “Adoptant”, daarna e-mail + wachtwoord. Optioneel: registreren, wachtwoord vergeten.
- **Gedrag:** Na inloggen redirect op basis van rol (admin → admin, anders naar gekozen portaal). Bij `?reset_expired=1` wordt getoond dat de wachtwoord-resetlink verlopen is.

### 2.2 Onboarding (als er nog geen rol is)

- **Route:** `/[locale]/portal/onboarding`
- **Zichtbaar:** Keuze “Ik ben hier als Vrijwilliger” of “Adoptant”, veld voornaam, knop om te bevestigen.
- **Gedrag:** Zet `profiles.role` en `profiles.voornaam`, daarna redirect naar het bijbehorende portaal.

### 2.3 Vrijwilligersportaal

- **Route:** `/[locale]/portal/vrijwilliger`
- **Layout:** Zelfde site-header en footer als de rest van de site; content in `PortalVrijwilligerClient.tsx`.
- **Wat de vrijwilliger ziet:**
  - Welkomsttekst (“Welkom terug, [voornaam]!”).
  - Korte tekst “Kies hier: Vrijwilliger of Adoptant” + rode knop **Doneren**.
  - Kaart **“Ik ben hier als”**: Vrijwilliger (actief) / Adoptant (link naar adoptantenportaal). Als er ook adoptieaanvragen zijn: tekst + link “Adoptantenportaal →”.
  - Kaart **“Jouw voortgang”**: Thermometer met 6 stappen (Aanmelding ontvangen → Intake gepland → Intake afgerond → Screening & referenties → Opleiding & training → ✅ Actief als vrijwilliger). Huidige stap komt uit `profiles.huidige_stap`; Realtime zorgt voor live updates.
  - Link “Vrijwilligersaanmelding doorlopen →” naar `/[locale]/portal/onboarding/volunteer` (onboarding-formulier met documenten).
  - Rechts een decoratieve paspoort-afbeelding (hond met paspoort), achter de content, tot net boven de footer.
- **Data:** `profiles` (voornaam, huidige_stap), `adoption_applications` (alleen om te tonen of er ook adoptieaanvragen zijn).

### 2.4 Adoptantenportaal

- **Route:** `/[locale]/portal/adoptant`
- **Layout:** Zelfde header/footer; content in `app/[locale]/portal/adoptant/page.tsx`.
- **Wat de adoptant ziet:**
  - Welkomsttekst (“Welkom terug, [voornaam]!”).
  - Kaart **“Ik ben hier als”**: Vrijwilliger (link) / Adoptant (actief).
  - **“Jouw voortgang”**: Thermometer met 4 stappen (Aanmelding ontvangen → Intake & huisbezoek of video call → Match gevonden – documenten → ✅ Adoptie afgerond). Stap uit `profiles.huidige_stap`.
  - Bij stap 4: feestelijke kaart “Adoptie afgerond” met (optioneel) foto van het geadopteerde dier en rode donatieknop.
  - **“Jouw adoptieaanvragen”**: Per aanvraag: 3 klikbare foto’s (van het hoofddier/extra dieren), datum, diernaam, stap (bijv. 1/4). Foto’s linken naar de dierpagina `/[locale]/adopt/dog/[id]` of `/[locale]/adopt/cat/[id]`. Link “Nieuwe adoptieaanvraag indienen” naar adopt-inquiry.
  - Zelfde decoratieve paspoort-afbeelding rechts, achter de content.
- **Data:** `profiles`, `adoption_applications` (eigen aanvragen via RLS op e-mail). Dierenfoto’s en -types via `/api/animals` (externe API) voor de 3 thumbnails en links.

### 2.5 Vrijwilliger-onboarding (formulier + documenten)

- **Route:** `/[locale]/portal/onboarding/volunteer`
- **Zichtbaar:** Formulier (o.a. voornaam, achternaam, telefoon, motivatie) en uploads (ID, VOG, certificaten, extra). Stappen/voortgang.
- **Backend:** Gegevens in `volunteer_onboarding`; bestanden in Supabase Storage; API’s o.a. `welcome-complete`, `send-travel-plan` (e-mail).

---

## 3. Frontend – wat admins zien

### 3.1 Admin-login

- **Route:** `/[locale]/admin/login`
- **Zichtbaar:** E-mail, wachtwoord, “Wachtwoord vergeten?”. Geen rolkeuze.
- **Gedrag:** Alleen gebruikers met `profiles.role = 'admin'` of `profiles.is_admin = true` mogen door; anderen worden uitgelogd.

### 3.2 Admin-dashboard (nieuw)

- **Route:** `/[locale]/admin/(nieuw)/dashboard`, `/[locale]/admin/(nieuw)/adoptanten`, `/[locale]/admin/(nieuw)/vrijwilligers`, `/[locale]/admin/(nieuw)/documenten`
- **Layout:** Sidebar met logo “SavedSoulsFoundation”, navigatie: Dashboard, Adoptanten, Vrijwilligers, Documenten, en uitloggen.
- **Dashboard:** Overzichtskaarten (aantallen vrijwilligers, adoptanten, voltooide onboarding, adoptanten op stap 4, etc.) op basis van `profiles` en `volunteer_onboarding`.
- **Adoptanten:** Lijst/beheer van adoptanten (profiles met role adoptant), gekoppeld aan adoptieaanvragen en stappen.
- **Vrijwilligers:** Lijst/beheer van vrijwilligers en hun onboarding-status (`volunteer_onboarding`).
- **Documenten:** Overzicht van documenten (uploads uit volunteer onboarding).
- **Data:** Supabase: `profiles`, `adoption_applications`, `volunteer_onboarding`. Admin-RLS-policies zorgen dat alleen gebruikers met admin-rol alle rijen kunnen lezen/updaten.

---

## 4. Backend – API-routes (relevant voor users/admin)

| Route | Methode | Doel |
|-------|---------|------|
| `/api/auth/login` | POST | Inloggen (Supabase Auth). |
| `/api/auth/check` | GET | Controleren of er een sessie is. |
| `/api/auth/logout` | POST | Uitloggen. |
| `/api/animals` | GET | Lijst honden/katten (externe API); gebruikt voor adoptantenportaal (foto’s, links naar dierpagina). |
| `/api/adopt-inquiry` | POST | Adoptieaanvraag indienen (formulier). |
| `/api/volunteer-signup` | POST | Aanmelding vrijwilliger (eerste aanmelding). |
| `/api/portal/welcome-complete` | POST | Markeren/afronden welkomstflow (bijv. vrijwilliger-onboarding). |
| `/api/portal/send-travel-plan` | POST | Versturen reisplan per e-mail. |
| `/api/portal/notify-step` | POST | Notificatie bij stapwijziging (kan e-mail triggeren). |
| `/api/admin/signed-url` | POST | Signed URL voor admin (bijv. documenten downloaden). |
| `/api/admin/applications` | GET | Adoptieaanvragen ophalen (admin). |

Overige API’s (donate, contact, payments, affiliate, etc.) horen bij de publieke site en donaties, niet bij het portaal-/admin-gedeelte.

---

## 5. Backend – database (Supabase)

### 5.1 Tabellen

- **`profiles`**  
  - Koppeling aan `auth.users` (id).  
  - Kolommen o.a.: `role` (admin | vrijwilliger | adoptant), `voornaam`, `achternaam`, `huidige_stap`, `notities`, `aangemeld_op`, `updated_at`, `is_admin`, `email`.  
  - RLS: gebruiker leest/updatet eigen rij; admin leest/updatet alle rijen. Realtime aan voor live voortgang.

- **`adoption_applications`**  
  - Adoptieaanvragen (o.a. e-mail, dier, stap).  
  - `extra_animals` (JSONB) voor meerdere dieren per aanvraag.  
  - RLS: adoptant ziet alleen eigen aanvragen (koppeling op e-mail met `profiles`).

- **`volunteer_onboarding`**  
  - Eén rij per gebruiker: formuliergegevens (voornaam, telefoon, motivatie, etc.) en paden naar geüploade documenten (ID, VOG, certificaten, extra).  
  - RLS: gebruiker eigen rij; admin alles.

### 5.2 Migraties (in volgorde)

- `20250301_profiles_portal.sql` – role, voornaam, huidige_stap, notities, RLS.
- `20250301_adoption_applications_extra_and_rls.sql` – extra_animals, RLS adoptant.
- `20250301_volunteer_onboarding.sql` – tabel volunteer_onboarding + RLS.
- `20250301_profiles_fix_rls_recursion.sql` – RLS-aanpassingen.
- `20250301_volunteer_welcome_email_sent.sql` – indien gebruikt voor e-mailstatus.

---

## 6. Beveiliging en routing

- **Middleware/proxy:** Routes onder `/[locale]/portal/*` en `/[locale]/admin/dashboard` (en admin-subroutes) zijn alleen toegankelijk voor ingelogde gebruikers; anders redirect naar login.
- **Admin:** Alleen als `profiles.role = 'admin'` of `profiles.is_admin = true`; anders na inloggen op admin-login uitgelogd.
- **Portaal:** Na login op dashboard/login wordt geredirect op basis van opgeslagen rolkeuze (Vrijwilliger/Adoptant) of bestaande `profiles.role`; als geen rol → onboarding.

---

## 7. Korte samenvatting

- **Gebruikers (niet-admin):** Loggen in op `/[locale]/dashboard/login`, kiezen Vrijwilliger of Adoptant, en komen in het bijbehorende portaal. Daar zien ze hun voortgang (thermometer), adoptieaanvragen (adoptant) of doorverwijzing naar adoptantenportaal (vrijwilliger), plus links naar doneren, nieuwe aanvraag en dierpagina’s. Vrijwilligers kunnen het onboarding-formulier met documenten invullen.
- **Admins:** Loggen in op admin-login of (met admin-account) via dashboard/login, en komen in het admin-dashboard. Daar zien ze overzichten en lijsten voor adoptanten, vrijwilligers en documenten, op basis van Supabase met RLS.
- **Backend:** Supabase voor auth, profiles, adoption_applications, volunteer_onboarding; Next.js API-routes voor auth, dieren, portaal-acties en admin (signed URLs, applications). Realtime op `profiles` voor live stap-updates in het portaal.
