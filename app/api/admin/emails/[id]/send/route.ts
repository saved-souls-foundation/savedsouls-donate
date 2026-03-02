import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/sendMail";

const RESEND_FROM = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || "info@savedsouls-foundation.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase };
}

function wrapHtml(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.5;">${body}</body></html>`;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  let body: { reply_text?: string; template_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const reply_text = typeof body.reply_text === "string" ? body.reply_text.trim() : "";
  if (!reply_text) return NextResponse.json({ error: "reply_text is required" }, { status: 400 });

  const { data: email, error: emailErr } = await supabase!.from("incoming_emails").select("van_email, onderwerp").eq("id", id).maybeSingle();
  if (emailErr || !email) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const to = email.van_email as string;
  if (!to) return NextResponse.json({ error: "No recipient" }, { status: 400 });

  const subject = `Re: ${(email.onderwerp as string) ?? "Your message"}`;
  const html = wrapHtml(reply_text.replace(/\n/g, "<br>\n"));

  const result = await sendMail({
    from: RESEND_FROM,
    to,
    subject,
    text: reply_text.replace(/<[^>]+>/g, ""),
    html,
  });

  if (!result.success) return NextResponse.json({ error: result.error ?? "Send failed" }, { status: 502 });

  const { data: { user } } = await supabase!.auth.getUser();
  const { error: updateErr } = await supabase!
    .from("incoming_emails")
    .update({
      status: "verstuurd",
      verwerkt_door: user?.id ?? null,
      verwerkt_op: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
