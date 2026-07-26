import type { Metadata } from "next";
import { Microscope, FlaskConical, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Philosophy",
  description:
    "Learn about Viality — our philosophy, our standards, and our commitment to precision, purity, and ritual in research grade peptides.",
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
            alt="Laboratory research environment"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6">
            our philosophy
          </h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-xl md:text-2xl text-primary font-serif leading-relaxed">
            we believe scientific progress is driven by curiosity, precision,
            and a commitment to quality. viality exists to support research by
            providing high quality materials and maintaining rigorous standards
            of consistency and transparency. because every discovery starts with
            a question.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 py-16 border-t border-border/40">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="aspect-3/4 w-full max-w-md overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/product-blend.jpg"
                  alt="Viality product assortment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                where science and discipline meet and neither is allowed to
                compromise the other.
              </h2>
              <p className="text-foreground/70 leading-relaxed text-lg">
                viality — signature formula. Every compound earns its place
                through peer-reviewed science, not wellness trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Principles */}
      <section className="bg-primary text-primary-foreground py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Three principles. No exceptions.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="text-primary-foreground/30 text-5xl font-serif mb-4">
                01
              </div>
              <h3 className="text-xl font-serif mb-4">Precision</h3>
              <p className="text-primary-foreground/70">
                Every compound is selected through careful evaluation of
                peer-reviewed evidence. We work with formulation experts who
                understand that getting the dose, the form, and the
                bioavailability right is the difference between a supplement and
                a ritual that works.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-primary-foreground/30 text-5xl font-serif mb-4">
                02
              </div>
              <h3 className="text-xl font-serif mb-4">Purity</h3>
              <p className="text-primary-foreground/70">
                Nothing enters our formulations without a reason, and nothing
                unnecessary is permitted to remain. No fillers, no colorants, no
                compromises. Every batch is independently tested before it
                reaches you.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-primary-foreground/30 text-5xl font-serif mb-4">
                03
              </div>
              <h3 className="text-xl font-serif mb-4">Ritual</h3>
              <p className="text-primary-foreground/70">
                A quieter standard of vitality begins with consistency. viality
                is designed to become a moment — unhurried, intentional, daily.
                Not a chore. Not a trend. A permanent fixture of how you care
                for yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Standards */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="text-secondary text-xs uppercase tracking-widest font-semibold mb-4">
              Our Standards
            </div>
            <h2 className="text-4xl md:text-5xl text-primary mb-4">
              the science is visible.
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              We operate with complete openness. Every claim we make is
              verifiable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/40">
              <div className="w-16 h-16 border border-border/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                <Microscope size={24} />
              </div>
              <h3 className="text-xl font-serif mb-4">
                Independent Lab Testing
              </h3>
              <p className="text-foreground/70">
                Every batch is third-party verified by an ISO-accredited
                laboratory for identity, potency, and purity. We don&apos;t ask
                you to take our word for it.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/40">
              <div className="w-16 h-16 border border-border/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                <FlaskConical size={24} />
              </div>
              <h3 className="text-xl font-serif mb-4">Traceable Sourcing</h3>
              <p className="text-foreground/70">
                Every raw material is sourced from verified, ethical suppliers
                with full traceability. We know where it comes from — and you
                should too.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/40">
              <div className="w-16 h-16 border border-border/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-serif mb-4">Batch Transparency</h3>
              <p className="text-foreground/70">
                Each product carries a batch number tied directly to its
                Certificate of Analysis. Clarity isn&apos;t a promise — it&apos;s
                a policy.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/40">
              <div className="w-16 h-16 border border-border/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                <FlaskConical size={24} />
              </div>
              <h3 className="text-xl font-serif mb-4">
                No Proprietary Blends
              </h3>
              <p className="text-foreground/70">
                Every ingredient and its exact dose is declared. No hidden
                quantities, no blended obscurity. What you see is precisely what
                you receive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Use Disclaimer */}
      <section className="bg-background py-16 px-4 border-t border-border/20">
        <div className="container mx-auto text-center max-w-3xl">
          <p className="text-foreground/50 text-sm italic leading-relaxed">
            These statements have not been evaluated by the Food and Drug
            Administration. This product is intended strictly for research and
            laboratory use and is not for human consumption. By completing your
            purchase, you confirm that you are at least 18 years of age, that
            this material will be handled responsibly, and that it will be used
            solely for lawful research or analytical purposes in accordance with
            all applicable regulations.
          </p>
        </div>
      </section>
    </div>
  );
}
