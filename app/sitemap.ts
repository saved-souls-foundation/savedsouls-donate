import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchAnimalsFromApi } from "@/lib/animals-api";
import { fetchSponsorAnimalsFromApi } from "@/lib/sponsor-api";
import { getAllBlogPosts } from "@/lib/blog-posts";

const BASE_URL = "https://www.savedsouls-foundation.com";

const STATIC_PATHS = [
  "",
  "/donate",
  "/donate/causes",
  "/donate/thai",
  "/support",
  "/gallery",
  "/thank-you",
  "/adopt",
  "/adopt-inquiry",
  "/adopt-preview",
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
  "/volunteer-signup",
  "/street-dogs-thailand",
  "/get-involved",
  "/gidsen",
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
  "/find-out-more",
  "/soul-saver",
  "/disclaimer",
  "/lifelong-support",
  "/full-medical-check",
  "/free-home-visit",
  "/faq",
  "/go",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let dogs: string[] = [];
  let cats: string[] = [];
  let sponsorDogs: string[] = [];
  let sponsorCats: string[] = [];
  let blogPosts: { slug: string }[] = [];

  try {
    const [animalIds, sponsorIds] = await Promise.all([
      getAnimalIds(),
      getSponsorAnimalIds(),
    ]);
    dogs = animalIds.dogs;
    cats = animalIds.cats;
    sponsorDogs = sponsorIds.dogs;
    sponsorCats = sponsorIds.cats;
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

    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/blog/${post.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const id of dogs) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/adopt/dog/${id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const id of cats) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/adopt/cat/${id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

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
