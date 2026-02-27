import { Resend } from "resend";

const FROM = "Saved Souls Foundation <noreply@savedsouls-foundation.com>";

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
 * Uses RESEND_API_KEY and sends from noreply@savedsouls-foundation.com.
 */
export async function sendMail(options: SendMailOptions): Promise<{ success: boolean; error?: string }> {
  const client = getClient();
  if (!client) {
    return { success: false, error: "Email service is not configured." };
  }
  const to = Array.isArray(options.to) ? options.to : [options.to];
  try {
    const { error } = await client.emails.send({
      from: FROM,
      to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
    });
    if (error) {
      console.error("Resend sendMail error:", error);
      return { success: false, error: error.message || "Failed to send email." };
    }
    return { success: true };
  } catch (e) {
    console.error("Resend sendMail exception:", e);
    return { success: false, error: e instanceof Error ? e.message : "Failed to send email." };
  }
}

/** Both notification recipients for form submissions. */
export const NOTIFICATION_EMAILS = [
  "info@savedsouls-foundation.com",
  "info@savedsouls-foundation.org",
] as const;
