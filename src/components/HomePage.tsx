"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GrainOverlay } from "@/components/GrainOverlay";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { getProductImage, formatPrice } from "@/lib/shopify/types";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

function VideoPanel({ src }: { src: string }) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, var(--color-video-overlay) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--color-video-overlay-strong) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function HomePage({ featuredProducts }: { featuredProducts: ShopifyProduct[] }) {
  const [newsletterState, newsletterAction, newsletterPending] = useActionState(
    subscribeToNewsletter,
    { success: false, message: "" }
  );

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Desktop: two video panels side-by-side */}
        <div className="hidden md:flex absolute inset-0">
          <VideoPanel src="/videos/double-helix.mp4" />
          <VideoPanel src="/videos/man-running.mp4" />
        </div>

        {/* Mobile: single video */}
        <div className="md:hidden absolute inset-0 bg-ink-well">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src="/videos/double-helix.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, var(--color-video-overlay) 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, var(--color-video-overlay-strong) 0%, transparent 100%)",
            }}
          />
        </div>

        <GrainOverlay />

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p
            className="text-lg font-sans font-light text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            99% Purity. Research Grade Peptides.
          </motion.p>

          <motion.h1
            className="logo text-7xl text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            viality
          </motion.h1>

          <motion.p
            className="text-lg font-sans font-light text-white mt-2 md:mt-4 max-w-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 1, ease: "easeOut" }}
          >
            where science meets performance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
            className="mt-10 grid sm:grid-cols-2 gap-4"
          >
            <Link
              href="/shop"
              className="px-9 py-3.5 bg-primary-foreground text-ink text-xs uppercase tracking-widest hover:bg-primary-foreground/90 active:bg-primary-foreground/80 transition-colors duration-200"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-9 py-3.5 border border-primary-foreground/50 text-primary-foreground text-xs uppercase tracking-widest hover:border-primary-foreground hover:bg-primary-foreground/8 transition-all duration-200"
            >
              Our Philosophy
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-primary-foreground/30"
          />
          <span className="text-primary-foreground/30 text-xs uppercase tracking-widest">
            scroll
          </span>
        </motion.div>
      </section>

      {/* ── Trust Section ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 grid grid-cols-2 gap-x-8 gap-y-12">
            {[
              {
                title: "Evidence-Led",
                desc: "Each compound earns its place through peer-reviewed science, not wellness trends.",
              },
              {
                title: "Third-Party Verified",
                desc: "Every batch is independently tested. Certificates of analysis, always available.",
              },
              {
                title: "Batch Transparency",
                desc: "Each product carries a batch number tied directly to its Certificate of Analysis.",
              },
              {
                title: "GMP Manufactured",
                desc: "Produced in a certified facility where consistency is non-negotiable.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <div className="size-7 border border-primary/15 flex items-center justify-center mb-2">
                  <div className="size-1.5 bg-accent" />
                </div>
                <h4 className="text-xs uppercase tracking-widest font-semibold">
                  {item.title}
                </h4>
                <p className="text-sm text-primary/55 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="order-1 md:order-2">
            <h2 className="font-serif uppercase font-light text-4xl mb-6">
              our standards
            </h2>
            <p className="text-primary/65 mb-10 leading-relaxed max-w-md">
              We operate with complete openness. Every claim we make is
              verifiable. Every detail disclosed, every claim supported by
              evidence.
            </p>
            <Link
              href="/lab-reports"
              className="px-8 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 transition-colors inline-block"
            >
              View Lab Reports
            </Link>
          </div>
        </div>
      </section>

      {/* ── Philosophy ────────────────────────────────────── */}
      <section className="py-36 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="font-serif uppercase font-light text-2xl md:text-4xl leading-relaxed text-primary/90"
          >
            where science and discipline meet and neither is allowed to
            compromise the other.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12"
          >
            <Link
              href="/about"
              className="inline-block border-b border-primary/30 pb-1 text-xs uppercase tracking-widest hover:border-primary transition-colors"
            >
              Our Philosophy
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-warm">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-end mb-8">
            <h2 className="font-serif uppercase font-light text-4xl text-primary">
              The Collection
            </h2>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest hidden md:inline-block border-b border-transparent hover:border-primary/30 pb-1 transition-colors"
            >
              Shop All
            </Link>
          </header>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => {
                const image = getProductImage(product);
                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/product/${product.handle}`}>
                      <div className="aspect-3/4 mb-6 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || product.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="text-primary/20 font-serif uppercase font-light text-6xl tracking-wider">
                            v
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <h3 className="uppercase tracking-widest text-xs font-medium">
                            {product.title}
                          </h3>
                          <span className="text-sm font-light">
                            {formatPrice(product.priceRange.minVariantPrice)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-primary/40">
                Products coming soon
              </p>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/shop"
              className="inline-block border-b border-primary/30 pb-1 text-xs uppercase tracking-widest"
            >
              Shop All
            </Link>
          </div>
        </div>
      </section>

      {/* ── Shipping Info ────────────────────────────────── */}
      <section className="py-16 px-6 bg-surface-section border-t border-border/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { label: "Complimentary Shipping", detail: "On all orders over $200" },
            { label: "Batch Verified", detail: "Third-party COA available for every formulation" },
            { label: "Research Use Only", detail: "Not for human or animal consumption" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest font-semibold">
                {item.label}
              </p>
              <p className="text-xs text-primary/50">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-sans uppercase text-balance text-4xl mb-4">
            join our newsletter
          </h2>
          <p className="uppercase text-primary-foreground/65 mb-10 text-sm max-w-sm text-balance leading-relaxed">
            the latest in peptides, biohacking, longevity and human optimization
          </p>
          <form action={newsletterAction} className="w-full flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="flex-1 bg-transparent border-b border-primary-foreground/25 px-4 py-3 text-xs focus:outline-none focus:border-accent placeholder:text-primary-foreground/30 uppercase tracking-widest transition-colors"
              required
            />
            <button
              type="submit"
              disabled={newsletterPending}
              className="px-8 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/88 transition-colors disabled:opacity-50"
            >
              {newsletterPending ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          {newsletterState.message && (
            <p className={`mt-4 text-xs uppercase tracking-widest ${newsletterState.success ? "text-accent" : "text-red-400"}`}>
              {newsletterState.message}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
