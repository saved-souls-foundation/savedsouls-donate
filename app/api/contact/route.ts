import { NextRequest, NextResponse } from "next/server";
import { sendMail, NOTIFICATION_EMAILS, delay } from "@/lib/sendMail";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEmailFooterHtml } from "@/lib/emailFooter";

const SUBJECT = "💌 New contact message - Saved Souls Foundation";
const REPLY_TO = "info@savedsouls-foundation.com";
/** Kopie auto-reply altijd naar dit adres (valt soms niet aan bij submitter). */
const AUTO_REPLY_CC = "kleinjansmike@gmail.com";

const ACCENT_GREEN = "#2aa348";
const BASE_URL = "https://www.savedsouls-foundation.com";
const CONTACT_EMAIL = "info@savedsouls-foundation.org";
const FOOTER_BG = "#1a3d2b";
/** Organisatienaam altijd in het Engels in de mail (nooit vertalen). */
const ORG_NAME = "Saved Souls Foundation";

/** Compacte footer: 4 hoofdsocials (optie B). */
const FOOTER_SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/SavedSoulsFoundation/" },
  { name: "Instagram", href: "https://www.instagram.com/savedsoulsfoundation" },
  { name: "YouTube", href: "https://www.youtube.com/@savedsoulsfoundation" },
  { name: "TikTok", href: "https://www.tiktok.com/@savedsoulsfoundation" },
];

type AutoReplyContent = {
  subject: string;
  title: string;
  /** Greeting zonder naam (bijv. "Beste,") */
  greeting: string;
  /** Prefix voor greeting mét naam (bijv. "Beste ") → "Beste [naam]," */
  greetingPrefix: string;
  body1: string;
  body2: string;
  buttonText: string;
  signature: string;
  /** Korte regel: "Voor adres en openingstijden: [link]" */
  contactPageHint: string;
  footerMission: string;
};

