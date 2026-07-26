import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Viality — where science meets performance",
    template: "%s | Viality",
  },
  description:
    "Viality exists to support research by providing high quality materials and maintaining rigorous standards of consistency and transparency.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://vialityhealth.com"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
