"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { getLocaleFromPath, localizeHref } from "@/lib/markets";

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ href, ...props }: LinkProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const resolvedHref = typeof href === "string" ? localizeHref(href, locale) : href;

  return <NextLink href={resolvedHref} {...props} />;
}
