import { Resend } from "resend";

export async function sendNewsletterConfirmation({
  email,
  naam,
}: {
  email: string;
  naam?: string;
}) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Saved Souls Foundation <info@savedsouls-foundation.com>",
      to: email,
      subject: "✅ Je bent aangemeld voor de Saved Souls nieuwsbrief!",
      html: `
        <p>Beste ${naam ?? "abonnee"},</p>
        <p>Welkom! Je bent succesvol aangemeld voor de nieuwsbrief van Saved Souls Foundation.</p>
        <p>Je ontvangt voortaan updates over onze dieren, vrijwilligers en activiteiten in Thailand.</p>
        <p>Met warme groet,<br/>Het team van Saved Souls Foundation</p>
      `,
    });
    console.log("=== MAIL RESULT ===", JSON.stringify(result));
  } catch (err) {
    console.error("=== MAIL ERROR ===", err);
  }
}
