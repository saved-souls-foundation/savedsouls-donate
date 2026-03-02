# E-mailadressen waar de site naartoe stuurt

Overzicht van alle ontvangers bij formulierinzendingen en notificaties.

---

## Ontvangers (waar mails **naartoe** gaan)

| Adres | Gebruikt bij | Opmerking |
|-------|--------------|-----------|
| **info@savedsouls-foundation.com** | Contact, Adopt, Volunteer, Donate, Portal vrijwilliger stap 4 | Via `NOTIFICATION_EMAILS` in `lib/sendMail.ts` |
| **info@savedsouls-foundation.org** | Contact, Adopt, Adopt-inquiry, Volunteer, Volunteer-signup, Donate, Portal vrijwilliger stap 4 | Zelfde + `TO_PRIMARY` (adopt-inquiry), `TO_VOLUNTEER` (volunteer-signup) |
| **mike@savedsouls-foundation.org** | Contact, Adopt, Adopt-inquiry, Volunteer, Volunteer-signup, Donate, Portal vrijwilliger stap 4 | Monitor; via `NOTIFICATION_EMAILS` en `TO_MIKE_MONITOR` |
| **kleinjansmike@gmail.com** | Alleen **Contactformulier** | `AUTO_REPLY_CC` in `app/api/contact/route.ts`: krijgt kopie van de auto-reply naar bezoeker + kopie van de contact-notificatie (ingevuld formulier) |
| **ADMIN_EMAIL** (env) | **Stripe-webhook** (`/api/webhooks/stripe`) | Notificaties bij betalingsprobleem of gestopte abonnementen (recurring donations). Zet in `.env.local` / Vercel: `ADMIN_EMAIL=info@savedsouls-foundation.org`. Fallback in code: `info@savedsouls-foundation.org`. |

---

## Per formulier

| Formulier | Notificatie (inhoud) gaat naar | Auto-reply naar bezoeker |
|-----------|-------------------------------|---------------------------|
| **Contact** | info@.com, info@.org, mike@.org, kleinjansmike@gmail.com | Ja (+ kopie naar kleinjansmike@gmail.com als die niet de invuller is) |
| **Adopt** (`/api/adopt`) | info@.com, info@.org, mike@.org | Ja |
| **Adopt-inquiry** (`/api/adopt-inquiry`) | info@.org, mike@.org | Ja |
| **Volunteer** (`/api/volunteer`) | info@.com, info@.org, mike@.org | Ja |
| **Volunteer-signup** (`/api/volunteer-signup`) | info@.org, mike@.org | Ja |
| **Portal vrijwilliger stap 4** (`/api/portal/welcome-complete`) | info@.com, info@.org, mike@.org (teammail met formuliergegevens) | Ja (welkomstmail naar vrijwilliger) |
| **Donate** | info@.com, info@.org, mike@.org | Ja |

---

## Afzender & Reply-To

- **Verzenden vanaf (FROM):** `Saved Souls Website <info@savedsouls-foundation.com>` (of `RESEND_FROM` in Vercel)
- **Reply-To:** `info@savedsouls-foundation.com`

---

## Andere adressen in de site (geen ontvanger van formulier-mails)

- **mailto-links / teksten:** overal waar bezoekers contact kunnen opnemen staat `info@savedsouls-foundation.org` (contactpagina, volunteer, about-us, disclaimer, influencers, layout.tsx, messages).
- **Shelters-pagina:** de daar getoonde e-mailadressen zijn van **andere organisaties** (bijv. contact@rescue-paws.org), niet ontvangers van jullie formulieren.

Laatste update: maart 2025.
