"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { m } from "motion/react";

const faqSections = [
  {
    heading: "Ordering & delivery",
    items: [
      {
        q: "Where are orders shipped from?",
        a: "All Viality Health orders are dispatched from within Australia, allowing us to provide reliable domestic fulfilment and delivery.",
      },
      {
        q: "Do you ship internationally?",
        a: "No. Viality Health currently ships within Australia only. We do not offer international shipping at this time.",
      },
      {
        q: "Do you ship Australia-wide?",
        a: "Yes. We ship to eligible addresses throughout Australia.",
      },
      {
        q: "How long does delivery take?",
        a: "Most orders are delivered within approximately 4–5 business days after dispatch, depending on your location and the postal network. Regional and remote locations may require additional delivery time.",
      },
      {
        q: "Will I receive tracking information?",
        a: "Yes. Once your order has been dispatched, tracking information will be sent to the email address provided at checkout. Please allow some time for tracking information to become active after your parcel has been processed by the carrier.",
      },
      {
        q: "How quickly are orders dispatched?",
        a: "We aim to process and dispatch orders as quickly as possible. Dispatch times may vary during periods of high demand, public holidays or product launches.",
      },
      {
        q: "What happens if my order hasn't arrived?",
        a: "If your tracking information shows an unexpected delay or your parcel has not arrived within the expected timeframe, please contact our support team with your order number and tracking information. We will review the shipment and assist with the next steps.",
      },
      {
        q: "What happens if my parcel is lost?",
        a: "If a parcel appears to have been lost in transit, please contact us so we can investigate the shipment with the relevant delivery provider. Any replacement or resolution will be assessed once the carrier's investigation has been completed.",
      },
      {
        q: "Are orders packaged discreetly?",
        a: "Yes. Orders are shipped in secure, discreet external packaging.",
      },
      {
        q: "How are products protected during delivery?",
        a: "Orders are packed carefully to minimise movement and protect products during transit.",
      },
    ],
  },
  {
    heading: "Payments & orders",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Available payment methods will be displayed at checkout.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "If you need to change or cancel an order, contact us as soon as possible. Once an order has entered fulfilment or has been dispatched, we may no longer be able to modify or cancel it.",
      },
      {
        q: "I entered the wrong delivery address. What should I do?",
        a: "Contact us immediately with your order number and the correct delivery details. If your order has not yet been dispatched, we will do our best to update the address. Once a parcel has been dispatched, we cannot guarantee that delivery details can be changed.",
      },
      {
        q: "Do you offer bulk or wholesale orders?",
        a: "Yes. Bulk or wholesale enquiries can be submitted directly to the Viality Health team. Availability and pricing may vary depending on the product and quantity required.",
      },
    ],
  },
  {
    heading: "Returns, refunds & damaged orders",
    items: [
      {
        q: "Do you accept returns?",
        a: "Due to the nature of our products and the importance of maintaining product integrity, we generally cannot accept returns once an order has been delivered. If there is an issue with your order, please contact us as soon as possible so our team can review the circumstances.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "If your order arrives damaged, contact us promptly and provide your order number, photographs of the external packaging, photographs of the affected product, and a description of the issue. Our team will assess the situation and determine the appropriate resolution.",
      },
      {
        q: "What if I receive the wrong product?",
        a: "Please contact us with your order number and photographs of the products received. If we have made a fulfilment error, our team will work with you to resolve it.",
      },
      {
        q: "Are shipping delays refundable?",
        a: "Delivery estimates are provided as a guide and may be affected by circumstances outside our control. A delayed shipment does not automatically qualify for a refund. If a parcel is confirmed as lost or another issue has occurred, our team will assess the appropriate resolution.",
      },
    ],
  },
  {
    heading: "Product quality & testing",
    items: [
      {
        q: "What quality standards do Viality Health products follow?",
        a: "Viality Health is focused on supplying high-quality research products with an emphasis on purity, consistency, batch verification and transparent quality assurance.",
      },
      {
        q: "Are your products third-party tested?",
        a: "Where specified, products are independently tested to verify identity and/or purity. Testing information may vary by product and batch.",
      },
      {
        q: "What is the purity of your peptides?",
        a: "Our research peptides are supplied to defined quality specifications, with applicable products targeting 99%+ purity. Refer to the relevant product or batch documentation for specific testing information.",
      },
      {
        q: "Do you provide certificates of analysis?",
        a: "Certificates of Analysis or relevant testing documentation may be available for applicable products and batches. Please refer to the product page or contact our team if you require documentation for a particular batch.",
      },
      {
        q: 'What does "research grade" mean?',
        a: "Research grade refers to products supplied for laboratory, analytical and research applications. It does not mean that a product is approved as a medicine or approved for therapeutic use.",
      },
    ],
  },
  {
    heading: "Storage & handling",
    items: [
      {
        q: "How should products be stored?",
        a: "Storage requirements can vary depending on the specific compound and format. Always refer to the storage information provided with the product or on the relevant product page. Products should generally be kept securely stored, protected from unnecessary exposure to heat, moisture and direct sunlight, and handled using appropriate laboratory practices.",
      },
      {
        q: "How should lyophilised peptides be handled?",
        a: "Lyophilised products should be handled carefully and stored according to the conditions specified for the individual product. Avoid unnecessary exposure to heat, moisture or light.",
      },
      {
        q: "Can Viality provide reconstitution or dosage instructions?",
        a: "No. Viality Health products sold as research compounds are intended strictly for research purposes. We do not provide personal dosing protocols, administration instructions or medical advice.",
      },
    ],
  },
  {
    heading: "Research use & compliance",
    items: [
      {
        q: "Are Viality Health research peptides intended for human consumption?",
        a: "No. Products identified as research compounds are supplied strictly for laboratory and research purposes only and are not intended for human or veterinary consumption. They are not supplied for therapeutic, diagnostic or medicinal use.",
      },
      {
        q: "Can you recommend a dosage?",
        a: "No. We do not provide dosage recommendations, treatment protocols or medical advice for research compounds. Information provided by Viality Health is intended for general product and research information only.",
      },
      {
        q: "Can you tell me which peptide I should use for a medical condition?",
        a: "No. Viality Health does not diagnose medical conditions or recommend research compounds as treatments. For questions relating to your health, medication or treatment, speak with an appropriately qualified healthcare professional.",
      },
      {
        q: "Is information on the Viality Health website medical advice?",
        a: "No. Content provided by Viality Health is for general informational and research purposes and should not be interpreted as medical advice, diagnosis or treatment guidance.",
      },
    ],
  },
];

export default function FaqsPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <section className="bg-surface-section py-12 md:py-24 px-6 md:px-16">
      <div className="max-w-180 mx-auto">
        {faqSections.map((section, sectionIndex) => (
          <div key={section.heading} className={sectionIndex > 0 ? "mt-12" : ""}>
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="text-lg font-serif text-primary mb-6"
            >
              {section.heading}
            </m.h2>
            <div>
              {section.items.map((faq, index) => {
                const faqId = `${sectionIndex}-${index}`;
                const isOpen = openFaq === faqId;
                return (
                  <m.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="border-b border-border/60"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faqId)}
                      aria-expanded={isOpen}
                      className="w-full py-4 flex justify-between items-center text-left gap-6 group"
                    >
                      <span className="text-xs uppercase tracking-widest font-medium group-hover:text-primary/70 transition-colors">
                        {faq.q}
                      </span>
                      <span className="shrink-0 text-primary/35">
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                      aria-hidden={!isOpen}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 text-sm text-primary/55 font-light leading-[1.85]">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
