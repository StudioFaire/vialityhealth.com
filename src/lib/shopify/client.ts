import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
const publicToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN ?? "";
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_VERSION ?? "2026-07";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: `https://${domain}`,
  apiVersion,
  publicAccessToken: publicToken,
});
