import type { Metadata } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import AuthErrorRedirect from "./AuthErrorRedirect";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.savedsouls-foundation.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LOCALE_PREFIX = /^\/(nl|en|de|es|th|ru|fr)(\/|$)/;
function stripLeadingLocales(path: string): string {
  let p = path || "/";
  while (LOCALE_PREFIX.test(p)) {
    p = p.replace(LOCALE_PREFIX, "$2") || "/";
  }
  return p || "/";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const headersList = await headers();
  const pathWithoutLocale = stripLeadingLocales(headersList.get("x-path-without-locale") ?? "/");
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("title");
  const description = t("description");
  const localeUrl = `${BASE_URL}/${locale}`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
      languages: {
        nl: `${BASE_URL}/nl${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
        en: `${BASE_URL}/en${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
        es: `${BASE_URL}/es${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
        ru: `${BASE_URL}/ru${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
        th: `${BASE_URL}/th${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
        de: `${BASE_URL}/de${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
        fr: `${BASE_URL}/fr${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
        "x-default": `${BASE_URL}/en${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`,
      },
    },
    openGraph: {
      title,
      description,
      url: localeUrl,
      siteName: "SavedSouls Foundation",
      locale,
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.jpg`],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages: Record<string, unknown> | undefined;
  try {
    messages = await getMessages();
  } catch (e) {
    console.error("[locale layout] getMessages failed:", e);
  }
  if (messages == null || typeof messages !== "object") {
    messages = {};
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "SavedSouls Foundation",
    url: "https://www.savedsouls-foundation.com",
    logo: "https://www.savedsouls-foundation.com/logo.png",
    description: "Animal rescue sanctuary in Thailand rescuing dogs and cats from the illegal dog meat trade and the streets.",
    foundingDate: "2010",
    address: {
      "@type": "PostalAddress",
      streetAddress: "133 Ban Khok Ngam",
      addressLocality: "Ban Fang",
      addressRegion: "Khon Kaen",
      postalCode: "40270",
      addressCountry: "TH",
    },
    sameAs: [
      "https://www.facebook.com/savedsoulsfoundation",
      "https://www.instagram.com/savedsoulsfoundation",
    ],
  };

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <AuthErrorRedirect />
      </Suspense>
      {children}
    </NextIntlClientProvider>
  );
}