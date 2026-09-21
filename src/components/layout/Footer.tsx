"use client";

import type { ShopifyMenu } from "@/lib/shopify/types";
import Image from "next/image";
import { Link } from "@/components/Link";
import { SocialMenu } from "@/components/SocialMenu";
import { MarketSwitcher } from "./MarketSwitcher";
import { isMarketSwitcherEnabled } from "@/lib/markets";

// type MenuItem = { title: string; url: string };

const menuItems = (menu: ShopifyMenu | null) =>
  menu?.items.map(({ title, url }) => ({ title, url })) ?? [];

const EMPTY_URLS: string[] = [];

const displaymenu = (menu: ShopifyMenu | null) => {
  const items = menuItems(menu);

  return (
    <section className="lg:col-span-2">
      {menu?.title && (
        <h4 className="font-medium text-sm tracking-widest uppercase mb-6 opacity-70">
          {menu.title}
        </h4>
      )}
      {items.length > 0 && (
        <ul className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-sm">
          {items.map((item) => (
            <li key={item.url}>
              <Link href={item.url} className="hover:opacity-70 transition-opacity">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export function Footer({
  followUsUrls = EMPTY_URLS,
  shopMenu,
  companyMenu,
  legalMenu,
  supportMenu,
}: {
  followUsUrls?: string[];
  shopMenu: ShopifyMenu | null;
  companyMenu: ShopifyMenu | null;
  legalMenu: ShopifyMenu | null;
  supportMenu: ShopifyMenu | null;
}) {
  const legalItems = menuItems(legalMenu);

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-full lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 grid justify-center lg:justify-start">
            <Link className="relative block h-8 md:h-10 lg:h-12 aspect-15/4" href="/">
              <Image
                className="invert object-contain"
                src="/images/logotype.svg"
                alt="Viality logo"
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </Link>

            <br />

            {followUsUrls.length > 0 && (
              <SocialMenu
                className="flex items-center justify-start space-x-4"
                iconClassName="size-6!"
                urls={followUsUrls}
              />
            )}
          </div>

          {displaymenu(shopMenu)}
          {displaymenu(companyMenu)}
          {displaymenu(legalMenu)}
          {displaymenu(supportMenu)}
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <span>&copy; {new Date().getFullYear()} Viality. All rights reserved.</span>
          {isMarketSwitcherEnabled() && <MarketSwitcher tone="dark" />}
          {legalItems.length > 0 && (
            <ul className="flex flew-row gap-4 text-sm">
              {legalItems.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="hover:opacity-70 transition-opacity">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="max-w-7xl mx-auto mt-12 text-xs text-primary-foreground/30 text-center tracking-widest leading-relaxed">
          <p>
            These statements have not been evaluated by the Therapeutic Goods Administration. These
            products are intended strictly for research and laboratory use and are not for human
            consumption. By completing your purchase, you confirm that you are at least 18 years of
            age, that this material will be handled responsibly, and that it will be used solely for
            lawful research or analytical purposes in accordance with all applicable regulations.
          </p>
        </div>
      </div>
    </footer>
  );
}
