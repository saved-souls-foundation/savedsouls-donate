# Google Search Console – voorbereiding & automatisering

Deze site is voorbereid voor Google Search Console (GSC), inclusief scripts om sitemap-verzending te automatiseren.

## Wat staat er al klaar?

- **Sitemap:** `https://www.savedsouls-foundation.com/sitemap.xml` (verwijzing in `robots.txt`)
- **Robots.txt:** `https://www.savedsouls-foundation.com/robots.txt`
- **Meta-tag verificatie:** Als `GOOGLE_SITE_VERIFICATION` in de omgeving staat, wordt de meta-tag automatisch in `<head>` gezet.

---

## Eigendom geverifieerd – hoe nu verder?

### 1. Sitemap toevoegen (eenmalig, handmatig of via script)

- Ga in GSC naar **Sitemaps** (links).
- Bij "Nieuwe sitemap toevoegen" vul in: `https://www.savedsouls-foundation.com/sitemap.xml`
- Klik **Verzenden**.

Of gebruik het geautomatiseerde script (zie hieronder).

### 2. Daarna

- Google crawlt de sitemap; **Pagina-indexering** en **Core Web Vitals** vullen zich in de loop van dagen/weken.
- Je kunt in **URL-inspectie** handmatig indexatie aanvragen voor belangrijke nieuwe pagina’s.

---

## Automatiseren met de Search Console API

Voor herhaalde acties (bijv. sitemap indienen na deploy, of later indexatie-aanvragen) kun je de **Search Console API** gebruiken met een **service account**.

### Stap 1: Google Cloud-project & API

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/).
2. Maak een project (of kies bestaand) en **enable** de **Google Search Console API** (zoek op "Search Console API" in "APIs & Services" → "Enable").
3. **IAM & Admin** → **Service accounts** → **Create service account** → naam bijv. `gsc-automation` → Create.
4. Bij de service account: **Keys** → **Add key** → **Create new key** → **JSON** → download het JSON-bestand.
5. **Belangrijk:** Ga in [Google Search Console](https://search.google.com/search-console) → jouw eigenschap → **Instellingen** (tandwiel) → **Gebruikers en machtigingen** → **Gebruiker toevoegen** → vul het **e-mailadres** van de service account in (uit het JSON-bestand, veld `client_email`) → machtiging **Eigenaar** of **Volledige toegang** → Opslaan.

### Stap 2: Credentials lokaal beschikbaar maken

Zet het gedownloade JSON-bestand op een veilige plek (niet in de repo) en wijs het aan via omgevingsvariabele:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/pad/naar/jouw-service-account.json"
```

Of in `.env.local` (niet committen):

```
GOOGLE_APPLICATION_CREDENTIALS=./secrets/gsc-service-account.json
```

### Stap 3: Sitemap automatisch indienen

Installeer de optionele dependency (eenmalig):

```bash
npm install googleapis
```

Voer het script uit (site-URL moet exact overeenkomen met de GSC-eigenschap, bijv. `https://www.savedsouls-foundation.com/`):

```bash
node scripts/google-search-console-submit-sitemap.mjs
```

Het script dient de sitemap `https://www.savedsouls-foundation.com/sitemap.xml` in bij de Search Console API. Je kunt dit na elke deploy of periodiek (bijv. via cron) draaien.

### Optioneel: in CI/CD

- In GitHub Actions of andere CI: voeg het service account JSON toe als **secret** (bijv. `GSC_CREDENTIALS_JSON` = de volledige inhoud van het JSON-bestand).
- Het script leest dan automatisch credentials uit `GSC_CREDENTIALS_JSON` als die env var gezet is (geen bestand nodig).
- Roep in een deploy-job aan: `node scripts/google-search-console-submit-sitemap.mjs` of `npm run gsc:submit-sitemap`.

---

## Scripts in deze repo

| Script | Doel |
|--------|------|
| `npm run gsc -- urls` | Toont sitemap- en robots-URL voor GSC. |
| `npm run gsc -- meta` | Instructies voor meta-tag verificatie. |
| `npm run gsc -- html <code>` | Maakt `public/google<code>.html` voor HTML-file verificatie. |
| `node scripts/google-search-console-submit-sitemap.mjs` | Dient sitemap in via de API (vereist `googleapis` + service account). |

Zie ook de commentaar in de scripts zelf.
