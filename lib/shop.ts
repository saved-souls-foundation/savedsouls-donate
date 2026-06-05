import type { ShopProduct } from "@/types/printify";

export function getProductImage(product: ShopProduct, variantId?: number): string {
  if (variantId != null) {
    const match = product.images.find((img) => img.variant_ids?.includes(variantId));
    if (match?.src) return match.src;
  }
  const defaultImg = product.images.find((img) => img.is_default) ?? product.images[0];
  return defaultImg?.src ?? "/savedsoul-logo.webp";
}

export function getLowestPriceCents(product: ShopProduct): number {
  const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : 0;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getOptionValues(product: ShopProduct, type: "size" | "color") {
  const option = product.options?.find((o) => o.type === type || o.name.toLowerCase() === type);
  return option?.values ?? [];
}
