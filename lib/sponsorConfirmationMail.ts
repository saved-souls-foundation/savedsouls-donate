import { sendMail } from "@/lib/sendMail";
import { getEmailFooterHtml, getEmailFooterText } from "@/lib/emailFooter";

const GREEN = "#2aa348";
const DONORBOX_BASE =
  "https://donorbox.org/saved-souls-foundation-donation?amount=10&recurring=true&currency=eur";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.savedsouls-foundation.com";

const FROM_ADDRESS = "Saved Souls Foundation <info@savedsouls-foundation.com>";

export type SponsorMailLocale = "nl" | "en" | "de" | "fr" | "es" | "th" | "ru";

export type SendSponsorConfirmationMailOptions = {
  to: string;
  donorName: string;
  animalName: string;
  animalType: "dog" | "cat";
  animalId: string;
  /** Optioneel: foto-URL van het dier (client kan later meesturen). */
  animalImageUrl?: string | null;
  locale?: string;
};

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeLocale(raw?: string): SponsorMailLocale {
  const code = (raw ?? "en").slice(0, 2).toLowerCase();
  if (code === "nl" || code === "en" || code === "de" || code === "fr" || code === "es" || code === "th" || code === "ru") {
    return code;
  }
  return "en";
}

function getLocalePathSegment(locale: SponsorMailLocale): string {
  return locale;
}

function buildAnimalPageUrl(locale: SponsorMailLocale, animalType: "dog" | "cat", animalId: string): string {
  const seg = getLocalePathSegment(locale);
  return `${SITE_URL}/${seg}/sponsor/${animalType}/${animalId}`;
}

function buildDonorboxUrl(animalName: string): string {
  const comment = encodeURIComponent(`Sponsor ${animalName}`);
  return `${DONORBOX_BASE}&comment=${comment}`;
}

type Copy = {
  subject: string;
  greeting: string;
  story: string;
  ctaButton: string;
  moreWaysTitle: string;
  moreDonate: string;
  moreVolunteer: string;
  moreAdopt: string;
  morePress: string;
  socialTitle: string;
  socialIntro: string;
  closingHtml: string;
  closingText: string;
};

