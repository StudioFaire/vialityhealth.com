import type { Metadata } from "next";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Reconstitution Calculator",
  description:
    "Estimate how much bacteriostatic water is needed to reconstitute the research material in your vial.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
