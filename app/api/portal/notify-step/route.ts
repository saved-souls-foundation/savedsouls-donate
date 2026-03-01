import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/sendMail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, naam, stepLabel, role } = body as {
      email?: string;
      naam?: string;
      stepLabel?: string;
      role?: string;
    };
    if (!email || !stepLabel) {
      return NextResponse.json(
        { error: "email and stepLabel required" },
        { status: 400 }
      );
    }
    const name = naam || "daar";
    const subject = "Update over jouw aanmelding bij Saved Souls Foundation";
    const text = `Hoi ${name},\n\nEr is een update in jouw proces!\nJe bent nu op stap: ${stepLabel}.\n\nMet vriendelijke groet,\nSaved Souls Foundation`;
    const html = `
      <p>Hoi ${name},</p>
      <p>Er is een update in jouw proces!</p>
      <p><strong>Je bent nu op stap: ${stepLabel}.</strong></p>
      <p>Met vriendelijke groet,<br>Saved Souls Foundation</p>
    `;
    const result = await sendMail({
      to: email,
      subject,
      text,
      html,
    });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notify-step]", e);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
