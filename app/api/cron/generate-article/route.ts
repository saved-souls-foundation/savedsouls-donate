/**
 * Cron: dagelijks 07:00 UTC. Genereert en publiceert 1 SEO-blogartikel via Claude.
 * Beveiligd met Vercel CRON_SECRET (Authorization: Bearer <CRON_SECRET>).
 */
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 300;

const TOPICS = [
  "Stray dogs in Thailand: the scale of the problem and what you can do",
  "Hydrotherapy for dogs: how water heals paralyzed animals",
  "Dog rescue in Khon Kaen: what makes northeast Thailand different",
  "How to donate to an animal rescue in Thailand that actually helps",
  "Disabled dogs: why euthanasia is not the only option",
  "What happens to street dogs in Thailand and who is helping them",
  "Volunteering in Thailand with animals: everything you need to know",
  "How sterilization campaigns reduce animal suffering in Thailand",
  "Rescue dog adoption: what to expect in the first 30 days",
  "Why monthly giving to animal charities is more powerful than one-time donations",
  "How Saved Souls Foundation rescues dogs from abuse and neglect",
  "Thailand animal welfare laws: what changed and what still needs to change",
  "The emotional rehabilitation of traumatized rescue dogs",
  "Gap year in Thailand volunteering with animals: is it worth it?",
  "How to adopt a dog from Thailand to the Netherlands",
] as const;

const TOPIC_COUNT = TOPICS.length;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

function parseArticleIndex(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.floor(value) % TOPIC_COUNT;
  }
  if (value !== null && typeof value === "object" && "index" in value) {
    const n = (value as { index: unknown }).index;
    if (typeof n === "number" && Number.isFinite(n)) {
      return Math.floor(n) % TOPIC_COUNT;
    }
  }
  return 0;
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[cron/generate-article] ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: "Anthropic not configured" }, { status: 500 });
  }

  const admin = createAdminClient();

  const { data: stateRow, error: stateErr } = await admin
    .from("cron_state")
    .select("value")
    .eq("key", "article_index")
    .maybeSingle();

  if (stateErr) {
    console.error("[cron/generate-article] cron_state read error:", stateErr);
    return NextResponse.json({ error: stateErr.message }, { status: 500 });
  }

  const currentIndex = parseArticleIndex(stateRow?.value);
  const topic = TOPICS[currentIndex];

  const client = new Anthropic({ apiKey });
  const userPrompt = `Write a detailed SEO blog article for Saved Souls Foundation, an animal rescue sanctuary in Khon Kaen, Thailand (savedsouls-foundation.org). Title: ${topic}. Requirements: minimum 800 words, markdown formatting, compelling introduction, 4-6 sections with subheadings, mention Saved Souls Foundation naturally, end with call to action to donate/sponsor/volunteer/adopt at savedsouls-foundation.org`;

  let articleText: string;
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [{ role: "user", content: userPrompt }],
    });
    const block = message.content[0];
    articleText = block?.type === "text" ? block.text : "";
  } catch (e) {
    console.error("[cron/generate-article] Anthropic error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "AI generation failed" },
      { status: 500 }
    );
  }

  if (!articleText.trim()) {
    return NextResponse.json({ error: "Empty article from AI" }, { status: 500 });
  }

  const slug = slugify(topic) || `blog-${Date.now()}`;
  const publishedAt = new Date().toISOString();

  const { error: insertErr } = await admin.from("posts").insert({
    titel: topic,
    inhoud: articleText,
    slug,
    status: "published",
    gepubliceerd_op: publishedAt,
    category: "blog",
  });

  if (insertErr) {
    console.error("[cron/generate-article] posts insert error:", insertErr);
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  const nextIndex = (currentIndex + 1) % TOPIC_COUNT;
  const { error: upsertErr } = await admin.from("cron_state").upsert(
    {
      key: "article_index",
      value: nextIndex,
      updated_at: publishedAt,
    },
    { onConflict: "key" }
  );

  if (upsertErr) {
    console.error("[cron/generate-article] cron_state upsert error:", upsertErr);
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, title: topic, slug });
}
