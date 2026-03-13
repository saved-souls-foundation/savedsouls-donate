"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "@/app/components/ParallaxPage";
import Footer from "@/app/components/Footer";

const ACCENT_GREEN = "#2aa348";
const BUTTON_ORANGE = "#2aa348";

export default function DisabledDogGuidePage() {
  const t = useTranslations("disabledDogGuide");
  const tCommon = useTranslations("common");

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold" style={{ color: ACCENT_GREEN }}>Saved Souls</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900">← {tCommon("backToHome")}</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 mb-6 text-sm text-stone-600 dark:text-stone-400 animate-pulse">
            🐕‍🦺 🇹🇭 {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-800 dark:text-stone-100 mb-4" style={{ color: ACCENT_GREEN }}>
            {t("title")}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">{t("intro")}</p>
        </section>

        <div className="mb-16 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/founder-hug.webp" alt="Rescue dog at Saved Souls" width={500} height={350} className="w-full h-56 object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <Image src="/woman-hug-dog.webp" alt="Dog care at Saved Souls" width={500} height={350} className="w-full h-56 object-cover" />
          </div>
        </div>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>💰 {t("costsTitle")}</h2>
          <ul className="space-y-3 text-stone-600 dark:text-stone-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex gap-2"><span className="text-green-500">✓</span>{t(`cost${i}`)}</li>
            ))}
          </ul>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>📋 {t("processTitle")}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: ACCENT_GREEN }}>{i}</span>
                <div><p className="font-bold text-stone-800 dark:text-stone-100">{t(`processStep${i}Title`)}</p><p className="text-stone-600 dark:text-stone-400 text-sm">{t(`processStep${i}Text`)}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-16 rounded-2xl overflow-hidden shadow-xl border-2 border-stone-200 dark:border-stone-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <Image src="/person-hug-brindle-dog.png" alt="Adoptable dog" width={800} height={450} className="w-full h-64 object-cover" />
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: ACCENT_GREEN }}>✨ {t("storiesTitle")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-2xl p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-2 border-stone-200 dark:border-stone-700 shadow-lg hover:scale-[1.02] transition-transform">
                <p className="text-2xl mb-2">🐾</p>
                <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2">{t(`story${i}Name`)}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">{t(`story${i}Text`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl p-6 md:p-10 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
          <h2 className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>❓ {t("faqTitle")}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-600">
                <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">{t(`faqQ${i}`)}</p>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{t(`faqA${i}`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-600">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t("ctaTitle")}</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/adopt" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg" style={{ backgroundColor: ACCENT_GREEN }}>
              {t("ctaAdopt")}
            </Link>
            <Link href="/#donate" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105" style={{ borderColor: BUTTON_ORANGE, color: BUTTON_ORANGE }}>
              {t("ctaSponsor")}
            </Link>
          </div>
        </section>

        <div className="flex justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl font-semibold border-2" style={{ borderColor: ACCENT_GREEN, color: ACCENT_GREEN }}>← {tCommon("backToHome")}</Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
