"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  createCart as createShopifyCart,
  addToCart as addShopifyToCart,
  updateCartLines as updateShopifyCartLines,
  removeFromCart as removeShopifyFromCart,
  getCart,
} from "@/lib/shopify";
import type { ShopifyCart, ShopifyCartLine } from "@/lib/shopify/types";

type CartContextType = {
  cart: ShopifyCart | null;
  lines: ShopifyCartLine[];
  cartCount: number;
  subtotal: string;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (variantId: string, quantity?: number, sellingPlanId?: string) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  checkout: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = "viality-cart-id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart on mount
  useEffect(() => {
    const storedCartId = localStorage.getItem(CART_ID_KEY);
    if (storedCartId) {
      getCart(storedCartId).then((existingCart) => {
        if (existingCart) {
          setCart(existingCart);
        } else {
          localStorage.removeItem(CART_ID_KEY);
        }
      });
    }
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1, sellingPlanId?: string) => {
      setIsLoading(true);
      try {
        if (cart) {
          const updated = await addShopifyToCart(cart.id, variantId, quantity, sellingPlanId);
          setCart(updated);
        } else {
          const newCart = await createShopifyCart(variantId, quantity);
          setCart(newCart);
          localStorage.setItem(CART_ID_KEY, newCart.id);
        }
        setIsCartOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, setIsCartOpen]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await removeShopifyFromCart(cart.id, [lineId]);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await updateShopifyCartLines(cart.id, lineId, quantity);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart]);

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const cartCount = cart?.totalQuantity ?? 0;
  const subtotal = cart?.cost.subtotalAmount.amount ?? "0.00";

  return (
    <CartContext.Provider
      value={{
        cart,
        lines,
        cartCount,
        subtotal,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
