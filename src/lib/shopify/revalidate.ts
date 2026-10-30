import { revalidateTag } from "next/cache";
import { SHOPIFY_TAGS } from "./tags";

export function revalidateShopifyProducts() {
  revalidateTag(SHOPIFY_TAGS.products, "hours");
}

export function revalidateShopifyCollections() {
  revalidateTag(SHOPIFY_TAGS.collections, "hours");
}
