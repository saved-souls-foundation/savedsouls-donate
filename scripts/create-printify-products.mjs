#!/usr/bin/env node
/**
 * Voeg 5 merchandise-producten toe aan Printify shop (alleen CREATE + publish).
 * Verwijdert NOOIT bestaande producten.
 * Slaat producten over als de titel al in de shop staat.
 *
 * Run: node scripts/create-printify-products.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const API_BASE = "https://api.printify.com/v1";

const DESCRIPTION =
  "Support 430 dogs and 91 cats in Khon Kaen, Thailand. Every purchase goes directly to animal care.";

const PRODUCTS = [
  {
    key: "tshirt",
    title: "Saved Souls Foundation T-Shirt",
    blueprintId: 6,
    priceEur: 35.0,
    colors: ["white", "black", "navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    key: "hoodie",
    title: "Saved Souls Foundation Hoodie",
    blueprintId: 92,
    priceEur: 55.0,
    colors: ["white", "black", "navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    key: "tote",
    title: "Saved Souls Foundation Tote Bag",
    blueprintId: 553,
    priceEur: 24.9,
    colors: null,
    sizes: null,
  },
  {
    key: "mug",
    title: "Saved Souls Foundation Mug 11oz",
    blueprintId: 34,
    priceEur: 19.9,
    colors: null,
    sizes: null,
  },
  {
    key: "cap",
    title: "Saved Souls Foundation Cap",
    blueprintId: 1447,
    priceEur: 27.9,
    colors: ["white", "black"],
    sizes: null,
  },
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
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;

if (!API_KEY || !SHOP_ID) {
  console.error("❌ PRINTIFY_API_KEY en PRINTIFY_SHOP_ID zijn vereist in .env.local");
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
    const msg = data.message || data.title || data.raw || res.statusText;
    throw new Error(`Printify ${res.status}: ${msg}`);
  }
  return data;
}

async function ensureLogoFile() {
  const target = path.join(ROOT, "public", "logo1024x1024.png");
  if (fs.existsSync(target)) return target;

  const sources = [
    path.join(ROOT, "public", "savedsouls-logo-transparent.png"),
    path.join(ROOT, "public", "android-chrome-512x512.png"),
    path.join(ROOT, "public", "savedsouls-logo-darkgreen.png"),
  ];
  const source = sources.find((p) => fs.existsSync(p));
  if (!source) {
    throw new Error(
      "Logo niet gevonden. Plaats public/logo1024x1024.png of savedsouls-logo-transparent.png"
    );
  }

  try {
    const sharp = (await import("sharp")).default;
    await sharp(source)
      .resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(target);
    console.log(`ℹ️  logo1024x1024.png gegenereerd vanaf ${path.basename(source)}`);
    return target;
  } catch {
    console.warn(`⚠️  Gebruik ${path.basename(source)} direct (sharp niet beschikbaar)`);
    return source;
  }
}

async function fetchExistingProductTitles() {
  const titles = new Set();
  let page = 1;
  let lastPage = 1;

  do {
    const data = await printifyFetch(`/shops/${SHOP_ID}/products.json?page=${page}&limit=50`);
    for (const product of data.data ?? []) {
      if (product.title) titles.add(product.title.trim());
    }
    lastPage = data.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return titles;
}

async function uploadLogo() {
  console.log("\n📤 Logo uploaden naar Printify…");
  const logoPath = await ensureLogoFile();
  const contents = fs.readFileSync(logoPath).toString("base64");
  const fileName = path.basename(logoPath);

  const result = await printifyFetch("/uploads/images.json", {
    method: "POST",
    body: JSON.stringify({ file_name: fileName, contents }),
  });

  console.log(`   ✓ Logo geüpload (id: ${result.id}, ${result.width}×${result.height})`);
  return result;
}

async function getPrintProviderId(blueprintId) {
  const providers = await printifyFetch(`/catalog/blueprints/${blueprintId}/print_providers.json`);
  if (!Array.isArray(providers) || providers.length === 0) {
    throw new Error(`Geen print providers voor blueprint ${blueprintId}`);
  }
  const preferred = providers.find((p) => p.id === 99) ?? providers[0];
  return preferred.id;
}

async function getCatalogVariants(blueprintId, printProviderId) {
  const data = await printifyFetch(
    `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`
  );
  return data.variants ?? [];
}

function normalizeSize(size) {
  return size.toLowerCase().replace(/\s+/g, "");
}

function matchesColor(optionColor, target) {
  const c = (optionColor || "").toLowerCase();
  if (target === "white") return /\bwhite\b/.test(c) || c.includes("arctic white");
  if (target === "black") return /\bblack\b/.test(c) && !c.includes("heather");
  if (target === "navy") return c.includes("navy");
  return c.includes(target);
}

function matchesSize(optionSize, target) {
  const s = normalizeSize(optionSize || "");
  const t = normalizeSize(target);
  if (t === "xxl") return s === "2xl" || s === "xxl";
  return s === t;
}

function pickVariant(catalogVariants, color, size) {
  const matches = catalogVariants.filter((v) => {
    const opts = v.options ?? {};
    const colorOk = color ? matchesColor(opts.color, color) : true;
    const sizeOk = size ? matchesSize(opts.size, size) : true;
    return colorOk && sizeOk;
  });
  if (matches.length === 0) return null;

  if (color) {
    const exact = matches.find((v) => {
      const c = (v.options?.color || "").toLowerCase();
      if (color === "white") return c === "white" || c === "arctic white";
      if (color === "black") return c === "black" || c === "jet black";
      if (color === "navy") return c === "navy" || c === "oxford navy";
      return c.includes(color);
    });
    if (exact) return exact;
  }

  return matches[0];
}

function eurToCents(eur) {
  return Math.round(eur * 100);
}

function getFrontPlaceholder(variant) {
  const placeholders = variant.placeholders ?? [];
  return (
    placeholders.find((p) => p.position === "front") ??
    placeholders[0] ??
    null
  );
}

function buildPrintAreas(variantIds, catalogVariants, imageId) {
  const sample = catalogVariants.find((v) => variantIds.includes(v.id)) ?? catalogVariants[0];
  const placeholder = getFrontPlaceholder(sample);
  const position = placeholder?.position ?? "front";
  const scale = 0.75;

  return [
    {
      variant_ids: variantIds,
      placeholders: [
        {
          position,
          images: [
            {
              id: imageId,
              x: 0.5,
              y: 0.5,
              scale,
              angle: 0,
            },
          ],
        },
      ],
    },
  ];
}

function resolveVariants(product, catalogVariants) {
  const priceCents = eurToCents(product.priceEur);
  const enabled = [];

  if (!product.colors && !product.sizes) {
    for (const v of catalogVariants) {
      enabled.push({ id: v.id, price: priceCents, is_enabled: true });
    }
    return enabled;
  }

  const colors = product.colors ?? [null];
  const sizes = product.sizes ?? [null];

  for (const color of colors) {
    for (const size of sizes) {
      const variant = pickVariant(catalogVariants, color, size);
      if (!variant) {
        console.warn(`   ⚠️  Variant niet gevonden: ${color ?? "any"} / ${size ?? "any"}`);
        continue;
      }
      if (!enabled.some((e) => e.id === variant.id)) {
        enabled.push({ id: variant.id, price: priceCents, is_enabled: true });
      }
    }
  }

  return enabled;
}

async function createProduct(product, imageId) {
  console.log(`\n🛍️  Product aanmaken: ${product.title}`);
  console.log(`   Blueprint ${product.blueprintId}…`);

  const printProviderId = await getPrintProviderId(product.blueprintId);
  console.log(`   Print provider: ${printProviderId}`);

  const catalogVariants = await getCatalogVariants(product.blueprintId, printProviderId);
  if (catalogVariants.length === 0) {
    throw new Error("Geen catalogus-varianten gevonden");
  }

  const variants = resolveVariants(product, catalogVariants);
  if (variants.length === 0) {
    throw new Error("Geen matching varianten voor dit product");
  }

  console.log(`   ${variants.length} variant(en) ingeschakeld`);

  const variantIds = variants.map((v) => v.id);
  const printAreas = buildPrintAreas(variantIds, catalogVariants, imageId);

  const body = {
    title: product.title,
    description: DESCRIPTION,
    blueprint_id: product.blueprintId,
    print_provider_id: printProviderId,
    variants,
    print_areas: printAreas,
  };

  const created = await printifyFetch(`/shops/${SHOP_ID}/products.json`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  console.log(`   ✓ Product aangemaakt (id: ${created.id})`);
  return created.id;
}

async function publishProduct(productId, title) {
  console.log(`   📢 Publiceren: ${title}…`);
  await printifyFetch(`/shops/${SHOP_ID}/products/${productId}/publish.json`, {
    method: "POST",
    body: JSON.stringify({
      title: true,
      description: true,
      images: true,
      variants: true,
      tags: true,
    }),
  });
  console.log(`   ✓ Gepubliceerd`);
}

async function main() {
  console.log("🐾 Saved Souls — Printify product setup (add-only, no deletes)");
  console.log(`   Shop ID: ${SHOP_ID}`);

  let existingTitles;
  try {
    existingTitles = await fetchExistingProductTitles();
    console.log(`   Bestaande producten in shop: ${existingTitles.size} (worden niet verwijderd)`);
  } catch (err) {
    console.error(`❌ Kon bestaande producten niet ophalen: ${err.message}`);
    process.exit(1);
  }

  const existingLogoId = process.env.PRINTIFY_LOGO_IMAGE_ID?.trim();
  let imageId;
  if (existingLogoId) {
    imageId = existingLogoId;
    console.log(`\n🖼️  Bestaand logo gebruikt (id: ${imageId})`);
  } else {
    try {
      const uploaded = await uploadLogo();
      imageId = uploaded.id;
    } catch (err) {
      console.error(`❌ Logo upload mislukt: ${err.message}`);
      process.exit(1);
    }
  }

  const onlyKeys = process.env.ONLY_KEYS?.split(",").map((k) => k.trim()).filter(Boolean);
  const productsToRun = onlyKeys?.length
    ? PRODUCTS.filter((p) => onlyKeys.includes(p.key))
    : PRODUCTS;

  const results = { ok: 0, skip: 0, fail: 0 };

  for (const product of productsToRun) {
    if (existingTitles.has(product.title)) {
      console.log(`\n⏭️  Overgeslagen (bestaat al): ${product.title}`);
      results.skip += 1;
      continue;
    }

    try {
      const productId = await createProduct(product, imageId);
      await publishProduct(productId, product.title);
      results.ok += 1;
    } catch (err) {
      results.fail += 1;
      console.error(`   ❌ Fout bij ${product.title}: ${err.message}`);
    }
  }

  console.log(
    `\n📊 Resultaat: ${results.ok} toegevoegd, ${results.skip} overgeslagen, ${results.fail} mislukt`
  );

  if (results.fail > 0 && results.ok === 0 && results.skip === 0) {
    process.exit(1);
  }

  if (results.ok > 0 || results.skip === productsToRun.length) {
    console.log("\n✅ All products created and published!");
  }
}

main().catch((err) => {
  console.error("❌ Onverwachte fout:", err.message);
  process.exit(1);
});
