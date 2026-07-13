#!/usr/bin/env node
/**
 * Fix final-check translation gaps: partners (zh/ms/vi), missing NL keys, EN leaks in zh/ms/vi.
 * Usage: node --env-file=.env.local scripts/fix-final-translations.mjs
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "fs";

const client = new Anthropic();
const MODEL = "claude-haiku-4-5";

const ZH_MS_VI = [
  { file: "zh", label: "Simplified Chinese (zh-CN)" },
  { file: "ms", label: "Bahasa Melayu (Malaysian Malay)" },
  { file: "vi", label: "Vietnamese (Tiếng Việt)" },
];

const SKIP_EXACT = new Set([
  "nav.badgeYoutube",
  "share.twitter",
  "share.linkedin",
  "share.telegram",
]);

const SKIP_PREFIXES = [
  "affiliate.shops.",
  "home.thaiModal.title.",
  "gidsen.animalWelfareOrgs.",
  "toxicPlants.",
];

const SKIP_SUFFIXES = [".name"];

const SKIP_REGEX = [
  /Email$/i,
  /Placeholder$/i,
  /^story\.ctaEmail$/,
  /^disclaimer\.contactEmail$/,
  /^thankYou\.founderName$/,
  /^shelters\.mdhfName$/,
  /^admin\.brandName$/,
  /^home\.(promptpay|location|contactEmail)/,
  /^partners\.(tvav|streetdogsthailand|dierenthuis|gifthoney|k9aid)\.fullName$/,
  /^partners\.donationBoxShamuAddress$/,
  /^bedanktDierenDoktersHaarlem\.location$/,
  /^nutrition\.(barfGuideBarf|barfGuidePmr|barfGuideWholePrey|protein3)$/,
  /^health\.disease.*Name$/,
  /^vetCosts\.vaccNlDhpp$/,
  /^nutrition\.proteinTitle$/,
  /^health\.diseaseCommon\d+Name$/,
  /^health\.diseaseDog\d+Name$/,
];

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (isPlainObject(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

function getAtPath(obj, path) {
  return path.split(".").reduce((cur, p) => cur?.[p], obj);
}

function setAtPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] ??= {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function unflattenLeaves(entries) {
  const out = {};
  for (const [path, value] of entries) {
    setAtPath(out, path, value);
  }
  return out;
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key])) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

function shouldSkipKey(path, value) {
  if (SKIP_EXACT.has(path)) return true;
  if (SKIP_PREFIXES.some((p) => path.startsWith(p))) return true;
  if (SKIP_SUFFIXES.some((s) => path.endsWith(s))) return true;
  if (SKIP_REGEX.some((re) => re.test(path))) return true;
  if (typeof value !== "string") return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
  if (/^https?:\/\//.test(value)) return true;
  return false;
}

function parseModelJson(text) {
  const clean = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(clean);
}

async function translateKeys(keys, targetLang, hint = "", attempt = 1) {
  const maxAttempts = 3;
  const retryNote =
    attempt > 1
      ? '\nIMPORTANT: Return ONLY valid JSON. Escape double quotes inside strings as \\".'
      : "";

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: `Translate these JSON values from English to ${targetLang}.
Return ONLY valid JSON with the exact same nested key structure as the input.
Do not add or remove keys.
Escape any double quotes inside translated string values (use \\" inside strings).
Keep {placeholders} like {amount}, {name}, {email}, {current}, {total} exactly as-is.
Keep proper nouns unchanged: Saved Souls Foundation, Groenprint, DierenDokters Haarlem, Phuket, Khon Kaen, Thailand, Donorbox, PayPal, Mollie, PromptPay, BARF, PMR, FIV, DHPP.
Context: animal rescue donation website in Thailand.
${hint ? `Context: ${hint}` : ""}${retryNote}

${JSON.stringify(keys, null, 2)}`,
      },
    ],
  });

  try {
    return parseModelJson(response.content[0].text);
  } catch (err) {
    if (attempt < maxAttempts) {
      process.stdout.write(`retry ${attempt}... `);
      return translateKeys(keys, targetLang, hint, attempt + 1);
    }
    throw err;
  }
}

function load(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function save(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function extractSubtree(obj, paths) {
  const entries = paths.map((p) => [p, getAtPath(obj, p)]);
  return unflattenLeaves(entries);
}

function countLeaves(obj) {
  return flatten(obj).length;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set. Run: node --env-file=.env.local scripts/fix-final-translations.mjs");
    process.exit(1);
  }

  const en = load("./messages/en.json");
  const enFlat = flatten(en);

  // --- 1. Partner keys zh/ms/vi ---
  const partnerWork = {
    groenprint: en.partners.groenprint,
    dierendoktershaarlem: en.partners.dierendoktershaarlem,
  };

  console.log("📦 Phase 1: partners.groenprint + dierendoktershaarlem (zh/ms/vi)");
  for (const { file, label } of ZH_MS_VI) {
    const target = load(`./messages/${file}.json`);
    process.stdout.write(`  → ${file} (${countLeaves(partnerWork)} keys)... `);
    const translated = await translateKeys(partnerWork, label, "Partners page partner cards");
    target.partners ??= {};
    deepMerge(target.partners, translated);
    save(`./messages/${file}.json`, target);
    console.log("✓");
  }

  // --- 2. Missing NL keys ---
  const nl = load("./messages/nl.json");
  const nlFlat = flatten(nl);
  const missingNlPaths = Object.keys(enFlat).filter((k) => !(k in nlFlat));
  const nlWork = extractSubtree(en, missingNlPaths);
  console.log(`\n📦 Phase 2: ${missingNlPaths.length} missing NL keys`);
  process.stdout.write(`  → nl (${countLeaves(nlWork)} keys)... `);
  const nlTranslated = await translateKeys(nlWork, "Dutch (Nederlands)", "Dutch locale for Saved Souls Foundation website");
  deepMerge(nl, nlTranslated);
  save("./messages/nl.json", nl);
  console.log("✓");

  // --- 3. EN leaks in zh/ms/vi (non-brand UI) ---
  console.log("\n📦 Phase 3: EN leak fixes (zh/ms/vi)");
  for (const { file, label } of ZH_MS_VI) {
    const target = load(`./messages/${file}.json`);
    const targetFlat = flatten(target);
    const leakPaths = Object.keys(enFlat).filter((k) => {
      if (targetFlat[k] !== enFlat[k]) return false;
      return !shouldSkipKey(k, enFlat[k]);
    });

    if (!leakPaths.length) {
      console.log(`  → ${file}: no leaks to fix`);
      continue;
    }

    const work = extractSubtree(en, leakPaths);
    const chunks = [];
    const flat = Object.entries(flatten(work));
    for (let i = 0; i < flat.length; i += 40) {
      chunks.push(unflattenLeaves(flat.slice(i, i + 40)));
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const tag = chunks.length > 1 ? ` [${i + 1}/${chunks.length}]` : "";
      process.stdout.write(`  → ${file}${tag} (${countLeaves(chunk)} keys)... `);
      const translated = await translateKeys(chunk, label, "UI labels and page copy");
      deepMerge(target, translated);
      save(`./messages/${file}.json`, target);
      console.log("✓");
    }
  }

  console.log("\n✅ All translation fixes applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
