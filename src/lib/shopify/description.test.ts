import { describe, expect, it } from "vitest";
import {
  applyStaticReplacements,
  getFirstParagraph,
  resolveProductDescription,
  resolveProductMetaDescription,
  resolveProductMetaTitle,
} from "./description";
import type { ShopifyProduct } from "./types";

const baseProduct: ShopifyProduct = {
  id: "gid://shopify/Product/1",
  title: "Long Product Name",
  handle: "long-product-name",
  description: "<p>Hello</p>",
  descriptionHtml: "<p>{{m}} supports {{cr}}.</p>",
  productType: "",
  options: [],
  variants: { edges: [] },
  sellingPlanGroups: { edges: [] },
  images: { edges: [] },
  priceRange: {
    minVariantPrice: { amount: "10.0", currencyCode: "USD" },
    maxVariantPrice: { amount: "10.0", currencyCode: "USD" },
  },
  compareAtPriceRange: {
    minVariantPrice: { amount: "10.0", currencyCode: "USD" },
  },
  tags: [],
  publishedAt: "2024-01-01T00:00:00Z",
  short_name: "Short Name",
};

describe("applyStaticReplacements", () => {
  it("replaces static tokens", () => {
    expect(applyStaticReplacements("{{m}} and {{sp}}")).toBe("melanocortin and synthetic peptide");
  });

  it("strips line breaks and empty spans", () => {
    expect(applyStaticReplacements("a<br>b<span></span>")).toBe("ab");
  });

  it("handles nullish input", () => {
    expect(applyStaticReplacements(undefined as unknown as string)).toBe("");
  });
});

describe("resolveProductDescription", () => {
  it("substitutes full/short name placeholders", () => {
    const product = {
      ...baseProduct,
      descriptionHtml: "<p>{{full_name}} / {{short_name}}</p>",
      full_name: "FULL",
      short_name: "SHORT",
    };
    expect(resolveProductDescription(product)).toBe("<p>FULL / SHORT</p>");
  });

  it("falls back to plain description when HTML is empty", () => {
    const product = { ...baseProduct, descriptionHtml: "", description: "plain text" };
    expect(resolveProductDescription(product)).toBe("plain text");
  });
});

describe("getFirstParagraph", () => {
  it("extracts the first paragraph and strips tags", () => {
    expect(getFirstParagraph("<p>First line</p><p>Second</p>")).toBe("First line");
  });

  it("uses the raw text when no paragraph exists", () => {
    expect(getFirstParagraph("just text")).toBe("just text");
  });
});

describe("resolveProductMeta*", () => {
  it("prefers short name for the title", () => {
    expect(resolveProductMetaTitle(baseProduct)).toBe("Short Name");
  });

  it("falls back to the product title", () => {
    expect(resolveProductMetaTitle({ ...baseProduct, short_name: undefined })).toBe(
      "Long Product Name",
    );
  });

  it("truncates long descriptions to ~160 chars", () => {
    const product = {
      ...baseProduct,
      descriptionHtml: "",
      description: `<p>${"x".repeat(200)}</p>`,
    };
    const result = resolveProductMetaDescription(product);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("...")).toBe(true);
  });
});
