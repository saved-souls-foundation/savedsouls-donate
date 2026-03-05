# Overzicht: mailstromen en admin-dashboard (savedsouls-donate)

Dit document beschrijft voor Claude / volgende sessies wat er nu staat: welke mails waar vandaan komen, hoe ze in het dashboard terechtkomen, en wat er in Supabase zit. Geen nieuwe migraties nodig voor deze flows.

---

## 1. Inkomende mail in het dashboard (`incoming_emails`)

Het admin-dashboard toont inkomende mail via de tabel **`incoming_emails`** (Supabase). De API `GET /api/admin/emails` leest daaruit; de inbox-pagina toont alle rijen met o.a. `van_email`, `van_naam`, `onderwerp`, `inhoud`, `bron`, `status`, `ontvangen_op`.

### Bronnen (`bron`) die nu in het dashboard komen

| Bron | Oorsprong | API / route | Opmerking |
|------|-----------|-------------|-----------|
| **contact_formulier** | Contactformulier (alle 7 talen) | `POST /api/contact` | Was al aanwezig |
| **donatie_formulier** | Donatieformulier | `POST /api/donate` | Toegevoegd: insert in `incoming_emails` na validatie, voor verzenden mail |
| **vrijwilliger** | Vrijwilligersformulier (hoofdformulier) | `POST /api/volunteer` | Toegevoegd: insert in `incoming_emails` |
| **vrijwilliger_aanmelding** | Volunteer signup (ander formulier) | `POST /api/volunteer-signup` | Toegevoegd: insert samen met `volunteer_applications` |
| **adopt_inquiry** | Adoptie-inquiry formulier | `POST /api/adopt-inquiry` | Toegevoegd: insert samen met `adoption_applications` |
| **aanvraag** | Adoptieaanvraag (hoofd adopt-formulier) | `POST /api/adopt` | Was al aanwezig; schrijft ook in `adoption_applications` |
| **inkomend** | Mail van buitenaf (rechtstreeks naar info@) | Resend Inbound → `POST /api/webhooks/resend` | Alleen zichtbaar als Resend Inbound voor info@savedsouls-foundation.com is geconfigureerd |

Alle inserts gebruiken de bestaande kolommen: `van_email`, `van_naam`, `onderwerp`, `inhoud`, `bron`, `status` (standaard `in_behandeling`). Geen nieuwe Supabase-kolommen of migraties toegevoegd.

---

## 2. Verzonden mail (log in dashboard)

Verzonden mails worden gelogd in **`sent_emails`**. De applicatie ondersteunt zowel **Engelse** als **Nederlandse** kolomnamen (productie kan afwijken van migratie 20250305):

- Engels: `to_email`, `subject`, `body_preview`, `sent_at`
- Nederlands: `aan`, `onderwerp`, `inhoud`, `verstuurd_op`

- **Schrijven:** `lib/sentEmailsLog.ts` → `logSentEmail()`. Probeert eerst Engels, bij schemafout (bijv. PGRST204) Nederlands. Gebruikt door:
  - `POST /api/admin/emails/send` (nieuwe mail vanuit dashboard)
  - `POST /api/admin/emails/[id]/send` (antwoord op inkomende mail)
  - `POST /api/admin/emails/[id]/analyze` (auto-reply na AI-analyse)
  - `POST /api/portal/notify-step` (stap-notificatie)
  - `POST /api/webhooks/resend` (auto-reply na inkomende mail)

- **Lezen:** `GET /api/admin/sent-emails`. Probeert eerst Engelse kolommen, bij schemafout Nederlandse; response wordt genormaliseerd naar `aan`, `onderwerp`, `inhoud`, `verstuurd_op` voor de frontend.

---

## 3. Formulieren die alleen mail sturen (geen inbox-regel)

- **Sponsor:** Er is geen apart “sponsor contact”-formulier dat naar info@ mailt. `payments/sponsor-create` gaat over betaling/aanmelding; er wordt geen regel in `incoming_emails` geschreven. Optioneel later toevoegen als gewenst.

---

## 4. Mail “van buitenaf” (rechtstreeks naar info@savedsouls-foundation.com)

- **Hoe het werkt:** Resend **Inbound** ontvangt mail voor het geadresseerde adres (info@…) en stuurt een webhook `email.received` naar `POST /api/webhooks/resend`. Die route slaat de mail op in `incoming_emails` met `bron: "inkomend"` en kan een AI-auto-reply sturen.
- **Wat je moet controleren:** In Resend-dashboard → Inbound (of Domains → ontvangen) voor savedsouls-foundation.com; MX/Inbound zo ingesteld dat mail bij Resend binnenkomt; webhook voor `email.received` wijst naar `https://<domein>/api/webhooks/resend`. Zonder dit komt directe mail niet in het dashboard.

Zie ook `docs/EMAIL-RESEND-TROUBLESHOOTING.md` voor 554, PGRST204, domeinverificatie, enz.

---

## 5. Supabase: wat er al staat (geen extra SQL nodig)

- **incoming_emails:** Kolommen o.a. `id`, `van_email`, `van_naam`, `onderwerp`, `inhoud`, `ontvangen_op`, `bron`, `status`, `gelezen`, `ai_categorie`, `ai_confidence`, `taal`, `ai_suggestie_template_id`, `ai_gegenereerd_antwoord`, `ai_automatisch_verstuurd`, `verwerkt_door`, `verwerkt_op`, `updated_at`. Migraties: 20250301_admin_expansion, 20250303_emails_assistant, 20250313_incoming_emails_gelezen, 20250317_incoming_emails_ai_automatisch.
- **sent_emails:** Zie migratie 20250305_sent_emails (Engelse kolommen); productie kan Nederlandse kolommen hebben, code ondersteunt beide.

---

## 6. Wijzigingen in deze sessie (commit)

1. **Donate** (`app/api/donate/route.ts`): Na validatie, vóór het versturen van mail, insert in `incoming_emails` met `bron: "donatie_formulier"`, `onderwerp: "Donatie-inquiry: {name}"`, `status: "in_behandeling"`. Alleen als `isSupabaseAdminConfigured()`.
2. **Volunteer** (`app/api/volunteer/route.ts`): Zelfde patroon, `bron: "vrijwilliger"`, `onderwerp: "Vrijwilliger: {name}"`.
3. **Adopt-inquiry** (`app/api/adopt-inquiry/route.ts`): In de bestaande Supabase-blok na `adoption_applications` insert toegevoegd: insert in `incoming_emails` met `bron: "adopt_inquiry"`, `onderwerp: subjectLine`, `inhoud: text`.
4. **Volunteer-signup** (`app/api/volunteer-signup/route.ts`): In de bestaande Supabase-blok na `volunteer_applications` insert toegevoegd: insert in `incoming_emails` met `bron: "vrijwilliger_aanmelding"`, `onderwerp: subjectLine`, `inhoud: text`.

Overal: bij falen van de insert wordt alleen gelogd (`console.error`); het formulier en de mail gaan gewoon door.

---

*Laatste update: maart 2025 (na toevoegen donatie, volunteer, adopt-inquiry, volunteer-signup aan inbox).*
