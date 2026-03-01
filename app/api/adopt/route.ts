import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { getAdoptConfirmationHtml, getAdoptConfirmationText } from "@/lib/emailAdoptConfirmation";
import { getAdoptNotificationHtml } from "@/lib/emailAdoptNotification";

const SUBJECT = "🐾 New adoption request - Saved Souls Foundation";
const REPLY_TO = "info@savedsouls-foundation.com";

const CONFIRMATION_SUBJECT = "We received your adoption inquiry – Saved Souls Foundation";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const valid = await verifyTurnstile(b.turnstileToken);
    if (!valid) {
      return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 400 });
    }
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

    const confirmParams = { recipientName: name, animalName: dogPreference || undefined };
    const autoReply = await sendMail({
      to: email,
      subject: CONFIRMATION_SUBJECT,
      text: getAdoptConfirmationText(confirmParams),
      html: getAdoptConfirmationHtml(confirmParams),
      replyTo: REPLY_TO,
    });
    if (!autoReply.success) {
      return NextResponse.json({ error: autoReply.error || "Failed to send confirmation." }, { status: 502 });
    }

    const notifHtml = getAdoptNotificationHtml({
      name,
      email,
      phone: phone || undefined,
      city: city || undefined,
      country,
      animalName: dogPreference || undefined,
      animalId: animalId || undefined,
      motivation: motivationText,
    });

    await delay(600);
    for (const to of NOTIFICATION_EMAILS) {
      const notif = await sendMail({
        to,
        subject: SUBJECT,
        text,
        html: notifHtml,
        replyTo: REPLY_TO,
      });
      if (!notif.success) {
        return NextResponse.json({ error: notif.error || "Failed to send email." }, { status: 502 });
      }
      await delay(600);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Adopt API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
