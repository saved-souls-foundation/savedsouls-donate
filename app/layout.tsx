import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saved Souls Foundation | Donate, Adopt & Sponsor Disabled Dogs in Thailand",
  description:
    "Saved Souls Foundation in Khon Kaen, Thailand: the only shelter that never rejects paralyzed or special needs dogs. Rescue stray dogs, adopt rescued dogs, sponsor wheelchair dogs. Donate since 2010.",
  keywords: ["Saved Souls Foundation", "Thailand", "Khon Kaen", "disabled dogs", "rescued dogs", "stray dogs", "wheelchair dogs", "paralyzed dogs", "dog rescue Thailand", "animal shelter Thailand", "donate", "adopt dog", "sponsor dog"],
  authors: [{ name: "Saved Souls Foundation", url: "https://savedsouls-foundation.org" }],
  openGraph: {
    title: "Saved Souls Foundation | Donate, Adopt & Sponsor Disabled Dogs",
    description:
      "Saved Souls Foundation Khon Kaen: rescue stray dogs, adopt rescued dogs, sponsor wheelchair dogs. The only shelter in Thailand for paralyzed and special needs animals.",
    type: "website",
    images: [
      {
        url: "/savedsoul-logo.webp",
        width: 1200,
        height: 630,
        alt: "Saved Souls Foundation – Animal sanctuary in Khon Kaen, Thailand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saved Souls Foundation | Donate & Adopt Disabled Dogs",
    description: "Saved Souls Foundation: dog rescue shelter in Khon Kaen, Thailand. Rescued dogs, stray dogs, wheelchair dogs. Donate, adopt, sponsor.",
    images: ["/savedsoul-logo.webp"],
  },
  robots: "index, follow",
  metadataBase: new URL("https://savedsouls-foundation.org"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Saved Souls Foundation",
  description: "Saved Souls Foundation in Khon Kaen, Thailand: the only shelter that never rejects paralyzed or special needs dogs. Rescue stray dogs, adopt rescued dogs, sponsor wheelchair dogs.",
  url: "https://savedsouls-foundation.org",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Khon Kaen",
    addressRegion: "Khon Kaen",
    addressCountry: "TH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 16.4322,
    longitude: 102.8236,
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@savedsouls-foundation.org",
    contactType: "general",
    availableLanguage: ["Dutch", "English", "German", "Thai", "Russian"],
  },
  foundingDate: "2010",
  areaServed: "Thailand",
  keywords: "dog rescue Thailand, disabled dogs, wheelchair dogs, animal shelter Khon Kaen, pet nutrition, dog health, cat health, first aid pets",
  knowsAbout: [
    "disability",
    "paralyzed dogs",
    "wheelchair dogs",
    "animal rescue",
    "dog adoption",
    "cat adoption",
    "pet nutrition",
    "dog health",
    "cat health",
    "vaccinations",
    "first aid for dogs and cats",
    "pet care for beginners",
  ],
};

const LOCALE_TO_LANG: Record<string, string> = {
  nl: "nl",
  en: "en",
  de: "de",
  th: "th",
  ru: "ru",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") || "nl";
  const lang = LOCALE_TO_LANG[locale] || locale;

  return (
    <html lang={lang}>
      <body
        className="antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
