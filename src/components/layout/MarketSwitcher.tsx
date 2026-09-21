"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { m, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { MARKET_LIST, DEFAULT_LOCALE, getLocaleFromPath, type Locale } from "@/lib/markets";
import { FlagIcon } from "@/components/FlagIcon";
import { cn } from "@/lib/utils";

function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(au|uk)(?=\/|$)/, "") || "/";
}

type MarketSwitcherProps = {
  variant?: "full" | "icon";
  tone?: "light" | "dark";
};

export function MarketSwitcher({ variant = "full", tone = "light" }: MarketSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLocale = getLocaleFromPath(pathname) ?? DEFAULT_LOCALE;
  const currentMarket =
    MARKET_LIST.find((market) => market.locale === currentLocale) ?? MARKET_LIST[0];
  const rest = stripLocale(pathname);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const select = (locale: Locale) => {
    setOpen(false);
    if (locale === currentLocale) return;
    router.push(`/${locale}${rest}`);
  };

  const flagClass = "h-4 w-6 rounded-[3px] ring-1 ring-black/10";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={variant === "icon" ? `Region: ${currentMarket.label}` : undefined}
        className={cn(
          "flex items-center gap-2 transition-opacity hover:opacity-70 cursor-pointer",
          variant === "full" &&
            (tone === "light" ? "text-foreground/70" : "text-primary-foreground/70"),
        )}
      >
        <FlagIcon
          countryCode={currentMarket.countryCode}
          className={flagClass}
          title={variant === "icon" ? currentMarket.label : undefined}
        />
        {variant === "full" && (
          <>
            <span className="text-xs uppercase tracking-widest">{currentMarket.label}</span>
            <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <m.ul
            role="menu"
            initial={{ opacity: 0, y: tone === "light" ? -6 : 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: tone === "light" ? -6 : 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 min-w-40 overflow-hidden rounded-xl border p-1 shadow-xl",
              tone === "light"
                ? "bg-background border-border/60"
                : "bg-primary border-primary-foreground/15",
              tone === "light" ? "top-full right-0 mt-2" : "bottom-full left-0 mb-2",
            )}
          >
            {MARKET_LIST.map((market) => {
              const isCurrent = market.locale === currentLocale;
              return (
                <li key={market.locale} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => select(market.locale)}
                    aria-current={isCurrent ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs uppercase tracking-widest transition-colors cursor-pointer",
                      tone === "light"
                        ? "text-foreground/80 hover:bg-muted"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10",
                      isCurrent && "opacity-60",
                    )}
                  >
                    <FlagIcon countryCode={market.countryCode} className={flagClass} />
                    {market.label}
                  </button>
                </li>
              );
            })}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
