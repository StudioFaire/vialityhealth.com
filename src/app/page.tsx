import Link from "next/link";
import { Leaf, Droplets, ShieldCheck, Heart } from "lucide-react";
import { getAllProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify/types";

export default async function HomePage() {
  let products: ShopifyProduct[] = [];
  try {
    products = await getAllProducts(3);
  } catch {
    // Shopify not configured yet
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-150 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-bg.jpg"
            alt="Atlantic Ocean waves on dark rocks"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 px-4 py-1 border border-white/30 rounded-full text-white/90 text-xs tracking-widest uppercase backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            Wildcrafted Atlantic Sea Moss
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Daily minerals.
            <br />
            Naturally sourced.
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Premium sea moss supplements created to support your everyday
            wellness routine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-primary hover:bg-white/90 rounded-full font-medium tracking-wide uppercase text-sm transition-colors"
            >
              Shop Sea Moss
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-transparent border border-white text-white hover:bg-white/10 rounded-full font-medium tracking-wide uppercase text-sm transition-colors"
            >
              Discover Our Story
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white to-white/0 mx-auto" />
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-muted py-12 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "Naturally Sourced" },
              { icon: Droplets, title: "Mineral Rich" },
              { icon: ShieldCheck, title: "Third-Party Tested" },
              { icon: Heart, title: "Made for Daily Wellness" },
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
              Our Collection
            </h2>
            <div className="w-16 h-px bg-accent mx-auto" />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              View All Products
              <span className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="bg-primary text-primary-foreground py-24 md:py-32 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
            Nature created the minerals. We simply made them easier to take.
          </h2>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <div className="text-secondary text-xs uppercase tracking-widest font-semibold mb-4">
                The Ingredient
              </div>
              <h2 className="text-4xl md:text-5xl text-primary mb-6">
                What is sea moss?
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-8 text-lg">
                Sea moss is a type of red algae traditionally harvested from
                Atlantic coastlines. It naturally contains a range of minerals
                and is commonly incorporated into modern wellness routines.
              </p>
              <Link
                href="/about"
                className="px-8 py-3 border-2 border-primary text-primary rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary hover:text-white transition-colors inline-block"
              >
                Learn More
              </Link>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="aspect-square md:aspect-4/5 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ingredient.jpg"
                  alt="Sea moss underwater"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-24 bg-muted/50 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-primary mb-4">
              Simple daily rituals
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              Consistency is the key to any wellness routine. We&apos;ve
              designed our products to fit effortlessly into your day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-border z-0" />

            {[
              {
                num: "01",
                title: "Choose your formula",
                desc: "Select from capsules, gel, or powder based on your lifestyle.",
              },
              {
                num: "02",
                title: "Take it consistently",
                desc: "Incorporate it into your morning routine or with a meal.",
              },
              {
                num: "03",
                title: "Make it a ritual",
                desc: "Notice the difference that daily mineral support provides.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center bg-transparent"
              >
                <div className="w-16 h-16 rounded-full bg-white text-primary font-serif text-2xl flex items-center justify-center mb-6 shadow-sm border border-border/40">
                  {step.num}
                </div>
                <h3 className="text-xl font-serif text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
