import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesForPath } from "@/lib/metadata";
import { PARTNERS, POSTER_PARTNERS, postalAddress } from "@/lib/partners";

const BASE_URL = "https://www.savedsouls-foundation.org";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });
  const names = POSTER_PARTNERS.map((p) => p.name);
  const description = t("metaDescription", { names: names.join(", ") });
  const places = [...new Set(POSTER_PARTNERS.map((p) => p.address && postalAddress(p.address).addressLocality).filter(Boolean))] as string[];
  return {
    title: t("metaTitle"),
    description,
    keywords: ["Saved Souls Foundation", ...names, ...names.map((n) => `${n} Saved Souls`), ...places],
    alternates: alternatesForPath("/partners", locale),
    openGraph: {
      title: t("metaTitle"),
      description,
    },
  };
}

export default async function PartnersLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partners" });
  const pageUrl = `${BASE_URL}/${locale}/partners`;

  // Elke partner als eigen entiteit op een pagina over Saved Souls, met een beschrijving
  // die de relatie noemt, zodat zoekmachines en AI-assistenten bedrijf en stichting koppelen.
  const organization = {
    "@type": "NGO",
    name: "Saved Souls Foundation",
    url: BASE_URL,
  };

  const posterBusinesses = POSTER_PARTNERS.map((p) => ({
    "@type": "LocalBusiness",
    name: p.name,
    description: t(`${p.key}.description`),
    ...(p.url ? { url: p.url } : {}),
    ...(p.phone ? { telephone: p.phone } : {}),
    ...(p.logo ? { image: `${BASE_URL}${p.logo}` } : {}),
    ...(p.address ? { address: { "@type": "PostalAddress", ...postalAddress(p.address), addressCountry: "NL" } } : {}),
  }));

  const partnersSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("metaTitle"),
    url: pageUrl,
    inLanguage: locale,
    about: organization,
    mentions: [
      ...PARTNERS.map((p) => ({ "@type": "Organization", name: p.name, ...(p.url ? { url: p.url } : {}) })),
      ...posterBusinesses,
    ],
    mainEntity: {
      "@type": "ItemList",
      name: t("posterSectionTitle"),
      itemListElement: posterBusinesses.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
    },
  };

  return (
    <>
      {/* Gewone script-tag (geen next/script): zo staat de JSON-LD direct in de server-HTML,
          ook voor AI-crawlers die geen JavaScript uitvoeren. */}
      <script
        id="partners-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(partnersSchema).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
