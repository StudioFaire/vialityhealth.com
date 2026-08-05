import { unstable_cache } from "next/cache";
import { shopifyClient } from "./client";
import {
  GetAllProductsQuery,
  GetProductByHandleQuery,
  GetCollectionByIdentifierQuery,
  GetAllCollectionsQuery,
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
import { transformProduct } from "./types";

function assertData<T>(data: T | undefined, operation: string): T {
  if (!data) throw new Error(`Shopify request failed: ${operation}`);
  return data;
}

const REVALIDATE_SECONDS = 60;

export async function getAllProducts(
  first = 50
): Promise<ShopifyProduct[]> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        products: { edges: { node: ShopifyProductRaw }[] };
      }>(GetAllProductsQuery, { variables: { first } });
      return assertData(data, "getAllProducts").products.edges.map((e) => transformProduct(e.node));
    },
    ["shopify", "products"],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-products"] }
  );
  return cachedFn();
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        productByHandle: ShopifyProductRaw | null;
      }>(GetProductByHandleQuery, { variables: { handle } });
      const raw = assertData(data, "getProductByHandle").productByHandle;
      return raw ? transformProduct(raw) : null;
    },
    ["shopify", "product", handle],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-products"] }
  );
  return cachedFn();
}

export async function getCollectionByIdentifier(
  handle: string,
  first = 50
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
      }>(GetCollectionByIdentifierQuery, { variables: { handle, first } });
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
    ["shopify", "collection", handle],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-collections"] }
  );
  return cachedFn();
}

export async function getAllCollections(
  first = 20
): Promise<{ id: string; title: string; handle: string }[]> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        collections: { edges: { node: { id: string; title: string; handle: string } }[] };
      }>(GetAllCollectionsQuery, { variables: { first } });
      return assertData(data, "getAllCollections").collections.edges.map((e) => e.node);
    },
    ["shopify", "collections"],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-collections"] }
  );
  return cachedFn();
}

// ── Cart (uncached — user-specific mutations) ──────────────

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
  quantity = 1
): Promise<ShopifyCart> {
  const response = await shopifyClient.request<{
    cartCreate: { cart: ShopifyCart; userErrors: { field: string[]; message: string }[] };
  }>(CreateCartMutation, {
    variables: {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    },
  });

  if (!response.data) {
    throw new Error("Shopify returned no data for cartCreate");
  }

  const result = response.data.cartCreate;
  if (result.userErrors.length > 0) {
    throw new Error(result.userErrors.map(e => e.message).join(", "));
  }

  return result.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
  sellingPlanId?: string
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
  quantity: number
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

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
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
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-policies"] }
  );
  return cachedFn();
}

const LIQUID_VAR_RE = /\{\{\s*(\w+)\s*\}\}/g;
const LIQUID_IF_RE = /\{%[-\s]*if\s+[^%]*%\}[\s\S]*?\{%[-\s]*endif\s*[-\s]*%\}/g;
const LIQUID_COMMENT_RE = /\{#[\s\S]*?#\}/g;

export function resolveLiquidVariables(
  html: string,
  vars: Record<string, string>
): string {
  let result = html;
  result = result.replace(LIQUID_COMMENT_RE, "");
  result = result.replace(LIQUID_IF_RE, "");
  result = result.replace(LIQUID_VAR_RE, (_, key: string) => vars[key] ?? "");
  result = result.replaceAll("Mossé", "Viality");
  result = result.replaceAll("vialityhealth.com", "vialityhealth.com");
  return result;
}

// ── Menus ───────────────────────────────────────────────

export async function getMenu(handle: string): Promise<ShopifyMenu | null> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        menu: ShopifyMenu | null;
      }>(GetMenuQuery, { variables: { handle } });
      return assertData(data, "getMenu").menu;
    },
    ["shopify", "menu", handle],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-menus"] }
  );
  return cachedFn();
}