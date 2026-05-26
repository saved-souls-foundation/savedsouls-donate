"use client";

import SeoGuideArticle from "@/app/components/seo-guide/SeoGuideArticle";
import { PUPPY_SCHEDULE_GUIDE } from "@/lib/guides/puppy-schedule";
import { PUPPY_SCHEDULE_GUIDE_NL } from "@/lib/guides/puppy-schedule.nl";
import { useLocale } from "next-intl";

export default function PuppySchedulePage() {
  const locale = useLocale();
  const content = locale === "nl" ? PUPPY_SCHEDULE_GUIDE_NL : PUPPY_SCHEDULE_GUIDE;

  return (
    <SeoGuideArticle
      namespace="puppySchedule"
      content={content}
      heroImage="/dog-care.webp"
      inlineImage="/hero-hug.png"
      introGradient="from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30"
    />
  );
}
