import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null, userId: user.id };
}

/** GET: lijst drafts (voor beheer geplande nieuwsbrieven) */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const admin = createAdminClient();
  const { data, error: fetchError } = await admin
    .from("newsletter_drafts")
    .select("id, titel, subject_nl, subject_en, aangemaakt_op, scheduled_at, verstuurd_op")
    .order("scheduled_at", { ascending: true, nullsFirst: false });
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  return NextResponse.json({ drafts: data ?? [] });
}

/** POST: draft aanmaken (optioneel scheduled_at = wanneer automatisch verzenden) */
export async function POST(request: NextRequest) {
  const { error, userId } = await requireAdmin();
  if (error) return error;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const scheduledAt = typeof body.scheduled_at === "string" && body.scheduled_at.trim()
    ? new Date(body.scheduled_at).toISOString()
    : null;
  const admin = createAdminClient();
  const { data, error: insertErr } = await admin
    .from("newsletter_drafts")
    .insert({
      titel: typeof body.titel === "string" ? body.titel : null,
      subject_nl: typeof body.subject_nl === "string" ? body.subject_nl : null,
      subject_en: typeof body.subject_en === "string" ? body.subject_en : null,
      body_nl: typeof body.body_nl === "string" ? body.body_nl : null,
      body_en: typeof body.body_en === "string" ? body.body_en : null,
      scheduled_at: scheduledAt,
      aangemaakt_door: userId ?? null,
    })
    .select("id, scheduled_at")
    .single();
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ draft: data });
}
