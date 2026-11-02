import type { Metadata } from "next";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Peptide Calculator",
  description:
    "Convert a peptide vial and bacteriostatic water mix into syringe units or peptide pen clicks, with dose and vial duration reference tables.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
