"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";
import FrostDonateCard from "@/app/components/FrostDonateCard";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";
import type { GuideContent } from "@/lib/guides/types";

const ACCENT_GREEN = "#2aa348";

type Props = {
  namespace: string;
  content: GuideContent;
  heroImage: string;
  inlineImage?: string;
  introGradient?: string;
};

function SectionBlock({
  emoji,
  title,
  children,
  variant = "default",
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "urgent" | "muted";
}) {
  const bg =
    variant === "urgent"
      ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30"
      : variant === "muted"
        ? "bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800/50 dark:to-stone-900/50"
        : "bg-white dark:bg-stone-900";

  return (
    <section
      className={`mb-16 rounded-2xl p-6 md:p-10 border-2 border-stone-200 dark:border-stone-700 shadow-lg ${bg}`}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
        {emoji} {title}
      </h2>
      {children}
    </section>
  );
}

export default function SeoGuideArticle({
  namespace,
  content,
  heroImage,
  inlineImage,
  introGradient = "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
}: Props) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const isNl = locale === "nl";

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600">
          {/* TODO: add image: page-specific hero webp */}
          <Image
            src={heroImage}
            alt=""
            width={1200}
            height={630}
            className="w-full h-auto object-cover min-h-[280px] md:min-h-[360px]"
            priority
          />
        </div>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400">
            {content.badgeEmoji} {t("badge")}
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4"
            style={{ color: ACCENT_GREEN }}
          >
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section
          className={`mb-10 rounded-2xl p-6 md:p-10 bg-gradient-to-br ${introGradient} border-2 border-stone-200 dark:border-stone-700 shadow-lg`}
        >
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            {content.intro}
          </p>
        </section>

        {inlineImage && (
          <div className="mb-16 max-w-2xl mx-auto">
            <FrostDonateCard src={inlineImage} alt={t("img1Alt")} namespace={namespace} />
          </div>
        )}

        {content.sections.map((section) => (
          <SectionBlock
            key={section.id}
            emoji={section.emoji}
            title={section.title}
            variant={section.variant}
          >
            {section.paragraphs?.map((p, i) => (
              <p
                key={i}
                className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4 last:mb-0"
              >
                {p}
              </p>
            ))}

            {section.subsections?.map((sub) => (
              <div key={sub.title} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">
                  {sub.title}
                </h3>
                {sub.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="text-stone-600 dark:text-stone-400 leading-relaxed mb-3 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
                {sub.items && (
                  <ul className="space-y-2 text-stone-600 dark:text-stone-400 mt-2">
                    {sub.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {section.numberedItems && (
              <ol className="space-y-3 text-stone-600 dark:text-stone-400 list-decimal list-inside">
                {section.numberedItems.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            )}

            {section.items && (
              <ul className="space-y-2 text-stone-600 dark:text-stone-400">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 leading-relaxed">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.table && (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-stone-200 dark:border-stone-600">
                      {section.table.headers.map((h) => (
                        <th
                          key={h}
                          className="py-3 pr-4 font-semibold text-stone-800 dark:text-stone-100"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-stone-100 dark:border-stone-800"
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="py-3 pr-4 text-stone-600 dark:text-stone-400"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionBlock>
        ))}

        {content.faq.length > 0 && (
          <SectionBlock emoji="❓" title={content.faqTitle ?? "Frequently asked questions"}>
            <div className="space-y-6">
              {content.faq.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">
                    {q}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </SectionBlock>
        )}

        {content.relatedLinks && content.relatedLinks.length > 0 && (
          <SectionBlock emoji="🔗" title={content.relatedTitle ?? "Related guides"} variant="muted">
            <ul className="space-y-2">
              {content.relatedLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-semibold underline hover:no-underline"
                    style={{ color: ACCENT_GREEN }}
                  >
                    {label} →
                  </Link>
                </li>
              ))}
            </ul>
          </SectionBlock>
        )}

        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
          {isNl ? "Deze informatie is bedoeld voor algemene doeleinden en vervangt geen professioneel dierenartsadvies. Zie onze " : "This information is for general purposes only and does not replace professional veterinary advice. See our "}
          <Link href="/disclaimer" className="underline hover:no-underline font-medium">
            {isNl ? "disclaimer" : "disclaimer"}
          </Link>
          .
        </p>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <TrackedDonateLink
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("donateNow")}
          </TrackedDonateLink>
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
