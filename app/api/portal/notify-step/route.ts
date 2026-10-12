import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";
import { wrapEmailWithHeaderFooter } from "@/lib/emailLayout";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { logSentEmail } from "@/lib/sentEmailsLog";
import { isAdminUser } from "@/lib/adminAccess";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  // Alleen admins (wordt aangeroepen vanuit de admin-schermen Vrijwilligers en Adoptanten).
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { email, naam, stepLabel, role, dierNaam, dierInfo } = body as {
      email?: string;
      naam?: string;
      stepLabel?: string;
      role?: string;
      dierNaam?: string;
      dierInfo?: string;
    };
    if (!email || !stepLabel) {
      return NextResponse.json(
        { error: "email and stepLabel required" },
        { status: 400 }
      );
    }
    const name = naam || "daar";
    // Waarden komen van de client: ontsnappen voordat ze in de HTML-mail komen.
    const h = { name: escapeHtml(name), stepLabel: escapeHtml(stepLabel), dierNaam: dierNaam ? escapeHtml(dierNaam) : "", dierInfo: dierInfo ? escapeHtml(dierInfo) : "" };
    const subject = "Update over jouw aanmelding bij Saved Souls Foundation";

    const dierRegel =
      dierNaam || dierInfo
        ? `<p><strong>${h.dierNaam ? `Dier: ${h.dierNaam}` : ""}${h.dierNaam && h.dierInfo ? " — " : ""}${h.dierInfo}</strong></p>`
        : "";

    const bodyHtml = `
      <p>Hoi ${h.name},</p>
      <p>Er is een update in jouw proces!</p>
      <p><strong>Je bent nu op stap: ${h.stepLabel}.</strong></p>
      ${dierRegel}
      <p>Met vriendelijke groet,<br>Saved Souls Foundation</p>
    `;
    const { html, text } = wrapEmailWithHeaderFooter({
      bodyHtml,
      bodyText: `Hoi ${name},\n\nEr is een update in jouw proces!\nJe bent nu op stap: ${stepLabel}.${dierNaam || dierInfo ? `\n${dierNaam ? `Dier: ${dierNaam}` : ""}${dierNaam && dierInfo ? " — " : ""}${dierInfo ?? ""}` : ""}\n\nMet vriendelijke groet,\nSaved Souls Foundation`,
    });

    const result = await sendMail({
      to: email,
      subject,
      text,
      html,
    });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    if (isSupabaseAdminConfigured()) {
      const supabase = createAdminClient();
      await logSentEmail(supabase, {
        type: "step_notify",
        to: email,
        subject,
        bodyPreview: bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500) || null,
        meta: { naam: name, stepLabel, role: role ?? null, dierNaam: dierNaam ?? null, dierInfo: dierInfo ?? null },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notify-step]", e);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
