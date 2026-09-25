"use client";

import type { ShopifyMenu } from "@/lib/shopify/types";
import { Link } from "@/components/Link";

export type MenuItem = { title: string; url: string };

export const menuItems = (menu: ShopifyMenu | null): MenuItem[] =>
  menu?.items.map(({ title, url }) => ({ title, url })) ?? [];

type DisplayMenuOptions = {
  listClassName?: string;
  linkClassName?: string;
};

export function displaymenu(menu: ShopifyMenu | null, options: DisplayMenuOptions = {}) {
  const items = menuItems(menu);
  if (items.length === 0) return null;

  return (
    <ul className={options.listClassName}>
      {items.map((item) => (
        <li key={item.url}>
          <Link href={item.url} className={options.linkClassName}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
