#!/usr/bin/env node
/**
 * Kopieer producten van WooCommerce Printify shop naar custom_integration shop.
 * Verwijdert niets; slaat duplicaten over op titel of blueprint.
 *
 * Run: node scripts/copy-printify-products.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const API_BASE = "https://api.printify.com/v1";

const SOURCE_SHOP = "19346156";
const DEST_SHOP = "27754716";

const PRODUCTS_TO_COPY = [
  { id: "695238678c9632253d0e2680", title: "Desk Calendar 2026", blueprintId: 1239 },
  { id: "6789ddb9d70ae6618d0204b3", title: "Fine Art Postcards", blueprintId: 842 },
  { id: "6762856805f17769e301dd5a", title: "College Hoodie", blueprintId: 92, skipIfBlueprintExists: 92 },
  { id: "6752618689910a1b260ea70b", title: "Ceramic Cup", blueprintId: 1125 },
  { id: "674c043610f623adb40342c3", title: "Desk Calendar (2025)", blueprintId: 1352 },
];

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
    const reason = data.errors?.reason ?? data.message ?? data.title ?? text;
    throw new Error(`Printify ${res.status}: ${reason}`);
  }
  return data;
}

async function fetchDestCatalog() {
  const titles = new Set();
  const blueprintIds = new Set();
  let page = 1;
  let lastPage = 1;

  do {
    const data = await printifyFetch(
      `/shops/${DEST_SHOP}/products.json?limit=50&page=${page}`
    );
    for (const p of data.data ?? []) {
      if (p.title) titles.add(p.title.trim());
      if (p.blueprint_id != null) blueprintIds.add(p.blueprint_id);
    }
    lastPage = data.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return { titles, blueprintIds };
}

const uploadIdCache = new Map();

function isPrintifyUploadId(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}

async function uploadExists(uploadId) {
  try {
    await printifyFetch(`/uploads/${uploadId}.json`);
    return true;
  } catch {
    return false;
  }
}

async function resolveUploadId(img) {
  const cacheKey = img.id || img.src;
  if (cacheKey && uploadIdCache.has(cacheKey)) {
    return uploadIdCache.get(cacheKey);
  }

  if (img.id && isPrintifyUploadId(img.id) && (await uploadExists(img.id))) {
    uploadIdCache.set(cacheKey, img.id);
    return img.id;
  }

  if (img.src) {
    const fileName = (img.name || img.src.split("/").pop() || "image.png").split("?")[0];
    const uploaded = await printifyFetch("/uploads/images.json", {
      method: "POST",
      body: JSON.stringify({ file_name: fileName, url: img.src }),
    });
    uploadIdCache.set(cacheKey, uploaded.id);
    if (img.id) uploadIdCache.set(img.id, uploaded.id);
    return uploaded.id;
  }

  return null;
}

async function sanitizePrintAreas(printAreas = []) {
  const areas = [];

  for (const area of printAreas) {
    const placeholders = [];

    for (const ph of area.placeholders ?? []) {
      const images = [];
      const seen = new Set();

      for (const img of ph.images ?? []) {
        const resolvedId = await resolveUploadId(img);
        if (!resolvedId || seen.has(resolvedId)) continue;
        seen.add(resolvedId);
        images.push({
          id: resolvedId,
          x: img.x,
          y: img.y,
          scale: img.scale,
          angle: img.angle ?? 0,
        });
      }

      if (images.length > 0) {
        placeholders.push({ position: ph.position, images });
      }
    }

    if (placeholders.length > 0) {
      areas.push({
        variant_ids: area.variant_ids,
        ...(area.background ? { background: area.background } : {}),
        placeholders,
      });
    }
  }

  return areas;
}

async function buildCreatePayload(product) {
  const payload = {
    title: product.title,
    description: product.description,
    blueprint_id: product.blueprint_id,
    print_provider_id: product.print_provider_id,
    variants: (product.variants ?? []).map((v) => ({
      id: v.id,
      price: v.price,
      is_enabled: v.is_enabled ?? true,
    })),
    print_areas: await sanitizePrintAreas(product.print_areas),
  };

  if (product.tags?.length) payload.tags = product.tags;
  if (product.safety_information) payload.safety_information = product.safety_information;

  return payload;
}

async function publishProduct(productId, title) {
  console.log(`   📢 Publiceren: ${title}…`);
  await printifyFetch(`/shops/${DEST_SHOP}/products/${productId}/publish.json`, {
    method: "POST",
    body: JSON.stringify({
      title: true,
      description: true,
      images: true,
      variants: true,
      tags: true,
    }),
  });
  console.log("   ✓ Gepubliceerd");
}

async function copyProduct(spec) {
  console.log(`\n📦 Kopiëren: ${spec.title} (${spec.id})`);

  const source = await printifyFetch(
    `/shops/${SOURCE_SHOP}/products/${spec.id}.json`
  );

  console.log(`   Bron: blueprint ${source.blueprint_id}, provider ${source.print_provider_id}`);
  console.log(`   Varianten: ${source.variants?.length ?? 0}, print areas: ${source.print_areas?.length ?? 0}`);

  const payload = await buildCreatePayload(source);

  if (!payload.print_areas?.length) {
    throw new Error("Geen geldige print_areas na verwerking van afbeeldingen");
  }
  const created = await printifyFetch(`/shops/${DEST_SHOP}/products.json`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log(`   ✓ Aangemaakt in shop ${DEST_SHOP} (id: ${created.id})`);
  await publishProduct(created.id, spec.title);
  return created.id;
}

async function main() {
  console.log("🐾 Printify product copy");
  console.log(`   Van shop ${SOURCE_SHOP} → ${DEST_SHOP}`);

  const { titles, blueprintIds } = await fetchDestCatalog();
  console.log(`   Bestemming heeft ${titles.size} product(en), blueprints: [${[...blueprintIds].join(", ")}]`);

  const results = { copied: 0, skipped: 0, failed: 0 };

  for (const spec of PRODUCTS_TO_COPY) {
    if (spec.skipIfBlueprintExists != null && blueprintIds.has(spec.skipIfBlueprintExists)) {
      console.log(`\n⏭️  Overgeslagen: ${spec.title} (blueprint ${spec.skipIfBlueprintExists} bestaat al)`);
      results.skipped += 1;
      continue;
    }

    if (titles.has(spec.title)) {
      console.log(`\n⏭️  Overgeslagen: ${spec.title} (titel bestaat al in bestemming)`);
      results.skipped += 1;
      continue;
    }

    try {
      const newId = await copyProduct(spec);
      titles.add(spec.title);
      if (spec.blueprintId != null) blueprintIds.add(spec.blueprintId);
      results.copied += 1;
      console.log(`   → Nieuw product-id: ${newId}`);
    } catch (err) {
      results.failed += 1;
      console.error(`   ❌ Fout: ${err.message}`);
    }
  }

  console.log(
    `\n📊 Klaar: ${results.copied} gekopieerd, ${results.skipped} overgeslagen, ${results.failed} mislukt`
  );

  if (results.failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("❌ Onverwachte fout:", err.message);
  process.exit(1);
});
