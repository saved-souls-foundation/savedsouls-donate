# Affiliate Excel-bestanden (honden & katten)

Plaats hier je **AliExpress-export Excel-bestanden** (.xls of .xlsx). Het sync-script leest ze en vult de affiliatepagina.

## Waar zet je de bestanden?

| Map | Gebruik |
|-----|--------|
| **`dogs/`** | Excel met hondenproducten (hondenmanden, halsbanden, voer, etc.) |
| **`cats/`** | Excel met kattenproducten (kattenmanden, krabpalen, voer, etc.) |
| **`dogs-wheelchairs/`** | Excel met ondersteunende artikelen (honden/katten, o.a. rolstoelen, karretjes) |
| **`holiday/`** | Excel met meer producten en voor de feestdagen |

- **Let op:** gebruik voor `cats/` een **ander** Excel-bestand dan voor `dogs-wheelchairs/`. Als beide mappen hetzelfde bestand (of dezelfde productlijst) bevatten, tonen de knoppen "Katten spullen" en "Ondersteunende artikelen" dezelfde producten.
- Je kunt **meerdere** bestanden in elke map zetten (bijv. 5 xls voor honden, 5 voor katten).
- Het script combineert alle bestanden per map en haalt dubbele producten (zelfde ProductId) eruit.
- Formaat: zelfde kolommen als de AliExpress affiliate-export (ProductId, Image Url, Product Desc, Origin Price, Discount Price, Discount, Promotion Url, …).

## Na het plaatsen van de bestanden

In de projectroot:

```bash
npm run sync-affiliate-products
```

Daarmee worden o.a. bijgewerkt:

- `lib/affiliate-dog-products.json` (uit alles in `dogs/`)
- `lib/affiliate-cat-products.json` (uit alles in `cats/`)
- `lib/affiliate-dog-wheelchairs-products.json` (uit alles in `dogs-wheelchairs/`)
- `lib/affiliate-holiday-products.json` (uit alles in `holiday/`)

De affiliatepagina toont daarna de producten via de knoppen **Honden spullen**, **Katten spullen**, **Ondersteunende artikelen honden / katten** en **Meer en voor de feestdagen !**.

- Zijn er in een map geen Excel-bestanden? Dan wordt de bestaande JSON voor die categorie **niet** overschreven (bestaande producten blijven staan).
- Optioneel: max. aantal producten per categorie (standaard 36, max. 60):  
  `node scripts/sync-affiliate-dog-products.mjs 48`
