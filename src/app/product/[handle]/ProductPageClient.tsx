"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShieldCheck, Truck, RotateCcw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import { ProductCard } from "@/components/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify/types";
import {
  getProductImages,
  getProductVariants,
  getSellingPlans,
  getSubscriptionPrice,
} from "@/lib/shopify/types";
import { getAllProducts } from "@/lib/shopify";
import { useEffect } from "react";

export function ProductPageClient({ product, description }: { product: ShopifyProduct; description: string }) {
  const { addItem } = useCart();
  const images = getProductImages(product);
  const variants = getProductVariants(product);
  const sellingPlans = getSellingPlans(product);
  const activeSellingPlan = sellingPlans.length > 0 ? sellingPlans[0] : null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscribe">(
    "one-time"
  );
  const [openAccordion, setOpenAccordion] = useState<string>("description");
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    getAllProducts(6).then((all) => {
      setRelatedProducts(
        all.filter((p) => p.handle !== product.handle).slice(0, 3)
      );
    });
  }, [product.handle]);

  // Find the matching variant based on selected options
  const selectedVariant = variants.find((v) =>
    v.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value
    )
  );

  const selectedImage =
    images[selectedImageIndex] ?? images[0] ?? null;
  const hasComparePrice =
    selectedVariant?.compareAtPrice &&
    parseFloat(selectedVariant.compareAtPrice.amount) > 0;

  const basePrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : 0;

  const displayPrice =
    purchaseType === "subscribe" && selectedVariant && activeSellingPlan
      ? getSubscriptionPrice(basePrice, activeSellingPlan)
      : basePrice;

  const handleAdd = () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    const sellingPlanId =
      purchaseType === "subscribe" && activeSellingPlan
        ? activeSellingPlan.id
        : undefined;
    addItem(selectedVariant.id, quantity, sellingPlanId);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? "" : id);
  };

  const productType = product.productType;

  const accordions = [
    { id: "description", title: "Product Description", content: description },
    { id: "ingredients", title: "Ingredients", content: "Each compound is selected through careful evaluation of peer-reviewed evidence. No fillers, no colorants, no compromises. Every ingredient and its exact dose is declared." },
    { id: "use", title: "Suggested Use", content: "Take as directed on packaging. Consult a qualified healthcare professional before beginning any new research protocol." },
    { id: "quality", title: "Quality & Testing", content: "Every batch is third-party verified by an ISO-accredited laboratory for identity, potency, and purity. Each product carries a batch number tied directly to its Certificate of Analysis." },
    { id: "shipping", title: "Shipping & Returns", content: "Free standard shipping on all orders over $200. 30-day money-back guarantee if you are not completely satisfied." },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center text-xs tracking-widest uppercase text-foreground/50">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span className="mx-2">›</span>
          <span className="text-primary font-medium">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-24">
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2">
            <div className="relative aspect-4/5 md:aspect-square bg-muted rounded-2xl overflow-hidden shadow-sm group">
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur text-primary text-[10px] uppercase tracking-widest font-semibold rounded-full shadow-sm">
                {productType}
              </div>
              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || product.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur text-primary text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center shadow-sm">
                Hover to zoom
              </div>
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${idx === selectedImageIndex
                      ? "border-primary"
                      : "border-border/40 hover:border-primary/50"
                      }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="text-sm font-medium tracking-widest uppercase text-secondary mb-3">
              {productType}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-2xl font-medium text-primary">
                ${displayPrice.toFixed(2)}
              </span>
              {hasComparePrice && purchaseType === "one-time" && selectedVariant && (
                <span className="text-lg text-foreground/50 line-through mb-0.5">
                  ${parseFloat(selectedVariant.compareAtPrice!.amount).toFixed(2)}
                </span>
              )}
              {purchaseType === "subscribe" && activeSellingPlan && (
                <span className="text-sm text-accent font-medium mb-1 ml-2">
                  (Save {Math.round((1 - getSubscriptionPrice(1, activeSellingPlan)) * 100)}%)
                </span>
              )}
            </div>

            <div className="w-full h-px bg-border/40 mb-8" />

            {/* Product Options */}
            {product.options.map((option) => (
              <div key={option.id} className="mb-6">
                <label className="text-sm font-medium text-primary mb-3 block">
                  {option.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [option.name]: value,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedOptions[option.name] === value
                        ? "bg-primary text-white"
                        : "bg-white border border-border/60 text-foreground/70 hover:border-primary/50"
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Purchase Type */}
            <div className="space-y-3 mb-8">
              <label
                onClick={() => setPurchaseType("one-time")}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${purchaseType === "one-time"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border/60 bg-white hover:border-primary/40"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${purchaseType === "one-time"
                      ? "border-primary"
                      : "border-border"
                      }`}
                  >
                    {purchaseType === "one-time" && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-sm">
                    One-time purchase
                  </span>
                </div>
                <span className="font-medium text-sm">
                  {selectedVariant
                    ? `$${parseFloat(selectedVariant.price.amount).toFixed(2)}`
                    : "—"}
                </span>
              </label>

              <label
                onClick={() => {
                  if (activeSellingPlan) {
                    setPurchaseType("subscribe");
                  }
                }}
                className={`flex items-center justify-between p-4 border rounded-xl transition-all ${!activeSellingPlan
                  ? "border-border/30 bg-white/50 opacity-50 cursor-not-allowed"
                  : purchaseType === "subscribe"
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 cursor-pointer"
                    : "border-border/60 bg-white hover:border-primary/40 cursor-pointer"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${purchaseType === "subscribe"
                      ? "border-primary"
                      : "border-border"
                      }`}
                  >
                    {purchaseType === "subscribe" && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-sm block">
                      {activeSellingPlan
                        ? activeSellingPlan.name
                        : "Subscriptions not available"}
                    </span>
                    {activeSellingPlan && (
                      <span className="text-xs text-foreground/60">
                        Recurring delivery
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-medium text-sm">
                  {selectedVariant && activeSellingPlan
                    ? `$${getSubscriptionPrice(parseFloat(selectedVariant.price.amount), activeSellingPlan).toFixed(2)}`
                    : "—"}
                </span>
              </label>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center justify-between border border-border/80 bg-white rounded-full px-4 py-2 w-32 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-foreground/60 hover:text-primary p-1 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-foreground/60 hover:text-primary p-1 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isAdding || !selectedVariant?.availableForSale}
                className="flex-1 bg-primary text-white rounded-full font-medium tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors disabled:opacity-80 flex items-center justify-center"
              >
                {isAdding
                  ? "Added to Cart ✓"
                  : !selectedVariant?.availableForSale
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-10 pb-10 border-b border-border/40">
              <div className="flex flex-col items-center text-center">
                <Truck size={20} className="text-secondary mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-foreground/70">
                  Free Shipping &gt;$200
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw size={20} className="text-secondary mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-foreground/70">
                  30-Day Returns
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={20} className="text-secondary mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-foreground/70">
                  Third-Party Tested
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-4 mb-8">
              {accordions.map((accordion) => (
                <div
                  key={accordion.id}
                  className="border-b border-border/40 pb-4"
                >
                  <button
                    onClick={() => toggleAccordion(accordion.id)}
                    className="w-full flex items-center justify-between py-2 text-left group"
                  >
                    <span className="font-serif text-lg text-primary">
                      {accordion.title}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-foreground/50 transition-transform duration-300 ${openAccordion === accordion.id
                        ? "rotate-180 text-primary"
                        : "group-hover:text-primary"
                        }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === accordion.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="py-4 text-foreground/70 text-sm leading-relaxed">
                          {accordion.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <p className="text-xs text-foreground/50 italic leading-relaxed">
              This product is intended strictly for laboratory and research purposes only. Not intended for human consumption.
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-20 border-t border-border/40">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-primary mb-4">
                Complete your collection
              </h2>
              <p className="text-foreground/60">
                Pair with these carefully selected research compounds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
