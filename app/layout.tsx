import type { Metadata } from "next";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { DeferredStyles } from "./DeferredStyles";
import { GoogleAnalytics } from "./GoogleAnalytics";

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
  metadataBase: new URL("https://www.savedsouls-foundation.com"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["NGO", "AnimalShelter"],
  name: "Saved Souls Foundation",
  description: "Animal rescue sanctuary in Khon Kaen, Thailand. The only shelter that never rejects paralyzed or special needs dogs. Rescue stray dogs, adopt rescued dogs, sponsor wheelchair dogs.",
  url: "https://www.savedsouls-foundation.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "133, Ban Khok Ngam, Ban Fang District, Khon Kaen 40270, Thailand",
    addressLocality: "Ban Khok Ngam, Ban Fang",
    addressRegion: "Khon Kaen",
    postalCode: "40270",
    addressCountry: "TH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 16.4322,
    longitude: 102.8236,
  },
  openingHours: "Mo-Su 13:30-15:30",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@savedsouls-foundation.org",
    contactType: "general",
    availableLanguage: ["Dutch", "English", "German", "Spanish", "Thai", "Russian"],
  },
  foundingDate: "2010",
  founder: {
    "@type": "Person",
    name: "Gabriela Leonhard",
  },
  employee: {
    "@type": "Person",
    name: "Melanie de Wit",
    jobTitle: "Manager",
  },
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
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Dogs in care",
      value: 430,
    },
    {
      "@type": "PropertyValue",
      name: "Cats in care",
      value: 91,
    },
  ],
};

const LOCALE_TO_LANG: Record<string, string> = {
  nl: "nl",
  en: "en",
  de: "de",
  es: "es",
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
  const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return (
    <html lang={lang}>
      <head>
        {/* LCP: hero op homepage – mobiel lichte variant, desktop volledige */}
        <link rel="preload" href="/woman-dog-wheelchair-mobile.webp" as="image" media="(max-width: 768px)" />
        <link rel="preload" href="/woman-dog-wheelchair.webp" as="image" media="(min-width: 769px)" />
        {googleSiteVerification && (
          <meta name="google-site-verification" content={googleSiteVerification} />
        )}
        {/* Travelpayouts – laadt na window.load om laadsnelheid niet te beïnvloeden */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  function load() {
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://tpembars.com/NTAzMDQ0.js?t=503044";
    document.head.appendChild(script);
  }
  if (typeof window !== "undefined") {
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load);
  }
})();
            `.trim(),
          }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistSans.className} ${GeistMono.variable} antialiased`}>
        {/* Consent Mode v2: default denied vóór GA4 – AVG/GDPR compliant */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
              });
            `,
          }}
        />
        <DeferredStyles />
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
