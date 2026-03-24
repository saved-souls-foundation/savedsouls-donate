/**
 * E-mail huisstijl voor alle auto-reply en notificatiemails:
 * header (brandkleur), body, website-link, donatieknop, footer met socials (max 4).
 */
const BRAND_COLOR = "#2aa348";
const FOOTER_BG = "#1a3d2b";
const ORG_NAME = "Saved Souls Foundation";
export const EMAIL_BASE_URL = "https://www.savedsouls-foundation.org";

/** Max 4 socials voor in de footer (Facebook, Instagram, TikTok, YouTube). */
export const EMAIL_SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/SavedSoulsFoundation/" },
  { name: "Instagram", href: "https://www.instagram.com/savedsoulsfoundation" },
  { name: "TikTok", href: "https://www.tiktok.com/@savedsoulsfoundation" },
  { name: "YouTube", href: "https://www.youtube.com/@savedsoulsfoundation" },
] as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type WrapAutoReplyOptions = {
  bodyHtml: string;
  bodyText?: string;
  title?: string;
  /** Of de donatieknop getoond wordt (standaard true voor bezoeker-mails). */
  includeDonateButton?: boolean;
  /** Donate-URL; indien niet gezet en includeDonateButton true, wordt /{locale}/donate gebruikt. */
  donateUrl?: string;
  /** Voor donateUrl: bv. "nl", "en". Alleen nodig als donateUrl niet wordt meegegeven. */
  locale?: string;
  /** Korte mission in footer (optioneel). */
  footerMission?: string;
};

function getDonateUrl(locale?: string): string {
  const seg = locale && ["nl", "en", "de", "es", "th", "ru", "fr"].includes(locale) ? locale : "en";
  return `${EMAIL_BASE_URL}/${seg}/donate`;
}

/**
 * Bouwt volledige auto-reply HTML + plain text in huisstijl:
 * header (brand), body, optionele donatieknop, footer met website + max 4 socials.
 */
export function wrapAutoReplyEmail(options: WrapAutoReplyOptions): { html: string; text: string } {
  const {
    bodyHtml,
    bodyText,
    title = ORG_NAME,
    includeDonateButton = true,
    donateUrl: customDonateUrl,
    locale,
    footerMission = "Since 2010 we give broken souls a second chance — in Khon Kaen, Thailand.",
  } = options;

  const donateUrl = customDonateUrl ?? getDonateUrl(locale);
  const websiteLinkHtml = `<a href="${escapeHtml(EMAIL_BASE_URL)}" style="color:rgba(255,255,255,0.95);text-decoration:underline;">${escapeHtml(EMAIL_BASE_URL.replace(/^https?:\/\//, ""))}</a>`;
  const socialLinksHtml = EMAIL_SOCIALS.map(
    (s) =>
      `<a href="${escapeHtml(s.href)}" style="color:rgba(255,255,255,0.9);text-decoration:none;font-size:13px;margin-right:12px;">${escapeHtml(s.name)}</a>`
  ).join("");

  const donateBlock =
    includeDonateButton &&
    `<p style="margin:24px 0 0 0;font-size:15px;color:#475569;">Support our work:</p>
     <p style="margin:8px 0 0 0;"><a href="${escapeHtml(donateUrl)}" style="display:inline-block;padding:14px 28px;background:${BRAND_COLOR};color:#fff !important;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;">Donate</a></p>`;

  const header = `
    <div style="background:${BRAND_COLOR};color:#fff;padding:20px 24px;font-family:sans-serif;">
      <p style="margin:0;font-size:14px;opacity:0.95;">♥ ${escapeHtml(ORG_NAME)} ♥</p>
      <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:700;">${escapeHtml(title)}</h1>
    </div>`;

  const footer = `
    <div style="background:${FOOTER_BG};color:#fff;padding:20px 24px;font-family:sans-serif;margin-top:24px;">
      <p style="margin:0 0 6px 0;font-weight:600;font-size:15px;">${escapeHtml(ORG_NAME)}</p>
      <p style="margin:0 0 10px 0;font-size:13px;line-height:1.4;opacity:0.9;">${escapeHtml(footerMission)}</p>
      <p style="margin:0 0 12px 0;font-size:13px;">${websiteLinkHtml}</p>
      <p style="margin:0 0 6px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;opacity:0.8;">Follow us</p>
      <p style="margin:0;font-size:13px;">${socialLinksHtml}</p>
    </div>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:sans-serif;background:#f1f5f9;color:#1e293b;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    ${header}
    <div style="padding:24px;line-height:1.6;">
      ${bodyHtml}
      ${donateBlock || ""}
    </div>
    ${footer}
  </div>
</body>
</html>`.trim();

  const text =
    bodyText ??
    bodyHtml.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

  return { html, text };
}

/**
 * Eenvoudige wrapper: alleen header + body + footer (zonder donatieknop/socials-detail).
 * Gebruikt voor stap-notificaties die wrapAutoReplyEmail kunnen gebruiken voor volledige huisstijl.
 */
export function wrapEmailWithHeaderFooter(options: {
  bodyHtml: string;
  bodyText?: string;
  title?: string;
}): { html: string; text: string } {
  return wrapAutoReplyEmail({
    ...options,
    includeDonateButton: true,
    title: options.title ?? "Saved Souls Foundation",
  });
}
