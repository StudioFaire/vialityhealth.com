"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRaf = useRef<number | null>(null);

  const onHero = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRaf.current !== null) return;
      scrollRaf.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 60);
        scrollRaf.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRaf.current !== null) cancelAnimationFrame(scrollRaf.current);
    };
  }, []);

  const transparent = onHero && !isScrolled;

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 right-0 z-40 transition-all duration-500",
        transparent ? "bg-transparent" : "bg-background/95 backdrop-blur-md"
      )}
    >
      <div className="h-18 container mx-auto px-8 sm:px-0 flex items-center justify-between gap-6">
        {/* Mobile menu trigger */}
        <div className="block flex-none md:hidden">
          <MobileMenu links={links} />
        </div>

        {/* Logo — left */}
        <Link
          href="/"
          className={cn(
            "hover:opacity-60 logo max-w-2/6 md:max-w-1/6 relative shrink-0 text-3xl text-foreground transition-opacity w-full",
            transparent ? "text-foreground" : "text-foreground"
          )}
        >
          viality
        </Link>

        {/* Center nav links — desktop only */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs uppercase tracking-widest transition-opacity hover:opacity-60",
                transparent ? "text-foreground" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right — account + cart */}
        <div className="flex items-center gap-4 shrink-0 [&_svg]:size-6">
          <Link
            href="/account"
            className="transition-opacity hover:opacity-60"
            aria-label="Account"
          >
            <User size={19} strokeWidth={1.4} />
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="transition-opacity hover:opacity-60 relative"
            aria-label="Open cart"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3.5 h-3.5 text-[8px] font-bold text-primary-foreground bg-primary rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
