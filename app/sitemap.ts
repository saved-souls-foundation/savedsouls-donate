import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchAnimalsFromApi } from "@/lib/animals-api";
import { fetchSponsorAnimalsFromApi } from "@/lib/sponsor-api";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const BASE_URL = "https://www.savedsouls-foundation.org";

const STATIC_PATHS = [
  "",
  "/donate",
  "/donate/causes",
  "/donate/thai",
  "/support",
  "/gallery",
  "/adopt",
  "/adopt-inquiry",
  "/luchtbrug",
  "/sponsor",
  "/press",
  "/influencers",
  "/about-us",
  "/story",
  "/contact",
  "/partners",
  "/shelters",
  "/volunteer",
  "/street-dogs-thailand",
  "/get-involved",
  "/gidsen",
  "/search",
  "/links",
  "/kids",
  "/school-project",
  "/school-project/materials",
  "/school-project/materials/lesson-1",
  "/school-project/materials/lesson-2",
  "/school-project/materials/fundraising",
  "/school-project/materials/teacher-guide",
  "/nutrition",
  "/toys-training",
  "/feed-a-year",
  "/clinic-renovation",
  "/car-action",
  "/shop",
  "/affiliate",
  "/find-out-more",
  "/soul-saver",
  "/emergency",
  "/visit-and-adopt",
  "/medische-reisvoorbereiding",
  "/adoptieproces",
  "/faq",
  "/health",
  "/raw-hide",
  "/flea-tick-parasite-guide",
  "/general-health",
  "/first-aid",
  "/first-aid-at-home",
  "/first-pet-home",
  "/fireworks-pets",
  "/dangers",
  "/tropics",
  "/infections",
  "/skin-problems",
  "/skin-coat",
  "/cat-flu",
  "/ear-mites-sneezing",
  "/eye-ear-care",
  "/deworming",
  "/heartworm",
  "/vaccinations",
  "/vet-costs-comparison",
  "/william-heinecke-elephants",
  "/minor-hotels",
  "/dog-meat-survivors",
  "/disabled-dog-guide",
  "/paralyzed-dogs-guide",
  "/behavior",
  "/dog-home-alone",
  "/walking-dog",
  "/travel-with-pet",
  "/house-training",
  "/moving-with-pet",
  "/cat-hairball",
  "/puppy-socialization",
  "/dog-barking",
  "/cat-indoor-outdoor",
  "/dog-vomiting-diarrhea",
  "/dog-and-cat-together",
  "/financial-overview",
  "/pet-proof-house",
  "/pet-and-children",
  "/microchipping",
  "/overheating",
  "/pet-sitter",
  "/pet-insurance",
  "/pet-loss",
  "/senior-pet",
  "/toxic-plants",
  "/foster",
  "/sterilization",
  "/pet-passport",
  "/blog",
];

async function getAnimalIds(): Promise<{ dogs: string[]; cats: string[] }> {
  try {
    const { dogs, cats } = await fetchAnimalsFromApi();
    return {
      dogs: dogs.map((d) => d.id),
      cats: cats.map((c) => c.id),
    };
  } catch {
    return { dogs: [], cats: [] };
  }
}

async function getSponsorAnimalIds(): Promise<{ dogs: string[]; cats: string[] }> {
  try {
    const { dogs, cats } = await fetchSponsorAnimalsFromApi();
    return {
      dogs: dogs.map((d) => d.id),
      cats: cats.map((c) => c.id),
    };
  } catch {
    return { dogs: [], cats: [] };
  }
}

async function getPublishedPostsFromSupabase(): Promise<
  { slug: string; lastModified: Date }[]
> {
  if (!isSupabaseAdminConfigured()) return [];
  try {
    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("posts")
      .select("slug, gepubliceerd_op")
      .in("status", ["published", "Gepubliceerd"])
      .not("gepubliceerd_op", "is", null)
      .not("slug", "is", null);

    if (error) {
      console.error("[sitemap] Supabase posts error:", error.message);
      return [];
    }

    return (rows ?? [])
      .map((row) => {
        const slug = row.slug?.trim();
        if (!slug || !row.gepubliceerd_op) return null;
        const lastModified = new Date(row.gepubliceerd_op);
        if (Number.isNaN(lastModified.getTime())) return null;
        return { slug, lastModified };
      })
      .filter((row): row is { slug: string; lastModified: Date } => row !== null);
  } catch (e) {
    console.error("[sitemap] Supabase posts fetch failed:", e);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let dogs: string[] = [];
  let cats: string[] = [];
  let sponsorDogs: string[] = [];
  let sponsorCats: string[] = [];
  let blogPosts: { slug: string }[] = [];
  let dbBlogPosts: { slug: string; lastModified: Date }[] = [];

  try {
    const [animalIds, sponsorIds, supabaseBlogPosts] = await Promise.all([
      getAnimalIds(),
      getSponsorAnimalIds(),
      getPublishedPostsFromSupabase(),
    ]);
    dogs = animalIds.dogs;
    cats = animalIds.cats;
    sponsorDogs = sponsorIds.dogs;
    sponsorCats = sponsorIds.cats;
    dbBlogPosts = supabaseBlogPosts;
    blogPosts = getAllBlogPosts();
  } catch {
    // Bij API/build-fouten toch een bruikbare sitemap leveren (alleen statische paden)
  }

  const MAIN_PATHS = new Set([
    "",
    "/donate",
    "/adopt",
    "/sponsor",
    "/about-us",
    "/contact",
    "/volunteer",
    "/get-involved",
    "/support",
    "/blog",
    "/story",
    "/gallery",
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const localePrefix = `/${locale}`;

    for (const p of STATIC_PATHS) {
      const path = p || "";
      const fullPath = p || "";
      const priority = fullPath === "" ? 1 : MAIN_PATHS.has(fullPath) ? 0.8 : 0.6;
      entries.push({
        url: `${BASE_URL}${localePrefix}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority,
      });
    }

    const staticBlogSlugs = new Set(blogPosts.map((post) => post.slug));

    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/blog/${post.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const post of dbBlogPosts) {
      if (staticBlogSlugs.has(post.slug)) continue;
      entries.push({
        url: `${BASE_URL}${localePrefix}/blog/${post.slug}`,
        lastModified: post.lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    // Adopt profile pages are noindex + blocked in robots.txt; only overview is in sitemap via STATIC_PATHS

    for (const id of sponsorDogs) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/sponsor/dog/${id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const id of sponsorCats) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/sponsor/cat/${id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
