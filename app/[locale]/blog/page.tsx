"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import { getAllBlogPosts } from "@/lib/blog-posts";

const ACCENT_GREEN = "#2aa348";

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const posts = getAllBlogPosts();

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <header className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-300 dark:border-amber-600 mb-6 text-sm font-semibold text-amber-800 dark:text-amber-200">
            📝 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-600 shadow-lg hover:shadow-xl hover:border-[#2aa348]/40 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] md:aspect-[21/9] overflow-hidden">
                <Image
                  src={post.listingImage ?? post.heroImage}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <time className="text-sm font-medium text-white/90 drop-shadow-lg">
                    {formatDate(post.date, locale)}
                  </time>
                  <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mt-1">
                    {t(`posts.${post.slug}.title`)}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base mt-2 line-clamp-2 drop-shadow">
                    {t(`posts.${post.slug}.excerpt`)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <div className="mt-16 text-center">
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("ctaDonate")}
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
