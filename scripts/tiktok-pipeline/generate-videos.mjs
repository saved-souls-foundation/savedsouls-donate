#!/usr/bin/env node
/**
 * Script 2 — generate-videos (plain Node.js + system ffmpeg)
 *
 * fluent-ffmpeg staat niet in package.json; dit script roept `ffmpeg` op PATH aan
 * (bijv. Homebrew: /opt/homebrew/bin/ffmpeg).
 *
 * Test (eerste 3 dieren met foto):
 *   node scripts/tiktok-pipeline/generate-videos.mjs
 *
 * Alle dieren (pas na jouw bevestiging):
 *   node scripts/tiktok-pipeline/generate-videos.mjs --all
 */

import { access, mkdir, readFile, unlink } from "fs/promises";
import { createWriteStream } from "fs";
import { spawn } from "child_process";
import { pipeline } from "stream/promises";
import { join } from "path";

const BASE_DIR = "/Users/mike/Documents/savedsouls-tiktok";
const ANIMALS_FILE = join(BASE_DIR, "animals.json");
const VIDEOS_DIR = join(BASE_DIR, "videos");
const TEMP_DIR = join(BASE_DIR, ".tmp-images");
const MUSIC_FILE = join(BASE_DIR, "assets/music.mp3");
const FONT_FILE = "/System/Library/Fonts/Supplemental/Arial Bold.ttf";

const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION_SEC = 15;
const FPS = 24;
const FRAMES = DURATION_SEC * FPS;
const ZOOM_END = 1.15;
const DELAY_MS = 2000;
const STORY_FALLBACK = "Looking for a loving home 🏠";
const STORY_CHARS_PER_LINE = 40;
const STORY_MAX_LINES = 2;
const STORY_MAX_CHARS = STORY_CHARS_PER_LINE * STORY_MAX_LINES;
const TEXT_PADDING_X = 40;
const SKIP_IDS = new Set(["268"]); // Mia — geen verhaal, overslaan

const processAll = process.argv.includes("--all");
const TEST_LIMIT = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeDrawtext(text, { multiline = false } = {}) {
  const lines = multiline ? text.split("\n") : [text.replace(/\n/g, " ")];
  return lines
    .map((line) =>
      line
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\u2019")
        .replace(/:/g, "\\:")
        .replace(/%/g, "\\%")
        .trim()
    )
    .filter(Boolean)
    .join(multiline ? "\\n" : " ")
    .trim();
}

function wrapLines(text, maxLen, maxLines) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const lines = [];
  let rest = normalized;

  while (rest && lines.length < maxLines) {
    if (rest.length <= maxLen) {
      lines.push(rest);
      break;
    }

    let breakAt = rest.lastIndexOf(" ", maxLen);
    if (breakAt <= 0) breakAt = maxLen;

    lines.push(rest.slice(0, breakAt).trim());
    rest = rest.slice(breakAt).trim();
  }

  return lines;
}

function storyLines(animal) {
  const raw = (animal.story || "").trim();
  let text = raw || STORY_FALLBACK;

  if (text.length > STORY_MAX_CHARS) {
    text = `${text.slice(0, STORY_MAX_CHARS - 1)}…`;
  }

  return wrapLines(text, STORY_CHARS_PER_LINE, STORY_MAX_LINES);
}

