"use client";

import { CartProvider } from "@/contexts/CartContext";

export default function ShopProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
