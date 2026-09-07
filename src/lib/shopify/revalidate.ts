import { revalidateTag } from "next/cache";

export function revalidateShopifyProducts() {
  revalidateTag("shopify-products", "hours");
}

export function revalidateShopifyCollections() {
  revalidateTag("shopify-collections", "hours");
}
