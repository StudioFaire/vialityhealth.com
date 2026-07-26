import { getCollectionByHandle } from "@/lib/shopify";
import { HomePage } from "@/components/HomePage";

export default async function Page() {
  const collection = await getCollectionByHandle("featured-on-home-viality");
  const products = collection?.products.edges.map((e) => e.node) ?? [];

  return <HomePage featuredProducts={products} />;
}
