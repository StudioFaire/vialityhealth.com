export type DeliveryMode = "syringe" | "pen";
export type DoseUnit = "mcg" | "mg";

export interface PenSettings {
  // Units (0.01 mL) delivered per click.
  unitsPerClick: number;
  // Maximum number of clicks the pen will dial in one injection.
  maxClicks: number;
  // Volume of the cartridge in mL.
  cartridgeMl: number;
  // Clicks used to prime a new cartridge.
  primeClicks: number;
}

export interface DoseCalculationInput {
  mode: DeliveryMode;
  // Amount of peptide in the vial or cartridge (mg).
  vialMg: number;
  // Volume of liquid in the vial or cartridge (mL).
  waterMl: number;
  // Dose per injection.
  dose: number;
  doseUnit: DoseUnit;
  pen?: Partial<PenSettings>;
  // Optional injections per week, used to estimate how long a mix lasts.
  perWeek?: number;
}

export interface DoseSuggestion {
  // A water volume that lands closer to a whole click.
  waterMl: number;
  clicks: number;
  driftPct: number;
}

export interface DoseCalculation {
  mode: DeliveryMode;
  doseMcg: number;
  // Volume of liquid used for the mix, echoed for display.
  waterMl: number;
  // Effective pen settings used for the calculation.
  unitsPerClick: number;
  maxClicks: number;
  cartridgeMl: number;
  primeClicks: number;
  // Strength of the mixed solution.
  concentrationMcgPerMl: number;
  // Exact draw on a U-100 syringe.
  unitsExact: number;
  // Draw rounded to one decimal place for display.
  unitsRounded: number;
  // Exact pen value before rounding to whole clicks.
  clicksExact: number;
  clicks: number;
  // Units shown on the pen dial (clicks multiplied by units per click).
  dialUnits: number;
  // What the rounded pen dose actually delivers.
  actualMcg: number;
  driftMcg: number;
  driftPct: number;
  dosesPerVial: number;
  clicksInCartridge: number;
  dosesPerCartridge: number;
  mcgPerClick: number;
  tooSmall: boolean;
  overMax: boolean;
  overSyringe: boolean;
  overfill: boolean;
  cartridgeShare: number;
  daysToFinish: number | null;
  outlastsWindow: boolean;
  waterForMaxClicks: number;
  waterForFullSyringe: number;
  suggestion: DoseSuggestion | null;
}

export interface DoseTableRow {
  dose: number;
  doseMcg: number;
  unitsExact: number;
  clicks: number;
  deliveredMcg: number;
}

export const DEFAULT_PEN_SETTINGS: PenSettings = {
  unitsPerClick: 1,
  maxClicks: 60,
  cartridgeMl: 3,
  primeClicks: 0,
};

// Number of days a reconstituted mix is typically considered usable.
export const MIXED_VIAL_LIFE_DAYS = 30;

export const COMMON_DOSES: Record<DoseUnit, number[]> = {
  mcg: [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000],
  mg: [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10, 12],
};

// Total peptide content in micrograms.
export function toMicrograms(amount: number, unit: DoseUnit): number {
  return unit === "mcg" ? amount : amount * 1000;
}

