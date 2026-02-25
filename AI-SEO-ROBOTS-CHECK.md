# Check: AI, SEO, robots.txt & sitemap

**Datum:** 24 februari 2025

---

## 1. AI / LLM bestanden

| Bestand | Status | Locatie |
|---------|--------|---------|
| **ai.txt** | ✅ | `/public/ai.txt` – uitgebreide context voor AI-agents |
| **llms.txt** | ✅ | `/public/llms.txt` – korte samenvatting voor LLM’s |
| **.well-known/ai** | ✅ | `/public/.well-known/ai` – verwijzing naar ai.txt, context.json, llms.txt |
| **context.json** | ✅ (toegevoegd) | `/public/context.json` – gestructureerde JSON (Schema.org NGO) |

**Inhoud ai.txt:** Overzicht organisatie, contact, belangrijke pagina’s, zoektermen, machine-readable resources.

**Inhoud llms.txt:** Korte intro, quick links, contact, onderwerpen, verwijzing naar ai.txt en context.json.

---

## 2. robots.txt

**Locatie:** `app/robots.ts` (Next.js genereert `/robots.txt`)

```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

User-agent: GPTBot, ChatGPT-User, Google-Extended, Anthropic-AI, Claude-Web, PerplexityBot, Cohere-AI, Bytespider
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://savedsouls-foundation.org/sitemap.xml
Host: https://savedsouls-foundation.org
```

**Status:** ✅ Correct
- Alle crawlers mogen de site indexeren
- AI-crawlers expliciet toegestaan (zelfde regels als algemeen)
- Admin en API uitgesloten
- Sitemap en host ingesteld

---

## 3. Sitemap

**Locatie:** `app/sitemap.ts`

**Status:** ✅ Correct

- **Base URL:** https://savedsouls-foundation.org
- **Locales:** nl, en, de, es, th, ru (6 talen)
- **Statische paden:** 106 paden × 6 locales = 636 URLs
- **Dynamisch:** blogposts, adopt-dieren (dogs/cats), sponsor-dieren
- **Prioriteit:** homepage 1, donate 0.9, overige 0.6–0.8
- **Change frequency:** homepage/donate weekly, rest monthly

**Let op:** URLs bevatten altijd een locale, bijv. `https://savedsouls-foundation.org/nl/donate`.

---

## 4. SEO

### Root metadata (`app/layout.tsx`)
- ✅ title, description, keywords, authors
- ✅ openGraph (title, description, type, images)
- ✅ twitter (card, title, description, images)
- ✅ robots: index, follow
- ✅ metadataBase

### JSON-LD (Schema.org)
- ✅ NGO-schema in root layout
- ✅ Adres, geo, contactPoint, founder, knowsAbout, additionalProperty

### Per-pagina metadata
- ✅ Veel pagina’s met `generateMetadata` (title, description, openGraph)
- ✅ `alternatesForPath` voor hreflang (about-us, shop, story, vet-costs-comparison, blog)
- ⚠️ Niet alle pagina’s hebben `alternates` – overwegen voor belangrijke pagina’s

### Feed (RSS)
- ✅ `/feed.xml` – route in `app/feed.xml/route.ts`
- ⚠️ Links in feed gebruiken paden zonder locale (bijv. `/donate`). Met `localePrefix: "always"` redirect next-intl naar `/nl/donate`. Werkt, maar canonical URLs zijn met locale.

---

## 5. Aanpassingen

1. **context.json toegevoegd** – Bestand bestond niet maar werd wel genoemd in ai.txt, .well-known/ai en llms.txt. Nu aanwezig als `/public/context.json` met Schema.org NGO-data.

---

## Samenvatting

| Onderdeel | Status |
|-----------|--------|
| ai.txt | ✅ |
| llms.txt | ✅ |
| .well-known/ai | ✅ |
| context.json | ✅ (nieuw) |
| robots.txt | ✅ |
| sitemap.xml | ✅ |
| SEO metadata | ✅ |
| JSON-LD | ✅ |
| RSS feed | ✅ |

**Conclusie:** AI-, SEO- en crawler-configuratie zijn in orde. Het ontbrekende `context.json` is toegevoegd.
