import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS } from "@/lib/sendMail";

const SUBJECT = "🐾 New adoption request - Saved Souls Foundation";
const REPLY_TO = "savedsoulsfoundationreply@gmail.com";

const CONFIRMATION_SUBJECT = "We received your adoption inquiry – Saved Souls Foundation";
const CONFIRMATION_TEXT = `Dear friend,

Thank you for your interest in adopting from Saved Souls Foundation. We have received your adoption inquiry and our team will get back to you within 48 hours.

We look forward to helping you find your new companion!

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
    const dogPreference = b.dogPreference?.trim() || b.animalName?.trim() || "";
    const motivation = b.motivation?.trim() || b.about?.trim() || b.experience?.trim() || "";
    // Allow existing form fields for backward compatibility
    const city = b.city?.trim() || "";
    const experience = b.experience?.trim() || "";
    const about = b.about?.trim() || "";
    const animalId = b.animalId?.trim() || "";

    if (!name || !email || !country) {
      return NextResponse.json(
        { error: "Name, email and country are required." },
        { status: 400 }
      );
    }

    const motivationText = motivation || about || experience;
    if (!motivationText) {
      return NextResponse.json(
        { error: "Please tell us about your motivation or experience." },
        { status: 400 }
      );
    }

    const text = [
      "Name: " + name,
      "Email: " + email,
      phone ? "Phone: " + phone : "",
      "Country: " + country,
      city ? "City: " + city : "",
      dogPreference ? "Dog/animal preference: " + dogPreference + (animalId ? " (ID: " + animalId + ")" : "") : "",
      "",
      "Motivation / About:",
      motivationText,
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
    console.error("Adopt API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
