import { describe, expect, it } from "vitest";
import {
  calculateDose,
  calculateDoseTable,
  formatDose,
  formatStrength,
  toMicrograms,
} from "./calculator";

describe("toMicrograms", () => {
  it("keeps micrograms unchanged", () => {
    expect(toMicrograms(500, "mcg")).toBe(500);
  });

  it("converts milligrams to micrograms", () => {
    expect(toMicrograms(1.5, "mg")).toBe(1500);
  });
});

describe("calculateDose", () => {
  it("returns null until every core value is positive", () => {
    expect(
      calculateDose({ mode: "syringe", vialMg: 0, waterMl: 1, dose: 250, doseUnit: "mcg" }),
    ).toBeNull();
    expect(
      calculateDose({ mode: "syringe", vialMg: 5, waterMl: 0, dose: 250, doseUnit: "mcg" }),
    ).toBeNull();
    expect(
      calculateDose({ mode: "syringe", vialMg: 5, waterMl: 1, dose: 0, doseUnit: "mcg" }),
    ).toBeNull();
  });

  it("works out 5 mg in 1 mL at 250 mcg per dose", () => {
    const result = calculateDose({
      mode: "syringe",
      vialMg: 5,
      waterMl: 1,
      dose: 250,
      doseUnit: "mcg",
    });

    expect(result).not.toBeNull();
    expect(result?.concentrationMcgPerMl).toBe(5000);
    expect(result?.unitsExact).toBe(5);
    expect(result?.unitsRounded).toBe(5);
    expect(result?.clicks).toBe(5);
    expect(result?.dosesPerVial).toBe(20);
  });

  it("treats mcg and mg doses equivalently", () => {
    const inMcg = calculateDose({
      mode: "syringe",
      vialMg: 5,
      waterMl: 2,
      dose: 500,
      doseUnit: "mcg",
    });
    const inMg = calculateDose({
      mode: "syringe",
      vialMg: 5,
      waterMl: 2,
      dose: 0.5,
      doseUnit: "mg",
    });

    expect(inMg?.unitsExact).toBe(inMcg?.unitsExact);
    expect(inMg?.dosesPerVial).toBe(inMcg?.dosesPerVial);
  });

  it("draws 10 units for 5 mg in 2 mL at 250 mcg", () => {
    const result = calculateDose({
      mode: "syringe",
      vialMg: 5,
      waterMl: 2,
      dose: 250,
      doseUnit: "mcg",
    });

    expect(result?.unitsRounded).toBe(10);
    expect(result?.dosesPerVial).toBe(20);
  });

  it("rounds pen doses to whole clicks and reports the drift", () => {
    const result = calculateDose({
      mode: "pen",
      vialMg: 40,
      waterMl: 3,
      dose: 2.5,
      doseUnit: "mg",
    });

    expect(result?.clicksExact).toBeCloseTo(18.75);
    expect(result?.clicks).toBe(19);
    expect(result?.actualMcg).toBeCloseTo(2533.33, 1);
    expect(result?.driftPct).toBeCloseTo(1.33, 1);
    expect(result?.dosesPerCartridge).toBe(15);
    expect(result?.suggestion?.waterMl).toBe(2.88);
    expect(result?.suggestion?.clicks).toBe(18);
  });

  it("flags a dose that is smaller than one click", () => {
    const result = calculateDose({
      mode: "pen",
      vialMg: 5,
      waterMl: 1,
      dose: 10,
      doseUnit: "mcg",
    });

    expect(result?.clicks).toBe(0);
    expect(result?.tooSmall).toBe(true);
  });

  it("flags a pen dose that is over the dial limit", () => {
    const result = calculateDose({
      mode: "pen",
      vialMg: 10,
      waterMl: 3,
      dose: 2.5,
      doseUnit: "mg",
    });

    expect(result?.clicks).toBe(75);
    expect(result?.overMax).toBe(true);
    expect(result?.waterForMaxClicks).toBeCloseTo(2.4);
    expect(result?.suggestion?.waterMl).toBe(2.4);
    expect(result?.suggestion?.clicks).toBe(60);
  });

  it("flags a syringe draw over 1 mL", () => {
    const result = calculateDose({
      mode: "syringe",
      vialMg: 5,
      waterMl: 60,
      dose: 100,
      doseUnit: "mcg",
    });

    expect(result?.unitsExact).toBeCloseTo(120);
    expect(result?.overSyringe).toBe(true);
  });

  it("flags water that will not fit in the cartridge", () => {
    const result = calculateDose({
      mode: "pen",
      vialMg: 5,
      waterMl: 5,
      dose: 250,
      doseUnit: "mcg",
    });

    expect(result?.overfill).toBe(true);
    expect(result?.cartridgeShare).toBeCloseTo(0.6);

    const syringe = calculateDose({
      mode: "syringe",
      vialMg: 5,
      waterMl: 5,
      dose: 250,
      doseUnit: "mcg",
    });
    expect(syringe?.overfill).toBe(false);
  });

  it("estimates how long a mix lasts at a chosen frequency", () => {
    const result = calculateDose({
      mode: "syringe",
      vialMg: 5,
      waterMl: 1,
      dose: 250,
      doseUnit: "mcg",
      perWeek: 1,
    });

    expect(result?.daysToFinish).toBe(133);
    expect(result?.outlastsWindow).toBe(true);
  });

  it("honours custom pen settings", () => {
    const result = calculateDose({
      mode: "pen",
      vialMg: 5,
      waterMl: 2,
      dose: 250,
      doseUnit: "mcg",
      pen: { unitsPerClick: 2, maxClicks: 30, cartridgeMl: 3, primeClicks: 2 },
    });

    expect(result?.clicks).toBe(5);
    expect(result?.dialUnits).toBe(10);
    expect(result?.mcgPerClick).toBeCloseTo(50);
  });
});

describe("calculateDoseTable", () => {
  it("lists common doses for 5 mg mixed in 1 mL", () => {
    const rows = calculateDoseTable(5, 1, 1, "mcg");

    expect(rows.map((row) => row.unitsExact)).toEqual([1, 2, 3, 4, 5, 6, 8, 10, 15, 20]);
    expect(rows[4]).toMatchObject({ dose: 250, clicks: 5, deliveredMcg: 250 });
  });

  it("returns no rows without a valid mix", () => {
    expect(calculateDoseTable(0, 1, 1, "mcg")).toEqual([]);
  });
});

describe("display helpers", () => {
  it("formats strength in the most readable unit", () => {
    expect(formatStrength(5000)).toEqual({ value: "5,000", unit: "mcg/mL" });
    expect(formatStrength(20000)).toEqual({ value: "20", unit: "mg/mL" });
  });

  it("formats a delivered dose in the selected unit", () => {
    expect(formatDose(250, "mcg")).toBe("250 mcg");
    expect(formatDose(2500, "mg")).toBe("2.5 mg");
  });
});
