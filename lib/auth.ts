import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [payload, sig] = decoded.split(".");
    if (!payload || !sig) return false;
    // Geen reserve-sleutel: zonder ADMIN_PASSWORD is geen enkele sessie geldig.
    const secret = process.env.ADMIN_PASSWORD;
    if (!secret) return false;
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const data = JSON.parse(payload);
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!(token && verifySessionToken(token));
}
