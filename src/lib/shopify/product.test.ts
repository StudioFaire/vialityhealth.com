import { describe, expect, it } from "vitest";
import {
  getProductImage,
  getProductImages,
  getProductShortName,
  getProductVariants,
} from "./product";
import type { ShopifyProduct } from "./types";

const product: ShopifyProduct = {
  id: "gid://shopify/Product/1",
  title: "Product",
  handle: "product",
  description: "",
  descriptionHtml: "",
  productType: "",
  options: [],
  variants: {
    edges: [
      {
        node: {
          id: "gid://shopify/ProductVariant/1",
          title: "Default",
          availableForSale: true,
          price: { amount: "10.0", currencyCode: "USD" },
          compareAtPrice: null,
          selectedOptions: [],
          sellingPlanAllocations: { edges: [] },
        },
      },
    ],
  },
  sellingPlanGroups: { edges: [] },
  images: {
    edges: [
      {
        node: {
          url: "https://example.com/a.jpg",
          altText: "A",
          width: 100,
          height: 100,
        },
      },
      {
        node: {
          url: "https://example.com/b.jpg",
          altText: null,
          width: 200,
          height: 200,
        },
      },
    ],
  },
  priceRange: {
    minVariantPrice: { amount: "10.0", currencyCode: "USD" },
    maxVariantPrice: { amount: "10.0", currencyCode: "USD" },
  },
  compareAtPriceRange: {
    minVariantPrice: { amount: "10.0", currencyCode: "USD" },
  },
  tags: [],
  publishedAt: "2024-01-01T00:00:00Z",
};

describe("product helpers", () => {
  it("flattens product images", () => {
    expect(getProductImages(product).map((i) => i.url)).toEqual([
      "https://example.com/a.jpg",
      "https://example.com/b.jpg",
    ]);
  });

  it("returns the first image", () => {
    expect(getProductImage(product)?.url).toBe("https://example.com/a.jpg");
  });

  it("returns undefined for missing short name", () => {
    expect(getProductShortName(product)).toBeUndefined();
  });

  it("flattens variants", () => {
    expect(getProductVariants(product)).toHaveLength(1);
  });
});