const AUTO_REPLY_I18N: Record<string, AutoReplyContent> = {
  en: {
    subject: "We received your message – Saved Souls Foundation",
    title: "We received your message",
    greeting: "Dear,",
    greetingPrefix: "Dear ",
    body1: "Thank you for contacting Saved Souls Foundation. We have received your message and will get back to you within 48 hours.",
    body2: "If your inquiry is urgent, you can also reach us at info@savedsouls-foundation.org.",
    buttonText: "Support our work – Donate",
    signature: "With gratitude, The Saved Souls Team, Khon Kaen, Thailand",
    contactPageHint: "For address, opening hours and phone:",
    footerMission: "Since 2010 we give broken souls a second chance — in Khon Kaen, Thailand.",
  },
  nl: {
    subject: "We hebben je bericht ontvangen – Saved Souls Foundation",
    title: "We hebben je bericht ontvangen",
    greeting: "Beste,",
    greetingPrefix: "Beste ",
    body1: "Bedankt voor je bericht aan Saved Souls Foundation. We hebben het ontvangen en nemen binnen 48 uur contact met je op.",
    body2: "Bij spoed kun je ons ook bereiken op info@savedsouls-foundation.org.",
    buttonText: "Steun ons werk – Doneer",
    signature: "Met dank, Het Saved Souls Team, Khon Kaen, Thailand",
    contactPageHint: "Voor adres, openingstijden en telefoon:",
    footerMission: "Sinds 2010 geven wij gebroken zielen een tweede kans — in Khon Kaen, Thailand.",
  },
  de: {
    subject: "Wir haben Ihre Nachricht erhalten – Saved Souls Foundation",
    title: "Wir haben Ihre Nachricht erhalten",
    greeting: "Guten Tag,",
    greetingPrefix: "Guten Tag, ",
    body1: "Vielen Dank für Ihre Kontaktaufnahme mit der Saved Souls Foundation. Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 48 Stunden.",
    body2: "Bei Dringlichkeit erreichen Sie uns auch unter info@savedsouls-foundation.org.",
    buttonText: "Unser Projekt unterstützen – Spenden",
    signature: "Mit Dank, Das Saved Souls Team, Khon Kaen, Thailand",
    contactPageHint: "Adresse, Öffnungszeiten und Telefon:",
    footerMission: "Seit 2010 geben wir gebrochenen Seelen eine zweite Chance — in Khon Kaen, Thailand.",
  },
  es: {
    subject: "Hemos recibido tu mensaje – Saved Souls Foundation",
    title: "Hemos recibido tu mensaje",
    greeting: "Estimado/a,",
    greetingPrefix: "Estimado/a ",
    body1: "Gracias por contactar con Saved Souls Foundation. Hemos recibido tu mensaje y te responderemos en 48 horas.",
    body2: "Si es urgente, también puedes escribirnos a info@savedsouls-foundation.org.",
    buttonText: "Apoya nuestro trabajo – Donar",
    signature: "Con gratitud, El equipo de Saved Souls, Khon Kaen, Tailandia",
    contactPageHint: "Dirección, horario y teléfono:",
    footerMission: "Desde 2010 damos una segunda oportunidad a almas rotas — en Khon Kaen, Tailandia.",
  },
  th: {
    subject: "เราได้รับข้อความของคุณแล้ว – Saved Souls Foundation",
    title: "เราได้รับข้อความของคุณแล้ว",
    greeting: "สวัสดีครับ/ค่ะ",
    greetingPrefix: "สวัสดีครับ/ค่ะ ",
    body1: "ขอบคุณที่ติดต่อ Saved Souls Foundation เราได้รับข้อความแล้วและจะติดต่อกลับภายใน 48 ชั่วโมง",
    body2: "หากเร่งด่วน สามารถติดต่อเราได้ที่ info@savedsouls-foundation.org",
    buttonText: "สนับสนุนเรา – บริจาค",
    signature: "ด้วยความขอบคุณ, ทีม Saved Souls, ขอนแก่น ประเทศไทย",
    contactPageHint: "ที่อยู่ เวลาเปิด และโทร:",
    footerMission: "ตั้งแต่ปี 2010 เราให้โอกาสที่สองกับดวงวิญญาณที่บาดเจ็บ — ที่ขอนแก่น ประเทศไทย",
  },
  ru: {
    subject: "Мы получили ваше сообщение – Saved Souls Foundation",
    title: "Мы получили ваше сообщение",
    greeting: "Дорогой,",
    greetingPrefix: "Дорогой ",
    body1: "Спасибо за обращение в Saved Souls Foundation. Мы получили ваше сообщение и ответим в течение 48 часов.",
    body2: "В срочных случаях пишите на info@savedsouls-foundation.org.",
    buttonText: "Поддержать нас – Пожертвовать",
    signature: "С благодарностью, команда Saved Souls, Кхонкэн, Таиланд",
    contactPageHint: "Адрес, часы работы и телефон:",
    footerMission: "С 2010 года мы даём сломанным душам второй шанс — в Кхонкэне, Таиланд.",
  },
};

function getAutoReplyContent(locale: string): AutoReplyContent {
  const lang = (locale || "en").slice(0, 2).toLowerCase();
  return AUTO_REPLY_I18N[lang] ?? AUTO_REPLY_I18N.en;
}

function getDonateUrl(locale: string): string {
  const lang = (locale || "en").slice(0, 2).toLowerCase();
  const supported = ["en", "nl", "de", "es", "th", "ru"];
  const seg = supported.includes(lang) ? lang : "en";
  return `${BASE_URL}/${seg}/donate`;
}

function getContactPageUrl(locale: string): string {
  const lang = (locale || "en").slice(0, 2).toLowerCase();
  const supported = ["en", "nl", "de", "es", "th", "ru"];
  const seg = supported.includes(lang) ? lang : "en";
  return `${BASE_URL}/${seg}/contact`;
}

const SUPPORTED_LOCALES = ["en", "nl", "de", "es", "th", "ru"] as const;

