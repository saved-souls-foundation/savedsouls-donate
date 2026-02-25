# Website Check Rapport – Saved Souls Foundation

**Datum:** 24 februari 2025

## ✅ Build & Linting

- **Build:** Succesvol (geen fouten)
- **Linting:** Geen fouten gevonden

## ✅ Routes & Sitemap

Alle 105 pagina’s in `app/[locale]/` bestaan en komen overeen met de sitemap. De sitemap bevat alle relevante statische paden.

## ✅ Statische bestanden

De volgende bestanden bestaan in `public/`:

- `/sanctuary.mp4` – video op about-us pagina
- `/press/SavedSoulsFoundation_PressRelease.pdf` – persbericht
- `/press/SavedSoulsFoundation_PressRelease.docx` – persbericht Word

## ⚠️ Mogelijke aandachtspunten

### 1. Ankerlink `get-involved#info` – opgelost

- **Locatie:** FAQ-pagina (`/faq`)
- **Link:** `get-involved#info`
- **Oplossing:** `id="info"` toegevoegd aan de sectie "Gidsen & informatie" op de get-involved pagina.

### 2. Homepage-anchors

De homepage heeft de volgende sectie-ids, die correct gebruikt worden:

- `#contact`
- `#donate`
- `#sponsor`
- `#adopt`

### 3. Bank transfer-anchor

- `/donate#bank-transfer` – bestaat op zowel de donate-pagina als de homepage.

## ✅ Interne links (steekproef)

Gecontroleerde interne links wijzen naar bestaande routes:

- `/volunteer`, `/volunteer-signup`, `/contact`, `/adopt`, `/sponsor`, `/donate`
- `/get-involved`, `/gidsen`, `/kids`, `/school-project`, `/faq`
- `/health`, `/first-aid`, `/tropics`, `/financial-overview`, etc.

## Samenvatting

| Categorie        | Status |
|------------------|--------|
| Build            | ✅ OK  |
| Linting          | ✅ OK  |
| Routes           | ✅ OK  |
| Statische bestanden | ✅ OK  |
| Interne links    | ✅ OK  |
| Ankerlinks       | ✅ OK (opgelost) |

**Conclusie:** De website ziet er technisch gezond uit. Er zijn geen 404’s gevonden bij bestaande routes.
