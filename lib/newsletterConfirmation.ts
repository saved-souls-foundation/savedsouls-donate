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
      from: process.env.RESEND_FROM_EMAIL || "Saved Souls Foundation <info@savedsouls-foundation.org>",
      to: email,
      subject: "✅ Je bent aangemeld voor de Saved Souls nieuwsbrief!",
      html: `
        <div style="max-width:560px;margin:0 auto;font-family:sans-serif;">
          <div style="background:#2aa348;color:#fff;padding:24px;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;font-size:22px;font-weight:600;">Saved Souls Foundation</h1>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 16px 0;text-align:center;">
              <img src="https://www.savedsouls-foundation.org/ourwork-1.webp" alt="Saved Souls Foundation" width="520" style="max-width:100%;height:auto;border-radius:12px;display:inline-block;" />
            </p>
            <p>Beste ${naam ?? "abonnee"},</p>
            <p>Welkom! Je bent succesvol aangemeld voor de nieuwsbrief van Saved Souls Foundation.</p>
            <p>Je ontvangt voortaan updates over onze dieren, vrijwilligers en activiteiten in Thailand.</p>
            <p>Met warme groet,<br/>Het team van Saved Souls Foundation</p>
          </div>
        </div>
      `,
    });
    console.log("=== MAIL RESULT ===", JSON.stringify(result));
  } catch (err) {
    console.error("=== MAIL ERROR ===", err);
  }
}
