import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac, randomBytes } from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 uur

function createSessionToken(): string {
  const payload = JSON.stringify({
    exp: Date.now() + SESSION_MAX_AGE * 1000,
    r: randomBytes(16).toString("hex"),
  });
  const secret = process.env.ADMIN_PASSWORD || "change-me";
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

function verifySessionToken(token: string): boolean {
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    const expectedPass = process.env.ADMIN_PASSWORD || "";

    if (!expectedPass) {
      return NextResponse.json(
        { error: "Login niet geconfigureerd. Stel ADMIN_USERNAME en ADMIN_PASSWORD in." },
        { status: 503 }
      );
    }

    if (username !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ error: "Ongeldige inloggegevens" }, { status: 401 });
    }

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login mislukt" }, { status: 500 });
  }
}
