#!/usr/bin/env node
/**
 * Dient de sitemap in bij Google Search Console via de API.
 *
 * Vereisten:
 *   1. Google Cloud-project met Search Console API ingeschakeld.
 *   2. Service account met JSON-key; e-mail van die account toegevoegd als
 *      gebruiker (Eigenaar of Volledige toegang) bij de GSC-eigenschap.
 *   3. Credentials: zet GOOGLE_APPLICATION_CREDENTIALS op het pad naar het
 *      JSON-bestand, of plaats het bestand als ./secrets/gsc-service-account.json.
 *
 * Gebruik:
 *   npm install googleapis   # eenmalig
 *   export GOOGLE_APPLICATION_CREDENTIALS=/pad/naar/service-account.json
 *   node scripts/google-search-console-submit-sitemap.mjs
 *
 * Optioneel: SITE_URL en SITEMAP_URL overschrijven (default: savedsouls-foundation.com).
 */

const BASE_URL = process.env.SITE_URL || "https://www.savedsouls-foundation.com";
const SITEMAP_URL = process.env.SITEMAP_URL || `${BASE_URL}/sitemap.xml`;

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GSC_CREDENTIALS_JSON) {
    console.error("Geen credentials. Zet GOOGLE_APPLICATION_CREDENTIALS (pad naar JSON) of GSC_CREDENTIALS_JSON (JSON-string).");
    console.error("Zie docs/GOOGLE-SEARCH-CONSOLE.md voor de stappen.");
    process.exit(1);
  }

  let google;
  try {
    google = (await import("googleapis")).google;
  } catch (e) {
    console.error("Installeer eerst: npm install googleapis");
    process.exit(1);
  }

  const credentialsJson = process.env.GSC_CREDENTIALS_JSON;
  const authOptions = {
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  };
  if (credentialsJson) {
    try {
      authOptions.credentials = JSON.parse(credentialsJson);
    } catch (e) {
      console.error("GSC_CREDENTIALS_JSON is geen geldige JSON.");
      process.exit(1);
    }
  }

  const auth = new google.auth.GoogleAuth(authOptions);
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: "v3", auth: authClient });

  // siteUrl = exacte eigenschap-URL in GSC (bijv. https://www.savedsouls-foundation.com/)
  const siteUrl = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  // feedpath = volledige sitemap-URL (zoals in de API-docs)
  const feedpath = SITEMAP_URL;

  try {
    await webmasters.sitemaps.submit({
      siteUrl,
      feedpath,
    });
    console.log("Sitemap ingediend bij Google Search Console.");
    console.log("  Site:", siteUrl);
    console.log("  Sitemap:", SITEMAP_URL);
  } catch (err) {
    if (err.code === 403 || err.response?.status === 403) {
      console.error("Toegang geweigerd. Controleer:");
      console.error("  1. Search Console API is ingeschakeld in Google Cloud.");
      console.error("  2. Service account-e-mail staat als gebruiker bij de GSC-eigenschap.");
      console.error("  3. GOOGLE_APPLICATION_CREDENTIALS wijst naar het juiste JSON-bestand.");
    } else {
      console.error("Fout bij indienen sitemap:", err.message || err);
    }
    process.exit(1);
  }
}

main();
