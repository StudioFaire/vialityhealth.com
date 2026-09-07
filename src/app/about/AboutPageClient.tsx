"use client";

import Image from "next/image";
import { m } from "motion/react";
import { fadeUp, fadeIn, staggerContainer, EASE_EDITORIAL } from "@/lib/motion";

export function AboutPageClient() {
  return (
    <section className="bg-background py-28 md:py-36 px-6 md:px-16">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer(0.12)}
          className="max-w-lg mx-auto text-balance"
        >
          <m.p
            variants={fadeIn}
            custom={0}
            className="text-xs uppercase tracking-widest text-primary/40 mb-8"
          >
            About Viality
          </m.p>
          <m.h2
            variants={fadeUp}
            custom={0}
            className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-8 leading-snug"
          >
            Research, without the noise.
          </m.h2>
          <m.div
            variants={fadeUp}
            custom={0.1}
            className="space-y-5 text-primary/60 text-sm leading-[1.85] font-light"
          >
            <p>
              Viality was created around a simple standard: Research materials should be clearly
              identified, independently tested, and supported by transparent documentation.
            </p>
            <p>
              We focus on quality, consistency, and straightforward access to information, so
              researchers can understand exactly what they are purchasing.
            </p>
            <p>
              Our materials are sold for research purposes only: They are not intended for human or
              veterinary use, and nothing on this site is to be used as a substitute for
              professional medical advice.
            </p>
          </m.div>
        </m.div>

        <m.div
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
        </m.div>
      </div>
    </section>
  );
}
