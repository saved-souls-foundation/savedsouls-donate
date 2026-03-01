import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendMail } from "@/lib/sendMail";
import { buildTravelPlanEmail } from "@/lib/travelPlanEmail";

const REPLY_TO = "info@savedsouls-foundation.com";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_admin")
      .eq("id", user.id)
      .single();
    const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const voornaam = typeof body.voornaam === "string" ? body.voornaam.trim() : "";
    const achternaam = typeof body.achternaam === "string" ? body.achternaam.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const locale = body.locale === "en" ? "en" : "nl";

    if (!email || !voornaam) {
      return NextResponse.json(
        { error: "Verplichte velden ontbreken (email, voornaam)." },
        { status: 400 }
      );
    }

    const html = buildTravelPlanEmail({
      voornaam,
      achternaam,
      city,
      locale,
    });

    const subject =
      locale === "en"
        ? "Your travel plan to Thailand – Saved Souls Foundation"
        : "Je reisplan naar Thailand – Saved Souls Foundation";

    const text =
      locale === "en"
        ? "Your volunteer application has been approved. You will find your travel plan proposal in the HTML version of this email. Travel costs are at your own expense. Saved Souls Foundation"
        : "Je vrijwilligersaanmelding is goedgekeurd. Je vindt je reisplanvoorstel in de HTML-versie van deze e-mail. Reiskosten zijn voor eigen rekening. Saved Souls Foundation";

    const result = await sendMail({
      to: email,
      subject,
      text,
      html,
      replyTo: REPLY_TO,
    });

    if (!result.success) {
      console.error("[send-travel-plan]", result.error);
      return NextResponse.json(
        { error: result.error ?? "Reisplan-mail kon niet worden verstuurd." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[send-travel-plan]", e);
    return NextResponse.json({ error: "Er ging iets mis." }, { status: 500 });
  }
}
