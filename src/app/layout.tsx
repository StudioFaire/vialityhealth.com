import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { getMenu } from "@/lib/shopify";

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
    default: "viality — Wellness, refined.",
    template: "%s | Viality",
  },
  description:
    "viality — modern rituals for internal balance. Premium clinical wellness, formulated with precision and held to a quieter standard.",
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
  return (
    <html lang="en" className={[iosevkaCharon.variable, inter.variable].filter(Boolean).join(" ")}>
      <body className="group/body min-h-screen flex flex-col">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer followUsUrls={followUsUrls} />
        </CartProvider>
      </body>
    </html>
  );
}
