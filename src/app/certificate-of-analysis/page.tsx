import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "Certificate of Analysis",
  description:
    "Certificates of Analysis (COAs) are available upon request for eligible products and batches at Viality.",
};

export default function CertificateOfAnalysisPage() {
  return (
    <section className="bg-background py-28 md:py-36 px-6 md:px-16">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
          {/* Left: Sticky Image */}
          <Reveal x={-24} y={0} className="md:sticky md:top-28">
            <div className="aspect-3-4 bg-surface-gallery relative overflow-hidden flex items-center justify-center">
              <Image
                src="/images/RT20-Vanguard20COA.webp"
                alt="Certificate Of Analysis"
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
          </Reveal>

          {/* Right: Content */}
          <div className="flex flex-col gap-14">
            <Reveal delay={0.1}>
              <p className="text-xs uppercase tracking-widest text-primary/40 mb-6">
                At Viality, transparency is a core part of our commitment to quality.
              </p>
              <h2 className="font-serif uppercase font-light text-4xl text-primary leading-snug mb-4">
                <span>Certificate of Analysis (COA)</span>
              </h2>
              <p className="text-primary/55 text-sm leading-relaxed font-light">
                Certificates of Analysis (COAs) are available upon request for
                eligible products and batches.
                <br />
                <br />
                To request a COA, please contact our team at{" "}
                <a
                  href="mailto:vialityhealth@gmail.com"
                  className="underline hover:text-primary transition-colors"
                >
                  vialityhealth@gmail.com
                </a>{" "}
                with the product name and batch number.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="border-t border-primary/10 pt-8">
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                  Research Grade Materials
                </h4>
                <p className="text-primary/55 text-sm leading-[1.85] font-light">
                  Every compound is sourced from verified suppliers and subjected
                  to rigorous identity and purity testing before release.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="border-t border-primary/10 pt-8">
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                  Third-Party Verification
                </h4>
                <p className="text-primary/55 text-sm leading-[1.85] font-light">
                  Each batch is independently tested by an ISO-accredited
                  laboratory. Results are documented and traceable.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="border-t border-primary/10 pt-8">
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                  Batch Transparency
                </h4>
                <p className="text-primary/55 text-sm leading-[1.85] font-light">
                  Each product carries a batch number tied directly to its
                  Certificate of Analysis. Clarity isn&apos;t a promise — it&apos;s a
                  policy.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <a
                href="mailto:vialityhealth@gmail.com?subject=COA%20Request"
                className="inline-block text-xs uppercase tracking-widest border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
              >
                Request a COA
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
