#!/usr/bin/env node
/**
 * Sync Facebook posts van Saved Souls Foundation naar de blog.
 *
 * Gebruik:
 *   node scripts/sync-facebook-blog.mjs
 *
 * Vereist: FB_ACCESS_TOKEN in .env of als environment variable.
 *   - Maak een Facebook App op developers.facebook.com
 *   - Voor testing: gebruik een User Access Token van een page admin
 *   - Voor productie: Page Access Token of System User Token met Page Public Content Access
 *
 * Output: data/facebook-posts.json
 * Fallback afbeelding: /savedsoul-logo.webp (als er geen Facebook-foto is)
 *
 * Cron (dagelijks om 8:00):
 *   0 8 * * * cd /pad/naar/project && node scripts/sync-facebook-blog.mjs
 */
import { writeFileSync, mkdirSync, existsSync, createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "data");
const FB_IMAGES_DIR = join(ROOT, "public", "blog", "facebook");
const OUTPUT_FILE = join(DATA_DIR, "facebook-posts.json");
const FALLBACK_IMAGE = "/savedsoul-logo.webp";
const PAGE_ID = "SavedSoulsFoundation";
const MAX_POSTS = 10;

function downloadImage(url, postId) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const slug = `fb-${(postId || "").replace(/[^a-zA-Z0-9]/g, "_") || Date.now()}`;
    const ext = url.includes(".png") ? "png" : "jpg";
    const dest = join(FB_IMAGES_DIR, `${slug}.${ext}`);
    const file = createWriteStream(dest);
    protocol
      .get(url, { redirect: true }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          downloadImage(res.headers.location).then(resolve).catch(reject);
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(`/blog/facebook/${slug}.${ext}`);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function fetchFacebookPosts() {
  const token = process.env.FB_ACCESS_TOKEN;
  if (!token) {
    console.warn("⚠️  FB_ACCESS_TOKEN niet gezet. Gebruik .env of: export FB_ACCESS_TOKEN=...");
    console.warn("   Zie: https://developers.facebook.com/docs/graph-api/");
    return [];
  }

  const fields = "id,message,created_time,full_picture,permalink_url,attachments{media{image{src}}}";
  const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/published_posts?fields=${fields}&limit=${MAX_POSTS}&access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("Facebook API error:", data.error.message);
      if (data.error.code === 190) {
        console.error("   → Token verlopen of ongeldig. Genereer een nieuwe token.");
      }
      return [];
    }

    return data.data || [];
  } catch (err) {
    console.error("Fetch error:", err.message);
    return [];
  }
}

function extractImage(post) {
  if (post.full_picture) return post.full_picture;
  const att = post.attachments?.data?.[0];
  if (att?.media?.image?.src) return att.media.image.src;
  return null;
}

function truncate(text, maxLen = 200) {
  if (!text || typeof text !== "string") return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).trim() + "…";
}

function slugFromId(id) {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

async function main() {
  console.log("📘 Fetching Facebook posts from", PAGE_ID, "...");

  const posts = await fetchFacebookPosts();

  if (posts.length === 0) {
    console.log("   Geen posts gevonden. Schrijf lege array (oude data blijft behouden).");
    if (existsSync(OUTPUT_FILE)) {
      console.log("   Bestaande data blijft ongewijzigd.");
      return;
    }
  } else {
    console.log(`   ${posts.length} posts gevonden.`);
  }

  if (!existsSync(FB_IMAGES_DIR)) {
    mkdirSync(FB_IMAGES_DIR, { recursive: true });
  }

  const output = [];
  for (const post of posts) {
    const imageUrl = extractImage(post);
    const created = post.created_time || new Date().toISOString();
    const dateStr = created.split("T")[0];
    let heroImage = FALLBACK_IMAGE;

    if (imageUrl) {
      try {
        heroImage = await downloadImage(imageUrl, post.id);
      } catch (e) {
        console.warn("   Kon afbeelding niet downloaden voor post", post.id, ":", e.message);
      }
    }

    output.push({
      id: post.id,
      slug: `fb-${slugFromId(post.id)}`,
      date: dateStr,
      permalink: post.permalink_url || `https://www.facebook.com/${PAGE_ID}/posts/${post.id}`,
      message: post.message || "",
      excerpt: truncate(post.message || "", 150),
      heroImage,
      listingImage: heroImage,
      source: "facebook",
    });
  }

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log("✅ Geschreven naar", OUTPUT_FILE);

  const withFallback = output.filter((p) => p.heroImage === FALLBACK_IMAGE).length;
  if (withFallback > 0) {
    console.log(`   ℹ️  ${withFallback} post(s) gebruiken fallback:`, FALLBACK_IMAGE);
  }
}

main().catch(console.error);
