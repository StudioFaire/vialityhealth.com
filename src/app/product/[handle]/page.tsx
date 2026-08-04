import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductByHandle, getAllProducts } from "@/lib/shopify";
import { ProductPageClient } from "./ProductPageClient";
import { resolveProductDescription, resolveProductDescriptionText } from "@/lib/shopify/description";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };

  const image = product.images.edges[0]?.node;

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: image ? [{ url: image.url, width: image.width, height: image.height }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const products = await getAllProducts(50);
    return products.map((p) => ({ handle: p.handle }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const description = resolveProductDescription(product);

  const allProducts = await getAllProducts(6);
  const relatedProducts = allProducts
    .filter((p) => p.handle !== product.handle)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      resolvedDescription: resolveProductDescriptionText(p),
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.edges[0]?.node.url,
    brand: { "@type": "Brand", name: "Viality" },
    offers: {
      "@type": "Offer",
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: product.variants.edges.some((e) => e.node.availableForSale)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} description={description} relatedProducts={relatedProducts} />
    </>
  );
}
