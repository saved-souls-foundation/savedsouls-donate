// Partnerdata voor /partners: gedeeld door de pagina (kaarten) en de layout (SEO / JSON-LD).

export type PartnerEntry = {
  name: string;
  key: string;
  url?: string;
  logo?: string;
  shimmer?: boolean;
  logoClassName?: string;
  logoLayout?: "default" | "banner";
  /** "Straat 1, 1234 AB Plaats" */
  address?: string;
  phone?: string;
  phoneDisplay?: string;
};

export const DIERENDOKTERS_URL = "https://www.dierendokters.com/dierenarts-dierenkliniek/haarlem";

export const PARTNERS: PartnerEntry[] = [
  { name: "TVAV", key: "tvav", url: "https://tvav.ch", logo: "/partners/tvav.png" },
  { name: "K9Aid", key: "k9aid", url: "https://k9aid.org", logo: "/partners/k9aid.png" },
  { name: "Project Street Dogs Thailand", key: "streetdogsthailand", url: "https://streetdogsthailand.com", logo: "/partners/streetdogsthailand.png" },
  { name: "GiftHoney", key: "gifthoney", url: "https://gifthoney.co", logo: "/partners/gifthoney.png" },
  { name: "Groenprint", key: "groenprint", url: "https://www.groenprint.nl/", logo: "/groenprint-logo.webp", shimmer: true },
  { name: "DierenDokters Haarlem", key: "dierendoktershaarlem", url: DIERENDOKTERS_URL, logo: "/partners/dierendokters-haarlem/team.png", logoLayout: "banner" },
];

// Bedrijven waar onze Saved Souls-poster hangt. Nieuwe partner: één regel hier
// + partners.<key>.fullName/description in alle messages/*.json.
// Met url → klikbare kaart; zonder url → Google Maps-knop (+ belknop als phone bestaat).
// Ook llms.txt en ai.txt bijwerken, zodat AI-zoekmachines de partner kennen.
export const POSTER_PARTNERS: PartnerEntry[] = [
  { name: "Plieger Haarlem Express", key: "pliegerhaarlem", logo: "/partners/plieger-haarlem/storefront.jpg", logoLayout: "banner", url: "https://plieger.nl/vestigingen/expressen/haarlem", address: "Heringaweg 6E, 2031 BW Haarlem" },
  { name: "Perfect Kledingreparatie", key: "perfectkledingreparatie", logo: "/partners/perfect-kledingreparatie/storefront.jpg", logoLayout: "banner", address: "Rijksstraatweg 535, 2025 DE Haarlem", phone: "+31235386886", phoneDisplay: "023 538 6886" },
  { name: "Sannie's Dierenshop", key: "sanniesdierenshop", logo: "/partners/sannies-dierenshop/storefront.jpg", logoLayout: "banner", address: "Rijksstraatweg 539-541, 2025 DE Haarlem", phone: "+31235376028", phoneDisplay: "023 537 60 28" },
  { name: "Groentenhandel Hans Lücke", key: "hansluecke", logo: "/partners/hans-luecke/storefront.jpg", logoLayout: "banner", address: "Dennenlaan 126-C, 1161 CT Zwanenburg", phone: "+31204975238", phoneDisplay: "020-497 5238" },
  { name: "Dorpshuis Zwanenburg-Halfweg", key: "dorpshuiszwanenburg", logo: "/partners/dorpshuis-zwanenburg/building.jpg", logoLayout: "banner", address: "Dennenlaan 133, 1161 CN Zwanenburg", phone: "+31204974097", phoneDisplay: "020 497 4097" },
  { name: "PC-Depot Halfweg", key: "pcdepothalfweg", logo: "/partners/pc-depot-halfweg/storefront.jpg", logoLayout: "banner", url: "https://www.pcdepot.nl", address: "Oranje Nassaustraat 42, 1165 GN Halfweg", phone: "+31204970069", phoneDisplay: "020 497 0069" },
];

/** Splitst "Straat 1, 1234 AB Plaats" in schema.org PostalAddress-velden. */
export function postalAddress(address: string) {
  const m = address.match(/^(.*),\s*(\d{4}\s?[A-Z]{2})\s+(.+)$/);
  if (m) return { streetAddress: m[1], postalCode: m[2], addressLocality: m[3] };
  const [streetAddress, addressLocality] = address.split(/,\s*/);
  return { streetAddress, addressLocality };
}
