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
const FOUNDATION_LOGO_ID =
  process.env.PRINTIFY_LOGO_IMAGE_ID?.trim() || "6a225eafe7c50defefa09cb1";

/** Blueprints waar het logo gecentreerd op de voorkant moet (wrap/handle-producten). */
const CENTERED_FRONT_BLUEPRINTS = new Set([1125, 34]);

const PRODUCTS_TO_COPY = [
  { id: "695238678c9632253d0e2680", title: "Desk Calendar 2026", blueprintId: 1239 },
  { id: "6789ddb9d70ae6618d0204b3", title: "Fine Art Postcards", blueprintId: 842 },
  { id: "6762856805f17769e301dd5a", title: "College Hoodie", blueprintId: 92, skipIfBlueprintExists: 92 },
  { id: "6752618689910a1b260ea70b", title: "Ceramic Cup", blueprintId: 1125 },
];

const PRODUCTS_TO_DELETE = [
  { title: "Desk Calendar (2025)" },
];

const PRODUCTS_TO_RECREATE = new Set(
  (process.env.RECREATE_TITLES || "Ceramic Cup")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
);

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
  const byTitle = new Map();
  let page = 1;
  let lastPage = 1;

  do {
    const data = await printifyFetch(
      `/shops/${DEST_SHOP}/products.json?limit=50&page=${page}`
    );
    for (const p of data.data ?? []) {
      if (p.title) {
        const trimmed = p.title.trim();
        titles.add(trimmed);
        byTitle.set(trimmed, p);
      }
      if (p.blueprint_id != null) blueprintIds.add(p.blueprint_id);
    }
    lastPage = data.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return { titles, blueprintIds, byTitle };
}

async function deleteDestProduct(productId, title) {
  console.log(`\n🗑️  Verwijderen: ${title} (${productId})`);
  await printifyFetch(`/shops/${DEST_SHOP}/products/${productId}.json`, {
    method: "DELETE",
  });
  console.log("   ✓ Verwijderd");
}

function pickFrontPlaceholder(placeholders = []) {
  return (
    placeholders.find((p) => p.position === "front") ??
    placeholders.find((p) => p.position === "wrap") ??
    placeholders[0] ??
    null
  );
}

function logoScaleForBlueprint(blueprintId) {
  if (CENTERED_FRONT_BLUEPRINTS.has(blueprintId)) return 0.35;
  return 0.75;
}

function buildFrontLogoPlaceholder(position, blueprintId) {
  return {
    position: position ?? "front",
    images: [
      {
        id: FOUNDATION_LOGO_ID,
        x: 0.5,
        y: 0.5,
        scale: logoScaleForBlueprint(blueprintId),
        angle: 0,
      },
    ],
  };
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

function sanitizePrintAreas(printAreas = [], blueprintId) {
  const areas = [];

  for (const area of printAreas) {
    if (!area.variant_ids?.length) continue;

    const frontPh = pickFrontPlaceholder(area.placeholders ?? []);
    areas.push({
      variant_ids: area.variant_ids,
      ...(area.background ? { background: area.background } : {}),
      placeholders: [buildFrontLogoPlaceholder(frontPh?.position, blueprintId)],
    });
  }

  if (areas.length === 0) {
    const allVariantIds = [
      ...new Set(printAreas.flatMap((area) => area.variant_ids ?? [])),
    ];
    if (allVariantIds.length > 0) {
      areas.push({
        variant_ids: allVariantIds,
        placeholders: [buildFrontLogoPlaceholder("front", blueprintId)],
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
    print_areas: sanitizePrintAreas(product.print_areas, product.blueprint_id),
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
  console.log(`   Foundation logo: ${FOUNDATION_LOGO_ID}`);

  let { titles, blueprintIds, byTitle } = await fetchDestCatalog();
  console.log(`   Bestemming heeft ${titles.size} product(en), blueprints: [${[...blueprintIds].join(", ")}]`);

  const results = { copied: 0, skipped: 0, failed: 0, deleted: 0 };

  for (const spec of PRODUCTS_TO_DELETE) {
    const existing = byTitle.get(spec.title);
    if (!existing) {
      console.log(`\n⏭️  Al verwijderd of niet gevonden: ${spec.title}`);
      continue;
    }
    try {
      await deleteDestProduct(existing.id, spec.title);
      titles.delete(spec.title);
      byTitle.delete(spec.title);
      if (existing.blueprint_id != null) {
        const stillHasBlueprint = [...byTitle.values()].some(
          (p) => p.blueprint_id === existing.blueprint_id
        );
        if (!stillHasBlueprint) blueprintIds.delete(existing.blueprint_id);
      }
      results.deleted += 1;
    } catch (err) {
      results.failed += 1;
      console.error(`   ❌ Verwijderen mislukt: ${err.message}`);
    }
  }

  for (const title of PRODUCTS_TO_RECREATE) {
    const existing = byTitle.get(title);
    if (!existing) continue;
    try {
      await deleteDestProduct(existing.id, title);
      titles.delete(title);
      byTitle.delete(title);
      if (existing.blueprint_id != null) {
        const stillHasBlueprint = [...byTitle.values()].some(
          (p) => p.blueprint_id === existing.blueprint_id
        );
        if (!stillHasBlueprint) blueprintIds.delete(existing.blueprint_id);
      }
      results.deleted += 1;
    } catch (err) {
      results.failed += 1;
      console.error(`   ❌ Recreate-verwijdering mislukt (${title}): ${err.message}`);
    }
  }

  for (const spec of PRODUCTS_TO_COPY) {
    if (spec.skipIfBlueprintExists != null && blueprintIds.has(spec.skipIfBlueprintExists)) {
      console.log(`\n⏭️  Overgeslagen: ${spec.title} (blueprint ${spec.skipIfBlueprintExists} bestaat al)`);
      results.skipped += 1;
      continue;
    }

    const shouldRecreate = PRODUCTS_TO_RECREATE.has(spec.title);
    if (titles.has(spec.title) && !shouldRecreate) {
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
    `\n📊 Klaar: ${results.copied} gekopieerd, ${results.deleted} verwijderd, ${results.skipped} overgeslagen, ${results.failed} mislukt`
  );

  if (results.failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("❌ Onverwachte fout:", err.message);
  process.exit(1);
});
