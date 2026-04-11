import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

function supabaseErrorResponse(err: { message: string; code?: string; details?: string | null; hint?: string | null }) {
  return NextResponse.json(
    {
      error: err.message,
      ...(err.code != null && { code: err.code }),
      ...(err.details != null && err.details !== "" && { details: err.details }),
      ...(err.hint != null && err.hint !== "" && { hint: err.hint }),
    },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  const { error, supabase: admin } = await requireAdmin();
  if (error) return error;
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const from = (page - 1) * limit;

  // Productie: Nederlandse kolomnamen in sent_emails.
  const qNl = admin
    .from("sent_emails")
    .select(
      "id, type, aan, onderwerp, inhoud, verstuurd_op, reference_id, reference_type, verwerkt_door",
      { count: "exact" }
    )
    .order("verstuurd_op", { ascending: false })
    .range(from, from + limit - 1);
  const resultNl = await (type === "step_notify" || type === "email_assistant" ? qNl.eq("type", type) : qNl);

  if (resultNl.error) {
    console.error("[api/admin/sent-emails] query failed:", {
      code: resultNl.error.code,
      message: resultNl.error.message,
      details: resultNl.error.details,
      hint: resultNl.error.hint,
    });
    return supabaseErrorResponse(resultNl.error);
  }

  const raw = (resultNl.data ?? []) as Record<string, unknown>[];
  const count = resultNl.count ?? 0;

  const data = raw.map((row: Record<string, unknown>) => ({
    id: row.id,
    type: row.type,
    aan: row.aan ?? "",
    onderwerp: row.onderwerp ?? "",
    inhoud: row.inhoud ?? null,
    verstuurd_op: row.verstuurd_op ?? "",
    reference_id: row.reference_id ?? null,
    reference_type: row.reference_type ?? null,
    verwerkt_door: row.verwerkt_door ?? null,
  }));
  return NextResponse.json({ data, total: count, page, limit });
}