const COPY: Record<SponsorMailLocale, Copy> = {
  nl: {
    subject: "Dank je wel — je sponsort {animal}! 🐾",
    greeting: "Beste {donor},",
    story:
      "Wat fijn dat je {animal} een warme plek in je hart geeft. Jouw steun helpt ons om voer, medische zorg en een veilig thuis te bieden — elke dag opnieuw. Samen maken we het verschil voor dit dier in Khon Kaen, Thailand.",
    ctaButton: "Rond sponsoring af",
    moreWaysTitle: "Nog meer manieren om te helpen",
    moreDonate: "Meer doneren",
    moreVolunteer: "Vrijwilliger worden",
    moreAdopt: "Adopteer een dier",
    morePress: "Pers & media",
    socialTitle: "Deel je steun — kant-en-klare teksten",
    socialIntro: "Kopieer de tekst en plak op je favoriete platform (naam en link zijn al ingevuld).",
    closingHtml:
      "Met warme groet,<br><strong>Melanie de Wit</strong> &amp; het <strong>Saved Souls Team</strong>",
    closingText:
      "Met warme groet,\nMelanie de Wit & het Saved Souls Team",
  },
  en: {
    subject: "Thank you — you're sponsoring {animal}! 🐾",
    greeting: "Dear {donor},",
    story:
      "Thank you for opening your heart to {animal}. Your support helps us provide food, medical care, and a safe home — every single day. Together we make a real difference for this animal at our sanctuary in Khon Kaen, Thailand.",
    ctaButton: "Complete your sponsorship",
    moreWaysTitle: "More ways to help",
    moreDonate: "Donate more",
    moreVolunteer: "Volunteer with us",
    moreAdopt: "Adopt an animal",
    morePress: "Press & media",
    socialTitle: "Share your support — ready-to-use texts",
    socialIntro: "Copy the text and paste on your favourite platform (name and link are filled in).",
    closingHtml:
      "With warm regards,<br><strong>Melanie de Wit</strong> &amp; the <strong>Saved Souls Team</strong>",
    closingText:
      "With warm regards,\nMelanie de Wit & the Saved Souls Team",
  },
  de: {
    subject: "Danke — du sponserst {animal}! 🐾",
    greeting: "Liebe/r {donor},",
    story:
      "Schön, dass du {animal} einen Platz in deinem Herzen gibst. Deine Unterstützung hilft uns, Futter, medizinische Versorgung und ein sicheres Zuhause zu finanzieren — Tag für Tag. Gemeinsam machen wir für dieses Tier in Khon Kaen, Thailand, einen Unterschied.",
    ctaButton: "Sponsoring abschließen",
    moreWaysTitle: "Weitere Möglichkeiten zu helfen",
    moreDonate: "Mehr spenden",
    moreVolunteer: "Freiwillige/r werden",
    moreAdopt: "Ein Tier adoptieren",
    morePress: "Presse & Medien",
    socialTitle: "Teile deine Unterstützung — fertige Texte",
    socialIntro: "Text kopieren und auf deiner Plattform einfügen (Name und Link sind eingetragen).",
    closingHtml:
      "Herzliche Grüße,<br><strong>Melanie de Wit</strong> &amp; das <strong>Saved Souls Team</strong>",
    closingText:
      "Herzliche Grüße,\nMelanie de Wit & das Saved Souls Team",
  },
  fr: {
    subject: "Merci — tu parraines {animal}! 🐾",
    greeting: "Bonjour {donor},",
    story:
      "Merci d’offrir une place dans ton cœur à {animal}. Ton soutien nous aide à fournir nourriture, soins vétérinaires et un foyer sûr — chaque jour. Ensemble, nous faisons la différence pour cet animal à Khon Kaen, Thaïlande.",
    ctaButton: "Finaliser le parrainage",
    moreWaysTitle: "D’autres façons d’aider",
    moreDonate: "Faire un don",
    moreVolunteer: "Devenir bénévole",
    moreAdopt: "Adopter un animal",
    morePress: "Presse & médias",
    socialTitle: "Partage ton soutien — textes prêts à l’emploi",
    socialIntro: "Copie le texte et colle-le sur ton réseau (nom et lien déjà remplis).",
    closingHtml:
      "Bien à toi,<br><strong>Melanie de Wit</strong> &amp; l’équipe <strong>Saved Souls</strong>",
    closingText:
      "Bien à toi,\nMelanie de Wit & l’équipe Saved Souls",
  },
  es: {
    subject: "Gracias — ¡estás patrocinando a {animal}! 🐾",
    greeting: "Hola {donor},",
    story:
      "Gracias por abrir tu corazón a {animal}. Tu apoyo nos ayuda a ofrecer comida, atención veterinaria y un hogar seguro — cada día. Juntos marcamos la diferencia para este animal en Khon Kaen, Tailandia.",
    ctaButton: "Completar el patrocinio",
    moreWaysTitle: "Más formas de ayudar",
    moreDonate: "Donar más",
    moreVolunteer: "Ser voluntario/a",
    moreAdopt: "Adoptar un animal",
    morePress: "Prensa y medios",
    socialTitle: "Comparte tu apoyo — textos listos",
    socialIntro: "Copia el texto y pégalo en tu red (nombre y enlace ya incluidos).",
    closingHtml:
      "Un abrazo,<br><strong>Melanie de Wit</strong> y el <strong>equipo Saved Souls</strong>",
    closingText:
      "Un abrazo,\nMelanie de Wit y el equipo Saved Souls",
  },
  th: {
    subject: "ขอบคุณ — คุณกำลังสนับสนุน {animal}! 🐾",
    greeting: "สวัสดีคุณ {donor},",
    story:
      "ขอบคุณที่เปิดใจให้ {animal} การสนับสนุนของคุณช่วยให้เรามีอาหาร การรักษาพยาบาล และบ้านที่ปลอดภัย — ทุกวัน เราจะสร้างความเปลี่ยนแปลงร่วมกันสำหรับสัตว์ตัวนี้ที่คอนแก่น ประเทศไทย",
    ctaButton: "ดำเนินการสปอนเซอร์ให้เสร็จ",
    moreWaysTitle: "วิธีช่วยเหลือเพิ่มเติม",
    moreDonate: "บริจาคเพิ่ม",
    moreVolunteer: "เป็นอาสาสมัคร",
    moreAdopt: "รับอุปการะสัตว์",
    morePress: "สื่อและข่าวประชาสัมพันธ์",
    socialTitle: "แชร์การสนับสนุน — ข้อความพร้อมใช้",
    socialIntro: "คัดลอกข้อความไปวางบนแพลตฟอร์มของคุณ (ชื่อและลิงก์ใส่ให้แล้ว)",
    closingHtml:
      "ด้วยความอบอุ่น<br><strong>Melanie de Wit</strong> และทีม <strong>Saved Souls</strong>",
    closingText:
      "ด้วยความอบอุ่น\nMelanie de Wit และทีม Saved Souls",
  },
  ru: {
    subject: "Спасибо — вы спонсируете {animal}! 🐾",
    greeting: "Здравствуйте, {donor}!",
    story:
      "Спасибо, что открыли сердце для {animal}. Ваша поддержка помогает нам обеспечивать корм, ветеринарную помощь и безопасный дом — каждый день. Вместе мы меняем жизнь этого животного в Кхонкэне, Таиланд.",
    ctaButton: "Завершить спонсорство",
    moreWaysTitle: "Ещё способы помочь",
    moreDonate: "Пожертвовать ещё",
    moreVolunteer: "Стать волонтёром",
    moreAdopt: "Усыновить животное",
    morePress: "Пресса и СМИ",
    socialTitle: "Поделитесь поддержкой — готовые тексты",
    socialIntro: "Скопируйте текст и вставьте в соцсеть (имя и ссылка уже подставлены).",
    closingHtml:
      "С теплом,<br><strong>Melanie de Wit</strong> и команда <strong>Saved Souls</strong>",
    closingText:
      "С теплом,\nMelanie de Wit и команда Saved Souls",
  },
};

