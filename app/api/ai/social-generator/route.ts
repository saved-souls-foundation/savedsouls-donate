import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { callClaude } from "@/lib/ai/claude-client";

const SOCIAL_PROMPT = (titel: string, inhoud: string) =>
  `Maak op basis van deze blogpost drie sociale media varianten. Antwoord ALLEEN met geldige JSON, geen markdown of uitleg.

Blogtitel: ${titel}
Inhoud: ${(inhoud || "").slice(0, 2000)}

Geef dit exacte JSON-object terug:
{
  "facebook": "max 180 woorden, warm, 2-3 emoji",
  "instagram": "max 120 woorden + 10 hashtags onderaan",
  "kort": "max 280 tekens, pakkend, 1 emoji"
}`;

function parseSocialResponse(raw: string): { facebook: string; instagram: string; kort: string } {
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as {
      facebook?: string;
      instagram?: string;
      kort?: string;
    };
    return {
      facebook: typeof parsed.facebook === "string" ? parsed.facebook : "",
      instagram: typeof parsed.instagram === "string" ? parsed.instagram : "",
      kort: typeof parsed.kort === "string" ? parsed.kort : "",
    };
  } catch {
    return { facebook: raw, instagram: "", kort: "" };
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { blogPostId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const blogPostId = body.blogPostId;
  if (!blogPostId || typeof blogPostId !== "string") {
    return NextResponse.json(
      { error: "blogPostId is required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data: post, error: fetchErr } = await admin
    .from("posts")
    .select("id, titel, inhoud")
    .eq("id", blogPostId)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json(
      { error: fetchErr.message },
      { status: 500 }
    );
  }
  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  const titel = (post.titel ?? "") as string;
  const inhoud = (post.inhoud ?? "") as string;

  let raw: string;
  try {
    raw = await callClaude(SOCIAL_PROMPT(titel, inhoud), {
      model: "haiku",
      maxTokens: 700,
      taskName: "social-generator",
    });
  } catch (e) {
    console.error("[social-generator] Claude error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Claude failed" },
      { status: 500 }
    );
  }

  const { facebook, instagram, kort } = parseSocialResponse(raw);

  const { data: existing } = await admin
    .from("social_posts")
    .select("id")
    .eq("blog_post_id", blogPostId)
    .maybeSingle();

  let socialPostId: string;

  if (existing && (existing as { id: string }).id) {
    const { error: updateErr } = await admin
      .from("social_posts")
      .update({ facebook, instagram, kort, status: "concept" })
      .eq("blog_post_id", blogPostId);
    if (updateErr) {
      return NextResponse.json(
        { error: updateErr.message },
        { status: 500 }
      );
    }
    socialPostId = (existing as { id: string }).id;
  } else {
    const { data: inserted, error: insertErr } = await admin
      .from("social_posts")
      .insert({
        blog_post_id: blogPostId,
        facebook,
        instagram,
        kort,
        status: "concept",
      })
      .select("id")
      .single();
    if (insertErr) {
      return NextResponse.json(
        { error: insertErr.message },
        { status: 500 }
      );
    }
    socialPostId = (inserted as { id: string }).id;
  }

  return NextResponse.json({
    success: true,
    socialPostId,
  });
}
