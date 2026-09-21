import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/shopify";
import { MARKET_LIST } from "@/lib/markets";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vialityhealth.com";

const staticPaths = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/shop", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { handle: string; publishedAt: string }[] = [];
  try {
    products = (await getAllProducts(250)).map((product) => ({
      handle: product.handle,
      publishedAt: product.publishedAt,
    }));
  } catch {
    // Shopify not configured yet
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const market of MARKET_LIST) {
    for (const page of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${market.locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
    for (const product of products) {
      entries.push({
        url: `${BASE_URL}/${market.locale}/product/${product.handle}`,
        lastModified: new Date(product.publishedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
  }

  return entries;
}
