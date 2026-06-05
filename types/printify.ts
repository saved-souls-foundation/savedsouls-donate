export type PrintifyImage = {
  src: string;
  variant_ids?: number[];
  is_default?: boolean;
};

export type PrintifyVariant = {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
  is_available?: boolean;
  sku?: string;
  options?: number[] | { color?: string; size?: string };
};

export type PrintifyOptionValue = {
  id: number;
  title: string;
};

export type PrintifyOption = {
  name: string;
  type: string;
  values: PrintifyOptionValue[];
};

export type ShopProduct = {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  options?: PrintifyOption[];
};

export type CartItem = {
  productId: string;
  variantId: number;
  title: string;
  variantTitle: string;
  priceUsdCents: number;
  quantity: number;
  image: string;
};

export type ShippingAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

export type ShopCurrency = "USD" | "EUR" | "THB";
