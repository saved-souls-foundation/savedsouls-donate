import type { PrintifyImage, PrintifyOption, PrintifyVariant, ShopProduct, ShippingAddress } from "@/types/printify";

const PRINTIFY_API_BASE = "https://api.printify.com/v1";

type RawPrintifyProduct = {
  id: string;
  title: string;
  description: string;
  visible?: boolean;
  images?: PrintifyImage[];
  variants?: PrintifyVariant[];
  options?: PrintifyOption[];
};

type PrintifyListResponse = {
  data?: RawPrintifyProduct[];
  current_page?: number;
  last_page?: number;
};

export function getPrintifyConfig() {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!apiKey || !shopId) {
    throw new Error("PRINTIFY_API_KEY or PRINTIFY_SHOP_ID is not configured");
  }
  return { apiKey, shopId };
}

async function printifyFetch(path: string, init?: RequestInit) {
  const { apiKey } = getPrintifyConfig();
  const res = await fetch(`${PRINTIFY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json;charset=utf-8",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Printify API error ${res.status}: ${text}`);
  }
  return res.json();
}

function isPublishedProduct(product: RawPrintifyProduct): boolean {
  if (product.visible === false) return false;
  const enabledVariants = (product.variants ?? []).filter((v) => v.is_enabled && v.is_available !== false);
  return enabledVariants.length > 0;
}

function resolveVariantOptions(
  variant: PrintifyVariant,
  productOptions?: PrintifyOption[]
): PrintifyVariant {
  const raw = variant.options;
  if (!Array.isArray(raw) || raw.length === 0 || typeof raw[0] !== "number") {
    return variant;
  }
  const optionIds = raw as number[];
  const resolved: Record<string, string> = {};
  for (const opt of productOptions ?? []) {
    for (const val of opt.values ?? []) {
      if (optionIds.includes(val.id)) {
        if (opt.type === "size" || opt.name.toLowerCase().includes("size")) {
          resolved.size = val.title;
        } else if (opt.type === "color" || opt.name.toLowerCase().includes("color")) {
          resolved.color = val.title;
        }
      }
    }
  }
  return { ...variant, options: resolved };
}

function mapProduct(product: RawPrintifyProduct): ShopProduct {
  const variants = (product.variants ?? [])
    .filter((v) => v.is_enabled && v.is_available !== false)
    .map((v) => resolveVariantOptions(v, product.options));
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    images: product.images ?? [],
    variants,
    options: product.options,
  };
}

export async function fetchPrintifyProducts(): Promise<ShopProduct[]> {
  const { shopId } = getPrintifyConfig();
  const products: ShopProduct[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const json = (await printifyFetch(
      `/shops/${shopId}/products.json?page=${page}&limit=50`
    )) as PrintifyListResponse;
    const batch = (json.data ?? []).filter(isPublishedProduct).map(mapProduct);
    products.push(...batch);
    lastPage = json.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return products;
}

export async function fetchPrintifyProduct(productId: string): Promise<ShopProduct | null> {
  const { shopId } = getPrintifyConfig();
  const product = (await printifyFetch(
    `/shops/${shopId}/products/${encodeURIComponent(productId)}.json`
  )) as RawPrintifyProduct;

  if (!product?.id) return null;

  const mapped = mapProduct(product);
  if (mapped.variants.length > 0) return mapped;

  // Fallback: product exists but variant flags differ between list/detail responses
  const allVariants = (product.variants ?? []).filter((v) => v.is_enabled !== false);
  if (allVariants.length === 0) return null;

  return {
    ...mapped,
    variants: allVariants.map((v) => resolveVariantOptions(v, product.options)),
  };
}

export type PrintifyLineItem = {
  product_id: string;
  variant_id: number;
  quantity: number;
};

export async function createPrintifyOrder(params: {
  external_id: string;
  line_items: PrintifyLineItem[];
  address_to: ShippingAddress;
}) {
  const { shopId } = getPrintifyConfig();
  const body = {
    external_id: params.external_id,
    line_items: params.line_items,
    shipping_method: 1,
    send_shipping_notification: true,
    confirm: true,
    address_to: {
      ...params.address_to,
      address2: params.address_to.address2 ?? "",
      region: params.address_to.region ?? "",
    },
  };
  return printifyFetch(`/shops/${shopId}/orders.json`, {
    method: "POST",
    body: JSON.stringify(body),
  }) as Promise<{ id: string }>;
}

export async function sendPrintifyOrderToProduction(orderId: string) {
  const { shopId } = getPrintifyConfig();
  return printifyFetch(`/shops/${shopId}/orders/${orderId}/send_to_production.json`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}
