import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle, getAllProducts } from "@/lib/shopify";
import { ProductPageClient } from "./ProductPageClient";
import {
  resolveProductDescription,
  resolveProductMetaTitle,
  resolveProductMetaDescription,
} from "@/lib/shopify/description";
import { resolveProductMainImageUrl } from "@/lib/shopify/image";
import { getFreeShippingConfig } from "@/lib/shopify/discount";
import { countryForLocale } from "@/lib/markets";

type Props = {
  params: Promise<{ locale: string; handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, handle } = await params;
  const product = await getProductByHandle(handle, countryForLocale(locale));
  if (!product) return { title: "Product Not Found" };

  const image = product.images.edges[0]?.node;
  const metaTitle = resolveProductMetaTitle(product);
  const metaDescription = resolveProductMetaDescription(product);

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
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
  const { locale, handle } = await params;
  const product = await getProductByHandle(handle, countryForLocale(locale));

  if (!product) {
    notFound();
  }

  const description = resolveProductDescription(product);
  const mainImageUrl = resolveProductMainImageUrl(product);
  const freeShippingText = (await getFreeShippingConfig())?.text;

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

  const jsonLdString = JSON.stringify(jsonLd)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      <ProductPageClient
        product={product}
        description={description}
        mainImageUrl={mainImageUrl}
        freeShippingText={freeShippingText}
      />
    </>
  );
}
