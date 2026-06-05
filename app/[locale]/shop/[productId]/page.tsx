"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ParallaxPage from "../../../components/ParallaxPage";
import Footer from "../../../components/Footer";
import { useCart } from "@/contexts/CartContext";
import type { PrintifyVariant, ShopProduct } from "@/types/printify";
import { getOptionValues, getProductImage, stripHtml } from "@/lib/shop";

const ACCENT_GREEN = "#2aa348";
const FALLBACK_IMAGE = "/savedsoul-logo.webp";

function resolveProductId(params: ReturnType<typeof useParams>): string {
  const raw = params.productId;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw[0] ?? "";
  return "";
}

export default function ShopProductPage() {
  const params = useParams();
  const productId = resolveProductId(params);
  const t = useTranslations("shop");
  const { addItem, formatPrice } = useCart();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    fetch(`/api/printify/products/${encodeURIComponent(productId)}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json() as Promise<ShopProduct>;
      })
      .then((data) => {
        setProduct(data);
        if (data?.variants[0]) setSelectedVariantId(data.variants[0].id);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const sizeOptions = useMemo(() => (product ? getOptionValues(product, "size") : []), [product]);
  const colorOptions = useMemo(() => (product ? getOptionValues(product, "color") : []), [product]);

  const selectedVariant: PrintifyVariant | undefined = useMemo(() => {
    if (!product) return undefined;
    if (selectedVariantId != null) {
      return product.variants.find((v) => v.id === selectedVariantId);
    }
    return product.variants[0];
  }, [product, selectedVariantId]);

  useEffect(() => {
    if (!product || product.variants.length === 0) return;
    if (sizeOptions.length === 0 && colorOptions.length === 0) return;

    const match = product.variants.find((variant) => {
      const opts = variant.options;
      if (opts && typeof opts === "object" && !Array.isArray(opts)) {
        const sizeOk =
          selectedSizeId == null ||
          sizeOptions.some(
            (s) => s.id === selectedSizeId && opts.size?.toLowerCase() === s.title.toLowerCase()
          );
        const colorOk =
          selectedColorId == null ||
          colorOptions.some(
            (c) => c.id === selectedColorId && opts.color?.toLowerCase() === c.title.toLowerCase()
          );
        return sizeOk && colorOk;
      }
      const parts = variant.title.split("/").map((p) => p.trim().toLowerCase());
      const sizeOk =
        selectedSizeId == null ||
        sizeOptions.some(
          (s) => s.id === selectedSizeId && parts.some((p) => p === s.title.toLowerCase())
        );
      const colorOk =
        selectedColorId == null ||
        colorOptions.some(
          (c) => c.id === selectedColorId && parts.some((p) => p === c.title.toLowerCase())
        );
      return sizeOk && colorOk;
    });
    if (match) setSelectedVariantId(match.id);
  }, [product, selectedSizeId, selectedColorId, sizeOptions, colorOptions]);

  const image = product
    ? getProductImage(product, selectedVariant?.id ?? selectedVariantId ?? undefined)
    : FALLBACK_IMAGE;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      variantTitle: selectedVariant.title,
      priceUsdCents: selectedVariant.price,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
        <main className="max-w-4xl mx-auto px-4 py-20 text-center text-stone-600">Loading…</main>
        <Footer />
      </ParallaxPage>
    );
  }

  if (!product) {
    return (
      <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-stone-600 dark:text-stone-400 mb-6">Product not found.</p>
          <Link href="/shop" className="font-bold" style={{ color: ACCENT_GREEN }}>
            ← {t("title")}
          </Link>
        </main>
        <Footer />
      </ParallaxPage>
    );
  }

  return (
    <ParallaxPage backgroundImage="/savedsoul-logo-bg.webp">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/shop" className="inline-block mb-6 text-sm font-medium text-stone-600 dark:text-stone-400 hover:underline">
          ← {t("title")}
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={product.title}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>

          <div>
            <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-4">
              {product.title}
            </h1>
            {selectedVariant && (
              <p className="text-2xl font-bold mb-6" style={{ color: ACCENT_GREEN }}>
                {formatPrice(selectedVariant.price)}
              </p>
            )}
            <p className="text-stone-600 dark:text-stone-400 mb-8 whitespace-pre-line text-sm leading-relaxed">
              {stripHtml(product.description)}
            </p>

            {sizeOptions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  {t("selectSize")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedSizeId(opt.id)}
                      className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedSizeId === opt.id
                          ? "border-[#2aa348] bg-[#2aa348]/10 text-stone-900 dark:text-stone-100"
                          : "border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {opt.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colorOptions.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  {t("selectColor")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedColorId(opt.id)}
                      className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedColorId === opt.id
                          ? "border-[#2aa348] bg-[#2aa348]/10 text-stone-900 dark:text-stone-100"
                          : "border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {opt.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizeOptions.length === 0 && colorOptions.length === 0 && product.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Variant
                </label>
                <select
                  value={selectedVariantId ?? ""}
                  onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                  className="w-full rounded-lg border-2 border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title} — {formatPrice(v.price)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedVariant}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ backgroundColor: ACCENT_GREEN }}
            >
              {added ? "✓" : t("addToCart")}
            </button>

            <Link
              href="/shop/cart"
              className="mt-4 block text-center text-sm font-medium hover:underline"
              style={{ color: ACCENT_GREEN }}
            >
              {t("cart")} →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </ParallaxPage>
  );
}
