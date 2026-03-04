import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { getAdoptConfirmationHtml, getAdoptConfirmationText } from "@/lib/emailAdoptConfirmation";
import { getAdoptNotificationHtml } from "@/lib/emailAdoptNotification";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const SUBJECT = "🐾 New adoption request - Saved Souls Foundation";
const REPLY_TO = "info@savedsouls-foundation.com";

const CONFIRMATION_SUBJECT = "We received your adoption inquiry – Saved Souls Foundation";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const token = b.turnstileToken?.trim();
    if (token) {
      const valid = await verifyTurnstile(token);
      if (!valid) {
        return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 400 });
      }
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
    // Optioneel 2e en 3e dier
    const extraAnimals: Array<{ animalName: string; animalId: string }> = [];
    for (let i = 2; i <= 3; i++) {
      const an = (b[`animalName${i}`] ?? b[`animal${i}Name`])?.trim?.();
      const aid = (b[`animalId${i}`] ?? b[`animal${i}Id`])?.trim?.();
      if (an || aid) extraAnimals.push({ animalName: an || "", animalId: aid || "" });
    }

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

    if (isSupabaseAdminConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase.from("adoption_applications").insert({
          email,
          name,
          city: city || "—",
          country,
          experience: experience || motivation || "—",
          about: about || motivation || "—",
          animal_name: dogPreference || null,
          animal_id: animalId || null,
          extra_animals: extraAnimals.length > 0 ? extraAnimals : [],
          step: 1,
        });
        await supabase.from("incoming_emails").insert({
          van_email: email,
          van_naam: name,
          onderwerp: `Adoptieaanvraag: ${name}${dogPreference ? ` – ${dogPreference}` : ""}`,
          inhoud: text,
          bron: "aanvraag",
          status: "in_behandeling",
        });
      } catch (e) {
        console.error("Supabase adoption_applications or incoming_emails insert failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Adopt API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
