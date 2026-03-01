# Cloudflare Turnstile – formulierbeveiliging

Contact-, adoptie- en volunteer-formulieren zijn beveiligd met **Cloudflare Turnstile** tegen spam en bots.

## Vereiste variabelen

| Variabele | Waar | Beschrijving |
|----------|------|--------------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Frontend (Vercel + lokaal) | Site key uit Cloudflare Dashboard → Turnstile |
| `TURNSTILE_SECRET_KEY` | Alleen server (Vercel, niet in browser) | Secret key uit hetzelfde Turnstile-widget |

## Waar is het actief?

- **Contactformulier** (`/contact`) → `POST /api/contact`
- **Adoptieformulier** (`/adopt-inquiry`) → `POST /api/adopt`
- **Volunteer-formulier** (`/volunteer-signup`) → `POST /api/volunteer`
- Ook: `POST /api/adopt-inquiry` en `POST /api/volunteer-signup` (alternatieve endpoints)

## Zonder keys (lokaal / dev)

- Als `NEXT_PUBLIC_TURNSTILE_SITE_KEY` niet is gezet: er wordt geen widget getoond; formulieren werken zonder check.
- Als `TURNSTILE_SECRET_KEY` niet is gezet (productie): de API doet geen verificatie (er wordt een waarschuwing gelogd).

**Lokaal testen (localhost):** De productie site-key werkt niet op localhost (Cloudflare geeft error 110200 – domain not allowed). De app gebruikt daarom automatisch Cloudflares **test-key** op localhost; de server gebruikt in development de bijbehorende test-secret, zodat het formulier gewoon werkt. Op productie (Vercel) worden je echte keys gebruikt.

Zet voor productie altijd beide keys in Vercel (Environment Variables).

## Keys aanmaken

1. Log in op [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Turnstile**.
2. Maak een widget aan (bijv. “Managed” of “Invisible”).
3. Kopieer **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
4. Kopieer **Secret Key** → `TURNSTILE_SECRET_KEY` (alleen in Vercel, niet in de frontend).
