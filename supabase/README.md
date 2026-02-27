# Supabase opzetten voor Saved Souls

1. **Account en project**
   - Ga naar [supabase.com](https://supabase.com) en maak een account/project.

2. **Environment variables**
   - Kopieer `.env.example` naar `.env.local` (lokaal) of vul in Vercel in:
   - **Project Settings → API** in Supabase:
     - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
     - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (geheim, alleen op server)

3. **Database-schema**
   - In Supabase: **SQL Editor → New query**
   - Plak de inhoud van `schema.sql` en run de query.

4. **Auth (e-mail/wachtwoord)**
   - **Authentication → Providers → Email**: zet “Enable Email provider” aan.
   - Optioneel: zet “Confirm email” uit zodat gebruikers direct kunnen inloggen zonder bevestigingsmail.

5. **Registratie**
   - Gebruikers kunnen zich registreren via de dashboard-loginpagina (eerst “Registreren” toevoegen) of je koppelt account-aanmaak na adopt-inquiry/volunteer-signup.

Daarna werken dashboard-login, opslaan van adopt/vrijwilliger-aanvragen en het admin-aanvragenoverzicht.
