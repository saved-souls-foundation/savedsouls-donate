"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const ONETIME_AMOUNTS = [5, 10, 20, 50, 100];
const MONTHLY_AMOUNTS = [5, 10, 20, 50];

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
const mode = process.env.NEXT_PUBLIC_PAYPAL_MODE === "live" ? "live" : "sandbox";
const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_MONTHLY ?? "";

export default function PayPalDonate() {
  const t = useTranslations("donate");
  const [modeType, setModeType] = useState<"onetime" | "monthly">("onetime");
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const effectiveAmount = customAmount.trim() ? parseFloat(customAmount) || 0 : amount;
  const currency = "EUR";

  const createOrder = useCallback(async () => {
    const res = await fetch("/api/payments/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: effectiveAmount, currency }),
    });
    if (!res.ok) throw new Error("Failed to create order");
    const data = (await res.json()) as { orderId?: string };
    if (!data.orderId) throw new Error("No order ID");
    return data.orderId;
  }, [effectiveAmount]);

  if (!clientId) {
    return null;
  }

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-center">
        <p className="text-lg font-semibold text-green-800 dark:text-green-200">{t("thankYou")}</p>
        <p className="mt-2 text-green-700 dark:text-green-300">{t("thankYouBody")}</p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-6 rounded-2xl bg-white/90 dark:bg-white/5 border border-stone-200 dark:border-stone-700">
      <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-4">{t("payWithPaypal")}</h2>
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => setModeType("onetime")}
          className={`px-4 py-2 rounded-lg font-medium ${modeType === "onetime" ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"}`}
        >
          {t("oneTime")}
        </button>
        <button
          type="button"
          onClick={() => setModeType("monthly")}
          className={`px-4 py-2 rounded-lg font-medium ${modeType === "monthly" ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"}`}
        >
          {t("monthly")}
        </button>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">{t("amount")}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {(modeType === "onetime" ? ONETIME_AMOUNTS : MONTHLY_AMOUNTS).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => { setAmount(a); setCustomAmount(""); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${amount === a && !customAmount ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900" : "bg-stone-100 dark:bg-stone-800"}`}
          >
            €{a}
          </button>
        ))}
        <label className="flex items-center gap-1 text-sm">
          <span className="text-stone-500 dark:text-stone-400">{t("customAmount")}:</span>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="€"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-20 px-2 py-1 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900"
          />
        </label>
      </div>
      {effectiveAmount <= 0 && (
        <p className="text-amber-600 dark:text-amber-400 text-sm mb-2">{t("chooseAmount")}</p>
      )}
      <div className="mt-4 min-h-[150px]">
        <PayPalScriptProvider
          options={{
            clientId,
            currency,
            intent: modeType === "onetime" ? "capture" : "subscription",
            vault: modeType === "monthly",
          }}
        >
          {modeType === "onetime" ? (
            <PayPalButtons
              style={{ layout: "vertical" }}
              disabled={effectiveAmount <= 0}
              createOrder={createOrder}
              onApprove={(data) => {
                console.log("PayPal one-time approved", data);
                setSuccess(true);
              }}
              onError={(err) => console.error("PayPal error", err)}
            />
          ) : planId ? (
            <PayPalButtons
              style={{ layout: "vertical" }}
              createSubscription={(_data, actions) =>
                actions.subscription.create({
                  plan_id: planId,
                  application_context: { shipping_preference: "NO_SHIPPING" },
                })
              }
              onApprove={(data) => {
                console.log("PayPal subscription approved", data);
                setSuccess(true);
              }}
              onError={(err) => console.error("PayPal error", err)}
            />
          ) : (
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              {t("monthlyUnavailable")}
            </p>
          )}
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
