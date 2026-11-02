"use client";

import { ChevronDown } from "lucide-react";
import { m } from "motion/react";

const MIXING_NOTES = [
  {
    title: "Choose bacteriostatic water",
    body: "Bacteriostatic water contains benzyl alcohol, which helps slow microbial growth. Unpreserved sterile water offers no such protection and is a poor choice for a vial you will draw from more than once.",
  },
  {
    title: "Let the water run down the side",
    body: "Aim the stream at the glass wall rather than the powder. Once the water is in, roll or swirl the vial gently until the solution clears. Vigorous shaking can damage fragile peptides.",
  },
  {
    title: "Swab the stopper every time",
    body: "Clean the rubber stopper with a 70% isopropyl pad and let it air-dry before each draw. Repeating this small step helps protect the whole vial from contamination.",
  },
  {
    title: "Chill it straight away",
    body: "Refrigerate the mixed vial at 2 to 8°C and keep it out of the light. For most peptides, treat about four weeks as the practical limit once it has been reconstituted.",
  },
];

const FAQS = [
  {
    q: "How do I calculate units from a mixed vial?",
    a: "Divide the peptide milligrams by the millilitres of water to get the concentration. Then divide your dose by that concentration and multiply by 100. A 5 mg vial mixed with 2 mL gives 2.5 mg/mL, so 250 mcg works out to 10 units.",
  },
  {
    q: "How much bacteriostatic water should I add?",
    a: "It depends on the dose and the marks on your syringe. A larger volume makes each dose easier to read; a smaller volume keeps the draw compact. Check the result in the calculator, then follow the handling guidance supplied with your vial.",
  },
  {
    q: "Why does my pen dose not land on a whole click?",
    a: "Pens move in fixed steps, so a dose usually falls between two clicks. The calculator chooses the nearest one and reports the difference. If the gap matters, it may suggest a slightly different water volume that lands exactly.",
  },
  {
    q: "How many clicks are in a 3 mL cartridge?",
    a: "With a 0.01 mL click, 3 mL provides 300 clicks in total. A pen marked 60 can only dial 60 of them in one injection, so the marking is a dial limit rather than the cartridge capacity. Adjust the click size in pen settings if yours is different.",
  },
  {
    q: "Is a click the same as a unit?",
    a: "They match only when one click moves 0.01 mL, because 100 units also equals 1 mL. If your pen advances 0.02 mL per click, each click is two units. Enter the correct click size so the result is counted properly.",
  },
  {
    q: "How long does a mixed vial last?",
    a: "As a general guide, plan for about four weeks when stored cold. Set a frequency in the calculator to see when the last dose would fall. If that date is beyond the storage window, consider a smaller vial or mixing only what you need.",
  },
  {
    q: "Can I use a dose larger than my syringe or pen holds?",
    a: "Not in one go. A U-100 barrel tops out at 100 units, and a pen stops at its dial limit. The calculator warns you when a dose crosses either boundary. Using less water reduces the units or clicks needed for the same dose.",
  },
  {
    q: "Is this calculator medical advice?",
    a: "No. This page is a research and laboratory reference, not a dosing recommendation or treatment protocol. Verify every figure against your own equipment, and consult a qualified professional for anything involving human use.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
} as const;

export function CalculatorInfo() {
  return (
    <>
      <m.div {...reveal} transition={{ duration: 0.7 }} className="mt-16">
        <h2 className="font-serif text-2xl font-light text-primary">Handling and storage</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {MIXING_NOTES.map((note) => (
            <div key={note.title} className="border-t border-border/60 pt-5">
              <h3 className="text-xs uppercase tracking-widest text-foreground/70">{note.title}</h3>
              <p className="mt-3 text-sm font-light leading-[1.85] text-primary/55">{note.body}</p>
            </div>
          ))}
        </div>
      </m.div>

      <m.div {...reveal} transition={{ duration: 0.7 }} className="mt-20 max-w-3xl">
        <h2 className="font-serif text-2xl font-light text-primary">Common questions</h2>
        <div className="mt-6">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border-b border-border/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-xs uppercase tracking-widest text-foreground/70 transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden
                  className="shrink-0 text-primary/35 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="pb-6 text-sm font-light leading-[1.85] text-primary/55">{faq.a}</p>
            </details>
          ))}
        </div>
      </m.div>

      <div className="mt-16 border-t border-border/60 pt-8">
        <p className="max-w-3xl text-xs font-light leading-[1.85] text-primary/40">
          Research use only. These calculations are for information and education. The compounds
          discussed are research chemicals and are not approved for human consumption. Nothing here
          is medical advice, so please speak to a qualified professional before use. Always check
          the numbers against your own pen, cartridge, syringe and vial before relying on them.
        </p>
      </div>
    </>
  );
}
