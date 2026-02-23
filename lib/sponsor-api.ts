/**
 * Fetches sponsor dogs and cats from the Saved Souls database API.
 * Used by /api/sponsor-animals.
 */

const DOGS_API = "https://db.savedsouls-foundation.org/api/website_sponsor_dogs.php";
const CATS_API = "https://db.savedsouls-foundation.org/api/website_sponsor_cats.php";
const PER_PAGE = 100;

export interface SponsorDog {
  id: string;
  name: string;
  thaiName: string;
  type: "dog";
  gender: "male" | "female";
  age: string;
  size: "small" | "medium" | "large";
  image: string;
  images: string[];
  location: string;
  story: string;
  character: string;
}

export interface SponsorCat {
  id: string;
  name: string;
  thaiName: string;
  type: "cat";
  gender: "male" | "female";
  age: string;
  size: "small" | "medium" | "large";
  image: string;
  images: string[];
  location: string;
  story: string;
  character: string;
}

type RawDog = {
  id: number;
  name: string;
  gender: string;
  dog_location?: string;
  images?: string[];
  image?: string;
  weight?: number;
  date_of_birth?: string;
  sponsorship_story?: string;
  dog_character?: string;
};

type RawCat = {
  id: number;
  name: string;
  gender: string;
  cat_location?: string;
  images?: string[];
  image?: string;
  weight?: number;
  date_of_birth?: string;
  sponsorship_story?: string;
  cat_character?: string;
};

async function fetchAllPages<T>(
  baseUrl: string,
  imageKey: "image" | "images" = "images"
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${baseUrl}?page=${page}&per_page=${PER_PAGE}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    const data = json.data || [];
    const pagination = json.pagination || {};
    all.push(...data);
    hasMore = pagination.current_page < pagination.total_pages;
    page++;
  }
  return all;
}

function parseName(fullName: string): { name: string; thaiName: string } {
  const parts = (fullName || "").split(" / ");
  return {
    name: (parts[0] || fullName).trim(),
    thaiName: (parts[1] || "").trim(),
  };
}

function toGender(g: string): "male" | "female" {
  return (g || "").toLowerCase() === "female" ? "female" : "male";
}

function weightToSize(weight: number | undefined): "small" | "medium" | "large" {
  if (!weight || weight <= 0) return "medium";
  if (weight < 10) return "small";
  if (weight <= 20) return "medium";
  return "large";
}

function formatAge(dateOfBirth: string | undefined): string {
  if (!dateOfBirth) return "";
  try {
    const birth = new Date(dateOfBirth);
    if (isNaN(birth.getTime())) return "";
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) years--;
    if (years < 0) return "";
    if (years === 0) {
      const months = Math.max(0, (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30));
      return months < 12 ? `~${Math.round(months)} months` : "~1 year";
    }
    return years === 1 ? "1 year" : `${years} years`;
  } catch {
    return "";
  }
}

export async function fetchSponsorAnimalsFromApi(): Promise<{
  dogs: SponsorDog[];
  cats: SponsorCat[];
}> {
  const [rawDogs, rawCats] = await Promise.all([
    fetchAllPages<RawDog>(DOGS_API),
    fetchAllPages<RawCat>(CATS_API),
  ]);

  const dogs: SponsorDog[] = rawDogs.map((d) => {
    const { name, thaiName } = parseName(d.name || "");
    const images = Array.isArray(d.images) && d.images.length > 0 ? d.images : (d.image ? [d.image] : []);
    return {
      id: String(d.id),
      name,
      thaiName,
      type: "dog" as const,
      gender: toGender(d.gender),
      age: formatAge(d.date_of_birth),
      size: weightToSize(d.weight),
      image: d.image || images[0] || "",
      images,
      location: d.dog_location || "",
      story: d.sponsorship_story || "",
      character: d.dog_character || "",
    };
  });

  const cats: SponsorCat[] = rawCats.map((c) => {
    const { name, thaiName } = parseName(c.name || "");
    const images = Array.isArray(c.images) && c.images.length > 0 ? c.images : (c.image ? [c.image] : []);
    return {
      id: String(c.id),
      name,
      thaiName,
      type: "cat" as const,
      gender: toGender(c.gender),
      age: formatAge(c.date_of_birth),
      size: weightToSize(c.weight),
      image: c.image || images[0] || "",
      images,
      location: c.cat_location || "",
      story: c.sponsorship_story || "",
      character: c.cat_character || "",
    };
  });

  return { dogs, cats };
}
