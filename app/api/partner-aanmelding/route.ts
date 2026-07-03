import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { getEmailFooterHtml } from "@/lib/emailFooter";

const ACCENT_GREEN = "#2aa348";
const SUBJECT = "🐾 Nieuwe Dierenvriend Partner aanmelding — Saved Souls Foundation";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(fields: Record<string, string>): string {
  const rows = Object.entries(fields)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;color:#666;width:160px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 0;">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${ACCENT_GREEN};color:#fff;padding:20px 24px;">
    <h1 style="margin:0;font-size:20px;font-weight:600;">🐾 Dierenvriend Partner aanmelding</h1>
    <p style="margin:8px 0 0;opacity:0.95;font-size:14px;">Saved Souls Foundation</p>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
  </div>
  ${getEmailFooterHtml()}
</div></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const valid = await verifyTurnstile(b.turnstileToken);
    if (!valid) {
      return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 400 });
    }

    const practiceName = b.practiceName?.trim();
    const contactPerson = b.contactPerson?.trim();
    const email = b.email?.trim();
    const phone = b.phone?.trim() || "";
    const address = b.address?.trim() || "";
    const preference = b.preference?.trim();
    const comments = b.comments?.trim() || "";
    const consent = b.consent === true;

    if (!practiceName || !contactPerson || !email || !preference) {
      return NextResponse.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: "Akkoord met vermelding is verplicht." }, { status: 400 });
    }

    const fields: Record<string, string> = {
      "Naam praktijk": practiceName,
      Contactpersoon: contactPerson,
      "E-mailadres": email,
      ...(phone ? { Telefoonnummer: phone } : {}),
      ...(address ? { Adres: address } : {}),
      "Ik wil graag": preference,
      ...(comments ? { Opmerkingen: comments } : {}),
      "Akkoord vermelding": "Ja",
    };

    const text = Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const html = buildNotificationHtml(fields);

    for (const to of NOTIFICATION_EMAILS) {
      const result = await sendMail({
        to,
        subject: SUBJECT,
        text,
        html,
        replyTo: email,
      });
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Failed to send email." }, { status: 502 });
      }
      await delay(600);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[partner-aanmelding] error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
