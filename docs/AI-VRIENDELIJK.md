# AI-vriendelijke maatregelen

Deze site is geoptimaliseerd zodat AI-agents (ChatGPT, Claude, Perplexity, etc.) de informatie correct kunnen gebruiken als bron.

## Wat is geïmplementeerd

### 1. ai.txt
**URL:** https://www.savedsouls-foundation.com/ai.txt

Korte context voor AI-agents: wie we zijn, wat we doen, belangrijke pagina’s. Vergelijkbaar met robots.txt maar voor AI.

### 2. llms.txt
**URL:** https://www.savedsouls-foundation.com/llms.txt

Markdown-versie met links, bedoeld voor language models die markdown prefereren.

### 3. context.json
**URL:** https://www.savedsouls-foundation.com/context.json

Gestructureerde JSON met kerngegevens. Handig voor AI’s die programmatisch data ophalen.

### 4. Schema.org (JSON-LD)
In de HTML van elke pagina: gestructureerde data (NGO, contactPoint, knowsAbout) voor zoekmachines en AI.

### 5. Sitemap
**URL:** https://www.savedsouls-foundation.com/sitemap.xml

Volledige lijst van alle pagina’s voor crawlers en AI-agents.

### 6. robots.txt
**URL:** https://www.savedsouls-foundation.com/robots.txt

Host-directive en sitemap-verwijzing voor correcte indexering.

## Hoe AI-agents de site vinden

1. **Directe fetch** – AI’s kunnen elke URL ophalen; de content is leesbaar.
2. **ai.txt / llms.txt** – Sommige AI’s zoeken expliciet naar deze bestanden.
3. **context.json** – Voor agents die gestructureerde data willen.
4. **Schema.org** – In de HTML voor zoekmachines en AI’s die structured data gebruiken.

### 7. RSS-feed
**URL:** https://www.savedsouls-foundation.com/feed.xml

RSS 2.0-feed met belangrijke pagina’s (donate, adopt, sponsor, etc.) voor feed readers en AI-agents.

### 8. FAQ Schema (JSON-LD)
Op de FAQ-pagina: `FAQPage`-schema met alle 30 vragen en antwoorden voor zoekmachines en AI.

### 9. .well-known/ai
**URL:** https://www.savedsouls-foundation.com/.well-known/ai

Well-known URI voor AI-context, met verwijzingen naar ai.txt en andere bronnen.
