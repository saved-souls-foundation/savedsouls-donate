# Cookie consent & Google Analytics 4 – AVG/GDPR

## Aangepaste bestanden

| Bestand | Wijziging |
|--------|-----------|
| **app/layout.tsx** | Inline script toegevoegd **vóór** `<GoogleAnalytics />`: `dataLayer`, `gtag` en `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' })`. Daardoor laadt GA4 standaard zonder persoonsgegevens te gebruiken tot de gebruiker toestemming geeft. |
| **app/GoogleAnalytics.tsx** | Gebruikt `NEXT_PUBLIC_GA_ID` (fallback: `NEXT_PUBLIC_GA_MEASUREMENT_ID` of vaste ID). Overschrijft bestaande `dataLayer`/`gtag` niet, zodat consent default uit layout blijft staan. |
| **app/components/CookieConsent.tsx** | Consent Mode v2: bij **Accepteren** → `gtag('consent', 'update', { analytics_storage: 'granted' })` + `localStorage.setItem('cookie-consent', 'granted')`. Bij **Weigeren** → `gtag('consent', 'update', { analytics_storage: 'denied' })` + `localStorage.setItem('cookie-consent', 'denied')`. Banner wordt niet getoond als `cookie-consent` al in localStorage staat; bij bestaande `granted` wordt consent bij load ook naar gtag geüpdatet. |
| **types/gtag.d.ts** | TypeScript-typen voor `window.dataLayer` en `window.gtag`. |

## Environment

**Optioneel** – in `.env.local` kun je zetten (als je een andere GA4-property wilt gebruiken):

```env
NEXT_PUBLIC_GA_ID=G-YT9LXHPDZT
```

Staat dit er niet, dan wordt dezelfde ID uit de code als fallback gebruikt. Je hoeft dus niets in `.env.local` te zetten voor de standaard GA4-property.

---

## Testen in de browser (Network-tab)

1. **Eerste bezoek (geen keuze nog)**  
   - Open de site in een incognitovenster of na `localStorage.removeItem('cookie-consent')`.  
   - **Verwacht:** Cookiebanner zichtbaar.  
   - **Network:** Zoek op `google-analytics.com` of `googletagmanager.com`. Het gtag.js-script mag pas na ~3,5 s laden. Vóór toestemming mogen er **geen** requests naar `https://www.google-analytics.com/g/collect` (of vergelijkbaar) gaan met jouw payload (Consent Mode = denied).

2. **Klik op “Accepteren”**  
   - **Verwacht:** Banner verdwijnt, `localStorage.getItem('cookie-consent')` === `'granted'`.  
   - **Network:** Na de consent-update mogen wel GA4-collect-requests verschijnen (analytics_storage: granted).

3. **Klik op “Weigeren”** (nieuwe sessie: verwijder `cookie-consent` of gebruik incognito, weigeren)  
   - **Verwacht:** Banner verdwijnt, `localStorage.getItem('cookie-consent')` === `'denied'`.  
   - **Network:** Geen analytics-collect-requests voor die gebruiker (analytics_storage: denied).

4. **Pagina herladen na “Accepteren”**  
   - **Verwacht:** Geen banner; in de console (na ~3,5 s) wordt gtag geladen en wordt consent als granted gezet.  
   - **Network:** GA4-requests mogen weer (zoals bij punt 2).

5. **Console-check**  
   - Na laden: `window.dataLayer` bevat eerst een item met `consent`, `default` en `analytics_storage: 'denied'`.  
   - Na “Accepteren”: later item met `consent`, `update` en `analytics_storage: 'granted'`.
