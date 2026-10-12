import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/app/components/Footer";
import ParallaxPage from "@/app/components/ParallaxPage";
import { Link } from "@/i18n/navigation";
import { alternatesForPath } from "@/lib/metadata";
import {
  POSTER_PARTNERS,
  SITE_URL,
  SSF_ORGANIZATION,
  jsonLdHtml,
  localBusinessSchema,
  postalAddress,
  posterPartnerBySlug,
} from "@/lib/partners";
import PartnerActions from "../PartnerActions";

const PINK = "#ec4899";

// Eén pagina per poster-partner: "<bedrijf> steunt Saved Souls Foundation".
// Zo vinden zoekmachines en AI-assistenten bij een zoekopdracht op het bedrijf ook Saved Souls.

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTER_PARTNERS.filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const partner = posterPartnerBySlug(slug);
  if (!partner) return {};
  const t = await getTranslations({ locale, namespace: "partners" });
  const title = t("posterPartnerMetaTitle", { name: partner.name });
  const description = t(`${partner.key}.description`);
  const place = partner.address ? postalAddress(partner.address).addressLocality : undefined;
  return {
    title,
    description,
    keywords: [partner.name, `${partner.name} Saved Souls`, `${partner.name} Saved Souls Foundation`, "Saved Souls Foundation", ...(place ? [place] : [])],
    alternates: alternatesForPath(`/partners/${slug}`, locale),
    openGraph: {
      title,
      description,
      ...(partner.logo ? { images: [{ url: `${SITE_URL}${partner.logo}`, alt: partner.name }] } : {}),
    },
  };
}

export default async function PosterPartnerPage({ params }: Props) {
  const { locale, slug } = await params;
  const partner = posterPartnerBySlug(slug);
  if (!partner) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partners" });

  const title = t("posterPartnerTitle", { name: partner.name });
  const description = t(`${partner.key}.description`);
  const pageUrl = `${SITE_URL}/${locale}/partners/${slug}`;
  const photos = [partner.logo, ...(partner.gallery ?? [])].filter(Boolean) as string[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: pageUrl,
    inLanguage: locale,
    about: [localBusinessSchema(partner, description, locale), SSF_ORGANIZATION],
    isPartOf: { "@type": "CollectionPage", url: `${SITE_URL}/${locale}/partners` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("metaTitle"), item: `${SITE_URL}/${locale}/partners` },
        { "@type": "ListItem", position: 2, name: partner.name, item: pageUrl },
      ],
    },
  };

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp" speed={0.2}>
      <script id="poster-partner-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }} />
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4" aria-hidden>
            <span className="text-4xl">❤️</span>
            <span className="text-4xl">🤝</span>
            <span className="text-4xl">🐾</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-3">{title}</h1>
          {partner.address ? <p className="text-stone-600 dark:text-stone-400">📍 {partner.address}</p> : null}
        </header>

        {photos[0] ? (
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200/50 dark:border-rose-900/30 mb-6">
            <a href={photos[0]} target="_blank" rel="noopener noreferrer" className="block">
              <img src={photos[0]} alt={t("posterPhotoAlt", { name: partner.name })} className="w-full h-auto object-cover object-center" />
            </a>
          </div>
        ) : null}

        {photos.length > 1 ? (
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
            {photos.slice(1).map((src, i) => (
              <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={src}
                  alt={`${t("posterPhotoAlt", { name: partner.name })} ${i + 2}`}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg border border-stone-200/80 dark:border-stone-700 transition-transform duration-300 hover:scale-[1.02]"
                />
              </a>
            ))}
          </div>
        ) : null}

        <section className="rounded-2xl bg-white/95 dark:bg-stone-900/95 border-2 border-rose-200/50 dark:border-rose-900/30 p-6 md:p-8 shadow-lg mb-8 text-center space-y-5">
          <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed">{description}</p>
          <PartnerActions
            partner={partner}
            visitWebsite={t("visitWebsite")}
            viewOnMaps={t("posterViewOnMaps")}
            callLabel={t("posterCall")}
          />
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-2 border-rose-200/50 dark:border-rose-900/30 p-6 md:p-8 shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-3" style={{ color: PINK }}>
            {t("posterPartnerAboutTitle")}
          </h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{t("posterPartnerAbout")}</p>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform"
            style={{ backgroundColor: PINK }}
          >
            {t("posterPartnerDonate")}
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-stone-700 dark:text-stone-200 border-2 border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            ← {t("posterPartnerAllPartners")}
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
