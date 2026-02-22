"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "../../../components/ParallaxPage";
import Footer from "../../../components/Footer";
import { getPostBySlug, isFacebookPost } from "@/lib/blog-posts";
import { notFound } from "next/navigation";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#E67A4C";

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);
  const t = useTranslations("blog");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  if (!post) notFound();

  const handleDonate = () => {
    window.open("https://paypal.me/savedsoulsfoundation", "_blank");
  };

  const isFacebook = isFacebookPost(post);
  const isAdoptLayout = !isFacebook && post.layout === "adopt";

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <article>
          <header className="mb-10">
            <time dateTime={post.date} className="text-sm font-medium text-stone-500 dark:text-stone-400">
              {formatDate(post.date, locale)}
            </time>
            {isFacebook && (
              <span className="ml-2 text-xs font-medium text-stone-500 dark:text-stone-400">Facebook</span>
            )}
            <h1 className="text-3xl md:text-4xl font-black text-stone-800 dark:text-stone-100 mt-2 mb-4 leading-tight">
              {isFacebook
                ? (post.message.split("\n")[0]?.trim().slice(0, 100) || "Update van Facebook")
                : t(`posts.${slug}.title`)}
            </h1>
          </header>

          <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 relative aspect-[16/10]">
            <Image
              src={post.heroImage}
              alt={isFacebook ? "" : t(`posts.${slug}.heroAlt`)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
            {isAdoptLayout && (
              <div className="absolute inset-x-0 bottom-0 p-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-t border-white/50 dark:border-stone-700/50">
                <p className="text-stone-700 dark:text-stone-200 text-lg leading-relaxed">
                  {t(`posts.${slug}.body`)}
                </p>
                <Link
                  href="/adopt"
                  className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: ACCENT_GREEN }}
                >
                  {t(`posts.${slug}.adoptCta`)} →
                </Link>
              </div>
            )}
          </div>

          {isFacebook && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                {post.message}
              </div>
              <p className="mt-6">
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {t("viewOriginalOnFacebook")} →
                </a>
              </p>
            </div>
          )}

          {!isAdoptLayout && !isFacebook && (
            <>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                  {t(`posts.${slug}.intro`)}
                </p>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg mt-4">
                  {t(`posts.${slug}.body1`)}
                </p>

                <div className="my-10 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-700">
                  <p className="text-stone-700 dark:text-stone-300 font-semibold text-lg">
                    {t(`posts.${slug}.costsTitle`)}
                  </p>
                  <ul className="mt-3 space-y-2 text-stone-600 dark:text-stone-400">
                    <li>{t(`posts.${slug}.cost1`)}</li>
                    <li>{t(`posts.${slug}.cost2`)}</li>
                    <li>{t(`posts.${slug}.cost3`)}</li>
                    <li>{t(`posts.${slug}.cost4`)}</li>
                    <li className="pt-2 font-semibold text-stone-700 dark:text-stone-300">{t(`posts.${slug}.cost5`)}</li>
                    <li className="font-semibold text-stone-700 dark:text-stone-300">{t(`posts.${slug}.cost6`)}</li>
                  </ul>
                  <p className="mt-4 text-sm text-stone-600 dark:text-stone-400 italic">
                    {t(`posts.${slug}.costNote`)}
                  </p>
                </div>

                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
                    {post.images.map((img, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-600">
                        <Image
                          src={img}
                          alt=""
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                  {t(`posts.${slug}.body2`)}
                </p>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg mt-4 font-medium">
                  {t(`posts.${slug}.thanks`)}
                </p>
              </div>
            </>
          )}

          </article>

        <section className="mt-16 rounded-2xl p-8 md:p-10 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600 overflow-hidden relative min-h-[140px] flex items-center justify-center">
          {isAdoptLayout ? (
            <>
              <span className="absolute left-[10%] top-[20%] text-2xl md:text-3xl font-bold text-amber-600/80 dark:text-amber-400/70 animate-money-float-1" aria-hidden>฿</span>
              <span className="absolute right-[15%] top-[15%] text-xl md:text-2xl font-bold text-emerald-600/80 dark:text-emerald-400/70 animate-money-float-2" aria-hidden>$</span>
              <span className="absolute left-[20%] bottom-[25%] text-2xl md:text-3xl font-bold text-blue-600/80 dark:text-blue-400/70 animate-money-float-3" aria-hidden>€</span>
              <span className="absolute right-[10%] bottom-[20%] text-xl md:text-2xl font-bold text-rose-600/80 dark:text-rose-400/70 animate-money-float-4" aria-hidden>¥</span>
              <span className="absolute left-[5%] top-[45%] text-lg md:text-xl font-bold text-amber-600/60 animate-money-float-2" aria-hidden>100</span>
              <span className="absolute right-[8%] top-[40%] text-lg md:text-xl font-bold text-amber-600/60 animate-money-float-1" aria-hidden>50</span>
              <span className="absolute left-[15%] bottom-[10%] text-base md:text-lg font-bold text-emerald-600/50 animate-money-float-4" aria-hidden>€</span>
              <span className="absolute right-[20%] top-[55%] text-base md:text-lg font-bold text-blue-600/50 animate-money-float-3" aria-hidden>฿</span>
              <Link
                href="/donate"
                className="relative z-10 inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-white shadow-xl animate-star-pulse hover:scale-105 transition-transform"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                <span className="text-2xl" aria-hidden>⭐</span>
                <span className="text-base md:text-lg">{t(`posts.${slug}.orDonate`)}</span>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
              <p className="text-stone-600 dark:text-stone-400 mb-6">
                {isFacebook ? t("ctaSubtitle") : t(`posts.${slug}.ctaText`)}
              </p>
              <button
                onClick={handleDonate}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: BUTTON_ORANGE }}
              >
                {tCommon("donate")} 🙏
              </button>
            </>
          )}
        </section>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
