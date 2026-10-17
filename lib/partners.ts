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
  /** Eigen pagina /partners/<slug> (poster-partners) */
  slug?: string;
  /** Extra foto's onder de tekst (staand, 3:4) */
  gallery?: string[];
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
// Met slug → eigen pagina /partners/<slug> (SEO/AI: "<bedrijf> steunt Saved Souls Foundation").
// Ook llms.txt en ai.txt bijwerken, zodat AI-zoekmachines de partner kennen.
export const POSTER_PARTNERS: PartnerEntry[] = [
  { name: "Plieger Haarlem Express", key: "pliegerhaarlem", slug: "plieger-haarlem-express", logo: "/partners/plieger-haarlem/storefront.jpg", logoLayout: "banner", url: "https://plieger.nl/vestigingen/expressen/haarlem", address: "Heringaweg 6E, 2031 BW Haarlem" },
  { name: "Perfect Kledingreparatie", key: "perfectkledingreparatie", slug: "perfect-kledingreparatie-haarlem", logo: "/partners/perfect-kledingreparatie/storefront.jpg", logoLayout: "banner", address: "Rijksstraatweg 535, 2025 DE Haarlem", phone: "+31235386886", phoneDisplay: "023 538 6886" },
  { name: "Sannie's Dierenshop", key: "sanniesdierenshop", slug: "sannies-dierenshop-haarlem", logo: "/partners/sannies-dierenshop/storefront.jpg", logoLayout: "banner", address: "Rijksstraatweg 539-541, 2025 DE Haarlem", phone: "+31235376028", phoneDisplay: "023 537 60 28" },
  { name: "Groentenhandel Hans Lücke", key: "hansluecke", slug: "groentenhandel-hans-lucke-zwanenburg", logo: "/partners/hans-luecke/storefront.jpg", logoLayout: "banner", address: "Dennenlaan 126-C, 1161 CT Zwanenburg", phone: "+31204975238", phoneDisplay: "020-497 5238" },
  { name: "Dorpshuis Zwanenburg-Halfweg", key: "dorpshuiszwanenburg", slug: "dorpshuis-zwanenburg-halfweg", logo: "/partners/dorpshuis-zwanenburg/building.jpg", logoLayout: "banner", address: "Dennenlaan 133, 1161 CN Zwanenburg", phone: "+31204974097", phoneDisplay: "020 497 4097" },
  { name: "PC-Depot Halfweg", key: "pcdepothalfweg", slug: "pc-depot-halfweg", logo: "/partners/pc-depot-halfweg/storefront.jpg", logoLayout: "banner", url: "https://www.pcdepot.nl", address: "Oranje Nassaustraat 42, 1165 GN Halfweg", phone: "+31204970069", phoneDisplay: "020 497 0069", gallery: ["/partners/pc-depot-halfweg/poster-in-shop.jpg", "/partners/pc-depot-halfweg/window.jpg"] },
  { name: "Maxi Zoo Haarlem", key: "maxizoohaarlem", slug: "maxi-zoo-haarlem", logo: "/partners/maxi-zoo-haarlem/storefront.jpg", logoLayout: "banner", address: "Menno Simonszplein 1a, 2014 SC Haarlem", phone: "+31232044930", phoneDisplay: "023 204 4930", gallery: ["/partners/maxi-zoo-haarlem/poster-counter.jpg", "/partners/maxi-zoo-haarlem/entrance.jpg"] },
  { name: "Willemse Dierenvoeders Vijfhuizen", key: "willemsedierenvoeders", slug: "willemse-dierenvoeders-vijfhuizen", logo: "/partners/willemse-dierenvoeders/banner.jpg", logoLayout: "banner", url: "https://www.willemsedierenvoeders.nl/", address: "Vijfhuizerdijk 72, 2141 BC Vijfhuizen", phone: "+31235581271", phoneDisplay: "023 558 1271", gallery: ["/partners/willemse-dierenvoeders/poster-toonbank.jpg", "/partners/willemse-dierenvoeders/winkel.jpg"] },
  { name: "Visspecialist De Dolfijn IJmuiden", key: "dedolfijnijmuiden", slug: "visspecialist-de-dolfijn-ijmuiden", logo: "/partners/de-dolfijn-ijmuiden/gevel.jpg", logoLayout: "banner", address: "Halkade 25, 1976 DC IJmuiden", gallery: ["/partners/de-dolfijn-ijmuiden/poster.jpg", "/partners/de-dolfijn-ijmuiden/winkel.jpg"] },
  { name: "Baco Army Goods IJmuiden", key: "bacoarmygoods", slug: "baco-army-goods-ijmuiden", logo: "/partners/baco-army-goods/gevel.jpg", logoLayout: "banner", url: "https://www.baco-army-goods.nl", address: "Kromhoutstraat 36-38, 1976 BM IJmuiden", phone: "+31255511612", phoneDisplay: "0255 511 612", gallery: ["/partners/baco-army-goods/poster-etalage.jpg", "/partners/baco-army-goods/winkel.jpg"] },
];

/** Splitst "Straat 1, 1234 AB Plaats" in schema.org PostalAddress-velden. */
export function postalAddress(address: string) {
  const m = address.match(/^(.*),\s*(\d{4}\s?[A-Z]{2})\s+(.+)$/);
  if (m) return { streetAddress: m[1], postalCode: m[2], addressLocality: m[3] };
  const [streetAddress, addressLocality] = address.split(/,\s*/);
  return { streetAddress, addressLocality };
}

export function posterPartnerBySlug(slug: string) {
  return POSTER_PARTNERS.find((p) => p.slug === slug);
}

export const SITE_URL = "https://www.savedsouls-foundation.org";

export const SSF_ORGANIZATION = {
  "@type": "NGO",
  name: "Saved Souls Foundation",
  url: SITE_URL,
};

/** schema.org LocalBusiness voor een poster-partner. */
export function localBusinessSchema(p: PartnerEntry, description: string, locale: string) {
  return {
    "@type": "LocalBusiness",
    name: p.name,
    description,
    ...(p.slug ? { "@id": `${SITE_URL}/${locale}/partners/${p.slug}#business` } : {}),
    ...(p.url ? { url: p.url } : {}),
    ...(p.phone ? { telephone: p.phone } : {}),
    ...(p.logo || p.gallery ? { image: [p.logo, ...(p.gallery ?? [])].filter(Boolean).map((src) => `${SITE_URL}${src}`) } : {}),
    ...(p.address ? { address: { "@type": "PostalAddress", ...postalAddress(p.address), addressCountry: "NL" } } : {}),
  };
}

/** JSON-LD veilig in een <script> zetten. */
export function jsonLdHtml(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Google Maps-zoeklink op naam + adres. */
export function mapsSearchUrl(partner: PartnerEntry) {
  const query = [partner.name, partner.address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
