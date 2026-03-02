/**
 * PayPal API helpers: OAuth token and webhook signature verification.
 */

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return null;
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

export async function verifyPayPalWebhookSignature(
  rawBody: string,
  headers: {
    "paypal-transmission-id"?: string | null;
    "paypal-transmission-time"?: string | null;
    "paypal-transmission-sig"?: string | null;
    "paypal-auth-algo"?: string | null;
    "paypal-cert-url"?: string | null;
  }
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const transmissionId = headers["paypal-transmission-id"];
  const transmissionTime = headers["paypal-transmission-time"];
  const transmissionSig = headers["paypal-transmission-sig"];
  const authAlgo = headers["paypal-auth-algo"];
  const certUrl = headers["paypal-cert-url"];
  if (!webhookId || !transmissionId || !transmissionTime || !transmissionSig || !authAlgo || !certUrl) {
    return false;
  }
  let event: unknown;
  try {
    event = JSON.parse(rawBody) as unknown;
  } catch {
    return false;
  }
  const token = await getPayPalAccessToken();
  if (!token) return false;
  const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      transmission_id: transmissionId,
      transmission_time: transmissionTime,
      transmission_sig: transmissionSig,
      auth_algo: authAlgo,
      cert_url: certUrl,
      webhook_id: webhookId,
      webhook_event: event,
    }),
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { verification_status?: string };
  return json.verification_status === "SUCCESS";
}

/** Create a PayPal order for one-time payment. Returns order id for client to approve. */
export async function createPayPalOrder(amount: number, currency: string): Promise<string | null> {
  const token = await getPayPalAccessToken();
  if (!token) return null;
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: "Donation to Saved Souls Foundation",
        },
      ],
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { id?: string };
  return json.id ?? null;
}
