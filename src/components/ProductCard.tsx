"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import type { ShopifyProduct } from "@/lib/shopify/types";
import {
  getProductImage,
  getProductVariants,
  getPrice,
} from "@/lib/shopify/types";

export function StarRating({
  rating,
  count,
}: {
  rating: number;
  count?: number;
}) {
  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex text-accent">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= Math.round(rating)
                ? "fill-current"
                : "text-border fill-transparent"
            }
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-foreground/60">({count})</span>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const image = getProductImage(product);
  const variants = getProductVariants(product);
  const firstVariant = variants[0];
  const hasComparePrice =
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 0;
  const productType = product.productType;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    setIsAdding(true);
    addItem(firstVariant.id, 1);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <Link href={`/product/${product.handle}`}>
      <div className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-4/5 bg-muted overflow-hidden">
          <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-white/90 backdrop-blur text-primary text-[10px] uppercase tracking-widest font-semibold rounded-full shadow-sm">
            {productType}
          </div>
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-lg text-primary mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-foreground/70 mb-4 flex-1 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </span>
              {hasComparePrice && (
                <span className="text-sm text-foreground/50 line-through">
                  {formatPrice(
                    product.compareAtPriceRange.minVariantPrice.amount,
                    product.compareAtPriceRange.minVariantPrice.currencyCode
                  )}
                </span>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={isAdding || !firstVariant?.availableForSale}
              className="text-xs font-medium uppercase tracking-widest bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors w-28 text-center disabled:opacity-80"
            >
              {isAdding ? "Added ✓" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
