import { describe, expect, it } from "vitest";
import { calculateDiluentVolume, formatVolume, toMilligramsPerMillilitre } from "./calculator";

describe("toMilligramsPerMillilitre", () => {
  it("keeps mg/mL unchanged", () => {
    expect(toMilligramsPerMillilitre(2, "mg/mL")).toBe(2);
  });

  it("converts mcg/mL to mg/mL", () => {
    expect(toMilligramsPerMillilitre(500, "mcg/mL")).toBe(0.5);
  });
});

describe("calculateDiluentVolume", () => {
  it("calculates the required diluent volume", () => {
    const result = calculateDiluentVolume({
      vialMassMg: 5,
      targetConcentration: 2,
      concentrationUnit: "mg/mL",
    });
    expect(result.diluentVolumeMl).toBe(2.5);
  });

  it("handles mcg/mL target concentrations", () => {
    const result = calculateDiluentVolume({
      vialMassMg: 5,
      targetConcentration: 1000,
      concentrationUnit: "mcg/mL",
    });
    expect(result.diluentVolumeMl).toBe(5);
  });

  it("expresses the target concentration in mg/mL", () => {
    const result = calculateDiluentVolume({
      vialMassMg: 10,
      targetConcentration: 500,
      concentrationUnit: "mcg/mL",
    });
    expect(result.targetConcentrationMgMl).toBe(0.5);
  });
});

describe("formatVolume", () => {
  it("formats millilitres", () => {
    expect(formatVolume(2.5)).toBe("2.5 mL");
  });

  it("converts small volumes to microlitres", () => {
    expect(formatVolume(0.05)).toBe("50 μL");
  });
});
