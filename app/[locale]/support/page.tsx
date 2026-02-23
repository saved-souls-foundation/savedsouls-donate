"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../components/ParallaxPage";
import Footer from "../../components/Footer";
import KofiStyleDonate from "../../components/KofiStyleDonate";
import { Heart } from "lucide-react";

const ACCENT_GREEN = "#2aa348";

export default function SupportPage() {
  const t = useTranslations("support");
  const [activeTab, setActiveTab] = useState<"about" | "posts">("about");

  return (
    <ParallaxPage>
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Hero - Ko-fi style */}
        <header className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white dark:border-stone-800 shadow-xl">
            <Image
              src="/savedsoul-logo-bg.webp"
              alt="Saved Souls Foundation"
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1">
            {t("supportTitle")}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mb-3">
            Saved Souls Foundation
          </p>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-sm font-medium">
            <Heart className="w-4 h-4" style={{ color: ACCENT_GREEN }} fill={ACCENT_GREEN} />
            {t("supportersCount", { count: "1.200+" })}
          </div>
        </header>

        {/* Main CTA - Tip button */}
        <section className="mb-10">
          <KofiStyleDonate />
        </section>

        {/* Tabs: About | Posts */}
        <section className="mb-8">
          <div className="flex border-b border-stone-200 dark:border-stone-700 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("about")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "about"
                  ? "text-[#2aa348] border-[#2aa348]"
                  : "text-stone-500 dark:text-stone-400 border-transparent hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              {t("tabAbout")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "posts"
                  ? "text-[#2aa348] border-[#2aa348]"
                  : "text-stone-500 dark:text-stone-400 border-transparent hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              {t("tabPosts")}
            </button>
          </div>

          {activeTab === "about" && (
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {t("aboutText")}
              </p>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed mt-4">
                {t("aboutText2")}
              </p>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="space-y-4">
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
                {t("postsIntro")}
              </p>
              <Link
                href="/blog"
                className="block p-4 rounded-xl border-2 border-stone-200 dark:border-stone-700 hover:border-[#2aa348] transition-colors"
              >
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {t("viewBlog")}
                </span>
                <span className="block text-sm text-stone-500 dark:text-stone-400 mt-1">
                  {t("viewBlogSubtitle")}
                </span>
              </Link>
            </div>
          )}
        </section>

        {/* Footer links */}
        <div className="text-center space-y-3 pt-6 border-t border-stone-200 dark:border-stone-700">
          <Link
            href="/financial-overview"
            className="block text-stone-600 dark:text-stone-400 hover:text-[#2aa348] underline underline-offset-2 text-sm"
          >
            {t("linkFinancialOverview")}
          </Link>
          <Link
            href="/donate"
            className="block text-stone-600 dark:text-stone-400 hover:text-[#2aa348] underline underline-offset-2 text-sm"
          >
            {t("linkDonate")}
          </Link>
        </div>

        <Footer />
      </main>
    </ParallaxPage>
  );
}
