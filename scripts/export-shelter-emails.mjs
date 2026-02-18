#!/usr/bin/env node
/**
 * Export shelter emails for mail merge / automation.
 * Run: node scripts/export-shelter-emails.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SHELTERS = [
  { name: "Soi Dog Foundation", email: "info@soidog.org", location: "Phuket" },
  { name: "Rescue P.A.W.S. Thailand", email: "contact@rescue-paws.org", location: "Hua Hin" },
  { name: "Samui Dog & Cat Rescue", email: "info@samuidog.org", location: "Koh Samui" },
  { name: "Lanta Animal Welfare", email: "info@lantaanimalwelfare.com", location: "Koh Samui" },
  { name: "Pariah Dog Samui", email: "pariahdog.kohsamui@gmail.com", location: "Koh Samui" },
  { name: "PAWS Phuket", email: "info@pawsphuket.org", location: "Phuket" },
  { name: "Dog Rescue Thailand", email: "adopt@dogrescuethailand.com", location: "Thailand" },
  { name: "Happy Dogs Koh Chang", email: "info@happydogskohchang.org", location: "Koh Chang" },
  { name: "Elephant Nature Park Dog Sanctuary", email: "info@saveelephant.org", location: "Chiang Mai" },
  { name: "Jai Dog Rescue", email: "info@jaidogrescue.org", location: "Khao Yai" },
  { name: "Baan Maa", email: "beccaj@baanmaa.org", location: "Phetchaburi" },
  { name: "VetVan Thailand", email: "VetVanThailand@gmail.com", location: "Rayong" },
  { name: "PAWS Bangkok", email: "protect@pawsbangkok.org", location: "Bangkok" },
  { name: "Headrock Dogs Rescue", email: "info@headrockdogs.org", location: "Prachuap Khiri Khan" },
  { name: "Stichting Wereldhonden", email: "info@wereldhonden.nl", location: "Nederland" },
  { name: "Rescue Dogs and Cats NL", email: "rescuedogsandcatsnl@gmail.com", location: "Nederland" },
  { name: "Haags Dierencentrum", email: "receptie@haagsdierencentrum.nl", location: "Den Haag" },
  { name: "NKM Rescue Team", email: "nokillmissionorg@gmail.com", location: "Nederland" },
  { name: "Tierschutz Berlin", email: "info@tierschutz-berlin.de", location: "Duitsland" },
  { name: "Tierschutz Bremerhaven", email: "info@tierschutz-bremerhaven.eu", location: "Duitsland" },
  { name: "DOA Dierenasiel Amsterdam", email: "info@doa-dierenasiel.nl", location: "Amsterdam" },
  { name: "Puppy Rescue Team", email: "info@puppy-rescue-team.nl", location: "Nederland" },
  { name: "Dierenbescherming Groningen", email: "groningen@dierenbescherming.nl", location: "Groningen" },
  { name: "Dierenopvang Vlaardingen", email: "info.vlaardingen@dierenbescherming.nl", location: "Vlaardingen" },
  { name: "Dierenasiel Beilen", email: "info@dierenasielbeilen.nl", location: "Beilen" },
  { name: "TWAS Animal Rescue", email: "info@twas-animalrescue.be", location: "België" },
  { name: "Battersea Dogs & Cats Home", email: "info@battersea.org.uk", location: "Verenigd Koninkrijk" },
  { name: "Dogs Trust UK", email: "postadoptionsupport@dogstrust.org.uk", location: "Verenigd Koninkrijk" },
  { name: "Blue Cross UK", email: "info@bluecross.org.uk", location: "Verenigd Koninkrijk" },
  { name: "RSPCA", email: "info@rspca.org.uk", location: "Verenigd Koninkrijk" },
  { name: "ISPCA", email: "rehoming@ispca.ie", location: "Ierland" },
  { name: "Dogs Trust Ireland", email: "info@dogstrust.ie", location: "Ierland" },
  { name: "Tierheim München", email: "empfang@tierheim-muenchen.de", location: "München" },
  { name: "Tierheim Köln Zollstock", email: "info@tierheim-koeln-zollstock.de", location: "Köln" },
  { name: "SPA France", email: "contact@la-spa.fr", location: "Frankrijk" },
  { name: "PAWS-PATAS", email: "dogs@paws-patas.org", location: "Spanje" },
  { name: "Animal Rescue Algarve", email: "info@animalrescuealgarve.com", location: "Portugal" },
  { name: "A Dog's Life Rescue", email: "info@adlrescue.org", location: "Algarve, Portugal" },
  { name: "DASH Dogs", email: "info@dash-dogs.com", location: "Griekenland" },
  { name: "Porto Rafti Dog Rescue", email: "tanyapapadopoulos@mac.com", location: "Griekenland" },
  { name: "FOUR PAWS", email: "office@four-paws.org", location: "Oostenrijk" },
  { name: "Zürcher Tierschutz", email: "info@zuerchertierschutz.ch", location: "Zwitserland" },
  { name: "DogRescue Sweden", email: "info@dogrescue.se", location: "Zweden" },
  { name: "Hunderettung Europa", email: "vermittlung@hunderettungeuropa.de", location: "Duitsland/Europa" },
  { name: "Speranța Shelter", email: "contact@adapostulsperanta.ro", location: "Roemenië" },
  { name: "SOS Dogs Romania", email: "info@sosdogs.ro", location: "Roemenië" },
  { name: "Griffon Rescue", email: "adoptagriffauve@ziggo.nl", location: "NL/België/UK" },
  { name: "Dierenopvang Koningen", email: "info@dierenopvangkoningen.nl", location: "Balkbrug" },
  { name: "Dierenopvangcentrum Enschede", email: "info.docenschede@dierenbescherming.nl", location: "Enschede" },
  { name: "My Dog Rescue Spain", email: "info@mdrsdogsforhomes.com", location: "Spanje" },
  { name: "La Valle Incantata", email: "amici4zampeonlus@gmail.com", location: "Italië" },
  { name: "ENPA Italia", email: "info@enpa.org", location: "Italië" },
  { name: "LAV Italia", email: "info@lav.it", location: "Italië" },
  { name: "Tierheim Basel TBB", email: "info@tbb.ch", location: "Zwitserland" },
  { name: "Stiftung Tierrettungsdienst", email: "info@tierrettungsdienst.ch", location: "Zwitserland" },
  { name: "Schweizer Tierschutz STS", email: "info@tierschutz.com", location: "Zwitserland" },
  { name: "Tierschutzverein Liechtenstein", email: "info@tierschutzverein.li", location: "Liechtenstein" },
  { name: "SPA Monaco", email: "adoption@spamonaco.mc", location: "Monaco" },
  { name: "ALPA Luxembourg", email: "info@alpa.lu", location: "Luxemburg" },
  { name: "Dyreværnet Denmark", email: "info@dyrevaernet.dk", location: "Denemarken" },
  { name: "Dyrebeskyttelsen Norge", email: "post@dyrebeskyttelsen.no", location: "Noorwegen" },
  { name: "HESY Helsinki", email: "hesy@hesy.fi", location: "Finland" },
  { name: "Viikki Animal Shelter", email: "viikki@hesy.fi", location: "Helsinki" },
  { name: "Hundar Utan Hem", email: "info@hundarutanhem.se", location: "Zweden" },
  { name: "Tails Rescue Sweden", email: "info@tailsrescuesweden.org", location: "Zweden" },
  { name: "Dog Rescue Auktsjaur", email: "info@dogrescueauktsjaur.com", location: "Zweden" },
  { name: "SPCA Sweden", email: "info@spcasweden.se", location: "Zweden" },
  { name: "SOS Animals Sweden", email: "info@sos-animals.se", location: "Zweden" },
  { name: "Wiener Tierschutzverein", email: "kundenservice@tierschutz-austria.at", location: "Oostenrijk" },
  { name: "Tierschutzverein Wien", email: "office@tierschutzverein.at", location: "Oostenrijk" },
  { name: "Franziskus Tierheim Hamburg", email: "info@franziskustierheim.de", location: "Duitsland" },
  { name: "Hamburger Tierschutzverein", email: "info@hamburger-tierschutzverein.de", location: "Hamburg" },
  { name: "Deutscher Tierschutzbund", email: "bg@tierschutzbund.de", location: "Duitsland" },
  { name: "Stichting Adopt.nl", email: "info@adoptnl.org", location: "Nederland" },
  { name: "Scottish SPCA", email: "info@scottishspca.org", location: "Schotland" },
  { name: "Animal Rescue Cymru", email: "rehoming@animalrescuecymru.co.uk", location: "Wales" },
  { name: "Islay Dog Rescue", email: "islaydogrescue@yahoo.co.uk", location: "Schotland" },
  { name: "ENPA Pistoia", email: "pistoia@enpa.org", location: "Italië" },
  { name: "ENPA Genova", email: "genova@enpa.org", location: "Italië" },
  { name: "Dyrenes Frie Farm", email: "kontakt@dyrenesfriefarm.dk", location: "Denemarken" },
  { name: "Dyrebeskyttelsen Oslo", email: "nord-jaeren@dyrebeskyttelsen.no", location: "Noorwegen" },
  { name: "SPA Nice", email: "nice@la-spa.fr", location: "Frankrijk" },
  { name: "SPA Paris", email: "contact@la-spa.fr", location: "Frankrijk" },
  { name: "Tierheim Pfötli", email: "info@tierrettungsdienst.ch", location: "Zwitserland" },
  { name: "Schweizer Tierschutz Basel", email: "basel@tierschutz.com", location: "Zwitserland" },
  { name: "ENPA Faenza", email: "faenza@enpa.org", location: "Italië" },
  { name: "Animal Equality Italia", email: "info@animalequality.org", location: "Italië" },
  { name: "Scottish Animal Welfare", email: "info@scottishanimalwelfare.org.uk", location: "Schotland" },
  { name: "TierQuarTier Wien", email: "tierquartier@ma60.wien.gv.at", location: "Oostenrijk" },
  { name: "Dyreværnet Kolding", email: "info@dyrevaernet.dk", location: "Denemarken" },
  { name: "Dyrebeskyttelsen Nord-Jæren", email: "nord-jaeren@dyrebeskyttelsen.no", location: "Noorwegen" },
  { name: "Tierschutz Linth", email: "info@tierschutzlinth.ch", location: "Zwitserland" },
  { name: "STS Schweizer Tierschutz", email: "info@sts-psa.ch", location: "Zwitserland" },
  { name: "LAV Bergamo", email: "bergamo@lav.it", location: "Italië" },
  { name: "LAV Bologna", email: "bologna@lav.it", location: "Italië" },
];

// Deduplicate by email (some shelters share same org)
const seen = new Set();
const unique = SHELTERS.filter((s) => {
  const key = s.email.toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const dataDir = path.join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

// 1. Simple list: one email per line (for BCC, mail merge)
const emailsOnly = unique.map((s) => s.email).join("\n");
writeFileSync(path.join(dataDir, "shelter-emails.txt"), emailsOnly);

// 2. CSV with name, email, location (for mail merge with personalization)
const csvHeader = "name,email,location";
const csvRows = unique.map((s) => `"${s.name}","${s.email}","${s.location}"`).join("\n");
writeFileSync(path.join(dataDir, "shelter-emails.csv"), csvHeader + "\n" + csvRows);

console.log(`✓ Exported ${unique.length} unique shelter emails to data/`);
console.log("  - shelter-emails.txt: alleen e-mailadressen (één per regel)");
console.log("  - shelter-emails.csv: naam, e-mail, locatie (voor mail merge)");
