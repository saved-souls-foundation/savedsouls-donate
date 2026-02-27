import type { Metadata } from "next";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { DeferredStyles } from "./DeferredStyles";

/** Inline critical CSS voor first paint / LCP – hoofdbundle CSS laadt async via DeferredStyles */
const CRITICAL_CSS = `:root{--background:#fff;--foreground:#171717}body{background:var(--background);color:var(--foreground);font-family:var(--font-geist-sans),system-ui,sans-serif}.relative{position:relative}.absolute{position:absolute}.inset-0{inset:0}.w-full{width:100%}.h-full{height:100%}.object-cover{object-fit:cover}.flex{display:flex}.min-h-\\[100svh\\]{min-height:100svh}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.text-center{text-align:center}.z-10{z-index:10}.max-w-3xl{max-width:48rem}.mx-auto{margin-left:auto;margin-right:auto}.hero-animate-location,.hero-animate-headline,.hero-animate-subtitle,.hero-animate-ctas,.hero-animate-scroll{opacity:0;transform:translateY(20px)}[data-hero-visible] .hero-animate-location,[data-hero-visible] .hero-animate-headline,[data-hero-visible] .hero-animate-subtitle,[data-hero-visible] .hero-animate-ctas,[data-hero-visible] .hero-animate-scroll{opacity:1;transform:translateY(0)}`;

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
  "@type": "NGO",
  name: "Saved Souls Foundation",
  description: "Animal rescue sanctuary in Khon Kaen, Thailand. The only shelter that never rejects paralyzed or special needs dogs. Rescue stray dogs, adopt rescued dogs, sponsor wheelchair dogs.",
  url: "https://www.savedsouls-foundation.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ban Khok Ngam, Ban Fang",
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
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        {/* LCP: hero op homepage – mobiel lichte variant, desktop volledige */}
        <link rel="preload" href="/woman-dog-wheelchair-mobile.webp" as="image" media="(max-width: 768px)" />
        <link rel="preload" href="/woman-dog-wheelchair.webp" as="image" media="(min-width: 769px)" />
        {googleSiteVerification && (
          <meta name="google-site-verification" content={googleSiteVerification} />
        )}
      </head>
      <body className={`${GeistSans.variable} ${GeistSans.className} ${GeistMono.variable} antialiased`}>
        <DeferredStyles />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
