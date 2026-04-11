import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null as ReturnType<typeof createAdminClient> | null };
  }
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), admin: null };
  }
  return { error: null, admin: createAdminClient() };
}

type LeadRow = {
  id: string;
  animal_id: string;
  animal_name: string;
  animal_type: string;
  donor_name: string;
  donor_email: string;
  message: string | null;
  locale: string | null;
  created_at: string;
};

function isLeadRow(x: unknown): x is LeadRow {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.animal_id === "string" &&
    typeof o.animal_name === "string" &&
    typeof o.animal_type === "string" &&
    (o.animal_type === "dog" || o.animal_type === "cat") &&
    typeof o.donor_name === "string" &&
    typeof o.donor_email === "string" &&
    (o.message === null || typeof o.message === "string") &&
    (o.locale === null || typeof o.locale === "string") &&
    typeof o.created_at === "string"
  );
}

/** Herstel verwijderde rijen in `sponsor_leads` (bulk-undo). */
export async function POST(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body === null || typeof body !== "object" || !("leads" in body)) {
    return NextResponse.json({ error: "leads array required" }, { status: 400 });
  }
  const raw = (body as { leads: unknown }).leads;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: "leads array required" }, { status: 400 });
  }
  const leads = raw.filter(isLeadRow);
  if (leads.length !== raw.length) {
    return NextResponse.json({ error: "Invalid lead payload" }, { status: 400 });
  }

  const payload = leads.map((l) => ({
    id: l.id,
    animal_id: l.animal_id,
    animal_name: l.animal_name,
    animal_type: l.animal_type as "dog" | "cat",
    donor_name: l.donor_name,
    donor_email: l.donor_email,
    message: l.message,
    locale: l.locale,
    created_at: l.created_at,
  }));

  const { error: insErr } = await admin!.from("sponsor_leads").insert(payload);
  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body === null || typeof body !== "object" || !("ids" in body)) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }
  const idsRaw = (body as { ids: unknown }).ids;
  if (!Array.isArray(idsRaw)) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }
  const ids = idsRaw.filter((id): id is string => typeof id === "string" && id.length > 0);
  if (ids.length === 0) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  const { error: delErr } = await admin!.from("sponsor_leads").delete().in("id", ids);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, deleted: ids.length });
}
