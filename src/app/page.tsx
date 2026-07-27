import { getCollectionByHandle } from "@/lib/shopify";
import { HomePage } from "@/components/HomePage";
import type { ShopifyProduct } from "@/lib/shopify/types";

export default async function Page() {
  let products: ShopifyProduct[] = [];

  try {
    const collection = await getCollectionByHandle("home-viality");
    products = collection?.products.edges.map((e) => e.node) ?? [];
  } catch {
    // Shopify not configured yet
  }

  return <HomePage featuredProducts={products} />;
}