/** Bepaalt taal uit Referer-URL (bv. …/de/contact → "de") als fallback als body geen geldige locale stuurt. */
function getLocaleFromReferer(referer: string | null): string | null {
  if (!referer || typeof referer !== "string") return null;
  try {
    const url = new URL(referer);
    const path = url.pathname;
    const match = path.match(/^\/(en|nl|de|es|th|ru)(?:\/|$)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(name: string, email: string, subject: string, message: string): string {
  const subj = subject ? escapeHtml(subject) : "";
  const msg = escapeHtml(message).replace(/\n/g, "<br>");
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${ACCENT_GREEN};color:#fff;padding:20px 24px;">
    <h1 style="margin:0;font-size:20px;font-weight:600;">💌 New contact message</h1>
    <p style="margin:8px 0 0;opacity:0.95;font-size:14px;">Saved Souls Foundation</p>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#666;width:90px;">Name</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:${ACCENT_GREEN};">${escapeHtml(email)}</a></td></tr>
      ${subj ? `<tr><td style="padding:8px 0;color:#666;">Subject</td><td style="padding:8px 0;">${subj}</td></tr>` : ""}
    </table>
    <div style="margin-top:20px;padding-top:20px;border-top:1px solid #eee;">
      <p style="margin:0 0 8px;color:#666;font-size:13px;">Message</p>
      <div style="line-height:1.5;color:#333;">${msg}</div>
    </div>
  </div>
  ${getEmailFooterHtml()}
</div></body></html>`;
}

function getGreeting(content: AutoReplyContent, name: string | undefined): string {
  const n = (name ?? "").trim();
  return n ? `${content.greetingPrefix}${n},` : content.greeting;
}

function buildAutoReplyText(content: AutoReplyContent, locale: string, name?: string): string {
  const greeting = getGreeting(content, name);
  const contactPageUrl = getContactPageUrl(locale);
  const socialLine = FOOTER_SOCIALS.map((s) => `${s.name}: ${s.href}`).join(" · ");
  return `${greeting}

${content.body1}

${content.body2}

${content.signature}

---
${content.contactPageHint} ${contactPageUrl}

---
${ORG_NAME}
${content.footerMission}
${BASE_URL}
Follow us: ${socialLine}`;
}

function buildAutoReplyHtml(locale: string, includeDonateButton: boolean, name?: string): string {
  const c = getAutoReplyContent(locale);
  const greeting = getGreeting(c, name);
  const donateUrl = getDonateUrl(locale);
  const contactPageUrl = getContactPageUrl(locale);
  const contactLink = `<a href="mailto:${escapeHtml(CONTACT_EMAIL)}" style="color:${ACCENT_GREEN};">${escapeHtml(CONTACT_EMAIL)}</a>`;
  const body2Html = escapeHtml(c.body2).replace(escapeHtml(CONTACT_EMAIL), contactLink);
  const buttonBlock = includeDonateButton
    ? `<p style="margin:0 0 24px;">${body2Html}</p>
    <a href="${donateUrl}" style="display:inline-block;background:${ACCENT_GREEN};color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">${escapeHtml(c.buttonText)}</a>`
    : `<p style="margin:0 0 24px;">${body2Html}</p>`;
  const sigHtml = escapeHtml(c.signature).replace(/, /g, "<br>");
  const contactPageLinkHtml = `<a href="${escapeHtml(contactPageUrl)}" style="color:${ACCENT_GREEN};">${escapeHtml(contactPageUrl)}</a>`;
  const contactHintHtml = `${escapeHtml(c.contactPageHint)} ${contactPageLinkHtml}`;
  const socialLinksHtml = FOOTER_SOCIALS.map(
    (s) => `<a href="${escapeHtml(s.href)}" style="color:#fff;text-decoration:none;font-size:13px;opacity:0.9;">${escapeHtml(s.name)}</a>`
  ).join(" &nbsp;·&nbsp; ");
  const footerMissionHtml = escapeHtml(c.footerMission);
  const websiteLinkHtml = `<a href="${BASE_URL}" style="color:#fff;text-decoration:underline;opacity:0.95;">${escapeHtml(BASE_URL)}</a>`;
  return `<!DOCTYPE html><html><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${ACCENT_GREEN};color:#fff;padding:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:600;">${escapeHtml(c.title)}</h1>
    <p style="margin:10px 0 0;opacity:0.95;font-size:15px;">${escapeHtml(ORG_NAME)}</p>
  </div>
  <div style="padding:24px;line-height:1.6;color:#333;">
    <p style="margin:0 0 16px 0;text-align:center;">
      <img src="https://www.savedsouls-foundation.com/ourwork-1.webp" alt="Saved Souls Foundation" width="520" style="max-width:100%;height:auto;border-radius:12px;display:inline-block;" />
    </p>
    <p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
    <p style="margin:0 0 16px;">${escapeHtml(c.body1)}</p>
    ${buttonBlock}
  </div>
  <div style="padding:16px 24px;background:#f9f9f9;font-size:13px;color:#666;">
    ${sigHtml}
  </div>
  <div style="padding:12px 24px;border-top:1px solid #eee;font-size:13px;color:#555;">
    ${contactHintHtml}
  </div>
  <div style="background:${FOOTER_BG};color:#fff;padding:20px 24px;text-align:center;font-size:13px;">
    <p style="margin:0 0 4px;font-weight:600;">${escapeHtml(ORG_NAME)}</p>
    <p style="margin:0 0 10px;opacity:0.85;line-height:1.4;">${footerMissionHtml}</p>
    <p style="margin:0 0 12px;font-size:12px;">${websiteLinkHtml}</p>
    <p style="margin:0;font-size:12px;">${socialLinksHtml}</p>
  </div>
</div></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const valid = await verifyTurnstile(b.turnstileToken);
    if (!valid) {
      return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 400 });
    }
    const name = b.name?.trim();
    const email = b.email?.trim();
    const subject = b.subject?.trim() || "";
    const message = b.message?.trim();
    const fromBody = typeof b.locale === "string" ? b.locale.trim().slice(0, 2).toLowerCase() : "";
    const fromReferer = getLocaleFromReferer(req.headers.get("referer") ?? null);
    const validBody = fromBody && SUPPORTED_LOCALES.includes(fromBody as (typeof SUPPORTED_LOCALES)[number]);
    const validReferer = fromReferer && SUPPORTED_LOCALES.includes(fromReferer as (typeof SUPPORTED_LOCALES)[number]);
    const locale = validReferer ? fromReferer : validBody ? fromBody : fromReferer ?? fromBody ?? "en";
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }

    try {
      const admin = createAdminClient();
      await admin.from("incoming_emails").insert({
        van_email: email,
        van_naam: name,
        onderwerp: subject || null,
        inhoud: message,
        bron: "contact_formulier",
        status: "in_behandeling",
      });
    } catch (e) {
      console.error("[contact] incoming_emails insert failed", e);
    }

    const autoReplyContent = getAutoReplyContent(locale);
    const confirmationText = buildAutoReplyText(autoReplyContent, locale, name);

    const text =
      "Name: " +
      name +
      "\nEmail: " +
      email +
      (subject ? "\nSubject: " + subject : "") +
      "\n\n" +
      message;

    // Auto-reply in gekozen taal: bezoeker mét donatieknop, organisatie (Mike) zónder knop
    const autoReplyVisitor = await sendMail({
      to: email,
      subject: autoReplyContent.subject,
      text: confirmationText,
      html: buildAutoReplyHtml(locale, true, name),
      replyTo: REPLY_TO,
    });
    if (!autoReplyVisitor.success) {
      return NextResponse.json({ error: autoReplyVisitor.error || "Failed to send confirmation." }, { status: 502 });
    }
    if (email.toLowerCase() !== AUTO_REPLY_CC.toLowerCase()) {
      await delay(600);
      const autoReplyMike = await sendMail({
        to: AUTO_REPLY_CC,
        subject: autoReplyContent.subject,
        text: confirmationText,
        html: buildAutoReplyHtml(locale, false, name),
        replyTo: REPLY_TO,
      });
      if (!autoReplyMike.success) {
        return NextResponse.json({ error: autoReplyMike.error || "Failed to send confirmation copy." }, { status: 502 });
      }
    }

    // Resend: max 2 requests/sec – pauze tussen sends
    await delay(600);

    const notifHtml = buildNotificationHtml(name, email, subject, message);
    // Notificatie (ingevuld formulier) naar info@ + directe kopie naar Mike
    for (const to of NOTIFICATION_EMAILS) {
      const notif = await sendMail({
        to,
        subject: SUBJECT,
        text,
        html: notifHtml,
        replyTo: REPLY_TO,
      });
      if (!notif.success) {
        return NextResponse.json({ error: notif.error || "Failed to send email." }, { status: 502 });
      }
      await delay(600);
    }
    const notifMike = await sendMail({
      to: AUTO_REPLY_CC,
      subject: SUBJECT,
      text,
      html: notifHtml,
      replyTo: REPLY_TO,
    });
    if (!notifMike.success) {
      return NextResponse.json({ error: notifMike.error || "Failed to send notification." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
