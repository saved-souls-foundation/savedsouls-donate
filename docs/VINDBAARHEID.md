# Vindbaarheid – SEO & ontdekbaarheid

Overzicht van wat er al is en wat je nog kunt doen om de vindbaarheid te vergroten.

---

## ✅ Al geïmplementeerd

| Onderdeel | Status |
|-----------|--------|
| Sitemap.xml | ✓ |
| robots.txt | ✓ |
| Meta title, description, keywords | ✓ |
| Open Graph (Facebook/LinkedIn) | ✓ |
| Twitter Cards | ✓ |
| Schema.org NGO + contactPoint | ✓ |
| FAQ Schema (FAQPage) | ✓ |
| ai.txt, llms.txt, context.json | ✓ |
| RSS-feed | ✓ |
| .well-known/ai | ✓ |
| Per-pagina metadata (veel pagina’s) | ✓ |

---

## 🔧 Technische verbeteringen (in code)

### 1. Open Graph-afbeelding
**Status:** ✓ Geïmplementeerd  
Standaard `og:image` (savedsoul-logo.webp) voor linkpreviews op Facebook, LinkedIn, Twitter.

### 2. hreflang-tags
**Status:** ✓ Geïmplementeerd  
`alternates.languages` en `canonical` per pagina via `[locale]` layout. Helpt zoekmachines de juiste taalversie te tonen.

### 3. Canonical URLs
**Status:** ✓ Geïmplementeerd  
Expliciete canonical per pagina via hreflang-helper.

### 4. Geo-coördinaten in Schema
**Status:** ✓ Geïmplementeerd  
`geo` (GeoCoordinates) toegevoegd aan Schema.org voor lokaal zoeken (Khon Kaen).

### 5. BreadcrumbList Schema
**Status:** Ontbreekt  
**Actie:** BreadcrumbList op subpagina’s voor betere weergave in zoekresultaten.

---

## 📋 Handmatige acties (buiten de code)

### 6. Google Search Console
- Ga naar [search.google.com/search-console](https://search.google.com/search-console)
- Voeg savedsouls-foundation.com toe
- Verifieer via DNS of HTML
- Stuur sitemap in: `https://savedsouls-foundation.com/sitemap.xml`

### 7. Bing Webmaster Tools
- Ga naar [bing.com/webmasters](https://www.bing.com/webmasters)
- Voeg de site toe en verifieer
- Stuur sitemap in

### 8. Google My Business / Google Business Profile
- Maak een profiel aan voor Saved Souls Foundation in Khon Kaen
- Vul adres, openingstijden, foto’s en contactgegevens in
- Helpt bij lokaal zoeken in Thailand

### 9. Backlinks & link-uitwisseling
- Ga door met de e-mailcampagne naar shelters (zie docs/email-link-uitwisseling.md)
- Vraag partners (TVAV, K9Aid) om een link
- Overweeg vermelding in dierenwelzijn-directories

### 10. Sociale media
- Zorg dat Facebook- en Instagram-profielen linken naar de site
- Gebruik consistente beschrijvingen en trefwoorden

### 11. Content
- Regelmatig nieuwe adoptieverhalen of updates
- Blog of nieuwsbrief kan extra zoekverkeer opleveren

---

## Prioriteit

| Prioriteit | Actie | Status |
|------------|-------|--------|
| Hoog | Google Search Console + sitemap | Handmatig – nog doen |
| Hoog | Open Graph-afbeelding | ✓ Gedaan |
| Middel | hreflang + canonical | ✓ Gedaan |
| Middel | Geo in Schema | ✓ Gedaan |
| Laag | BreadcrumbList | Optioneel |
