import type { Metadata } from "next";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Laboratory Dilution & Reconstitution Calculator",
  description:
    "Calculate the diluent volume required to reach a target working concentration for in vitro assays and laboratory research.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
