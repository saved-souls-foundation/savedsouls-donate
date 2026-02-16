"use client";

import { useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../../components/ParallaxPage";
import Footer from "../../../components/Footer";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

const ACCENT_GREEN = "#2aa348";
const KASIKORN_ACCOUNT = "033-8-13623-4";
const KASIKORN_SWIFT = "KASITHBK";

export default function ThaiDonatePage() {
  const t = useTranslations("donate.thai");
  const tDonate = useTranslations("donate");

  const copyAccount = useCallback(() => {
    navigator.clipboard.writeText(KASIKORN_ACCOUNT);
  }, []);

  return (
    <ParallaxPage>
      <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 py-4 bg-white/98 dark:bg-stone-900/98 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity"
        >
          <div
            className="shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-600"
            style={{ width: 70, height: 70 }}
          >
            <video
              src="/savedsouls-fondation-logo.mp4"
              width={70}
              height={70}
              className="block w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              title="Saved Souls Foundation logo"
            />
          </div>
          <span className="text-xs font-semibold" style={{ color: ACCENT_GREEN }}>
            Saved Souls Foundation
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block flex-shrink-0">
            <LanguageSwitcher />
          </div>
          <div className="sm:hidden flex-shrink-0">
            <LanguageSwitcher compact />
          </div>
          <Link
            href="/donate"
            className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            {tDonate("navBack")}
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400" style={{ color: ACCENT_GREEN }}>
            {t("subtitle")}
          </p>
        </header>

        {/* PromptPay / Thai QR */}
        <section id="promptpay" className="scroll-mt-24 mb-12">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logos/thai-qr-payment.png"
                alt="Thai QR Payment"
                width={40}
                height={40}
                className="object-contain"
              />
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                {t("promptpayTitle")}
              </h2>
            </div>
            <div className="aspect-square max-w-[220px] mx-auto bg-stone-200 dark:bg-stone-700 rounded-xl flex items-center justify-center mb-4">
              <span className="text-stone-500 text-sm text-center px-4">
                {t("qrPlaceholder")}
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 text-center">
              {t("qrInstruction")}
            </p>
          </div>
        </section>

        {/* Bankoverschrijving */}
        <section id="banks" className="scroll-mt-24 mb-12">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">
              {t("banksTitle")}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
              {t("banksIntro")}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Image src="/logos/thai-kasikorn.png" alt="Kasikorn" width={32} height={32} className="object-contain" />
              <Image src="/logos/thai-bangkok-bank.png" alt="Bangkok Bank" width={32} height={32} className="object-contain" />
              <Image src="/logos/thai-scb.png" alt="SCB" width={32} height={32} className="object-contain" />
              <Image src="/logos/thai-krungthai.png" alt="Krungthai" width={32} height={32} className="object-contain" />
              <Image src="/logos/thai-bankthai.png" alt="BankThai" width={32} height={32} className="object-contain" />
            </div>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-600">
              <p className="font-semibold text-stone-800 dark:text-stone-200">
                Kasikorn Bank
              </p>
              <p className="font-mono text-lg mt-1 break-all">{KASIKORN_ACCOUNT}</p>
              <p className="text-xs text-stone-500 mt-1">SWIFT: {KASIKORN_SWIFT}</p>
              <button
                onClick={copyAccount}
                className="mt-3 px-4 py-2 rounded-lg bg-[#2aa348] text-white text-sm font-medium hover:opacity-90"
              >
                {t("copyAccount")}
              </button>
            </div>
          </div>
        </section>

        {/* eWallets */}
        <section id="ewallets" className="scroll-mt-24 mb-12">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg opacity-90">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logos/thai-truemoney.png" alt="TrueMoney" width={32} height={32} className="object-contain" />
              <Image src="/logos/thai-linepay.png" alt="LINE Pay" width={32} height={32} className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">
              {t("ewalletsTitle")}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {t("ewalletsComingSoon")}
            </p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-stone-700 dark:text-stone-300 border-2 border-stone-300 dark:border-stone-600 transition-opacity hover:opacity-90"
          >
            {t("btnBack")}
          </Link>
          <Link
            href="/#donate"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACCENT_GREEN }}
          >
            {t("btnDonateHomepage")}
          </Link>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
