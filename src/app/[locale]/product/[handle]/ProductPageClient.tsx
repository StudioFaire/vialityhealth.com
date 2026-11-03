"use client";

import { useState } from "react";
import { Link } from "@/components/Link";
import Image from "next/image";
import { Minus, Plus, FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { EASE_EDITORIAL } from "@/lib/motion";
import type { ShopifyProduct, ShopifyProductVariant, ShopifyImage } from "@/lib/shopify/types";
import { getProductImages, getProductVariants } from "@/lib/shopify/product";

function ProductGallery({
  images,
  selectedIndex,
  onSelect,
  productTitle,
}: {
  images: ShopifyImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  productTitle: string;
}) {
  const selectedImage = images[selectedIndex] ?? images[0] ?? null;
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;
  const goToImage = (offset: number) => {
    if (!hasMultipleImages) return;
    onSelect((selectedIndex + offset + imageCount) % imageCount);
  };

  return (
    <div className="relative flex h-full min-h-[50vh] flex-col bg-surface-gallery order-1 lg:order-1 lg:min-h-0">
      <div className="relative mb-8 aspect-9/16 w-full overflow-hidden md:aspect-auto md:min-h-0 md:flex-1">
        <AnimatePresence mode="wait">
          {selectedImage && (
            <m.div
              key={selectedImage.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.altText || productTitle}
                fill
                className="w-full rounded-lg object-cover md:object-contain"
                sizes="(max-width: 1440px) 1440px, (max-width: 1024px) 1024px, (max-width: 768px) 768px"
                priority
              />
            </m.div>
          )}
        </AnimatePresence>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={() => goToImage(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/85 text-primary shadow-sm backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => goToImage(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/85 text-primary shadow-sm backdrop-blur transition-colors hover:bg-background"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <span className="absolute bottom-4 right-4 z-10 rounded-full border border-border/60 bg-background/85 px-3 py-1 text-[10px] uppercase tracking-widest text-primary/60 backdrop-blur">
              {selectedIndex + 1} / {imageCount}
            </span>
            <p className="sr-only" aria-live="polite">
              Image {selectedIndex + 1} of {imageCount}
            </p>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <section
          className="relative w-full shrink-0"
          aria-roledescription="carousel"
          aria-label="Product image thumbnails"
        >
          <div className="overflow-hidden">
            <div className="flex -ml-4">
              {images.map((img, idx) => (
                <div
                  key={img.url}
                  role="group"
                  aria-roledescription="slide"
                  className="min-w-0 shrink-0 grow-0 pl-4 basis-1/5"
                >
                  <button
                    type="button"
                    onClick={() => onSelect(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    aria-pressed={idx === selectedIndex}
                    className={`group flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border bg-card hover:border-ring transition-colors ${
                      idx === selectedIndex ? "border-2 border-ring" : "border border-border/40"
                    }`}
                  >
                    <div className="relative size-full object-cover transition duration-300 ease-in-out group-hover:scale-105">
                      <Image
                        src={img.url}
                        alt={img.altText || `${productTitle} ${idx + 1}`}
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
  );
}

function BuyBox({
  product,
  selectedVariant,
  selectedOptions,
  onSelectOption,
  quantity,
  onQuantityChange,
  isAdding,
  onAdd,
  onBuyNow,
  description,
  freeShippingText,
}: {
  product: ShopifyProduct;
  selectedVariant?: ShopifyProductVariant;
  selectedOptions: Record<string, string>;
  onSelectOption: (name: string, value: string) => void;
  quantity: number;
  onQuantityChange: (value: number) => void;
  isAdding: boolean;
  onAdd: () => void;
  onBuyNow: () => void;
  description: string;
  freeShippingText?: string;
}) {
  const priceLabel = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : "";
  const isAvailable = !!selectedVariant?.availableForSale;

  // Shopify adds a single "Default Title" option to products without real
  // variants. It is metadata, not a customer-facing choice.
  const options =
    product.options.length <= 1 && product.options[0]?.values[0] === "Default Title"
      ? []
      : product.options;

  return (
    <>
      <header>
        <p className="text-xs uppercase tracking-widest text-primary/35 mb-3">Viality</p>
        <h1 className="font-serif uppercase font-light text-4xl xl:text-5xl text-primary leading-tight mb-2">
          {product.title}
        </h1>
        {options.flatMap((option) =>
          option.values.length === 1
            ? [
                <p key={option.id} className="text-sm text-primary/50 font-light mb-1">
                  {option.values[0]}
                </p>,
              ]
            : [],
        )}
        <p className="text-xs uppercase tracking-widest text-primary/40 mb-5">
          {product.productType}
        </p>
      </header>

      {options.flatMap((option) =>
        option.values.length > 1
          ? [
              <fieldset key={option.id} className="mb-2">
                <legend className="text-xs uppercase tracking-widest text-primary/35 mb-2">
                  {option.name}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onSelectOption(option.name, value)}
                      aria-pressed={selectedOptions[option.name] === value}
                      className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                        selectedOptions[option.name] === value
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/60 text-primary/70 hover:border-primary/50"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>,
            ]
          : [],
      )}

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-primary/35">Quantity</p>
        <div className="flex gap-3">
          <div className="flex items-center border border-border/60">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-9 text-center text-sm tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              aria-label="Increase quantity"
              className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
          <button
            aria-label="Add to cart"
            type="submit"
            onClick={onAdd}
            disabled={isAdding || !isAvailable}
            className="flex-1 h-12 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 active:scale-[0.99] transition-[background-color,transform] flex items-center justify-center disabled:opacity-50"
          >
            {isAdding ? "Added ✓" : !isAvailable ? "Out of Stock" : `Add to Cart - ${priceLabel}`}
          </button>
        </div>
        <button
          aria-label="Buy Now"
          type="button"
          onClick={onBuyNow}
          disabled={isAdding || !isAvailable}
          className="w-full h-11 border text-xs uppercase tracking-widest transition-colors border-primary/25 text-primary hover:border-primary/50 disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>

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

      {freeShippingText && (
        <p className="text-xs text-primary/30 leading-relaxed">{freeShippingText}</p>
      )}

      <div className="text-sm text-primary/60 font-light leading-[1.8] max-w-sm">
        <div className="container mx-auto prose md:prose-sm">
          <div dangerouslySetInnerHTML={{ __html: description }} />
          <br />
          <p className="italic">
            This product is intended strictly for laboratory and research purposes only. Not
            intended for human consumption.
          </p>
          <p className="italic">Due to hygiene and safety reasons, this item is final sale.</p>
        </div>
      </div>
    </>
  );
}

function VerificationSection() {
  return (
    <section className="bg-ink py-20 md:py-24 px-6 md:px-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative z-10 mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        >
          <p className="text-xs uppercase tracking-widest text-primary-foreground/25 mb-4">
            Verification
          </p>
          <h2 className="font-serif uppercase font-light text-3xl md:text-4xl text-primary-foreground/90 leading-tight max-w-md">
            <span>Verified clarity,</span>
            <span>
              <br />
              batch by batch.
            </span>
          </h2>
          <p className="text-primary-foreground/40 text-sm font-light leading-relaxed mt-4 max-w-sm">
            Certificates of Analysis are available for every production run.
          </p>
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_EDITORIAL }}
          className="flex flex-col sm:flex-row gap-4 shrink-0"
        >
          <Link
            href="/lab-reports"
            className="flex items-center gap-3 px-7 py-4 border border-primary-foreground/20 text-primary-foreground/70 text-xs uppercase tracking-widest hover:border-primary-foreground/40 hover:text-primary-foreground/90 transition-colors"
          >
            <FileText size={14} />
            Lab Reports
          </Link>
          <Link
            href="/lab-reports"
            className="flex items-center gap-3 px-7 py-4 bg-primary-foreground/8 border border-primary-foreground/10 text-primary-foreground/60 text-xs uppercase tracking-widest hover:bg-primary-foreground/12 transition-colors"
          >
            <ExternalLink size={14} />
            View COA
          </Link>
        </m.div>
      </div>
    </section>
  );
}

export function ProductPageClient({
  product,
  description,
  imageUrls = [],
  freeShippingText,
}: {
  product: ShopifyProduct;
  description: string;
  imageUrls?: string[];
  freeShippingText?: string;
}) {
  const { addItem, buyNow } = useCart();
  const variants = getProductVariants(product);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((opt) => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });
  const [selectedImage, setSelectedImage] = useState<{ variantId?: string; index: number }>({
    index: 0,
  });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = variants.find((v) =>
    v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value),
  );

  const variantImageUrls = selectedVariant?.image_urls ?? [];
  const productImageUrls =
    imageUrls.length > 0 ? imageUrls : getProductImages(product).map((image) => image.url);
  const galleryImageUrls = Array.from(new Set([...variantImageUrls, ...productImageUrls]));
  const images = galleryImageUrls.map((url) => ({ url, altText: null, width: 0, height: 0 }));

  const selectedImageIndex =
    selectedImage.variantId === selectedVariant?.id ? selectedImage.index : 0;

  const handleSelectImage = (index: number) => {
    setSelectedImage({ variantId: selectedVariant?.id, index });
  };

  const handleAdd = () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    addItem(selectedVariant.id, quantity);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    buyNow(selectedVariant.id, quantity);
  };

  const handleSelectOption = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background pt-18">
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] min-h-[calc(100vh-72px)]">
        <ProductGallery
          images={images}
          selectedIndex={selectedImageIndex}
          onSelect={handleSelectImage}
          productTitle={product.title}
        />

        <div className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] overflow-y-auto order-1 lg:order-2 border-l border-border/40">
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="p-8 xl:p-12 flex flex-col gap-8 mt-8"
          >
            <BuyBox
              product={product}
              selectedVariant={selectedVariant}
              selectedOptions={selectedOptions}
              onSelectOption={handleSelectOption}
              quantity={quantity}
              onQuantityChange={setQuantity}
              isAdding={isAdding}
              onAdd={handleAdd}
              onBuyNow={handleBuyNow}
              description={description}
              freeShippingText={freeShippingText}
            />
          </m.div>
        </div>
      </section>

      <VerificationSection />
    </div>
  );
}
