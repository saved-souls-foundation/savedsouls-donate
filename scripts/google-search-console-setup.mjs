#!/usr/bin/env node
/**
 * Google Search Console – voorbereiding & verificatie
 *
 * Gebruik:
 *   node scripts/google-search-console-setup.mjs html <content>
 *     → Schrijft public/google<content>.html voor GSC HTML-file verificatie.
 *   node scripts/google-search-console-setup.mjs meta
 *     → Toont instructies voor meta-tag verificatie (env GOOGLE_SITE_VERIFICATION).
 *   node scripts/google-search-console-setup.mjs urls
 *     → Toont sitemap + robots URL voor aanmelden in GSC.
 */

const BASE_URL = "https://www.savedsouls-foundation.com";
const fs = await import("fs");
const path = await import("path");
const { fileURLToPath } = await import("url");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

function usage() {
  console.log(`
Google Search Console – setup script

  node scripts/google-search-console-setup.mjs html <content>
    Maakt public/google<content>.html voor verificatie via "HTML-bestand uploaden".
    Voorbeeld: node scripts/google-search-console-setup.mjs html 1a2b3c4d5e

  node scripts/google-search-console-setup.mjs meta
    Toont hoe je meta-tag verificatie gebruikt (GOOGLE_SITE_VERIFICATION in .env).

  node scripts/google-search-console-setup.mjs urls
    Toont Sitemap- en robots-URLs om in GSC in te voeren bij aanmelden.
`);
}

const cmd = process.argv[2];
const arg = process.argv[3];

if (!cmd || cmd === "help" || cmd === "-h" || cmd === "--help") {
  usage();
  process.exit(0);
}

if (cmd === "urls") {
  console.log("\n— URLs voor Google Search Console —\n");
  console.log("Eigenschap-URL (voer exact zo in):");
  console.log(`  ${BASE_URL}\n`);
  console.log("Sitemap (na verificatie toevoegen onder Sitemaps):");
  console.log(`  ${BASE_URL}/sitemap.xml\n`);
  console.log("Robots.txt (controle):");
  console.log(`  ${BASE_URL}/robots.txt\n`);
  console.log("Verificatie: gebruik 'html' of 'meta' subcommando.\n");
  process.exit(0);
}

if (cmd === "meta") {
  console.log("\n— Meta-tag verificatie —\n");
  console.log("1. In Google Search Console kies je 'HTML-tag' als verificatiemethode.");
  console.log("2. Kopieer de content-waarde (bijv. abc123...).");
  console.log("3. Zet in .env.local (en op je host, bv. Vercel):");
  console.log("   GOOGLE_SITE_VERIFICATION=abc123...");
  console.log("4. Redeploy; de meta-tag wordt automatisch in <head> gezet.");
  console.log("5. Klik in GSC op Verifiëren.\n");
  process.exit(0);
}

if (cmd === "html") {
  if (!arg || !/^[a-zA-Z0-9_-]+$/.test(arg)) {
    console.error("Geef een geldige content-string op (alleen letters, cijfers, - en _).");
    process.exit(1);
  }
  const filename = `google${arg}.html`;
  const filepath = path.join(publicDir, filename);
  const content = "google-site-verification: " + filename.replace(".html", "");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(filepath, content, "utf8");
  console.log(`\nBestand aangemaakt: public/${filename}`);
  console.log(`Inhoud: ${content}`);
  console.log("\nIn GSC: kies 'HTML-bestand uploaden' en upload dit bestand.");
  console.log(`Of controleer dat ${BASE_URL}/${filename} deze inhoud toont.\n`);
  process.exit(0);
}

usage();
process.exit(1);
