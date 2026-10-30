// Single source of truth for every Shopify cache tag this app revalidates.
//
// The cached reads in `./index.ts`, the webhook handlers in `./revalidate.ts`
// and the manual console at `app/admin/revalidate` all reference these values,
// so an event always invalidates exactly the data that registered the tag.
export const SHOPIFY_TAGS = {
  collections: "shopify-collections",
  menus: "shopify-menus",
  policies: "shopify-policies",
  products: "shopify-products",
} as const;

export type ShopifyTag = (typeof SHOPIFY_TAGS)[keyof typeof SHOPIFY_TAGS];
