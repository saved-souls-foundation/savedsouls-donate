import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const VERIFY_TOKEN =
  process.env.FACEBOOK_WEBHOOK_TOKEN || "savedsouls_webhook_2026";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === "page") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "feed" && change.value?.message) {
            const supabase = createAdminClient();
            const message = change.value.message;
            const postId = change.value.post_id;

            const { data: existing } = await supabase
              .from("posts")
              .select("id")
              .eq("facebook_post_id", postId)
              .maybeSingle();

            if (!existing) {
              await supabase.from("posts").insert({
                title:
                  message.slice(0, 60) + (message.length > 60 ? "..." : ""),
                body: message,
                status: "published",
                source: "facebook",
                facebook_post_id: postId,
                published_at: new Date().toISOString(),
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Facebook webhook error:", e);
    return NextResponse.json({ received: true });
  }
}
