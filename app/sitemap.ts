import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchAnimalsFromApi } from "@/lib/animals-api";

const BASE_URL = "https://savedsouls-foundation.org";

const STATIC_PATHS = [
  "",
  "/donate",
  "/donate/causes",
  "/support",
  "/donate/thai",
  "/gallery",
  "/thank-you",
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
  "/blog",
  "/blog/please-help-us-adopt",
  "/blog/end-of-month-feeding-costs",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { dogs, cats } = await getAnimalIds();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const localePrefix = `/${locale}`;

    for (const p of STATIC_PATHS) {
      entries.push({
        url: `${BASE_URL}${localePrefix}${p || ""}`,
        lastModified: now,
        changeFrequency: p === "" || p === "/donate" ? "weekly" : "monthly",
        priority: p === "" ? 1 : p === "/donate" ? 0.9 : 0.8,
      });
    }

    for (const id of dogs) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/adopt/dog/${id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const id of cats) {
      entries.push({
        url: `${BASE_URL}${localePrefix}/adopt/cat/${id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
