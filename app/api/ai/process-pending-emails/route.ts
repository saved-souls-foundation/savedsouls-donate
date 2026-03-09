import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    console.error("[process-pending-emails] Fout: Unauthorized (CRON_SECRET ontbreekt of token komt niet overeen)");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[process-pending-emails] Auto-reply batch gestart");
  const admin = createAdminClient();
  const { data: emails, error: fetchError } = await admin
    .from("incoming_emails")
    .select("id")
    .is("ai_processed_at", null)
    .eq("status", "in_behandeling")
    .limit(10);

  if (fetchError) {
    console.error("[process-pending-emails] Fout:", fetchError.message);
    return NextResponse.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  const list = emails ?? [];
  const results: { emailId: string; category?: string }[] = [];
  const origin = new URL(request.url).origin;
  console.log("[process-pending-emails] Gevonden:", list.length, "e-mails, origin:", origin);

  for (const row of list) {
    const emailId = row.id as string;
    try {
      const res = await fetch(`${origin}/api/ai/email-processor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cronSecret}`,
        },
        body: JSON.stringify({ emailId }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        category?: string;
        error?: string;
      };
      if (res.ok && data.success) {
        results.push({ emailId, category: data.category });
      } else {
        console.error("[process-pending-emails] Fout: email", emailId, "res.status=", res.status, "body=", data?.error ?? data);
        results.push({ emailId });
      }
    } catch (e) {
      console.error("[process-pending-emails] Fout:", e);
      results.push({ emailId });
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  return NextResponse.json({
    processed: results.length,
    results,
  });
}
