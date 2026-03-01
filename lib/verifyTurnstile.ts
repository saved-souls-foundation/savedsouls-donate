/**
 * Verifieer een Cloudflare Turnstile token server-side.
 * Zie https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 * Bij lokaal testen gebruikt de frontend de Turnstile test-key; dan moet de server met de test-secret verifiëren.
 */
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare test secret (bij test site-key), zie https://developers.cloudflare.com/turnstile/troubleshooting/testing */
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const isDev = process.env.NODE_ENV === "development";
  const secret = isDev ? TURNSTILE_TEST_SECRET : process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (!isDev) console.warn("[Turnstile] TURNSTILE_SECRET_KEY not set, skipping verification");
    return true;
  }
  if (!token?.trim()) {
    return false;
  }
  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("[Turnstile] verify error:", e);
    return false;
  }
}
