import type { MetadataRoute } from "next";
import { MARKET_LIST } from "@/lib/markets";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vialityhealth.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", ...MARKET_LIST.map((market) => `/${market.locale}/cart`)],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
