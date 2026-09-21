import { getCollectionByIdentifier } from "@/lib/shopify";
import { HomePage } from "@/components/HomePage";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { countryForLocale } from "@/lib/markets";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const country = countryForLocale(locale);

  let products: ShopifyProduct[] = [];
  try {
    const collection = await getCollectionByIdentifier("home-viality", 50, country);
    products = collection?.products.edges.map((e) => e.node) ?? [];
  } catch {
    // Shopify not configured yet
  }

  return <HomePage featuredProducts={products} />;
}