function extFromUrl(url) {
  try {
    const ext = new URL(url).pathname.split(".").pop()?.toLowerCase() || "";
    if (ext === "jpeg") return "jpg";
    if (["jpg", "png", "webp", "gif"].includes(ext)) return ext;
  } catch {
    /* ignore */
  }
  return "jpg";
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: HTTP ${res.status}`);
  }
  if (!res.body) {
    throw new Error("Download failed: empty response body");
  }
  await pipeline(res.body, createWriteStream(destPath));
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim().slice(-2000) || `ffmpeg exited ${code}`));
    });
    proc.on("error", reject);
  });
}

function drawtextFilter({ text, fontsize, y }) {
  const escaped = escapeDrawtext(text);
  const pad = TEXT_PADDING_X;
  // Komma's in expressies moeten ge-escaped (\,) — anders splitst ffmpeg de filterchain
  const xExpr = `max(${pad}\\,min(w-${pad}-text_w\\,(w-text_w)/2))`;
  return [
    `drawtext=fontfile='${FONT_FILE}'`,
    `text='${escaped}'`,
    `fontsize=${fontsize}`,
    "fontcolor=white",
    "shadowcolor=black@0.75",
    "shadowx=4",
    "shadowy=4",
    `x=${xExpr}`,
    `y=${y}`,
  ].join(":");
}

async function buildVideo({ imagePath, outputPath, title, subtitleLines, withMusic }) {
  const zoomExpr = `1+${(ZOOM_END - 1).toFixed(4)}*on/${FRAMES - 1}`;

  const vf = [
    `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase`,
    `crop=${WIDTH}:${HEIGHT}`,
    `zoompan=z='${zoomExpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FRAMES}:s=${WIDTH}x${HEIGHT}:fps=${FPS}`,
    drawtextFilter({
      text: title,
      fontsize: 72,
      y: 120,
    }),
  ];

  const storyFontSize = 34;
  const storyLineSpacing = 14;
  const storyBottom = HEIGHT - 100;

  for (let i = 0; i < subtitleLines.length; i++) {
    const lineFromBottom = subtitleLines.length - 1 - i;
    const y =
      storyBottom -
      storyFontSize -
      lineFromBottom * (storyFontSize + storyLineSpacing);

    vf.push(
      drawtextFilter({
        text: subtitleLines[i],
        fontsize: storyFontSize,
        y,
      })
    );
  }

  const args = [
    "-y",
    "-loop",
    "1",
    "-framerate",
    String(FPS),
    "-i",
    imagePath,
  ];

  if (withMusic) {
    args.push("-i", MUSIC_FILE);
  }

  args.push(
    "-vf",
    vf,
    "-t",
    String(DURATION_SEC),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart"
  );

  if (withMusic) {
    args.push("-c:a", "aac", "-b:a", "128k", "-shortest");
  } else {
    args.push("-an");
  }

  args.push(outputPath);

  await runFfmpeg(args);
}

async function main() {
  console.log("🎬 Saved Souls — generate TikTok videos\n");

  try {
    await runFfmpeg(["-version"]);
  } catch {
    console.error("❌ ffmpeg niet gevonden op PATH. Installeer met: brew install ffmpeg");
    process.exit(1);
  }

  const raw = await readFile(ANIMALS_FILE, "utf8");
  const data = JSON.parse(raw);
  const animals = Array.isArray(data.animals) ? data.animals : [];

  const eligible = animals.filter(
    (a) => a.image?.trim() && !SKIP_IDS.has(String(a.id))
  );

  const batch = processAll ? eligible : eligible.slice(0, TEST_LIMIT);
  const modeLabel = processAll
    ? `alle ${batch.length} dieren`
    : `test (${TEST_LIMIT} dieren)`;

  console.log(`Mode: ${modeLabel}`);
  console.log(`Videos: ${VIDEOS_DIR}`);
  console.log(`Totaal in JSON: ${animals.length}, met foto (excl. skip): ${eligible.length}\n`);

  if (batch.length === 0) {
    console.log("Geen dieren om te verwerken.");
    return;
  }

  await mkdir(VIDEOS_DIR, { recursive: true });
  await mkdir(TEMP_DIR, { recursive: true });

  const hasMusic = await fileExists(MUSIC_FILE);
  if (!hasMusic) {
    console.log(`ℹ️  Geen muziek gevonden op ${MUSIC_FILE} — video's zonder audio.\n`);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const animal = batch[i];
    const id = String(animal.id);
    const outPath = join(VIDEOS_DIR, `${id}.mp4`);
    const label = `${animal.name} (${animal.type}, id ${id})`;
    const progress = `Generating video ${i + 1}/${batch.length}: ${animal.name}`;

    if (await fileExists(outPath)) {
      console.log(`⏭️  ${progress} — bestaat al, overgeslagen`);
      skipped++;
      continue;
    }

    const ext = extFromUrl(animal.image);
    const tempImage = join(TEMP_DIR, `${id}.${ext}`);

    console.log(`▶️  ${progress}`);

    try {
      await downloadImage(animal.image, tempImage);
      await buildVideo({
        imagePath: tempImage,
        outputPath: outPath,
        title: animal.name || "Saved Souls",
        subtitleLines: storyLines(animal),
        withMusic: hasMusic,
      });
      console.log(`   ✅ ${outPath}`);
      created++;
    } catch (err) {
      console.error(`   ❌ ${label}:`, err instanceof Error ? err.message : err);
      failed++;
    } finally {
      try {
        await unlink(tempImage);
      } catch {
        /* ignore */
      }
    }

    if (i < batch.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`✅ Created: ${created}`);
  console.log(`⏭️  Skipped (already exists): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);

  if (!processAll) {
    console.log("\n🛑 Testbatch klaar (max 3 video's).");
    console.log("   Bekijk de bestanden in:", VIDEOS_DIR);
    console.log("   Bevestig in de chat voordat je alles draait:");
    console.log("   node scripts/tiktok-pipeline/generate-videos.mjs --all");
  } else {
    console.log("\nDone — volledige batch afgerond.");
  }
}

main().catch((err) => {
  console.error("❌ generate-videos failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
