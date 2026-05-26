"use client";

import SeoGuideArticle from "@/app/components/seo-guide/SeoGuideArticle";
import { CAT_NOT_DRINKING_GUIDE } from "@/lib/guides/cat-not-drinking";
import { CAT_NOT_DRINKING_GUIDE_NL } from "@/lib/guides/cat-not-drinking.nl";
import { useLocale } from "next-intl";

export default function CatNotDrinkingPage() {
  const locale = useLocale();
  const content =
    locale === "nl" ? CAT_NOT_DRINKING_GUIDE_NL : CAT_NOT_DRINKING_GUIDE;

  return (
    <SeoGuideArticle
      namespace="catNotDrinking"
      content={content}
      heroImage="/shelter-food.webp"
      inlineImage="/dog-care.webp"
      introGradient="from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30"
    />
  );
}
