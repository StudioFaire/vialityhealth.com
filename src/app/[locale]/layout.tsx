import { MARKET_LIST } from "@/lib/markets";

export function generateStaticParams() {
  return MARKET_LIST.map((market) => ({ locale: market.locale }));
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
