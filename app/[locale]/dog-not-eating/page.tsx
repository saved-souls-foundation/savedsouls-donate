"use client";

import SeoGuideArticle from "@/app/components/seo-guide/SeoGuideArticle";
import { DOG_NOT_EATING_GUIDE } from "@/lib/guides/dog-not-eating";
import { DOG_NOT_EATING_GUIDE_NL } from "@/lib/guides/dog-not-eating.nl";
import { useLocale } from "next-intl";

export default function DogNotEatingPage() {
  const locale = useLocale();
  const content = locale === "nl" ? DOG_NOT_EATING_GUIDE_NL : DOG_NOT_EATING_GUIDE;

  return (
    <SeoGuideArticle
      namespace="dogNotEating"
      content={content}
      heroImage="/dog-care.webp"
      inlineImage="/shelter-food.webp"
      introGradient="from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30"
    />
  );
}
