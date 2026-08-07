import { Suspense } from "react";
import { getAllProducts, getAllCollections } from "@/lib/shopify";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ShopContent } from "./ShopContent";
import { Reveal } from "@/components/Reveal";
import { resolveProductDescriptionText } from "@/lib/shopify/description";
import { resolveProductMainImageUrl } from "@/lib/shopify/image";

export const metadata = {
  title: "Shop",
  description:
    "Browse our collection of research grade peptides — 99% purity, third-party verified, batch transparency.",
};

type Collection = { id: string; title: string; handle: string };

export default async function ShopPage() {
  let products: ShopifyProduct[] = [];
  let collections: Collection[] = [];
  try {
    [products, collections] = await Promise.all([
      getAllProducts(50),
      getAllCollections(20),
    ]);
  } catch {
    // Shopify not configured yet
  }

  const productsWithDescriptions = products.map((product) => ({
    ...product,
    resolvedDescription: resolveProductDescriptionText(product),
    mainImageUrl: resolveProductMainImageUrl(product),
  }));

  return (
    <div className="min-h-screen bg-background pt-10 pb-24">
      <div className="container mx-auto px-4">
        <Reveal y={24} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">
            Shop
          </h1>
          <p className="text-foreground/60">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </Reveal>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-4/5 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ShopContent products={productsWithDescriptions} collections={collections} />
        </Suspense>
      </div>
    </div>
  );
}
