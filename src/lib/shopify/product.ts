import { decryptAndReverse } from "@/lib/crypto";
import type {
  ShopifyImage,
  ShopifyProduct,
  ShopifyProductRaw,
  ShopifyProductVariant,
} from "./types";

function safeDecrypt(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return decryptAndReverse(value);
  } catch {
    // No encryption key or corrupt cipher — treat the field as unavailable.
    return undefined;
  }
}

// Transform raw product data (with metafields) into ShopifyProduct.
export function transformProduct(raw: ShopifyProductRaw): ShopifyProduct {
  return {
    id: raw.id,
    title: raw.title,
    handle: raw.handle,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    productType: raw.productType,
    options: raw.options,
    variants: raw.variants,
    sellingPlanGroups: raw.sellingPlanGroups,
    images: raw.images,
    priceRange: raw.priceRange,
    compareAtPriceRange: raw.compareAtPriceRange,
    tags: raw.tags,
    publishedAt: raw.publishedAt,
    full_name: safeDecrypt(raw.fullNameMetafield?.value),
    short_name: safeDecrypt(raw.shortNameMetafield?.value),
    full_image_url: safeDecrypt(raw.fullImageUrlMetafield?.value),
    summary: raw.summaryMetafield?.value,
  };
}

export function getProductImages(product: ShopifyProduct): ShopifyImage[] {
  return product.images.edges.map((e) => e.node);
}

export function getProductShortName(product: ShopifyProduct): string | undefined {
  return product.short_name;
}

export function getProductImage(product: ShopifyProduct): ShopifyImage | null {
  if (product.full_image_url) {
    return { url: product.full_image_url, altText: null, width: 0, height: 0 };
  }

  return product.images.edges[0]?.node ?? null;
}

export function getProductVariants(product: ShopifyProduct): ShopifyProductVariant[] {
  return product.variants.edges.map((e) => e.node);
}
