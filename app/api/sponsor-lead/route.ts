import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSponsorConfirmationMail } from "@/lib/sponsorConfirmationMail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      animalId,
      animalName,
      animalType,
      donorName,
      donorEmail,
      message,
      locale,
      animalImage,
    } = body;

    if (!animalId || !animalName || !animalType ||
        !donorName || !donorEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("sponsor_leads")
      .insert({
        animal_id: animalId,
        animal_name: animalName,
        animal_type: animalType,
        donor_name: donorName.trim(),
        donor_email: donorEmail.trim().toLowerCase(),
        message: message?.trim().slice(0, 500) || null,
        locale: locale || "nl",
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    const mailRes = await sendSponsorConfirmationMail({
      to: donorEmail.trim().toLowerCase(),
      donorName: donorName.trim(),
      animalName: animalName.trim(),
      animalType: animalType === "cat" ? "cat" : "dog",
      animalId: String(animalId),
      animalImageUrl:
        typeof animalImage === "string" && animalImage.trim().length > 0
          ? animalImage.trim()
          : null,
      locale: typeof locale === "string" ? locale : "nl",
    });
    if (!mailRes.success) {
      console.error("[sponsor-lead] confirmation mail error:", mailRes.error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("sponsor-lead error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
