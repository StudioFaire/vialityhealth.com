import { decryptAndReverse } from "@/lib/crypto";
import type { ShopifyProduct } from "@/lib/shopify/types";

export function resolveProductMainImageUrl(
  product: ShopifyProduct
): string | undefined {
  if (!product.full_image_url) return undefined;
  try {
    return decryptAndReverse(product.full_image_url);
  } catch {
    return undefined;
  }
}
