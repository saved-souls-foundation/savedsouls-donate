/**
 * HTML-body voor de adoptie-bevestigingsmail (auto-reply).
 * Inline styles voor maximale compatibiliteit in e-mailclients.
 */

const BASE_URL = "https://www.savedsouls-foundation.com";
const GREEN = "#2aa348";
const GREEN_DARK = "#1e7a38";
const FOOTER_BG = "#1a3d2b";
const DONATE_RED = "#c53030";
const DONATE_RED_DARK = "#9b2c2c";

const SOCIAL_LINKS = [
  { name: "Facebook", url: "https://www.facebook.com/SavedSoulsFoundation/" },
  { name: "Instagram", url: "https://www.instagram.com/savedsoulsfoundation" },
  { name: "YouTube", url: "https://www.youtube.com/@savedsoulsfoundation" },
  { name: "X", url: "https://x.com/SoulsaversSSF" },
  { name: "TikTok", url: "https://www.tiktok.com/@savedsoulsfoundation" },
  { name: "Reddit", url: "https://www.reddit.com/user/SoulsaversSSF" },
];

export type AdoptConfirmationParams = {
  recipientName: string;
  animalName?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getAdoptConfirmationHtml(params: AdoptConfirmationParams): string {
  const { recipientName, animalName } = params;
  const name = escapeHtml(recipientName.trim() || "friend");
  const animal = animalName?.trim() ? escapeHtml(animalName.trim()) : null;

  const donateUrl = `${BASE_URL}/donate`;
  const websiteUrl = BASE_URL;

  const greeting = `Dear ${name},`;
  const animalLine = animal
    ? `<p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">You applied for: <strong style="color: ${GREEN};">${animal}</strong></p>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">We're so happy you're interested in <strong style="color: ${GREEN};">${animal}</strong>! Thank you for wanting to give them a forever home — we can't wait to help you both find each other.</p>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your adoption inquiry</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; color: #334155;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
          <!-- Header band -->
          <tr>
            <td style="background: linear-gradient(135deg, ${GREEN}, ${GREEN_DARK}); padding: 24px 24px; text-align: center;">
              <p style="margin:0; font-size: 14px; color: rgba(255,255,255,0.9);">♥ Saved Souls Foundation ♥</p>
              <h1 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff;">We received your adoption inquiry</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">${greeting}</p>
              ${animalLine}
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">We have received your adoption inquiry and our team will get back to you within 48 hours.</p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">We look forward to helping you find your new companion!</p>
              <!-- Donation CTA -->
              <p style="margin: 0 0 12px 0; font-size: 15px; color: #475569;">While you wait, you can support our rescued animals:</p>
              <p style="margin: 0 0 24px 0;">
                <a href="${donateUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, ${DONATE_RED}, ${DONATE_RED_DARK}); color: #ffffff !important; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(197, 48, 48, 0.35);">Donate to Saved Souls</a>
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155;">With gratitude,</p>
              <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: ${GREEN};">The Saved Souls Team</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Khon Kaen, Thailand</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: ${FOOTER_BG}; padding: 24px 24px; color: #ffffff;">
              <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #ffffff;">Saved Souls Foundation</p>
              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.85);">Ban Khok Ngam, Ban Fang, Khon Kaen, Thailand</p>
              <p style="margin: 0 0 16px 0; font-size: 13px;">
                <a href="${websiteUrl}" style="color: #7dd3fc; text-decoration: underline;">savedsouls-foundation.com</a>
              </p>
              <!-- Social links -->
              <p style="margin: 0 0 8px 0; font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.05em;">Follow us</p>
              <p style="margin: 0; font-size: 13px;">
                ${SOCIAL_LINKS.map(
                  (s) => `<a href="${s.url}" style="color: rgba(255,255,255,0.9); text-decoration: none; margin-right: 12px;">${s.name}</a>`
                ).join("")}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

/** Plain-textversie voor e-mailclients zonder HTML. */
export function getAdoptConfirmationText(params: AdoptConfirmationParams): string {
  const { recipientName, animalName } = params;
  const name = recipientName.trim() || "friend";
  const animal = animalName?.trim();

  let intro = `Dear ${name},\n\n`;
  if (animal) {
    intro += `We're so happy you're interested in ${animal}! Thank you for wanting to give them a forever home — we can't wait to help you both find each other.\n\n`;
  }
  intro += `We have received your adoption inquiry and our team will get back to you within 48 hours.\n\n`;
  intro += `We look forward to helping you find your new companion!\n\n`;
  intro += `With gratitude,\nThe Saved Souls Team\nKhon Kaen, Thailand\nhttps://www.savedsouls-foundation.com`;

  return intro;
}
