import type { ShopifyProduct } from "@/lib/shopify/types";

export function resolveProductImageUrls(product: ShopifyProduct): string[] {
  return product.image_urls ?? [];
}

export function resolveProductMainImageUrl(product: ShopifyProduct): string | undefined {
  return resolveProductImageUrls(product)[0];
}
