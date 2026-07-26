"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-foreground"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <Link
            href="/"
            className="font-serif text-3xl font-bold tracking-tight text-primary"
          >
            Viality
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-widest uppercase transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary font-medium"
                  : "text-foreground/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="hidden md:flex text-foreground/80 hover:text-primary transition-colors">
            <Search size={20} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-foreground/80 hover:text-primary transition-colors p-2 -mr-2"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-2xl font-bold tracking-tight text-primary"
              >
                Viality
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-foreground"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col p-6 space-y-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-2xl font-serif",
                    pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 mt-6 border-t border-border/40">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-4 text-sm font-medium tracking-wide text-white bg-primary rounded-full uppercase"
                >
                  Shop Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
