import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "vrijwilliger") {
    return NextResponse.json({ error: "Alleen voor vrijwilligers." }, { status: 403 });
  }

  const { data: rows, error } = await supabase
    .from("berichten")
    .select("id, afzender_id, ontvanger_id, ontvanger_rol, voor_iedereen, inhoud, gelezen, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ids = [...new Set((rows ?? []).map((r: { afzender_id: string }) => r.afzender_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, voornaam, achternaam")
    .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

  const nameById: Record<string, string> = {};
  for (const p of profiles ?? []) {
    const id = (p as { id: string }).id;
    const v = p as { voornaam?: string; achternaam?: string };
    nameById[id] = [v.voornaam, v.achternaam].filter(Boolean).join(" ") || "Coördinator";
  }

  const list = (rows ?? []).map((r: { afzender_id: string; ontvanger_id: string | null; inhoud: string; gelezen: boolean; created_at: string; id: string; voor_iedereen?: boolean }) => {
    const voorIedereen = r.voor_iedereen === true;
    const isRecipient = r.ontvanger_id === user.id || voorIedereen;
    return {
      id: r.id,
      afzender_id: r.afzender_id,
      afzender_naam: nameById[r.afzender_id] ?? "Onbekend",
      ontvanger_id: r.ontvanger_id,
      ontvanger_rol: (r as { ontvanger_rol?: string }).ontvanger_rol,
      voor_iedereen: voorIedereen,
      inhoud: r.inhoud,
      gelezen: r.gelezen,
      created_at: r.created_at,
      is_recipient: isRecipient,
    };
  });

  return NextResponse.json({ berichten: list });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "vrijwilliger") {
    return NextResponse.json({ error: "Alleen voor vrijwilligers." }, { status: 403 });
  }

  let body: { inhoud?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige body." }, { status: 400 });
  }
  const inhoud = typeof body.inhoud === "string" ? body.inhoud.trim() : "";
  if (!inhoud) {
    return NextResponse.json({ error: "Berichttekst is verplicht." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("berichten")
    .insert({
      afzender_id: user.id,
      ontvanger_id: null,
      ontvanger_rol: "admin",
      voor_iedereen: false,
      inhoud,
      gelezen: false,
    })
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data?.id, created_at: (data as { created_at: string })?.created_at });
}
