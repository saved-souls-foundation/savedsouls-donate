"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

const ORANGE = "#e8622a";
const BEIGE = "#f5f0e8";
const PAYPAL_URL = "https://www.paypal.com/paypalme/savedsoulsfoundation";

function getDonorboxUrl(amount: string, monthly: boolean, isThai: boolean): string {
  const base = "https://donorbox.org/saved-souls-foundation-donation";
  const recurring = monthly ? "true" : "false";
  if (isThai) {
    return `${base}?recurring=${recurring}&currency=thb`;
  }
  const numeric = amount.replace(/[฿€,]/g, "");
  if (!numeric || isNaN(Number(numeric))) {
    return `${base}?amount=10&recurring=${recurring}&currency=eur`;
  }
  return `${base}?amount=${numeric}&recurring=${recurring}&currency=eur`;
}

export default function DonateForm() {
  const tP = useTranslations("donatePage");
  const locale = useLocale();
  const isThai = locale === "th";

  const amountOptions = isThai
    ? [
        { value: "฿100", key: "amountA" },
        { value: "฿250", key: "amountB" },
        { value: "฿500", key: "amountC" },
        { value: "฿1,000", key: "amountD" },
        { value: "฿2,500", key: "amountE" },
      ]
    : [
        { value: "€5", key: "amountA" },
        { value: "€10", key: "amountB" },
        { value: "€25", key: "amountC" },
        { value: "€55", key: "amountD" },
        { value: "€100", key: "amountE" },
      ];

  const impactKeys = ["impactA", "impactB", "impactC", "impactD", "impactE"];

  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const selectedAmount = amountOptions[selectedIndex]?.value ?? amountOptions[1].value;
  const selectedImpact = selectedIndex >= 0 && selectedIndex < impactKeys.length
    ? tP(impactKeys[selectedIndex] as "impactA" | "impactB" | "impactC" | "impactD" | "impactE")
    : tP("impactF");

  const numericAmount = selectedIndex >= 0
    ? amountOptions[selectedIndex].value.replace(/[฿€,]/g, "")
    : (isThai ? "100" : "10");
  const currencyCode = isThai ? "THB" : "EUR";
  const paypalUrl = mounted
    ? `${PAYPAL_URL}/${numericAmount}${currencyCode}`
    : `${PAYPAL_URL}/${numericAmount}`;

  return (
    <div
      suppressHydrationWarning
      className="p-6 mb-6"
      style={{
        borderRadius: "20px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
        background: "rgba(255,255,255,0.97)",
      }}
    >
      <h2 className="text-xl font-semibold text-stone-800 mb-1 leading-snug">
        {tP("formTitle")}
      </h2>
      <p className="text-sm text-stone-500 mb-6">{tP("formSub")}</p>

      {/* Frequency tabs */}
      <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-5">
        <button
          type="button"
          onClick={() => setIsMonthly(true)}
          className="flex-1 py-3 text-sm font-semibold transition-all hover:bg-orange-50"
          style={{
            background: isMonthly ? ORANGE : "#fff",
            color: isMonthly ? "#fff" : "#6b7280",
          }}
        >
          {tP("tabMonthly")}
        </button>
        <button
          type="button"
          onClick={() => setIsMonthly(false)}
          className="flex-1 py-3 text-sm font-medium transition-all hover:bg-orange-50"
          style={{
            background: isMonthly ? "#fff" : ORANGE,
            color: isMonthly ? "#6b7280" : "#fff",
          }}
        >
          {tP("tabOnce")}
        </button>
      </div>

      {/* Amount grid */}
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">
        {tP("impactSectionLabel")}
      </p>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {amountOptions.map((a, i) => (
          <button
            key={a.value}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className="rounded-xl border-2 p-3 text-center cursor-pointer transition-all hover:border-orange-300 hover:bg-orange-50"
            style={{
              borderColor: i === selectedIndex ? ORANGE : "#e5e7eb",
              background: i === selectedIndex ? "#fff8f5" : "#fff",
              transition: "all 0.15s",
            }}
          >
            <div
              className="text-base font-semibold mb-1"
              style={{ color: i === selectedIndex ? ORANGE : "#1a1a1a" }}
            >
              {a.value}
            </div>
            <div
              className="text-[10px] leading-tight"
              style={{ color: i === selectedIndex ? "#c04a10" : "#9ca3af" }}
            >
              {tP(a.key as "amountA" | "amountB" | "amountC" | "amountD" | "amountE")}
            </div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSelectedIndex(-1)}
          className="rounded-xl border-2 p-3 text-center cursor-pointer transition-all hover:border-orange-300 hover:bg-orange-50"
          style={{
            borderColor: selectedIndex === -1 ? ORANGE : "#e5e7eb",
            background: selectedIndex === -1 ? "#fff8f5" : "#fff",
          }}
        >
          <div
            className="text-base font-semibold mb-1"
            style={{ color: selectedIndex === -1 ? ORANGE : "#1a1a1a" }}
          >
            {tP("amountF")}
          </div>
          <div className="text-[10px] text-stone-400">±</div>
        </button>
      </div>

      {/* Impact box */}
      <div
        className="rounded-xl p-4 mb-5 flex gap-3 items-start"
        style={{ background: BEIGE }}
      >
        <span className="text-xl flex-shrink-0">🐾</span>
        <p className="text-sm text-stone-700 leading-relaxed">
          {selectedIndex >= 0 ? (
            <>
              <strong className="font-semibold text-stone-900">
                {selectedAmount}{isMonthly ? `/${tP("tabMonthly").replace("♥ ", "")}` : ""}
              </strong>
              {" — "}{selectedImpact}
            </>
          ) : (
            <strong className="font-semibold text-stone-900">{tP("amountF")}</strong>
          )}
        </p>
      </div>

      {!mounted ? (
        /* Static placeholder shown during SSR — no hydration mismatch */
        <div
          className="flex items-center justify-center w-full py-4 rounded-xl text-white font-semibold text-base mb-3"
          style={{ background: "#e8622a" }}
          aria-hidden="true"
        >
          ♥ {tP("tabMonthly")}
        </div>
      ) : (
        <>
          {/* Primary CTA */}
          <a
            href={isMonthly
              ? getDonorboxUrl(selectedIndex >= 0 ? amountOptions[selectedIndex].value : "10", true, isThai)
              : (selectedIndex >= 0 ? paypalUrl : PAYPAL_URL)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-4 rounded-xl text-white font-semibold text-base mb-3 hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "#e8622a" }}
          >
            ♥ {isMonthly
              ? tP("ctaMonthly", { amount: selectedIndex >= 0 ? selectedAmount : "..." })
              : tP("ctaOnce", { amount: selectedIndex >= 0 ? selectedAmount : "..." })}
          </a>

          {/* Secondary */}
          <a
            href={isMonthly
              ? PAYPAL_URL
              : getDonorboxUrl(selectedIndex >= 0 ? amountOptions[selectedIndex].value : "10", true, isThai)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 text-sm font-medium hover:bg-green-50 active:scale-95 transition-all mb-3"
            style={{ borderColor: "#1a5c2e", color: "#1a5c2e" }}
          >
            {isMonthly ? "Eenmalig via PayPal" : "Maandelijks via Donorbox ♥"}
          </a>
        </>
      )}
    </div>
  );
}
