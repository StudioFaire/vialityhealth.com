import type { DeliveryMode, DoseUnit } from "@/lib/calculator";

export const VIAL_OPTIONS = [2, 5, 10, 15, 20, 30, 40, 60];
export const WATER_OPTIONS: Record<DeliveryMode, number[]> = {
  syringe: [0.5, 1, 2, 3, 5],
  pen: [1, 1.5, 2, 3],
};
export const DOSE_OPTIONS: Record<DoseUnit, number[]> = {
  mcg: [100, 200, 250, 300, 500, 1000],
  mg: [0.25, 0.5, 1, 2.5, 5, 10],
};
export const FREQUENCY_OPTIONS = [
  { label: "No schedule", value: 0 },
  { label: "Weekly", value: 1 },
  { label: "2 a week", value: 2 },
  { label: "3 a week", value: 3 },
  { label: "5 a week", value: 5 },
  { label: "Daily", value: 7 },
];
export const NUMBER_PATTERN = /^\d{0,6}(\.\d{0,4})?$/;

export type PenAmounts = {
  unitsPerClick: string;
  maxClicks: string;
  cartridgeMl: string;
  primeClicks: string;
};

export const PEN_FIELDS = [
  {
    key: "unitsPerClick" as const,
    label: "Units per click",
    suffix: "units",
    hint: "Usually 1. Check your pen.",
  },
  {
    key: "maxClicks" as const,
    label: "Maximum clicks",
    suffix: "clicks",
    hint: "The biggest dial on your pen.",
  },
  {
    key: "cartridgeMl" as const,
    label: "Cartridge volume",
    suffix: "mL",
    hint: "Usually 3 mL.",
  },
  {
    key: "primeClicks" as const,
    label: "Priming clicks",
    suffix: "clicks",
    hint: "Used when a new cartridge is primed.",
  },
];
