#!/usr/bin/env node
/**
 * Fetch logos for shelters that don't have one yet.
 * Run: node scripts/fetch-shelter-logos.mjs
 * Fetches og:image or logo images from shelter websites and saves to public/logos/
 */
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { get } from "https";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, "..", "public", "logos");
const DELAY_MS = 800;

// Shelters without logos: { name, url, slug } - nieuwe shelters (50 stuks)
const SHELTERS_NEEDING_LOGOS = [
  { name: "Tierheim Basel TBB", url: "https://www.tbb.ch", slug: "tierheim-basel-tbb" },
  { name: "Stiftung Tierrettungsdienst", url: "https://www.tierrettungsdienst.ch", slug: "tierrettungsdienst" },
  { name: "Stiftung Tierheim St.Gallen", url: "https://www.tierheim-sg.ch", slug: "tierheim-stgallen" },
  { name: "Schweizer Tierschutz STS", url: "https://www.tierschutz.com", slug: "schweizer-tierschutz-sts" },
  { name: "Tierschutzverein Liechtenstein", url: "https://www.tierschutzverein.li", slug: "tierschutzverein-liechtenstein" },
  { name: "SPA Monaco", url: "https://www.spamonaco.mc", slug: "spa-monaco" },
  { name: "ALPA Luxembourg", url: "https://www.alpa.lu", slug: "alpa-luxembourg" },
  { name: "Dyreværnet Denmark", url: "https://www.dyrevaernet.dk", slug: "dyrevaernet-denmark" },
  { name: "Dyrebeskyttelsen Norge", url: "https://www.dyrebeskyttelsen.no", slug: "dyrebeskyttelsen-norge" },
  { name: "HESY Helsinki", url: "https://www.hesy.fi", slug: "hesy-helsinki" },
  { name: "Viikki Animal Shelter", url: "https://www.viikinloytoelaintalo.fi", slug: "viikki-animal-shelter" },
  { name: "Hundar Utan Hem", url: "https://www.hundarutanhem.se", slug: "hundar-utan-hem" },
  { name: "Tails Rescue Sweden", url: "https://tailsrescuesweden.org", slug: "tails-rescue-sweden" },
  { name: "Dog Rescue Auktsjaur", url: "https://www.dogrescueauktsjaur.com", slug: "dog-rescue-auktsjaur" },
  { name: "SPCA Sweden", url: "https://spcasweden.se", slug: "spca-sweden" },
  { name: "SOS Animals Sweden", url: "https://www.sos-animals.se", slug: "sos-animals-sweden" },
  { name: "Wiener Tierschutzverein", url: "https://www.tierschutz-austria.at", slug: "wiener-tierschutzverein" },
  { name: "Tierschutzverein Wien", url: "https://www.tierschutzverein.at", slug: "tierschutzverein-wien" },
  { name: "Franziskus Tierheim Hamburg", url: "https://www.franziskustierheim.de", slug: "franziskus-tierheim-hamburg" },
  { name: "Hamburger Tierschutzverein", url: "https://www.hamburger-tierschutzverein.de", slug: "hamburger-tierschutzverein" },
  { name: "Deutscher Tierschutzbund", url: "https://www.tierschutzbund.de", slug: "deutscher-tierschutzbund" },
  { name: "Stichting Adopt.nl", url: "https://adoptnl.org", slug: "stichting-adopt-nl" },
  { name: "Scottish SPCA", url: "https://www.scottishspca.org", slug: "scottish-spca" },
  { name: "Animal Rescue Cymru", url: "https://www.animalrescuecymru.co.uk", slug: "animal-rescue-cymru" },
  { name: "Islay Dog Rescue", url: "https://www.islaydogrescue.org.uk", slug: "islay-dog-rescue" },
  { name: "ENPA Pistoia", url: "https://www.enpapistoia.it", slug: "enpa-pistoia" },
  { name: "ENPA Genova", url: "https://www.enpagenova.org", slug: "enpa-genova" },
  { name: "Rifugio Canile Milano", url: "https://www.comune.milano.it", slug: "rifugio-canile-milano" },
  { name: "Dyrenes Frie Farm", url: "https://dyrenesfriefarm.dk", slug: "dyrenes-frie-farm" },
  { name: "Dyrebeskyttelsen Oslo", url: "https://www.dyrebeskyttelsen.no", slug: "dyrebeskyttelsen-oslo" },
  { name: "SPA Nice", url: "https://www.la-spa.fr", slug: "spa-nice" },
  { name: "SPA Paris", url: "https://www.la-spa.fr", slug: "spa-paris" },
  { name: "Tierheim Pfötli", url: "https://www.tierrettungsdienst.ch", slug: "tierheim-pfoetli" },
  { name: "Schweizer Tierschutz Basel", url: "https://www.tierschutz.com", slug: "schweizer-tierschutz-basel" },
  { name: "ENPA Verona", url: "https://www.enpaverona.it", slug: "enpa-verona" },
  { name: "ENPA Faenza", url: "https://www.enpa.org", slug: "enpa-faenza" },
  { name: "Animal Equality Italia", url: "https://www.animalequality.it", slug: "animal-equality-italia" },
  { name: "Scottish Animal Welfare", url: "https://www.scottishanimalwelfare.org.uk", slug: "scottish-animal-welfare" },
  { name: "Tierheim Wien", url: "https://www.wien.gv.at/zusammenleben/tierquartier", slug: "tierheim-wien" },
  { name: "Reykjavik Animal Services", url: "https://reykjavik.is", slug: "reykjavik-animal-services" },
  { name: "Dyreværnet Kolding", url: "https://www.dyrevaernet.dk", slug: "dyrevaernet-kolding" },
  { name: "Dyrebeskyttelsen Nord-Jæren", url: "https://www.dyrebeskyttelsen.no", slug: "dyrebeskyttelsen-nord-jaeren" },
  { name: "Tierschutz Linth", url: "https://www.tierschutzlinth.ch", slug: "tierschutz-linth" },
  { name: "STS Schweizer Tierschutz", url: "https://www.sts-psa.ch", slug: "sts-schweizer-tierschutz" },
  { name: "LAV Bergamo", url: "https://www.lav.it", slug: "lav-bergamo" },
  { name: "LAV Bologna", url: "https://www.lav.it", slug: "lav-bologna" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseUrl(urlStr) {
  try {
    return new URL(urlStr);
  } catch {
    return null;
  }
}

function resolveUrl(baseUrl, href) {
  if (!href || href.startsWith("data:")) return null;
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return null;
  }
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? get : http.get;
    client(
      url,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SavedSouls/1.0; +https://savedsouls-foundation.org)" },
        timeout: 15000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchHtml(resolveUrl(url, res.headers.location)).then(resolve).catch(reject);
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    ).on("error", reject);
  });
}

