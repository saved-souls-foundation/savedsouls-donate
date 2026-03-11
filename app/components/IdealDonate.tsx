"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Ronde preset-bedragen – EUR/USD etc. vanaf 5 */
const PRESET_AMOUNTS = [5, 10, 15, 20, 25, 50, 75, 100, 125, 150, 200, 250, 500, 1000, 1500, 2000, 2500, 5000, 10000];

/** Voor JPY/KRW/IDR – grotere bedragen (100 = ~0,60 EUR) */
const PRESET_AMOUNTS_SMALL = [1000, 2500, 5000, 10000, 25000, 50000, 100000];

/** Thai Baht only – 100 tot 1.000.000 */
const PRESET_AMOUNTS_THB = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
/** Valuta ondersteund door Frankfurter API */
const CURRENCIES: { code: string; name: string; symbol: string }[] = [
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
];

export default function IdealDonate() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isThai = locale === "th";
  const [amount, setAmount] = useState(isThai ? 1000 : 5);
  const [customAmount, setCustomAmount] = useState("");
  const [amountSelect, setAmountSelect] = useState<string>(isThai ? "1000" : "5");
  const [currency, setCurrency] = useState(isThai ? "THB" : "EUR");
  const [rateToEur, setRateToEur] = useState<number | null>(isThai ? 1 / 38 : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRate = useCallback(async () => {
    if (currency === "EUR") {
      setRateToEur(1);
      return;
    }
    if (currency === "THB") {
      setRateToEur(1 / 38);
      return;
    }
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${currency}&to=EUR`);
      const data = await res.json();
      if (data.rates?.EUR) setRateToEur(data.rates.EUR);
      else setRateToEur(null);
    } catch {
      setRateToEur(null);
    }
  }, [currency]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const presets = currency === "THB" ? PRESET_AMOUNTS_THB : currency === "JPY" || currency === "KRW" || currency === "IDR" ? PRESET_AMOUNTS_SMALL : PRESET_AMOUNTS;
  const minAmount = currency === "THB" ? 100 : 5;
  const maxAmount = currency === "THB" ? 1000000 : 50000;

  useEffect(() => {
    if (amountSelect !== "custom" && !presets.includes(amount)) {
      const first = presets[0];
      setAmountSelect(String(first));
      setAmount(first);
    }
  }, [currency]);

  const isCustomAmount = amountSelect === "custom";
  const effectiveAmount = isCustomAmount ? parseFloat(customAmount) : amount;
  const amountInEur = currency === "EUR" ? effectiveAmount : (rateToEur ? effectiveAmount * rateToEur : 0);
  const isValid = effectiveAmount >= minAmount && effectiveAmount <= maxAmount && amountInEur >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amountInEur * 100) / 100, locale }),
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

  const curr = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const displayAmount = isCustomAmount ? effectiveAmount : amount;
  const displayAmountStr = Number.isFinite(displayAmount) && displayAmount >= 1
    ? curr.symbol + Math.round(displayAmount).toLocaleString(currency === "THB" ? "th-TH" : "nl-NL", { maximumFractionDigits: 0 })
    : "—";

  return (
    <div className="max-w-sm mx-auto">
      <p className="text-center text-stone-500 dark:text-stone-400 text-sm mb-4" style={{ color: "#2aa348" }}>
        {t("donateTagline")}
      </p>

      <details className="group mb-4">
        <summary className="text-xs text-stone-500 dark:text-stone-400 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 text-center list-none flex items-center justify-center gap-2 flex-wrap">
          <a href="https://paypal.me/savedsoulsfoundation" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:opacity-90">
            <Image src="/logos/paypal-official.png" alt="PayPal" width={74} height={46} className="h-10 w-auto object-contain" />
          </a>
          <Link href="/donate/thai#promptpay" onClick={(e) => e.stopPropagation()} className="hover:opacity-90">
            <Image src="/logos/promptpay-official.png" alt="PromptPay" width={107} height={60} className="h-10 w-auto object-contain" />
          </Link>
          <span>· {t("thaiPayments")} · {t("bankTransfer")}</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 space-y-2 text-center">
          <a href="https://paypal.me/savedsoulsfoundation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1">
            <Image src="/logos/paypal-official.png" alt="PayPal" width={74} height={46} className="h-10 w-auto object-contain" />
            <span className="text-xs" style={{ color: "#2aa348" }}>→</span>
          </a>
          <Link href="/donate/thai#promptpay" className="inline-flex items-center justify-center gap-1">
            <Image src="/logos/promptpay-official.png" alt="PromptPay" width={71} height={40} className="h-10 w-auto object-contain" />
            <span className="text-xs" style={{ color: "#2aa348" }}>{t("thaiPaymentsMethods")} →</span>
          </Link>
          <a href="#bank-transfer" className="block text-xs" style={{ color: "#2aa348" }}>{t("bankTransfer")} →</a>
        </div>
      </details>

      {/* Donorbox */}
      <div className="mt-6">
        <script type="module" src="https://donorbox.org/widgets.js" async></script>
        {/* @ts-expect-error Donorbox custom element */}
        <dbox-widget
          campaign="saved-souls-foundation-donation"
          type="donation_form"
          enable-auto-scroll="true"
        />
      </div>

      {/* Maandelijkse zielenredder button */}
      <div className="mt-4">
        <a
          href="https://donorbox.org/saved-souls-foundation-donation"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white text-base transition-all hover:scale-[1.02] hover:opacity-90"
          style={{ backgroundColor: "#2aa348" }}
        >
          ♥ Word maandelijkse zielenredder →
        </a>
      </div>
    </div>
  );
}
