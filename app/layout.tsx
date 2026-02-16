import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Saved Souls Foundation | Donate & Adopt Disabled Dogs",
    description: "Saved Souls Foundation: dog rescue shelter in Khon Kaen, Thailand. Rescued dogs, stray dogs, wheelchair dogs. Donate, adopt, sponsor.",
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
    addressCountry: "TH",
  },
  foundingDate: "2010",
  areaServed: "Thailand",
  keywords: "dog rescue Thailand, disabled dogs, wheelchair dogs, animal shelter Khon Kaen",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
