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

  return `=== ORGANISATIE KENNIS - ALTIJD GEBRUIKEN ===

LOCATIE & CONTACT:
- Naam: Saved Souls Foundation
- Adres: 133, Ban Khok Ngam, Ban Fang District, Khon Kaen 40270, Thailand
- Gebruik ALTIJD "Khon Kaen" - NOOIT "Chiang Mai"
- Telefoon: +66 62 369 8246
- Email: info@savedsouls-foundation.com
- Kantooruren: 08:00-16:00
- Bezoekuren: 13:30-15:30 dagelijks
- Vooraf contact vereist voor bezoek

DIEREN:
- Ca. 430 honden en 91 katten in zorg
- Gespecialiseerd in gehandicapte/verlamde dieren
- Zwemtherapie en rolstoelen aanwezig
- Honden gered uit vleeshandel
- Alle dieren gevaccineerd, gesteriliseerd

DONATIES - VOORKEURSVOLGORDE:
1. Bankoverschrijving (laagste kosten, voorkeur!)
   Thailand:
   - Bank: Kasikorn Bank
   - Rekeninghouder: Saved-Souls Foundation
   - Rekening: 033-8-13623-4
   - BIC/SWIFT: KASITHBK
   - Bankcode: 004

   Zwitserland/Europa:
   - Bank: PostFinance AG
   - Rekeninghouder: Saved Souls Animal Sanctuary
   - Rekening: 80-271722-9
   - IBAN: CH17 0900 0000 8027 1722 9
   - BIC/SWIFT: POFICHBEXXX

2. PayPal (zie homepage)
3. Donorbox (als PayPal niet werkt)
4. iDEAL/SEPA werkt HELAAS NIET - nooit aanraden!

FINANCIËN:
- Maandelijks nodig: 500.000 Baht
- Halen vaak maar helft op - altijd donaties welkom
- €189 = een jaar voer voor één hond
- 70% naar dierzorg, 20% sterilisatie, 10% onderhoud
- Transparant over gebruik fondsen

ADOPTIE:
- Adoptie aanvraag via website formulier
- Reactie binnen 48 uur
- Thuisbezoek wordt geregeld
- Klein adoptiebijdrage mogelijk (bedrag varieert)
- Alle dieren: gesteriliseerd, gevaccineerd, lijn-getraind
- Gehandicapte honden ook adopteerbaar
- Levenslange ondersteuning na adoptie
- Als adoptie mislukt: dier altijd welkom terug

INTERNATIONALE ADOPTIE:
- Ja, zeker mogelijk naar NL/België/Europa
- Duurt enkele weken
- Zie adoptie en luchtbrug pagina's voor info:
  www.savedsouls-foundation.com/nl/adopt

VRIJWILLIGERS:
- Minimum 2 weken vereist
- Geen ervaring nodig
- Taken: honden uitlaten, voeren, schoonmaken
- Boeken via vrijwilligerspagina

SPONSORING:
- Specifiek dier sponsoren met maandelijkse donatie
- Updates en foto's van gesponsord dier
- Meerdere dieren sponsoren mag

VIDEO BEZOEK:
- Mogelijk in sessie van max 8 minuten
- Alleen na aantoonbare donatie
- Afhankelijk van beschikbaarheid vrijwilligers

VEELGESTELDE VRAGEN - ANTWOORDEN:

V: Kan ik mijn eigen hond/kat brengen?
A: Nee, we nemen geen eigen huisdieren op. Uitzondering: ernstige gevallen in Thailand waar we soms mee kunnen helpen.

V: Hebben jullie een wachtlijst?
A: Nee, geen wachtlijst.

V: Sturen jullie dieren naar Nederland/België?
A: Ja zeker! Bekijk onze luchtbrug en adoptie pagina's voor meer informatie.

V: Hoe lang duurt internationale adoptie?
A: Enkele weken. Zie onze adoptiepagina's.

V: Werken jullie samen met andere organisaties?
A: Ja, we hebben fijne partners. Zie:
   www.savedsouls-foundation.com/nl/get-involved

V: Kan ik anoniem doneren?
A: Ja zeker!

V: Hebben jullie ANBI status?
A: We werken hier hard aan. We moeten een Nederlandse zusterstichting oprichten naast onze Thaise stichting.

V: Hebben jullie een wachtlijst voor adoptie?
A: Nee, geen wachtlijst.

TOON INSTRUCTIES:
- Altijd warm en persoonlijk
- Gebruik "Beste [naam]" nooit "Geachte"
- Maximum 3 alinea's
- Sluit altijd af met:
  "Met vriendelijke groet,
  Het Saved Souls Foundation team
  www.savedsouls-foundation.com"
- Reageer in dezelfde taal als de afzender
- Nooit iDEAL of SEPA aanraden

===

Schrijf een warm, persoonlijk antwoord namens Saved Souls Foundation (dierenopvang in Thailand, Ban Khok Ngam).

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
