export type ConcentrationUnit = "mg/mL" | "mcg/mL";

export interface DilutionInput {
  // Total reagent mass in the vial (mg).
  vialMassMg: number;
  // Target working concentration magnitude.
  targetConcentration: number;
  // Unit of the target working concentration.
  concentrationUnit: ConcentrationUnit;
}

export interface DilutionResult {
  // Required diluent volume in millilitres (mL).
  diluentVolumeMl: number;
  // Target working concentration expressed in mg/mL.
  targetConcentrationMgMl: number;
}

// Convert a concentration expressed in the given unit to mg/mL.
export function toMilligramsPerMillilitre(value: number, unit: ConcentrationUnit): number {
  return unit === "mcg/mL" ? value / 1000 : value;
}

// Required diluent volume (mL) = vial mass (mg) / target concentration (mg/mL).
export function calculateDiluentVolume(input: DilutionInput): DilutionResult {
  const targetConcentrationMgMl = toMilligramsPerMillilitre(
    input.targetConcentration,
    input.concentrationUnit,
  );
  const diluentVolumeMl = input.vialMassMg / targetConcentrationMgMl;
  return { diluentVolumeMl, targetConcentrationMgMl };
}

function formatNumber(value: number): string {
  return Number(value.toFixed(2)).toString();
}

// Format a volume in millilitres, switching to microlitres when below 0.1 mL.
export function formatVolume(volumeMl: number): string {
  if (volumeMl > 0 && volumeMl < 0.1) {
    return `${formatNumber(volumeMl * 1000)} μL`;
  }
  return `${formatNumber(volumeMl)} mL`;
}
