import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/shopify";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vialityhealth.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts(250);
    productPages = products.map((product) => ({
      url: `${BASE_URL}/product/${product.handle}`,
      lastModified: new Date(product.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Shopify not configured yet
  }

  return [...staticPages, ...productPages];
}
