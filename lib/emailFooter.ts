/**
 * Gedeelde e-mailfooter voor alle automatische mails: socials (aanklikbaar) + donate-knop.
 * Gebruik in contact-, volunteer-, donate-, adopt-notificaties en auto-replies.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.savedsouls-foundation.com";
const FOOTER_BG = "#1a3d2b";
const ACCENT_GREEN = "#2aa348";

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com/SavedSoulsFoundation/" },
  { name: "Instagram", href: "https://www.instagram.com/savedsoulsfoundation" },
  { name: "YouTube", href: "https://www.youtube.com/@savedsoulsfoundation" },
  { name: "X", href: "https://x.com/SoulsaversSSF" },
  { name: "TikTok", href: "https://www.tiktok.com/@savedsoulsfoundation" },
  { name: "Reddit", href: "https://www.reddit.com/user/SoulsaversSSF" },
];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Donate-URL met optionele locale (bv. /en/donate).
 */
function getDonateUrl(locale?: string): string {
  const seg = locale && ["en", "nl", "de", "es", "th", "ru"].includes(locale.slice(0, 2)) ? locale.slice(0, 2) : "en";
  return `${BASE_URL}/${seg}/donate`;
}

/**
 * HTML-fragment: footer met logo-regel, mission, social links (aanklikbaar) en donate-knop.
 * Inline styles voor e-mailclients. Kan in een bestaande table/card geplakt worden.
 */
export function getEmailFooterHtml(locale?: string): string {
  const donateUrl = getDonateUrl(locale);
  const socialHtml = SOCIAL_LINKS.map(
    (s) => `<a href="${escapeHtml(s.href)}" style="color:rgba(255,255,255,0.95);text-decoration:none;font-size:13px;margin:0 8px;">${escapeHtml(s.name)}</a>`
  ).join("");

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
  <tr>
    <td style="background-color:${FOOTER_BG};padding:24px 24px;text-align:center;">
      <p style="margin:0 0 6px 0;font-size:16px;font-weight:700;color:#ffffff;">Saved Souls Foundation</p>
      <p style="margin:0 0 16px 0;font-size:13px;line-height:1.4;color:rgba(255,255,255,0.88);">Ban Khok Ngam, Ban Fang, Khon Kaen, Thailand</p>
      <p style="margin:0 0 16px 0;font-size:12px;color:rgba(255,255,255,0.75);">Since 2010 we give broken souls a second chance.</p>
      <p style="margin:0 0 16px 0;font-size:13px;">
        <a href="${escapeHtml(BASE_URL)}" style="color:rgba(255,255,255,0.9);text-decoration:underline;">${escapeHtml(BASE_URL.replace(/^https?:\/\//, ""))}</a>
      </p>
      <p style="margin:0 0 12px 0;font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.08em;">Follow us</p>
      <p style="margin:0 0 20px 0;font-size:13px;">${socialHtml}</p>
      <a href="${escapeHtml(donateUrl)}" style="display:inline-block;padding:14px 28px;background-color:${ACCENT_GREEN};color:#ffffff !important;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">Donate – Support our animals</a>
      <p style="margin:20px 0 0 0;font-size:11px;color:rgba(255,255,255,0.5);">© ${new Date().getFullYear()} Saved Souls Foundation</p>
    </td>
  </tr>
</table>`.trim();
}

/**
 * Plain-textversie voor fallback / multipart.
 */
export function getEmailFooterText(locale?: string): string {
  const donateUrl = getDonateUrl(locale);
  const socialLine = SOCIAL_LINKS.map((s) => `${s.name}: ${s.href}`).join("\n");
  return `

---
Saved Souls Foundation
Ban Khok Ngam, Ban Fang, Khon Kaen, Thailand
Since 2010 we give broken souls a second chance.
${BASE_URL}

Follow us:
${socialLine}

Donate and support our animals: ${donateUrl}

© ${new Date().getFullYear()} Saved Souls Foundation`;
}
