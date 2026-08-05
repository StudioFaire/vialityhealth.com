"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Where is my order?",
    a: "Once your order has shipped, you will receive a confirmation email with tracking information. You can use this to monitor your delivery in real time.",
  },
  {
    q: "Do you provide tracking?",
    a: "Yes. All orders are shipped with tracking. You will receive a tracking number via email as soon as your order is dispatched.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3–5 business days. Express shipping takes 1–2 business days. International orders typically arrive within 7–14 business days.",
  },
  {
    q: "What are your shipping options?",
    a: "We offer standard and express shipping domestically, and international shipping to select destinations. Free standard shipping is available on all orders over $200.",
  },
  {
    q: "Where do you ship to?",
    a: "We currently ship to select international destinations. Please contact us directly to confirm availability for your region.",
  },
  {
    q: "I didn't receive my order confirmation. What do I do?",
    a: "Please check your spam or junk folder. If you still cannot find it, contact us at vialityhealth@gmail.com with your order details and we will resend it.",
  },
  {
    q: "Can I update my shipping address after ordering?",
    a: "If your order has not yet been dispatched, contact us immediately and we will do our best to update the address. Once shipped, the address cannot be changed.",
  },
  {
    q: "What is your returns policy?",
    a: "We offer a 30-day money-back guarantee. If you are not completely satisfied, contact our team and we will arrange a return or exchange.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, as well as digital payment methods available through our secure checkout.",
  },
  {
    q: "What is your refund policy?",
    a: "Refunds are processed within 5–10 business days of receiving the returned item. The refund will be issued to the original payment method.",
  },
  {
    q: "Does Viality Health supply research peptides in Australia?",
    a: "We currently ship to select international destinations. Please contact us directly to confirm availability for your region.",
  },
  {
    q: "Are your products for human use?",
    a: "No. All Viality products are intended strictly for laboratory and research purposes. They are not for human or animal consumption.",
  },
  {
    q: "How should I store my peptides?",
    a: "Store in a cool, dry place away from direct sunlight. For reconstituted peptides, refrigerate and use within 30 days. Lyophilized peptides can be stored frozen for longer shelf life.",
  },
];

export default function FaqsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="bg-surface-section py-12 md:py-24 px-6 md:px-16">
      <div className="max-w-180 mx-auto">
        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border/60">
              <button
                type="button"
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                className="w-full py-4 flex justify-between items-center text-left gap-6 group"
              >
                <span className="text-xs uppercase tracking-widest font-medium group-hover:text-primary/70 transition-colors">
                  {faq.q}
                </span>
                <span className="shrink-0 text-primary/35">
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm text-primary/55 font-light leading-[1.85]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
