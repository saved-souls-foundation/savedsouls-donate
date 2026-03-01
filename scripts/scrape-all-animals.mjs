#!/usr/bin/env node
/**
 * Scrape all dogs and cats from savedsouls-foundation.com
 * Run: node scripts/scrape-all-animals.mjs
 * - Fetches all list pages to get IDs
 * - For each animal, fetches detail page for name, story, image
 * - Downloads images to public/animals/
 * - Writes data/animals.json
 */
import { createWriteStream } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { get } from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://www.savedsouls-foundation.com";
const DELAY_MS = 800;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; SavedSouls/1.0)" } },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    ).on("error", reject);
  });
}

async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      const file = createWriteStream(filePath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", reject);
  });
}

function parseSize(sizeStr) {
  if (!sizeStr) return "medium";
  const s = sizeStr.toLowerCase();
  if (s.includes("small")) return "small";
  if (s.includes("large")) return "large";
  return "medium";
}

function parseGender(genderStr) {
  if (!genderStr) return "male";
  return genderStr.toLowerCase().includes("female") ? "female" : "male";
}

function parseDetailPage(html, type) {
  const result = { name: "", thaiName: "", gender: "male", age: "", size: "medium", story: "", imageUrl: "" };

  // Title: <h1>Bailey</h1> or similar
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    const title = h1Match[1].trim();
    const slashIdx = title.indexOf(" / ");
    if (slashIdx > 0) {
      result.name = title.substring(0, slashIdx).trim();
      result.thaiName = title.substring(slashIdx + 3).trim();
    } else {
      result.name = title;
    }
  }

  // Table: Gender | Male, Age | X years, Size | Medium
  const genderMatch = html.match(/Gender[\s\S]*?<td[^>]*>([^<]+)</i);
  if (genderMatch) result.gender = parseGender(genderMatch[1]);

  const ageMatch = html.match(/Age[\s\S]*?<td[^>]*>([^<]+)</i);
  if (ageMatch) result.age = ageMatch[1].trim();

  const sizeMatch = html.match(/Size[\s\S]*?<td[^>]*>([^<]+)</i);
  if (sizeMatch) result.size = parseSize(sizeMatch[1]);

  // Adoption Story - content after "Adoption Story" heading
  const storyMatch = html.match(/Adoption Story[\s\S]*?<\/h[1-6]>[\s\S]*?(?:<p>|)([\s\S]*?)(?=<h[1-6]|<\/div>|$)/i);
  if (storyMatch) {
    result.story = storyMatch[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1500);
  }

  // Main image - wp-content upload, exclude thumbnails
  const imgRe = /<img[^>]+src=["']([^"']+(?:wp-content|upload)[^"']*\.(?:jpg|jpeg|png|webp))["']/gi;
  let m;
  const urls = [];
  while ((m = imgRe.exec(html))) {
    let src = m[1];
    if (src.startsWith("//")) src = "https:" + src;
    else if (src.startsWith("/")) src = BASE + src;
    if (!src.includes("-150x") && !src.includes("-300x") && !src.includes("-100x")) urls.push(src);
  }
  result.imageUrl = urls[0] || "";

  return result;
}

async function collectDogIds() {
  const ids = new Set();
  for (let p = 1; p <= 19; p++) {
    try {
      const html = await fetchHtml(`${BASE}/adopt-a-dog/?dog_page=${p}`);
      const matches = html.matchAll(/adoption-dog\/\?dog=(\d+)/g);
      for (const m of matches) ids.add(m[1]);
      console.log(`  Dog list page ${p}: ${ids.size} total`);
    } catch (e) {
      console.log(`  Dog list page ${p}: error`, e.message);
    }
    await sleep(DELAY_MS);
  }
  return [...ids].sort((a, b) => Number(a) - Number(b));
}

