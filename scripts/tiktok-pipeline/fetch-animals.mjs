#!/usr/bin/env node
/**
 * Script 1 — fetch-animals (plain Node.js, geen ts-node/tsx nodig)
 *
 * Run:
 *   node scripts/tiktok-pipeline/fetch-animals.mjs
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const DOGS_API = "https://db.savedsouls-foundation.org/api/dogs.php";
const CATS_API = "https://db.savedsouls-foundation.org/api/cats.php";
const PER_PAGE = 100;
const DELAY_MS = 1000;

const OUTPUT_DIR = "/Users/mike/Documents/savedsouls-tiktok";
const OUTPUT_FILE = join(OUTPUT_DIR, "animals.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseDisplayName(fullName) {
  const parts = (fullName || "").split(" / ");
  return (parts[0] || fullName || "Unknown").trim();
}

function toGender(g) {
  return (g || "").toLowerCase() === "female" ? "female" : "male";
}

function weightToSize(weight) {
  if (!weight || weight <= 0) return "medium";
  if (weight < 10) return "small";
  if (weight <= 20) return "medium";
  return "large";
}

function formatAge(dateOfBirth) {
  if (!dateOfBirth) return "Unknown";
  try {
    const birth = new Date(dateOfBirth);
    if (Number.isNaN(birth.getTime())) return "Unknown";
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) years--;
    if (years < 0) return "Unknown";
    if (years === 0) {
      const months = Math.max(
        0,
        (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      return months < 12 ? `~${Math.round(months)} months` : "~1 year";
    }
    return years === 1 ? "1 year" : `${years} years`;
  } catch {
    return "Unknown";
  }
}

async function fetchAllPages(baseUrl, label) {
  const all = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${baseUrl}?page=${page}&per_page=${PER_PAGE}`;
    console.log(`  → ${label} pagina ${page}…`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${label} API error: HTTP ${res.status} (${url})`);
    }
    const json = await res.json();
    const data = json.data ?? [];
    const pagination = json.pagination ?? {};
    all.push(...data);
    hasMore = (pagination.current_page ?? page) < (pagination.total_pages ?? page);
    page++;
    if (hasMore) await sleep(DELAY_MS);
  }

  return all;
}

function mapRawToTikTok(raw, type) {
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.filter((u) => typeof u === "string" && u.trim())
      : raw.image
        ? [raw.image]
        : [];
  const mainImage = (raw.image || images[0] || "").trim();

  return {
    id: String(raw.id),
    name: parseDisplayName(raw.name || ""),
    gender: toGender(raw.gender),
    age: formatAge(raw.date_of_birth),
    size: weightToSize(raw.weight),
    image: mainImage,
    images,
    story: (raw.adoption_story || "").trim(),
    type,
  };
}

function hasPhoto(a) {
  return Boolean(a.image?.trim());
}

function hasStory(a) {
  return Boolean(a.story?.trim());
}

async function main() {
  console.log("📥 Saved Souls — fetch animals (read-only)\n");
  console.log(`Output: ${OUTPUT_FILE}\n`);

  console.log("Fetching dogs…");
  const rawDogs = await fetchAllPages(DOGS_API, "dogs");
  await sleep(DELAY_MS);

  console.log("Fetching cats…");
  const rawCats = await fetchAllPages(CATS_API, "cats");

  const dogs = rawDogs.map((d) => mapRawToTikTok(d, "dog"));
  const cats = rawCats.map((c) => mapRawToTikTok(c, "cat"));
  const all = [...dogs, ...cats];

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        counts: { dogs: dogs.length, cats: cats.length, total: all.length },
        animals: all,
      },
      null,
      2
    ),
    "utf8"
  );

  const noPhoto = all.filter((a) => !hasPhoto(a));
  const noStory = all.filter((a) => !hasStory(a));

  console.log("\n--- Summary ---");
  console.log(`✅ Total dogs: ${dogs.length}`);
  console.log(`✅ Total cats: ${cats.length}`);
  console.log(`✅ Total animals: ${all.length}`);
  console.log(`✅ Saved to: ${OUTPUT_FILE}`);

  if (noPhoto.length > 0) {
    console.log(`⚠️  Animals without photo: ${noPhoto.length}`);
    console.log(`   ${noPhoto.map((a) => `${a.name} (${a.type}, id ${a.id})`).join(", ")}`);
  } else {
    console.log("⚠️  Animals without photo: 0");
  }

  if (noStory.length > 0) {
    console.log(`⚠️  Animals without story: ${noStory.length}`);
    console.log(`   ${noStory.map((a) => `${a.name} (${a.type}, id ${a.id})`).join(", ")}`);
  } else {
    console.log("⚠️  Animals without story: 0");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("❌ fetch-animals failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
