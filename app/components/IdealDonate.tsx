"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const PRESET_AMOUNTS = [25, 50, 100, 250];
const SCREENSHOT_HIDE_AFTER = new Date("2026-12-31"); // Verbergen vanaf 1 jan 2027

export default function IdealDonate() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveAmount = customAmount ? parseFloat(customAmount) : amount;
  const isValid = effectiveAmount >= 1 && effectiveAmount <= 50000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as { checkoutUrl?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try PayPal.");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setError("Could not start payment.");
    } catch {
      setError("Something went wrong. Please try PayPal.");
    } finally {
      setLoading(false);
    }
  };

  const showScreenshot = new Date() < SCREENSHOT_HIDE_AFTER;

  const thaiPayments: { href: string; src: string; alt: string }[] = [
    { href: "/donate/thai#promptpay", src: "/logos/thai-qr-payment.png", alt: "Thai QR Payment" },
    { href: "/donate/thai#promptpay", src: "/logos/thai-scanqr.svg", alt: "Scan QR" },
    { href: "/donate/thai#banks", src: "/logos/thai-kasikorn.png", alt: "Kasikorn Bank" },
    { href: "/donate/thai#banks", src: "/logos/thai-bangkok-bank.png", alt: "Bangkok Bank" },
    { href: "/donate/thai#banks", src: "/logos/thai-scb.png", alt: "SCB" },
    { href: "/donate/thai#banks", src: "/logos/thai-krungthai.png", alt: "Krungthai Bank" },
    { href: "/donate/thai#banks", src: "/logos/thai-bankthai.png", alt: "BankThai" },
    { href: "/donate/thai#ewallets", src: "/logos/thai-truemoney.png", alt: "TrueMoney" },
    { href: "/donate/thai#ewallets", src: "/logos/thai-linepay.png", alt: "LINE Pay" },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-lg">
      <Link
        href="/donate"
        className="block mb-3 rounded-lg transition-opacity hover:opacity-90 focus:opacity-90 cursor-pointer"
        title={t("idealCta")}
      >
        {showScreenshot && (
          <div className="mb-2 min-h-[80px] flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-lg">
            <img
              src="/ideal-wero-screenshot.png"
              alt="iDEAL en Wero"
              className="w-full max-w-[160px] mx-auto rounded-lg object-contain"
            />
          </div>
        )}
        <div className="flex items-center gap-3 mb-2 min-h-[52px] py-2 bg-stone-50 dark:bg-stone-800/50 rounded-lg px-3">
          <img
            src="/wero-logo.svg"
            alt="iDEAL Wero"
            className="h-10 w-auto object-contain dark:hidden"
            width={322}
            height={100}
          />
          <img
            src="/wero-logo-dark.svg"
            alt="iDEAL Wero"
            className="h-10 w-auto object-contain hidden dark:block"
            width={322}
            height={100}
          />
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {t("idealSubtitle")}
        </p>
      </Link>
      <form id="mollie-donate-form" onSubmit={handleSubmit} className="space-y-4">
      <button
        type="submit"
        form="mollie-donate-form"
        className="flex flex-wrap items-center justify-center gap-2 mb-4 py-3 px-4 rounded-lg min-h-[44px] w-full cursor-pointer transition-colors border-0 text-left hover:opacity-90"
        style={{ backgroundColor: "#E67A4C" }}
      >
        <span className="text-xs font-bold text-white flex flex-col items-center text-center leading-tight">
          {t("payAsYouLike")}
          <span className="mt-0.5">{t("donateAsYouWish")}</span>
          <span className="mt-1.5 font-normal opacity-90">{t("mollieMethods")}</span>
        </span>
      </button>

      {/* Thaise betaalmethoden placeholder */}
      <div className="mb-4 py-3 px-4 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-600">
        <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 text-center mb-2">
          {t("thaiPayments")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          {thaiPayments.map((p) => (
            <Link
              key={`${p.href}-${p.src}`}
              href={p.href}
              className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer"
              title={p.alt}
            >
              <Image src={p.src} alt={p.alt} width={25} height={25} className="object-contain" />
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-stone-600 dark:text-stone-400 text-center">
          {t("thaiPaymentsMethods")}
        </p>
      </div>

        <div>
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            {t("idealAmount")}
          </p>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 min-h-[100px]">
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setAmount(a); setCustomAmount(""); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !customAmount && amount === a
                    ? "bg-[#2aa348] text-white"
                    : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600"
                }`}
              >
                €{a}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-600 dark:text-stone-400">€</span>
            <input
              type="number"
              min={1}
              max={50000}
              step={0.01}
              placeholder={t("idealCustom")}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-24 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
            />
          </div>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#2aa348" }}
        >
          {loading ? t("idealLoading") : t("idealCta")}
        </button>
      </form>
      <p className="mt-3 text-[10px] text-stone-400 dark:text-stone-500 text-center">
        Powered by Mollie
      </p>

    </div>
  );
}
