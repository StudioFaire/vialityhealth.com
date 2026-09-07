import { describe, expect, it } from "vitest";
import { calculateReconstitutionVolume, toMicrograms } from "./calculator";

describe("toMicrograms", () => {
  it("keeps micrograms unchanged", () => {
    expect(toMicrograms(500, "mcg")).toBe(500);
  });

  it("converts milligrams to micrograms", () => {
    expect(toMicrograms(1.5, "mg")).toBe(1500);
  });
});

describe("calculateReconstitutionVolume", () => {
  it("recommends 0.5 mL when the ratio is below 5", () => {
    const result = calculateReconstitutionVolume({ peptideMg: 5, dosage: 2000, unit: "mcg" });
    expect(result.bacWaterMl).toBe(0.5);
  });

  it("recommends 1 mL when the ratio is between 5 and 10", () => {
    const result = calculateReconstitutionVolume({ peptideMg: 5, dosage: 1000, unit: "mcg" });
    expect(result.bacWaterMl).toBe(1);
  });

  it("recommends 1 mL at exactly the upper boundary", () => {
    const result = calculateReconstitutionVolume({ peptideMg: 10, dosage: 1, unit: "mg" });
    expect(result.bacWaterMl).toBe(1);
  });

  it("recommends 2 mL when the ratio exceeds 10", () => {
    const result = calculateReconstitutionVolume({ peptideMg: 5, dosage: 250, unit: "mcg" });
    expect(result.bacWaterMl).toBe(2);
  });

  it("treats mcg and mg inputs equivalently", () => {
    const inMcg = calculateReconstitutionVolume({ peptideMg: 5, dosage: 500, unit: "mcg" });
    const inMg = calculateReconstitutionVolume({ peptideMg: 5, dosage: 0.5, unit: "mg" });
    expect(inMg.ratio).toBe(inMcg.ratio);
    expect(inMg.bacWaterMl).toBe(inMcg.bacWaterMl);
  });
});
