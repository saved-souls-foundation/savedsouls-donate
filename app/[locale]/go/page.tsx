"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";

const ACCENT_GREEN = "#2aa348";

/** Only allow wikipedia.org URLs for security */
function isAllowedUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith(".wikipedia.org") || parsed.hostname === "wikipedia.org";
  } catch {
    return false;
  }
}

function GoPageContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("go");
  const tCommon = useTranslations("common");
  const url = searchParams.get("url");
  const returnPath = searchParams.get("return") || "/";

  useEffect(() => {
    if (isAllowedUrl(url)) {
      window.open(url!, "_blank", "noopener,noreferrer");
    }
  }, [url]);

  if (!isAllowedUrl(url)) {
    return (
      <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("invalidLink")}</p>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white" style={{ backgroundColor: ACCENT_GREEN }}>
            {tCommon("backToHome")}
          </Link>
        </main>
      </ParallaxPage>
    );
  }

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-2xl p-8 md:p-12 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg text-center">
          <div className="text-5xl mb-6">📖</div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("title")}</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-8">{t("description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={returnPath}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              ← {t("backButton")}
            </Link>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105"
                style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}
              >
                {t("openAgain")} →
              </a>
            )}
          </div>
        </div>
      </main>
    </ParallaxPage>
  );
}

export default function GoPage() {
  return (
    <Suspense fallback={
      <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-6">...</p>
        </main>
      </ParallaxPage>
    }>
      <GoPageContent />
    </Suspense>
  );
}
