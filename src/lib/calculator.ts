export type DosageUnit = "mcg" | "mg";

export interface ReconstitutionInput {
  // Amount of peptide in the vial (mg).
  peptideMg: number;
  // Desired dose magnitude.
  dosage: number;
  // Unit of the desired dose.
  unit: DosageUnit;
}

export interface ReconstitutionResult {
  // Recommended bacteriostatic water volume in mL.
  bacWaterMl: number;
  // Peptide-to-dose ratio used to make the recommendation.
  ratio: number;
}

const BAC_WATER_LOW_Ml = 0.5;
const BAC_WATER_MID_Ml = 1;
const BAC_WATER_HIGH_Ml = 2;

// Total peptide content in micrograms.
export function toMicrograms(amount: number, unit: DosageUnit): number {
  return unit === "mcg" ? amount : amount * 1000;
}

// Recommend a reconstitution volume based on the ratio of vial peptide
// content to desired dose. Higher ratios (many doses per vial) warrant more
// water so each dose remains a measurable, accurate draw.
export function calculateReconstitutionVolume(input: ReconstitutionInput): ReconstitutionResult {
  const peptideMcg = input.peptideMg * 1000;
  const dosageMcg = toMicrograms(input.dosage, input.unit);
  const ratio = peptideMcg / dosageMcg;

  if (ratio < 5) {
    return { bacWaterMl: BAC_WATER_LOW_Ml, ratio };
  }
  if (ratio <= 10) {
    return { bacWaterMl: BAC_WATER_MID_Ml, ratio };
  }
  return { bacWaterMl: BAC_WATER_HIGH_Ml, ratio };
}
