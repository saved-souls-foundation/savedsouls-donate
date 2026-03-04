# Prioriteit Franse vertaling (fr.json)

Deze volgorde is bedoeld om de belangrijkste pagina’s voor Franstalige bezoekers als eerste in het Frans te hebben. Fallback blijft NL waar een key ontbreekt.

## Fase 1 – Hoofdpagina’s (eerste prioriteit)
| # | Namespace    | Keys | Pagina           | Status      |
|---|--------------|------|------------------|-------------|
| 1 | aboutUs      | 44   | Over ons / Notre travail | ✅ Vertaald |
| 2 | adoptPage    | 23   | Adopteren        | ✅ Vertaald |
| 3 | adoptInquiry | 22   | Adoptie-aanvraag | ✅ Vertaald |
| 4 | story        | 47   | Ons verhaal      | ✅ Vertaald |
| 5 | getInvolved  | 47   | Doe mee          | ✅ Vertaald |
| 6 | volunteer    | 111  | Vrijwilliger     | ✅ Kern vertaald (titels, dag, logement, CTA) |
| 7 | volunteerSignup | 26 | Aanmelden vrijwilliger | ✅ Vertaald |

## Fase 2 – Donatie & acties ✅
| # | Namespace      | Keys | Pagina        | Status      |
|---|----------------|------|---------------|-------------|
| 8 | donate        | 32   | Doneren       | ✅ Vertaald |
| 9 | sponsorPage   | 22   | Sponsor       | ✅ Vertaald |
|10 | sponsorForm   | 13   | Sponsorformulier | ✅ Vertaald |
|11 | sponsorCheckout | 12 | Sponsor afrekenen | ✅ Vertaald |
|12 | thankYou      | 24   | Bedankpagina  | ✅ Vertaald |

## Fase 3 – Overige content ✅
| # | Namespace    | Keys | Opmerking        | Status      |
|---|--------------|------|------------------|-------------|
|13 | influencers  | 47   | Influenceurs     | ✅ Vertaald  |
|14 | dashboard    | 72   | Portaal (login, stappen) | ✅ Vertaald  |
|15 | clinicRenovation | 23 | Kliniek-actie   | ✅ Vertaald  |
|16 | faq          | 84   | FAQ              | ✅ Vertaald  |
|17 | disclaimer   | 23   | Disclaimer       | ✅ Vertaald  |
|18 | blog         | 11   | Blog             | ✅ Vertaald  |
|19 | partners     | 30   | Partners         | ✅ Vertaald  |
|20 | shelters     | 20   | Andere asielen   | ✅ Vertaald  |

## Fase 4 – Gidsen ✅ (kern afgerond)
| Namespace      | Status      |
|----------------|-------------|
| gidsen         | ✅ Vertaald |
| nutrition      | ✅ Vertaald |
| toysTraining   | ✅ Vertaald |
| rawHide        | ✅ Vertaald |
| health         | ✅ Vertaald |
| behavior       | ✅ Vertaald |
| vaccinations   | ✅ Vertaald |
| heartworm      | ✅ Vertaald |

Overige gids-namespaces (disabledDogGuide, vetCosts, deworming, firstAid, fleaTickParasiteGuide, etc.) kunnen later in batches worden vertaald indien gewenst.

## Werkwijze
- Vertaal in `messages/fr.json` de betreffende namespace van EN/NL naar FR.
- Behoud placeholders zoals `{name}`, `{current}`, `{total}`.
- Na elke namespace: even testen op `/fr/...` (bijv. `/fr/about-us`, `/fr/adopt`).