function clamp(value: number | undefined, min: number, max: number, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function resolvePenSettings(pen: Partial<PenSettings> | undefined): PenSettings {
  return {
    unitsPerClick: clamp(pen?.unitsPerClick, 0.1, 100, DEFAULT_PEN_SETTINGS.unitsPerClick),
    maxClicks: clamp(pen?.maxClicks, 1, 1000, DEFAULT_PEN_SETTINGS.maxClicks),
    cartridgeMl: clamp(pen?.cartridgeMl, 0.1, 20, DEFAULT_PEN_SETTINGS.cartridgeMl),
    primeClicks: Math.round(clamp(pen?.primeClicks, 0, 50, DEFAULT_PEN_SETTINGS.primeClicks)),
  };
}

// Work out the draw, clicks, strength and vial duration for a mixed peptide.
// Returns null until all three core values are positive numbers.
export function calculateDose(input: DoseCalculationInput): DoseCalculation | null {
  const { mode, vialMg, waterMl, doseUnit } = input;
  const doseMcg = toMicrograms(input.dose, doseUnit);

  if (!(vialMg > 0) || !(waterMl > 0) || !(doseMcg > 0)) return null;

  const penMode = mode === "pen";
  const pen = resolvePenSettings(input.pen);
  const unitsPerClick = pen.unitsPerClick;
  const maxClicks = pen.maxClicks;
  const cartridgeMl = pen.cartridgeMl;
  const primeClicks = pen.primeClicks;
  const perWeek = input.perWeek && input.perWeek > 0 ? input.perWeek : 0;

  const concentrationMcgPerMl = (1000 * vialMg) / waterMl;
  const unitsExact = (doseMcg / concentrationMcgPerMl) * 100;
  const dosesPerVial = Math.floor((1000 * vialMg) / doseMcg + 1e-9);

  const clicksExact = unitsExact / unitsPerClick;
  const clicks = Math.round(clicksExact);
  const dialUnits = clicks * unitsPerClick;
  const actualMcg = (dialUnits / 100) * concentrationMcgPerMl;
  const driftMcg = actualMcg - doseMcg;
  const driftPct = (driftMcg / doseMcg) * 100;

  const fillMl = Math.min(waterMl, cartridgeMl);
  const overfill = penMode && waterMl > cartridgeMl + 1e-9;
  const clicksInCartridge = Math.floor((100 * fillMl) / unitsPerClick + 1e-9);
  const dosesPerCartridge =
    clicks >= 1 ? Math.floor(clicksInCartridge / (clicks + primeClicks)) : 0;

  const mcgPerClick = (unitsPerClick / 100) * concentrationMcgPerMl;
  const tooSmall = penMode && clicks < 1;
  const overMax = penMode && clicks > maxClicks;
  const overSyringe = !penMode && unitsExact > 100 + 1e-9;

  const waterForMaxClicks = maxClicks * ((unitsPerClick * vialMg * 10) / doseMcg);
  const waterForFullSyringe = (1000 * vialMg) / doseMcg;

  const dosesInUse = penMode ? dosesPerCartridge : dosesPerVial;
  const daysToFinish = perWeek > 0 && dosesInUse > 0 ? ((dosesInUse - 1) * 7) / perWeek : null;

  return {
    mode,
    doseMcg,
    waterMl,
    unitsPerClick,
    maxClicks,
    cartridgeMl,
    primeClicks,
    concentrationMcgPerMl,
    unitsExact,
    unitsRounded: Math.round(unitsExact * 10) / 10,
    clicksExact,
    clicks,
    dialUnits,
    actualMcg,
    driftMcg,
    driftPct,
    dosesPerVial,
    clicksInCartridge,
    dosesPerCartridge,
    mcgPerClick,
    tooSmall,
    overMax,
    overSyringe,
    overfill,
    cartridgeShare: overfill ? cartridgeMl / waterMl : 1,
    daysToFinish,
    outlastsWindow: daysToFinish !== null && daysToFinish > MIXED_VIAL_LIFE_DAYS,
    waterForMaxClicks,
    waterForFullSyringe,
    suggestion: findSuggestion({
      vialMg,
      waterMl,
      doseMcg,
      unitsPerClick,
      maxClicks,
      cartridgeMl,
      penMode,
      waterForFullSyringe,
    }),
  };
}

// Find a nearby water volume that makes the dose land on a whole pen click.
function findSuggestion({
  vialMg,
  waterMl,
  doseMcg,
  unitsPerClick,
  maxClicks,
  cartridgeMl,
  penMode,
  waterForFullSyringe,
}: {
  vialMg: number;
  waterMl: number;
  doseMcg: number;
  unitsPerClick: number;
  maxClicks: number;
  cartridgeMl: number;
  penMode: boolean;
  waterForFullSyringe: number;
}): DoseSuggestion | null {
  // mL of liquid per whole click at this strength.
  const mlPerClick = (unitsPerClick * vialMg * 10) / doseMcg;
  if (!(mlPerClick > 0)) return null;

  const minWater = Math.max(1, Math.ceil(0.5 / mlPerClick - 1e-9));
  const maxVolume = penMode ? cartridgeMl : Math.min(5, waterForFullSyringe);
  let maxClicksThatFit = Math.floor(maxVolume / mlPerClick + 1e-9);
  if (penMode) maxClicksThatFit = Math.min(maxClicksThatFit, maxClicks);

  if (minWater > maxClicksThatFit) return null;

  const clicksForWater = (water: number) => (doseMcg * water) / (10 * vialMg) / unitsPerClick;
  const driftForWater = (water: number) => {
    const exact = clicksForWater(water);
    return ((Math.round(exact) - exact) / exact) * 100;
  };

  const nearest = Math.round(waterMl / mlPerClick);
  let candidate = Math.min(maxClicksThatFit, Math.max(minWater, nearest)) * mlPerClick;
  candidate = Math.round(candidate * 100) / 100;

  if (Math.abs(driftForWater(candidate)) > 0.3) {
    candidate = Math.round(candidate * 1000) / 1000;
  }

  if (Math.abs(candidate - waterMl) <= 0.004) return null;

  return {
    waterMl: candidate,
    clicks: Math.round(clicksForWater(candidate)),
    driftPct: driftForWater(candidate),
  };
}

// Build the dose reference rows for the current mix.
export function calculateDoseTable(
  vialMg: number,
  waterMl: number,
  unitsPerClick: number,
  doseUnit: DoseUnit,
  doses: number[] = COMMON_DOSES[doseUnit],
): DoseTableRow[] {
  if (!(vialMg > 0) || !(waterMl > 0) || !(unitsPerClick > 0)) return [];

  const concentrationMcgPerMl = (1000 * vialMg) / waterMl;

  return doses.map((dose) => {
    const doseMcg = toMicrograms(dose, doseUnit);
    const unitsExact = (doseMcg / concentrationMcgPerMl) * 100;
    const clicks = Math.round(unitsExact / unitsPerClick);

    return {
      dose,
      doseMcg,
      unitsExact,
      clicks,
      deliveredMcg: (clicks * unitsPerClick * concentrationMcgPerMl) / 100,
    };
  });
}

// Display helpers -----------------------------------------------------------

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-AU", { maximumFractionDigits }).format(value);
}

export function formatStrength(mcgPerMl: number): { value: string; unit: string } {
  if (mcgPerMl >= 10000) {
    return { value: formatNumber(mcgPerMl / 1000, 2), unit: "mg/mL" };
  }
  return { value: formatNumber(Math.round(mcgPerMl), 0), unit: "mcg/mL" };
}

export function formatDose(mcg: number, unit: DoseUnit): string {
  if (unit === "mg") return `${formatNumber(mcg / 1000, 3)} mg`;
  return `${formatNumber(mcg, 0)} mcg`;
}
