import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ANIMALS_CACHE_TAG } from "@/lib/animals-api";

export const dynamic = "force-dynamic";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length === 0 || a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function readProvidedSecret(req: Request): Promise<string> {
  const headerSecret = req.headers.get("x-revalidate-secret")?.trim() ?? "";
  if (headerSecret) return headerSecret;

  const auth = req.headers.get("authorization") ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
    if (token) return token;
  }

  try {
    const body = (await req.json()) as { secret?: unknown };
    if (typeof body?.secret === "string") return body.secret.trim();
  } catch {
    // Geen JSON-body.
  }
  return "";
}

export async function POST(req: Request) {
  const expected = process.env.REVALIDATE_SECRET?.trim() ?? "";
  const provided = await readProvidedSecret(req);
  if (!expected || !secretsMatch(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(ANIMALS_CACHE_TAG, "max");
  revalidatePath("/api/animals");
  revalidatePath("/api/animals/full");

  return NextResponse.json({ revalidated: true, tag: ANIMALS_CACHE_TAG });
}
