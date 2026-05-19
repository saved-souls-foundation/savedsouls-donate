/**
 * Cron: dagelijks 08:00 UTC. Sync Facebook published_posts naar Supabase posts.
 * Beveiligd met Vercel CRON_SECRET (Authorization: Bearer <CRON_SECRET>).
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

const PAGE_ID = "SavedSoulsFoundation";
const MAX_POSTS = 10;
const GRAPH_FIELDS = "id,message,created_time,full_picture,permalink_url";
const BUCKET = "blog-images";

type FacebookPublishedPost = {
  id: string;
  message?: string;
  created_time?: string;
  full_picture?: string;
  permalink_url?: string;
};

type GraphPublishedPostsResponse = {
  data?: FacebookPublishedPost[];
  error?: { message: string; code?: number };
};

type AdminClient = ReturnType<typeof createAdminClient>;

function titelFromMessage(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return "Facebook update";
  return trimmed.length > 100 ? trimmed.slice(0, 100) : trimmed;
}

function storagePathForPost(facebookPostId: string): string {
  const safeId = facebookPostId.replace(/\//g, "_");
  return `facebook/${safeId}.jpg`;
}

async function ensureBlogImagesBucket(admin: AdminClient): Promise<void> {
  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (!listError && buckets?.some((b) => b.name === BUCKET)) {
    return;
  }

  const { error: createError } = await admin.storage.createBucket(BUCKET, {
    public: true,
  });

  if (createError && !/already exists|duplicate/i.test(createError.message)) {
    console.warn("[cron/sync-facebook] createBucket:", createError.message);
  }
}

async function resolveHeroImage(
  admin: AdminClient,
  post: FacebookPublishedPost
): Promise<string | null> {
  const facebookUrl = post.full_picture?.trim();
  if (!facebookUrl) return null;

  const path = storagePathForPost(post.id);

  try {
    const res = await fetch(facebookUrl);
    if (!res.ok) {
      throw new Error(`Download failed: HTTP ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    const buffer = Buffer.from(await res.arrayBuffer());

    const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, buffer, {
      contentType:
        contentType && contentType.startsWith("image/") ? contentType : "image/jpeg",
      upsert: true,
    });
    if (uploadErr) {
      throw new Error(uploadErr.message);
    }

    const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
    return urlData.publicUrl;
  } catch (e) {
    console.warn(
      "[cron/sync-facebook] image upload failed for",
      post.id,
      e instanceof Error ? e.message : e
    );
    return facebookUrl;
  }
}

function rowFromPost(post: FacebookPublishedPost, heroImage: string | null) {
  const message = post.message ?? "";
  return {
    facebook_post_id: post.id,
    titel: titelFromMessage(message),
    inhoud: message,
    slug: `fb-${post.id}`,
    status: "published",
    gepubliceerd_op: post.created_time ?? new Date().toISOString(),
    source: "facebook",
    hero_image: heroImage,
    category: "facebook",
  };
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = process.env.FB_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[cron/sync-facebook] FB_ACCESS_TOKEN is not set");
    return NextResponse.json({ error: "FB_ACCESS_TOKEN is not configured" }, { status: 500 });
  }

  const graphUrl = new URL(
    `https://graph.facebook.com/v22.0/${PAGE_ID}/published_posts`
  );
  graphUrl.searchParams.set("fields", GRAPH_FIELDS);
  graphUrl.searchParams.set("limit", String(MAX_POSTS));
  graphUrl.searchParams.set("access_token", accessToken);

  let graphData: GraphPublishedPostsResponse;
  try {
    const res = await fetch(graphUrl.toString());
    graphData = (await res.json()) as GraphPublishedPostsResponse;
  } catch (e) {
    console.error("[cron/sync-facebook] Graph API fetch error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Graph API fetch failed" },
      { status: 502 }
    );
  }

  if (graphData.error) {
    console.error("[cron/sync-facebook] Graph API error:", graphData.error.message);
    return NextResponse.json({ error: graphData.error.message }, { status: 502 });
  }

  const posts = graphData.data ?? [];
  if (posts.length === 0) {
    return NextResponse.json({ synced: 0, message: "No posts returned from Facebook" });
  }

  const admin = createAdminClient();
  await ensureBlogImagesBucket(admin);

  const rows = await Promise.all(
    posts.map(async (post) => {
      const heroImage = await resolveHeroImage(admin, post);
      return rowFromPost(post, heroImage);
    })
  );

  const { data, error } = await admin
    .from("posts")
    .upsert(rows, { onConflict: "facebook_post_id" })
    .select("id, facebook_post_id, slug, hero_image");

  if (error) {
    console.error("[cron/sync-facebook] Supabase upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("[cron/sync-facebook] Synced", data?.length ?? rows.length, "posts");
  return NextResponse.json({
    synced: data?.length ?? rows.length,
    posts: data ?? [],
  });
}
