/**
 * HTML-body voor de notificatiemail naar de foundation (intern).
 * Zakelijke stijl, duidelijke gegevens aanvrager + dier, knop naar beheer.
 */

const BASE_URL = "https://www.savedsouls-foundation.org";
const GREEN = "#2aa348";
const GREEN_DARK = "#1e7a38";
const FOOTER_BG = "#1a3d2b";
const BTN_BG = "#1e40af";
const BTN_BG_DARK = "#1e3a8a";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type AdoptNotificationParams = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country: string;
  animalName?: string;
  animalId?: string;
  motivation: string;
};

export function getAdoptNotificationHtml(params: AdoptNotificationParams): string {
  const {
    name,
    email,
    phone = "",
    city = "",
    country,
    animalName = "",
    animalId = "",
    motivation,
  } = params;

  const n = escapeHtml(name.trim());
  const e = escapeHtml(email.trim());
  const p = phone.trim() ? escapeHtml(phone.trim()) : "";
  const c = city.trim() ? escapeHtml(city.trim()) : "";
  const co = escapeHtml(country.trim());
  const animal = animalName.trim() ? escapeHtml(animalName.trim()) : "";
  const aid = animalId.trim() ? escapeHtml(animalId.trim()) : "";
  const mot = escapeHtml(motivation.trim()).replace(/\n/g, "<br>");

  const adminUrl = `${BASE_URL}/admin?source=adopt&email=${encodeURIComponent(email.trim())}&name=${encodeURIComponent(name.trim())}${animal ? "&animal=" + encodeURIComponent(animalName.trim()) : ""}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuwe adoptieaanvraag</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; color: #334155;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
          <tr>
            <td style="background: linear-gradient(135deg, ${GREEN}, ${GREEN_DARK}); padding: 20px 24px;">
              <p style="margin:0; font-size: 13px; color: rgba(255,255,255,0.9);">Saved Souls Foundation – Intern</p>
              <h1 style="margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #ffffff;">Nieuwe adoptieaanvraag</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              ${animal ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; background-color: #f0fdf4; border-left: 4px solid ${GREEN}; border-radius: 6px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Aangevraagd dier</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${GREEN};">${animal}${aid ? ` <span style="font-weight: 500; color: #64748b;">(ID: ${aid})</span>` : ""}</p>
                  </td>
                </tr>
              </table>
              ` : ""}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.5;">
                <tr><td style="padding: 6px 0; color: #64748b; width: 120px;">Naam</td><td style="padding: 6px 0; font-weight: 600;">${n}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">E-mail</td><td style="padding: 6px 0;"><a href="mailto:${e}" style="color: ${GREEN}; text-decoration: none;">${e}</a></td></tr>
                ${p ? `<tr><td style="padding: 6px 0; color: #64748b;">Telefoon</td><td style="padding: 6px 0;">${p}</td></tr>` : ""}
                <tr><td style="padding: 6px 0; color: #64748b;">Land</td><td style="padding: 6px 0;">${co}</td></tr>
                ${c ? `<tr><td style="padding: 6px 0; color: #64748b;">Plaats</td><td style="padding: 6px 0;">${c}</td></tr>` : ""}
              </table>
              <p style="margin: 16px 0 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Motivatie / ervaring</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #334155; background: #f8fafc; padding: 12px; border-radius: 8px;">${mot || "—"}</p>
              <p style="margin: 0 0 12px 0;">
                <a href="${adminUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, ${BTN_BG}, ${BTN_BG_DARK}); color: #ffffff !important; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">Open beheer / Klant aanmaken</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">Link opent het beheerpaneel. Log in om aanvragen te bekijken of een gebruiker aan te maken.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: ${FOOTER_BG}; padding: 16px 24px; color: #ffffff; font-size: 12px;">
              <p style="margin: 0; color: rgba(255,255,255,0.85);">Saved Souls Foundation · Ban Khok Ngam, Ban Fang, Khon Kaen, Thailand</p>
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
