import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "Our Philosophy",
  description:
    "Learn about Viality — our philosophy, our standards, and our commitment to precision, purity, and ritual in research grade peptides.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
