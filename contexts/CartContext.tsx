"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, ShopCurrency } from "@/types/printify";

const CART_STORAGE_KEY = "savedsouls_shop_cart";
const CURRENCY_STORAGE_KEY = "savedsouls_shop_currency";

type ExchangeRates = Record<string, number>;

type CartContextValue = {
  items: CartItem[];
  currency: ShopCurrency;
  rates: ExchangeRates | null;
  ratesLoading: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: number) => void;
  updateQuantity: (productId: string, variantId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalUsdCents: number;
  formatPrice: (usdCents: number) => string;
  convertFromUsdCents: (usdCents: number) => number;
  setCurrency: (currency: ShopCurrency) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadCurrency(): ShopCurrency {
  if (typeof window === "undefined") return "EUR";
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored === "USD" || stored === "EUR" || stored === "THB") return stored;
  return "EUR";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrencyState] = useState<ShopCurrency>("EUR");
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setCurrencyState(loadCurrency());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency, hydrated]);

  useEffect(() => {
    let cancelled = false;
    async function fetchRates() {
      setRatesLoading(true);
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("Rates fetch failed");
        const json = (await res.json()) as { rates?: ExchangeRates };
        if (!cancelled) setRates(json.rates ?? null);
      } catch {
        if (!cancelled) setRates({ USD: 1, EUR: 0.92, THB: 35 });
      } finally {
        if (!cancelled) setRatesLoading(false);
      }
    }
    fetchRates();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((next: ShopCurrency) => {
    setCurrencyState(next);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: number) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
      );
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const convertFromUsdCents = useCallback(
    (usdCents: number) => {
      const usd = usdCents / 100;
      const rate = rates?.[currency] ?? 1;
      return usd * rate;
    },
    [currency, rates]
  );

  const formatPrice = useCallback(
    (usdCents: number) => {
      const value = convertFromUsdCents(usdCents);
      const symbols: Record<ShopCurrency, string> = { USD: "$", EUR: "€", THB: "฿" };
      const decimals = currency === "THB" ? 0 : 2;
      return `${symbols[currency]}${value.toFixed(decimals)}`;
    },
    [convertFromUsdCents, currency]
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotalUsdCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceUsdCents * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      currency,
      rates,
      ratesLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotalUsdCents,
      formatPrice,
      convertFromUsdCents,
      setCurrency,
    }),
    [
      items,
      currency,
      rates,
      ratesLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotalUsdCents,
      formatPrice,
      convertFromUsdCents,
      setCurrency,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
