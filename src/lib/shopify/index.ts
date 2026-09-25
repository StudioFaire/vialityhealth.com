import { unstable_cache } from "next/cache";
import { shopifyClient } from "./client";
import {
  GetAllProductsQuery,
  GetProductByHandleQuery,
  GetCollectionByIdentifierQuery,
  GetCartQuery,
  GetMenuQuery,
  GetShopPoliciesQuery,
} from "./queries";
import {
  CreateCartMutation,
  AddToCartMutation,
  UpdateCartLinesMutation,
  RemoveFromCartMutation,
} from "./mutations";
import type {
  ShopifyProduct,
  ShopifyProductRaw,
  ShopifyCart,
  ShopifyCollection,
  ShopifyMenu,
  ShopPolicies,
} from "./types";
import { transformProduct } from "./product";
import { DEFAULT_COUNTRY } from "@/lib/markets";

function assertData<T>(data: T | undefined, operation: string): T {
  if (!data) throw new Error(`Shopify request failed: ${operation}`);
  return data;
}

const REVALIDATE_SECONDS = 60;

export async function getAllProducts(
  first = 50,
  country = DEFAULT_COUNTRY,
): Promise<ShopifyProduct[]> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        products: { edges: { node: ShopifyProductRaw }[] };
      }>(GetAllProductsQuery, { variables: { first, country } });
      return assertData(data, "getAllProducts").products.edges.map((e) => transformProduct(e.node));
    },
    ["shopify", "products", country],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-products"] },
  );
  return cachedFn();
}

export async function getProductByHandle(
  handle: string,
  country = DEFAULT_COUNTRY,
): Promise<ShopifyProduct | null> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        productByHandle: ShopifyProductRaw | null;
      }>(GetProductByHandleQuery, { variables: { handle, country } });
      const raw = assertData(data, "getProductByHandle").productByHandle;
      return raw ? transformProduct(raw) : null;
    },
    ["shopify", "product", handle, country],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-products"] },
  );
  return cachedFn();
}

export async function getCollectionByIdentifier(
  handle: string,
  first = 50,
  country = DEFAULT_COUNTRY,
): Promise<ShopifyCollection | null> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        collection: {
          id: string;
          title: string;
          handle: string;
          description: string;
          products: { edges: { node: ShopifyProductRaw }[] };
        } | null;
      }>(GetCollectionByIdentifierQuery, { variables: { handle, first, country } });
      const raw = assertData(data, "getCollectionByIdentifier").collection;
      if (!raw) return null;
      return {
        ...raw,
        products: {
          edges: raw.products.edges.map((e) => ({
            node: transformProduct(e.node),
          })),
        },
      };
    },
    ["shopify", "collection", handle, country],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-collections"] },
  );
  return cachedFn();
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const { data } = await shopifyClient.request<{
      cart: ShopifyCart | null;
    }>(GetCartQuery, { variables: { cartId } });
    return assertData(data, "getCart").cart;
  } catch {
    return null;
  }
}

export async function createCart(
  variantId: string,
  quantity = 1,
  country = DEFAULT_COUNTRY,
): Promise<ShopifyCart> {
  const response = await shopifyClient.request<{
    cartCreate: { cart: ShopifyCart; userErrors: { field: string[]; message: string }[] };
  }>(CreateCartMutation, {
    variables: {
      input: {
        buyerIdentity: { countryCode: country },
        lines: [{ merchandiseId: variantId, quantity }],
      },
    },
  });

  if (!response.data) {
    throw new Error("Shopify returned no data for cartCreate");
  }

  const result = response.data.cartCreate;
  if (result.userErrors.length > 0) {
    throw new Error(result.userErrors.map((e) => e.message).join(", "));
  }

  return result.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
  sellingPlanId?: string,
): Promise<ShopifyCart> {
  const lineInput: { merchandiseId: string; quantity: number; sellingPlanId?: string } = {
    merchandiseId: variantId,
    quantity,
  };
  if (sellingPlanId) {
    lineInput.sellingPlanId = sellingPlanId;
  }
  const { data } = await shopifyClient.request<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: unknown[] };
  }>(AddToCartMutation, {
    variables: {
      cartId,
      lines: [lineInput],
    },
  });
  return assertData(data, "addToCart").cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const { data } = await shopifyClient.request<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: unknown[] };
  }>(UpdateCartLinesMutation, {
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });
  return assertData(data, "updateCartLines").cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const { data } = await shopifyClient.request<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: unknown[] };
  }>(RemoveFromCartMutation, { variables: { cartId, lineIds } });
  return assertData(data, "removeFromCart").cartLinesRemove.cart;
}

// ── Policies ───────────────────────────────────────────────

export async function getShopPolicies(): Promise<ShopPolicies> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        shop: ShopPolicies;
      }>(GetShopPoliciesQuery);
      return assertData(data, "getShopPolicies").shop;
    },
    ["shopify", "policies"],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-policies"] },
  );
  return cachedFn();
}

const LIQUID_VAR_RE = /\{\{\s*(\w+)\s*\}\}/g;
const LIQUID_IF_RE = /\{%[-\s]*if\s+[^%]*%\}[\s\S]*?\{%[-\s]*endif\s*[-\s]*%\}/g;
const LIQUID_COMMENT_RE = /\{#[\s\S]*?#\}/g;

export function resolveLiquidVariables(html: string, vars: Record<string, string>): string {
  let result = html;
  result = result.replace(LIQUID_COMMENT_RE, "");
  result = result.replace(LIQUID_IF_RE, "");
  result = result.replace(LIQUID_VAR_RE, (_, key: string) => vars[key] ?? "");
  result = result.replaceAll("Mossé", "Viality");
  result = result.replaceAll("mossewellness.com", "vialityhealth.com");
  return result;
}

// ── Menus ───────────────────────────────────────────────

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";

function toRelativeUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const isStoreUrl = host === storeDomain || host.endsWith(".myshopify.com");
    if (isStoreUrl) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    // Not an absolute URL, leave as-is.
  }
  return rawUrl;
}

// Shopify's default policy handles differ from this site's route names.
// Map Shopify policy URLs to the routes defined under src/app/policies.
const POLICY_ROUTE_MAP: Record<string, string> = {
  "/policies/refund-policy": "/policies/returns-and-refund",
  "/policies/privacy-policy": "/policies/privacy",
  "/policies/shipping-policy": "/policies/shipping",
  "/policies/subscription-policy": "/policies/cancellation-policy",
  "/shipping": "/policies/shipping",
};

function mapMenuUrl(relativeUrl: string): string {
  return POLICY_ROUTE_MAP[relativeUrl] ?? relativeUrl;
}

export async function getMenu(handle: string): Promise<ShopifyMenu | null> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        menu: ShopifyMenu | null;
      }>(GetMenuQuery, { variables: { handle } });
      const menu = assertData(data, "getMenu").menu;
      if (!menu) return null;
      return {
        ...menu,
        items: menu.items.map((item) => ({
          ...item,
          url: mapMenuUrl(toRelativeUrl(item.url)),
        })),
      };
    },
    ["shopify", "menu", handle],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-menus"] },
  );
  return cachedFn();
}
