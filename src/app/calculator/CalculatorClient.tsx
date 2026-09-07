"use client";

import { useState, type FormEvent } from "react";
import { m } from "motion/react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  calculateReconstitutionVolume,
  type DosageUnit,
  type ReconstitutionResult,
} from "@/lib/calculator";

export function CalculatorClient() {
  const [peptideAmount, setPeptideAmount] = useState("");
  const [desiredDosage, setDesiredDosage] = useState("");
  const [dosageUnit, setDosageUnit] = useState<DosageUnit>("mcg");
  const [result, setResult] = useState<ReconstitutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const peptideMg = Number.parseFloat(peptideAmount);
    const dosage = Number.parseFloat(desiredDosage);

    if (Number.isNaN(peptideMg) || Number.isNaN(dosage) || peptideMg <= 0 || dosage <= 0) {
      setResult(null);
      setError("Please enter a valid amount for every field.");
      return;
    }

    setError(null);
    setResult(calculateReconstitutionVolume({ peptideMg, dosage, unit: dosageUnit }));
  }

  return (
    <section className="bg-background py-28 md:py-36 px-6 md:px-16">
      <div className="mx-auto max-w-2xl">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-xs uppercase tracking-widest text-primary/40 mb-8">Reconstitution</p>
          <h1 className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-8 leading-snug">
            Reconstitution Calculator
          </h1>
          <p className="text-primary/60 text-sm leading-[1.85] font-light mb-12">
            Enter the details below to estimate how much bacteriostatic water is needed to
            reconstitute the research material in your vial.
          </p>
        </m.div>

        <form onSubmit={handleCalculate} className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="peptide-amount"
                className="text-xs uppercase tracking-widest text-foreground/70 block mb-3"
              >
                Peptide in Vial
              </label>
              <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
                <InputGroupInput
                  id="peptide-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={peptideAmount}
                  onChange={(e) => setPeptideAmount(e.target.value)}
                  placeholder="0.00"
                />
                <InputGroupAddon>mg</InputGroupAddon>
              </InputGroup>
            </div>

            <div>
              <label
                htmlFor="desired-dosage"
                className="text-xs uppercase tracking-widest text-foreground/70 block mb-3"
              >
                Desired Dosage
              </label>
              <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
                <InputGroupInput
                  id="desired-dosage"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={desiredDosage}
                  onChange={(e) => setDesiredDosage(e.target.value)}
                  placeholder="0.00"
                />
                <InputGroupAddon aria-label="Dosage unit">
                  <div className="flex items-center divide-x divide-border/60">
                    <button
                      type="button"
                      onClick={() => setDosageUnit("mcg")}
                      aria-pressed={dosageUnit === "mcg"}
                      className="px-1.5 py-0.5 text-xs uppercase tracking-widest transition-colors cursor-pointer aria-pressed:text-primary aria-pressed:font-medium text-primary/40 hover:text-primary/70"
                    >
                      mcg
                    </button>
                    <button
                      type="button"
                      onClick={() => setDosageUnit("mg")}
                      aria-pressed={dosageUnit === "mg"}
                      className="px-1.5 py-0.5 text-xs uppercase tracking-widest transition-colors cursor-pointer aria-pressed:text-primary aria-pressed:font-medium text-primary/40 hover:text-primary/70"
                    >
                      mg
                    </button>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary/90 transition-colors"
          >
            Calculate
          </button>
        </form>

        <div className="pt-10" aria-live="polite">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {result && (
            <div className="bg-surface-section rounded-3xl p-8 md:p-10 space-y-3">
              <p className="text-sm text-primary/60 font-light leading-relaxed">
                For a vial of <b className="text-primary">{peptideAmount}mg</b> with a desired
                dosage of{" "}
                <b className="text-primary">
                  {desiredDosage} {dosageUnit}
                </b>
              </p>
              <p className="font-serif text-xl text-primary">
                Add <b>{result.bacWaterMl} mL</b> of bacteriostatic water to the vial.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
