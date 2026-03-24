import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";

const REPLY_TO = "info@savedsouls-foundation.org";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type OnboardingRow = {
  voornaam: string | null;
  achternaam: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  area: string | null;
  motivation: string | null;
  call_preference: string | null;
  language: string | null;
  step: number;
  welcome_email_sent_at: string | null;
};

export async function POST() {
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

    const { data: row, error: fetchError } = await supabase
      .from("volunteer_onboarding")
      .select("voornaam, achternaam, email, phone, city, area, motivation, call_preference, language, step, welcome_email_sent_at")
      .eq("user_id", user.id)
      .single();

    if (fetchError || !row) {
      return NextResponse.json({ error: "Onboarding niet gevonden." }, { status: 404 });
    }

    const onboarding = row as OnboardingRow;
    if (onboarding.step < 4) {
      return NextResponse.json({ error: "Stap 4 nog niet voltooid." }, { status: 400 });
    }

    if (onboarding.welcome_email_sent_at) {
      return NextResponse.json({ ok: true, alreadySent: true });
    }

    const email = (onboarding.email || "").trim();
    if (!email) {
      return NextResponse.json({ error: "Geen e-mailadres bij onboarding." }, { status: 400 });
    }

    const firstName = (onboarding.voornaam || "").trim() || "vrijwilliger";
    const fullName = [onboarding.voornaam, onboarding.achternaam].filter(Boolean).join(" ").trim() || email;

    // ——— Welkomstmail naar vrijwilliger ———
    const welcomeSubject = "Welkom aan boord – Saved Souls Foundation";
    const welcomeText = `Hoi ${firstName},

Gefeliciteerd! Je bent nu officieel onderdeel van team Saved Souls.

Je ontvangt van ons een persoonlijk reisplan en een introductie op onze werkwijze zodat je goed voorbereid van start kunt gaan. Onze planner neemt contact met je op om je eerste inzet in te plannen.

Reis je naar een van onze projecten? Dan ontvang je een volledig reisplan met begeleiding. Je wordt ook toegevoegd aan onze vrijwilligers-community — altijd een team om op terug te vallen.

Met vriendelijke groet,
Saved Souls Foundation
https://savedsouls-foundation.org`;

    const welcomeHtml = `
      <p>Hoi ${escapeHtml(firstName)},</p>
      <p>Gefeliciteerd! Je bent nu officieel onderdeel van <strong>team Saved Souls</strong>.</p>
      <p>Je ontvangt van ons een persoonlijk reisplan en een introductie op onze werkwijze zodat je goed voorbereid van start kunt gaan. Onze planner neemt contact met je op om je eerste inzet in te plannen.</p>
      <p>Reis je naar een van onze projecten? Dan ontvang je een volledig reisplan met begeleiding. Je wordt ook toegevoegd aan onze vrijwilligers-community — altijd een team om op terug te vallen.</p>
      <p>Met vriendelijke groet,<br><strong>Saved Souls Foundation</strong><br><a href="https://savedsouls-foundation.org">savedsouls-foundation.org</a></p>
    `.trim();

    const welcomeResult = await sendMail({
      to: email,
      subject: welcomeSubject,
      text: welcomeText,
      html: welcomeHtml,
      replyTo: REPLY_TO,
    });
    if (!welcomeResult.success) {
      console.error("[welcome-complete] welcome mail failed:", welcomeResult.error);
      return NextResponse.json({ error: welcomeResult.error || "Welkomstmail kon niet worden verstuurd." }, { status: 502 });
    }

    await delay(600);

    // ——— Notificatie naar team (met formuliergegevens) ———
    const areaLabel = onboarding.area === "thailand" ? "Op locatie in Thailand" : onboarding.area === "lokaal" ? "Lokaal vanuit huis" : onboarding.area || "—";
    const teamSubject = `[Vrijwilliger voltooid] ${fullName} – Saved Souls`;
    const teamText = [
      "Nieuwe vrijwilliger heeft stap 4 voltooid (welkom aan boord).",
      "",
      "Naam: " + fullName,
      "E-mail: " + email,
      "Telefoon: " + (onboarding.phone || "—"),
      "Woonplaats: " + (onboarding.city || "—"),
      "Werkgebied: " + areaLabel,
      "Voorkeur gesprek: " + (onboarding.call_preference || "—"),
      "Taal: " + (onboarding.language || "—"),
      "",
      "Motivatie:",
      onboarding.motivation || "—",
    ].join("\n");

    const teamHtml = `
      <p><strong>Nieuwe vrijwilliger heeft stap 4 voltooid (welkom aan boord).</strong></p>
      <table style="border-collapse:collapse; max-width:560px;">
        <tr><td style="padding:6px 12px 6px 0; color:#666;">Naam</td><td style="padding:6px 0;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#666;">E-mail</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#666;">Telefoon</td><td style="padding:6px 0;">${escapeHtml(onboarding.phone || "—")}</td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#666;">Woonplaats</td><td style="padding:6px 0;">${escapeHtml(onboarding.city || "—")}</td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#666;">Werkgebied</td><td style="padding:6px 0;">${escapeHtml(areaLabel)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#666;">Voorkeur gesprek</td><td style="padding:6px 0;">${escapeHtml(onboarding.call_preference || "—")}</td></tr>
        <tr><td style="padding:6px 12px 6px 0; color:#666;">Taal</td><td style="padding:6px 0;">${escapeHtml(onboarding.language || "—")}</td></tr>
      </table>
      <p style="margin-top:12px;"><strong>Motivatie:</strong></p>
      <p style="white-space:pre-wrap; margin:0;">${escapeHtml(onboarding.motivation || "—")}</p>
    `.trim();

    for (const to of NOTIFICATION_EMAILS) {
      const teamResult = await sendMail({
        to,
        subject: teamSubject,
        text: teamText,
        html: teamHtml,
        replyTo: REPLY_TO,
      });
      if (!teamResult.success) {
        console.error("[welcome-complete] team mail failed:", to, teamResult.error);
        return NextResponse.json({ error: teamResult.error || "Teammail kon niet worden verstuurd." }, { status: 502 });
      }
      await delay(600);
    }

    const { error: updateError } = await supabase
      .from("volunteer_onboarding")
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[welcome-complete] update welcome_email_sent_at failed:", updateError);
      // Mail is al verstuurd; return toch 200
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[welcome-complete]", e);
    return NextResponse.json({ error: "Er ging iets mis." }, { status: 500 });
  }
}
