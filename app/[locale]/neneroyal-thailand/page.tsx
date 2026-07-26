import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const BASE_URL = "https://www.savedsouls-foundation.org";
const ACCENT_GREEN = "#2aa348";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoObject",
      name: "NENEROYAL live optreden Phuket Thailand",
      description:
        "Live opgenomen beeldmateriaal van NENEROYAL, rockzangeres actief in Phuket, Thailand. Eigen opname.",
      thumbnailUrl: "https://img.youtube.com/vi/HOZ0_q0QsQI/maxresdefault.jpg",
      uploadDate: "2026-07-26",
      embedUrl: "https://www.youtube.com/embed/HOZ0_q0QsQI",
      url: "https://www.youtube.com/watch?v=HOZ0_q0QsQI",
      author: {
        "@type": "Organization",
        name: "Saved Souls Foundation",
        url: BASE_URL,
      },
    },
    {
      "@type": "ImageObject",
      contentUrl: `${BASE_URL}/naka-market-1.jpg`,
      name: "Naka Market Phuket — sfeer en kraampjes",
      description:
        "Naka Market Phuket — sfeer en kraampjes op het grootste weekendmarkt van Phuket, Thailand",
      author: {
        "@type": "Organization",
        name: "Saved Souls Foundation",
        url: BASE_URL,
      },
    },
    {
      "@type": "ImageObject",
      contentUrl: `${BASE_URL}/naka-market-2.jpg`,
      name: "Live optreden op de Naka Market Phuket Thailand",
      description:
        "Live optreden op de Naka Market Phuket Thailand — NENEROYAL op het nieuwe podium",
      author: {
        "@type": "Organization",
        name: "Saved Souls Foundation",
        url: BASE_URL,
      },
    },
    {
      "@type": "ImageObject",
      contentUrl: `${BASE_URL}/naka-market-3.jpg`,
      name: "Publiek bij live muziek Naka Market Phuket",
      description:
        "Publiek bij live muziek Naka Market Phuket — locals en toeristen genieten van het optreden",
      author: {
        "@type": "Organization",
        name: "Saved Souls Foundation",
        url: BASE_URL,
      },
    },
    {
      "@type": "Person",
      name: "NENEROYAL",
      jobTitle: "Rock zangeres",
      location: {
        "@type": "Place",
        name: "Phuket, Thailand",
      },
    },
    {
      "@type": "NGO",
      name: "Saved Souls Foundation",
      url: BASE_URL,
      description:
        "Dierenopvang in Khon Kaen, Thailand. Redt honden en katten inclusief verlamde en gehandicapte dieren.",
      location: {
        "@type": "Place",
        name: "Khon Kaen, Thailand",
      },
    },
  ],
};

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "NENEROYAL live in Thailand | Saved Souls Foundation",
    description:
      "NENEROYAL, rock zangeres uit Phuket Thailand, gefilmd tijdens een live optreden. Saved Souls Foundation redt honden en katten in Khon Kaen, Thailand.",
    keywords: [
      "NENEROYAL",
      "NENEROYAL Thailand",
      "NENEROYAL Phuket",
      "NENEROYAL rock zangeres",
      "NENEROYAL live",
      "NENEROYAL concert Phuket",
      "rock muziek Thailand",
      "Phuket live muziek",
      "Thailand muziek scene",
      "Saved Souls Foundation Thailand",
      "honden redden Thailand",
      "Khon Kaen animal rescue",
    ],
    openGraph: {
      title: "NENEROYAL live in Phuket — Thailand heeft twee gezichten",
      description:
        "Muziek op straat in Phuket. Honden zonder thuis in Khon Kaen. Één land, twee verhalen. Saved Souls Foundation is er voor de honden.",
      images: ["https://img.youtube.com/vi/HOZ0_q0QsQI/maxresdefault.jpg"],
      type: "article",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: "NENEROYAL live in Phuket Thailand",
      description:
        "Gefilmd tijdens live optreden in Phuket. Thailand is meer dan toerisme.",
      images: ["https://img.youtube.com/vi/HOZ0_q0QsQI/maxresdefault.jpg"],
    },
    alternates: {
      canonical: `https://www.savedsouls-foundation.org/${locale}/neneroyal-thailand`,
      languages: {
        nl: "https://www.savedsouls-foundation.org/nl/neneroyal-thailand",
        en: "https://www.savedsouls-foundation.org/en/neneroyal-thailand",
        th: "https://www.savedsouls-foundation.org/th/neneroyal-thailand",
        fr: "https://www.savedsouls-foundation.org/fr/neneroyal-thailand",
        es: "https://www.savedsouls-foundation.org/es/neneroyal-thailand",
        de: "https://www.savedsouls-foundation.org/de/neneroyal-thailand",
      },
    },
  };
}

export default async function NeneroyalThailandPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations("common");
  const tNeneroyal = await getTranslations("neneroyal");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>
            Saved Souls
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
        >
          ← {tCommon("backToHome")}
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <article lang={locale} className="prose prose-stone dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-6">
            {tNeneroyal("heroHeadline")}
          </h1>
          <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed mb-8">
            {tNeneroyal("heroIntro")}
          </p>

          <div className="not-prose mb-10 rounded-2xl overflow-hidden bg-black shadow-xl">
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/HOZ0_q0QsQI?rel=0&modestbranding=1"
                title="NENEROYAL live Naka Market Phuket Thailand"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            </div>
          </div>

          <section aria-label="Naka Market Phuket foto's" className="not-prose">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
                margin: "2rem 0",
              }}
            >
              <img
                src="/naka-market-1.jpg"
                alt="Naka Market Phuket — sfeer en kraampjes op het grootste weekendmarkt van Phuket, Thailand"
                style={{ width: "100%", borderRadius: "8px", objectFit: "cover", aspectRatio: "4/3" }}
              />
              <img
                src="/naka-market-2.jpg"
                alt="Live optreden op de Naka Market Phuket Thailand — NENEROYAL op het nieuwe podium"
                style={{ width: "100%", borderRadius: "8px", objectFit: "cover", aspectRatio: "4/3" }}
              />
              <img
                src="/naka-market-3.jpg"
                alt="Publiek bij live muziek Naka Market Phuket — locals en toeristen genieten van het optreden"
                style={{ width: "100%", borderRadius: "8px", objectFit: "cover", aspectRatio: "4/3" }}
              />
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {tNeneroyal("nakaH2")}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("nakaP1")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {tNeneroyal("nakaP2")}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {tNeneroyal("neneroylH2")}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("neneroyalP1")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("neneroyalP2")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {tNeneroyal("neneroyalP3")}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {tNeneroyal("bridgeH2")}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("bridgeP1")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("bridgeP2")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {tNeneroyal("bridgeP3")}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {tNeneroyal("ssfH2")}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("ssfP1")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
              {tNeneroyal("ssfP2")}
            </p>
            <p className="not-prose">
              <a
                href={`/${locale}/donate`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white shadow-lg hover:opacity-95"
                style={{ backgroundColor: "#7B1010" }}
              >
                {tNeneroyal("ssfCta")}
              </a>
            </p>
          </section>

          <section lang="th" className="mb-10">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {tNeneroyal("thaiH2")}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("thaiP1")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("thaiP2")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("thaiP3")}
            </p>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {tNeneroyal("thaiH3")}
            </h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
              {tNeneroyal("thaiP4")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {tNeneroyal("thaiP5")}
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
