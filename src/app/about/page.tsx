import type { Metadata } from "next";
import { ShieldCheck, Leaf, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MOSSÉ — our story, the origins of sea moss, and our commitment to responsible sourcing and quality.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-100 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about-hero.jpg"
            alt="Atlantic coastline"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6">
            Wellness, returned
            <br />
            to its source.
          </h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-xl md:text-2xl text-primary font-serif leading-relaxed">
            MOSSÉ was created to make traditional ingredients feel relevant to
            modern life. We believe wellness does not need to be complicated.
            Our products combine naturally sourced sea moss with thoughtful
            formulation, transparent testing and considered design.
          </p>
        </div>
      </section>

      {/* Alternating Editorial Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 border-t border-border/40">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="aspect-3/4 w-full max-w-md overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/product-blend.jpg"
                  alt="Amber glass bottles on slate"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                Why we started
              </h2>
              <p className="text-foreground/70 leading-relaxed text-lg mb-6">
                The wellness industry has become increasingly
                complicated—filled with endless supplements, complex routines,
                and exaggerated claims.
              </p>
              <p className="text-foreground/70 leading-relaxed text-lg">
                We started MOSSÉ to offer something simpler. A single,
                powerful ingredient derived from the sea, presented with total
                transparency and zero pretension. We wanted to build a brand
                that looked as considered as the formulas inside the bottle.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 border-t border-border/40">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                The origins of sea moss
              </h2>
              <p className="text-foreground/70 leading-relaxed text-lg mb-6">
                Chondrus crispus, commonly known as sea moss, is a species of
                red algae that grows abundantly along the rocky parts of the
                Atlantic coast of Europe and North America.
              </p>
              <p className="text-foreground/70 leading-relaxed text-lg">
                Long before it became a modern wellness staple, it was utilized
                for centuries in traditional practices for its rich mineral
                profile. We honor this history by ensuring our sourcing methods
                protect the very ecosystems that provide it.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="aspect-3/4 w-full max-w-md overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ingredient.jpg"
                  alt="Sea moss underwater"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 border-t border-border/40">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about-hero.jpg"
                  alt="Atlantic coastline aerial"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                Responsible sourcing
              </h2>
              <p className="text-foreground/70 leading-relaxed text-lg mb-6">
                We believe that premium quality starts at the source. All
                MOSSÉ sea moss is wildcrafted, meaning it is harvested from
                its natural habitat rather than pool-grown.
              </p>
              <p className="text-foreground/70 leading-relaxed text-lg">
                Our harvesting partners utilize sustainable practices that
                ensure the continued growth and regeneration of the algae,
                leaving the delicate marine ecosystem undisturbed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-primary text-primary-foreground py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Nothing unnecessary.
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
              Every product is created with purpose. We prioritise clear
              ingredients, responsible sourcing and formulas designed to fit
              effortlessly into your routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-primary-foreground/20 rounded-full flex items-center justify-center mb-6 text-accent">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-serif mb-4">Clean Formulation</h3>
              <p className="text-primary-foreground/70">
                No fillers, binders, artificial colors or synthetic
                preservatives. Just the active ingredients you need.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-primary-foreground/20 rounded-full flex items-center justify-center mb-6 text-accent">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-serif mb-4">
                Transparent Sourcing
              </h3>
              <p className="text-primary-foreground/70">
                Fully traceable supply chain from the Atlantic rocks where it
                grows to the jar that sits on your counter.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-primary-foreground/20 rounded-full flex items-center justify-center mb-6 text-accent">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-serif mb-4">
                Third-Party Tested
              </h3>
              <p className="text-primary-foreground/70">
                Every single batch is independently tested by certified
                laboratories for heavy metals and purity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Rituals Footer */}
      <section className="bg-background py-24 px-4 border-t border-border/20">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
            Simple daily rituals
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed italic font-serif">
            &ldquo;Wellness is not found in grand gestures, but in the quiet,
            consistent choices we make every single day. A glass of water. A
            moment of stillness. The minerals that support us from
            within.&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
}
