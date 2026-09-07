"use client";

import { useActionState } from "react";
import { m, AnimatePresence } from "motion/react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/app/actions/contact";

const subjects = [
  "Product Question",
  "Order Support",
  "Shipping",
  "Returns",
  "Wholesale",
  "General Enquiry",
];

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendContactMessage, {
    success: false,
    message: "",
  });

  return (
    <div className="min-h-screen bg-background pt-10 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Get in touch.</h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Whether you have a question about our formulations, need help with an order, or want to
            explore wholesale opportunities, we&apos;re here to help.
          </p>
        </m.div>

        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Contact Form */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:w-3/5"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border/40">
              <AnimatePresence mode="wait">
                {state.success ? (
                  <m.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-serif text-2xl text-primary mb-3">Message Received</h3>
                    <p className="text-foreground/70 mb-8 max-w-sm">{state.message}</p>
                    <button
                      type="reset"
                      form="contact-form"
                      className="px-8 py-3 bg-primary text-white rounded-full text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
                    >
                      Send another message
                    </button>
                  </m.div>
                ) : (
                  <m.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="font-serif text-2xl text-primary mb-8">Send us a message</h2>

                    <form id="contact-form" action={formAction} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="text-xs uppercase tracking-widest text-foreground/70 block mb-1"
                          >
                            Full Name *
                          </label>
                          <input
                            id="contact-name"
                            name="name"
                            required
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="text-xs uppercase tracking-widest text-foreground/70 block mb-1"
                          >
                            Email Address *
                          </label>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="jane@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="text-xs uppercase tracking-widest text-foreground/70 block mb-1"
                          >
                            Phone Number
                          </label>
                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-order"
                            className="text-xs uppercase tracking-widest text-foreground/70 block mb-1"
                          >
                            Order Number
                          </label>
                          <input
                            id="contact-order"
                            name="orderNumber"
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="If applicable"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="text-xs uppercase tracking-widest text-foreground/70 block mb-1"
                        >
                          Subject *
                        </label>
                        <div className="relative">
                          <select
                            id="contact-subject"
                            name="subject"
                            required
                            className="w-full bg-transparent border-b border-border/60 py-3 appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                          >
                            <option value="" disabled hidden>
                              Select a subject
                            </option>
                            {subjects.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="text-xs uppercase tracking-widest text-foreground/70 block mb-1"
                        >
                          Message *
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={5}
                          className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground"
                          placeholder="How can we help you?"
                        />
                      </div>

                      {state.message && !state.success && (
                        <p className="text-sm text-red-600">{state.message}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-4 bg-primary text-white rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary/90 transition-colors mt-8 disabled:opacity-50"
                      >
                        {isPending ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </m.div>

          {/* Contact Info */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:w-2/5 flex flex-col justify-center"
          >
            <div className="mb-12">
              <h3 className="font-serif text-2xl text-primary mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-1">
                    Email
                  </h4>
                  <a
                    href="mailto:hello@vialityhealth.com"
                    className="text-lg text-primary hover:text-secondary transition-colors"
                  >
                    hello@vialityhealth.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-8 bg-muted rounded-3xl border border-border/30">
              <h3 className="font-serif text-xl text-primary mb-3">Wholesale Partners</h3>
              <p className="text-foreground/70 mb-6 text-sm">
                Interested in stocking Viality products in your clinic, research facility, or
                wellness center?
              </p>
              <a
                href="mailto:hello@vialityhealth.com"
                className="inline-flex font-medium text-primary hover:text-secondary transition-colors text-sm uppercase tracking-widest"
              >
                Apply for Wholesale &rarr;
              </a>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
}
