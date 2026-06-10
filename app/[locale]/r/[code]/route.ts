import { NextRequest, NextResponse } from "next/server";
import { createQrAdminClient } from "@/lib/qr-supabase";

export const runtime = "nodejs";

const FALLBACK_URL = "https://www.savedsouls-foundation.org";

type QrCodeRow = {
  id: string;
  destination_url: string;
};

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }
  return request.headers.get("x-real-ip");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  let destinationUrl = FALLBACK_URL;
  let qrCodeId: string | null = null;

  try {
    const supabase = createQrAdminClient();
    const { data, error } = await supabase
      .from("qr_codes")
      .select("id, destination_url")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();

    if (!error && data?.destination_url) {
      const row = data as QrCodeRow;
      destinationUrl = row.destination_url;
      qrCodeId = row.id;
    }
  } catch (err) {
    console.error("[qr-redirect] lookup failed:", err);
  }

  if (qrCodeId) {
    try {
      const supabase = createQrAdminClient();
      await supabase.from("qr_scans").insert({
        qr_code_id: qrCodeId,
        user_agent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
        ip_address: getClientIp(request),
      });
    } catch (err) {
      console.error("[qr-redirect] scan log failed:", err);
    }
  }

  return NextResponse.redirect(destinationUrl, 302);
}