function extractLogoUrl(html, baseUrl) {
  // 1. og:image (often the best logo/social image)
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch) {
    const url = resolveUrl(baseUrl, ogMatch[1].trim());
    if (url && /\.(jpg|jpeg|png|webp|svg)/i.test(url)) return url;
  }

  // 2. link rel="apple-touch-icon" or shortcut icon (often high-res logo)
  const iconMatch = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:apple-touch-icon|shortcut icon)["']/i);
  if (iconMatch) {
    const url = resolveUrl(baseUrl, iconMatch[1].trim());
    if (url) return url;
  }

  // 3. img with "logo" in src
  const imgRe = /<img[^>]+src=["']([^"']*logo[^"']*)["']/gi;
  let m;
  while ((m = imgRe.exec(html))) {
    const url = resolveUrl(baseUrl, m[1].trim());
    if (url && /\.(jpg|jpeg|png|webp)/i.test(url) && !url.includes("avatar") && !url.includes("gravatar")) {
      return url;
    }
  }

  return null;
}

function tryCommonPaths(baseUrl) {
  const base = baseUrl.replace(/\/$/, "");
  const paths = [
    "/logo.png", "/Logo.png", "/logo.svg", "/Logo.svg",
    "/images/logo.png", "/img/logo.png", "/assets/logo.png",
    "/logo.jpg", "/images/logo.jpg", "/favicon.png",
  ];
  return paths.map((p) => base + p);
}

async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? get : http.get;
    const req = client(
      url,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; SavedSouls/1.0)" }, timeout: 10000 },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          downloadImage(resolveUrl(url, res.headers.location), filePath).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const ext = path.extname(new URL(url).pathname) || ".png";
        const outPath = filePath.endsWith(ext) ? filePath : filePath.replace(/\.[^.]+$/, ext);
        const file = createWriteStream(outPath);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(outPath);
        });
      }
    );
    req.on("error", reject);
  });
}

async function fetchWithHead(url) {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? get : http.get;
    const req = client(url, { method: "HEAD", timeout: 5000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
  });
}

async function main() {
  await mkdir(LOGOS_DIR, { recursive: true });

  // Dedupe by slug (same org may appear twice, e.g. Dierenbescherming)
  const seen = new Set();
  const toProcess = SHELTERS_NEEDING_LOGOS.filter((s) => {
    if (seen.has(s.slug)) return false;
    seen.add(s.slug);
    return true;
  });

  console.log(`Fetching logos for ${toProcess.length} shelters...\n`);

  const results = [];

  for (const shelter of toProcess) {
    process.stdout.write(`${shelter.name}... `);
    try {
      const html = await fetchHtml(shelter.url);
      let logoUrl = extractLogoUrl(html, shelter.url);

      if (!logoUrl) {
        // Try common paths
        const candidates = tryCommonPaths(shelter.url);
        for (const candidate of candidates) {
          if (await fetchWithHead(candidate)) {
            logoUrl = candidate;
            break;
          }
        }
      }

      if (!logoUrl) {
        console.log("geen logo gevonden");
        results.push({ shelter, success: false });
        await sleep(DELAY_MS);
        continue;
      }

      const outPath = path.join(LOGOS_DIR, `${shelter.slug}.png`);
      const savedPath = await downloadImage(logoUrl, outPath);
      const logoFile = path.basename(savedPath);
      console.log(`OK -> ${logoFile}`);
      results.push({ shelter, success: true, logo: `/logos/${logoFile}` });
    } catch (err) {
      console.log(`fout: ${err.message}`);
      results.push({ shelter, success: false, error: err.message });
    }
    await sleep(DELAY_MS);
  }

  const succeeded = results.filter((r) => r.success);
  console.log(`\n${succeeded.length}/${toProcess.length} logos gedownload.`);

  if (succeeded.length > 0) {
    console.log("\nVoeg deze toe aan de shelters in page.tsx:");
    for (const r of succeeded) {
      console.log(`  { name: "${r.shelter.name}", ... logo: "${r.logo}" },`);
    }
  }
}

main().catch(console.error);
