# Login & Progress Dashboard – Implementatieplan

## Overzicht

Veilig login-systeem voor:
- **Adoptanten** – inloggen en adoptieproces volgen
- **Vrijwilligers** – inloggen en todo’s / vertrekvoorbereiding zien
- **Sponsors** – inloggen en sponsorbedrag / overzicht zien
- **Admin** – Saved Souls beheerder, volledig overzicht

## Architectuur

### Database (aanbevolen: Supabase)

| Tabel | Doel |
|-------|------|
| `users` | Email, wachtwoord-hash, type (adopt/volunteer/sponsor) |
| `adoption_applications` | Koppeling user ↔ adoptie, status, stappen |
| `volunteer_applications` | Koppeling user ↔ vrijwilliger, todo’s, vertrek |
| `sponsorships` | Koppeling user ↔ gesponsorde dieren, bedrag, periode |

### Auth-flow

1. **Registratie**: Bij adopt-inquiry / volunteer-signup / sponsor-checkout → e-mail + wachtwoord opslaan (optioneel)
2. **Login**: E-mail + wachtwoord → JWT of session cookie
3. **Magic link** (alternatief): Wachtwoordloos inloggen via e-mail

### Progress-thermometer (UI)

Horizontale thermometer met:
- Blauwe vullijn (progress %)
- Genummerde stappen erboven
- Per type:
  - **Adoptie**: Stap 1–6 (aanvraag → intro call → documenten → vlucht → aankomst)
  - **Sponsor**: Hoeveel gesponsord, welke dieren
  - **Vrijwilliger**: Wat ingeleverd, todo voor vertrek

## Stappen om te implementeren

### Fase 1: Supabase opzetten
1. Account op [supabase.com](https://supabase.com)
2. Nieuw project aanmaken
3. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `SUPABASE_SERVICE_ROLE_KEY` in Vercel (of `.env.local`)

### Fase 2: Database-schema
```sql
-- users (Supabase Auth gebruikt eigen users tabel)
-- Aanvullende profiel-tabel:
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  user_type TEXT CHECK (user_type IN ('adopt', 'volunteer', 'sponsor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adoption progress
CREATE TABLE adoption_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  application_id TEXT,
  step INT DEFAULT 1,
  status JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer progress
CREATE TABLE volunteer_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  application_id TEXT,
  todos JSONB,
  documents_submitted JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsor overview
CREATE TABLE sponsor_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  mollie_customer_id TEXT,
  total_amount_cents INT DEFAULT 0,
  animals JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aanvragen (formulierdata) voor admin-overzicht en koppeling aan dashboard
CREATE TABLE adoption_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  experience TEXT NOT NULL,
  about TEXT NOT NULL,
  animal_name TEXT,
  animal_id TEXT,
  step INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  dates TEXT,
  experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  step INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Fase 3: Auth-integratie
- `@supabase/supabase-js` en `@supabase/ssr` installeren
- Auth middleware voor `/dashboard/*` en `/admin/*`
- Login-pagina’s per type

### Fase 4: Dashboard-pagina’s
- `/dashboard/adopt` – adoptie-thermometer + status
- `/dashboard/volunteer` – vrijwilliger-thermometer + todo’s
- `/dashboard/sponsor` – sponsor-overzicht
- `/admin` – uitbreiden met overzicht alle aanvragen

### Fase 5: Koppeling bestaande flows
- adopt-inquiry: na verzenden → optie “Account aanmaken om voortgang te volgen”
- volunteer-signup: idem
- Mollie webhook: bij succesvolle sponsor-betaling → sponsor_progress bijwerken

## ProgressThermometer-component

De component is al gebouwd en kan gebruikt worden met mock of echte data.
Zie `app/components/ProgressThermometer.tsx`.
