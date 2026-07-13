#!/usr/bin/env node
/**
 * Auto-translate missing or still-English keys in zh/ms/vi from en.json via Claude API.
 * Usage: node --env-file=.env.local scripts/auto-translate.mjs
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "fs";

const client = new Anthropic();

const LOCALES = [
  { file: "zh", label: "Simplified Chinese (zh-CN)" },
  { file: "ms", label: "Bahasa Melayu (Malaysian Malay)" },
  { file: "vi", label: "Vietnamese (Tiếng Việt)" },
];

const MAX_LEAVES_PER_REQUEST = 35;

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function findMissing(source, target) {
  const missing = {};
  for (const key of Object.keys(source)) {
    if (isPlainObject(source[key])) {
      const sub = findMissing(source[key], target?.[key] || {});
      if (Object.keys(sub).length) missing[key] = sub;
    } else if (!(key in (target || {}))) {
      missing[key] = source[key];
    }
  }
  return missing;
}

function findUntranslated(source, target) {
  const untranslated = {};
  for (const key of Object.keys(source)) {
    if (isPlainObject(source[key])) {
      const sub = findUntranslated(source[key], target?.[key] || {});
      if (Object.keys(sub).length) untranslated[key] = sub;
    } else if (target?.[key] === source[key]) {
      untranslated[key] = source[key];
    }
  }
  return untranslated;
}

function countLeaves(obj) {
  let n = 0;
  for (const value of Object.values(obj)) {
    if (isPlainObject(value)) n += countLeaves(value);
    else n++;
  }
  return n;
}

function flattenLeaves(obj, prefix = "") {
  const entries = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) entries.push(...flattenLeaves(value, path));
    else entries.push([path, value]);
  }
  return entries;
}

function unflattenLeaves(entries) {
  const out = {};
  for (const [path, value] of entries) {
    const parts = path.split(".");
    let cur = out;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }
  return out;
}

function chunkObject(obj, maxLeaves = MAX_LEAVES_PER_REQUEST) {
  const flat = flattenLeaves(obj);
  const chunks = [];
  for (let i = 0; i < flat.length; i += maxLeaves) {
    chunks.push(unflattenLeaves(flat.slice(i, i + maxLeaves)));
  }
  return chunks;
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

function deepMergeCopy(a, b) {
  const out = { ...a };
  for (const [key, value] of Object.entries(b)) {
    if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = deepMergeCopy(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function collectWork(en, target) {
  return deepMergeCopy(findMissing(en, target), findUntranslated(en, target));
}

function parseModelJson(text) {
  const clean = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(clean);
}

async function translateKeys(keys, targetLang, namespaceHint = "", attempt = 1) {
  const maxAttempts = 3;
  const retryNote =
    attempt > 1
      ? "\nIMPORTANT: Your previous response was invalid JSON. Escape all double quotes inside string values as \\\". Return ONLY valid JSON."
      : "";

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: `Translate these JSON values from English to ${targetLang}.
Return ONLY valid JSON with the exact same nested key structure as the input.
Do not add or remove keys.
Escape any double quotes inside translated string values (use \\" inside strings).
Keep {placeholders} like {amount}, {name}, {email}, {current}, {total} exactly as-is.
Keep proper nouns unchanged: Saved Souls Foundation, Phuket, Khon Kaen, Thailand, Donorbox, PayPal, Mollie, PromptPay, Sanaambin, Isaan.
Context: animal rescue donation website in Thailand.
${namespaceHint ? `Namespace: ${namespaceHint}` : ""}${retryNote}

${JSON.stringify(keys, null, 2)}`,
      },
    ],
  });

  const text = response.content[0].text;
  try {
    return parseModelJson(text);
  } catch (err) {
    if (attempt < maxAttempts) {
      process.stdout.write(`retry ${attempt}... `);
      return translateKeys(keys, targetLang, namespaceHint, attempt + 1);
    }
    throw err;
  }
}

function loadMessages(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function saveMessages(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

console.log("🔍 Finding missing / still-English keys...");
const en = loadMessages("./messages/en.json");
const targets = Object.fromEntries(
  LOCALES.map(({ file }) => [file, loadMessages(`./messages/${file}.json`)])
);

for (const { file } of LOCALES) {
  const work = collectWork(en, targets[file]);
  console.log(
    `  ${file}: ${countLeaves(work)} keys to translate (${Object.keys(work).length} namespaces)`
  );
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "❌ ANTHROPIC_API_KEY not set. Run: node --env-file=.env.local scripts/auto-translate.mjs"
  );
  process.exit(1);
}

console.log("🤖 Translating with Claude...");

for (const { file, label } of LOCALES) {
  const work = collectWork(en, targets[file]);
  const namespaces = Object.keys(work);

  for (const ns of namespaces) {
    const chunks = chunkObject(work[ns]);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const labelNs = chunks.length > 1 ? `${ns} [${i + 1}/${chunks.length}]` : ns;
      process.stdout.write(`  → ${file}/${labelNs} (${countLeaves(chunk)} keys)... `);
      const translated = await translateKeys(chunk, label, ns);
      deepMerge(targets[file], { [ns]: translated });
      saveMessages(`./messages/${file}.json`, targets[file]);
      console.log("✓");
    }
  }
}

console.log("✅ Done! All missing / untranslated keys processed.");
