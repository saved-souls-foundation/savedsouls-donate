import { revalidatePath, revalidateTag } from "next/cache";
import { ANIMALS_CACHE_TAG } from "@/lib/animals-api";

/** Leegt de adoptie-cache (fetch-tag + API-routes). Geen geheim, geen HTTP. */
export function refreshAnimalsCache(): void {
  revalidateTag(ANIMALS_CACHE_TAG, "max");
  revalidatePath("/api/animals");
  revalidatePath("/api/animals/full");
}
