import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GrainOverlay } from "@/components/GrainOverlay";

export const metadata: Metadata = {
  title: "Our Philosophy",
  description:
    "Learn about Viality — our philosophy, our standards, and our commitment to precision, purity, and ritual in research grade peptides.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ transform: "translateY(18%)" }}
        >
          <div className="absolute inset-0 bg-hero-gradient" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(65% 60% at 25% 70%, oklch(0.76 0.042 78 / 0.8) 0%, transparent 65%)",
              transform: "translateX(-13.666px) translateY(19.5229px)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 55% at 78% 30%, oklch(0.82 0.02 81 / 0.6) 0%, transparent 60%)",
              transform: "translateX(9.86501px) translateY(-9.86501px)",
            }}
          />
          <div className="absolute inset-0 bg-hero-fade" />
          <GrainOverlay opacity={0.04} blendMode="multiply" />
        </div>
        <div className="relative z-10 mx-auto container">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-8">
            our philosophy
          </p>
          <h1
            className="font-serif uppercase font-light text-primary-foreground leading-[1.05] mb-8"
            style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
          >
            <span>research grade. </span>
          </h1>
          <p className="text-primary-foreground/65 text-sm md:text-base font-light leading-relaxed max-w-xl">
            we believe scientific progress is driven by curiosity, precision,
            and a commitment to quality.
            <br />
            <br />
            viality exists to support research by providing high quality
            materials and maintaining rigorous standards of consistency and
            transparency.
            <br />
            <br />
            because every discovery starts with a question.
          </p>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="bg-background py-28 md:py-36 px-6 md:px-16">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="max-w-lg mx-auto text-balance">
            <p className="text-xs uppercase tracking-widest text-primary/40 mb-8">
              brand philosophy
            </p>
            <h2 className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-8 leading-snug">
              where science and discipline meet and neither is allowed to
              compromise the other.
            </h2>
            <div className="space-y-5 text-primary/60 text-sm leading-[1.85] font-light">
              <p>
                viality — signature formula. Every compound earns its place
                through peer-reviewed science, not wellness trends.
              </p>
            </div>
          </div>
          <div>
            <div className="aspect-3-4 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
              <Image
                src="/images/product-blend.jpg"
                alt="PRoduct assortment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-5 left-5 z-10">
                <p className="text-xs uppercase tracking-widest text-primary/35">
                  viality — signature formula
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Principles */}
      <section className="bg-surface-section py-12 md:py-36 px-6 md:px-16">
        <div className="max-w-300 mx-auto">
          <div className="mb-20">
            <p className="text-xs uppercase tracking-widest text-primary/40 mb-5">
              What We Stand For
            </p>
            <h2 className="text-balance font-serif uppercase font-light text-4xl md:text-5xl text-primary">
              <span>Three principles. No exceptions.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="flex flex-col">
              <div className="flex items-start gap-6 mb-8 pb-8 border-b border-primary/10">
                <span className="font-serif uppercase font-light text-5xl text-primary/12 leading-none select-none">
                  01
                </span>
                <h3 className="font-serif uppercase font-light text-3xl text-primary leading-none mt-1">
                  Precision
                </h3>
              </div>
              <p className="text-primary/55 text-sm leading-[1.9] font-light">
                Every compound is selected through careful evaluation of
                peer-reviewed evidence. We work with formulation experts who
                understand that getting the dose, the form, and the
                bioavailability right is the difference between a supplement and
                a ritual that works.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-start gap-6 mb-8 pb-8 border-b border-primary/10">
                <span className="font-serif uppercase font-light text-5xl text-primary/12 leading-none select-none">
                  02
                </span>
                <h3 className="font-serif uppercase font-light text-3xl text-primary leading-none mt-1">
                  Purity
                </h3>
              </div>
              <p className="text-primary/55 text-sm leading-[1.9] font-light">
                Nothing enters our formulations without a reason, and nothing
                unnecessary is permitted to remain. No fillers, no colorants, no
                compromises. Every batch is independently tested before it
                reaches you.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-start gap-6 mb-8 pb-8 border-b border-primary/10">
                <span className="font-serif uppercase font-light text-5xl text-primary/12 leading-none select-none">
                  03
                </span>
                <h3 className="font-serif uppercase font-light text-3xl text-primary leading-none mt-1">
                  Ritual
                </h3>
              </div>
              <p className="text-primary/55 text-sm leading-[1.9] font-light">
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
      <section className="bg-background py-28 md:py-36 px-6 md:px-16">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
            <div className="md:sticky md:top-28">
              <div className="aspect-3-4 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/RT20-Vanguard20COA.webp"
                  alt="lean retatrutide"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-5 left-5 z-10">
                  <p className="text-xs uppercase tracking-widest text-primary/35">
                    Third-Party Verified
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-14">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary/40 mb-6">
                  Our Standards
                </p>
                <h2 className="font-serif uppercase font-light text-4xl text-primary leading-snug mb-4">
                  <span>the science is visible.</span>
                </h2>
                <p className="text-primary/55 text-sm leading-relaxed font-light">
                  We operate with complete openness. Every claim we make is
                  verifiable.
                </p>
              </div>
              <div className="border-t border-primary/10 pt-8">
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                  Independent Lab Testing
                </h4>
                <p className="text-primary/55 text-sm leading-[1.85] font-light">
                  Every batch is third-party verified by an ISO-accredited
                  laboratory for identity, potency, and purity. We don&apos;t
                  ask you to take our word for it.
                </p>
              </div>
              <div className="border-t border-primary/10 pt-8">
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                  Traceable Sourcing
                </h4>
                <p className="text-primary/55 text-sm leading-[1.85] font-light">
                  Every raw material is sourced from verified, ethical suppliers
                  with full traceability. We know where it comes from — and you
                  should too.
                </p>
              </div>
              <div className="border-t border-primary/10 pt-8">
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                  Batch Transparency
                </h4>
                <p className="text-primary/55 text-sm leading-[1.85] font-light">
                  Each product carries a batch number tied directly to its
                  Certificate of Analysis. Clarity isn&apos;t a promise —
                  it&apos;s a policy.
                </p>
              </div>
              <div className="border-t border-primary/10 pt-8">
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                  No Proprietary Blends
                </h4>
                <p className="text-primary/55 text-sm leading-[1.85] font-light">
                  Every ingredient and its exact dose is declared. No hidden
                  quantities, no blended obscurity. What you see is precisely
                  what you receive.
                </p>
              </div>
              <div>
                <Link
                  href="/certificate-of-analysis"
                  className="inline-block mt-2 text-xs uppercase tracking-widest border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
                >
                  Request Certificate of Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