function fill(template: string, donor: string, animal: string): string {
  return template.replace(/\{donor\}/g, donor).replace(/\{animal\}/g, animal);
}

export function getSponsorConfirmationSubject(locale: SponsorMailLocale, animalName: string): string {
  return fill(COPY[locale].subject, "", animalName);
}

type SocialPlatform = {
  key: string;
  /** Korte label in de mail (Engels is ok voor herkenning). */
  label: string;
  /** Genereert platte tekst voor kopiëren. */
  buildText: (args: { animal: string; url: string; locale: SponsorMailLocale }) => string;
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: "facebook",
    label: "Facebook",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Ik steun ${animal} bij Saved Souls Foundation! 🐾 Meer info: ${url}`,
        en: `I'm supporting ${animal} at Saved Souls Foundation! 🐾 Learn more: ${url}`,
        de: `Ich unterstütze ${animal} bei der Saved Souls Foundation! 🐾 Mehr Infos: ${url}`,
        fr: `Je soutiens ${animal} chez Saved Souls Foundation! 🐾 En savoir plus : ${url}`,
        es: `¡Apoyo a ${animal} en Saved Souls Foundation! 🐾 Más info: ${url}`,
        th: `ฉันสนับสนุน ${animal} ที่ Saved Souls Foundation! 🐾 ดูเพิ่มเติม: ${url}`,
        ru: `Я поддерживаю ${animal} в Saved Souls Foundation! 🐾 Подробнее: ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "instagram",
    label: "Instagram",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Steun voor ${animal} 🐾 @savedsoulsfoundation — ${url}`,
        en: `Supporting ${animal} 🐾 @savedsoulsfoundation — ${url}`,
        de: `Unterstützung für ${animal} 🐾 @savedsoulsfoundation — ${url}`,
        fr: `Soutien pour ${animal} 🐾 @savedsoulsfoundation — ${url}`,
        es: `Apoyo a ${animal} 🐾 @savedsoulsfoundation — ${url}`,
        th: `สนับสนุน ${animal} 🐾 @savedsoulsfoundation — ${url}`,
        ru: `Поддержка ${animal} 🐾 @savedsoulsfoundation — ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "tiktok",
    label: "TikTok",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Ik sponsor ${animal} bij Saved Souls in Thailand! Link in bio idee: ${url} #savedsouls #dieren`,
        en: `I'm sponsoring ${animal} at Saved Souls in Thailand! ${url} #savedsouls #animals`,
        de: `Ich sponser ${animal} bei Saved Souls in Thailand! ${url} #savedsouls #tiere`,
        fr: `Je parraine ${animal} chez Saved Souls en Thaïlande ! ${url} #savedsouls #animaux`,
        es: `¡Patrocino a ${animal} en Saved Souls, Tailandia! ${url} #savedsouls #animales`,
        th: `สปอนเซอร์ ${animal} ที่ Saved Souls ในประเทศไทย! ${url} #savedsouls`,
        ru: `Спонсирую ${animal} в Saved Souls, Таиланд! ${url} #savedsouls`,
      };
      return lines[locale];
    },
  },
  {
    key: "x",
    label: "X",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Steun ${animal} bij @SoulsaversSSF — Saved Souls Foundation 🐾 ${url}`,
        en: `Support ${animal} at @SoulsaversSSF — Saved Souls Foundation 🐾 ${url}`,
        de: `Unterstütze ${animal} bei @SoulsaversSSF — Saved Souls Foundation 🐾 ${url}`,
        fr: `Soutenez ${animal} via @SoulsaversSSF — Saved Souls Foundation 🐾 ${url}`,
        es: `Apoya a ${animal} en @SoulsaversSSF — Saved Souls Foundation 🐾 ${url}`,
        th: `สนับสนุน ${animal} ที่ @SoulsaversSSF — Saved Souls Foundation 🐾 ${url}`,
        ru: `Поддержите ${animal}: @SoulsaversSSF — Saved Souls Foundation 🐾 ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "reddit",
    label: "Reddit",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Ik sponsor ${animal} bij een dierenopvang in Thailand (Saved Souls Foundation). Meer info: ${url}`,
        en: `I'm sponsoring ${animal} at an animal sanctuary in Thailand (Saved Souls Foundation). More info: ${url}`,
        de: `Ich sponser ${animal} bei einem Tierheim in Thailand (Saved Souls Foundation). Infos: ${url}`,
        fr: `Je parraine ${animal} dans un refuge en Thaïlande (Saved Souls Foundation). Infos : ${url}`,
        es: `Patrocino a ${animal} en un santuario en Tailandia (Saved Souls Foundation). Info: ${url}`,
        th: `สปอนเซอร์ ${animal} ที่ศูนย์พักพิงในประเทศไทย (Saved Souls Foundation) ${url}`,
        ru: `Спонсирую ${animal} в приюте в Таиланде (Saved Souls Foundation). Подробнее: ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Ik steun net ${animal} bij Saved Souls Foundation in Thailand. Kijk mee: ${url}`,
        en: `I'm supporting ${animal} at Saved Souls Foundation in Thailand. Have a look: ${url}`,
        de: `Ich unterstütze gerade ${animal} bei Saved Souls Foundation in Thailand. Schau mal: ${url}`,
        fr: `Je soutiens ${animal} chez Saved Souls Foundation en Thaïlande. À voir : ${url}`,
        es: `Estoy apoyando a ${animal} en Saved Souls Foundation (Tailandia). Mira: ${url}`,
        th: `กำลังสนับสนุน ${animal} ที่ Saved Souls Foundation ในประเทศไทย ดูที่: ${url}`,
        ru: `Поддерживаю ${animal} в Saved Souls Foundation, Таиланд. Ссылка: ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "telegram",
    label: "Telegram",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `${animal} — Saved Souls Foundation 🐾 ${url}`,
        en: `${animal} — Saved Souls Foundation 🐾 ${url}`,
        de: `${animal} — Saved Souls Foundation 🐾 ${url}`,
        fr: `${animal} — Saved Souls Foundation 🐾 ${url}`,
        es: `${animal} — Saved Souls Foundation 🐾 ${url}`,
        th: `${animal} — Saved Souls Foundation 🐾 ${url}`,
        ru: `${animal} — Saved Souls Foundation 🐾 ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "snapchat",
    label: "Snapchat",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Sponsor ${animal} 🐾 | savedsouls-foundation.com | ${url}`,
        en: `Sponsoring ${animal} 🐾 | savedsouls-foundation.com | ${url}`,
        de: `Sponsor ${animal} 🐾 | savedsouls-foundation.com | ${url}`,
        fr: `Parrainage ${animal} 🐾 | savedsouls-foundation.com | ${url}`,
        es: `Patrocinio ${animal} 🐾 | savedsouls-foundation.com | ${url}`,
        th: `สปอนเซอร์ ${animal} 🐾 | savedsouls-foundation.com | ${url}`,
        ru: `Спонсор ${animal} 🐾 | savedsouls-foundation.com | ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "youtube",
    label: "YouTube",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Ik sponsor ${animal} bij Saved Souls Foundation — een opvang in Thailand. Meer weten: ${url}`,
        en: `I'm sponsoring ${animal} at Saved Souls Foundation — a sanctuary in Thailand. Learn more: ${url}`,
        de: `Ich sponser ${animal} bei Saved Souls Foundation — Tierheim in Thailand. Mehr: ${url}`,
        fr: `Je parraine ${animal} chez Saved Souls Foundation — refuge en Thaïlande. Infos : ${url}`,
        es: `Patrocino a ${animal} en Saved Souls Foundation — santuario en Tailandia. Info: ${url}`,
        th: `สปอนเซอร์ ${animal} ที่ Saved Souls Foundation ในประเทศไทย ดูเพิ่ม: ${url}`,
        ru: `Спонсирую ${animal} в Saved Souls Foundation — приют в Таиланде. ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "pinterest",
    label: "Pinterest",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Steun ${animal} — Saved Souls Foundation, Thailand 🐾 ${url}`,
        en: `Support ${animal} — Saved Souls Foundation, Thailand 🐾 ${url}`,
        de: `Unterstütze ${animal} — Saved Souls Foundation, Thailand 🐾 ${url}`,
        fr: `Soutenez ${animal} — Saved Souls Foundation, Thaïlande 🐾 ${url}`,
        es: `Apoya a ${animal} — Saved Souls Foundation, Tailandia 🐾 ${url}`,
        th: `สนับสนุน ${animal} — Saved Souls Foundation ประเทศไทย 🐾 ${url}`,
        ru: `Поддержите ${animal} — Saved Souls Foundation, Таиланд 🐾 ${url}`,
      };
      return lines[locale];
    },
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    buildText: ({ animal, url, locale }) => {
      const lines: Record<SponsorMailLocale, string> = {
        nl: `Ik ondersteun het welzijn van ${animal} via Saved Souls Foundation (dierenopvang, Khon Kaen, Thailand). Meer informatie: ${url}`,
        en: `I'm supporting the welfare of ${animal} through Saved Souls Foundation (animal sanctuary, Khon Kaen, Thailand). More information: ${url}`,
        de: `Ich unterstütze das Wohlergehen von ${animal} über die Saved Souls Foundation (Tierheim, Khon Kaen, Thailand). Infos: ${url}`,
        fr: `Je soutiens le bien-être de ${animal} via Saved Souls Foundation (refuge, Khon Kaen, Thaïlande). Infos : ${url}`,
        es: `Apoyo el bienestar de ${animal} a través de Saved Souls Foundation (santuario, Khon Kaen, Tailandia). Más info: ${url}`,
        th: `สนับสนุนสวัสดิภาพของ ${animal} ผ่าน Saved Souls Foundation (คอนแก่น ประเทศไทย) ${url}`,
        ru: `Поддерживаю благополучие ${animal} через Saved Souls Foundation (приют, Кхонкэн, Таиланд). ${url}`,
      };
      return lines[locale];
    },
  },
];

