import { revalidateTag } from "next/cache";

export function revalidateShopifyProducts() {
  revalidateTag("shopify-products");
}

export function revalidateShopifyCollections() {
  revalidateTag("shopify-collections");
}
