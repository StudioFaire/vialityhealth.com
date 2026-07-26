import Link from "next/link";
import { FlaskConical, ShieldCheck, FileCheck, Beaker } from "lucide-react";
import { getAllProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify/types";

export default async function HomePage() {
  let products: ShopifyProduct[] = [];
  try {
    products = await getAllProducts(4);
  } catch {
    // Shopify not configured yet
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-150 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          {/* Mobile / Tablet: double-helix only */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover lg:hidden"
          >
            <source src="/videos/double-helix.mp4" type="video/mp4" />
          </video>
          {/* Desktop: two videos side-by-side */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-1/2 h-full object-cover hidden lg:block"
          >
            <source src="/videos/double-helix.mp4" type="video/mp4" />
          </video>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 right-0 w-1/2 h-full object-cover hidden lg:block"
          >
            <source src="/videos/man-running.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 px-4 py-1 border border-white/30 rounded-full text-white/90 text-xs tracking-widest uppercase backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            99% Purity. Research Grade Peptides.
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            where science
            <br />
            meets performance
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            High quality peptides manufactured under rigorous standards.
            Every detail disclosed, every claim supported by evidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-primary hover:bg-white/90 rounded-full font-medium tracking-wide uppercase text-sm transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-transparent border border-white text-white hover:bg-white/10 rounded-full font-medium tracking-wide uppercase text-sm transition-colors"
            >
              Our Philosophy
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white to-white/0 mx-auto" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-muted py-12 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FlaskConical, title: "Evidence-Led" },
              { icon: ShieldCheck, title: "Third-Party Verified" },
              { icon: FileCheck, title: "Batch Transparency" },
              { icon: Beaker, title: "GMP Manufactured" },
            ].map((benefit, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-secondary">
                  <benefit.icon size={20} />
                </div>
                <h3 className="text-sm font-medium tracking-wide text-primary">
                  {benefit.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-primary mb-4">
              The Collection
            </h2>
            <div className="w-16 h-px bg-accent mx-auto" />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60">
                Products coming soon. Connect your Shopify store to see them
                here.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors uppercase tracking-widest text-sm"
            >
              Shop All
              <span className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
            A modern standard of vitality.
          </h2>
          <p className="text-primary-foreground/70 mt-6 text-lg max-w-2xl mx-auto">
            Every detail disclosed, every claim supported by evidence.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-primary mb-4">
              Three principles. No exceptions.
            </h2>
            <div className="w-16 h-px bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "Precision",
                desc: "Every compound is selected through careful evaluation of peer-reviewed evidence. We work with formulation experts who understand that getting the dose, the form, and the bioavailability right is the difference between a supplement and a ritual that works.",
              },
              {
                num: "02",
                title: "Purity",
                desc: "Nothing enters our formulations without a reason, and nothing unnecessary is permitted to remain. No fillers, no colorants, no compromises. Every batch is independently tested before it reaches you.",
              },
              {
                num: "03",
                title: "Ritual",
                desc: "A quieter standard of vitality begins with consistency. Viality is designed to become a moment — unhurried, intentional, daily. Not a chore. Not a trend. A permanent fixture of how you care for yourself.",
              },
            ].map((principle, idx) => (
              <div key={idx} className="text-center">
                <div className="text-accent text-5xl font-serif mb-4 opacity-40">
                  {principle.num}
                </div>
                <h3 className="text-2xl font-serif text-primary mb-4">
                  {principle.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Standards */}
      <section className="py-24 bg-muted/50 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="text-secondary text-xs uppercase tracking-widest font-semibold mb-4">
              Our Standards
            </div>
            <h2 className="text-4xl md:text-5xl text-primary mb-4">
              The science is visible.
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              We operate with complete openness. Every claim we make is
              verifiable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Independent Lab Testing",
                desc: "Every batch is third-party verified by an ISO-accredited laboratory for identity, potency, and purity. We don't ask you to take our word for it.",
              },
              {
                title: "Traceable Sourcing",
                desc: "Every raw material is sourced from verified, ethical suppliers with full traceability. We know where it comes from — and you should too.",
              },
              {
                title: "Batch Transparency",
                desc: "Each product carries a batch number tied directly to its Certificate of Analysis. Clarity isn't a promise — it's a policy.",
              },
              {
                title: "No Proprietary Blends",
                desc: "Every ingredient and its exact dose is declared. No hidden quantities, no blended obscurity. What you see is precisely what you receive.",
              },
            ].map((standard, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-border/40"
              >
                <h3 className="text-xl font-serif text-primary mb-3">
                  {standard.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {standard.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/lab-reports"
              className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary hover:text-white transition-colors"
            >
              View Lab Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary text-primary-foreground py-24 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">
            Join our newsletter
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
            The latest in peptides, biohacking, longevity and human
            optimization.
          </p>
        </div>
      </section>
    </div>
  );
}
