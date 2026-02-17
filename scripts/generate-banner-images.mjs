#!/usr/bin/env node
/**
 * Generates PNG, WebP, JPG from each banner HTML.
 * Run: npm run generate-banners (starts server, runs script)
 * Or: npx serve public -p 3333 & node scripts/generate-banner-images.mjs
 */
import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const BANNERS_DIR = join(PUBLIC, "banners");
const PORT = 3333;
const BASE = `http://localhost:${PORT}`;

const BANNER_FILES = [
  "728x90-leaderboard-en", "728x90-leaderboard-nl",
  "728x90-leaderboard-blue-en", "728x90-leaderboard-blue-nl",
  "970x250-billboard-en", "970x250-billboard-nl",
  "970x250-billboard-blue-en", "970x250-billboard-blue-nl",
  "300x250-rectangle-en", "300x250-rectangle-nl",
  "300x250-rectangle-blue-en", "300x250-rectangle-blue-nl",
  "336x280-large-rectangle-en", "336x280-large-rectangle-blue-en", "336x280-large-rectangle-blue-nl",
  "160x600-skyscraper-en", "160x600-skyscraper-nl",
  "160x600-skyscraper-blue-en", "160x600-skyscraper-blue-nl",
  "320x50-mobile-en", "320x50-mobile-nl",
  "320x50-mobile-blue-en", "320x50-mobile-blue-nl",
  "250x250-square-en", "250x250-square-nl",
  "250x250-square-blue-en", "250x250-square-blue-nl",
  "200x200-round-en", "200x200-round-nl",
  "300x600-halfpage-en",
  "468x60-banner-en", "468x60-banner-nl",
  "468x60-banner-blue-en", "468x60-banner-blue-nl",
  "320x100-large-mobile-blue-en", "320x100-large-mobile-blue-nl",
];

function getBannerDimensions(name) {
  const m = name.match(/^(\d+)x(\d+)-/);
  if (m) return { w: parseInt(m[1], 10), h: parseInt(m[2], 10) };
  return { w: 728, h: 90 };
}

function serveFile(pathname) {
  const file = pathname === "/" ? "/index.html" : pathname;
  const full = join(PUBLIC, file.replace(/^\//, ""));
  if (!existsSync(full)) return null;
  const ext = file.split(".").pop();
  const types = { html: "text/html", png: "image/png", webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg" };
  return { body: readFileSync(full), type: types[ext] || "application/octet-stream" };
}

const server = createServer((req, res) => {
  const r = serveFile(req.url);
  if (!r) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "Content-Type": r.type });
  res.end(r.body);
});

server.listen(PORT, async () => {
  console.log("Server on port", PORT);
  try {
    const puppeteer = await import("puppeteer");
    const sharp = (await import("sharp")).default;
    const browser = await puppeteer.default.launch({ headless: "new" });

    for (const name of BANNER_FILES) {
      const { w, h } = getBannerDimensions(name);
      const url = `${BASE}/banners/${name}.html`;
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
      await new Promise((r) => setTimeout(r, 500));

      const el = await page.$(".banner");
      if (!el) {
        console.warn("No .banner element:", name);
        await page.close();
        continue;
      }

      const pngPath = join(BANNERS_DIR, `${name}.png`);
      await el.screenshot({
        path: pngPath,
        omitBackground: false,
        clip: { x: 0, y: 0, width: w, height: h },
      });
      await page.close();

      let buf = readFileSync(pngPath);
      const meta = await sharp(buf).metadata();
      if (meta.width !== w || meta.height !== h) {
        buf = await sharp(buf).resize(w, h).png().toBuffer();
        await import("fs").then((fs) => fs.promises.writeFile(pngPath, buf));
      }

      await sharp(buf).webp({ quality: 90 }).toFile(join(BANNERS_DIR, `${name}.webp`));
      await sharp(buf).jpeg({ quality: 90 }).toFile(join(BANNERS_DIR, `${name}.jpg`));
      const b64 = buf.toString("base64");
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <image href="data:image/png;base64,${b64}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
      await import("fs").then((fs) => fs.promises.writeFile(join(BANNERS_DIR, `${name}.svg`), svg));
      console.log("Generated:", name, `(${w}x${h})`);
    }

    await browser.close();
    console.log("Done.");
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
    process.exit(0);
  }
});
