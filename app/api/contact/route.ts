import { NextRequest, NextResponse } from "next/server";
const TO = "info@savedsouls-foundation.org";
export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const name = b.name;
    const email = b.email;
    const subject = b.subject || "";
    const message = b.message;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
    }
    const text = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
    const subjectLine = subject ? "[Website] " + subject : "Contact via website";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({ from: "Saved Souls Website <onboarding@resend.dev>", to: [TO], subject: subjectLine, text })
    });
    if (!res.ok) return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
