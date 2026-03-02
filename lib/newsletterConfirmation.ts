import { sendMail } from "@/lib/sendMail";

const BASE_URL = "https://www.savedsouls-foundation.com";
const CONFIRM_SUBJECT = "✅ Je bent aangemeld voor de Saved Souls nieuwsbrief!";

/** From-adres moet een verified domein zijn in Resend (resend.com → Domains). */
const FROM_VERIFIED = "Saved Souls Foundation <info@savedsouls-foundation.com>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type SendNewsletterConfirmationOptions = {
  email: string;
  language: "nl" | "en" | "es" | "ru" | "th" | "de" | "fr";
  unsubscribeToken: string;
  voornaam?: string | null;
  achternaam?: string | null;
};

/**
 * Stuurt bevestigingsmail na nieuwsbriefaanmelding (of handmatige toevoeging door admin).
 * Faalt stil: logt fout maar gooit niet. Gebruik .catch() bij aanroep.
 */
export async function sendNewsletterConfirmation(options: SendNewsletterConfirmationOptions): Promise<void> {
  const { email, language, unsubscribeToken, voornaam, achternaam } = options;
  const naam = [voornaam, achternaam].filter(Boolean).join(" ").trim() || (language === "nl" ? "aanmelder" : "subscriber");
  const unsubscribeUrl = `${BASE_URL}/${language}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const useNl = language === "nl";
  const html = useNl
    ? `
    <p>Beste ${escapeHtml(naam)},</p>
    <p>Welkom! Je bent succesvol aangemeld voor onze nieuwsbrief.</p>
    <p>Je ontvangt voortaan updates over onze dieren, vrijwilligers en activiteiten in Thailand.</p>
    <p><a href="${escapeHtml(unsubscribeUrl)}">Uitschrijven</a> kan altijd via deze link.</p>
    <p>Met warme groet,<br/>Het team van Saved Souls Foundation</p>
  `.trim()
    : `
    <p>Dear ${escapeHtml(naam)},</p>
    <p>Welcome! You have successfully subscribed to our newsletter.</p>
    <p>You will receive updates about our animals, volunteers and activities in Thailand.</p>
    <p>You can <a href="${escapeHtml(unsubscribeUrl)}">unsubscribe</a> at any time via this link.</p>
    <p>Kind regards,<br/>The Saved Souls Foundation team</p>
  `.trim();
  const text = useNl
    ? `Beste ${naam},\n\nWelkom! Je bent succesvol aangemeld voor onze nieuwsbrief.\n\nUitschrijven: ${unsubscribeUrl}\n\nMet warme groet,\nHet team van Saved Souls Foundation`
    : `Dear ${naam},\n\nWelcome! You have successfully subscribed to our newsletter.\n\nUnsubscribe: ${unsubscribeUrl}\n\nKind regards,\nThe Saved Souls Foundation team`;

  console.log("[newsletterConfirmation] Resend: API_KEY =", process.env.RESEND_API_KEY ? "set" : "missing", ", from =", FROM_VERIFIED);
  console.log("[newsletterConfirmation] Sending confirmation to", email);

  const result = await sendMail({ from: FROM_VERIFIED, to: email, subject: CONFIRM_SUBJECT, text, html });

  console.log("[newsletterConfirmation] Mail result:", result.success ? "sent" : result.error);
  if (!result.success) {
    console.error("[newsletterConfirmation] Failed. Check Resend Domains: savedsouls-foundation.com must be Verified.", result.error);
    throw new Error(result.error);
  }
}
