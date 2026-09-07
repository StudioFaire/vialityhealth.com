import type { Metadata } from "next";

export function generatePolicyMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
  };
}
