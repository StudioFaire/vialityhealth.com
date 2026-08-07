"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { EASE_EDITORIAL } from "@/lib/motion";
import type { ShopifyProduct } from "@/lib/shopify/types";

type Collection = { id: string; title: string; handle: string };

export function ShopContent({
  products,
  collections,
}: {
  products: (ShopifyProduct & { resolvedDescription: string; mainImageUrl?: string })[];
  collections: Collection[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");

  const categories = [
    "All",
    ...collections.map((c) => c.title),
  ];

  const filteredProducts = products.filter((p) => {
    if (activeCategory === "All") return true;
    return (
      p.productType.toLowerCase() === activeCategory.toLowerCase() ||
      p.tags.some(
        (t) => t.toLowerCase() === activeCategory.toLowerCase()
      )
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
        );
      case "price-high":
        return (
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
        );
      case "newest":
        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Filters and Sorting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
      >
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-colors ${activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-white border border-border/40 text-foreground/70 hover:border-primary/50"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 relative">
          <label className="text-sm text-foreground/60">Sort by:</label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-b border-border/50 py-1 pr-6 focus:outline-none focus:border-primary text-sm font-medium appearance-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/60"
            />
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <ProductCard product={product} description={product.resolvedDescription} mainImageUrl={product.mainImageUrl} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <h3 className="text-xl font-serif text-primary mb-2">
            No products found
          </h3>
          <p className="text-foreground/60">Try adjusting your filters.</p>
          <button
            onClick={() => setActiveCategory("All")}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-full text-sm uppercase tracking-widest"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
}
