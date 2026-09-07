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
    body: "A quieter standard of vitality begins with consistency. viality is designed to become a moment - unhurried, intentional, daily.",
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
      "Every raw material is sourced from verified, ethical suppliers with full traceability. We know where it comes from - and you should too.",
  },
  {
    label: "Batch Transparency",
    detail:
      "Each product carries a batch number tied directly to its Certificate of Analysis. Clarity isn't a promise - it's a policy.",
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

    <section className="bg-background py-28 md:py-36 px-6 md:px-16" >
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
            About Viality
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-8 leading-snug"
          >
            Research, without the noise.
          </motion.h2>
          <motion.div
            variants={fadeUp}
            custom={0.1}
            className="space-y-5 text-primary/60 text-sm leading-[1.85] font-light"
          >
            <p>
              Viality was created around a simple standard: Research materials should be clearly identified, independently tested, and supported by transparent documentation.
            </p>
            <p>
              We focus on quality, consistency, and straightforward access to information, so researchers can understand exactly what they are purchasing.
            </p>
            <p>
              Our materials are sold for research purposes only: They are not intended for human or veterinary use, and nothing on this site is to be used as a substitute for professional medical advice.
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
                viality - signature formula
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
