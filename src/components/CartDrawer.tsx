"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, lines, cartCount, subtotal, updateQuantity, removeItem, checkout, isLoading } =
    useCart();

  const freeShippingThreshold = 200;
  const subtotalNum = parseFloat(subtotal);
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotalNum);
  const progressPercent = Math.min(100, (subtotalNum / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 flex flex-col border-l border-border/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <h2 className="font-serif text-2xl text-primary">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {cartCount > 0 ? (
              <>
                {/* Free shipping progress */}
                <div className="p-6 pb-0">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-center mb-3 text-foreground/80">
                      {awayFromFreeShipping > 0
                        ? `You're $${awayFromFreeShipping.toFixed(2)} away from free shipping.`
                        : "You've unlocked free shipping!"}
                    </p>
                    <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {lines.map((line) => {
                    const product = line.merchandise.product;
                    const image = product.images.edges[0]?.node;

                    return (
                      <div key={line.id} className="flex gap-4">
                        <div className="w-20 h-32 bg-muted rounded-md overflow-hidden shrink-0 relative">
                          {image && (
                            <Image
                              src={image.url}
                              alt={image.altText || product.title}
                              fill
                              className="object-cover aspect-auto"
                              sizes="80px"
                            />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-primary text-sm">
                                {product.title}
                              </h3>
                            </div>
                            <button
                              onClick={() => removeItem(line.id)}
                              className="text-foreground/40 hover:text-destructive transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center border border-border rounded-full">
                              <button
                                onClick={() =>
                                  updateQuantity(line.id, line.quantity - 1)
                                }
                                className="w-8 h-8 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
                                disabled={isLoading}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(line.id, line.quantity + 1)
                                }
                                className="w-8 h-8 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
                                disabled={isLoading}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-medium text-sm">
                              {formatPrice(
                                line.merchandise.price.amount,
                                line.merchandise.price.currencyCode
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-border/40 p-6 bg-background">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-foreground/80">Subtotal</span>
                    <span className="font-serif text-xl font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/50 mb-6 text-center">
                    Taxes and shipping calculated at checkout.
                  </p>
                  <button
                    onClick={checkout}
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-4 rounded-full font-medium tracking-wide hover:bg-primary/90 transition-colors uppercase text-sm disabled:opacity-80"
                  >
                    {isLoading ? "Loading..." : "Checkout"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6 text-primary">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-serif text-2xl text-primary mb-2">
                  Your cart is empty
                </h3>
                <p className="text-foreground/60 mb-8 max-w-[250px]">
                  Explore our collection of research grade peptides.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-8 py-3 bg-primary text-white rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary/90 transition-colors"
                >
                  Shop Collection
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
