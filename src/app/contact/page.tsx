"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";

const faqs = [
  {
    id: "1",
    q: "How should I store sea moss products?",
    a: "Our capsules and powders can be stored in a cool, dry place away from direct sunlight. Once opened, our Sea Moss Gel should be refrigerated and consumed within 3-4 weeks.",
  },
  {
    id: "2",
    q: "How long does shipping take?",
    a: "Standard shipping within the US takes 3-5 business days. Expedited shipping takes 1-2 business days. International orders typically arrive within 7-14 business days.",
  },
  {
    id: "3",
    q: "Can I change or cancel my order?",
    a: "We process orders quickly, but if you contact us within 1 hour of placing your order, we will do our best to accommodate any changes or cancellations.",
  },
  {
    id: "4",
    q: "Do you offer subscriptions?",
    a: 'Yes! You can select "Subscribe & Save 15%" on any product page. You can pause, modify, or cancel your subscription at any time through your account portal.',
  },
  {
    id: "5",
    q: "Where is your sea moss sourced?",
    a: "Our sea moss is ethically wildcrafted from the pristine, nutrient-dense waters of the North Atlantic, far from commercial ports or shipping lanes.",
  },
  {
    id: "6",
    q: "Are your products third-party tested?",
    a: "Absolutely. Every batch is rigorously tested by independent, ISO-certified laboratories for heavy metals, microbes, and purity before it reaches you.",
  },
];

const subjects = [
  "Product Question",
  "Order Support",
  "Shipping",
  "Returns",
  "Wholesale",
  "General Enquiry",
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pt-10 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">
            Let&apos;s talk wellness.
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Whether you have a question about our formulas, need help with an
            order, or want to explore wholesale opportunities, we&apos;re here
            to help.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Contact Form */}
          <div className="lg:w-3/5">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border/40">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-serif text-2xl text-primary mb-3">
                      Message Received
                    </h3>
                    <p className="text-foreground/70 mb-8 max-w-sm">
                      Thank you for reaching out. A member of our team will get
                      back to you within 24-48 business hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          orderNumber: "",
                          subject: "",
                          message: "",
                        });
                      }}
                      className="px-8 py-3 bg-primary text-white rounded-full text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="font-serif text-2xl text-primary mb-8">
                      Send us a message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                            Full Name *
                          </label>
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                            Email Address *
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="jane@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                            Phone Number
                          </label>
                          <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                            Order Number
                          </label>
                          <input
                            name="orderNumber"
                            value={form.orderNumber}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                            placeholder="If applicable"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                          Subject *
                        </label>
                        <div className="relative">
                          <select
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
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
                        <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-primary text-white rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary/90 transition-colors mt-8"
                      >
                        Send Message
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:w-2/5 flex flex-col justify-center">
            <div className="mb-12">
              <h3 className="font-serif text-2xl text-primary mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-1">
                    Email
                  </h4>
                  <a
                    href="mailto:hello@mossewellness.com"
                    className="text-lg text-primary hover:text-secondary transition-colors"
                  >
                    hello@mossewellness.com
                  </a>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-1">
                    Hours
                  </h4>
                  <p className="text-foreground/80">Monday – Friday</p>
                  <p className="text-foreground/80">9:00 am – 5:00 pm EST</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-1">
                    Press Inquiries
                  </h4>
                  <a
                    href="mailto:press@mossewellness.com"
                    className="text-primary hover:text-secondary transition-colors"
                  >
                    press@mossewellness.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-8 bg-muted rounded-3xl border border-border/30">
              <h3 className="font-serif text-xl text-primary mb-3">
                Wholesale Partners
              </h3>
              <p className="text-foreground/70 mb-6 text-sm">
                Interested in stocking MOSSÉ products in your boutique, clinic,
                or wellness center?
              </p>
              <a
                href="mailto:wholesale@mossewellness.com"
                className="inline-flex font-medium text-primary hover:text-secondary transition-colors text-sm uppercase tracking-widest"
              >
                Apply for Wholesale &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto pt-16 border-t border-border/40">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-primary mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border-b border-border/40 pb-4"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === faq.id ? null : faq.id)
                  }
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <span className="font-medium text-primary pr-8">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-foreground/50 transition-transform duration-300 shrink-0 ${
                      openFaq === faq.id
                        ? "rotate-180 text-primary"
                        : "group-hover:text-primary"
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="py-2 pb-6 text-foreground/70 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
