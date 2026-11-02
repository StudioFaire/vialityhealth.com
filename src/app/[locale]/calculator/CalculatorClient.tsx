"use client";

import { useState, type ChangeEvent } from "react";
import { ChevronDown, PenLine, SlidersHorizontal, Syringe } from "lucide-react";
import { m } from "motion/react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import {
  calculateDose,
  calculateDoseTable,
  formatNumber,
  type DeliveryMode,
  type DoseUnit,
} from "@/lib/calculator";
import { CalculatorInfo } from "./CalculatorInfo";
import { CalculatorResult } from "./CalculatorResult";
import { DoseReferenceTable } from "./DoseReferenceTable";
import {
  DOSE_OPTIONS,
  FREQUENCY_OPTIONS,
  NUMBER_PATTERN,
  PEN_FIELDS,
  VIAL_OPTIONS,
  WATER_OPTIONS,
  type PenAmounts,
} from "./calculator-options";

function formatInput(value: number): string {
  return String(Number.parseFloat(value.toPrecision(10)));
}

function isPositive(value: string): boolean {
  return Number.parseFloat(value) > 0;
}

function numericChangeHandler(setter: (value: string) => void) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (next === "" || NUMBER_PATTERN.test(next)) setter(next);
  };
}

export function CalculatorClient() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [mode, setMode] = useState<DeliveryMode>("syringe");
  const [vialAmount, setVialAmount] = useState("5");
  const [waterAmount, setWaterAmount] = useState("1");
  const [dose, setDose] = useState("250");
  const [doseUnit, setDoseUnit] = useState<DoseUnit>("mcg");
  const [perWeek, setPerWeek] = useState(0);
  const [penOpen, setPenOpen] = useState(false);
  const [penAmounts, setPenAmounts] = useState<PenAmounts>({
    unitsPerClick: "1",
    maxClicks: "60",
    cartridgeMl: "3",
    primeClicks: "0",
  });

  const pen = {
    unitsPerClick: Number.parseFloat(penAmounts.unitsPerClick),
    maxClicks: Number.parseFloat(penAmounts.maxClicks),
    cartridgeMl: Number.parseFloat(penAmounts.cartridgeMl),
    primeClicks: Number.parseFloat(penAmounts.primeClicks),
  };

  const result = acknowledged
    ? calculateDose({
        mode,
        vialMg: Number.parseFloat(vialAmount),
        waterMl: Number.parseFloat(waterAmount),
        dose: Number.parseFloat(dose),
        doseUnit,
        pen,
        perWeek,
      })
    : null;

  const hasInvalidEntry =
    (vialAmount !== "" && !isPositive(vialAmount)) ||
    (waterAmount !== "" && !isPositive(waterAmount)) ||
    (dose !== "" && !isPositive(dose));

  const tableRows = calculateDoseTable(
    Number.parseFloat(vialAmount),
    Number.parseFloat(waterAmount),
    pen.unitsPerClick,
    doseUnit,
  );

  const changeMode = (nextMode: DeliveryMode) => {
    setMode(nextMode);
    if (nextMode === "pen" && !WATER_OPTIONS.pen.includes(Number.parseFloat(waterAmount))) {
      setWaterAmount("3");
    }
  };

  const changeDoseUnit = (nextUnit: DoseUnit) => {
    if (nextUnit === doseUnit) return;
    const value = Number.parseFloat(dose);
    if (Number.isFinite(value) && value > 0) {
      setDose(formatInput(nextUnit === "mg" ? value / 1000 : value * 1000));
    }
    setDoseUnit(nextUnit);
  };

  const setPenAmount = (key: keyof PenAmounts) => (value: string) => {
    setPenAmounts((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="bg-background px-6 py-20 md:px-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <p className="mb-8 text-xs uppercase tracking-widest text-primary/40">Research tools</p>
          <h1 className="mb-8 font-serif text-3xl font-light uppercase leading-snug text-primary md:text-5xl">
            Peptide Calculator
          </h1>
          <p className="max-w-2xl text-sm font-light leading-[1.85] text-primary/60">
            Work out how much to draw on a U-100 insulin syringe, or how many clicks to dial on a
            peptide pen. Enter your vial in mg, the bacteriostatic water you add and your dose in mg
            or mcg. The calculator converts the mix to syringe units or pen clicks and tells you
            plainly when a dose will not fit.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-12 rounded-[2rem] border border-border/60 bg-card p-6 md:p-10"
        >
          <div className="rounded-2xl border border-border/60 bg-surface-section/60 px-5 py-5 md:px-6 md:py-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/70">
              Research use confirmation
            </p>
            <p
              id="calculator-confirmation"
              className="mt-3 text-xs font-light leading-[1.85] text-primary/60"
            >
              This calculation tool is designed exclusively as an analytical reference for qualified
              researchers, laboratory personnel, and institutional facilities preparing compounds
              for non-clinical testing. It is not intended for clinical dosing, therapeutic
              preparation, or human consumption.
            </p>
            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
                aria-describedby="calculator-confirmation"
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
              />
              <span className="text-xs font-light leading-relaxed text-primary/70">
                I confirm I am operating within an academic, industrial, or institutional laboratory
                environment and understand this tool is for research use only.
              </span>
            </label>
          </div>
          <p className="sr-only" aria-live="polite">
            {acknowledged ? "Calculator unlocked." : "Calculator locked."}
          </p>

          <fieldset
            disabled={!acknowledged}
            className={cn(
              "m-0 min-w-0 border-0 p-0 transition-opacity duration-300",
              !acknowledged && "pointer-events-none opacity-35",
            )}
          >
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
              <div className="min-w-0">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-foreground/70">
                    How are you measuring?
                  </p>
                  <div
                    role="group"
                    aria-label="Delivery method"
                    className="grid grid-cols-2 gap-1.5 rounded-2xl bg-surface-section p-1.5"
                  >
                    {[
                      { value: "syringe" as const, label: "Syringe", icon: Syringe },
                      { value: "pen" as const, label: "Peptide pen", icon: PenLine },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => changeMode(value)}
                        aria-pressed={mode === value}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-[10px] uppercase tracking-widest transition-colors sm:text-xs",
                          mode === value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-primary/55 hover:text-primary",
                        )}
                      >
                        <Icon size={15} strokeWidth={1.5} aria-hidden />
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-light leading-relaxed text-primary/45">
                    {mode === "syringe"
                      ? "Standard U-100 insulin syringes are marked in units, with 100 units to 1 mL."
                      : "Reusable pens hold a cartridge and dial in clicks. On most pens, one click delivers 0.01 mL."}
                  </p>
                </div>

                <div className="mt-10 border-t border-border/60 pt-10">
                  <h2 className="font-serif text-xl font-light text-primary">
                    {mode === "pen" ? "Your cartridge" : "Vial details"}
                  </h2>

                  <div className="mt-6 grid gap-8 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label
                        htmlFor="vial-amount"
                        className="mb-3 block text-xs uppercase tracking-widest text-foreground/70"
                      >
                        Peptide amount
                      </label>
                      <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
                        <InputGroupInput
                          id="vial-amount"
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          value={vialAmount}
                          onChange={numericChangeHandler(setVialAmount)}
                          placeholder="5"
                          className="text-lg text-primary placeholder:text-primary/25"
                        />
                        <InputGroupAddon className="text-xs uppercase tracking-widest">
                          mg
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {VIAL_OPTIONS.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setVialAmount(String(option))}
                            aria-pressed={vialAmount === String(option)}
                            className={cn(
                              "cursor-pointer rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                              vialAmount === String(option)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border/70 text-primary/55 hover:border-primary/35 hover:text-primary",
                            )}
                          >
                            {option} mg
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor="water-amount"
                        className="mb-3 block text-xs uppercase tracking-widest text-foreground/70"
                      >
                        {mode === "pen" ? "Liquid in the cartridge" : "Water added"}
                      </label>
                      <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
                        <InputGroupInput
                          id="water-amount"
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          value={waterAmount}
                          onChange={numericChangeHandler(setWaterAmount)}
                          placeholder="1"
                          className="text-lg text-primary placeholder:text-primary/25"
                        />
                        <InputGroupAddon className="text-xs uppercase tracking-widest">
                          mL
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {WATER_OPTIONS[mode].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setWaterAmount(String(option))}
                            aria-pressed={waterAmount === String(option)}
                            className={cn(
                              "cursor-pointer rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                              waterAmount === String(option)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border/70 text-primary/55 hover:border-primary/35 hover:text-primary",
                            )}
                          >
                            {option} mL
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-border/60 pt-10">
                  <h2 className="font-serif text-xl font-light text-primary">Your dose</h2>

                  <div className="mt-6">
                    <label
                      htmlFor="desired-dosage"
                      className="mb-3 block text-xs uppercase tracking-widest text-foreground/70"
                    >
                      Dose per injection
                    </label>
                    <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
                      <InputGroupInput
                        id="desired-dosage"
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={dose}
                        onChange={numericChangeHandler(setDose)}
                        placeholder="250"
                        className="text-lg text-primary placeholder:text-primary/25"
                      />
                      <InputGroupAddon aria-label="Dosage unit">
                        <div className="flex items-center divide-x divide-border/60">
                          {(["mcg", "mg"] as const).map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => changeDoseUnit(unit)}
                              aria-pressed={doseUnit === unit}
                              className="cursor-pointer px-2 py-0.5 text-xs uppercase tracking-widest text-primary/40 transition-colors aria-pressed:font-medium aria-pressed:text-primary hover:text-primary/70"
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      </InputGroupAddon>
                    </InputGroup>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {DOSE_OPTIONS[doseUnit].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDose(formatInput(option))}
                          aria-pressed={Number.parseFloat(dose) === option}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                            Number.parseFloat(dose) === option
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border/70 text-primary/55 hover:border-primary/35 hover:text-primary",
                          )}
                        >
                          {formatNumber(option, 3)} {doseUnit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <label
                        htmlFor="frequency"
                        className="mb-1 block text-xs uppercase tracking-widest text-foreground/70"
                      >
                        Injection schedule
                      </label>
                      <p className="text-xs font-light text-primary/45">
                        Optional. Pick a schedule to see how long one mix lasts.
                      </p>
                    </div>
                    <div className="relative min-w-40">
                      <select
                        id="frequency"
                        value={perWeek}
                        onChange={(event) => setPerWeek(Number(event.target.value))}
                        className="min-h-11 w-full cursor-pointer appearance-none rounded-full border border-border/70 bg-background py-2 pl-4 pr-10 text-xs uppercase tracking-widest text-primary outline-none transition-colors focus:border-primary"
                      >
                        {FREQUENCY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        strokeWidth={1.5}
                        aria-hidden
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary/45"
                      />
                    </div>
                  </div>
                </div>

                {mode === "pen" && (
                  <div className="mt-8 border-t border-border/60 pt-8">
                    <button
                      type="button"
                      onClick={() => setPenOpen((open) => !open)}
                      aria-expanded={penOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                    >
                      <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/70">
                        <SlidersHorizontal size={14} strokeWidth={1.5} aria-hidden />
                        Pen settings
                      </span>
                      <ChevronDown
                        size={15}
                        strokeWidth={1.5}
                        aria-hidden
                        className={cn(
                          "text-primary/35 transition-transform duration-300",
                          penOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
                        penOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="grid gap-6 pt-6 sm:grid-cols-2">
                          {PEN_FIELDS.map((field) => (
                            <div key={field.key}>
                              <label
                                htmlFor={`pen-${field.key}`}
                                className="mb-2 block text-xs uppercase tracking-widest text-foreground/70"
                              >
                                {field.label}
                              </label>
                              <InputGroup className="border-b border-border/60 transition-colors focus-within:border-primary">
                                <InputGroupInput
                                  id={`pen-${field.key}`}
                                  type="text"
                                  inputMode="decimal"
                                  autoComplete="off"
                                  value={penAmounts[field.key]}
                                  onChange={numericChangeHandler(setPenAmount(field.key))}
                                  className="text-primary placeholder:text-primary/25"
                                />
                                <InputGroupAddon className="text-[10px] uppercase tracking-widest">
                                  {field.suffix}
                                </InputGroupAddon>
                              </InputGroup>
                              <p className="mt-1.5 text-[11px] font-light text-primary/40">
                                {field.hint}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {hasInvalidEntry && (
                  <p className="mt-8 text-sm text-destructive" role="alert">
                    Please enter a positive number for the vial, water and dose.
                  </p>
                )}
              </div>

              <CalculatorResult
                result={result}
                locked={!acknowledged}
                doseUnit={doseUnit}
                onUseSuggestion={(water) => setWaterAmount(formatInput(water))}
              />
            </div>
          </fieldset>
        </m.div>

        {result && tableRows.length > 0 && (
          <DoseReferenceTable
            rows={tableRows}
            mode={mode}
            doseUnit={doseUnit}
            currentDoseMcg={result.doseMcg}
            maxClicks={result.maxClicks}
            vialMg={Number.parseFloat(vialAmount)}
            waterMl={Number.parseFloat(waterAmount)}
          />
        )}

        <CalculatorInfo />
      </div>
    </section>
  );
}
