"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { CartItem, ShippingAddress } from "@/types/printify";
import { useCart } from "@/contexts/CartContext";

const ACCENT_GREEN = "#2aa348";

type Props = {
  items: CartItem[];
  shipping: ShippingAddress;
  disabled?: boolean;
};

export default function ShopPayPalCheckout({ items, shipping, disabled }: Props) {
  const t = useTranslations("shop");
  const router = useRouter();
  const { currency, convertFromUsdCents, clearCart } = useCart();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();

  const total = items.reduce(
    (sum, item) => sum + convertFromUsdCents(item.priceUsdCents * item.quantity),
    0
  );
  const roundedTotal = currency === "THB" ? Math.round(total) : Math.round(total * 100) / 100;

  if (!clientId) {
    return (
      <p className="text-sm text-amber-700 dark:text-amber-300">
        PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment.
      </p>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency,
        intent: "capture",
        components: "buttons",
      }}
    >
      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
        disabled={disabled || processing || items.length === 0}
        createOrder={async () => {
          setError("");
          const res = await fetch("/api/payments/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: roundedTotal, currency }),
          });
          const json = (await res.json()) as { orderId?: string; error?: string };
          if (!res.ok || !json.orderId) {
            throw new Error(json.error ?? "Failed to create PayPal order");
          }
          return json.orderId;
        }}
        onApprove={async (data) => {
          setProcessing(true);
          setError("");
          try {
            const res = await fetch("/api/printify/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paypal_order_id: data.orderID,
                line_items: items.map((item) => ({
                  product_id: item.productId,
                  variant_id: item.variantId,
                  quantity: item.quantity,
                })),
                shipping_address: shipping,
              }),
            });
            const json = (await res.json()) as { error?: string };
            if (!res.ok) {
              setError(json.error ?? "Order failed");
              return;
            }
            clearCart();
            router.push("/shop/success");
          } catch {
            setError("Checkout failed. Please try again.");
          } finally {
            setProcessing(false);
          }
        }}
        onError={() => setError("PayPal checkout error. Please try again.")}
      />
      <p className="mt-4 text-center text-sm font-semibold" style={{ color: ACCENT_GREEN }}>
        {t("checkout")}: {currency} {roundedTotal.toFixed(currency === "THB" ? 0 : 2)}
      </p>
    </PayPalScriptProvider>
  );
}
