#!/usr/bin/env node
/**
 * Script 3 — prepare-upload
 *
 * Leest animals.json en maakt upload-queue.csv voor TikTok-planning.
 *
 *   node scripts/tiktok-pipeline/prepare-upload.mjs
 */

import { access, readFile, writeFile } from "fs/promises";
import { join } from "path";

const BASE_DIR = "/Users/mike/Documents/savedsouls-tiktok";
const ANIMALS_FILE = join(BASE_DIR, "animals.json");
const VIDEOS_DIR = join(BASE_DIR, "videos");
const OUTPUT_CSV = join(BASE_DIR, "upload-queue.csv");

const TIMEZONE = "Europe/Amsterdam";
const SLOT_HOURS = [9, 14, 19];
const STORY_MAX_CHARS = 80;
const STORY_FALLBACK = "Looking for a loving home 🏠";
const SKIP_IDS = new Set(["268"]);

const HASHTAGS = {
  dog: "#rescuedog #adoptdontshop #dogadoption #ThailandRescue #savedsouls #straathond",
  cat: "#rescuecat #adoptdontshop #catadoption #ThailandRescue #savedsouls #straatkat",
};

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function todayInTimezone() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(new Date());
}

function addDaysToIsoDate(isoDate, days) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

function scheduledTime(index) {
  const dayOffset = Math.floor(index / SLOT_HOURS.length);
  const hour = SLOT_HOURS[index % SLOT_HOURS.length];
  const date = addDaysToIsoDate(todayInTimezone(), 1 + dayOffset);
  return `${date} ${String(hour).padStart(2, "0")}:00 CET`;
}

function storySnippet(story) {
  const text = (story || "").trim().replace(/\s+/g, " ");
  const raw = text || STORY_FALLBACK;
  if (raw.length <= STORY_MAX_CHARS) return raw;
  return `${raw.slice(0, STORY_MAX_CHARS - 1)}…`;
}

function buildCaption(animal) {
  const name = animal.name || "this sweet soul";
  const story = storySnippet(animal.story);
  const isCat = animal.type === "cat";
  const emoji = isCat ? "🐱" : "🐾";

  return [
    `Meet ${name}! ${emoji} ${story}`,
    "Looking for a forever home 🏠",
    "savedsouls-foundation.com/adopt",
  ].join("\n");
}

function hashtagsFor(animal) {
  return animal.type === "cat" ? HASHTAGS.cat : HASHTAGS.dog;
}

function csvCell(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvRow(cells) {
  return cells.map(csvCell).join(",");
}

async function main() {
  console.log("📋 Saved Souls — prepare upload queue\n");

  const raw = await readFile(ANIMALS_FILE, "utf8");
  const data = JSON.parse(raw);
  const animals = Array.isArray(data.animals) ? data.animals : [];

  const eligible = animals.filter(
    (a) => a.image?.trim() && !SKIP_IDS.has(String(a.id))
  );

  const withVideo = [];
  let missingVideo = 0;

  for (const animal of eligible) {
    const id = String(animal.id);
    const videoPath = join(VIDEOS_DIR, `${id}.mp4`);
    if (await fileExists(videoPath)) {
      withVideo.push(animal);
    } else {
      missingVideo++;
    }
  }

  const header = [
    "filename",
    "animal_name",
    "caption",
    "hashtags",
    "scheduled_time",
  ];

  const rows = withVideo.map((animal, index) => {
    const id = String(animal.id);
    return toCsvRow([
      `${id}.mp4`,
      animal.name || "",
      buildCaption(animal),
      hashtagsFor(animal),
      scheduledTime(index),
    ]);
  });

  const csv = [toCsvRow(header), ...rows].join("\n") + "\n";
  await writeFile(OUTPUT_CSV, csv, "utf8");

  const dogs = withVideo.filter((a) => a.type === "dog").length;
  const cats = withVideo.filter((a) => a.type === "cat").length;
  const lastSlot = withVideo.length > 0 ? scheduledTime(withVideo.length - 1) : "—";
  const days =
    withVideo.length > 0
      ? Math.ceil(withVideo.length / SLOT_HOURS.length)
      : 0;

  console.log(`Animals in JSON:        ${animals.length}`);
  console.log(`Eligible (excl. skip): ${eligible.length}`);
  console.log(`With video file:       ${withVideo.length} (${dogs} dogs, ${cats} cats)`);
  if (missingVideo > 0) {
    console.log(`Skipped (no .mp4):     ${missingVideo}`);
  }
  console.log(`Schedule:              3/day at 09:00, 14:00, 19:00 CET`);
  console.log(`First post:            ${withVideo.length > 0 ? scheduledTime(0) : "—"}`);
  console.log(`Last post:             ${lastSlot}`);
  console.log(`Span:                  ${days} day(s)\n`);
  console.log(`✅ ${OUTPUT_CSV}`);
}

main().catch((err) => {
  console.error("❌ prepare-upload failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
