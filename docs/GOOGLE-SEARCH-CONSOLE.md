# Google Search Console – voorbereiding

Deze site is voorbereid voor aanmelding in Google Search Console (GSC), inclusief opties voor latere automatisering.

## Wat staat er al klaar?

- **Sitemap:** `https://www.savedsouls-foundation.com/sitemap.xml` (verwijzing in `robots.txt`)
- **Robots.txt:** `https://www.savedsouls-foundation.com/robots.txt`
- **Meta-tag verificatie:** Als `GOOGLE_SITE_VERIFICATION` in de omgeving staat, wordt de bijbehorende `<meta name="google-site-verification" content="...">` automatisch in de `<head>` gezet (zie `app/layout.tsx`).

## Script: `scripts/google-search-console-setup.mjs`

```bash
# Toon Sitemap- en robots-URLs voor aanmelden in GSC
node scripts/google-search-console-setup.mjs urls

# Instructies voor meta-tag verificatie (env GOOGLE_SITE_VERIFICATION)
node scripts/google-search-console-setup.mjs meta

# Maak HTML-verificatiebestand (bij "HTML-bestand uploaden" in GSC)
node scripts/google-search-console-setup.mjs html <content>
# Voorbeeld: node scripts/google-search-console-setup.mjs html 1a2b3c4d5e
```

## Handmatige aanmelding (nu)

1. Ga naar [Google Search Console](https://search.google.com/search-console).
2. Voeg een eigenschap toe → **URL-prefix** → `https://www.savedsouls-foundation.com`.
3. Verifieer via één van:
   - **HTML-tag:** zet `GOOGLE_SITE_VERIFICATION=<content>` in `.env.local` en op de host (bijv. Vercel), redeploy, daarna in GSC op Verifiëren.
   - **HTML-bestand:** run `node scripts/google-search-console-setup.mjs html <content>`, commit + push, controleer dat `https://www.savedsouls-foundation.com/google<content>.html` de juiste inhoud heeft, daarna in GSC op Verifiëren.
4. Na verificatie: **Sitemaps** → Nieuwe sitemap → `https://www.savedsouls-foundation.com/sitemap.xml` → Verzenden.

## Later: geautomatiseerd aanmelden

Voor automatisering (bijv. via API of CI) zijn voorbereid:

- **Verificatie:** via env `GOOGLE_SITE_VERIFICATION` (meta-tag) of via het script gegenereerd HTML-bestand.
- **Vaste URLs:** sitemap en robots-URL staan in het script; je kunt deze in eigen scripts/CI hergebruiken.
- **Search Console API:** voor indexatie-aanvragen e.d. is later een service account + OAuth nodig; zie [Google Search Console API](https://developers.google.com/webmaster-tools/search-console-api-original).
