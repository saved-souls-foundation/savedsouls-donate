"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Footer from "./Footer";
import SiteHeader from "./SiteHeader";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/savedsoul-logo.webp";

const THB_AMOUNTS = [300, 500, 750, 1000, 1500, 2000, 3000, 5000];
const THB_AMOUNTS_THAI = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

export type SponsorCheckoutData = {
  name: string;
  email: string;
  amountThb: number;
  message?: string;
  animalId: string;
  animalName: string;
  animalType: "dog" | "cat";
};

const STORAGE_KEY = "sponsor_checkout";

type Animal = {
  id: string;
  name: string;
  thaiName?: string;
  image: string;
  images?: string[];
  story: string;
};

type Props = {
  animalType: "dog" | "cat";
  animalId: string;
};

export function getStoredCheckoutData(): SponsorCheckoutData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SponsorCheckoutData;
    if (!data.animalId || !data.name || !data.email || !data.amountThb) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearStoredCheckoutData(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export default function SponsorCheckout({ animalType, animalId }: Props) {
  const t = useTranslations("sponsorCheckout");
  const tPage = useTranslations("sponsorPage");
  const locale = useLocale();
  const router = useRouter();
  const [data, setData] = useState<SponsorCheckoutData | null>(null);
  const [amountThb, setAmountThb] = useState(300);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const isThai = locale === "th";
  const thbAmounts = isThai ? THB_AMOUNTS_THAI : THB_AMOUNTS;

  useEffect(() => {
    const stored = getStoredCheckoutData();
    if (!stored || String(stored.animalId) !== String(animalId) || stored.animalType !== animalType) {
      router.replace(`/sponsor/${animalType}/${animalId}`);
      return;
    }
    setData(stored);
    setAmountThb(stored.amountThb);

    async function fetchAnimal() {
      try {
        const res = await fetch("/api/sponsor-animals", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        const list = animalType === "dog" ? json.dogs : json.cats;
        const found = list?.find((a: Animal) => String(a.id) === String(animalId));
        setAnimal(found ?? null);
      } catch {
        setAnimal(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimal();
  }, [animalId, animalType, router]);

  const handlePay = async () => {
    if (!data) return;
    setError("");
    setPaying(true);
    const amountEur = Math.round(amountThb * (1 / 38) * 100) / 100;
    try {
      const res = await fetch("/api/payments/sponsor-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountEur,
          locale,
          method: "paypal",
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          message: data.message?.trim().slice(0, 500) || undefined,
          animalId: data.animalId,
          animalName: data.animalName,
          animalType: data.animalType,
          amountThb,
        }),
      });
      const result = (await res.json().catch(() => ({}))) as { checkoutUrl?: string; error?: string };
      if (!res.ok) {
        if (res.status === 503) {
          const payAmount = Math.max(100, amountThb);
          window.location.href = `https://paypal.me/savedsoulsfoundation/${payAmount}?currencyCode=THB`;
          return;
        }
        setError(result.error || t("paymentError"));
        setPaying(false);
        return;
      }
      if (result.checkoutUrl) {
        clearStoredCheckoutData();
        window.location.href = result.checkoutUrl;
        return;
      }
      setError(t("paymentError"));
    } catch {
      setError(t("paymentError"));
    } finally {
      setPaying(false);
    }
  };

  const handleBack = () => {
    router.push(`/sponsor/${animalType}/${animalId}`);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <p className="text-stone-500">{tPage("loading")}</p>
      </div>
    );
  }

  const mainImage = animal?.images?.[0] || animal?.image || FALLBACK_IMAGE;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-14">
        {/* Breadcrumb / back */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-8 transition-colors"
        >
          <span aria-hidden>←</span>
          {t("backToForm")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Left: animal + story */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[420px]">
              <img
                src={mainImage}
                alt={animal ? `${animal.name} – ${t("sponsorAt")} Saved Souls Foundation` : ""}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  if (!el.dataset.fallback) {
                    el.dataset.fallback = "1";
                    el.src = FALLBACK_IMAGE;
                  }
                }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent pointer-events-none"
                aria-hidden
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                  {data.animalName}
                  {animal?.thaiName && (
                    <span className="font-normal opacity-90 ml-2">/ {animal.thaiName}</span>
                  )}
                </h1>
                <p className="text-white/90 text-sm mt-1">{t("monthlySponsor")}</p>
              </div>
            </div>

            {animal?.story && (
              <div className="rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-3" style={{ color: ACCENT_GREEN }}>
                  {tPage("story")}
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line text-sm">
                  {animal.story}
                </p>
              </div>
            )}
          </div>

          {/* Right: summary + pay */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6" style={{ color: ACCENT_GREEN }}>
                {t("summary")}
              </h2>
              <dl className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{t("sponsor")}</dt>
                  <dd className="font-medium text-stone-800 dark:text-stone-200">{data.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{t("email")}</dt>
                  <dd className="font-medium text-stone-800 dark:text-stone-200 truncate max-w-[140px]" title={data.email}>
                    {data.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-stone-500 dark:text-stone-400 text-sm mb-2">{t("monthlyAmount")}</dt>
                  <dd>
                    <select
                      value={amountThb}
                      onChange={(e) => setAmountThb(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium focus:ring-2 focus:ring-[#2aa348]/50 focus:border-[#2aa348]"
                    >
                      {thbAmounts.map((a) => (
                        <option key={a} value={a}>
                          {isThai ? `${a.toLocaleString("th-TH")} บาท/เดือน` : `${a} THB / maand`}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
                {data.message && (
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-600">
                    <dt className="text-stone-500 dark:text-stone-400 mb-1">{t("yourMessage")}</dt>
                    <dd className="text-stone-700 dark:text-stone-300 italic text-xs leading-relaxed">
                      &ldquo;{data.message}&rdquo;
                    </dd>
                  </div>
                )}
              </dl>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={paying}
                className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ backgroundColor: ACCENT_GREEN }}
              >
                {paying ? t("processing") : t("payNow")}
              </button>

              <p className="text-xs text-stone-500 dark:text-stone-400 mt-4 text-center">
                {t("securePayment")}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
