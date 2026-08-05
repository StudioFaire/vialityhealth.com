"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { GrainOverlay } from "@/components/GrainOverlay";
import { fadeUp, fadeIn, staggerContainer, EASE_EDITORIAL } from "@/lib/motion";

const pillars = [
  {
    number: "01",
    title: "Precision",
    body: "Every compound is selected through careful evaluation of peer-reviewed evidence. We work with formulation experts who understand that getting the dose, the form, and the bioavailability right is the difference between a supplement and a ritual that works.",
  },
  {
    number: "02",
    title: "Purity",
    body: "Nothing enters our formulations without a reason, and nothing unnecessary is permitted to remain. No fillers, no colorants, no compromises. Every batch is independently tested before it reaches you.",
  },
  {
    number: "03",
    title: "Ritual",
    body: "A quieter standard of vitality begins with consistency. viality is designed to become a moment — unhurried, intentional, daily. Not a chore. Not a trend. A permanent fixture of how you care for yourself.",
  },
];

const trustItems = [
  {
    label: "Independent Lab Testing",
    detail:
      "Every batch is third-party verified by an ISO-accredited laboratory for identity, potency, and purity. We don't ask you to take our word for it.",
  },
  {
    label: "Traceable Sourcing",
    detail:
      "Every raw material is sourced from verified, ethical suppliers with full traceability. We know where it comes from — and you should too.",
  },
  {
    label: "Batch Transparency",
    detail:
      "Each product carries a batch number tied directly to its Certificate of Analysis. Clarity isn't a promise — it's a policy.",
  },
  {
    label: "No Proprietary Blends",
    detail:
      "Every ingredient and its exact dose is declared. No hidden quantities, no blended obscurity. What you see is precisely what you receive.",
  },
];

export function AboutPageClient() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 overflow-hidden"
      >
        {/* Parallax background panel */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-hero-gradient" />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(65% 60% at 25% 70%, oklch(0.76 0.042 78 / 0.8) 0%, transparent 65%)",
            }}
            animate={{ x: [0, 20, -14, 0], y: [0, -16, 20, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 55% at 78% 30%, oklch(0.82 0.02 81 / 0.6) 0%, transparent 60%)",
            }}
            animate={{ x: [0, -18, 12, 0], y: [0, 22, -12, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <div className="absolute inset-0 bg-hero-fade" />
          <GrainOverlay opacity={0.04} blendMode="multiply" />
        </motion.div>

        {/* Hero text */}
        <div className="relative z-10 mx-auto container">
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-8"
          >
            our philosophy
          </motion.p>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="font-serif uppercase font-light text-primary-foreground leading-[1.05] mb-8"
            style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
          >
            <span>research grade. </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
            className="text-primary-foreground/65 text-sm md:text-base font-light leading-relaxed max-w-xl"
          >
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
          </motion.p>
        </div>

        {/* <Image
          src="/images/about-hero.jpg"
          alt="Rocks"
          fill
          className="object-cover inset-0"
          sizes="(max-width: 768px) 100vw, 50vw"
        /> */}
      </section>

      {/* Brand Philosophy */}
      <section className="bg-background py-28 md:py-36 px-6 md:px-16">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer(0.12)}
            className="max-w-lg mx-auto text-balance"
          >
            <motion.p
              variants={fadeIn}
              custom={0}
              className="text-xs uppercase tracking-widest text-primary/40 mb-8"
            >
              brand philosophy
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-8 leading-snug"
            >
              where science and discipline meet and neither is allowed to
              compromise the other.
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={0.1}
              className="space-y-5 text-primary/60 text-sm leading-[1.85] font-light"
            >
              <p>
                viality — signature formula. Every compound earns its place
                through peer-reviewed science, not wellness trends.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: EASE_EDITORIAL }}
          >
            <div className="aspect-square bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
              <Image
                src="/images/vials.webp"
                alt="Product assortment"
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
          </motion.div>
        </div>
      </section>

      {/* Three Principles */}
      <section className="bg-surface-section py-12 md:py-36 px-6 md:px-16">
        <div className="max-w-300 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer(0.1)}
            className="mb-20"
          >
            <motion.p
              variants={fadeIn}
              custom={0}
              className="text-xs uppercase tracking-widest text-primary/40 mb-5"
            >
              What We Stand For
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-balance font-serif uppercase font-light text-4xl md:text-5xl text-primary"
            >
              <span>Three principles. No exceptions.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: EASE_EDITORIAL }}
                className="flex flex-col"
              >
                <div className="flex items-start gap-6 mb-8 pb-8 border-b border-primary/10">
                  <span className="font-serif uppercase font-light text-5xl text-primary/12 leading-none select-none">
                    {pillar.number}
                  </span>
                  <h3 className="font-serif uppercase font-light text-3xl text-primary leading-none mt-1">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-primary/55 text-sm leading-[1.9] font-light">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Standards */}
      <section className="bg-background py-28 md:py-36 px-6 md:px-16">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: EASE_EDITORIAL }}
              className="md:sticky md:top-28"
            >
              <div className="aspect-3-4 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/lean.webp"
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
            </motion.div>

            <div className="flex flex-col gap-14">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={staggerContainer(0.1)}
              >
                <motion.p
                  variants={fadeIn}
                  custom={0}
                  className="text-xs uppercase tracking-widest text-primary/40 mb-6"
                >
                  Our Standards
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  custom={0}
                  className="font-serif uppercase font-light text-4xl text-primary leading-snug mb-4"
                >
                  <span>the science is visible.</span>
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  custom={0.1}
                  className="text-primary/55 text-sm leading-relaxed font-light"
                >
                  We operate with complete openness. Every claim we make is
                  verifiable.
                </motion.p>
              </motion.div>

              {trustItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                  className="border-t border-primary/10 pt-8"
                >
                  <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                    {item.label}
                  </h4>
                  <p className="text-primary/55 text-sm leading-[1.85] font-light">
                    {item.detail}
                  </p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link
                  href="/certificate-of-analysis"
                  className="inline-block mt-2 text-xs uppercase tracking-widest border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
                >
                  Request Certificate of Analysis
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
