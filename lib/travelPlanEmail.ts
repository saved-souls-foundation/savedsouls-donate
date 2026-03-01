export type TravelPlanParams = {
  voornaam: string;
  achternaam: string;
  city: string; // vertrekpunt vrijwilliger, bijv. "Amsterdam"
  locale: "nl" | "en";
};

export function buildTravelPlanEmail({
  voornaam,
  achternaam,
  city,
  locale,
}: TravelPlanParams): string {
  const naam = [voornaam, achternaam].filter(Boolean).join(" ").trim() || voornaam || "vrijwilliger";
  const departure =
    (city || "").trim() || (locale === "en" ? "your city" : "jouw stad");

  const googleFlightsUrl = `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(departure)}+to+Bangkok+Thailand`;
  const mapsUrl =
    "https://maps.google.com/?q=133+Moo+4+Ban+Kok+Gnam+Ban+Fang+Khon+Kaen+Thailand";
  const tdacUrl = "https://tdac.immigration.go.th/arrival-card/#/home";

  if (locale === "en") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your travel plan – Saved Souls Foundation</title>
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 0; }
    .wrapper { max-width: 620px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    .header { background: #0E1520; padding: 36px 40px 28px; text-align: center; }
    .header h1 { color: #F0C97A; font-size: 22px; margin: 0 0 4px; font-family: Georgia, serif; }
    .header p { color: #7A9AB5; font-size: 13px; margin: 0; }
    .body { padding: 36px 40px; color: #1a2535; font-size: 15px; line-height: 1.7; }
    .notice { background: #FFF8E6; border-left: 4px solid #D4A853; border-radius: 6px; padding: 16px 20px; margin: 24px 0; font-size: 14px; color: #7a5a10; }
    .notice strong { display: block; margin-bottom: 4px; font-size: 15px; }
    .step { background: #f8fafc; border-radius: 10px; padding: 20px 24px; margin: 16px 0; }
    .step h3 { margin: 0 0 8px; color: #0E1520; font-size: 15px; }
    .step p { margin: 0; color: #445566; font-size: 14px; }
    .cta { display: inline-block; background: #2A9D8F; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 8px 0; }
    .address { background: #f0f7f6; border-radius: 8px; padding: 16px 20px; margin: 20px 0; font-size: 14px; color: #2A9D8F; font-weight: 600; }
    .tdac-box { background: #E8F4FD; border: 2px solid #1A7FB5; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
    .tdac-box h3 { margin: 0 0 10px; color: #0E1520; font-size: 16px; }
    .tdac-box p { margin: 0 0 14px; color: #1a2535; font-size: 14px; line-height: 1.6; }
    .cta-tdac { display: inline-block; background: #1A7FB5; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .footer { background: #f4f6f8; padding: 24px 40px; text-align: center; font-size: 12px; color: #8899aa; border-top: 1px solid #e8edf2; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🕊️ Saved Souls Foundation</h1>
      <p>Thailand · Travel plan proposal</p>
    </div>
    <div class="body">
      <p>Dear ${naam},</p>
      <p>
        Congratulations — your application has been approved! We are very much looking forward to welcoming you at our project in Thailand. 🇹🇭
      </p>
      <p>
        Below you will find a <strong>travel plan proposal</strong> from ${departure} to our location in Khon Kaen.
        This is a suggestion only — you are completely free to arrange your own travel and choose a different route.
      </p>

      <div class="notice">
        <strong>⚠️ Important: travel costs are at your own expense</strong>
        Saved Souls Foundation does <strong>not</strong> cover any travel costs.
        All flights, transfers, accommodation and other travel expenses are entirely your own responsibility.
        Please read this travel plan as a helpful guide, not a booking confirmation.
      </div>

      <h2 style="font-size:17px; color:#0E1520; margin-top:32px;">✈️ Suggested travel plan</h2>
      <p style="color:#556677; font-size:14px;">Minimum stay: <strong>2 weeks</strong>. We recommend booking in advance.</p>

      <div class="step">
        <h3>Step 1 — Flight from ${departure} to Bangkok</h3>
        <p>
          Search for a flight from <strong>${departure}</strong> to <strong>Bangkok Suvarnabhumi (BKK)</strong>
          or <strong>Don Mueang (DMK)</strong>. Common airlines flying this route include KLM, Thai Airways,
          Lufthansa, Emirates and Turkish Airlines, often with one stopover.
        </p>
        <br>
        <a href="${googleFlightsUrl}" class="cta" target="_blank">
          🔍 Search flights on Google Flights →
        </a>
        <p style="margin-top:12px; font-size:13px; color:#8899aa;">
          This link opens Google Flights in your browser. Compare prices and choose the option that suits you best.
        </p>
      </div>

      <div class="step">
        <h3>Step 2 — From Bangkok to Khon Kaen</h3>
        <p>
          From Bangkok there are several options to reach Khon Kaen (approximately 450 km northeast):
        </p>
        <ul style="margin-top:10px; padding-left:20px; font-size:14px; color:#445566; line-height:2;">
          <li><strong>✈️ Domestic flight</strong> — Bangkok (BKK/DMK) → Khon Kaen Airport (KKC). Flight time approx. 1 hour. Check AirAsia or Thai Lion Air.</li>
          <li><strong>🚌 Bus</strong> — From Mo Chit Bus Terminal (Bangkok) to Khon Kaen. Journey approx. 6–7 hours. Affordable and comfortable.</li>
          <li><strong>🚆 Train</strong> — From Hua Lamphong or Bang Sue station to Khon Kaen. Journey approx. 7–8 hours. Book via <a href="https://www.thairailwayticket.com" target="_blank" style="color:#2A9D8F;">thairailwayticket.com</a>.</li>
        </ul>
      </div>

      <div class="step">
        <h3>Step 3 — From Khon Kaen to our location</h3>
        <p>
          From Khon Kaen city centre our project location is approximately 25 km.
          You can take a local taxi, songthaew (shared taxi) or use Grab (Thai taxi app).
        </p>
        <br>
        <div class="address">
          📍 Saved Souls Foundation<br>
          133 Moo 4, Ban Kok Gnam<br>
          Ban Fang, Khon Kaen<br>
          Thailand 40270
        </div>
        <p style="font-size:13px; color:#8899aa;">
          Share this address with your driver. Most drivers in Khon Kaen know the area.
        </p>
        <a href="${mapsUrl}" class="cta" target="_blank" style="background:#3D8B5E;">
          📍 Open in Google Maps →
        </a>
      </div>

      <div class="step">
        <h3>Step 4 — Practical tips</h3>
        <ul style="padding-left:20px; font-size:14px; color:#445566; line-height:2;">
          <li>Book travel insurance that covers Thailand and animal contact.</li>
          <li>Check current visa requirements for Thailand at your embassy.</li>
          <li>Recommended vaccinations: Hepatitis A/B, Tetanus, Rabies, Typhoid.</li>
          <li>Minimum stay is 2 weeks; longer stays are very welcome.</li>
          <li>Let us know your arrival date so we can prepare your welcome.</li>
        </ul>
      </div>

      <div class="tdac-box">
        <h3>🛃 Thailand Digital Arrival Card (TDAC)</h3>
        <p>
          Before you travel, fill in the <strong>official Digital Arrival Card</strong>. It is free and required for entry into Thailand. Use only the official Thai government website below — no fees apply.
        </p>
        <a href="${tdacUrl}" class="cta-tdac" target="_blank" rel="noopener noreferrer">
          Official Thai government website →
        </a>
      </div>

      <div class="notice" style="background:#e8f5e9; border-color:#3D8B5E; color:#1b5e20; margin-top:28px;">
        <strong>📩 Questions about your trip?</strong>
        Feel free to contact us at <a href="mailto:info@savedsouls-foundation.org" style="color:#2A9D8F;">info@savedsouls-foundation.org</a>.
        We are happy to help you prepare — even though the travel costs are yours to cover.
      </div>

      <p style="margin-top:28px;">
        We look forward to seeing you in Thailand!<br><br>
        Warm regards,<br>
        <strong>The Saved Souls Foundation Team</strong><br>
        <span style="color:#8899aa; font-size:13px;">Khon Kaen, Thailand 🇹🇭</span>
      </p>
    </div>
    <div class="footer">
      Saved Souls Foundation · 133 Moo 4, Ban Kok Gnam, Ban Fang, Khon Kaen, Thailand 40270<br>
      <a href="https://savedsouls-foundation.org" style="color:#2A9D8F;">savedsouls-foundation.org</a>
      <br><br>
      <em>This email was sent because your volunteer application was approved. Travel costs are entirely at your own expense.</em>
    </div>
  </div>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jouw reisplan – Saved Souls Foundation</title>
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 0; }
    .wrapper { max-width: 620px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    .header { background: #0E1520; padding: 36px 40px 28px; text-align: center; }
    .header h1 { color: #F0C97A; font-size: 22px; margin: 0 0 4px; font-family: Georgia, serif; }
    .header p { color: #7A9AB5; font-size: 13px; margin: 0; }
    .body { padding: 36px 40px; color: #1a2535; font-size: 15px; line-height: 1.7; }
    .notice { background: #FFF8E6; border-left: 4px solid #D4A853; border-radius: 6px; padding: 16px 20px; margin: 24px 0; font-size: 14px; color: #7a5a10; }
    .notice strong { display: block; margin-bottom: 4px; font-size: 15px; }
    .step { background: #f8fafc; border-radius: 10px; padding: 20px 24px; margin: 16px 0; }
    .step h3 { margin: 0 0 8px; color: #0E1520; font-size: 15px; }
    .step p { margin: 0; color: #445566; font-size: 14px; }
    .cta { display: inline-block; background: #2A9D8F; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 8px 0; }
    .address { background: #f0f7f6; border-radius: 8px; padding: 16px 20px; margin: 20px 0; font-size: 14px; color: #2A9D8F; font-weight: 600; }
    .tdac-box { background: #E8F4FD; border: 2px solid #1A7FB5; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
    .tdac-box h3 { margin: 0 0 10px; color: #0E1520; font-size: 16px; }
    .tdac-box p { margin: 0 0 14px; color: #1a2535; font-size: 14px; line-height: 1.6; }
    .cta-tdac { display: inline-block; background: #1A7FB5; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .footer { background: #f4f6f8; padding: 24px 40px; text-align: center; font-size: 12px; color: #8899aa; border-top: 1px solid #e8edf2; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🕊️ Saved Souls Foundation</h1>
      <p>Thailand · Reisplan voorstel</p>
    </div>
    <div class="body">
      <p>Beste ${naam},</p>
      <p>
        Gefeliciteerd — je aanmelding is goedgekeurd! We kijken er enorm naar uit om je te verwelkomen op ons project in Thailand. 🇹🇭
      </p>
      <p>
        Hieronder vind je een <strong>reisplan op maat</strong> vanuit ${departure} naar onze locatie in Khon Kaen.
        Dit is een voorstel — je bent volledig vrij om je reis zelf te regelen en een andere route te kiezen.
      </p>

      <div class="notice">
        <strong>⚠️ Belangrijk: reiskosten zijn volledig voor eigen rekening</strong>
        Saved Souls Foundation vergoedt <strong>geen</strong> reiskosten.
        Alle vluchten, transfers, verblijf en overige reiskosten zijn volledig jouw eigen verantwoordelijkheid.
        Lees dit reisplan als een handreiking, niet als een boeking of toezegging.
      </div>

      <h2 style="font-size:17px; color:#0E1520; margin-top:32px;">✈️ Voorgesteld reisplan</h2>
      <p style="color:#556677; font-size:14px;">Minimale verblijfsduur: <strong>2 weken</strong>. We raden aan ruim van tevoren te boeken.</p>

      <div class="step">
        <h3>Stap 1 — Vlucht van ${departure} naar Bangkok</h3>
        <p>
          Zoek een vlucht van <strong>${departure}</strong> naar <strong>Bangkok Suvarnabhumi (BKK)</strong>
          of <strong>Don Mueang (DMK)</strong>. Veelgevlogen maatschappijen zijn KLM, Thai Airways,
          Lufthansa, Emirates en Turkish Airlines — vaak met één tussenstop.
        </p>
        <br>
        <a href="${googleFlightsUrl}" class="cta" target="_blank">
          🔍 Vluchten zoeken via Google Flights →
        </a>
        <p style="margin-top:12px; font-size:13px; color:#8899aa;">
          Deze link opent Google Flights in je browser. Vergelijk prijzen en kies wat het beste bij jou past.
        </p>
      </div>

      <div class="step">
        <h3>Stap 2 — Van Bangkok naar Khon Kaen</h3>
        <p>
          Vanuit Bangkok zijn er meerdere mogelijkheden om Khon Kaen te bereiken (ca. 450 km naar het noordoosten):
        </p>
        <ul style="margin-top:10px; padding-left:20px; font-size:14px; color:#445566; line-height:2;">
          <li><strong>✈️ Binnenlandse vlucht</strong> — Bangkok (BKK/DMK) → Khon Kaen Airport (KKC). Vluchttijd ca. 1 uur. Check AirAsia of Thai Lion Air.</li>
          <li><strong>🚌 Bus</strong> — Vanaf Mo Chit busstation (Bangkok) naar Khon Kaen. Reistijd ca. 6–7 uur. Betaalbaar en comfortabel.</li>
          <li><strong>🚆 Trein</strong> — Vanaf Hua Lamphong of Bang Sue station naar Khon Kaen. Reistijd ca. 7–8 uur. Boeken via <a href="https://www.thairailwayticket.com" target="_blank" style="color:#2A9D8F;">thairailwayticket.com</a>.</li>
        </ul>
      </div>

      <div class="step">
        <h3>Stap 3 — Van Khon Kaen naar onze locatie</h3>
        <p>
          Vanaf het centrum van Khon Kaen is onze projectlocatie ca. 25 km.
          Je kunt een lokale taxi nemen, een songthaew (gedeelde taxi) of Grab (Thaise taxi-app).
        </p>
        <br>
        <div class="address">
          📍 Saved Souls Foundation<br>
          133 Moo 4, Ban Kok Gnam<br>
          Ban Fang, Khon Kaen<br>
          Thailand 40270
        </div>
        <p style="font-size:13px; color:#8899aa;">
          Geef dit adres aan je chauffeur. De meeste chauffeurs in Khon Kaen kennen de omgeving.
        </p>
        <a href="${mapsUrl}" class="cta" target="_blank" style="background:#3D8B5E;">
          📍 Openen in Google Maps →
        </a>
      </div>

      <div class="step">
        <h3>Stap 4 — Praktische tips</h3>
        <ul style="padding-left:20px; font-size:14px; color:#445566; line-height:2;">
          <li>Sluit een reisverzekering af die Thailand en dierencontact dekt.</li>
          <li>Controleer de actuele visumvereisten voor Thailand via je ambassade.</li>
          <li>Aanbevolen vaccinaties: Hepatitis A/B, Tetanus, Hondsdolheid, Tyfus.</li>
          <li>Minimale verblijfsduur is 2 weken; een langer verblijf is van harte welkom.</li>
          <li>Laat ons je aankomstdatum weten zodat we je welkomst kunnen voorbereiden.</li>
        </ul>
      </div>

      <div class="tdac-box">
        <h3>🛃 Thailand Digital Arrival Card (TDAC)</h3>
        <p>
          Vul vóór je reis de <strong>officiële digitale aankomstkaart</strong> in. Die is gratis en verplicht bij binnenkomst in Thailand. Gebruik alleen de officiële Thaise overheidswebsite hieronder — er zijn geen kosten aan verbonden.
        </p>
        <a href="${tdacUrl}" class="cta-tdac" target="_blank" rel="noopener noreferrer">
          Officiële Thaise overheidswebsite →
        </a>
      </div>

      <div class="notice" style="background:#e8f5e9; border-color:#3D8B5E; color:#1b5e20; margin-top:28px;">
        <strong>📩 Vragen over je reis?</strong>
        Neem gerust contact op via <a href="mailto:info@savedsouls-foundation.org" style="color:#2A9D8F;">info@savedsouls-foundation.org</a>.
        We helpen je graag bij de voorbereiding — ook al zijn de reiskosten voor eigen rekening.
      </div>

      <p style="margin-top:28px;">
        We kijken ernaar uit je te zien in Thailand!<br><br>
        Met warme groeten,<br>
        <strong>Het team van Saved Souls Foundation</strong><br>
        <span style="color:#8899aa; font-size:13px;">Khon Kaen, Thailand 🇹🇭</span>
      </p>
    </div>
    <div class="footer">
      Saved Souls Foundation · 133 Moo 4, Ban Kok Gnam, Ban Fang, Khon Kaen, Thailand 40270<br>
      <a href="https://savedsouls-foundation.org" style="color:#2A9D8F;">savedsouls-foundation.org</a>
      <br><br>
      <em>Deze e-mail is verstuurd omdat je vrijwilligersaanmelding is goedgekeurd. Reiskosten zijn volledig voor eigen rekening.</em>
    </div>
  </div>
</body>
</html>`;
}
