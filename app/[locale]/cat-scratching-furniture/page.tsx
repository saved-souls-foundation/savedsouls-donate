"use client";

import SeoGuideArticle from "@/app/components/seo-guide/SeoGuideArticle";
import { CAT_SCRATCHING_FURNITURE_GUIDE } from "@/lib/guides/cat-scratching-furniture";
import { CAT_SCRATCHING_FURNITURE_GUIDE_NL } from "@/lib/guides/cat-scratching-furniture.nl";
import { useLocale } from "next-intl";

export default function CatScratchingFurniturePage() {
  const locale = useLocale();
  const content =
    locale === "nl"
      ? CAT_SCRATCHING_FURNITURE_GUIDE_NL
      : CAT_SCRATCHING_FURNITURE_GUIDE;

  return (
    <SeoGuideArticle
      namespace="catScratchingFurniture"
      content={content}
      heroImage="/dog-care.webp"
      inlineImage="/guides/cat-hairball-inline.png"
      introGradient="from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30"
    />
  );
}