function buildSocialBlocksHtml(
  locale: SponsorMailLocale,
  animalName: string,
  shareUrl: string
): string {
  const parts = SOCIAL_PLATFORMS.map((p) => {
    const plain = p.buildText({ animal: animalName, url: shareUrl, locale });
    const escPlain = escapeHtml(plain);
    return `<p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#334155;">${escapeHtml(p.label)}</p>
<pre style="margin:0 0 20px 0;padding:12px;background:#f1f5f9;border-radius:8px;font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word;color:#1e293b;font-family:ui-monospace,monospace;">${escPlain}</pre>`;
  });
  return parts.join("");
}

function buildSocialBlocksText(locale: SponsorMailLocale, animalName: string, shareUrl: string): string {
  return SOCIAL_PLATFORMS.map((p) => {
    const plain = p.buildText({ animal: animalName, url: shareUrl, locale });
    return `${p.label}:\n${plain}\n`;
  }).join("\n");
}

export function buildSponsorConfirmationHtml(params: {
  donorName: string;
  animalName: string;
  animalType: "dog" | "cat";
  animalId: string;
  animalImageUrl?: string | null;
  locale: SponsorMailLocale;
}): string {
  const { donorName, animalName, animalType, animalId, animalImageUrl, locale } = params;
  const copy = COPY[locale];
  const seg = getLocalePathSegment(locale);
  const donateUrl = `${SITE_URL}/${seg}/donate`;
  const volunteerUrl = `${SITE_URL}/${seg}/volunteer`;
  const adoptUrl = `${SITE_URL}/${seg}/adopt`;
  const pressUrl = `${SITE_URL}/${seg}/press`;
  const donorboxUrl = buildDonorboxUrl(animalName);
  const shareUrl = buildAnimalPageUrl(locale, animalType, animalId);

  const greeting = fill(copy.greeting, donorName, animalName);
  const story = fill(copy.story, donorName, animalName);

  const resolvedImage = animalImageUrl && animalImageUrl.trim().length > 0
    ? animalImageUrl.trim()
    : "https://www.savedsouls-foundation.com/ourwork-1.webp";

  const imageBlock = `<p style="margin:0 0 16px 0;text-align:center;">
  <img src="${escapeHtml(resolvedImage)}" alt="${escapeHtml(animalName)}" width="520" style="max-width:100%;height:auto;border-radius:12px;display:inline-block;" />
</p>`;

  const moreRow = (emoji: string, label: string, href: string) =>
    `<tr>
  <td style="padding:8px 0;font-size:15px;">
    <a href="${escapeHtml(href)}" style="color:${GREEN};text-decoration:none;font-weight:600;">${emoji} ${escapeHtml(label)}</a>
  </td>
</tr>`;

  const socialHtml = buildSocialBlocksHtml(locale, animalName, shareUrl);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;font-family:sans-serif;background:#f5f5f5;padding:24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="background:${GREEN};color:#fff;padding:24px;">
    <h1 style="margin:0;font-size:22px;font-weight:600;">Saved Souls Foundation</h1>
    <p style="margin:10px 0 0;opacity:0.95;font-size:15px;">${escapeHtml(animalName)}</p>
  </div>
  <div style="padding:24px;line-height:1.6;color:#333;">
    ${imageBlock}
    <p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
    <p style="margin:0 0 20px;">${escapeHtml(story)}</p>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="${escapeHtml(donorboxUrl)}" style="display:inline-block;padding:14px 28px;background:${GREEN};color:#ffffff !important;font-size:16px;font-weight:600;text-decoration:none;border-radius:10px;">${escapeHtml(copy.ctaButton)}</a>
    </p>
    <h2 style="margin:28px 0 12px;font-size:18px;color:#1e293b;">${escapeHtml(copy.moreWaysTitle)}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${moreRow("❤️", copy.moreDonate, donateUrl)}
      ${moreRow("🙋", copy.moreVolunteer, volunteerUrl)}
      ${moreRow("🐕", copy.moreAdopt, adoptUrl)}
      ${moreRow("📰", copy.morePress, pressUrl)}
    </table>
    <h2 style="margin:28px 0 8px;font-size:18px;color:#1e293b;">${escapeHtml(copy.socialTitle)}</h2>
    <p style="margin:0 0 16px;font-size:14px;color:#64748b;">${escapeHtml(copy.socialIntro)}</p>
    ${socialHtml}
    <p style="margin:24px 0 0;">${copy.closingHtml}</p>
  </div>
  ${getEmailFooterHtml(locale)}
</div></body></html>`;
}

export function buildSponsorConfirmationText(params: {
  donorName: string;
  animalName: string;
  animalType: "dog" | "cat";
  animalId: string;
  locale: SponsorMailLocale;
}): string {
  const { donorName, animalName, animalType, animalId, locale } = params;
  const copy = COPY[locale];
  const seg = getLocalePathSegment(locale);
  const donateUrl = `${SITE_URL}/${seg}/donate`;
  const volunteerUrl = `${SITE_URL}/${seg}/volunteer`;
  const adoptUrl = `${SITE_URL}/${seg}/adopt`;
  const pressUrl = `${SITE_URL}/${seg}/press`;
  const donorboxUrl = buildDonorboxUrl(animalName);
  const shareUrl = buildAnimalPageUrl(locale, animalType, animalId);

  const greeting = fill(copy.greeting, donorName, animalName);
  const story = fill(copy.story, donorName, animalName);
  const socialText = buildSocialBlocksText(locale, animalName, shareUrl);

  return [
    greeting,
    "",
    story,
    "",
    `${copy.ctaButton}: ${donorboxUrl}`,
    "",
    copy.moreWaysTitle,
    `❤️ ${copy.moreDonate}: ${donateUrl}`,
    `🙋 ${copy.moreVolunteer}: ${volunteerUrl}`,
    `🐕 ${copy.moreAdopt}: ${adoptUrl}`,
    `📰 ${copy.morePress}: ${pressUrl}`,
    "",
    copy.socialTitle,
    copy.socialIntro,
    "",
    socialText,
    "",
    copy.closingText,
    getEmailFooterText(locale),
  ].join("\n");
}

/**
 * Verstuurt de sponsorbevestiging naar het e-mailadres van de donor.
 */
export async function sendSponsorConfirmationMail(
  options: SendSponsorConfirmationMailOptions
): Promise<{ success: boolean; error?: string }> {
  const locale = normalizeLocale(options.locale);
  const subject = getSponsorConfirmationSubject(locale, options.animalName);
  const html = buildSponsorConfirmationHtml({
    donorName: options.donorName.trim(),
    animalName: options.animalName.trim(),
    animalType: options.animalType,
    animalId: options.animalId,
    animalImageUrl: options.animalImageUrl,
    locale,
  });
  const text = buildSponsorConfirmationText({
    donorName: options.donorName.trim(),
    animalName: options.animalName.trim(),
    animalType: options.animalType,
    animalId: options.animalId,
    locale,
  });

  return sendMail({
    from: FROM_ADDRESS,
    to: options.to.trim().toLowerCase(),
    subject,
    text,
    html,
    replyTo: "info@savedsouls-foundation.com",
  });
}
