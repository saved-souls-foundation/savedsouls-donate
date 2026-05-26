"use client";

import SeoGuideArticle from "@/app/components/seo-guide/SeoGuideArticle";
import { DOG_VOMITING_GUIDE } from "@/lib/guides/dog-vomiting";
import { DOG_VOMITING_GUIDE_NL } from "@/lib/guides/dog-vomiting.nl";
import { useLocale } from "next-intl";

export default function DogVomitingPage() {
  const locale = useLocale();
  const content = locale === "nl" ? DOG_VOMITING_GUIDE_NL : DOG_VOMITING_GUIDE;

  return (
    <SeoGuideArticle
      namespace="dogVomiting"
      content={content}
      heroImage="/dog-care.webp"
      inlineImage="/guides/dog-vomiting-diarrhea-hero.png"
      introGradient="from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30"
    />
  );
}
