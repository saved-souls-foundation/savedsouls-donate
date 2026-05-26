"use client";

import SeoGuideArticle from "@/app/components/seo-guide/SeoGuideArticle";
import { DOG_ATE_CHOCOLATE_GUIDE } from "@/lib/guides/dog-ate-chocolate";
import { DOG_ATE_CHOCOLATE_GUIDE_NL } from "@/lib/guides/dog-ate-chocolate.nl";
import { useLocale } from "next-intl";

export default function DogAteChocolatePage() {
  const locale = useLocale();
  const content =
    locale === "nl" ? DOG_ATE_CHOCOLATE_GUIDE_NL : DOG_ATE_CHOCOLATE_GUIDE;

  return (
    <SeoGuideArticle
      namespace="dogAteChocolate"
      content={content}
      heroImage="/dog-care.webp"
      inlineImage="/shelter-food.webp"
      introGradient="from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30"
    />
  );
}
