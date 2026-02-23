# TODO-lijst voor Saved Souls Foundation – toegang & integraties

Overzicht van wat de organisatie moet regelen om de website volledig te laten werken. **Jij hebt toegang nodig** voor alle onderstaande punten.

---

## 1. API sponsor honden & katten

**Status:** Sponsor-pagina staat op "under construction". De adoptie-API werkt al.

| Wat | Toegang nodig |
|-----|---------------|
| **Adoptie-API** (werkt al) | `db.savedsouls-foundation.org/api/dogs.php` en `cats.php` – wie beheert deze server? |
| **Sponsor-API** | Nog te bouwen. Moet tonen welke honden/katten beschikbaar zijn voor maandelijkse sponsoring. Vereist: database of API met sponsor-dieren. |

**Actie:** Vraag aan IT/beheerder van `db.savedsouls-foundation.org`:
- Toegang tot de database of API-documentatie
- Of er een sponsor-endpoint is (bijv. `/api/sponsor-dogs.php`)
- Zo niet: specificaties voor een nieuw sponsor-API

---

## 2. Facebook token (blog-sync)

**Status:** Script bestaat (`npm run sync-facebook-blog`), maar heeft `FB_ACCESS_TOKEN` nodig.

| Stap | Wat te doen |
|------|-------------|
| 1 | Ga naar [developers.facebook.com](https://developers.facebook.com) |
| 2 | Maak een app (of gebruik bestaande) |
| 3 | Voeg "Facebook Login" en "Page Public Content Access" toe |
| 4 | Genereer een **Page Access Token** voor de pagina Saved Souls Foundation |
| 5 | Zet in Vercel: `FB_ACCESS_TOKEN=...` (Environment Variables) |

**Let op:** User tokens verlopen. Voor productie: **System User Token** of **Page Access Token** met lange geldigheid.

**Actie:** Wie heeft admin-rechten op de Facebook-pagina? Die persoon moet de token aanmaken.

---

## 3. E-mail – formulieren & auto-reply koppelen aan savedsouls-foundation.org

**Status:** Formulieren gebruiken Resend. Nu gaat alles naar `savedsoulsfoundationreply@gmail.com` en `info@savedsouls-foundation.org`.

| Wat | Huidige situatie | Toegang nodig |
|-----|------------------|---------------|
| **Resend-account** | API verstuurt e-mails | Account op [resend.com](https://resend.com) |
| **RESEND_API_KEY** | Moet in Vercel staan | API key uit Resend-dashboard |
| **RESEND_FROM** | Nu: `onboarding@resend.dev` (Resend test-domein) | Voor productie: `noreply@savedsouls-foundation.org` of `website@savedsouls-foundation.org` |
| **Domeinverificatie** | Voor `@savedsouls-foundation.org` als afzender | DNS-toegang (TXT/SPF/DKIM records) |

**Formulieren die e-mail sturen:**
- Contactformulier → `info@savedsouls-foundation.org` + auto-reply naar bezoeker
- Adoptie-aanvraag → `info@savedsouls-foundation.org` + auto-reply
- Vrijwilliger aanmelding → `volunteer@savedsouls-foundation.org` + auto-reply

**Actie:**
1. Resend-account aanmaken (of bestaande gebruiken)
2. Domein `savedsouls-foundation.org` toevoegen in Resend
3. DNS-records instellen (Resend geeft instructies)
4. `RESEND_API_KEY` en `RESEND_FROM` in Vercel zetten

---

## 4. Betalingen (Mollie)

**Status:** iDEAL/Wero werkt via Mollie. Zonder key wordt alleen PayPal getoond.

| Wat | Toegang nodig |
|-----|---------------|
| **MOLLIE_API_KEY** | Mollie-account op [mollie.com](https://mollie.com) |
| **Live key** | Na testfase: live API key voor echte betalingen |

**Actie:** Mollie-account aanmaken of koppelen aan Saved Souls Foundation. Live key in Vercel zetten.

---

## 5. CMS / admin-login (optioneel)

**Status:** Er is een CMS-gedeelte. Zonder variabelen is login uitgeschakeld.

| Wat | Toegang nodig |
|-----|---------------|
| **ADMIN_USERNAME** | Zelf te kiezen |
| **ADMIN_PASSWORD** | Sterk wachtwoord |

**Actie:** Alleen nodig als het CMS gebruikt wordt. Zet in Vercel Environment Variables.

---

## 6. Vercel-dashboard

**Status:** Site draait op Vercel. Environment variables worden daar ingesteld.

| Wat | Toegang nodig |
|-----|---------------|
| **Vercel-account** | [vercel.com](https://vercel.com) – project savedsouls-donate |
| **Environment Variables** | Alle keys (RESEND, MOLLIE, FB, ADMIN) |

**Actie:** Zorg dat de juiste persoon(s) toegang hebben tot het Vercel-project.

---

## 7. Overige toegang

| Item | Waarvoor |
|------|----------|
| **GitHub** | Code-aanpassingen, deploys (al gekoppeld) |
| **Domein savedsouls-foundation.org** | DNS voor e-mail (Resend), eventueel custom domain op Vercel |
| **E-mailadressen** | `info@`, `volunteer@`, `noreply@` of `website@` – moeten bestaan en bereikbaar zijn |

---

## Samenvatting – checklist

- [ ] **API sponsor:** Toegang/ specificaties voor sponsor-honden/katten API
- [ ] **Facebook:** Page Access Token voor blog-sync
- [ ] **Resend:** Account + domeinverificatie + `RESEND_API_KEY` + `RESEND_FROM`
- [ ] **Mollie:** Account + `MOLLIE_API_KEY` (live)
- [ ] **Vercel:** Toegang + alle environment variables invullen
- [ ] **DNS:** Toegang voor e-mailverificatie (TXT/SPF/DKIM)
- [ ] **E-mailadressen:** Controleren dat info@ en volunteer@ werken

---

## Waar zet ik de keys?

Alle **Environment Variables** komen in **Vercel**:

1. Ga naar [vercel.com](https://vercel.com) → project savedsouls-donate
2. Settings → Environment Variables
3. Voeg toe: `RESEND_API_KEY`, `MOLLIE_API_KEY`, `FB_ACCESS_TOKEN`, `RESEND_FROM`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
4. Kies Environment: Production (en eventueel Preview)
5. Redeploy na het toevoegen
