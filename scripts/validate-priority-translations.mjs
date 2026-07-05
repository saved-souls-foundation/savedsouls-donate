#!/usr/bin/env node
import { readFileSync } from "fs";

const PRIORITY = [
  "common",
  "nav",
  "seo",
  "exitPopup",
  "donate",
  "bedankt",
  "cookieConsent",
  "story",
  "aboutUs",
  "contactPage",
  "getInvolved",
  "volunteer",
  "adoptPage",
  "faq",
];

const locales = process.argv.slice(2).length ? process.argv.slice(2) : ["pl", "sv", "cs", "de-CH", "ko", "ja", "da", "no", "zh-TW", "it", "pt-BR"];
const en = JSON.parse(readFileSync("messages/en.json", "utf8"));

let ok = true;
for (const locale of locales) {
  const data = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
  console.log(`\n=== ${locale} ===`);
  for (const ns of PRIORITY) {
    if (!data[ns]) {
      console.log(`  MISSING: ${ns}`);
      ok = false;
      continue;
    }
    const same = JSON.stringify(en[ns]) === JSON.stringify(data[ns]);
    if (same) {
      console.log(`  STILL ENGLISH: ${ns}`);
      ok = false;
    } else {
      console.log(`  OK: ${ns}`);
    }
  }
}
process.exit(ok ? 0 : 1);