async function collectCatIds() {
  const ids = new Set();
  const fallbackPage2 = ["2", "3", "5", "19", "24", "26", "31", "35", "38", "44", "46", "49"];
  for (let p = 1; p <= 4; p++) {
    try {
      const html = await fetchHtml(`${BASE}/adopt-a-cat/?cat_page=${p}`);
      const matches = html.matchAll(/adoption-cat\/\?cat=(\d+)/g);
      for (const m of matches) ids.add(m[1]);
      console.log(`  Cat list page ${p}: ${ids.size} total`);
    } catch (e) {
      console.log(`  Cat list page ${p}: error`, e.message);
      if (p === 2) fallbackPage2.forEach((id) => ids.add(id));
    }
    await sleep(DELAY_MS);
  }
  return [...ids].sort((a, b) => Number(a) - Number(b));
}

async function main() {
  const projectRoot = path.join(__dirname, "..");
  await mkdir(path.join(projectRoot, "public", "animals"), { recursive: true });

  console.log("Collecting dog IDs...");
  const dogIds = await collectDogIds();
  console.log(`Found ${dogIds.length} dogs`);

  console.log("Collecting cat IDs...");
  const catIds = await collectCatIds();
  console.log(`Found ${catIds.length} cats`);

  const dogs = [];
  const cats = [];

  for (let i = 0; i < dogIds.length; i++) {
    const id = dogIds[i];
    try {
      const html = await fetchHtml(`${BASE}/adoption-dog/?dog=${id}`);
      const parsed = parseDetailPage(html, "dog");
      const dog = {
        id: String(id),
        name: parsed.name || `Dog ${id}`,
        thaiName: parsed.thaiName || "",
        gender: parsed.gender,
        age: parsed.age || "",
        size: parsed.size,
        image: `/animals/dog-${id}.jpg`,
        story: parsed.story || `${parsed.name || "This dog"} is looking for a loving home. Contact us to learn more.`,
      };
      dogs.push(dog);

      if (parsed.imageUrl) {
        const ext = parsed.imageUrl.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || "jpg";
        const filePath = path.join(projectRoot, "public", "animals", `dog-${id}.${ext}`);
        await download(parsed.imageUrl, filePath);
      }
      console.log(`  [${i + 1}/${dogIds.length}] dog ${id}: ${dog.name}`);
    } catch (e) {
      console.log(`  dog ${id}: error`, e.message);
      dogs.push({
        id: String(id),
        name: `Dog ${id}`,
        thaiName: "",
        gender: "male",
        age: "",
        size: "medium",
        image: `/animals/dog-${id}.jpg`,
        story: "Looking for a loving home. Contact us to learn more.",
      });
    }
    await sleep(DELAY_MS);
  }

  for (let i = 0; i < catIds.length; i++) {
    const id = catIds[i];
    try {
      const html = await fetchHtml(`${BASE}/adoption-cat/?cat=${id}`);
      const parsed = parseDetailPage(html, "cat");
      const cat = {
        id: String(id),
        name: parsed.name || `Cat ${id}`,
        thaiName: parsed.thaiName || "",
        gender: parsed.gender,
        size: parsed.size,
        image: `/animals/cat-${id}.jpg`,
        story: parsed.story || `${parsed.name || "This cat"} is looking for a loving home. Contact us to learn more.`,
      };
      cats.push(cat);

      if (parsed.imageUrl) {
        const ext = parsed.imageUrl.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || "jpg";
        const filePath = path.join(projectRoot, "public", "animals", `cat-${id}.${ext}`);
        await download(parsed.imageUrl, filePath);
      }
      console.log(`  [${i + 1}/${catIds.length}] cat ${id}: ${cat.name}`);
    } catch (e) {
      console.log(`  cat ${id}: error`, e.message);
      cats.push({
        id: String(id),
        name: `Cat ${id}`,
        thaiName: "",
        gender: "male",
        size: "medium",
        image: `/animals/cat-${id}.jpg`,
        story: "Looking for a loving home. Contact us to learn more.",
      });
    }
    await sleep(DELAY_MS);
  }

  const output = { dogs, cats };
  const jsonPath = path.join(projectRoot, "data", "animals.json");
  await writeFile(jsonPath, JSON.stringify(output, null, 2));
  console.log(`\nSaved ${dogs.length} dogs and ${cats.length} cats to data/animals.json`);
}

main().catch(console.error);
