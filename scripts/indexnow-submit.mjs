#!/usr/bin/env node
/**
 * Meldt gewijzigde pagina's aan bij zoekmachines via IndexNow (Bing, Yandex, Seznam, Naver).
 * Bing voedt o.a. ChatGPT Search en Copilot. Google doet niet mee: gebruik daarvoor Search Console.
 *
 * De sleutel staat als bestand in /public/<KEY>.txt (moet live bereikbaar zijn).
 *
 * Gebruik:
 *   node scripts/indexnow-submit.mjs                 # partnerpagina in alle talen + llms.txt/ai.txt
 *   node scripts/indexnow-submit.mjs /nl/blog /en/faq   # eigen paden
 */

const HOST = "www.savedsouls-foundation.org";
const KEY = "4379cbab2a674cf9a0cb6b0dc68b768c";
const LOCALES = ["nl", "en", "es", "ru", "th", "de", "fr", "pl", "sv", "cs", "de-CH", "ko", "ja", "da", "no", "zh-TW", "it", "pt-BR", "vi", "ms", "zh"];

const args = process.argv.slice(2);
const paths = args.length
  ? args
  : [...LOCALES.map((l) => `/${l}/partners`), "/llms.txt", "/ai.txt"];

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: paths.map((p) => `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`),
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
console.log(`IndexNow: HTTP ${res.status} voor ${body.urlList.length} URL's`);
if (!res.ok) {
  console.log(await res.text());
  process.exit(1);
}
