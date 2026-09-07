"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { EASE_EDITORIAL } from "@/lib/motion";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ProductFilters, type Facet } from "./ProductFilters";

type ShopProduct = ShopifyProduct & {
  resolvedDescription: string;
  mainImageUrl?: string;
};

type SelectedFilters = Record<string, string[]>;

type PriceBucket = { id: string; label: string; min: number | null; max: number | null };

const PRICE_BUCKETS: PriceBucket[] = [
  { id: "under-60", label: "Under $60", min: null, max: 60 },
  { id: "60-100", label: "$60 – $100", min: 60, max: 100 },
  { id: "100-150", label: "$100 – $150", min: 100, max: 150 },
  { id: "150-plus", label: "$150+", min: 150, max: null },
];

function getSizes(product: ShopifyProduct): string[] {
  return product.options.find((o) => o.name.toLowerCase() === "size")?.values ?? [];
}

function getFacetValues(product: ShopProduct, facetId: string): string[] {
  if (facetId === "size") return getSizes(product);
  if (facetId === "tags") return product.tags;
  if (facetId === "type") return product.productType ? [product.productType] : [];
  return [];
}

function priceOverlaps(product: ShopifyProduct, bucket: PriceBucket): boolean {
  const lo = parseFloat(product.priceRange.minVariantPrice.amount);
  const hi = parseFloat(product.priceRange.maxVariantPrice.amount);
  const bMin = bucket.min ?? -Infinity;
  const bMax = bucket.max ?? Infinity;
  return lo < bMax && hi > bMin;
}

function matchesQuery(product: ShopProduct, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [product.title, product.handle, product.productType, product.description, product.resolvedDescription]
    .some((field) => field?.toLowerCase().includes(q));
}

function facetValueMatches(product: ShopProduct, facetId: string, value: string): boolean {
  if (facetId === "price") {
    const bucket = PRICE_BUCKETS.find((b) => b.id === value);
    return bucket ? priceOverlaps(product, bucket) : false;
  }
  return getFacetValues(product, facetId).includes(value);
}

function matchesProduct(
  product: ShopProduct,
  selected: SelectedFilters,
  query: string
): boolean {
  if (!matchesQuery(product, query)) return false;
  for (const [facetId, values] of Object.entries(selected)) {
    if (values.length === 0) continue;
    if (!values.some((v) => facetValueMatches(product, facetId, v))) return false;
  }
  return true;
}

const SOURCE_FACETS: { id: string; label: string; sort: (a: string, b: string) => number }[] = [
  { id: "type", label: "Type", sort: (a, b) => a.localeCompare(b) },
  { id: "tags", label: "Tags", sort: (a, b) => a.localeCompare(b) },
  { id: "size", label: "Size", sort: (a, b) => parseFloat(a) - parseFloat(b) },
];

function buildFacets(
  products: ShopProduct[],
  selected: SelectedFilters,
  query: string
): Facet[] {
  const countFor = (facetId: string, value: string): number => {
    const withoutThisFacet = { ...selected, [facetId]: [] };
    return products.filter(
      (p) =>
        matchesProduct(p, withoutThisFacet, query) &&
        facetValueMatches(p, facetId, value)
    ).length;
  };

  const facets: Facet[] = [];

  for (const { id, label, sort } of SOURCE_FACETS) {
    const valueSet = new Set<string>();
    for (const p of products) for (const v of getFacetValues(p, id)) valueSet.add(v);
    const values = [...valueSet].sort(sort);
    if (values.length === 0) continue;
    facets.push({
      id,
      label,
      values: values.map((v) => {
        const count = countFor(id, v);
        return { value: v, label: v, count, disabled: count === 0 };
      }),
    });
  }

  facets.push({
    id: "price",
    label: "Price",
    values: PRICE_BUCKETS.map((b) => {
      const count = countFor("price", b.id);
      return { value: b.id, label: b.label, count, disabled: count === 0 };
    }),
  });
  return facets;
}

export function ShopContent({
  products,
}: {
  products: ShopProduct[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<SelectedFilters>({});
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const facets = useMemo(
    () => buildFacets(products, selected, searchQuery),
    [products, selected, searchQuery]
  );

  const filteredProducts = useMemo(
    () => products.filter((p) => matchesProduct(p, selected, searchQuery)),
    [products, selected, searchQuery]
  );

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
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
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const activeCount = useMemo(() => {
    let count = Object.values(selected).reduce((n, v) => n + v.length, 0);
    if (searchQuery.trim()) count += 1;
    return count;
  }, [selected, searchQuery]);

  const toggleFilter = (facetId: string, value: string) => {
    setSelected((prev) => {
      const current = prev[facetId] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [facetId]: next };
    });
  };

  const clearAll = () => {
    setSelected({});
    setSearchQuery("");
  };

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...(searchQuery.trim()
      ? [
        {
          key: "query",
          label: `"${searchQuery.trim()}"`,
          onRemove: () => setSearchQuery(""),
        },
      ]
      : []),
    ...Object.entries(selected).flatMap(([facetId, values]) =>
      values.map((value) => {
        const facet = facets.find((f) => f.id === facetId);
        const label = facet?.values.find((v) => v.value === value)?.label ?? value;
        return {
          key: `${facetId}:${value}`,
          label: facetId === "price" ? label : `${label}`,
          onRemove: () => toggleFilter(facetId, value),
        };
      })
    ),
  ];

  return (
    <>
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <p className="text-sm text-foreground/60">
          Showing {sortedProducts.length} of {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-5 py-2 rounded-full border border-border/40 bg-white text-sm font-medium text-foreground/80 hover:border-primary/50 transition-colors relative"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeCount > 0 && (
              <span className="bg-primary text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-semibold">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="sort-by" className="text-sm text-foreground/60">Sort by:</label>
            <div className="relative">
              <select
                id="sort-by"
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
        </div>
      </motion.div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/40 rounded-full text-xs font-medium text-foreground/80 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button
            onClick={clearAll}
            className="text-xs uppercase tracking-widest text-primary underline underline-offset-4 hover:text-primary/60 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <ProductFilters
              facets={facets}
              selected={selected}
              onToggle={toggleFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearAll={clearAll}
              activeCount={activeCount}
            />
          </div>
        </aside>

        {/* Product grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-8">
            {sortedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <ProductCard
                  product={product}
                  description={product.resolvedDescription}
                  mainImageUrl={product.mainImageUrl}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-serif text-primary mb-2">
              No products found
            </h3>
            <p className="text-foreground/60">
              Try adjusting your filters or search.
            </p>
            <button
              onClick={clearAll}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-full text-sm uppercase tracking-widest"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Close filters"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 cursor-default"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-background shadow-2xl z-50 flex flex-col border-l border-border/20"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/40">
                <h2 className="font-serif text-2xl text-primary">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <ProductFilters
                  facets={facets}
                  selected={selected}
                  onToggle={toggleFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClearAll={clearAll}
                  activeCount={activeCount}
                />
              </div>

              <div className="p-6 border-t border-border/40 flex items-center gap-3">
                <button
                  onClick={clearAll}
                  disabled={activeCount === 0}
                  className="flex-1 px-6 py-3 rounded-full border border-border/50 text-sm font-medium uppercase tracking-widest text-foreground/70 hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-40"
                >
                  Clear
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-full text-sm font-medium uppercase tracking-widest"
                >
                  View {sortedProducts.length}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
