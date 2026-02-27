# Cookie consent & Google Analytics 4 – AVG/GDPR

## Controle-checklist GA4 + cookiebanner (STAP 2)

| # | Vraag | Status |
|---|--------|--------|
| 1 | Staat `gtag('consent', 'default', { analytics_storage: 'denied' })` **vóór** de GA4-scripttag in layout? | ✅ Ja – inline script in `app/layout.tsx` staat vóór `<GoogleAnalytics />`; GA4 laadt pas na 3,5 s via die component. |
| 2 | Roept de knop **Accepteren** `gtag('consent', 'update', { analytics_storage: 'granted' })` aan? | ✅ Ja – `CookieConsent.tsx` → `accept()` → `updateGtagConsent("granted")`. |
| 3 | Roept de knop **Weigeren** `gtag('consent', 'update', { analytics_storage: 'denied' })` aan? | ✅ Ja – `deny()` → `updateGtagConsent("denied")`. |
| 4 | Wordt de keuze opgeslagen in localStorage? | ✅ Ja – key `cookie-consent`, waarden `granted` of `denied`. |
| 5 | Bij herbezoek: banner niet tonen en opgeslagen keuze direct toepassen? | ✅ Ja – `useEffect` leest `cookie-consent`; als gezet → `updateGtagConsent(stored)` en geen banner. |

---

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

---

## STAP 4 – Verifiëren in Chrome DevTools (Network-tab) dat GA4 pas na Accepteren stuurt

1. **DevTools openen**  
   - Open de site (bijv. `https://www.savedsouls-foundation.com/nl`).  
   - F12 of rechtsklik → “Inspecteren”. Ga naar het tabblad **Network**.

2. **Network leegmaken en filter zetten**  
   - Klik op het “No entry”-icoon of rechtsklik in de lijst → “Clear”.  
   - In het filterveld typ: `google` of `collect` of `gtag`, zodat je alleen relevante requests ziet.

3. **Vers scenario: geen cookie-keuze**  
   - Verwijder de keuze: in **Application** (tab naast Network) → **Local Storage** → jouw domein → verwijder de key `cookie-consent` (of open de site in een **Incognitovenster**).  
   - Vernieuw de pagina (F5 of Cmd+R).  
   - **Verwacht in Network:**  
     - Vóór ~3,5 s: geen `gtag/js` en geen `google-analytics.com/g/collect`.  
     - Na ~3,5 s: wel `gtag/js?id=G-...` (script wordt geladen).  
     - Zonder op Accepteren te klikken: **geen** (of vrijwel geen) requests naar `www.google-analytics.com` met echte data; Consent Mode staat op “denied”.

4. **Accepteren klikken**  
   - Klik op **Accepteren** in de cookiebanner.  
   - **Verwacht in Network:**  
     - Binnen korte tijd verschijnen er nu wél requests naar `https://www.google-analytics.com/g/collect` (of vergelijkbaar GA4-endpoint).  
     - Payload bevat o.a. consent/analytics info; dit zijn de “echte” analytics-requests.

5. **Samenvatting**  
   - **Zonder Accepteren:** geen (of geen geldige) GA4 collect-requests.  
   - **Na Accepteren:** wel GA4 collect-requests.  
   Daarmee is gecontroleerd dat GA4 pas na actieve toestemming data stuurt.
