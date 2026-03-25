/**
 * Fetches dogs and cats from the external Saved Souls database API.
 * Used by /api/animals and sitemap.
 * API's blijven op de oude .org site (db.savedsouls-foundation.org).
 */

const DOGS_API = "https://db.savedsouls-foundation.org/api/dogs.php";
const CATS_API = "https://db.savedsouls-foundation.org/api/cats.php";
const PER_PAGE = 100;

export interface AnimalRecord {
  id: string;
  name: string;
  thaiName: string;
  type: "dog" | "cat";
  gender: "male" | "female";
  age: string;
  size: "small" | "medium" | "large";
  image: string;
  images: string[];
  story?: string;
}

async function fetchAllPages(
  baseUrl: string
): Promise<Array<{ id: number; name: string; gender: string; image: string; images?: string[]; adoption_story?: string; weight?: number; date_of_birth?: string }>> {
  const all: Array<{ id: number; name: string; gender: string; image: string; images?: string[]; adoption_story?: string; weight?: number; date_of_birth?: string }> = [];
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
  const parts = fullName.split(" / ");
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
  if (!dateOfBirth) return "Unknown";
  try {
    const birth = new Date(dateOfBirth);
    if (isNaN(birth.getTime())) return "Unknown";
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) years--;
    if (years < 0) return "Unknown";
    if (years === 0) {
      const months = Math.max(0, (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30));
      return months < 12 ? `~${Math.round(months)} months` : "~1 year";
    }
    return years === 1 ? "1 year" : `${years} years`;
  } catch {
    return "Unknown";
  }
}

export async function fetchAnimalsFromApi(): Promise<{ dogs: AnimalRecord[]; cats: AnimalRecord[] }> {
  const [rawDogs, rawCats] = await Promise.all([
    fetchAllPages(DOGS_API),
    fetchAllPages(CATS_API),
  ]);

  const dogs: AnimalRecord[] = rawDogs.map((d) => {
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
      story: d.adoption_story || "",
    };
  });

  const cats: AnimalRecord[] = rawCats.map((c) => {
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
      story: c.adoption_story || "",
    };
  });

  return { dogs, cats };
}

/** Primaire foto-URL voor e-mail / UI; null als ID onbekend of fetch faalt. */
export async function getPrimaryImageUrlForAnimalId(animalId: string): Promise<string | null> {
  const id = animalId?.trim();
  if (!id) return null;
  try {
    const { dogs, cats } = await fetchAnimalsFromApi();
    const all = [...dogs, ...cats];
    const found = all.find((a) => String(a.id) === String(id));
    if (!found) return null;
    const url = (found.images?.[0] || found.image || "").trim();
    return url.length > 0 ? url : null;
  } catch {
    return null;
  }
}
