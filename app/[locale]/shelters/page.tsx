import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import SheltersSearch from "../../components/SheltersSearch";

const ACCENT_GREEN = "#2aa348";
const PINK = "#ec4899";

const PARTNERS = [
  { key: "tvav", url: "https://tvav.ch", logo: "/partners/tvav.png", platinum: true },
  { key: "k9aid", url: "https://k9aid.org", logo: "/partners/k9aid.png", platinum: true },
  { key: "streetdogsthailand", url: "https://streetdogsthailand.com", logo: "/partners/streetdogsthailand.png", platinum: true },
  { key: "gifthoney", url: "https://gifthoney.co", logo: "/partners/gifthoney.png", platinum: true },
];

const SHELTERS = [
  {
    region: "thailand",
    items: [
      { name: "Soi Dog Foundation", url: "https://www.soidog.org", email: "info@soidog.org", location: "Phuket", color: "#f97316", icon: "🐕", logo: "/logos/soi-dog.png" },
      { name: "Rescue P.A.W.S. Thailand", url: "https://www.rescuepawsthailand.org", email: "contact@rescue-paws.org", location: "Hua Hin", color: "#0ea5e9", icon: "🐾", logo: "/logos/rescue-paws.png" },
      { name: "Samui Dog & Cat Rescue", url: "https://www.samuidog.org", email: "info@samuidog.org", location: "Koh Samui", color: "#22c55e", icon: "🏝️", logo: "/logos/samui-dog-cat-rescue.png" },
      { name: "Lanta Animal Welfare", url: "https://lantaanimalwelfare.com", email: "info@lantaanimalwelfare.com", location: "Koh Lanta", color: "#eab308", icon: "🌴", logo: "/logos/lanta-animal-welfare.png" },
      { name: "Pariah Dog Samui", url: "https://pariahdogsamui.com", email: "pariahdog.kohsamui@gmail.com", location: "Koh Samui", color: "#a855f7", icon: "🐕", logo: "/logos/pariah-dog-samui.png" },
      { name: "PAWS Phuket", url: "https://pawsphuket.designextreme.com", email: "info@pawsphuket.org", location: "Phuket", color: "#f59e0b", icon: "🐾", logo: "/logos/paws-phuket.png" },
      { name: "Dog Rescue Thailand", url: "https://dogrescuethailand.com", email: "adopt@dogrescuethailand.com", location: "Thailand", color: "#10b981", icon: "🏠", logo: "/logos/dog-rescue-thailand.png" },
      { name: "Happy Dogs Koh Chang", url: "https://happydogskohchang.org", email: "info@happydogskohchang.org", location: "Koh Chang", color: "#06b6d4", icon: "😊", logo: "/logos/happy-dogs-koh-chang.png" },
      { name: "Elephant Nature Park Dog Sanctuary", url: "https://www.saveelephant.org/dogproject", email: "info@saveelephant.org", location: "Chiang Mai", color: "#84cc16", icon: "🐘", logo: "/logos/elephant-nature-park.png" },
      { name: "Jai Dog Rescue", url: "https://jaidogrescue.org", email: "info@jaidogrescue.org", location: "Khao Yai", color: "#ef4444", icon: "❤️", logo: "/logos/jai-dog-rescue.png" },
      { name: "Baan Maa", url: "https://baanmaa.org", email: "beccaj@baanmaa.org", location: "Phetchaburi", color: "#ec4899", icon: "🏡", logo: "/logos/baan-maa.png" },
      { name: "VetVan Thailand", url: "https://www.vetvanthailand.com", email: "VetVanThailand@gmail.com", location: "Rayong", color: "#14b8a6", icon: "🚐", logo: "/logos/vetvan-thailand.png" },
      { name: "PAWS Bangkok", url: "https://www.facebook.com/pawsbangkok", email: "protect@pawsbangkok.org", location: "Bangkok", color: "#f97316", icon: "🐾", logo: "/logos/paws-bangkok.png" },
      { name: "Headrock Dogs Rescue", url: "https://www.headrockdogs.org", email: "info@headrockdogs.org", location: "Prachuap Khiri Khan", color: "#8b5cf6", icon: "🏔️", logo: "/logos/headrock-dogs-rescue.png" },
    ],
  },
  {
    region: "europe",
    items: [
      { name: "Happy Dogs of Romania", url: "https://www.happy-dogs-of-romania.nl/", email: "info@happy-dogs-of-romania.nl", location: "Nederland/Roemenië", color: "#0d9488", icon: "🐕", logo: "/logos/happy-dogs-romania.png" },
      { name: "Straydogs Rescue Nederland", url: "https://straydogsrescue.nl/", email: "info@straydogsrescue.nl", location: "Nederland/Roemenië", color: "#22c55e", icon: "🐾", logo: "/logos/straydogs-rescue-nl.png" },
      { name: "Stichting Dutch Animal Care", url: "https://www.dutchanimalcare.eu/", email: "info@dutchanimalcare.eu", location: "Nederland", color: "#f97316", icon: "❤️", logo: "/logos/dutch-animal-care.png" },
      { name: "Stichting Wereldhonden", url: "https://wereldhonden.nl", email: "info@wereldhonden.nl", location: "Nederland", color: "#ec4899", icon: "🌍", logo: "/logos/stichting-wereldhonden.png" },
      { name: "Rescue Dogs and Cats NL", url: "https://rescuedogsandcatsnl.com", email: "rescuedogsandcatsnl@gmail.com", location: "Nederland", color: "#06b6d4", icon: "🇳🇱", logo: "/logos/rescue-dogs-cats-nl.png" },
      { name: "Haags Dierencentrum", url: "https://haagsdierencentrum.nl", email: "receptie@haagsdierencentrum.nl", location: "Den Haag", color: "#f43f5e", icon: "🏠", logo: "/logos/haags-dierencentrum.png" },
      { name: "NKM Rescue Team", url: "https://www.nkmrescueteam.com", email: "nokillmissionorg@gmail.com", location: "Nederland", color: "#14b8a6", icon: "🤝", logo: "/logos/nkm-rescue-team.png" },
      { name: "Tierschutz Berlin", url: "https://www.tierschutz-berlin.de", email: "info@tierschutz-berlin.de", location: "Duitsland", color: "#6366f1", icon: "🇩🇪", logo: "/logos/tierschutz-berlin.png" },
      { name: "Tierschutz Bremerhaven", url: "https://www.tierschutz-bremerhaven.eu", email: "info@tierschutz-bremerhaven.eu", location: "Duitsland", color: "#0d9488", icon: "🐶", logo: "/logos/tierschutz-bremerhaven.png" },
      { name: "DOA Dierenasiel Amsterdam", url: "https://doa-dierenasiel.nl", email: "info@doa-dierenasiel.nl", location: "Amsterdam", color: "#eab308", icon: "🇳🇱", logo: "/logos/doa-amsterdam.png" },
      { name: "Puppy Rescue Team", url: "https://www.puppy-rescue-team.nl", email: "info@puppy-rescue-team.nl", location: "Nederland", color: "#22c55e", icon: "🐕", logo: "/logos/puppy-rescue-team.png" },
      { name: "Dierenbescherming Groningen", url: "https://www.dierenbescherming.nl", email: "groningen@dierenbescherming.nl", location: "Groningen", color: "#0ea5e9", icon: "🏠", logo: "/logos/dierenopvang-vlaardingen.jpg" },
      { name: "Dierenopvang Vlaardingen", url: "https://www.dierenbescherming.nl", email: "info.vlaardingen@dierenbescherming.nl", location: "Vlaardingen", color: "#8b5cf6", icon: "🐾", logo: "/logos/dierenopvang-vlaardingen.jpg" },
      { name: "Dierenasiel Beilen", url: "https://www.dierenasielbeilen.nl", email: "info@dierenasielbeilen.nl", location: "Beilen", color: "#f97316", icon: "🏡", logo: "/logos/dierenasiel-beilen.svg" },
      { name: "TWAS Animal Rescue", url: "https://www.twas-animalrescue.be", email: "info@twas-animalrescue.be", location: "België", color: "#ec4899", icon: "🇧🇪", logo: "/logos/twas-animal-rescue.png" },
      { name: "Battersea Dogs & Cats Home", url: "https://www.battersea.org.uk", email: "info@battersea.org.uk", location: "Verenigd Koninkrijk", color: "#f43f5e", icon: "🇬🇧", logo: "/logos/battersea.png" },
      { name: "Dogs Trust UK", url: "https://www.dogstrust.org.uk", email: "postadoptionsupport@dogstrust.org.uk", location: "Verenigd Koninkrijk", color: "#06b6d4", icon: "🐕", logo: "/logos/dogs-trust.png" },
      { name: "Blue Cross UK", url: "https://www.bluecross.org.uk", email: "info@bluecross.org.uk", location: "Verenigd Koninkrijk", color: "#3b82f6", icon: "💙", logo: "/logos/blue-cross-uk.jpg" },
      { name: "RSPCA", url: "https://www.rspca.org.uk", email: "info@rspca.org.uk", location: "Verenigd Koninkrijk", color: "#22c55e", icon: "🐾", logo: "/logos/rspca.png" },
      { name: "ISPCA", url: "https://ispca.ie", email: "rehoming@ispca.ie", location: "Ierland", color: "#0ea5e9", icon: "🇮🇪", logo: "/logos/ispca.jpg" },
      { name: "Dogs Trust Ireland", url: "https://www.dogstrust.ie", email: "info@dogstrust.ie", location: "Ierland", color: "#14b8a6", icon: "🐶", logo: "/logos/dogs-trust.png" },
      { name: "Tierheim München", url: "https://tierschutzverein-muenchen.de", email: "empfang@tierheim-muenchen.de", location: "München", color: "#6366f1", icon: "🇩🇪", logo: "/logos/tierheim-muenchen.png" },
      { name: "Tierheim Köln Zollstock", url: "https://tierheim-koeln-zollstock.de", email: "info@tierheim-koeln-zollstock.de", location: "Köln", color: "#a855f7", icon: "🐕", logo: "/logos/tierheim-koeln-zollstock.png" },
      { name: "SPA France", url: "https://www.la-spa.fr", email: "contact@la-spa.fr", location: "Frankrijk", color: "#f97316", icon: "🇫🇷", logo: "/logos/spa-france.png" },
      { name: "PAWS-PATAS", url: "https://www.paws-patas.org", email: "dogs@paws-patas.org", location: "Spanje", color: "#eab308", icon: "🇪🇸", logo: "/logos/paws-patas.png" },
      { name: "Animal Rescue Algarve", url: "https://animalrescuealgarve.com", email: "info@animalrescuealgarve.com", location: "Portugal", color: "#22c55e", icon: "🇵🇹", logo: "/logos/animal-rescue-algarve.png" },
      { name: "A Dog's Life Rescue", url: "https://www.adlrescue.org", email: "info@adlrescue.org", location: "Algarve, Portugal", color: "#06b6d4", icon: "🐕", logo: "/logos/a-dogs-life-rescue.png" },
      { name: "DASH Dogs", url: "https://dash-dogs.com", email: "info@dash-dogs.com", location: "Griekenland", color: "#ef4444", icon: "🇬🇷", logo: "/logos/dash-dogs.png" },
      { name: "Porto Rafti Dog Rescue", url: "https://www.portoraftidogrescue.com", email: "tanyapapadopoulos@mac.com", location: "Griekenland", color: "#0ea5e9", icon: "🐾", logo: "/logos/porto-rafti-dog-rescue.jpg" },
      { name: "FOUR PAWS", url: "https://www.four-paws.org", email: "office@four-paws.org", location: "Oostenrijk", color: "#f59e0b", icon: "🐾", logo: "/logos/four-paws.png" },
      { name: "Zürcher Tierschutz", url: "https://www.zuerchertierschutz.ch", email: "info@zuerchertierschutz.ch", location: "Zwitserland", color: "#10b981", icon: "🇨🇭", logo: "/logos/zuercher-tierschutz.png" },
      { name: "DogRescue Sweden", url: "https://www.dogrescue.se", email: "info@dogrescue.se", location: "Zweden", color: "#3b82f6", icon: "🇸🇪", logo: "/logos/dogrescue-sweden.png" },
      { name: "Hunderettung Europa", url: "https://hunderettung-europa.de", email: "vermittlung@hunderettungeuropa.de", location: "Duitsland/Europa", color: "#14b8a6", icon: "🇪🇺", logo: "/logos/hunderettung-europa.png" },
      { name: "Speranța Shelter", url: "https://sperantashelter.org", email: "contact@adapostulsperanta.ro", location: "Roemenië", color: "#ec4899", icon: "🇷🇴", logo: "/logos/speranta-shelter.png" },
      { name: "SOS Dogs Romania", url: "https://eng.sosdogs.ro", email: "info@sosdogs.ro", location: "Roemenië", color: "#f97316", icon: "🐕", logo: "/logos/sos-dogs-romania.png" },
      { name: "Griffon Rescue", url: "https://www.griffonrescue-uk-nl-b-de.org", email: "adoptagriffauve@ziggo.nl", location: "NL/België/UK", color: "#8b5cf6", icon: "🐕", logo: "/logos/griffon-rescue.jpg" },
      { name: "Dierenopvang Koningen", url: "https://www.dierenopvangkoningen.nl", email: "info@dierenopvangkoningen.nl", location: "Balkbrug", color: "#0d9488", icon: "🏠", logo: "/logos/dierenopvang-koningen.png" },
      { name: "Dierenopvangcentrum Enschede", url: "https://www.dierenbescherming.nl", email: "info.docenschede@dierenbescherming.nl", location: "Enschede", color: "#06b6d4", icon: "🐾", logo: "/logos/dierenopvangcentrum-enschede.jpg" },
      { name: "My Dog Rescue Spain", url: "https://www.mdrsdogsforhomes.com", email: "info@mdrsdogsforhomes.com", location: "Spanje", color: "#eab308", icon: "🇪🇸", logo: "/logos/my-dog-rescue-spain.jpg" },
      { name: "La Valle Incantata", url: "https://www.lavalleincantata.org", email: "amici4zampeonlus@gmail.com", location: "Italië", color: "#22c55e", icon: "🇮🇹", logo: "/logos/la-valle-incantata.jpg" },
      { name: "ENPA Italia", url: "https://www.enpa.org", email: "info@enpa.org", location: "Italië", color: "#f43f5e", icon: "🐕", logo: "/logos/enpa-italia.png" },
      { name: "LAV Italia", url: "https://www.lav.it", email: "info@lav.it", location: "Italië", color: "#0ea5e9", icon: "🐾", logo: "/logos/lav-italia.png" },
      { name: "Tierheim Basel TBB", url: "https://www.tbb.ch", email: "info@tbb.ch", location: "Zwitserland", color: "#0d9488", icon: "🇨🇭", logo: "/logos/tierheim-basel-tbb.png" },
      { name: "Stiftung Tierrettungsdienst", url: "https://www.tierrettungsdienst.ch", email: "info@tierrettungsdienst.ch", location: "Zwitserland", color: "#14b8a6", icon: "🐾", logo: "/logos/tierrettungsdienst.svg" },
      { name: "Schweizer Tierschutz STS", url: "https://www.tierschutz.com", email: "info@tierschutz.com", location: "Zwitserland", color: "#22c55e", icon: "🇨🇭", logo: "/logos/schweizer-tierschutz-sts.png" },
      { name: "Tierschutzverein Liechtenstein", url: "https://www.tierschutzverein.li", email: "info@tierschutzverein.li", location: "Liechtenstein", color: "#8b5cf6", icon: "🇱🇮", logo: "/logos/tierschutzverein-liechtenstein.jpg" },
      { name: "SPA Monaco", url: "https://www.spamonaco.mc", email: "adoption@spamonaco.mc", location: "Monaco", color: "#ffffff", icon: "🇲🇨", logo: "/logos/spa-monaco.png" },
      { name: "ALPA Luxembourg", url: "https://www.alpa.lu", email: "info@alpa.lu", location: "Luxemburg", color: "#f97316", icon: "🇱🇺", logo: "/logos/alpa-luxembourg.png" },
      { name: "Dyreværnet Denmark", url: "https://www.dyrevaernet.dk", email: "info@dyrevaernet.dk", location: "Denemarken", color: "#0ea5e9", icon: "🇩🇰", logo: "/logos/dyrevaernet-denmark.png" },
      { name: "Dyrebeskyttelsen Norge", url: "https://www.dyrebeskyttelsen.no", email: "post@dyrebeskyttelsen.no", location: "Noorwegen", color: "#ef4444", icon: "🇳🇴", logo: "/logos/dyrebeskyttelsen-norge.png" },
      { name: "HESY Helsinki", url: "https://www.hesy.fi", email: "hesy@hesy.fi", location: "Finland", color: "#3b82f6", icon: "🇫🇮", logo: "/logos/hesy-helsinki.png" },
      { name: "Viikki Animal Shelter", url: "https://www.viikinloytoelaintalo.fi", email: "viikki@hesy.fi", location: "Helsinki", color: "#06b6d4", icon: "🐕", logo: "/logos/viikki-animal-shelter.jpg" },
      { name: "Hundar Utan Hem", url: "https://www.hundarutanhem.se", email: "info@hundarutanhem.se", location: "Zweden", color: "#a855f7", icon: "🇸🇪", logo: "/logos/hundar-utan-hem.jpg" },
      { name: "Tails Rescue Sweden", url: "https://tailsrescuesweden.org", email: "info@tailsrescuesweden.org", location: "Zweden", color: "#14b8a6", icon: "🐾", logo: "/logos/tails-rescue-sweden.png" },
      { name: "Dog Rescue Auktsjaur", url: "https://www.dogrescueauktsjaur.com", email: "info@dogrescueauktsjaur.com", location: "Zweden", color: "#22c55e", icon: "🐕", logo: "/logos/dog-rescue-auktsjaur.jpg" },
      { name: "SPCA Sweden", url: "https://spcasweden.se", email: "info@spcasweden.se", location: "Zweden", color: "#f43f5e", icon: "🇸🇪", logo: "/logos/spca-sweden.png" },
      { name: "SOS Animals Sweden", url: "https://www.sos-animals.se", email: "info@sos-animals.se", location: "Zweden", color: "#eab308", icon: "🐾", logo: "/logos/sos-animals-sweden.jpg" },
      { name: "Wiener Tierschutzverein", url: "https://www.tierschutz-austria.at", email: "kundenservice@tierschutz-austria.at", location: "Oostenrijk", color: "#6366f1", icon: "🇦🇹", logo: "/logos/wiener-tierschutzverein.jpg" },
      { name: "Tierschutzverein Wien", url: "https://www.tierschutzverein.at", email: "office@tierschutzverein.at", location: "Oostenrijk", color: "#8b5cf6", icon: "🐕", logo: "/logos/tierschutzverein-wien.jpg" },
      { name: "Franziskus Tierheim Hamburg", url: "https://www.franziskustierheim.de", email: "info@franziskustierheim.de", location: "Duitsland", color: "#0d9488", icon: "🇩🇪", logo: "/logos/franziskus-tierheim-hamburg.png" },
      { name: "Hamburger Tierschutzverein", url: "https://www.hamburger-tierschutzverein.de", email: "info@hamburger-tierschutzverein.de", location: "Hamburg", color: "#14b8a6", icon: "🐶", logo: "/logos/hamburger-tierschutzverein.png" },
      { name: "Deutscher Tierschutzbund", url: "https://www.tierschutzbund.de", email: "bg@tierschutzbund.de", location: "Duitsland", color: "#22c55e", icon: "🇩🇪", logo: "/logos/deutscher-tierschutzbund.jpg" },
      { name: "Stichting Adopt.nl", url: "https://adoptnl.org", email: "info@adoptnl.org", location: "Nederland", color: "#06b6d4", icon: "🇳🇱", logo: "/logos/stichting-adopt-nl.jpg" },
      { name: "Scottish SPCA", url: "https://www.scottishspca.org", email: "info@scottishspca.org", location: "Schotland", color: "#f97316", icon: "🇬🇧", logo: "/logos/scottish-spca.png" },
      { name: "Animal Rescue Cymru", url: "https://www.animalrescuecymru.co.uk", email: "rehoming@animalrescuecymru.co.uk", location: "Wales", color: "#ec4899", icon: "🇬🇧", logo: "/logos/animal-rescue-cymru.jpg" },
      { name: "Islay Dog Rescue", url: "https://www.islaydogrescue.org.uk", email: "islaydogrescue@yahoo.co.uk", location: "Schotland", color: "#0ea5e9", icon: "🐕", logo: "/logos/islay-dog-rescue.jpg" },
      { name: "ENPA Pistoia", url: "https://www.enpapistoia.it", email: "pistoia@enpa.org", location: "Italië", color: "#f43f5e", icon: "🇮🇹", logo: "/logos/enpa-pistoia.png" },
      { name: "ENPA Genova", url: "https://www.enpagenova.org", email: "genova@enpa.org", location: "Italië", color: "#eab308", icon: "🐕", logo: "/logos/enpa-genova.png" },
      { name: "Dyrenes Frie Farm", url: "https://dyrenesfriefarm.dk", email: "kontakt@dyrenesfriefarm.dk", location: "Denemarken", color: "#84cc16", icon: "🇩🇰", logo: "/logos/dyrenes-frie-farm.png" },
      { name: "Dyrebeskyttelsen Oslo", url: "https://www.dyrebeskyttelsen.no", email: "nord-jaeren@dyrebeskyttelsen.no", location: "Noorwegen", color: "#ef4444", icon: "🇳🇴", logo: "/logos/dyrebeskyttelsen-oslo.png" },
      { name: "SPA Nice", url: "https://www.la-spa.fr", email: "nice@la-spa.fr", location: "Frankrijk", color: "#f97316", icon: "🇫🇷", logo: "/logos/spa-nice.png" },
      { name: "SPA Paris", url: "https://www.la-spa.fr", email: "contact@la-spa.fr", location: "Frankrijk", color: "#06b6d4", icon: "🇫🇷", logo: "/logos/spa-paris.png" },
      { name: "Tierheim Pfötli", url: "https://www.tierrettungsdienst.ch", email: "info@tierrettungsdienst.ch", location: "Zwitserland", color: "#10b981", icon: "🇨🇭", logo: "/logos/tierheim-pfoetli.svg" },
      { name: "Schweizer Tierschutz Basel", url: "https://www.tierschutz.com", email: "basel@tierschutz.com", location: "Zwitserland", color: "#0d9488", icon: "🇨🇭", logo: "/logos/schweizer-tierschutz-basel.jpg" },
      { name: "ENPA Faenza", url: "https://www.enpa.org", email: "faenza@enpa.org", location: "Italië", color: "#14b8a6", icon: "🐕", logo: "/logos/enpa-faenza.png" },
      { name: "Animal Equality Italia", url: "https://www.animalequality.it", email: "info@animalequality.org", location: "Italië", color: "#ec4899", icon: "🇮🇹", logo: "/logos/animal-equality-italia.png" },
      { name: "Scottish Animal Welfare", url: "https://www.scottishanimalwelfare.org.uk", email: "info@scottishanimalwelfare.org.uk", location: "Schotland", color: "#3b82f6", icon: "🇬🇧", logo: "/logos/scottish-animal-welfare.png" },
      { name: "TierQuarTier Wien", url: "https://www.tierquartier.at/Unsere-Tiere/", email: "tierquartier@ma60.wien.gv.at", location: "Oostenrijk", color: "#6366f1", icon: "🇦🇹", logo: "/logos/tierheim-wien.png" },
      { name: "Dyreværnet Kolding", url: "https://www.dyrevaernet.dk", email: "info@dyrevaernet.dk", location: "Denemarken", color: "#06b6d4", icon: "🇩🇰", logo: "/logos/dyrevaernet-kolding.png" },
      { name: "Dyrebeskyttelsen Nord-Jæren", url: "https://www.dyrebeskyttelsen.no", email: "nord-jaeren@dyrebeskyttelsen.no", location: "Noorwegen", color: "#f97316", icon: "🇳🇴", logo: "/logos/dyrebeskyttelsen-nord-jaeren.jpg" },
      { name: "Tierschutz Linth", url: "https://www.tierschutzlinth.ch", email: "info@tierschutzlinth.ch", location: "Zwitserland", color: "#10b981", icon: "🇨🇭", logo: "/logos/tierschutz-linth.png" },
      { name: "STS Schweizer Tierschutz", url: "https://www.sts-psa.ch", email: "info@sts-psa.ch", location: "Zwitserland", color: "#22c55e", icon: "🇨🇭", logo: "/logos/sts-schweizer-tierschutz.png" },
      { name: "LAV Bergamo", url: "https://www.lav.it", email: "bergamo@lav.it", location: "Italië", color: "#0ea5e9", icon: "🇮🇹", logo: "/logos/lav-bergamo.jpg" },
      { name: "LAV Bologna", url: "https://www.lav.it", email: "bologna@lav.it", location: "Italië", color: "#14b8a6", icon: "🇮🇹", logo: "/logos/lav-bologna.jpg" },
    ],
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shelters" });
  return {
    title: `${t("title")} | Saved Souls Foundation`,
    description: t("metaDescription"),
  };
}

export default async function SheltersPage() {
  const t = await getTranslations("shelters");
  const tPartners = await getTranslations("partners");
  const tCommon = await getTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: ACCENT_GREEN }}>
            {t("heroTitle")}
          </h1>
          <div className="inline-flex gap-3 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>🐕</span>
            <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>🐈</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>❤️</span>
            <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>🌍</span>
          </div>
        </header>

        {/* Onze partners – prominent bovenaan */}
        <section className="mb-16 md:mb-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-3xl">🤝</span>
              <span className="text-3xl">❤️</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: PINK }}>
              {t("proudPartnersTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
              {t("proudPartnersSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {PARTNERS.map((partner) => (
              <a
                key={partner.key}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden border-2 bg-white/95 dark:bg-stone-900/95 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-8 md:p-10 relative border-slate-400/70 dark:border-slate-500/70 hover:border-slate-500 dark:hover:border-slate-400 ring-2 ring-slate-300/40 dark:ring-slate-600/40"
              >
                <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 text-slate-800 dark:text-slate-100 border border-slate-400/50 dark:border-slate-500 shadow-sm">
                  ★ {t("platinumPartner")}
                </span>
                <div className="flex flex-col items-center text-center">
                  <div className="w-40 h-40 mb-6 flex items-center justify-center">
                    <Image
                      src={partner.logo}
                      alt={tPartners(`${partner.key}.fullName`)}
                      width={160}
                      height={160}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2" style={{ color: PINK }}>
                    {tPartners(`${partner.key}.fullName`)}
                  </h3>
                  <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {tPartners(`${partner.key}.description`)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 group-hover:gap-3 transition-all">
                    {tPartners("visitWebsite")}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Other shelters – tekst onder de partners */}
        <div className="text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <SheltersSearch
          shelters={SHELTERS}
          visitSite={t("visitSite")}
          searchPlaceholder={t("searchPlaceholder")}
          noResults={t("noResults")}
          thailandTitle={t("thailandTitle")}
          europeTitle={t("europeTitle")}
        />

        <section className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-200/50 dark:border-amber-800/30">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("linkExchangeTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-4">
            {t("linkExchangeText")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("contactUs")}
          </Link>
        </section>
      </main>

      <Footer />
    </ParallaxPage>
  );
}
