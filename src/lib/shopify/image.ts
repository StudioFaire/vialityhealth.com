import type { ShopifyProduct } from "@/lib/shopify/types";

export function resolveProductMainImageUrl(
  product: ShopifyProduct
): string | undefined {
  return product.full_image_url;
}