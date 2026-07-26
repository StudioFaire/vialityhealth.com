import { unstable_cache } from "next/cache";
import { shopifyClient } from "./client";
import {
  GetAllProductsQuery,
  GetProductByHandleQuery,
  GetCollectionByHandleQuery,
  GetAllCollectionsQuery,
  GetCartQuery,
} from "./queries";
import {
  CreateCartMutation,
  AddToCartMutation,
  UpdateCartLinesMutation,
  RemoveFromCartMutation,
} from "./mutations";
import type {
  ShopifyProduct,
  ShopifyCart,
  ShopifyCollection,
} from "./types";

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
        products: { edges: { node: ShopifyProduct }[] };
      }>(GetAllProductsQuery, { variables: { first } });
      return assertData(data, "getAllProducts").products.edges.map((e) => e.node);
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
        productByHandle: ShopifyProduct | null;
      }>(GetProductByHandleQuery, { variables: { handle } });
      return assertData(data, "getProductByHandle").productByHandle;
    },
    ["shopify", "product", handle],
    { revalidate: REVALIDATE_SECONDS, tags: ["shopify-products"] }
  );
  return cachedFn();
}

export async function getCollectionByHandle(
  handle: string,
  first = 50
): Promise<ShopifyCollection | null> {
  const cachedFn = unstable_cache(
    async () => {
      const { data } = await shopifyClient.request<{
        collection: ShopifyCollection | null;
      }>(GetCollectionByHandleQuery, { variables: { handle, first } });
      return assertData(data, "getCollectionByHandle").collection;
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
  const { data } = await shopifyClient.request<{
    cartCreate: { cart: ShopifyCart; userErrors: unknown[] };
  }>(CreateCartMutation, {
    variables: {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    },
  });
  return assertData(data, "createCart").cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const { data } = await shopifyClient.request<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: unknown[] };
  }>(AddToCartMutation, {
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
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
