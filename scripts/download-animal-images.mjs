#!/usr/bin/env node
/**
 * Download animal images from savedsouls-foundation.org
 * Run: node scripts/download-animal-images.mjs
 * Reads IDs from data/animals.json and saves to public/animals/
 */
import { createWriteStream } from "fs";
import { mkdir, readFile } from "fs/promises";
import { get } from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://www.savedsouls-foundation.org";
const DELAY_MS = 600;

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

function extractImageUrls(html) {
  const urls = [];
  const imgRe = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = imgRe.exec(html))) {
    let src = m[1];
    if (src.startsWith("//")) src = "https:" + src;
    else if (src.startsWith("/")) src = BASE + src;
    if (src.includes("wp-content") || src.includes("upload") || src.match(/\.(jpg|jpeg|png|webp)/i))
      urls.push(src);
  }
  return [...new Set(urls)];
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

async function main() {
  const projectRoot = path.join(__dirname, "..");
  const animalsPath = path.join(projectRoot, "data", "animals.json");
  const data = JSON.parse(await readFile(animalsPath, "utf-8"));
  const dogIds = data.dogs.map((d) => d.id);
  const catIds = data.cats.map((c) => c.id);

  await mkdir(path.join(projectRoot, "public", "animals"), { recursive: true });

  console.log(`Downloading ${dogIds.length} dog images...`);
  for (let i = 0; i < dogIds.length; i++) {
    const id = dogIds[i];
    const outPath = path.join(projectRoot, "public", "animals", `dog-${id}.jpg`);
    try {
      const html = await fetchHtml(`${BASE}/adoption-dog/?dog=${id}`);
      const urls = extractImageUrls(html);
      const mainImg = urls.find((u) => !u.includes("-150x") && !u.includes("-300x")) || urls[0];
      if (mainImg) {
        const ext = mainImg.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || "jpg";
        const pathWithExt = path.join(projectRoot, "public", "animals", `dog-${id}.${ext}`);
        await download(mainImg, pathWithExt);
        console.log(`  [${i + 1}/${dogIds.length}] dog-${id}: saved`);
      } else {
        console.log(`  [${i + 1}/${dogIds.length}] dog-${id}: no image found`);
      }
    } catch (e) {
      console.log(`  [${i + 1}/${dogIds.length}] dog-${id}: error`, e.message);
    }
    await sleep(DELAY_MS);
  }

  console.log(`Downloading ${catIds.length} cat images...`);
  for (let i = 0; i < catIds.length; i++) {
    const id = catIds[i];
    try {
      const html = await fetchHtml(`${BASE}/adoption-cat/?cat=${id}`);
      const urls = extractImageUrls(html);
      const mainImg = urls.find((u) => !u.includes("-150x") && !u.includes("-300x")) || urls[0];
      if (mainImg) {
        const ext = mainImg.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || "jpg";
        const filePath = path.join(projectRoot, "public", "animals", `cat-${id}.${ext}`);
        await download(mainImg, filePath);
        console.log(`  [${i + 1}/${catIds.length}] cat-${id}: saved`);
      } else {
        console.log(`  [${i + 1}/${catIds.length}] cat-${id}: no image found`);
      }
    } catch (e) {
      console.log(`  [${i + 1}/${catIds.length}] cat-${id}: error`, e.message);
    }
    await sleep(DELAY_MS);
  }
  console.log("Done.");
}

main().catch(console.error);
