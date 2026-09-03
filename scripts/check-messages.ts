/**
 * Compare all message keys recursively against messages/en.json.
 * Prints missing keys per locale. Exit code 1 if any are missing.
 * Success = no output, exit 0.
 *
 * Run: npm run check:i18n
 */
import fs from "fs";
import path from "path";

const MESSAGES_DIR = path.join(process.cwd(), "messages");

function flatten(obj: unknown, prefix = "", out: string[] = []): string[] {
  if (obj === null || obj === undefined) {
    if (prefix) out.push(prefix);
    return out;
  }
  if (typeof obj !== "object" || Array.isArray(obj)) {
    if (prefix) out.push(prefix);
    return out;
  }
  const record = obj as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length === 0) {
    if (prefix) out.push(prefix);
    return out;
  }
  for (const key of keys) {
    flatten(record[key], prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

function loadLocale(locale: string): Record<string, unknown> {
  return JSON.parse(
    fs.readFileSync(path.join(MESSAGES_DIR, `${locale}.json`), "utf8")
  ) as Record<string, unknown>;
}

const files = fs
  .readdirSync(MESSAGES_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .sort();

if (!files.includes("en")) {
  console.error("messages/en.json not found");
  process.exit(1);
}

const enKeys = new Set(flatten(loadLocale("en")));
let totalMissing = 0;

for (const locale of files) {
  if (locale === "en") continue;
  const keys = new Set(flatten(loadLocale(locale)));
  const missing = [...enKeys].filter((k) => !keys.has(k)).sort();
  if (missing.length === 0) continue;
  totalMissing += missing.length;
  console.log(`[${locale}] missing ${missing.length}:`);
  for (const k of missing) console.log(`  - ${k}`);
}

process.exit(totalMissing > 0 ? 1 : 0);
