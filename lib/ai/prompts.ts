/**
 * Prompts voor e-mailclassificatie en -antwoorden (Saved Souls Foundation).
 */

const MAX_BODY_CLASSIFY = 600;
const MAX_BODY_REPLY = 800;

export function EMAIL_CLASSIFY_PROMPT(emailBody: string, emailSubject: string): string {
  const bodySnippet = (emailBody || "").slice(0, MAX_BODY_CLASSIFY);
  return `Classificeer deze e-mail. Antwoord ALLEEN met geldige JSON, geen markdown of uitleg.

Onderwerp: ${emailSubject}
Inhoud: ${bodySnippet}

Antwoord in dit exacte formaat:
{"category": "adoptie|donatie|vrijwilliger|ziek_dier|algemeen|spam", "urgency": "hoog|normaal|laag", "language": "nl|en|th|de|fr|other"}`;
}

export function EMAIL_REPLY_PROMPT(
  emailBody: string,
  category: string,
  detectedLanguage: string,
  animalName?: string
): string {
  const bodySnippet = (emailBody || "").slice(0, MAX_BODY_REPLY);
  const langNote =
    detectedLanguage === "nl"
      ? "Nederlands"
      : detectedLanguage === "en"
        ? "Engels"
        : detectedLanguage === "th"
          ? "Thai"
          : detectedLanguage === "de"
            ? "Duits"
            : detectedLanguage === "fr"
              ? "Frans"
              : "Engels";
  const animalLine = animalName
    ? `Verwerk de diernaam "${animalName}" waar passend in je antwoord.`
    : "";

  return `Schrijf een warm, persoonlijk antwoord namens Saved Souls Foundation (dierenopvang in Thailand, Ban Khok Ngam).

Beantwoord ALTIJD de specifieke vraag uit de email. Voorbeelden:

ADOPTIE:
- Kat/hond adopteren → leg adoptieproces uit, verwijs naar adoptie pagina
- Beschikbare dieren → vertel over huidige dieren, verwijs naar website
- Kosten adoptie → geef info over adoptiebijdrage en wat inbegrepen is
- Adoptie vanuit buitenland → leg internationaal adoptieproces uit
- Adoptie opvolging → geef info over nazorg en contact na adoptie
- Specifiek dier vragen → geef info over dat dier, karakter, gezondheid

VRIJWILLIGER:
- Vrijwilligerswerk → leg uit hoe aanmelden, wat verwacht wordt, hoe lang
- Kosten vrijwilliger → geef info over bijdrage, verblijf, eten
- Wat doet een vrijwilliger → beschrijf dagelijkse taken
- Leeftijd/ervaring vereisten → geef info over vereisten

FINANCIEEL:
- Doneren → leg donatiemogelijkheden uit, maandelijks of eenmalig
- Sponsoren → uitleg sponsorpakketten en wat het oplevert
- Hoe wordt geld besteed → transparantie over kosten opvang
- Belastingaftrek donatie → geef info over ANBI status

DIEREN:
- Dier in nood/gevonden dier → geef direct advies, verwijs naar dierenarts
- Ziek of gewond dier → geef eerste hulp advies, verwijs naar opvang
- Hoeveel dieren in opvang → vertel huidig aantal en situatie
- Hoe gaat het in de opvang → vertel warm verhaal dagelijks leven

ALGEMEEN:
- Locatie/bezoek → geef info Ban Khok Ngam, bezoek mogelijk na afspraak
- Samenwerking voorstel → bedank, vraag meer informatie
- Media/pers vraag → verwijs naar info@savedsouls-foundation.org
- Klacht of probleem → erken probleem, bied oplossing, excuses
- Algemene info vraag → beantwoord vriendelijk en volledig
- Vraag in andere taal → beantwoord in DEZELFDE taal als de vraag
- Compliment of bedankje → reageer warm en dankbaar

Schrijf altijd een VOLLEDIG antwoord zonder placeholders.
Max 250 woorden. Vriendelijk, warm en persoonlijk.
Verwijs waar relevant naar: https://savedsouls-foundation.com

BELANGRIJK VOOR TALEN:
Detecteer de taal van de inkomende email en beantwoord ALTIJD in dezelfde taal als de afzender.
- Nederlands → antwoord in Nederlands
- Engels → antwoord in Engels
- Thai → antwoord in Thai
- Duits → antwoord in Duits
- Frans → antwoord in Frans
- Spaans → antwoord in Spaans
- Russisch → antwoord in Russisch
- Andere taal → antwoord in die taal of Engels als fallback
De toon blijft altijd warm, vriendelijk en persoonlijk ongeacht de taal.

Categorie: ${category}
Taal: Schrijf in exact ${langNote}.
${animalLine}

E-mail om op te reageren:
${bodySnippet}

Eindig altijd met een passende afsluiting en "Saved Souls Foundation". Geen onderwerpregel, alleen de antwoordtekst.`;
}

export const EMAIL_TEMPLATES: Record<string, string> = {
  adoptie_nl: `Beste afzender,

Dank voor je interesse in adoptie bij Saved Souls Foundation. We zijn een kleine dierenopvang in Ban Khok Ngam, Thailand, en zetten ons in voor zwerfhonden en -katten.

We nemen je aanvraag in behandeling en nemen zo snel mogelijk contact met je op over de mogelijkheden. Heb je al een specifiek dier op het oog, laat het ons weten.

Met vriendelijke groet,
Saved Souls Foundation`,

  adoptie_en: `Dear sender,

Thank you for your interest in adopting from Saved Souls Foundation. We are a small animal shelter in Ban Khok Ngam, Thailand, rescuing stray dogs and cats.

We will process your request and get back to you as soon as possible about options. If you already have a specific animal in mind, please let us know.

Kind regards,
Saved Souls Foundation`,

  donatie_nl: `Beste donor,

Hartelijk dank voor je steun aan Saved Souls Foundation. Elke bijdrage helpt ons om zwerfdieren in Ban Khok Ngam, Thailand, te voeden, verzorgen en een thuis te bieden.

We waarderen je vertrouwen en zullen je donatie verantwoord inzetten voor onze dieren.

Met dank en groet,
Saved Souls Foundation`,

  donatie_en: `Dear donor,

Thank you so much for supporting Saved Souls Foundation. Every contribution helps us feed, care for, and rehome stray animals in Ban Khok Ngam, Thailand.

We appreciate your trust and will use your donation responsibly for our animals.

With thanks and best wishes,
Saved Souls Foundation`,

  vrijwilliger_nl: `Beste aanmelder,

Dank je wel voor je interesse om vrijwilliger te worden bij Saved Souls Foundation. We kunnen altijd extra handen gebruiken in onze opvang in Thailand.

We nemen je aanmelding in behandeling en sturen je binnenkort meer informatie over de mogelijkheden en het vervolg.

Met vriendelijke groet,
Saved Souls Foundation`,

  vrijwilliger_en: `Dear applicant,

Thank you for your interest in volunteering at Saved Souls Foundation. We can always use extra hands at our shelter in Thailand.

We will process your application and send you more information about opportunities and next steps soon.

Kind regards,
Saved Souls Foundation`,
};
