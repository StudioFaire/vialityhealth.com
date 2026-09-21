export type Locale = "au" | "uk";

export type Market = {
  locale: Locale;
  countryCode: string;
  label: string;
  currency: string;
};

const MARKETS: Record<Locale, Market> = {
  au: { locale: "au", countryCode: "AU", label: "Australia", currency: "AUD" },
  uk: { locale: "uk", countryCode: "GB", label: "United Kingdom", currency: "GBP" },
};

export const MARKET_LIST = Object.values(MARKETS);
export const DEFAULT_LOCALE: Locale = "au";
export const DEFAULT_COUNTRY = MARKETS[DEFAULT_LOCALE].countryCode;

export function isLocale(value: string | undefined): value is Locale {
  return value === "au" || value === "uk";
}

function getMarket(locale: string | undefined): Market {
  return isLocale(locale) ? MARKETS[locale] : MARKETS[DEFAULT_LOCALE];
}

export function countryForLocale(locale: string | undefined): string {
  return getMarket(locale).countryCode;
}

export function currencyForLocale(locale: string | undefined): string {
  return getMarket(locale).currency;
}

export function getLocaleFromPath(pathname: string): Locale | undefined {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : undefined;
}

export function isMarketSwitcherEnabled(): boolean {
  const value = process.env.NEXT_PUBLIC_MARKET_SWITCHER;
  return value !== "false" && value !== "0";
}

export function localizeHref(href: string, locale?: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const loc = isLocale(locale) ? locale : DEFAULT_LOCALE;
  if (href === "/") return `/${loc}`;
  return `/${loc}${href}`;
}
