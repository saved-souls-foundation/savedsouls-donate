"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import TrackedDonateLink from "@/app/components/TrackedDonateLink";
import { getAllBlogPosts, isFacebookPost, isDbPost, toDbPost, type BlogPostOrFacebook } from "@/lib/blog-posts";

const ACCENT_GREEN = "#2aa348";

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getPostTitle(post: BlogPostOrFacebook, t: (key: string) => string): string {
  if (isFacebookPost(post)) {
    const firstLine = post.message.split("\n")[0]?.trim().slice(0, 80);
    return firstLine || "Update van Facebook";
  }
  if (isDbPost(post)) return post.titel?.trim() || "Blog";
  return t(`posts.${post.slug}.title`);
}

function getPostExcerpt(post: BlogPostOrFacebook, t: (key: string) => string): string {
  if (isFacebookPost(post)) return post.excerpt;
  if (isDbPost(post)) {
    const text = post.inhoud?.replace(/<[^>]+>/g, "").trim() ?? "";
    return text.length > 160 ? `${text.slice(0, 160)}…` : text;
  }
  return t(`posts.${post.slug}.excerpt`);
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [dbPosts, setDbPosts] = useState<BlogPostOrFacebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/blog/public", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { posts: [] }))
      .then((data) => {
        console.log("[blog page] /api/blog/public response:", data);
        if (cancelled) return;
        const list = Array.isArray(data?.posts) ? data.posts : [];
        setDbPosts(
          list.map((row: { id: string; slug: string | null; title: string | null; published_at: string | null; hero_image?: string | null; category?: string | null }) =>
            toDbPost({
              id: row.id,
              slug: row.slug,
              title: row.title,
              inhoud: null,
              published_at: row.published_at,
              hero_image: row.hero_image ?? null,
            })
          )
        );
      })
      .catch(() => { if (!cancelled) setDbPosts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const posts = useMemo(() => {
    const staticAndFb = getAllBlogPosts();
    const merged = [...staticAndFb, ...dbPosts];
    return merged.sort((a, b) => {
      const tb = new Date(b.date).getTime();
      const ta = new Date(a.date).getTime();
      return (Number.isNaN(tb) || Number.isNaN(ta) ? b.date.localeCompare(a.date) : tb - ta);
    });
  }, [dbPosts]);

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
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
          {posts.map((post) => {
            const title = getPostTitle(post, t);
            const excerpt = getPostExcerpt(post, t);

            const cardContent = (
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
                    <time dateTime={post.date} className="text-sm font-medium text-white drop-shadow-lg">
                      {formatDate(post.date, locale)}
                    </time>
                    {isFacebookPost(post) && (
                      <span className="ml-2 text-xs text-white/70 drop-shadow">Facebook</span>
                    )}
                    {isDbPost(post) && (
                      <span className="ml-2 text-xs text-white/70 drop-shadow">Blog</span>
                    )}
                    <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mt-1">
                      {title}
                    </h2>
                    <p className="text-white/90 text-sm md:text-base mt-2 line-clamp-2 drop-shadow">
                      {excerpt}
                    </p>
                  </div>
                </div>
            );

            const className = "block group rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-600 shadow-lg hover:shadow-xl hover:border-[#2aa348]/40 transition-all duration-300";

            return (
              <Link key={isDbPost(post) ? post.id : post.slug} href={`/blog/${post.slug}`} className={className}>
                {cardContent}
              </Link>
            );
          })}
        </section>

        <div className="mt-16 text-center">
          <TrackedDonateLink
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("ctaDonate")}
          </TrackedDonateLink>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
