import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS } from "@/lib/sendMail";

const SUBJECT = "🌟 New volunteer signup - Saved Souls Foundation";
const REPLY_TO = "savedsoulsfoundationreply@gmail.com";

const CONFIRMATION_SUBJECT = "We received your volunteer application – Saved Souls Foundation";
const CONFIRMATION_TEXT = `Dear friend,

Thank you for your interest in volunteering at Saved Souls Foundation! We have received your application and our team will get back to you within 48 hours.

We look forward to welcoming you to our sanctuary in Khon Kaen, Thailand!

With gratitude,
The Saved Souls Team
Khon Kaen, Thailand
https://savedsouls-foundation.com`;

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const name = b.name?.trim();
    const email = b.email?.trim();
    const phone = b.phone?.trim() || "";
    const country = b.country?.trim();
    const availability = b.availability?.trim() || b.dates?.trim() || "";
    const motivation = b.motivation?.trim();
    // Allow existing form fields
    const city = b.city?.trim() || "";
    const experience = b.experience?.trim() || "";

    if (!name || !email || !country || !motivation) {
      return NextResponse.json(
        { error: "Name, email, country and motivation are required." },
        { status: 400 }
      );
    }

    const text = [
      "Name: " + name,
      "Email: " + email,
      phone ? "Phone: " + phone : "",
      "Country: " + country,
      city ? "City: " + city : "",
      availability ? "Availability / Preferred dates: " + availability : "",
      experience ? "Experience with animals:\n" + experience : "",
      "",
      "Motivation:",
      motivation,
    ]
      .filter(Boolean)
      .join("\n");

    const notif = await sendMail({
      to: [...NOTIFICATION_EMAILS],
      subject: SUBJECT,
      text,
      replyTo: REPLY_TO,
    });
    if (!notif.success) {
      return NextResponse.json({ error: notif.error || "Failed to send email." }, { status: 502 });
    }

    await sendMail({
      to: email,
      subject: CONFIRMATION_SUBJECT,
      text: CONFIRMATION_TEXT,
      replyTo: REPLY_TO,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Volunteer API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
