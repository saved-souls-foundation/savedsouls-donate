# Supabase stap voor stap – Saved Souls

Volg deze stappen in volgorde. Daarna werken inloggen, registreren en het admin-aanvragenoverzicht.

---

## Stap 1: Account en project op Supabase

1. Ga naar **https://supabase.com** en log in (of maak een account).
2. Klik op **“New project”**.
3. Vul in:
   - **Name**: bijv. `savedsouls`
   - **Database Password**: kies een sterk wachtwoord en **bewaar het** (voor directe database-toegang).
   - **Region**: kies een regio dicht bij je gebruikers (bijv. West EU).
4. Klik op **“Create new project”** en wacht tot het project klaar is (een paar minuten).

---

## Stap 2: De drie keys uit Supabase halen

1. In je Supabase-project: links in het menu **“Project Settings”** (tandwiel).
2. Klik in het linkermenu op **“API”**.
3. Je ziet o.a.:
   - **Project URL** (bijv. `https://abcdefgh.supabase.co`)
   - **Project API keys**:
     - **anon public** – mag in de browser (voor login/registratie).
     - **service_role** – alleen op de server, nooit in de browser (voor admin en opslaan aanvragen).

Je hebt dus nodig:
- **Project URL** → wordt `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → wordt `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** → wordt `SUPABASE_SERVICE_ROLE_KEY`

---

## Stap 3: Environment variables lokaal invullen

1. In de root van dit project: kopieer `.env.example` naar `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` in je editor.
3. Vervang de placeholder-waarden door je echte Supabase-gegevens:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://JOUW-PROJECT-ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.JOUW_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.JOUW_SERVICE_ROLE_KEY
   ```
4. Sla het bestand op. **Deel `.env.local` nooit** (staat al in `.gitignore`).

---

## Stap 4: Database-schema in Supabase uitvoeren

1. In Supabase: links in het menu **“SQL Editor”**.
2. Klik op **“New query”**.
3. Open in dit project het bestand **`supabase/schema.sql`**.
4. Kopieer **de volledige inhoud** van dat bestand.
5. Plak die inhoud in het SQL-venster in Supabase.
6. Klik op **“Run”** (of Ctrl/Cmd + Enter).
7. Controleer dat er onderaan “Success” staat en geen rode foutmeldingen.

Daarmee zijn de tabellen en trigger aangemaakt (o.a. `profiles`, `adoption_applications`, `volunteer_applications`).

---

## Stap 5: E-mail/wachtwoord login aanzetten

1. In Supabase: links **“Authentication”**.
2. Klik op **“Providers”**.
3. Klik op **“Email”**.
4. Zet **“Enable Email provider”** aan (groen).
5. **Optioneel:** als gebruikers **zonder** bevestigingsmail moeten kunnen inloggen:
   - Zet **“Confirm email”** uit.
6. Klik op **“Save”**.

Daarna kunnen gebruikers zich registreren en inloggen met e-mail + wachtwoord op `/dashboard/login`.

---

## Stap 6: Lokaal testen

1. Start de app (als die nog niet draait):
   ```bash
   npm run dev
   ```
2. Ga in de browser naar: **http://localhost:3000/nl/dashboard/login**
3. Klik op **“Nog geen account? Registreren”** en maak een testaccount (e-mail + wachtwoord).
4. Controleer of je daarna naar het dashboard gaat.
5. Log uit (of gebruik een andere browser/incognito) en log opnieuw in met hetzelfde account.

Als dat werkt, is Supabase lokaal goed geconfigureerd.

---

## Stap 7: Productie (Vercel of andere host)

Als je naar productie deployt (bijv. Vercel):

1. Ga in **Vercel** naar je project → **Settings** → **Environment Variables**.
2. Voeg dezelfde drie variabelen toe (zelfde namen en waarden als in `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Zet ze aan voor **Production** (en eventueel Preview).
4. Doe een **redeploy** zodat de nieuwe env vars worden geladen.

---

## Samenvatting checklist

- [ ] Stap 1: Supabase-project aangemaakt
- [ ] Stap 2: Project URL, anon key en service_role key gekopieerd
- [ ] Stap 3: `.env.local` aangemaakt en de drie Supabase-variabelen ingevuld
- [ ] Stap 4: `supabase/schema.sql` in de Supabase SQL Editor uitgevoerd (Success)
- [ ] Stap 5: Authentication → Providers → Email ingeschakeld (eventueel Confirm email uit)
- [ ] Stap 6: Registreren en inloggen getest op `/nl/dashboard/login`
- [ ] Stap 7: (Bij productie) Zelfde env vars in Vercel/host gezet en redeploy

Als je ergens vastloopt, noem dan het stapnummer en de foutmelding (of een screenshot), dan kunnen we gericht kijken.
