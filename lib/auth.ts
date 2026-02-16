import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_NAME = "admin_session";

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [payload, sig] = decoded.split(".");
    if (!payload || !sig) return false;
    const secret = process.env.ADMIN_PASSWORD || "change-me";
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (sig !== expected) return false;
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
