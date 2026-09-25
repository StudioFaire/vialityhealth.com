"use client";

import { useState } from "react";
import { m } from "motion/react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { calculateDiluentVolume, formatVolume, type ConcentrationUnit } from "@/lib/calculator";

export function CalculatorClient() {
  const [vialMass, setVialMass] = useState("");
  const [targetConcentration, setTargetConcentration] = useState("");
  const [concentrationUnit, setConcentrationUnit] = useState<ConcentrationUnit>("mg/mL");

  const vialMassMg = Number.parseFloat(vialMass);
  const target = Number.parseFloat(targetConcentration);
  const isValid =
    !Number.isNaN(vialMassMg) && !Number.isNaN(target) && vialMassMg > 0 && target > 0;
  const diluentVolumeMl = isValid
    ? calculateDiluentVolume({ vialMassMg, targetConcentration: target, concentrationUnit })
        .diluentVolumeMl
    : null;

  // Only flag a field that has been given a value which is not a positive number.
  // A field that is still empty is considered "not yet entered", not an error.
  const hasInvalidEntry =
    (vialMass !== "" && !(Number.parseFloat(vialMass) > 0)) ||
    (targetConcentration !== "" && !(Number.parseFloat(targetConcentration) > 0));

  return (
    <section className="bg-background py-28 md:py-36 px-6 md:px-16">
      <div className="mx-auto max-w-2xl">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-xs uppercase tracking-widest text-primary/40 mb-8">
            Laboratory Reagent Preparation
          </p>
          <h1 className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-8 leading-snug">
            Laboratory Dilution &amp; Reconstitution Calculator
          </h1>
          <p className="text-primary/60 text-sm leading-[1.85] font-light mb-8">
            Calculate the diluent volume required to reach a target working concentration for in
            vitro assays and laboratory research.
          </p>
        </m.div>

        <p className="text-xs text-primary/55 font-light leading-[1.85] mb-10">
          This calculation tool is designed exclusively as an analytical reference for qualified
          researchers, laboratory personnel, and institutional facilities preparing compounds for
          non-clinical testing. It is not intended for clinical dosing, therapeutic preparation, or
          human consumption.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="vial-mass"
              className="text-xs uppercase tracking-widest text-foreground/70 block mb-3"
            >
              Vial Mass
            </label>
            <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
              <InputGroupInput
                id="vial-mass"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={vialMass}
                onChange={(e) => setVialMass(e.target.value)}
                placeholder="0.00"
              />
              <InputGroupAddon>mg</InputGroupAddon>
            </InputGroup>
          </div>

          <div>
            <label
              htmlFor="target-concentration"
              className="text-xs uppercase tracking-widest text-foreground/70 block mb-3"
            >
              Target Working Concentration
            </label>
            <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
              <InputGroupInput
                id="target-concentration"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={targetConcentration}
                onChange={(e) => setTargetConcentration(e.target.value)}
                placeholder="0.00"
              />
              <InputGroupAddon aria-label="Concentration unit">
                <div className="flex items-center divide-x divide-border/60">
                  <button
                    type="button"
                    onClick={() => setConcentrationUnit("mg/mL")}
                    aria-pressed={concentrationUnit === "mg/mL"}
                    className="px-1.5 py-0.5 text-xs uppercase tracking-widest transition-colors cursor-pointer aria-pressed:text-primary aria-pressed:font-medium text-primary/40 hover:text-primary/70"
                  >
                    mg/mL
                  </button>
                  <button
                    type="button"
                    onClick={() => setConcentrationUnit("mcg/mL")}
                    aria-pressed={concentrationUnit === "mcg/mL"}
                    className="px-1.5 py-0.5 text-xs uppercase tracking-widest transition-colors cursor-pointer aria-pressed:text-primary aria-pressed:font-medium text-primary/40 hover:text-primary/70"
                  >
                    mcg/mL
                  </button>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <output htmlFor="vial-mass target-concentration" aria-live="polite" className="block pt-10">
          {hasInvalidEntry && (
            <p className="text-sm text-red-600">Please enter a valid amount for every field.</p>
          )}
          {isValid && diluentVolumeMl !== null && (
            <div className="bg-surface-section rounded-3xl p-8 md:p-10 space-y-3">
              <p className="text-sm text-primary/60 font-light leading-relaxed">
                To reach a target working concentration of{" "}
                <b className="text-primary">
                  {targetConcentration} {concentrationUnit}
                </b>{" "}
                from a <b className="text-primary">{vialMass} mg</b> vial:
              </p>
              <p className="font-serif text-xl text-primary">
                Required diluent volume: <b>{formatVolume(diluentVolumeMl)}</b>
              </p>
            </div>
          )}
        </output>
      </div>
    </section>
  );
}
