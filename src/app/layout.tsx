import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "@/app/styles/cookieconsent.css";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { AgeVerification } from "@/components/AgeVerification";
// import { VipPassDialog } from "@/components/VipPassDialog";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CookieConsentManager } from "@/components/CookieConsent";
import { getMenu } from "@/lib/shopify";
import type { ShopifyMenu } from "@/lib/shopify/types";
import { getFreeShippingConfig } from "@/lib/shopify/discount";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const iosevkaCharon = localFont({
  src: [
    {
      path: '../fonts/IosevkaCharon-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/IosevkaCharon-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/IosevkaCharon-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/IosevkaCharon-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/IosevkaCharon-Italic.ttf', // If you use italics
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: {
    default: "viality - Wellness, refined.",
    template: "%s | Viality",
  },
  description:
    "viality - modern rituals for internal balance. Premium clinical wellness, formulated with precision and held to a quieter standard.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://vialityhealth.com"
  ),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const followUsMenu = await getMenu("follow-us-viality");
  const followUsUrls =
    followUsMenu?.items.map((item) => item.url).filter(Boolean) ?? [];
  const shopMenu = await getMenu("shop-viality");
  const companyMenu = await getMenu("company-viality");
  const legalMenu = await getMenu("legal-viality");
  const supportMenu = await getMenu("support-viality");
  const freeShipping = await getFreeShippingConfig();
  const freeShippingThreshold = freeShipping?.threshold ?? undefined;;
  return (
    <html lang="en" className={[iosevkaCharon.variable, inter.variable].filter(Boolean).join(" ")}>
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} />
        )}
      </head>
      <body className="group/body min-h-screen flex flex-col">
        <Script id="consent-mode" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',personalization_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`}
        </Script>
        <CookieConsentManager />
        <CartProvider>
          {freeShipping?.text ? <AnnouncementBar text={freeShipping.text} /> : null}
          <Navbar />
          <CartDrawer freeShippingThreshold={freeShippingThreshold} />
          <AgeVerification />
          {/* <VipPassDialog /> */}
          <main className="flex-1">{children}</main>
          <Footer
            followUsUrls={followUsUrls}
            shopMenu={shopMenu}
            companyMenu={companyMenu}
            legalMenu={legalMenu}
            supportMenu={supportMenu}
          />
        </CartProvider>
      </body>
    </html>
  );
}
