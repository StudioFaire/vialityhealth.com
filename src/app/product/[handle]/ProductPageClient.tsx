"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, FileText, ExternalLink } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { ProductCard } from "@/components/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify/types";
import {
  getProductImages,
  getProductVariants,
  getSellingPlans,
  getSubscriptionPrice,
} from "@/lib/shopify/types";

export function ProductPageClient({ product, description, relatedProducts }: { product: ShopifyProduct; description: string; relatedProducts: (ShopifyProduct & { resolvedDescription: string })[] }) {
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

  const selectedVariant = variants.find((v) =>
    v.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value
    )
  );

  const selectedImage = images[selectedImageIndex] ?? images[0] ?? null;

  const basePrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : 0;

  const handleAdd = () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    addItem(selectedVariant.id, quantity);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-18">
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] min-h-[calc(100vh-72px)]">
        {/* Left: Image Gallery */}
        <div className="relative bg-surface-gallery min-h-[50vh] lg:min-h-0 h-full order-1 lg:order-1">
          <div className="relative size-full overflow-hidden mb-8">
            <div className="w-full">
              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || product.title}
                  fill
                  className="w-full rounded-lg object-contain"
                  sizes="(max-width: 1440px) 1440px, (max-width: 1024px) 1024px, (max-width: 768px) 768px"
                  priority
                />
              )}
            </div>
          </div>

          {/* Thumbnail Carousel */}
          {images.length > 1 && (
            <section className="relative w-full" aria-roledescription="carousel">
              <div className="overflow-hidden">
                <div className="flex -ml-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      role="group"
                      aria-roledescription="slide"
                      className="min-w-0 shrink-0 grow-0 pl-4 basis-1/5"
                    >
                      <button
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-card hover:border-ring transition-all ${idx === selectedImageIndex
                            ? "border-2 border-ring"
                            : "border border-border/40"
                          }`}
                      >
                        <div className="relative h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105">
                          <Image
                            src={img.url}
                            alt={img.altText || `${product.title} ${idx + 1}`}
                            fill
                            className="h-full w-full object-cover"
                            sizes="80px"
                          />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right: Sticky Sidebar */}
        <div className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] overflow-y-auto order-1 lg:order-2 border-l border-border/40">
          <div className="p-8 xl:p-12 flex flex-col gap-8 mt-8">
            {/* Header */}
            <header>
              <p className="text-xs uppercase tracking-widest text-primary/35 mb-3">Viality</p>
              <h1 className="font-serif uppercase font-light text-4xl xl:text-5xl text-primary leading-tight mb-2">
                {product.title}
              </h1>
              {product.options.filter((opt) => opt.values.length === 1).map((option) => (
                <p key={option.id} className="text-sm text-primary/50 font-light mb-1">
                  {option.values[0]}
                </p>
              ))}
              <p className="text-xs uppercase tracking-widest text-primary/40 mb-5">
                {product.productType}
              </p>
            </header>

            {/* Product Options */}
            {product.options.filter((opt) => opt.values.length > 1).map((option) => (
              <div key={option.id} className="mb-2">
                <label className="text-xs uppercase tracking-widest text-primary/35 mb-2 block">
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
                      className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${selectedOptions[option.name] === value
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/60 text-primary/70 hover:border-primary/50"
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-primary/35">Quantity</p>
              <div className="flex gap-3">
                <div className="flex items-center border border-border/60">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-9 text-center text-sm tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <button
                  aria-label="Add to cart"
                  type="submit"
                  onClick={handleAdd}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex-1 h-12 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isAdding
                    ? "Added ✓"
                    : !selectedVariant?.availableForSale
                      ? "Out of Stock"
                      : `Add to Cart — ${basePrice.toFixed(2)}`}
                </button>
              </div>
              <button
                aria-label="Buy Now"
                type="button"
                className="w-full h-11 border text-xs uppercase tracking-widest transition-colors border-primary/25 text-primary hover:border-primary/50"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/45">
                <div className="size-3.5 border border-primary/20 flex items-center justify-center shrink-0">
                  <div className="size-1 bg-accent"></div>
                </div>
                Third-party tested
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/45">
                <div className="size-3.5 border border-primary/20 flex items-center justify-center shrink-0">
                  <div className="size-1 bg-accent"></div>
                </div>
                Premium formulation
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/45">
                <div className="size-3.5 border border-primary/20 flex items-center justify-center shrink-0">
                  <div className="size-1 bg-accent"></div>
                </div>
                Fast shipping
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/45">
                <div className="size-3.5 border border-primary/20 flex items-center justify-center shrink-0">
                  <div className="size-1 bg-accent"></div>
                </div>
                Batch transparency
              </div>
            </div>

            <p className="text-xs text-primary/30 leading-relaxed">
              Free shipping on orders over $200.
            </p>

            {/* Description */}
            <div className="text-sm text-primary/60 font-light leading-[1.8] max-w-sm">
              <div className="container mx-auto prose md:prose-md">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-surface-warm py-24 md:py-32 px-6 md:px-16">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center justify-center">
          <div className="w-fit">
            <p className="text-xs uppercase tracking-widest text-primary/35 mb-6">Why {product.title}</p>
            <h2 className="font-serif uppercase font-light text-4xl md:text-5xl text-primary leading-tight">
              A quieter standard of vitality.
            </h2>
          </div>
          <div className="space-y-8">
            <div className="border-l-2 border-accent/50 pl-5">
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-1.5">Designed for consistency</h3>
              <p className="text-sm text-primary/55 font-light leading-[1.8]">
                Where science meets ritual. Built to be taken daily, over time — not as an experiment, but as a permanent part of how you care for yourself.
              </p>
            </div>
            <div className="border-l-2 border-accent/50 pl-5">
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-1.5">Modern rituals for internal balance</h3>
              <p className="text-sm text-primary/55 font-light leading-[1.8]">
                No complicated protocol. Designed to integrate into your morning with the same quiet ease as any other considered habit.
              </p>
            </div>
            <div className="border-l-2 border-accent/50 pl-5">
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-1.5">Calm, sustained clarity</h3>
              <p className="text-sm text-primary/55 font-light leading-[1.8]">
                Selected to support mental steadiness without stimulants — the kind of clarity that comes from giving your body what it actually needs.
              </p>
            </div>
            <div className="border-l-2 border-accent/50 pl-5">
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-1.5">A quieter standard</h3>
              <p className="text-sm text-primary/55 font-light leading-[1.8]">
                No aggressive claims. No overcrowded formula. Every ingredient earns its place through evidence, and its dose is disclosed without exception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Ritual Section */}
      <section className="bg-background py-20 md:py-28 px-6 md:px-16 border-t border-border/30">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 md:gap-20 items-start">
          <p className="text-xs uppercase tracking-widest text-primary/35 md:pt-1">Usage Ritual</p>
          <div>
            <h2 className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-6">
              Unhurried. Intentional. Daily.
            </h2>
            <p className="text-primary/60 text-sm font-light leading-[1.9] max-w-lg mb-4">
              Two capsules each morning with water, ideally alongside a meal. The ritual is simple by design — consistency is where the value accumulates. We recommend a minimum 30-day commitment before forming any assessment.
            </p>
            <p className="text-xs text-primary/40 font-light italic">
              Take as directed on packaging. Consult a qualified healthcare professional before beginning any new supplement routine, particularly if pregnant, nursing, or under medical supervision.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="bg-ink py-20 md:py-24 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px", mixBlendMode: "screen" }} />
        <div className="relative z-10 mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/25 mb-4">Verification</p>
            <h2 className="font-serif uppercase font-light text-3xl md:text-4xl text-primary-foreground/90 leading-tight max-w-md">
              <span>Verified clarity,</span>
              <span><br />batch by batch.</span>
            </h2>
            <p className="text-primary-foreground/40 text-sm font-light leading-relaxed mt-4 max-w-sm">
              Certificates of Analysis are available for every production run. We don't ask you to take our word for it — the data is there, and it belongs to you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/lab-reports"
              className="flex items-center gap-3 px-7 py-4 border border-primary-foreground/20 text-primary-foreground/70 text-xs uppercase tracking-widest hover:border-primary-foreground/40 hover:text-primary-foreground/90 transition-all"
            >
              <FileText size={14} />
              Lab Reports
            </Link>
            <Link
              href="/lab-reports"
              className="flex items-center gap-3 px-7 py-4 bg-primary-foreground/8 border border-primary-foreground/10 text-primary-foreground/60 text-xs uppercase tracking-widest hover:bg-primary-foreground/12 transition-all"
            >
              <ExternalLink size={14} />
              View COA
            </Link>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-20 border-t border-border/40">
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
              <ProductCard key={rp.id} product={rp} description={rp.resolvedDescription} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
