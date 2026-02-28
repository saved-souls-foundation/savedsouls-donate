import { Resend } from "resend";

/** From-adres moet op het in Resend geverifieerde domein zijn (bijv. savedsouls-foundation.com), anders komt mail niet aan. */
const DEFAULT_FROM = "Saved Souls Website <info@savedsouls-foundation.com>";

function getFrom(): string {
  return process.env.RESEND_FROM || DEFAULT_FROM;
}

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export type SendMailOptions = {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
};

/**
 * Send a single email. Reusable for all forms (notifications and confirmations).
 * Uses RESEND_API_KEY en RESEND_FROM. Zonder eigen domein (onboarding@resend.dev) levert Resend alleen naar je geverifieerde adres.
 */
export async function sendMail(options: SendMailOptions): Promise<{ success: boolean; error?: string }> {
  const client = getClient();
  if (!client) {
    return { success: false, error: "Email service is not configured." };
  }
  const from = getFrom();
  const to = Array.isArray(options.to) ? options.to : [options.to];
  try {
    const result = await client.emails.send({
      from,
      to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
    });
    const { data, error } = result;
    if (error) {
      console.error("[Resend] sendMail error:", JSON.stringify({ name: error.name, message: error.message }));
      return { success: false, error: error.message || "Failed to send email." };
    }
    console.log("[Resend] Mail sent", { id: data?.id, to, from });
    return { success: true };
  } catch (e) {
    console.error("[Resend] sendMail exception:", e);
    return { success: false, error: e instanceof Error ? e.message : "Failed to send email." };
  }
}

/** Both notification recipients for form submissions. */
export const NOTIFICATION_EMAILS = [
  "info@savedsouls-foundation.com",
  "info@savedsouls-foundation.org",
] as const;
