#!/usr/bin/env node
/**
 * Sync affiliate producten uit Excel-bestanden naar JSON (honden + katten).
 *
 * Waar zet je de Excel-bestanden?
 *   data/affiliate/dogs/  → hondenproducten (alle .xls en .xlsx in deze map)
 *   data/affiliate/cats/  → kattenproducten (alle .xls en .xlsx in deze map)
 *
 * Je kunt meerdere bestanden per map plaatsen (bijv. een stuk of 10); het script
 * leest ze allemaal, combineert en haalt dubbele ProductId’s eruit.
 *
 * Gebruik:
 *   npm run sync-affiliate-products
 *
 * Optioneel: max producten per categorie (standaard 36):
 *   node scripts/sync-affiliate-dog-products.mjs 48
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, extname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const DATA_DOGS = resolve(projectRoot, "data/affiliate/dogs");
const DATA_CATS = resolve(projectRoot, "data/affiliate/cats");
const DATA_DOGS_WHEELCHAIRS = resolve(projectRoot, "data/affiliate/dogs-wheelchairs");
const DATA_HOLIDAY = resolve(projectRoot, "data/affiliate/holiday");
const OUT_DOGS = resolve(projectRoot, "lib/affiliate-dog-products.json");
const OUT_CATS = resolve(projectRoot, "lib/affiliate-cat-products.json");
const OUT_DOGS_WHEELCHAIRS = resolve(projectRoot, "lib/affiliate-dog-wheelchairs-products.json");
const OUT_HOLIDAY = resolve(projectRoot, "lib/affiliate-holiday-products.json");
const DEFAULT_MAX = 240;
const MAX_CAP = 300;

const COL = {
  productId: 0,
  imageUrl: 1,
  productDesc: 3,
  originPrice: 4,
  discountPrice: 5,
  discount: 6,
  promotionUrl: 14,
};

function readXls(path) {
  const XLSX = require("xlsx");
  const wb = XLSX.readFile(path);
  const firstSheet = wb.SheetNames[0];
  const sheet = wb.Sheets[firstSheet];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
}

function parseProductsFromRows(rows, maxCount, seen) {
  const products = [];
  for (let i = 1; i < rows.length && products.length < maxCount; i++) {
    const row = rows[i];
    if (!row || row.length <= COL.promotionUrl) continue;

    const id = String(row[COL.productId] ?? "").trim();
    const link = String(row[COL.promotionUrl] ?? "").trim();
    const image = String(row[COL.imageUrl] ?? "").trim();
    const name = String(row[COL.productDesc] ?? "").trim();

    if (!id || !link || !image || !name) continue;
    if (seen.has(id)) continue;
    seen.add(id);

    const originPrice = String(row[COL.originPrice] ?? "").trim();
    const discountPrice = String(row[COL.discountPrice] ?? "").trim();
    const discount = String(row[COL.discount] ?? "").trim();

    products.push({
      id,
      name,
      price: discountPrice || "—",
      originalPrice: originPrice || "—",
      discount: discount || "—",
      link,
      image,
    });
  }
  return products;
}

function getXlsFiles(dir) {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile() && /\.xls$/i.test(extname(f.name)))
    .map((f) => resolve(dir, f.name));
  const xlsx = readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile() && /\.xlsx$/i.test(extname(f.name)))
    .map((f) => resolve(dir, f.name));
  return [...files, ...xlsx];
}

function syncFolder(dataDir, outPath, label, maxCount) {
  const files = getXlsFiles(dataDir);
  if (files.length === 0) {
    console.log(label + ": geen Excel-bestanden in", dataDir, "— bestaande JSON blijft staan.");
    return;
  }

  const seen = new Set();
  const all = [];
  for (const f of files) {
    try {
      const rows = readXls(f);
      const part = parseProductsFromRows(rows, maxCount - all.length, seen);
      all.push(...part);
      if (all.length >= maxCount) break;
    } catch (e) {
      console.warn("Fout bij lezen", f, e.message);
    }
  }

  const out = all.slice(0, maxCount);
  writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(label + ":", outPath, "—", out.length, "producten uit", files.length, "bestand(en).");
}

function main() {
  const maxArg = parseInt(process.argv[2], 10);
  const maxPerCategory = Math.min(
    Math.max(1, Number.isFinite(maxArg) ? maxArg : DEFAULT_MAX),
    MAX_CAP
  );
  console.log("Max per categorie:", maxPerCategory);

  syncFolder(DATA_DOGS, OUT_DOGS, "Honden", maxPerCategory);
  syncFolder(DATA_CATS, OUT_CATS, "Katten", maxPerCategory);
  syncFolder(DATA_DOGS_WHEELCHAIRS, OUT_DOGS_WHEELCHAIRS, "Ondersteunende artikelen", maxPerCategory);
  syncFolder(DATA_HOLIDAY, OUT_HOLIDAY, "Meer en voor de feestdagen", maxPerCategory);
}

main();
