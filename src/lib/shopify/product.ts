import { decryptAndReverse } from "@/lib/crypto";
import { applyStaticReplacements } from "./description";
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

function safeImageUrl(value: string): string | undefined {
  const decrypted = safeDecrypt(value);
  if (decrypted) return decrypted;
  // Allow plain URLs too, so newly added list items do not need encryption.
  return /^https?:\/\//i.test(value) ? value : undefined;
}

// Parse the Image URLs list metafield, decrypting encrypted entries and
// keeping plain URL entries as-is.
export function parseImageUrls(value: string | null | undefined): string[] | undefined {
  if (!value) return undefined;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;

    const urls = parsed
      .filter((item): item is string => typeof item === "string")
      .map(safeImageUrl)
      .filter((url): url is string => Boolean(url));

    return urls.length > 0 ? urls : undefined;
  } catch {
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
    image_urls: parseImageUrls(raw.imageUrlsMetafield?.value),
    summary: raw.summaryMetafield?.value,
  };
}

export function getProductImages(product: ShopifyProduct): ShopifyImage[] {
  return product.images.edges.map((e) => e.node);
}

export function getProductShortName(product: ShopifyProduct): string | undefined {
  return product.short_name ? applyStaticReplacements(product.short_name) : undefined;
}

export function getProductImage(product: ShopifyProduct): ShopifyImage | null {
  const imageUrl = product.image_urls?.[0];
  if (imageUrl) {
    return { url: imageUrl, altText: null, width: 0, height: 0 };
  }

  return product.images.edges[0]?.node ?? null;
}

export function getProductVariants(product: ShopifyProduct): ShopifyProductVariant[] {
  return product.variants.edges.map((e) => e.node);
}
