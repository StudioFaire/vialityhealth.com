import type { ShopifyProduct } from "@/lib/shopify/types";

export function resolveProductMainImageUrl(product: ShopifyProduct): string | undefined {
  return product.image_urls?.[0];
}
