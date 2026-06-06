#!/usr/bin/env node
/**
 * Werk bestaande Printify-producten bij met kleiner gecentreerd logo (40%)
 * en trigger mockup-regeneratie via publish.
 *
 * Run: node scripts/fix-printify-mockups.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  LOGO_IMAGE_ID,
  LOGO_MAX_SCALE,
  buildFrontLogoPrintAreas,
} from "./create-printify-products.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const API_BASE = "https://api.printify.com/v1";

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const API_KEY = process.env.PRINTIFY_API_KEY;
const SHOP_ID = process.env.PRINTIFY_SHOP_ID || "27754716";

if (!API_KEY) {
  console.error("❌ PRINTIFY_API_KEY ontbreekt in .env.local");
  process.exit(1);
}

async function printifyFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
      ...options.headers,
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = data.message || data.title || data.errors?.reason || data.raw || res.statusText;
    throw new Error(`Printify ${res.status}: ${msg}`);
  }
  return data;
}

async function listAllProducts() {
  const products = [];
  let page = 1;
  let lastPage = 1;

  do {
    const data = await printifyFetch(
      `/shops/${SHOP_ID}/products.json?limit=50&page=${page}`
    );
    products.push(...(data.data ?? []));
    lastPage = data.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return products;
}

function productHasFoundationLogo(product) {
  for (const area of product.print_areas ?? []) {
    for (const ph of area.placeholders ?? []) {
      for (const img of ph.images ?? []) {
        if (img.id === LOGO_IMAGE_ID) return true;
      }
    }
  }
  return false;
}

function productHasPrintImages(product) {
  for (const area of product.print_areas ?? []) {
    for (const ph of area.placeholders ?? []) {
      if ((ph.images ?? []).length > 0) return true;
    }
  }
  return false;
}

async function unlockProduct(productId) {
  const product = await printifyFetch(`/shops/${SHOP_ID}/products/${productId}.json`);
  if (!product.is_locked) return;

  await printifyFetch(
    `/shops/${SHOP_ID}/products/${productId}/publishing_failed.json`,
    {
      method: "POST",
      body: JSON.stringify({ reason: "Unlock for logo scale mockup fix" }),
    }
  );
}

async function updateProduct(product) {
  await unlockProduct(product.id);

  const printAreas = buildFrontLogoPrintAreas(product.print_areas, LOGO_IMAGE_ID);
  if (!printAreas.length) {
    throw new Error("Geen print_areas om bij te werken");
  }

  await printifyFetch(`/shops/${SHOP_ID}/products/${product.id}.json`, {
    method: "PUT",
    body: JSON.stringify({ print_areas: printAreas }),
  });

  await printifyFetch(`/shops/${SHOP_ID}/products/${product.id}/publish.json`, {
    method: "POST",
    body: JSON.stringify({
      title: true,
      description: true,
      images: true,
      variants: true,
      tags: true,
    }),
  });
}

async function main() {
  console.log("🖼️  Printify mockup fix — logo scale", LOGO_MAX_SCALE);
  console.log(`   Shop: ${SHOP_ID}, logo: ${LOGO_IMAGE_ID}`);

  const listed = await listAllProducts();
  console.log(`\n📋 ${listed.length} product(en) in shop ${SHOP_ID}:\n`);
  for (const p of listed) {
    console.log(`   ${p.id}  ${p.title}`);
  }

  const results = { ok: 0, skip: 0, fail: 0 };

  for (const summary of listed) {
    console.log(`\n🔧 ${summary.title} (${summary.id})`);

    let product;
    try {
      product = await printifyFetch(`/shops/${SHOP_ID}/products/${summary.id}.json`);
    } catch (err) {
      results.fail += 1;
      console.error(`   ❌ Ophalen mislukt: ${err.message}`);
      continue;
    }

    const hasLogo = productHasFoundationLogo(product);
    const hasImages = productHasPrintImages(product);

    if (!hasLogo && !hasImages) {
      console.log("   ⏭️  Geen print-afbeeldingen — overgeslagen");
      results.skip += 1;
      continue;
    }

    if (!hasLogo && hasImages) {
      console.log("   ⏭️  Custom artwork (geen foundation logo) — overgeslagen");
      results.skip += 1;
      continue;
    }

    try {
      await updateProduct(product);
      results.ok += 1;
      console.log(`   ✓ Bijgewerkt (scale ${LOGO_MAX_SCALE}, gecentreerd) + mockups gepubliceerd`);
    } catch (err) {
      results.fail += 1;
      console.error(`   ❌ ${err.message}`);
    }
  }

  console.log(
    `\n📊 Klaar: ${results.ok} bijgewerkt, ${results.skip} overgeslagen, ${results.fail} mislukt`
  );

  if (results.fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("❌ Onverwachte fout:", err.message);
  process.exit(1);
});
