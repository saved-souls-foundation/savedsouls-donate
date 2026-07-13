#!/usr/bin/env node
/**
 * Merge priority namespace translations into messages/{locale}.json
 * Usage: node scripts/merge-priority-translations.mjs pl scripts/translations/pl-priority.json
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const [, , locale, patchPath] = process.argv;
if (!locale || !patchPath) {
  console.error("Usage: node scripts/merge-priority-translations.mjs <locale> <patch-json>");
  process.exit(1);
}

const messagesPath = resolve(`messages/${locale}.json`);
const patch = JSON.parse(readFileSync(resolve(patchPath), "utf8"));
const messages = JSON.parse(readFileSync(messagesPath, "utf8"));

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

deepMerge(messages, patch);

writeFileSync(messagesPath, JSON.stringify(messages, null, 2) + "\n", "utf8");
console.log(`Merged ${Object.keys(patch).length} namespaces into ${messagesPath}`);
