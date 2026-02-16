import type { MetadataRoute } from "next";
import { readFile } from "fs/promises";
import path from "path";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://savedsouls-foundation.org";

const STATIC_PATHS = [
  "",
  "/donate",
  "/donate/thai",
  "/gallery",
  "/thank-you",
  "/adopt",
  "/adopt-inquiry",
  "/sponsor",
  "/press",
  "/about-us",
  "/contact",
  "/partners",
  "/volunteer",
  "/street-dogs-thailand",
  "/get-involved",
  "/school-project",
  "/nutrition",
  "/school-project/materials",
  "/school-project/materials/lesson-1",
  "/school-project/materials/lesson-2",
  "/school-project/materials/fundraising",
  "/school-project/materials/teacher-guide",
  "/feed-a-year",
  "/find-out-more",
  "/disclaimer",
  "/lifelong-support",
  "/full-medical-check",
  "/free-home-visit",
];

async function getAnimalIds(): Promise<{ dogs: string[]; cats: string[] }> {
  try {
    const filePath = path.join(process.cwd(), "data", "animals.json");
    const data = await readFile(filePath, "utf-8");
    const json = JSON.parse(data);
    const dogs = (json.dogs as Array<{ id: string }>).map((d) => d.id);
    const cats = (json.cats as Array<{ id: string }>).map((c) => c.id);
    return { dogs, cats };
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
