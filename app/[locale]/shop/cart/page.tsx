"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ParallaxPage from "../../../components/ParallaxPage";
import Footer from "../../../components/Footer";
import ShopPayPalCheckout from "../../../components/ShopPayPalCheckout";
import { useCart } from "@/contexts/CartContext";
import type { ShippingAddress } from "@/types/printify";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/savedsoul-logo.webp";

const emptyShipping: ShippingAddress = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "NL",
  region: "",
  address1: "",
  address2: "",
  city: "",
  zip: "",
};

export default function ShopCartPage() {
  const t = useTranslations("shop");
  const { items, removeItem, updateQuantity, formatPrice, subtotalUsdCents } = useCart();
  const [shipping, setShipping] = useState<ShippingAddress>(emptyShipping);

  const shippingValid = useMemo(() => {
    return (
      shipping.first_name.trim() &&
      shipping.last_name.trim() &&
      shipping.email.trim() &&
      shipping.phone.trim() &&
      shipping.country.trim().length === 2 &&
      shipping.address1.trim() &&
      shipping.city.trim() &&
      shipping.zip.trim()
    );
  }, [shipping]);

  const updateField = <K extends keyof ShippingAddress>(key: K, value: ShippingAddress[K]) => {
    setShipping((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Link href="/shop" className="inline-block mb-6 text-sm font-medium text-stone-600 dark:text-stone-400 hover:underline">
          ← {t("title")}
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-stone-800 dark:text-stone-100 mb-8">
          {t("cart")}
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 p-10 text-center">
            <p className="text-stone-600 dark:text-stone-400 mb-6">{t("ctaText")}</p>
            <Link
              href="/shop"
              className="inline-flex px-8 py-3 rounded-xl font-bold text-white"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {t("title")} →
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-4 mb-10">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 bg-stone-100"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-800 dark:text-stone-100 truncate">{item.title}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{item.variantTitle}</p>
                    <p className="font-semibold mt-1" style={{ color: ACCENT_GREEN }}>
                      {formatPrice(item.priceUsdCents)}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <label className="text-sm text-stone-600 dark:text-stone-400">
                        Qty
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, item.variantId, Number(e.target.value))
                          }
                          className="ml-2 w-16 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-2 py-1 text-sm"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-right text-xl font-bold mb-8 text-stone-800 dark:text-stone-100">
              Total: <span style={{ color: ACCENT_GREEN }}>{formatPrice(subtotalUsdCents)}</span>
            </p>

            <section className="rounded-2xl border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 p-6 mb-8">
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">
                Shipping address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  placeholder="First name"
                  value={shipping.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  className="rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Last name"
                  value={shipping.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  className="rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={shipping.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="sm:col-span-2 rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Phone"
                  value={shipping.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="sm:col-span-2 rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Address"
                  value={shipping.address1}
                  onChange={(e) => updateField("address1", e.target.value)}
                  className="sm:col-span-2 rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Address line 2 (optional)"
                  value={shipping.address2 ?? ""}
                  onChange={(e) => updateField("address2", e.target.value)}
                  className="sm:col-span-2 rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="ZIP / Postal code"
                  value={shipping.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                  className="rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Region / State"
                  value={shipping.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  className="rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Country (2-letter, e.g. NL)"
                  value={shipping.country}
                  onChange={(e) => updateField("country", e.target.value.toUpperCase().slice(0, 2))}
                  maxLength={2}
                  className="rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm uppercase"
                />
              </div>
            </section>

            <section className="rounded-2xl border-2 border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800/50 p-6">
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">
                {t("checkout")}
              </h2>
              {!shippingValid && (
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                  Fill in your shipping address to continue.
                </p>
              )}
              <ShopPayPalCheckout
                items={items}
                shipping={shipping}
                disabled={!shippingValid}
              />
            </section>
          </>
        )}
      </main>
      <Footer />
    </ParallaxPage>
  );
}
